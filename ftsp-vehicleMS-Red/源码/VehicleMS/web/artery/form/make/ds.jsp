<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>数据源编辑</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/params.css'/>" />    
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript">
      var sqlTips = null; //EformUtil.genSqlTips()
      var eformtpl={};
      eformtpl.id="<c:out value='${formid}'/>";
      eformtpl.type="<c:out value='${formtype}'/>";
      
      // 通过ajax方法，加载xml
      var map = new Map();
      map.put("key", "formmake.loadDSXML");
      map.put("formid",eformtpl.id);
      map.put("formtype",eformtpl.type);
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
                  {name: 'name'},
                  {name: 'value'}
              ])
          });
          
          store.load();
          
          var rootEl=eformtpl.dom.documentElement;    
          for(var i=0;i<rootEl.childNodes.length;i++){
            var subEl = rootEl.childNodes[i];
            var p = new Ext.data.Record({
              name: subEl.getAttribute("name"), 
              value: Ext.encode(subEl.text)
            });
            store.addSorted(p);
          }     
      }
      
      function saveHandler(){
        var jsonArray = [];
        store.each(function(item) {
            jsonArray.push(item.data);
        });
        
        //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
        var sValid=",";
        for(var i=0;i<jsonArray.length;i++){
            if(Ext.isEmpty(jsonArray[i].name.trim())){
              showTips("验证出错：查询id不可为空",4);
              return false;
            }
            if(Ext.isEmpty(jsonArray[i].value) || Ext.isEmpty(Ext.decode(jsonArray[i].value).trim())){
              showTips("验证出错：查询sql不可为空",4);
              return false;
            }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
              showTips("验证出错：查询id不可重复",4);
              return false;
            }
            sValid+=jsonArray[i].name.trim()+",";
        }
        
        var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><dslist/>");
        var rootEl = docDs.documentElement;
        
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docDs.createElement("ds");
            var attrName = docDs.createAttribute("name");
	        attrName.value = jsonArray[i].name;
	        newNode.setAttributeNode(attrName);
            newNode.text = Ext.decode(jsonArray[i].value);
            rootEl.appendChild(newNode);
        }
        var map = new Map();
        map.put("key", "formmake.saveds");
        map.put("eformid", eformtpl.id);
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
              name:'rs1', value:''
          });
          mainPnl.stopEditing();
          store.insert(0, p);
          mainPnl.startEditing(0, 1);
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
          Ext.Msg.confirm('信息', '确定要删除此查询么？', function(btn){
              if (btn == 'yes') {
                  store.remove(record);
                  mainPnl.view.refresh();
              }
          });
      }
	  
      //预览表单
      function previewForm(runTimeType){
          var url = "";
          if(eformtpl.type == '1'){
              url = sys.getContextPath() + '/artery/form/dealParse.do?action=previewForm&formid=' + eformtpl.id;
          }else if(eformtpl.type == '3'){
              url = sys.getContextPath() + '/artery/writparse.do?action=previewWrit&runtype=insert&writtplid=' + eformtpl.id
          }else if(eformtpl.type == "5"){
              url = sys.getContextPath() + "/frameparse.do?action=previewFrame&id=" + eformtpl.id;
          }
          if(runTimeType){
              url += "&runTimeType="+runTimeType;
          }
          win = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
          win.location.href=url;
          win.focus();
      }
         
      function initToolbar(){
        toolbar=new Ext.Toolbar([
          {
            id: "button_save",
            text: '保存',
            tooltip: '保存数据源<br/>HotKey:Ctrl+S',
            iconCls:'save',
            handler: saveHandler
          },'-',{
            text: '添加查询',
            tooltip: '添加一个新查询<br/>HotKey:Ctrl+A',
            iconCls:'add',
            handler: addHandler
        }, '-', {
            text: '删除查询',
            tooltip: '删除当前选中的查询<br>删除后将无法恢复，需谨慎操作<br/>HotKey:Delete',
            iconCls:'del',
            handler: delHandler
        },'->',{
          text: '预览(展示)',
          tooltip: '预览展示表单（只读）效果<br/>HotKey:Ctrl+D',
          cls: 'x-btn-text-icon preview-d',
          handler : function(){
            previewForm("display");
          }
        },{
          text: '预览(更新)',
          tooltip: '预览更新表单效果<br/>HotKey:Ctrl+U',
          cls: 'x-btn-text-icon preview-u',
          handler: function(){
            previewForm("update");
          }
        },{
          text: '预览(插入)',
          tooltip: '预览插入表单效果<br/>HotKey:Ctrl+I',
          cls: 'x-btn-text-icon preview-i',
          handler: function(){
            previewForm("insert");
          }
        }])
      }
      
      // 初始化sql窗口
      function initSqlWindow(){
          codePanel = new CodePanel({
              language: "sql",
              editorTips: sqlTips
          });
          sqlWindow = new Ext.Window({
              title: 'SQL编辑器',
              width: 560,
              height:430,
              resizable: false,
              border:false,
              closeAction: 'hide',
              maximizable : true,
              modal: true,
              layout: 'fit',
              plain:true,
              buttonAlign:'right',
              items:[codePanel],
              buttons: [{
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
                  header:'名称',
                  dataIndex:'name',
                  sortable:true,
                  width:20,
                  editor:new Ext.form.TextField({
                      allowBlank: false
                  })
              },{
                  header:'SQL',
                  dataIndex:'value',
                  sortable:true,
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
          
          Ext.getBody().addKeyMap([{
            key : Ext.EventObject.S,
            ctrl : true,
            fn : saveHandler
          },{
            key : Ext.EventObject.D,
            ctrl : true,
            fn : function(){previewForm('display');return true;}
          },{
            key : Ext.EventObject.U,
            ctrl : true,
            fn : function(){previewForm('update');return true;}
          },{
            key : Ext.EventObject.I,
            ctrl : true,
            fn : function(){previewForm('insert');return true;}
          },{
            key : Ext.EventObject.DELETE,
            ctrl : false,
            fn : delHandler
          },{
            key : Ext.EventObject.A,
            ctrl : true,
            fn : addHandler
          }]);
          
          Ext.getBody().focus();        
      });
    </script>
</head>
<body>
</body>
</html>