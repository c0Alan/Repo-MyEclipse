<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>表单关联情况查询</title>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/listRelForm.js'/>"></script>
    <script type="text/javascript">
        var formInfo={};
        formInfo.formid="<c:out value='${formid}'/>";
        formInfo.formname="<c:out value='${formname}'/>";
        formInfo.complibId="<c:out value='${complibId}'/>";
    </script>
</head>
<body>
</body>
</html>