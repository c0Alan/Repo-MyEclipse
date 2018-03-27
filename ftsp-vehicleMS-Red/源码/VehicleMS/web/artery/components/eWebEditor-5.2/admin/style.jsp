<%@ page contentType="text/html;charset=gb2312" pageEncoding="gb2312" session="true"%>
<%request.setCharacterEncoding("gb2312");%>
<jsp:useBean id="eWebEditor" class="ewebeditor.admin.style_jsp" scope="page"/>
<%
eWebEditor.Load(pageContext);
%>
