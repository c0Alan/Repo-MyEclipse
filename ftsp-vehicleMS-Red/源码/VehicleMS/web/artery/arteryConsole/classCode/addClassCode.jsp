<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ page import="java.util.List,java.util.Map" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.thunisoft.artery.module.classcode.IClassCodeDbCfg" %>
<%@ page import="com.thunisoft.artery.core.dict.domain.DictField" %>
<%@ page import="com.thunisoft.artery.core.dict.DictUtil" %>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>分级代码新建</title>
    <script type="text/javascript">
    var indexCC='<c:out value="${indexCC}"/>';
    var parentNodeCode='<c:out value="${parentNodeCode}"/>';
    var parentNodeName='<c:out value="${parentNodeName}"/>';
    
    <%IClassCodeDbCfg cfgClassCode=(IClassCodeDbCfg)request.getAttribute("cfgClassCode");
    List lstClassCodeFlds=(List)request.getAttribute("lstClassCodeFlds");
    
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
    
    var addForm = new Ext.FormPanel({
         labelWidth: 120,
         frame:true,
         title: '新建分级代码，父代码为： '+parentNodeName,
         bodyStyle:'padding:5px 5px 0px',
         width: 450,
         defaults: {width: 300},
         defaultType: 'textfield',
         buttons: [{
             text: '新建分级代码',
             handler: addClassCodeSubmit
         }]
    });
    
    <%//以下三个字段为重要字段，用红色标出
    String sCodeFld=cfgClassCode.getFldCode();		//code对应的字段名
    String sClassInfoFld=cfgClassCode.getFldClassInfo();	//classinfo对应的字段名
    String sParentCodeFld=cfgClassCode.getFldParentCode();	//parentcode对应的字段名
    
    //遍历每个字段（根据数据字典）
    Iterator it=lstClassCodeFlds.iterator();
    while(it.hasNext()) {
    	DictField dtf=(DictField)it.next();
    	String sFldType=dtf.getFieldType();		//字段类型，目前允许1，2，5
    	String sFldName=dtf.getFieldName();		//字段名称
    	boolean bDisabled=false;
    	
    	//sParentCodeFld字段不允许修改
    	if(sFldName.equals(sParentCodeFld))
    		bDisabled=true;
    	//在sbPKFld中记录主键	
    	if(dtf.isPk()) {
    		if(sbPKFld.length()<1)
    			sbPKFld.append(sFldName);
    		else
    			sbPKFld.append(",").append(sFldName);	
    	}
    	
    	String sShowName=dtf.getPropMap().get(DictUtil.FIELD_EXTEND_LABEL);	//显示名称
    	
    	boolean bEmpty= !dtf.getPropMap().get(DictUtil.FIELD_EXTEND_REQUIRED).equals("true");		//是否可空
		
		//以下三个字段为重要字段，用红色标出
		if(sFldName.equals(sCodeFld)||sFldName.equals(sClassInfoFld)||sFldName.equals(sParentCodeFld)) {
			sShowName="<font color=\"red\">"+sShowName+"</font>";
		}
		
		String sDefaultValue=dtf.getDefaultValue();		//默认值
		    	
    	if(sFldType.equals(DictUtil.FIELD_TYPE_NUMBER)||sFldType.equals(DictUtil.FIELD_TYPE_TEXT)) {	//此时为数字或文本字段，用Ext.form.TextField%>
		    var fldComp=new Ext.form.TextField({
		    	id: 'add_<%=sFldName%>',
		    	fieldLabel: '<%=sShowName%>',
		    	allowBlank: '<%=bEmpty%>',
		    	disabled: <%=bDisabled%>,
		    	value: '<%=sDefaultValue%>'
		    });
	<%
			if(sFldName.equals(sParentCodeFld)) {
	%>
				fldComp.setValue(parentNodeCode);
	<%
			}
	%>	
		    
		    addForm.add(fldComp);
    <%
    	}
    	
    	if(sFldType.equals(DictUtil.FIELD_TYPE_NORMALCODE)) {		//当字段为normal code 时
    		//String sPropers=dtf.getTProperties();
			//int indexBegin=sPropers.indexOf("field_code_type=");	//代表code type值的起始索引
			//indexBegin=indexBegin+"field_code_type=".length();
			//int indexEnd=sPropers.indexOf("\r\n",indexBegin);		//代表code type值的末尾索引+1
			//String sFldCodeType=sPropers.substring(indexBegin,indexEnd);
			//sFldCodeType = sFldCodeType.replaceAll("-","_");
			String sFldCodeType = dtf.getPropMap().get(DictUtil.FIELD_EXTEND_CODETYPE);
            sFldCodeType = sFldCodeType.replaceAll("-","_");
    %>
    		var addCBox=new Ext.form.ComboBox({
                  id: 'add_<%=sFldName%>',
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
                  value: '<%=sDefaultValue%>',
                  selectOnFocus:true
             });
             addForm.add(addCBox);
    <%	
    	}
    }
    %>
   	
   	// 新建分级代码事件函数
   	function addClassCodeSubmit() {
   		
   		var fldNamesString=new Ext.util.MixedCollection();
   		var map=new Map();
   		map.put("key","classCode.insertClassCode");
   		
   	<%
   		//遍历每个字段
   		Iterator it2=lstClassCodeFlds.iterator();
   		while(it2.hasNext()) {
   			DictField dtf=(DictField)it2.next();
	    	String sFldName=dtf.getFieldName();		//字段名称
	    	String sFldType = dtf.getFieldType();			//字段类型，目前处理1，2，5
	    	boolean boolIsPK= dtf.isPk();		//是否为PK
   	%>	
   			var fld=Ext.getCmp("add_<%=sFldName%>");
   			if(!fld.validate()||fld.getValue()=="") {	//未通过验证，和输入框为空，则不提交
   				return ;
   			}
   			map.put("<%=sFldName%>",fld.getValue());
   			map.put("<%=sFldName+"_type"%>","<%=sFldType%>");		//同时要记录该字段类型
   			if(!<%=boolIsPK%>)		//字段为PK时，不用加入到这个collection中
   				fldNamesString.add("<%=sFldName%>","<%=sFldName%>");
	<%
		}
	%>   
		map.put("fldNamesString",fldNamesString.getRange().join(","));		//字段集合，但不包括PK
	<%	
		String sPKFld=sbPKFld.toString();	//获得这个表的PK（可能不只一个字段）
	%>		
		if("<%=sPKFld%>"!=null&&"<%=sPKFld%>".trim()!="")
			map.put("sPKFld","<%=sPKFld%>");	//PK字段
	<%String sTable=cfgClassCode.getTable();		//表名%>	
		map.put("sTable","<%=sTable%>");
		
		map.put("indexCC",indexCC);		//classcode tree 索引
		map.put("parentNodeCode",parentNodeCode);		//父节点code
		
   		var query=new QueryObj(map,function(query){
   			var msg=query.getDetail();
   			var msgTips="";
   			if(msg=="1") {
				msgTips="新建分级代码成功！";
				window.parent.parent.showTips(msgTips,2);
				window.parent.freshClassCodeTree();  	//刷新这棵树
   			} else {
				msgTips="新建分级代码失败";
				window.parent.parent.showTips(msgTips,1);   			
   			}
   		});
		query.send();		
   	}
   
    Ext.onReady(function(){
        addForm.render('addForm_div');
    });
    </script>
  </head>
  <body>
    <div id="addClassCode" style="margin-top: 15px;">
      <table align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div id="addForm_div" align="left"></div>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
