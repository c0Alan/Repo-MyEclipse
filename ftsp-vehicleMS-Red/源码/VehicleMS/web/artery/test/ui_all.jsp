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
  form:
  <c:out value="${map1['key1']}" />
</h1>
<c:if test="${1==1 || 2==2 or 3==3}">
测试c:if
</c:if>
<ui:form action="/artery/test/sample.do?action=insert" validatable="true" htmlAttr=" method='post'">
  <table>
    <tr>
      <td>
        select
      </td>
      <td>
        <ui:select name="selectedItem" items="${MyList}" itemLabel="name" itemValue="id"/>
      </td>
    </tr>
    <tr>
      <td>
        text 验证email
      </td>
      <td>
        <ui:text name="MyEntity.mail" validation="email()(${_message['error.title.app']})" value="${MyEntity.mail}" />
      </td>
    </tr>
    <tr>
      <td>
        test 验证int
      </td>
      <td>
        <ui:text name="MyEntity.age" validation="int()(${_message['error.title.app']})">${MyEntity.age}</ui:text>
      </td>
    </tr>
    <tr>
      <td>
        radio
      </td>
      <td>
        <ui:radio name="MyEntity.male" value="true" />
      </td>
    </tr>
    <tr>
      <td>
        password
      </td>
      <td>
        <ui:password name="MyEntity.password" />
      </td>
    </tr>
    <tr>
      <td>
        checkbox
      </td>
      <td>
        <ui:checkbox name="MyEntity.male" />
      </td>
    <tr>
      <td>
        hidden
      </td>
      <td>
        <ui:hidden name="MyEntity.password" value="${MyEntity.password}" />
      </td>
    </tr>
    <tr>
      <td>
        file
      </td>
      <td>
        <ui:file name="user.image" />
      </td>
    </tr>
    <tr>
      <td>
        datepicker
      </td>
      <td>
        <ui:datePicker name="MyEntity.birthday" value="${MyEntity.birthday}" />
      </td>
    </tr>
    <tr>
      <td>
        submit
      </td>
      <td>
        <ui:submit htmlAttr=" value='submit' " />
      </td>
    </tr>
    <tr>
      <td>
        reset
      </td>
      <td>
        <ui:reset htmlAttr="value='reset'" />
      </td>
    </tr>
  </table>
</ui:form>
<hr />
<h1>
  文件下载
</h1>
<!-- 显示文件下载链接 -->
<ui:fileDisplay filename="某某人的简历.doc" value="${imgs}" />
<hr />
<h1>
  分页
</h1>
<!-- 分页 -->
<ui:page pageNum="10" total="200" url="/artery/test/sample.do" param="action=ui" />
<hr />
<!-- 分页 jstl -->
<%
            //为调试提供数据
            pageContext.setAttribute("perPage", new Integer(10));
            pageContext.setAttribute("totalCount", new Integer(200));
%>
<ui:page pageNum="${perPage}" total="${totalCount}" url="/artery/test/sample.do" param="action=ui" />
<hr />
<!-- 分页 Jstl-->
<ui:page pageNum="${20}" total="${200}" url="/artery/test/sample.do" param="action=ui&ajlb=${ajlb}" />
<hr />
<h1>
  权限验证
</h1>
<!-- 权限验证标签 -->
测试1_拥有权限
<br>
<ui:choose>
  <ui:hasRight right="fenjianqu">
			有权限，输出HasRight内容。							
	</ui:hasRight>
  <ui:otherwise>
			没有权限，Otherwise内容应该输出。
	</ui:otherwise>
</ui:choose>
<hr />
测试2_登录
<br>
<ui:choose>
  <ui:isLogin>
			登录，输出HasRight内容。							
	</ui:isLogin>
  <ui:otherwise>
			没有登录，Otherwise内容应该输出。
	</ui:otherwise>
</ui:choose>
<hr />
测试3_登录/权限_跳转
<br>
<ui:choose>
  <ui:isLogin forward="/">
			登录，输出HasRight内容。							
	</ui:isLogin>
  <ui:otherwise>
			没有登录，Otherwise内容应该输出。
	</ui:otherwise>
</ui:choose>
<hr>
<ui:choose>
  <ui:isLogin>
    <ui:choose>
      <ui:hasRight right="fenjianqu and yuzhengke"> 
     			显示有权限的情况
    		</ui:hasRight>
      <ui:otherwise>
     			显示没有该权限的情况
    		</ui:otherwise>
    </ui:choose>
  </ui:isLogin>
  <ui:otherwise>
   		执行没有登录的情况
 	</ui:otherwise>
</ui:choose>
<hr />
<table border="1" bordercolor="#000000">
  <!-- jstl实例 -->
  <!-- 使用forEach标签进行循环，依次输出集合对象的成员，实现列表界面 -->
  <c:set var="count" value="0" />
  <c:forEach var="list" items="${MyList}">
    <tr
      <c:choose>
		<c:when test="${count/2==0 }">class="listOddLine"</c:when>
		<c:otherwise>class="listEvenLine"</c:otherwise>
	 </c:choose>>
      <td class="listInfo">
        <a href="<c:url value="/thunisoft/jcy/gsys/dealAjxx.do?action=display&gsysAjxx.bh=${list.name}"/>"><c:out
            value="${list.id}" /> </a>
      </td>
      <td class="listInfo">
        <c:out value="${list.mail}" />
        &nbsp;
      </td>
      <td class="listInfo">
        <c:out value="${list.male}" />
        &nbsp;
      </td>
      <td class="listInfo">
        <c:out value="${list.age }" />
        &nbsp;
      </td>
      <td class="listInfo">
        <c:out value="${list.addr}" />
        &nbsp;
      </td>
      <td class="listInfo">
        <c:out value="${list.birthday}" />
        &nbsp;
      </td>
      <td class="listInfo">
        <a href="<c:url value="/thunisoft/jcy/gsys/dealAjxx.do?action=modify&gsysAjxx.bh=${list.password}"/>"><c:out
            value="${list.name}" />&nbsp;</a>
      </td>
    </tr>
    <c:set var="count" value="${count+1 }" />
  </c:forEach>
</table>
