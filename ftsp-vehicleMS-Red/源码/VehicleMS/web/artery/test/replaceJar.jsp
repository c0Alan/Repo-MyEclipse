<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
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
</style>
<a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
<!-- 表单标签 -->
<h1>
  <c:out value="${res}" />
</h1>
