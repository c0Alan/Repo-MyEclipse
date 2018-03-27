<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>报表布局制作</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/pub/console/contree.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/frame/make/css/formEditor.css'/>">
    <style type="text/css">
<%=EformUtil.getConsoleCSS()%>
    </style>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/xmlUtil.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/report/make/js/makeLayout.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/formEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/chartEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/editor.js'/>"></script>
    <script type="text/javascript">
      var sqlTips = "";
      var formtpl={};
      formtpl.id="<c:out value='${id}'/>";
      formtpl.complibId="<c:out value='${complibId}'/>";
      var va = <c:out value='${templateXml}' escapeXml='false'/>;
      formtpl.template = va.xml;
      formtpl.dom=loadXMLString(formtpl.template);
      
      Ext.onReady(function(){
          Ext.QuickTips.init();
          initLayout();
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("button_save").disable();
          </c:if>
          
          // 选中根节点
          reportTree.fireEvent("click",reportTree.root);
          reportTree.root.expand(false, true);
          
          Ext.getBody().addKeyMap([{
            key : Ext.EventObject.S,
            ctrl : true,
            fn : saveTpl
          },{
            key : Ext.EventObject.D,
            ctrl : true,
            fn : previewForm
          },{
            key : Ext.EventObject.DELETE,
            ctrl : false,
            fn : delNode
          }]);
          
          Ext.getBody().focus();          
      });
    </script>
</head>
<body>
</body>
</html>

