<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
	<head>
		<title>数据源编辑</title>
		<link rel="stylesheet" type="text/css"
			href="<c:url value='/artery/form/make/css/params.css'/>" />
		<script type="text/javascript"
			src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
		<script type="text/javascript"
			src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/popXml.js'/>"></script>
		<script type="text/javascript">
            var eformtpl={};
            eformtpl.id="<c:out value='${formid}'/>";
            eformtpl.complibId="<c:out value='${complibId}'/>";
            eformtpl.type="<c:out value='${formtype}'/>";
            var toolbar;
            var store;
            var mainPnl;
            var gridEditor;
             
            // 通过ajax方法，加载xml
            var map = new Map();
            map.put("key", "report.loadOrderXML");
            map.put("id",eformtpl.id);
            map.put("complibId",eformtpl.complibId);
            map.put("formtype",4);
            var query = new QueryObj(map);
            query.send();
            eformtpl.ds = query.getDetail();
            eformtpl.dom=loadXMLString(eformtpl.ds);
            
            function initStore(){
              store = new Ext.data.Store({
                    proxy: new Ext.data.MemoryProxy([]),
                    reader: new Ext.data.ArrayReader({}, 
                      [
                            {name: 'name'},
                            {name: 'field'},
                            {name:'yndefault'}
                      ]
                    )
             });
         	 store.load();
          	 var rootEl=eformtpl.dom.documentElement;    
             for(var i=0;i<rootEl.childNodes.length;i++){
                   var subEl = rootEl.childNodes[i];
           		   var p = new Ext.data.Record({
                           name: subEl.getAttribute("name"), 
                           field: subEl.getAttribute("field"), 
                           yndefault: subEl.getAttribute("yndefault")
                           });
                   if(subEl.getAttribute("name")!=null && subEl.getAttribute("name").trim()!="" ){
                        store.addSorted(p);
                   }
         	   }     
      	    }
           
      	    //save方法
            function saveHandler(){
       		  var jsonArray = [];
      		  store.each(function(item) {
                   jsonArray.push(item.data);
              });
              //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
           	  var sValid=",";
              for(var i=0;i<jsonArray.length;i++){
                  if(jsonArray[i].name==null || jsonArray[i].name=="" || Ext.isEmpty(jsonArray[i].name.trim())){
                       showTips("验证出错：标签不可为空",4);
                       return false;
                  }
                  if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
                       showTips("验证出错：标签不可重复",4);
                       return false;
                  }
                  sValid+=jsonArray[i].name.trim()+",";
              }
              var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><orders/>");
              var rootEl = docDs.documentElement;
              for(var i=0;i<jsonArray.length;i++){
                  var newNode = docDs.createElement("order");
                  var attrName = docDs.createAttribute("name");
	              attrName.value = jsonArray[i].name;
	              var pageName = docDs.createAttribute("field");
	              pageName.value = ((jsonArray[i].field==null?"":jsonArray[i].field.trim()));
	              var pageNumber = docDs.createAttribute("yndefault");
	              pageNumber.value = ((jsonArray[i].yndefault==null?"":jsonArray[i].yndefault));
	              newNode.setAttributeNode(attrName);
	              newNode.setAttributeNode(pageName);
	              newNode.setAttributeNode(pageNumber);
                  rootEl.appendChild(newNode);
              }
              var map = new Map();
              map.put("key", "report.saveorder");
              map.put("eformid", eformtpl.id);
              map.put("complibId", eformtpl.complibId);
              map.put("eformtype", eformtpl.type);
              map.put("ds",docDs.xml);
              var query = new QueryObj(map, function(query){
                  var msg = query.getDetail();
                  if(msg=="ok"){
                      showTips("保存排序信息成功",2);
                  }else{
                      showTips("未知错误：保存排序信息失败",4);
                  }
              });
              query.send();          
            }
          
            //添加新记录的按钮的事件
            function addHandler(){
               var p = new Ext.data.Record({
                   name:'order1', field:'',yndefault:'1'
               });
               mainPnl.stopEditing();
               store.insert(store.getCount(), p);
               mainPnl.startEditing(store.getCount()-1, 1);
               mainPnl.view.refresh();
            }
          
            //删除记录的事件
            function delHandler(){
           	 var sm = mainPnl.getSelectionModel();
           	 var cell = sm.getSelectedCell();
          	 if(!cell)
                    return;
               var record = store.getAt(cell[0]);
               if(!record)
                    return;
               Ext.Msg.confirm('信息', '确定要删除此排序么？', function(btn){
                   if (btn == 'yes') {
                       store.remove(record);
                       mainPnl.view.refresh();
                   }
               });
            }
          
            //初始化toolbar
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
                        tooltip: '保存排序信息',
                        iconCls:'save',
                        handler: saveHandler
                     },'-',{  
                        text: '添加排序',
                        tooltip: '添加一个新排序',
                        iconCls:'add',
                        handler: addHandler
                     }, '-', {
                        text: '删除排序',
                        tooltip: '删除当前选中的排序<br>删除后将无法恢复，需谨慎操作',
                        iconCls:'del',
                        handler: delHandler
                     },
                    {
                        text: "预览",
                        cls: 'x-btn-text-icon preview',
                        handler: previewForm
        	         },
      	             {
  					     xtype : 'tbfill'
  				     }, refreshButton
                  ])
            }
        
            //打开预览
            function previewForm(){
    	        winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
				winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + eformtpl.id;
	        	winObj.focus();
            }

            //格式化之后的回调函数
            function formatCallback(query) {
    	         var retXml = query.getDetail();
    	         openXml(retXml, 3);
            }
        
            function getNewXml(){
                var jsonArray = [];
                store.each(function(item) {
                     jsonArray.push(item.data);
                });
                //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
                var sValid=",";
                for(var i=0;i<jsonArray.length;i++){
                    sValid+=jsonArray[i].name.trim()+",";
                }
                var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><orders/>");
                var rootEl = docDs.documentElement;
                for(var i=0;i<jsonArray.length;i++){
                    var newNode = docDs.createElement("order");
                    var attrName = docDs.createAttribute("name");
    	            attrName.value = jsonArray[i].name;
    	            var pageName = docDs.createAttribute("field");
    	            pageName.value = ((jsonArray[i].field==null?"":jsonArray[i].field.trim()));
    	            var pageNumber = docDs.createAttribute("yndefault");
    	            pageNumber.value = ((jsonArray[i].yndefault==null?"":jsonArray[i].yndefault));
    	            newNode.setAttributeNode(attrName);
    	            newNode.setAttributeNode(pageName);
    	            newNode.setAttributeNode(pageNumber);
                    rootEl.appendChild(newNode);
                }
                return docDs.xml;
            }
          
            //initGridPanel
            function initGridPanel(){
                var comboData = [['1','是'],['2','否']];
                var cm = new Ext.grid.ColumnModel([
                    new Ext.grid.RowNumberer(),
                    {
                        header:'标签',
                        dataIndex:'name',
                        sortable:true,
                        width:40,
                        editor:new Ext.form.TextField({
                             allowBlank: false
                        })
                    },
                    {
                        header:'字段名',
                        dataIndex:'field',
                        editor:new Ext.grid.GridEditor(new Ext.form.TextField({allowBlank: true}))
                    },
                    {
                        header:'是否默认',
                        dataIndex:'yndefault',
                        editor:new Ext.grid.GridEditor(new Ext.form.ComboBox({
                              store: new Ext.data.SimpleStore({
                                    fields:['value','text'],
                                    data: comboData
                              }),
                              emptyText: '请选择',
                              mode: 'local',
                              triggerAction: 'all',
                              valueField: 'value',
                              displayField: 'text',
                              readOnly:true
                       })),
                       renderer: function(value){
                             return value==1 ? '是' : '否';
                       }
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
            });
    </script>
	</head>
	<body>
	</body>
</html>