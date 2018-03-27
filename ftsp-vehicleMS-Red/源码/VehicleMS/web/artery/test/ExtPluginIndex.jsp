<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Filter Grid</title>
		<style>
			body {
			  font-size: 12px;
			  font-family: Arial, Helvetica, sans-serif
			}
		</style>
		<script type="text/javascript" language='javascript'
			src="<c:url value='/artery/pub/js/ext-plugin.js'/>"></script>
		<script>
		    Ext.onReady(function(){
				new Ext.Viewport({
					layout:'fit',
					border : false,
					hideBorders : true,
										
					items:[{
						xtype:'tabpanel',
						resizeTabs:true, // turn on tab resizing
				        minTabWidth: 100,
				        enableTabScroll:true,
				        deferredRender :false,
				        defaults: {autoScroll:true},
				        activeTab :0,
				        
				        items:[{
				        	title:'Filter Grid',
				        	id:'filterGridPanel',
				        	
				        	html:{
				        		tag:'iframe',
				        		id:'iframe-filter',
				        		style:'width:100%;height:100%;',
				        		frameborder:'0'
				        	},
				        	
				        	listeners :{
								"activate":{
									fn:function(panel){
										Ext.get('iframe-filter').dom.src="ExtPluginFilterGrid.jsp";
									},
									single:true
								}
							}
				        },{
				        	title:'Form Table Layout',
				        	id:'formTablePanel',
				        	
				        	html:{
				        		tag:'iframe',
				        		id:'iframe-table',
				        		style:'width:100%;height:100%;',
				        		frameborder:'0'
				        	},
				        	
				        	listeners :{
								"activate":{
									fn:function(panel){
										Ext.get('iframe-table').dom.src="ExtPluginFormTable.jsp";
									},
									single:true
								}
							}
				        },{
				        	title:'表单控件',
				        	id:'comboPanel',
				        	
				        	html:{
				        		tag:'iframe',
				        		id:'iframe-combo',
				        		style:'width:100%;height:100%;',
				        		frameborder:'0'
				        	},
				        	
				        	listeners :{
								"activate":{
									fn:function(panel){
										Ext.get('iframe-combo').dom.src="ExtPluginPyCombo.jsp";
									},
									single:true
								}
							}
				        }]
					}]
				})
		    });
    
		</script>

	</head>
	<body scroll=no>
	</body>
</html>
