<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ page import="com.thunisoft.artery.core.CoreConst" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>数据源编辑</title>
    <script type="text/javascript">
      Ext.ns("AtyCon");
    </script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/xmlUtil.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/con_ds.js'/>"></script>
    <script type="text/javascript">
      var sqlTips = "";
      var eformtpl={};
      eformtpl.formid="<c:out value='${formid}'/>";
      eformtpl.complibId="<c:out value='${complibId}'/>";
      eformtpl.formtype = "<%=CoreConst.TYPE_WRIT%>";
      var dataSourceStore = <c:out value='${dataSource}' escapeXml="false"/>;
      var hasUserDataSource = <c:out value='${hasUserDataSource}' escapeXml="false"/>; 
      
      Ext.onReady(function(){
          Ext.QuickTips.init();
          var dsPanel = new AtyCon.Form_DS();
          new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[dsPanel]
          });
          dsPanel.showDS(eformtpl);
      });
    </script>
</head>
<body>
</body>
</html>