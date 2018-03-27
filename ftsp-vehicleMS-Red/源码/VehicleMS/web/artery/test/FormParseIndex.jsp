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
		<script>
		    Ext.onReady(function(){
				new Ext.Viewport({
					layout:'fit',
					
					items:[{
						xtype:'tabpanel',
						resizeTabs:true, // turn on tab resizing
				        minTabWidth: 100,
				        enableTabScroll:true,
				        deferredRender :false,
				        defaults: {autoScroll:true},
				        activeTab :0,
				        
				        items:[{
				        	title:'解析Xml',
				        	id:'formParsePanel',
				        	
				        	html:{
				        		tag:'iframe',
				        		id:'iframe-filter',
				        		style:'width:100%;height:100%;',
				        		frameborder:'0'
				        	},
				        	
				        	listeners :{
								"activate":{
									fn:function(panel){
										Ext.get('iframe-filter').dom.src="<c:url value="/artery/form/dealParse.do?action=parse"></c:url>";
									},
									single:true
								}
							}
				        },{
				        	title:'xml模板',
				        	id:'formParseXmlPanel',
				        	
				        	html:{
				        		tag:'iframe',
				        		id:'iframe-table',
				        		style:'width:100%;height:100%;',
				        		frameborder:'0'
				        	},
				        	
				        	listeners :{
								"activate":{
									fn:function(panel){
										Ext.get('iframe-table').dom.src="tpl1.xml";
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
