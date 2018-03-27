<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ page import="java.util.Map" %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>

<%
  response.setHeader("Pragma", "No-cache");
  response.setHeader("Cache-Control", "no-cache");
  response.setDateHeader("Expires", 1);
  request.setAttribute("contextPath", request.getContextPath());
  Map condMap = (Map)request.getAttribute("condMap");
%>

<html>
  <head>
    <title>高级查询结果</title>
    <%=EformUtil.getPubCSS() %>
    <script language="javascript">
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
    <script type="text/javascript">
        // for ext
        Ext.SSL_SECURE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
        Ext.BLANK_IMAGE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
        Ext.enableGarbageCollector = false;
    </script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/search/js/list.js'/>"></script>
    <script type="text/javascript">
    var storeJsonConf = <c:out value="${storeJson}" escapeXml="false"/>;
    var gridJsonConf = <c:out value="${gridJson}" escapeXml="false"/>;
    var condJsonConf = <%=condMap.get("condArray")%>;
    var cid = '<c:out value="${cid}" escapeXml="false"/>';
    Ext.onReady(function(){
        initLayout();
    });
    Artery.cfg_condPanel = {};
    
    <%=condMap.get("json")%>;
    </script>
    <style type="text/css">
    .x-table-layout-cell{
      width: 33%;
    }
    .x-table-layout{
      width: 100%;
      table-layout: fixed;
    }
    </style>
</head>
<body scroll="no">
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;height:100%;">
  <tr>
    <td>
      <%=condMap.get("html")%>
    </td>
  </tr>
  <tr>
    <td height="100%">
      <div id="search_result" style="height: 100%;width: 100%;overflow: hidden;"></div>
    </td>
  </tr>
</table>
</body>
</html>