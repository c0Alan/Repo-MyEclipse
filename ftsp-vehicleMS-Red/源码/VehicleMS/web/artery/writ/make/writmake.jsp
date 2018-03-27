<%@ page language="java" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>文书表单制作界面</title>
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
                    title: '文书表单布局',
                    html:{
                        id:'writlayout',
                        name:'writlayout',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="writmake.do?action=writLayout&id="/><c:out value="${id}"/>&complibId=<c:out value="${complibId}"/>'
                    } 
                },{
                    id: "writtemplate_panel",
                    title: '文书模板',
                    html:{
                        id:'writtemplate',
                        name:'writtemplate',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="writmake.do?action=writTemplate&id="/><c:out value="${id}"/>&complibId=<c:out value="${complibId}"/>'
                    } 
                },{
                    title: '入口参数',
                    html:{
                        id:'writParams',
                        name:'writParams',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="writmake.do?action=params&formid="/><c:out value="${id}"/>&complibId=<c:out value="${complibId}"/>'
                    }
                },{
                    title: '数据源配置',
                    html:{
                        id:'writDS',
                        name:'writDS',
                        tag:'iframe',
                        frameborder:0,
                        style:'width:100%;height:100%',
                        src:'<c:url value="writmake.do?action=ds&formid="/><c:out value="${id}"/>&complibId=<c:out value="${complibId}"/>'
                    } 
                }
            ]
        });
        
        mainPnl.on("beforetabchange",function(tp,np,op){
          mainPnl.focus();
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
  	  <div id="form_div"></div>
	  <div id="writEdit_Main"></div>
  </body>
</html>
