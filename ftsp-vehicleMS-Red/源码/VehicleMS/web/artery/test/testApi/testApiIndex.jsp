<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
                        border:false,
				        activeTab :0,
                        tbar:[{
                          id: 'id_return',
                          text:'返回sample主页面',
                          handler: function(){
                            location.assign("<%=request.getContextPath()%>/artery/test/index.jsp");
                          }
                        },'->','测试BeanShell脚本及公用API说明'],
				        
				        items:[
                        {
				        	title:'beanshell脚本测试',
				        	html:{
				        		tag:'iframe',id:'iframe-filter0',style:'width:100%;height:100%;',frameborder:'0',
                                src:"<c:url value="/artery/test/testApi/testApi.jsp"></c:url>"
				        	}
				        },{
				        	title:'AppObj',
				        	html:{
				        		tag:'iframe',id:'iframe-filter1',style:'width:100%;height:100%;',frameborder:'0',
                                src:"<c:url value="/artery/test/testApi/appobj.jsp"></c:url>"
							}
				        },{
				        	title:'SessionObj',
				        	html:{
				        		tag:'iframe',id:'iframe-filter2',style:'width:100%;height:100%;',frameborder:'0',
                                src:"<c:url value="/artery/test/testApi/sessionobj.jsp"></c:url>"
							}
				        },{
                            title:'CacheObj',
                            html:{
                              tag:'iframe',id:'iframe-filter3',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/cacheobj.jsp"></c:url>"
                            }
				        },{
                            title:'CookieObj',
                            html:{
                              tag:'iframe',id:'iframe-filter4',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/cookieobj.jsp"></c:url>"
                            }
				        },{
                            title:'OrganObj',
                            html:{
                              tag:'iframe',id:'iframe-filter5',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/organobj.jsp"></c:url>"
                            }
				        },{
                            title:'RequestObj',
                            html:{
                              tag:'iframe',id:'iframe-filter6',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/requestobj.jsp"></c:url>"
                            }
				        },{
                            title:'ResponseObj',
                            html:{
                              tag:'iframe',id:'iframe-filter7',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/responseobj.jsp"></c:url>"
                            }
				        },{
                            title:'PageObj',
                            html:{
                              tag:'iframe',id:'iframe-filter8',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/pageobj.jsp"></c:url>"
                            }
				        },{
                            title:'SqlUtil',
                            html:{
                              tag:'iframe',id:'iframe-filter9',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/sqlutil.jsp"></c:url>"
                            }
				        },{
                            title:'ParamWrapper',
                            html:{
                              tag:'iframe',id:'iframe-filter10',style:'width:100%;height:100%;',frameborder:'0',
                              src:"<c:url value="/artery/test/testApi/paramwrapper.jsp"></c:url>"
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
