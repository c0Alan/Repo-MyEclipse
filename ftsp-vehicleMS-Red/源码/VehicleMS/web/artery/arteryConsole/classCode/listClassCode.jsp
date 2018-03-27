<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>分级代码维护</title>
	<script type="text/javascript" src="<c:url value='/artery/arteryConsole/classCode/js/listClassCode.js'/>"></script>     
    <script type="text/javascript">
        
    var tabs;
    
    var sCcNames='<c:out value="${sCcNames}" />';
    var arrayCcNames=sCcNames.split(";");
    var iCcNum=arrayCcNames.length;
             
    Ext.onReady(function(){			
		initTabs();
		new Ext.Viewport({
			layout:'fit',
			border:false,
			hideBorders :true,    	
			items:[tabs]
		});
    });
    </script>
  </head>
  <body>    
  </body>
</html>
