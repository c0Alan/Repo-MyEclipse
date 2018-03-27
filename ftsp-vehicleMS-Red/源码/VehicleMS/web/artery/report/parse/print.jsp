<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%=EformUtil.getPubCSS() %>
<style>
	.x-crs-display{
		display:none;
	}
</style>
<script type="text/javascript">
	if(opener.Ext.getDom("reportStyle")){
	document.write('<style id="reportStyle">');
	document.write(opener.Ext.getDom("reportStyle").innerHTML);
	document.write('</style>');
	}
	if(opener.Ext.getDom("formStyle")){
	document.write('<style id="formStyle">');
	document.write(opener.Ext.getDom("formStyle").innerHTML);
	document.write('</style>');
	}
</script>
<script src="<html:rewrite page='/artery/arteryPlugin/image/chartArea/FusionCharts.js'/>"></script>
<script src="<html:rewrite page='/artery/report/parse/js/report-print.js'/>"></script>
</head>
<OBJECT classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2" height=0 id=wb name=wb width=0 style="display: none"></OBJECT>
<object id="factory" style="display:none"
   classid="clsid:1663ed61-23eb-11d2-b92f-008048fdd814"
   codebase="<c:url value="/artery/components/scriptX/smsx.cab#Version=6,4,438,06"/>">
</object>
<body style="overflow:auto;">
<div id="toolbarDiv"></div>
<div id="resultDiv" style="text-align:center;"></div>
</body>
</html>