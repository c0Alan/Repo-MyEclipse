<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>表单解析监听</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
    <%=EformUtil.getConsoleCSS()%>
    </style>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/monitor/monitor.js'/>"></script>
    <script type="text/javascript">
      Ext.onReady(function(){
        Ext.QuickTips.init();
        AtyCon.FormMonitor.init();
      });
    </script>
  </head>
  <body>
  </body>
</html>