<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.core.CoreConst" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>入口参数编辑</title>
    <script type="text/javascript">
      Ext.ns("AtyCon");
    </script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/xmlUtil.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/con_params.js'/>"></script>
    <script type="text/javascript">
      var eformtpl={};
      eformtpl.formid = "<c:out value='${formid}'/>";
      eformtpl.complibId = "<c:out value='${complibId}'/>";
      eformtpl.formtype = "<%=CoreConst.TYPE_WRIT%>";
      Ext.onReady(function(){
          Ext.QuickTips.init();
          var paramsPanel = new AtyCon.Form_Params();
          new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[paramsPanel]
          });
          paramsPanel.showParams(eformtpl);
      });
    </script>
</head>
<body>
</body>
</html>