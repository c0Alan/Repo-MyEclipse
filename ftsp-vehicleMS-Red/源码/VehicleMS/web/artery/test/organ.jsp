<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
  import="java.util.List,java.util.ArrayList"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<html>
  <head>
    <title>Test Organ</title>
    <style>
td{
	font-size:9pt;
}
body{
	font-size:9pt;
}
h1{
	font-size:14pt;
}
h2{
	font-size:12pt;
}
</style>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <h1>
      Test Organ
    </h1>
    <%
                List lstSelected = new ArrayList();
                lstSelected.add("10101");
                lstSelected.add("10103");
                request.setAttribute("selected", lstSelected);
    %>
    <h2>
      Organ Code
    </h2>
    <ui:organizationCode name="Test.Organ" showType="checkbox" organType="EmpNo" organScope="1"
      isDynamic="true" openLevel="1" selected="${selected}" wholename="true"></ui:organizationCode>
    <hr />
    <dd:organizationTree organType="EmpNo" organScope="1" isDynamic="true" openLevel="2"
      mainUrl="/RODS/artery/test/index.jsp" empExpression="?action=view&uid"></dd:organizationTree>
  </body>
</html>
