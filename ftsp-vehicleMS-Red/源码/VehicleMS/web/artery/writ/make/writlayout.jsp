<%@ page language="java" pageEncoding="UTF-8"  %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>文书模板布局</title>
    <style type="text/css">
<%=EformUtil.getConsoleCSS()%>
    </style>
	<script language='javascript' src="<html:rewrite page='/artery/writ/make/js/writlayout.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/formEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/editor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/chartEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/arteryConsole/complib/js/xmlUtil.js'/>"></script>
    <script type="text/javascript">
      var sqlTips = "";
      var formtpl={};
      formtpl.id="<c:out value='${id}'/>";
      formtpl.complibId="<c:out value='${complibId}'/>";
      
      var EditorObject = null;
      
      Ext.onReady(function(){
          // 通过ajax方法，加载xml
          var map = new Map();
          map.put("key", "writmake.loadLayout");
          map.put("id","<c:out value='${id}'/>");
          map.put("complibId","<c:out value='${complibId}'/>");
          var query = new QueryObj(map);
          query.send();
          formtpl.template = query.getDetail();
          formtpl.dom=loadXMLString(formtpl.template);
      
          Ext.QuickTips.init();
          initWritTree();
          
          EditorObject = new AtyCon.PropEditor();
          propsPanel=EditorObject.init({
			region: "center",
			editorTips: sqlTips
		  });
          initLayout();
          
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("toolbar_save").disable();
          </c:if>
          
          // 选中根节点
          writTree.fireEvent("click",writTree.root);
          writTree.root.expand(false, true);
          
          Ext.getBody().addKeyMap([{
            key : Ext.EventObject.S,
            ctrl : true,
            fn : saveLayout
          },{
            key : Ext.EventObject.D,
            ctrl : true,
            fn : function(){previewWrit('display');return true;}
          },{
            key : Ext.EventObject.U,
            ctrl : true,
            fn : function(){previewWrit('update');return true;}
          },{
            key : Ext.EventObject.DELETE,
            ctrl : false,
            fn : function(){delNode();return true;}
          }]);
          
          Ext.getBody().focus();
      });
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
