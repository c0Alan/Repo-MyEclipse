<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>分级代码维护-树</title>
    <script type="text/javascript">
    var toolbar;
    var classCodeTree;
    var indexCC='<c:out value="${indexCC}"/>';
    var rootCode='<c:out value="${rootCode}"/>';
    var rootName='<c:out value="${rootName}"/>';
    
    </script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/classCode/js/showClassCodeTree.js'/>"></script>
    <script type="text/javascript">
    
    function init() {
    	initToolbar();
    	makeClassCodeTree();    	
    }
    
    function initLayout(){
      var mp = new Ext.Panel({
        layout:'border',
        border:false,
        hideBorders :true,
        tbar: toolbar,
        items:[{
          region:'west',
          margins:'4 0 4 4',
          border:true,
          autoScroll:true,
          split:true,
          width:200,
          items:[classCodeTree]
        },{
          region:'center',
          margins:'4 4 4 0',
          border:true,
          autoScroll: true,
          html:{
            id:'inner_iframe',
            name:'inner_iframe',
            tag:'iframe',
            frameborder:0,
            style:'width:100%;height:100%',
            src:''
          }
        }]
      });
	  new Ext.Viewport({
        layout: "fit",
	    items: mp
	  });
	}
             
    Ext.onReady(function(){			
		init();
		initLayout();
    });
    </script>
  </head>
  <body>
  	<div style="display: none;">
  	  <iframe id="exportClassCode_frame"></iframe>
  	</div>
  </body>
</html>
