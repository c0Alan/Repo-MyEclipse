<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>表间关系列表</title>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/dict/js/relList.js'/>"></script>
    <script type="text/javascript">
    	var relExtendList = <c:out value="${relExtends}" escapeXml="false"/>;
        // 表列表Store
        var tableStore = new Ext.data.JsonStore({
            url: '<c:url value="/artery/dict/dealDict.do?action=loadAllTableJson"/>',
            root:'tableList',
            fields:['tableId','tableName']
        });
        tableStore.load();
        // 子表列表Store
        var subtableStore = new Ext.data.JsonStore({
            url: '<c:url value="/artery/dict/dealDict.do?action=loadAllTableJson"/>',
            root:'tableList',
            fields:['tableId','tableName']
        });
        subtableStore.load();
        
        // 每页显示记录条数
        var pageSizeConfig = 20;
    </script>
  </head>
<body>
</body>
</html>

