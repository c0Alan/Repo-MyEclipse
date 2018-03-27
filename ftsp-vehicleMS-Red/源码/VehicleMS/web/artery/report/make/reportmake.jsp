<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>报表制作</title>
    <style type="text/css">
    .my-icon{
      background-image:url(report/images/report.gif);
    }
    .x-tab-strip .x-tab-with-icon .x-tab-right{
      padding-left:0px;
    }
    </style>
   <link href="<html:rewrite page='/artery/report/make/css/comm.css'/>"
			rel="stylesheet" type="text/css" />
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
                title: '报表布局',
                html:{
                    id:'iframe_rptLayout',
                    name:'iframe_rptLayout',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=makeLayout&id=${id}&complibId=${complibId}"/>'
                }
            },{
                title: '表样',
                iconCls:'table',
                html:{
                    id:'iframe_label',
                    name:'iframe_label',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=table&id=${id}&complibId=${complibId}"/>'
                }
            },{
                title: '语法',
                iconCls:'savesql',
                html:{
                    id:'iframe_grammar',
                    name:'iframe_grammar',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=grammar&id=${id}&complibId=${complibId}"/>'
                }
            },{
                title: '关联',
                iconCls:'saverelation',
                html:{
                    id:'iframe_relation',
                    name:'iframe_relation',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=relation&id=${id}&complibId=${complibId}"/>'
                }
            },{
                title: "排序",
                iconCls: "saveorder",
                html:{
                    id:'iframe_order',
                    name:'iframe_order',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=order&id=${id}&formid=${template.ID}&complibId=${complibId}"/>'
                }
            },{
                title: '亮显',
                iconCls:'saveafterdeal',
                html:{
                    id:'iframe_light',
                    name:'iframe_light',
                    tag:'iframe',
                    frameborder:0,
                    style:'width:100%;height:100%',
                    src:'<c:url value="report.do?action=light&id=${id}&complibId=${complibId}"/>'
                }
            }]
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

