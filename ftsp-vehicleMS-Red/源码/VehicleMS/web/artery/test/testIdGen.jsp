<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <html:base />
    <title>主键生成器使用示例</title>
    <style>
      body{
        font-size:9pt;
      }
      td{
        font-size:9pt;
      }
    </style>
  </head>
  <body>
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <br />
    <br />
    <table width="80%">
      <tr style="background-color: gray;color:white;">
        <td width="100px" colspan="2">
          Hibernate测试
        </td>
      </tr>
      <tr>
        <td width="100px">
          主键:
        </td>
        <td>
          <c:out value="${role1.NId}" />
          &nbsp;
        </td>
      </tr>
      <tr>
        <td>
          时间:
        </td>
        <td>
          <c:out value="${role1.CName}" />
          &nbsp;
        </td>
      </tr>
      <tr style="background-color: gray;color:white;">
        <td width="100px" colspan="2">
          JDBC测试
        </td>
      </tr>
      <tr>
        <td width="100px">
          主键:
        </td>
        <td>
          <c:out value="${role2.NId}" />
          &nbsp;
        </td>
      </tr>
      <tr>
        <td>
          时间:
        </td>
        <td>
          <c:out value="${role2.CName}" />
          &nbsp;
        </td>
      </tr>
    </table>
  </body>
</html>
