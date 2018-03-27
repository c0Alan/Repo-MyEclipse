<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>高级查询制作页面</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/arteryConsole/search/search.css'/>" />
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/search/js/condEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/search/js/make.js'/>"></script>
    <script type="text/javascript">
    var search_param_name = "<c:out value='${search_param_name}' escapeXml='false'/>";
    var search_param_value = "<c:out value='${search_param_value}' escapeXml='false'/>";
    var dataSourceStore = <c:out value='${dataSource}' escapeXml="false"/>;
    var hasUserDataSource = <c:out value='${hasUserDataSource}' escapeXml="false"/>; 
    </script>
  </head>
  <body>
  </body>
</html>