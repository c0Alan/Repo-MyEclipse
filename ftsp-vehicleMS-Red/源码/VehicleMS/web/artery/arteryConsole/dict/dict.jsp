<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>数据字典维护</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/arteryConsole/dict/dict.css'/>" />
    <script src="<c:url value="/artery/pub/js/ext-plugin.js"/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/dict/js/dict.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/dict/js/fieldList1.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/dict/js/reverse.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/dict/js/tableList1.js'/>"></script>
    <script type="text/javascript">
    // 字段类型元数据
    var fieldTypeList = <c:out value="${fieldTypeStr}" escapeXml="false"/>;
    var tableExtendList = <c:out value="${tableExtendStr}" escapeXml="false"/>;
    
    Ext.onReady(function(){
        Ext.QuickTips.init();
        initLayout();
    });
    </script>
</head>
<body>
  <div id="reverseWindow_center">
    <table align="center" style="margin-top: 15px;">
      <tr>
        <td>
          <div id="reverseWindow_center_addButton"></div>
        </td>
      </tr>
      <tr>
        <td>
          <div id="reverseWindow_center_deleteButton" style="margin-top: 15px;"></div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>