<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Insert title here</title>
    <script>
    Ext.onReady(function(){
      showtestJp1();
      showtestJp2();
      showtestJp3();
    });
</script>

  <style>
  .x-combo-list-item{
    font-family: monospace;
    font-size:12px;
    font-style:normal;
    padding:2px;border:1px solid #fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  </style>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <br />
    <br>
    <h2>
      在 Ext.onReady 中增加一个方法调用：show + 标签XMJPSelect的id属性
      使用方法：在Ext.onReady中增加一个方法调用：show + 标签DMJPSelect的id属性<br>
      其中有3个属性<br>
         codeType：主代码值<br>
         selected：选中的代码值或list（单个）<br>
         filter&nbsp;&nbsp;：过滤掉的代码值或list（多个）
    </h2>
     <%
                      request.setAttribute("codeValue", "4");
                      request.setAttribute("selected", "3");
                      java.util.ArrayList filterList = new java.util.ArrayList();
                      filterList.add("1");
                      filterList.add("6");
                      filterList.add("42");
                      request.setAttribute("filter", filterList);
           %>
      <br>
      <table>
        <tr>
          <td>
            基本测试 <artery:DMJPSelect codeType="${codeValue}" name="test" id="testJp1" width="250"/>
          </td>
          <td>
            测试选中 <artery:DMJPSelect codeType="${codeValue}" name="test1" id="testJp2" width="250" selected="${selected }"/>
          </td>
          <td>
            测试排除 <artery:DMJPSelect codeType="${codeValue}" name="test2" id="testJp3" width="250" filter="${filter }"/>
          </td>
          <td>
          </td>
        </tr>
      </table>
      <br>
      <h2>
      如何使下拉框字符等宽：覆盖ext-all.css中 的 “x-combo-list-item”所对应的样式
      </h2>
  </body>
</html>
