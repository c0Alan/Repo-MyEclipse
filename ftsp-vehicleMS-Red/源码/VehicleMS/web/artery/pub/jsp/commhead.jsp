<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html"%>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic"%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.thunisoft.com/summer/ui" prefix="ui"%>
<%
response.setHeader("Pragma", "No-cache");
response.setHeader("Cache-Control", "no-cache");
response.setDateHeader("Expires", 1);
request.setAttribute("contextPath", request.getContextPath());
%>
<%@ include file="/summer/component/common/sys.jsp"%>
<%-- for ext --%>
<link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/parse/css/ext-all.css'/>" />
<script type="text/javascript" language='javascript' src="<c:url value='/artery/components/ext-3.0/adapter/ext/ext-base.js'/>"></script>
<script type="text/javascript" language='javascript' src="<c:url value='/artery/components/ext-3.0/ext-all.js'/>"></script>
<script type="text/javascript" language='javascript' src="<c:url value='/artery/pub/js/ext-lang-zh_CN.js'/>"></script>
<script>
  Ext.SSL_SECURE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
  Ext.BLANK_IMAGE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
  Ext.enableGarbageCollector = false;
</script>
<%-- special for artery --%>
<link rel="stylesheet" type="text/css" href="<c:url value='/artery/pub/css/artery.css'/>" />
<script type="text/javascript" language='javascript' src="<c:url value='/artery/pub/js/artery-pub.js'/>"></script>
<script type="text/javascript" language='javascript' src="<c:url value='/artery/pub/js/ext-pub.js'/>"></script>
<script type="text/javascript" language='javascript' src="<c:url value='/artery/pub/js/tip-message.js'/>"></script>
