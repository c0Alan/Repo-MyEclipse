<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>入口参数编辑</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/params.css'/>" />    
    <script type="text/javascript">
      var eformtpl={};
      eformtpl.id="<c:out value='${formid}'/>";
      eformtpl.type="<c:out value='${formtype}'/>";
      
      // 通过ajax方法，加载xml
      var map = new Map();
      map.put("key", "formmake.loadParamsXML");
      map.put("formid",eformtpl.id);
      map.put("formtype",eformtpl.type);
      var query = new QueryObj(map);
      query.send();
      eformtpl.params = query.getDetail();
      eformtpl.dom=loadXMLString(eformtpl.params);

      var toolbar;
      var store;
      var mainPnl;
      var comboData = [['1','数据源相关参数'],['2','普通参数']];
      
      var data = [];
      
      function initStore(){
          store = new Ext.data.Store({
              proxy: new Ext.data.MemoryProxy(data),
              reader: new Ext.data.ArrayReader({}, [
                  {name: 'name'},
                  {name: 'showName'},
                  {name: 'type'},
                  {name: 'value'},
                  {name: 'pvalue'}
              ])
          });
          
          store.load();
          
          var rootEl=eformtpl.dom.documentElement;
          for(var i=0;i<rootEl.childNodes.length;i++){
              var subEl = rootEl.childNodes[i];
              var pValue = subEl.getAttribute("pvalue");
              if(!pValue){
                  pValue = "";
              }
              var showName = subEl.getAttribute("showName");
              if(!showName){
                  showName = "";
              }
              
              var p = new Ext.data.Record({
                  name: subEl.getAttribute("name"),
                  showName: showName, 
                  type: subEl.getAttribute("type"), 
                  value: subEl.getAttribute("value"),
                  pvalue: pValue
              });
              store.addSorted(p);
          }
      }
      
      function saveHandler(){
        var jsonArray = [];
        store.each(function(item) {
            jsonArray.push(item.data);
        });
        
        //校验，（1）id不能重复；（2）id不可空
        var sValid=",";
        for(var i=0;i<jsonArray.length;i++){
            if(Ext.isEmpty(jsonArray[i].name.trim())){
              showTips("验证出错：参数名称不可为空",4);
              return false;
            }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
              showTips("验证出错：参数名称不可重复",4);
              return false;
            }
            sValid+=jsonArray[i].name.trim()+",";
        }
        
        var docParam=loadXMLString("<?xml version='1.0' encoding='gbk'?><params/>");
        var rootEl = docParam.documentElement;
        
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docParam.createElement("param");
            // 处理名称
            var attrName = docParam.createAttribute("name");
	        attrName.value = jsonArray[i].name;
	        newNode.setAttributeNode(attrName);
            // 处理显示名
            var attrShowName = docParam.createAttribute("showName");
            attrShowName.value = jsonArray[i].showName;
            newNode.setAttributeNode(attrShowName);
            // 处理类型
            var attrType = docParam.createAttribute("type");
	        attrType.value = jsonArray[i].type;
	        newNode.setAttributeNode(attrType);
            // 处理默认值
            var attrValue = docParam.createAttribute("value");
	        attrValue.value = jsonArray[i].value;
	        newNode.setAttributeNode(attrValue);
            // 处理预览默认值
            var attrPreviewValue = docParam.createAttribute("pvalue");
            attrPreviewValue.value = jsonArray[i].pvalue;
            newNode.setAttributeNode(attrPreviewValue);
            rootEl.appendChild(newNode);
        }
        var map = new Map();
        map.put("key", "formmake.saveparams");
        map.put("eformid", eformtpl.id);
        map.put("eformtype", eformtpl.type);
        map.put("params",docParam.xml);
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            if(msg=="ok"){
                showTips("保存表单入口参数成功",2);
            }else{
                showTips("未知错误：保存表单入口参数失败",4);
            }
        });
        query.send();
      }
      
      function addHandler(){
          var p = new Ext.data.Record({
              name:'param1', type:'1', value:'', pvalue:'',showName:''
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
          Ext.Msg.confirm('信息', '确定要删除参数么？', function(btn){
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
			  url = sys.getContextPath() + '/artery/writparse.do?action=previewWrit&runtype=insert&writtplid=' + eformtpl.id;
		  }else if(eformtpl.type == '4'){
			  url = sys.getContextPath() + '/artery/pluginmake.do?action=preview&id=' + eformtpl.id;
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
            tooltip: '保存参数<br/>HotKey:Ctrl+S',
            iconCls:'save',
            handler: saveHandler
          },'-',{
            text: '添加参数',
            tooltip: '添加一个新参数<br/>HotKey:Ctrl+A',
            iconCls:'add',
            handler: addHandler
        }, '-', {
            text: '删除参数',
            tooltip: '删除当前选中的参数<br>删除后将无法恢复，需谨慎操作<br/>HotKey:Delete',
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
      
      function initGridPanel(){
          var cm = new Ext.grid.ColumnModel([
              new Ext.grid.RowNumberer(),
              {
                  header:'名称',
                  dataIndex:'name',
                  sortable:true,
                  editor:new Ext.form.TextField({
                      allowBlank: false
                  })
              },{
                  header:'显示名',
                  dataIndex:'showName',
                  sortable:true,
                  editor:new Ext.form.TextField({
                      allowBlank: false
                  })
              },{
                  header:'类型',
                  dataIndex:'type',
                  sortable:true,
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
                      return comboData[value-1][1];
                  }
              },{
                  header:'默认值',
                  dataIndex:'value',
                  sortable:true,
                  editor:new Ext.form.TextField()
              },{
                  header:'预览值',
                  dataIndex: 'pvalue',
                  sortable: true,
                  editor: new Ext.form.TextField()
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
      });
    </script>
</head>
<body>
</body>
</html>