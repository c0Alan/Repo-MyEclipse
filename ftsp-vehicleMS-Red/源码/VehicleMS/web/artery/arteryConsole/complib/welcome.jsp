
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%
	String path = request.getContextPath();
%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>统计目录表单</title>
		<style type="text/css">
td {
	border: 1px solid gray;
	font: 12px;
	padding-left: 5px;
}

hr {
	border: 1px solid #99BBE8;
}
</style>
	</head>
	<body>
		<!--统计数-->
		<div>
		
		<div
			style=' float:left;padding-left: 5px; padding-right: 5px; padding-top: 10px; padding-bottom: 2px;width:49%;'>
			<table width="100%" align='left' border='0' cellspacing='0'
				cellpadding='3'
				style='border-collapse: collapse; word-break: break-all'>
				<tr height="25">
					<td width="20%" >
						&nbsp;
					</td>
					<td width="20%" >
						<b>form表单</b>
					</td>
					<td width="20%">
						<b>报表表单</b>
					</td>
					<td width="20%">
						<b>文书表单</b>
					</td>
					<td width="20%">
						<b>外挂表单</b>
					</td>
				</tr>
				<tr height="25">
					<td width="10%">
						<b>数量</b>
					</td>
					<td style='padding-right: 5px; ' align="right">
						<c:out value="${sysType[0]}" />
					</td>
					<td style='padding-right: 5px; ' align="right">
						<c:out value="${sysType[1]}" />
					</td>
					<td width="10%" style='padding-right: 5px; ' align="right">
						<c:out value="${sysType[2]}" />
					</td>
					<td width="10%" style='padding-right: 5px; ' align="right">
						<c:out value="${sysType[3]}" />
					</td>
				</tr>
				<tr height="25">
					<td width="10%" style='padding-right: 5px; '>
						<b>合计</b>
					</td>
					<td colspan="4" style='padding-right: 5px; ' align="right">
						<c:out value="${sysType[5]}" />
					</td>
				</tr>
				<c:if test="${sysType[5] > 0}">
					<tr>
						<td colspan="5" style='border: none' width="100%">
							<img
								src="<%=path%>/artery/complib.do?action=getStat&id=<c:out value='${cid}'/>"
								width=360 height=320 border=0>
						</td>
					</tr>
				</c:if>
			</table>
		</div>

		<!--代码量-->
		<div
			style='float:left;padding-left: 5px; padding-right: 5px; padding-top: 10px; padding-bottom: 2px;width:49%; float:left;'>
			<table width="100%" align='left' border='0' cellspacing='0'
				cellpadding='3' style='border-collapse: collapse;'>
				<tr height="25">
					<td width="25%">
						&nbsp;
					</td>
					<td width="25%">
						<b>java</b>
					</td>
					<td width="25%">
						<b>js</b>
					</td>
					<td width="25%">
						<b>sql</b>
					</td>
				</tr>
				<tr height="25">
					<td>
						<b>数量</b>
					</td>
					<td style='padding-right: 5px; ' align="right">
						<c:out value="${codeNum[0]}" />
					</td>
					<td style='padding-right: 5px; ' align="right">
						<c:out value="${codeNum[1]}" />
					</td>
					<td style='padding-right: 5px; ' align="right">
						<c:out value="${codeNum[2]}" />
					</td>
				</tr>
				<tr height="25">
					<td>
						<b>合计</b>
					</td>
					<td colspan="3" style='padding-right: 5px;' align="right">
						<c:out value="${codeNum[0]+codeNum[1]+codeNum[2]}" />
					</td>
				</tr>
				<c:if test="${sysType[5] > 0}">
					<tr>
						<td colspan="4" style='border: none'>
							<img
								src="<%=path%>/artery/complib.do?action=getCodeStat&java=<c:out value='${codeNum[0]}'/>&js=<c:out value='${codeNum[1]}'/>&
								sql=<c:out value='${codeNum[2]}'/>
								"
								width=360 height=320 border=0>
						</td>
					</tr>
				</c:if>
			</table>
		</div>
		<div style="clear:both"></div>
		</div>
	</body>
</html>
