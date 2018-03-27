<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
	<head>
		<title>数据源编辑</title>
		<link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/params.css'/>" />
        <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
        <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
		<script type='text/javascript' src="<c:url value='/artery/report/make/js/popXml.js'/>"></script>
		<script type="text/javascript">
		var dataSourceStore = <c:out value='${dataSource}' escapeXml="false"/>;
        var hasUserDataSource = <c:out value='${hasUserDataSource}' escapeXml="false"/>; 
        
        var sqlTips = "";
        var eformtpl={};
        eformtpl.id="<c:out value='${formid}'/>";
        eformtpl.complibId="<c:out value='${complibId}'/>";
        eformtpl.type="<c:out value='${formtype}'/>";
        var comboData = [['1','是'],['2','否']];
        // 通过ajax方法，加载xml
        var map = new Map();
        map.put("key", "report.loadDSXML");
        map.put("id",eformtpl.id);
        map.put("complibId",eformtpl.complibId);
        map.put("formtype",4);
        var query = new QueryObj(map);
        query.send();
        eformtpl.ds = query.getDetail();
        eformtpl.dom=loadXMLString(eformtpl.ds);
      
        var toolbar;
        var store;
        var mainPnl;
        var sqlField;
        var sqlWindow;
        var codePanel;  // 代码编辑器
        var gridEditor;
      
        function initStore(){
            store = new Ext.data.Store({
              proxy: new Ext.data.MemoryProxy([]),
              reader: new Ext.data.ArrayReader({}, [
                  {name: 'dsName'},
                  {name: 'rsName'},
                  {name: 'splitpage'},
                  {name:'record'},
                  {name: 'value'}
              ])
            });
            
            store.load();
            var rootEl=eformtpl.dom.documentElement;    
            for(var i=0;i<rootEl.childNodes.length;i++){
              var subEl = rootEl.childNodes[i];
              var p = new Ext.data.Record({
                dsName: getDsName(subEl), 
                name: subEl.getAttribute("rsName"), 
                pageSplit: subEl.getAttribute("splitpage"), 
                pageNumber: subEl.getAttribute("record"), 
                value: Ext.encode(subEl.text)
              });
              if(subEl.getAttribute("rsName")!=null && subEl.getAttribute("rsName").trim()!="" ){
                  store.addSorted(p);
              }
            }
        }
        
       function getDsName(subEl){
			if(subEl.getAttribute("dsName") == null){
				if(hasUserDataSource){
					return "userDataSource";
				}else{
					return "dataSource";
				}
			}
			return subEl.getAttribute("dsName");
		}
      
        function saveHandler(){
            var jsonArray = [];
            store.each(function(item) {
                jsonArray.push(item.data);
            });
            
            //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
            var sValid=",";
            for(var i=0;i<jsonArray.length;i++){
                if(jsonArray[i].name==null || jsonArray[i].name=="" || Ext.isEmpty(jsonArray[i].name.trim())){
                    showTips("验证出错：结果集名称不可为空",4);
                    return false;
                }
            //if(jsonArray[i].value==null || jsonArray[i].value==""|| Ext.isEmpty(Ext.decode(jsonArray[i].value).trim())){
            //  showTips("验证出错：查询sql不可为空",4);
             // return false;
          //  }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
              showTips("验证出错：结果集名称不可重复",4);
              return false;
            }
            // if(jsonArray[i].value==null || jsonArray[i].value=="" || Ext.isEmpty(jsonArray[i].value.trim())){
            //  showTips("验证出错：查询sql不可为空",4);
            //  return false;
            //}
            sValid+=jsonArray[i].name.trim()+",";
            //sValid+=((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim())+",");
        }
        var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><dataSources/>");
        var rootEl = docDs.documentElement;
        
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docDs.createElement("ds");
            var attrName = docDs.createAttribute("rsName");
	        attrName.value = jsonArray[i].name;
	        var pageName = docDs.createAttribute("splitpage");
	        pageName.value = ((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim()));
	        var pageNumber = docDs.createAttribute("record");
	         pageNumber.value = ((jsonArray[i].pageNumber==null?"":jsonArray[i].pageNumber));
	        newNode.setAttributeNode(attrName);
	        newNode.setAttributeNode(pageName);
	         newNode.setAttributeNode(pageNumber);
	         if(jsonArray[i].value==null || jsonArray[i].value=="")
                newNode.text ="";
             else
                  newNode.text = Ext.decode(jsonArray[i].value);
                  
            var attrDsName = docDs.createAttribute("dsName");
	        attrDsName.value = jsonArray[i].dsName;
	        newNode.setAttributeNode(attrDsName);
	        
            rootEl.appendChild(newNode);
        }
        var map = new Map();
        map.put("key", "report.saveds");
        map.put("eformid", eformtpl.id);
        map.put("complibId", eformtpl.complibId);
        map.put("eformtype", eformtpl.type);
        map.put("ds",docDs.xml);
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            if(msg=="ok"){
                showTips("保存表单数据源成功",2);
            }else{
                showTips("未知错误：保存表单数据源失败",4);
            }
        });
        query.send();          
      }
      
      function addHandler(){
          var p = new Ext.data.Record({
              dsName:hasUserDataSource?'userDataSource':'dataSource',name:'rs1',pageSplit:'1', pageNumber:'',value:''
          });
          mainPnl.stopEditing();
          store.insert(store.getCount(), p);
          mainPnl.startEditing(store.getCount()-1, 1);
          mainPnl.view.refresh();
      }
      
      function delHandler(){
          var sm = mainPnl.getSelectionModel();
          var cell = sm.getSelectedCell();
          if(!cell)
            return;
          var record = store.getAt(cell[0]);
          if(!record)
            return;
          Ext.Msg.confirm('信息', '确定要删除此语法么？', function(btn){
              if (btn == 'yes') {
                  store.remove(record);
                  mainPnl.view.refresh();
              }
          });
      }
      
      function initToolbar(){
       // 定义视图按钮
			var refreshButton = new Ext.Button({
				text : 'xml源码',
				tooltip : 'xml源码,您可以直接修改源码',
				handler : function(item) {
					formatXml(getNewXml());
				}
			});
        toolbar=new Ext.Toolbar([
          {
            id: "button_save",
            text: '保存',
            tooltip: '保存数据源',
            iconCls:'save',
            handler: saveHandler
          },'-',{
            text: '添加语法',
            tooltip: '添加一个新语法',
            iconCls:'add',
            handler: addHandler
        }, '-', {
            text: '删除语法',
            tooltip: '删除当前选中的语法<br>删除后将无法恢复，需谨慎操作',
            iconCls:'del',
            handler: delHandler
        },'-', {
            text: '验证全部sql',
            tooltip: '验证全部sql合法性',
            handler: validateAllHandler
        },'-',{
    		text: "预览",
    		cls: 'x-btn-text-icon preview',
    		handler: previewForm
    	},{
					xtype : 'tbfill'
				}, refreshButton])
      }
       function previewForm(){
           saveHandler();
            winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
			winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + eformtpl.id;
			winObj.focus();
	   }
