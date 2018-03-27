<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>form表单制作</title>
    <script type="text/javascript">
      Ext.onReady(function(){
          Ext.QuickTips.init();
          
          var mainPnl=new Ext.TabPanel({
            renderTo: document.body,
            activeTab: 0,
            border:false,
            plain:false,
            tabPosition:'bottom',
            defaults:{autoScroll: true},
            items:[{
                    title: '界面设计',
                    html:{
                        id:'iframeInterface',
                        name:'iframeInterface',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="formmake.do?action=forminterface&id="/><c:out value="${id}"/>'
                    } 
                },{
                    title: '入口参数',
                    html:{
                        id:'iframeParams',
                        name:'iframeParams',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="formmake.do?action=params&formtype=1&formid="/><c:out value="${id}"/>'
                    } 
                },{
                    title: '数据源配置',
                    html:{
                        id:'iframeParams',
                        name:'iframeParams',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="formmake.do?action=ds&formtype=1&formid="/><c:out value="${id}"/>'
                    } 
                }
            ]
        });
        
        new Ext.Viewport({
          layout:'fit',
          border:false,
          hideBorders :true,
          items:[mainPnl]
        });
      });
    </script>
</head>
<body>
</body>
</html>

