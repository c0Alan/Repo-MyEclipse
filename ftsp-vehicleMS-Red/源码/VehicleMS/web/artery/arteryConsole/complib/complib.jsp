<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
<%
 //解决 java.lang.IllegalStateException: 
 //getOutputStream() has already been called for this response
 //这个问题
 if(request.getAttribute("error") != null){
   out.clear();
   out=pageContext.pushBody(); 
 }
 %>
  <head>
    <title>构件库维护</title>
    <script type="text/javascript">
        Ext.ns("AtyCon");
    </script>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/arteryConsole/complib/complib.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/forminterface.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/datadict.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/pub/console/contree.css'/>">
    <style type="text/css">
<%=EformUtil.getConsoleCSS()%>
    </style>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/frame/make/css/formEditor.css'/>">
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/xmlUtil.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/formEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryPlugin/image/chartArea/FusionCharts.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/chartEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/editor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/rightEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/complib.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/formMake.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/con_make.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/con_params.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/con_ds.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/parseNameProp.js'/>"></script>
    <script type="text/javascript">
        var specialPluginInfo = <c:out value='${specialPluginInfo}' escapeXml="false"/>;
        var sqlTips = "";
    	function releaseIFrame(){
          Ext.get("iframeCnt").dom.src = "javascript:false";
        }
        var rightTreeJson = <c:out value='${rightKeyJson}' escapeXml="false"/>;
        var dataSourceStore = <c:out value='${dataSource}' escapeXml="false"/>;
        var hasUserDataSource = <c:out value='${hasUserDataSource}' escapeXml="false"/>; 
        
        Ext.onReady(function(){
            Ext.QuickTips.init();
            AtyCon.CompManager.init();
            //定位指定的表单
            AtyCon.CompManager.findFormById("<c:out value='${formId}' escapeXml="false"/>");
        });
        
        var complib={};
        complib.selectid="<c:out value='${cid}'/>";
        complib.complibId="<c:out value='${complibId}'/>";
        complib.selectStr="<c:out value='${selStr}'/>";
    </script>
</head>
<body>
  <div id="cfgWindow_center">
    <table align="center" style="margin-top: 100px;">
      <tr>
        <td>
          <div id="center_addButton"></div>
        </td>
      </tr>
      <tr>
        <td>
          <div id="center_deleteButton" style="margin-top: 15px;"></div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>