/**
 * 格式化xml
 */
function formatXml(xmlStr) {
	var map = new Map();
	map.put("key", "template.report.formatxml");
	map.put("xmlStr", xmlStr);
	var query = new QueryObj(map, formatCallback);
	query.send();
}
/**
 * 格式化之后的回调函数
 */
function formatCallback(query) {
	var retXml = query.getDetail();
	openXml(retXml, 1);
}
      function getNewXml(){
         var jsonArray = [];
        store.each(function(item) {
            jsonArray.push(item.data);
        });
        
        //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
        var sValid=",";
        for(var i=0;i<jsonArray.length;i++){
            if(jsonArray[i].name==null || jsonArray[i].name=="" || Ext.isEmpty(jsonArray[i].name.trim())){
              showTips("验证出错：查询id不可为空",4);
              return false;
            }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
              showTips("验证出错：查询id不可重复",4);
              return false;
            }
            if(jsonArray[i].value==null || jsonArray[i].value=="" || Ext.isEmpty(jsonArray[i].value.trim())){
              showTips("验证出错：查询sql不可为空",4);
              return false;
            }
            sValid+=jsonArray[i].name.trim()+",";
            //sValid+=((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim())+",");
        }
        var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><dslist/>");
        var rootEl = docDs.documentElement;
        
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docDs.createElement("ds");
            var attrName = docDs.createAttribute("rsName");
	        attrName.value = jsonArray[i].name;
	        var pageName = docDs.createAttribute("splitpage");
	        pageName.value = ((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim()));
	        var pageNumber = docDs.createAttribute("record");
	         pageNumber.value = ((jsonArray[i].pageNumber==null?"":jsonArray[i].pageNumber));
	        newNode.setAttributeNode(attrName);
	        newNode.setAttributeNode(pageName);
	         newNode.setAttributeNode(pageNumber);
	         if(jsonArray[i].value==null || jsonArray[i].value=="")
                newNode.text ="";
             else
                  newNode.text = Ext.decode(jsonArray[i].value);
            
            var attrDsName = docDs.createAttribute("dsName");
	        attrDsName.value = jsonArray[i].dsName;
	        newNode.setAttributeNode(attrDsName);
	        
            rootEl.appendChild(newNode);
        }
        return docDs.xml;
      }
      // 初始化sql窗口
      function initSqlWindow(){
          codePanel = new CodePanel({
              editorTips: sqlTips,
              language: "sql"
          });
          sqlWindow = new Ext.Window({
              title: 'SQL编辑器',
              width: 560,
              height:430,
              resizable: false,
              border:false,
              closeAction: 'hide',
              modal: true,
              layout: 'fit',
              plain:true,
              maximizable : true,
              buttonAlign:'right',
              items:[codePanel],
              buttons: [{
                  text: '验证sql',
                  handler:function(){
                      var record = gridEditor.record;
                      mainPnl.stopEditing();
                      var myCode = codePanel.getCode();
                      if(!myCode){
                          myCode = "";
                      }
                     
                      var dsName = "";
                      if(!Ext.isEmpty(record.data.dsName)){
                          dsName = record.data.dsName;
                      }
                       
					var map = new Map();
					map.put("key", "template.sql.validate");
					map.put("eformid", eformtpl.id);
					map.put("complibId", eformtpl.complibId);
					map.put("myCode", myCode);
					map.put("dsName", dsName);
					var query = new QueryObj(map, validateCallback);
					query.send();
                  }
              },{
                  text: '确定',
                  handler:function(){
                      var record = gridEditor.record;
                      mainPnl.stopEditing();
                      var myCode = codePanel.getCode();
                      if(!myCode){
                          myCode = "";
                      }
                      record.data.value = Ext.encode(myCode);
                      sqlWindow.setVisible(false);
                      mainPnl.view.refresh();
                  }
              },{
                  text: '取消',
                  handler:function(){
                      sqlWindow.setVisible(false);
                  }
              }]
          });
      }
      
      function initGridPanel(){
          sqlField = new Ext.form.TriggerField({
              triggerClass: "x-form-search-trigger",
              readOnly: true
          });
          
          sqlField.onTriggerClick = function(e){
              mainPnl.stopEditing();
              var record = gridEditor.record;
              var sqlStr = "";
              if(!Ext.isEmpty(record.data.value)){
                  sqlStr = Ext.decode(record.data.value);
              }
              codePanel.setCode(sqlStr);
              sqlWindow.show();
          };
          
          gridEditor = new Ext.grid.GridEditor(sqlField);
          var cm = new Ext.grid.ColumnModel([
              new Ext.grid.RowNumberer(),
              {
                  header:'数据源名称',
                  dataIndex:'dsName',
                sortable:true,
                  width:60,
                  editor:new Ext.form.ComboBox({
	            	allowBlank: false,
	            	store: new Ext.data.SimpleStore({
	            		data:dataSourceStore,
	            		fields: ['name']
	            	}),
	            	displayField:'name',
	            	valueField:'name',
	            	mode: 'local',
	            	editable:false,
			        forceSelection: true,
			        triggerAction: 'all'
	            })
              },{
                  header:'结果集名称',
                  dataIndex:'name',
                  sortable:true,
                  width:50,
                  editor:new Ext.form.TextField({
                      allowBlank: false
                  })
              },{
                  header:'是否分页',
                  dataIndex:'pageSplit',
                  sortable:true,
                  width:50,
                  editor:new Ext.form.ComboBox({
                      store: new Ext.data.SimpleStore({
                          fields:['value','text'],
                          data: comboData
                      }),
                      emptyText: '请选择',
                      mode: 'local',
                      triggerAction: 'all',
                      valueField: 'value',
                      displayField: 'text',
                      editable: false,
                      value:'1'
                  }),
                  renderer: function(value){
                      return value==1?'是':'否';
                  }
              },{
        header:'每页个数',
        dataIndex:'pageNumber',
        width:50,
        editor:new Ext.grid.GridEditor(new Ext.form.NumberField({
            allowBlank: true,
            maxValue: 200
        }))
    },{
                  header:'查询SQL',
                  dataIndex:'value',
                  sortable:true,
                  width:100,
                  editor:gridEditor
              }
          ]);
          
          mainPnl=new Ext.grid.EditorGridPanel({
              renderTo: document.body,
              cm:cm,
              store:store,
              loadMask: true,
              border:false,
              stripeRows:true,
              clicksToEdit:1,
              viewConfig: {
                  forceFit: true,
                  scrollOffset:2 // the grid will never have scrollbars
              },
              tbar:toolbar
          });      
      }
    
      Ext.onReady(function(){
          Ext.QuickTips.init();
          initToolbar();
          initStore();
          initSqlWindow();
          initGridPanel();
          
          new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[mainPnl]
          });
          
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("button_save").disable();
          </c:if>
      });
      function validateCallback(query){
         var validateStr=query.getDetail();
         if(validateStr==null || validateStr.trim() ==""){
           showTips("验证sql成功",2);
         }
         else
           showTips(validateStr,4);
      }
      /**
      *验证全部sql的正确性
      */
      function validateAllHandler(){
         var map = new Map();
		map.put("key", "template.sql.validateAll");
		map.put("eformid", eformtpl.id);
		map.put("complibId", eformtpl.complibId);
		map.put("allSqlStr", getAllSql());
		var query = new QueryObj(map, validateCallback);
		query.send();
      }
      /**
      *得到所有的sql拼串
      *
      */
      function getAllSql(){
        var jsonArray = [];
        var allSqlStr="";
        store.each(function(item) {
            jsonArray.push(Ext.decode(Ext.encode(item.data)));
        });
        for(var i=0;i<jsonArray.length;i++){
           jsonArray[i].value = Ext.decode(jsonArray[i].value);
        }
        return Ext.encode(jsonArray);
      }
    </script>
	</head>
	<body>
	</body>
</html>