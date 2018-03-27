<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ page import="java.util.List,java.util.Map" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.thunisoft.artery.module.classcode.IClassCodeDbCfg" %>
<%@ page import="com.thunisoft.artery.core.dict.domain.DictField" %>
<%@ page import="com.thunisoft.artery.core.dict.DictUtil" %>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>分级代码编辑</title>
    <script type="text/javascript">
    var indexCC='<c:out value="${indexCC}"/>';
    var nodeCode='<c:out value="${nodeCode}"/>';
    <%IClassCodeDbCfg cfgClassCode=(IClassCodeDbCfg)request.getAttribute("cfgClassCode");
    List lstClassCodeFlds=(List)request.getAttribute("lstClassCodeFlds");
    Map mapNodeAttrs=(Map)request.getAttribute("mapNodeAttrs");
    //PK字段
    StringBuffer sbPKFld=new StringBuffer();
    //生成所有单值代码所需的simpleStore
    Map mapSimpleStore=(Map)request.getAttribute("mapSimpleStore");
    if(mapSimpleStore!=null&&mapSimpleStore.keySet()!=null&&mapSimpleStore.keySet().size()>0) {
	    Iterator itSplStore=mapSimpleStore.keySet().iterator();
	    while(itSplStore.hasNext()) {
	    	String sCodeType=(String)itSplStore.next();
	    	String sData=(String)mapSimpleStore.get(sCodeType);
            sCodeType=sCodeType.replaceAll("-","_");%>		
	    	var simpleStore<%=sCodeType%>=new Ext.data.SimpleStore({
	    		fields:['abbr','state'],
	    		data:<%=sData%>
	    	});
    <%
    	}
    }
    %>	
    
    var editForm = new Ext.FormPanel({
         labelWidth: 120,
         frame:true,
         title: '分级代码编辑',
         bodyStyle:'padding:5px 5px 0',
         width: 450,
         defaults: {width: 300},
         defaultType: 'textfield',
         buttons: [{
             text: '更新分级代码',
             handler: editClassCodeSubmit
         }]
    });
    
    <%//以下三个字段不允许修改
    String sCodeFld=cfgClassCode.getFldCode();		//code对应的字段名
    String sClassInfoFld=cfgClassCode.getFldClassInfo();	//classinfo对应的字段名
    String sParentCode=cfgClassCode.getFldParentCode();	//parentcode对应的字段名
    
    Iterator it=lstClassCodeFlds.iterator();
    while(it.hasNext()) {
    	DictField dtf=(DictField)it.next();
    	String sFldType=dtf.getFieldType();		//字段类型
    	String sFldName=dtf.getFieldName();		//字段名称
    	boolean bDisabled=false;
    	//以下三个字段不允许修改
    	if(sFldName.equals(sCodeFld)||sFldName.equals(sClassInfoFld)||sFldName.equals(sParentCode))
    		bDisabled=true;
    	//当该字段为主键时也不允许修改	
    	if(dtf.isPk()) {
    		if(sbPKFld.length()<1)
    			sbPKFld.append(sFldName);
    		else
    			sbPKFld.append(",").append(sFldName);	
    		bDisabled=true;
    	}
    	String sShowName=dtf.getPropMap().get(DictUtil.FIELD_EXTEND_LABEL);	//显示名称
    	boolean bEmpty= !(dtf.getPropMap().get(DictUtil.FIELD_EXTEND_REQUIRED).equals("true")?true:false);		//是否可空
    	
    	Object objValue=mapNodeAttrs.get(sFldName);
    	String sValue=(objValue==null?"":objValue.toString());
    	
    	if(sFldType.equals(DictUtil.FIELD_TYPE_NUMBER)||sFldType.equals(DictUtil.FIELD_TYPE_TEXT)) {%>
		    var fldComp=new Ext.form.TextField({
		    	id: 'edit_<%=sFldName%>',
		    	fieldLabel: '<%=sShowName%>',
		    	allowBlank: '<%=bEmpty%>',
		    	value: '<%=sValue%>',
		    	disabled: <%=bDisabled%>
		    });
		    editForm.add(fldComp);
    <%
    	}
    	if(sFldType.equals(DictUtil.FIELD_TYPE_NORMALCODE)) {		//normal code
    		//String sPropers=dtf.getTProperties();
			//int indexBegin=sPropers.indexOf("field_code_type=");
			//indexBegin=indexBegin+"field_code_type=".length();
			//int indexEnd=sPropers.indexOf("\r\n",indexBegin);
			//String sFldCodeType=sPropers.substring(indexBegin,indexEnd);
            //sFldCodeType = sFldCodeType.replaceAll("-","_");
            String sFldCodeType = dtf.getPropMap().get(DictUtil.FIELD_EXTEND_CODETYPE);
            sFldCodeType = sFldCodeType.replaceAll("-","_");
            if(!sValue.equals("1"))
            	sValue="2";
    %>
    		var editCBox=new Ext.form.ComboBox({
                  id: 'edit_<%=sFldName%>',
                  fieldLabel: '<%=sShowName%>',
                  allowBlank: '<%=bEmpty%>',
                  
                  store: simpleStore<%=sFldCodeType%>,		
                  valueField:'abbr',
                  displayField:'state',
                  typeAhead: true,
                  editable: false,
                  disabled: <%=bDisabled%>,
                  mode: 'local',
                  triggerAction: 'all',
                  value: '<%=sValue%>',
                  <%if(sFldCodeType.equals("_1")) {		//仅当代码类型为"-1"时，设置一个默认值
                  %>
                  valueNotFoundText: '否',
                  <%}%>
                  selectOnFocus:true
             });
             editForm.add(editCBox);
    <%	
    	}
    }
    %>
   	
   	// 更新分级代码事件函数
   	function editClassCodeSubmit() {
   		
   		var fldNamesString=new Ext.util.MixedCollection();
   		var map=new Map();
   		map.put("key","classCode.updateClassCode");
   	<%
   		Iterator it2=lstClassCodeFlds.iterator();
   		while(it2.hasNext()) {
   			DictField dtf=(DictField)it2.next();
	    	String sFldName=dtf.getFieldName();		//字段名称
	    	String sFldType=dtf.getFieldType();			//字段类型
	    	boolean boolIsPK=dtf.isPk();		//是否为PK
   	%>	
   			var fld=Ext.getCmp("edit_<%=sFldName%>");
   			if(!fld.validate()) {	//未通过验证，则不提交
   				return ;
   			}
   			map.put("<%=sFldName%>",fld.getValue());
   			map.put("<%=sFldName+"_type"%>","<%=sFldType%>");		//同时要记录该字段类型
   			if(!<%=boolIsPK%>)		//字段为PK时，不用加入到这个collection中
   				fldNamesString.add("<%=sFldName%>","<%=sFldName%>");
	<%
		}
	%>   
		map.put("fldNamesString",fldNamesString.getRange().join(","));
	<%	
		String sPKFld=sbPKFld.toString();	//获得这个表的PK（可能不只一个字段）
	%>		
		if("<%=sPKFld%>"!=null)
			map.put("sPKFld","<%=sPKFld%>");
	<%String sTable=cfgClassCode.getTable();		//表名%>	
		map.put("sTable","<%=sTable%>");
		
		map.put("indexCC",indexCC);
		map.put("nodeCode",nodeCode);		
   		var query=new QueryObj(map,function(query){
   			var msg=query.getDetail();
   			var msgTips="";
   			if(msg=="ok") {
				msgTips="分级代码更新成功！";
				window.parent.parent.showTips(msgTips,2);
				window.parent.freshClassCodeTree();  	//刷新这棵树
   			} else {
				msgTips=msg;
				window.parent.parent.showTips(msgTips,1);   			
   			}
   		});
		query.send();   		
   	}
   
      Ext.onReady(function(){
          editForm.render('editForm_div');
      });
    </script>
  </head>
  <body>
    <div id="editClassCode" style="margin-top: 15px;">
      <table align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div id="editForm_div" align="left"></div>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
