<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<title>测试chart编辑器</title>
    <script type="text/javascript">
    Ext.ns("AtyCon");
    </script>
    <script type="text/javascript" src="<c:url value='/artery/arteryPlugin/image/chartArea/FusionCharts.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/chartEditor.js'/>"></script>
    <script type="text/javascript">
    Ext.onReady(function(){
      var editor = new AtyCon.ChartEditor();
      editor.edit({
        chartType: "AngularGauge",
        showBorder: "1"
      },function(info){
        alert(info);
      });
    });
    </script>
  </head>
  <body>
  </body>
</html>
