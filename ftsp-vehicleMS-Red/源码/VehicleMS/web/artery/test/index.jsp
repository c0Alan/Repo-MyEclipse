<%@ page language="java" pageEncoding="UTF-8"  %>
<%@ include file="/summer/jsp/head/taglibs.jsp"%>
<%
request.setAttribute("contextPath", request.getContextPath());
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>sample page</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
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
  </head>
  <body>
    <h1>
      Sample
    </h1>
    <!-- 
    <a href="<c:out value="${contextPath}"/>/manager.do?action=main" target="_blank">系统管理</a>&nbsp;&nbsp;
     -->
    <a href="<c:out value="${contextPath}"/>/summer/common/login.do?action=logout" target="_parent"><%=ArteryUtil.getMessage("login.prompt.logout") %></a>
    <hr />
    <b>示例</b> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="<c:out value="${contextPath}"/>/artery/test/sample.do?action=ui">ui标签集合</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="<c:out value="${contextPath}"/>/artery/test/sample.do?action=code">NormalCode</a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="<c:out value="${contextPath}"/>/artery/test/ajaxtest.jsp">ajax测试</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="<c:out value="${contextPath}"/>/artery/test/sample.do?action=organ"><b>组织机构</b> </a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="<c:out value="${contextPath}"/>/artery/test/sample.do?action=testIdGenerator">主键生成示例</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="testXMJP.jsp">用户拼音控件</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="testDMJP.jsp">代码拼音控件</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="ExtPluginIndex.jsp">Ext 控件</a> &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    <hr />
    <font color="red">业务的Logic类需继承自ArteryLogic</font>&nbsp;&nbsp;&nbsp;&nbsp;
    <font color="red">业务的Dao类需继承自ArteryDao</font>
    <br />
    <hr />
    <b>关于事务</b>
    <a href="http://devmaster/dev/bbs/viewthread.php?tid=1371" target="_blank">参见技术论坛上的详细说明</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <b>关于异常处理</b>
    <a href="http://devmaster/dev/bbs/viewthread.php?tid=1370" target="_blank">参见技术论坛上的详细说明</a>
    <hr />
    <b>业务模块</b>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="FormParseIndex.jsp">表单解析</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="testTag.jsp">标签解析</a> &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="testApi/testApiIndex.jsp">beanshell脚本测试及公用api说明</a> &nbsp;&nbsp;&nbsp;&nbsp;<br/>
    <a href="editor/testPanel.jsp">代码编辑器</a> &nbsp;&nbsp;&nbsp;&nbsp;<br/>
    <hr/>
  </body>
</html>
