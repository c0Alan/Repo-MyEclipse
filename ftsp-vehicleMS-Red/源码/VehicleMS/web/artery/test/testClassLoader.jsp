<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<%@ page import="java.lang.reflect.Method" %>
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
  测试加载类库
  
  <%
  ClassLoader clf = (ClassLoader)getServletContext().getAttribute("URL_CLASSLOADER");
  Class clzz = clf.loadClass("wei.TesClass");
  out.println(clzz.getName());
  //Class clzz = Class.forName("wei.TestClass");
  Object instance = clzz.newInstance();
  Method method = clzz.getMethod("sayHello",null);
  method.invoke(instance,null);
  //Object obj = (wei.TestClass)instance;
  %>
</h1>
