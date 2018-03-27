<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/relationUrl.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/popXml.js'/>"></script>
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/RowExpander.js'/>"></script>
		<script type="text/javascript"
			src="<c:url value='/artery/arteryConsole/complib/js/formEditor.js'/>"></script>
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/relation.js'/>"></script>
		<script language='javascript'
			src="<html:rewrite page='/artery/report/make/js/xml2json.js'/>"></script>
		<script type="text/javascript">
        var readOnly = '<c:out value="${readOnly}"/>';
        var reportParams = {};
		reportParams.id = "<c:out value='${id}'/>";
		reportParams.complibId = "<c:out value='${complibId}'/>";
        </script>
	</head>
	<body>
		<ui:hidden name="relationStr" />
	</body>
</html>
