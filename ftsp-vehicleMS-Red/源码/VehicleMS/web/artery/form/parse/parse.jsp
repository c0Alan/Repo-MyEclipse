<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" buffer="100kb" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ page import="com.thunisoft.artery.util.ArteryUtil" %>
<%@ page import="com.thunisoft.artery.module.monitor.domain.RunDetail" %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ page import="com.thunisoft.artery.support.filter.ArteryThread" %>
<%@ page import="com.thunisoft.artery.parse.support.ConfigureLoader" %>

<%
RunDetail rd = (RunDetail)request.getAttribute("logic_to_jsp");
rd.endDetail("logic跳转到jsp");
rd = ArteryThread.getRunRecord().createDetail();
response.setDateHeader("Expires", 0);
request.setAttribute("contextPath", request.getContextPath());
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
<!-- Powered by Artery <%=ConfigureLoader.getArteryVersion() %> -->
<title><c:out value="${formName}" escapeXml="false"/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />

<%=EformUtil.getPubCSS() %>
<style id="formStyle">
  <c:out value="${style}" escapeXml="false"></c:out>
</style>
<!--[if lt IE 7]>
	<%=EformUtil.getFixPngCSS() %>
<![endif]--> 
<script language="javascript">
var aty_start_time=new Date().getTime();
Sys.DEFAULT_PLUGIN_PATH = "/summer/component";
sys = new Sys();
function Sys() {
  this._pluginPath = Sys.DEFAULT_PLUGIN_PATH;
}
Sys.prototype.getContextPath = function(){
  var ctxpath =  "<%=request.getContextPath()%>";
  return ctxpath;
}
Sys.prototype.setPluginPath = function(path) {
  this._pluginPath = path;
}
Sys.prototype.getPluginPath = function() {
  return this.getContextPath() + this._pluginPath;
}
</script>

<%=EformUtil.getPluginJs() %>
<jsp:include page='<%=ArteryUtil.getBaseCfgValue("artery.userhead")%>'/>
<script type="text/javascript">
// for ext
Ext.SSL_SECURE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
Ext.BLANK_IMAGE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
Ext.enableGarbageCollector = false;
Ext.tusc.TIP_DEFERTIME = '<%=ArteryUtil.getBaseCfgValue("artery.tips.deferTime")%>';
Artery.params = <c:out value="${params}" escapeXml="false"/>;
Artery.userParams = <c:out value="${userParams}" escapeXml="false"/>;
Artery.parseId ="<%=request.getAttribute("aty_parseId")%>";
Artery.linktoParams = <c:out value="${linktoParams}" escapeXml="false"/>;
Artery.errors = "<c:out value="${errors}" escapeXml="false"/>";
Artery.config = <c:out value="${atycfg}" escapeXml="false"/>;
Artery.userInfo = <c:out value="${atyUserInfo}" escapeXml="false"/>;
<c:out value="${script}" escapeXml="false"/>
</script>

<c:out value="${import}" escapeXml="false"/>
</head>
<c:out value="${html}" escapeXml="false"/>
<div style="display:none;">
<form id="arteryCommForm" action="post"></form>
</div>
<script type="text/javascript">
Artery.initSubItems(Artery.cfg_bodyPanel);
if (!Ext.isEmpty(Artery.errors)) {
	Artery.showError(Artery.errors);
}
/*try{
	document.body.focus();
}catch(e){
	// 忽略异常
}*/
</script>
</html>
<%
rd.endDetail("jsp执行时间");
%>