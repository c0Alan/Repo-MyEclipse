<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
  import="java.util.List,java.util.ArrayList"%  >
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<html>
  <head>
    <title>Test Code</title>
    <script src="<%=request.getContextPath()%>/summer/js/code.js"></script>
    <style>
td{
	font-size:9pt;
}
body{
	font-size:9pt;
}
b{
	font-size:14pt;
}
</style>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <p>
      Test Code
    </p>
    <%
                List lstFilter = new ArrayList();
                lstFilter.add("1");
                lstFilter.add("2");
                lstFilter.add("3");
                lstFilter.add("4");
                lstFilter.add("5");
                request.setAttribute("filter", lstFilter);
                
                List lstSelected = new ArrayList();
                lstSelected.add("2");
                request.setAttribute("selected", lstSelected);
    %>
    <b>Normal Code</b>
    <ui:normalCode codeType="3" name="valid" showType="box" selected="${selected}" />
    <ui:normalCode codeType="2" name="department" showType="select" filter="${filter}" selected="10" headerLabel=""
      headerValue="-1" />
    <hr />
    <b>Static Normal</b>
    <br />
    <ui:normalCode codeType="6" name="nc" isStatic="true" selected="2" />
  </body>
</html>
