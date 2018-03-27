<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>form表单制作--界面制作</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/forminterface.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/make/css/datadict.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/pub/console/contree.css'/>">
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/frame/make/css/formEditor.css'/>">
    <script type="text/javascript" src="<c:url value='/artery/form/make/js/forminterface.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/form/make/js/datadict.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/form/make/js/formtree.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/swfobject.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/frame/make/js/formEditor.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/artery/frame/make/js/editor.js'/>"></script>
    <script type="text/javascript">
      var sqlTips = "";
      var formtpl={};
      formtpl.id="<c:out value='${id}'/>";
      
      Ext.onReady(function(){
          // 通过ajax方法，加载xml
          var map = new Map();
          map.put("key", "formmake.loadFormXML");
          map.put("id","<c:out value='${id}'/>");
          var query = new QueryObj(map);
          query.send();
          formtpl.template = query.getDetail();
          formtpl.dom=loadXMLString(formtpl.template);
      
          Ext.QuickTips.init();
          initDictTree();
          initFormTree();
          initSqlWindow();
          propsPanel=EditorObject.initPropPanel('center',{
            editorTips: sqlTips
          });
          initLayout();
          
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("toolbar_save").disable();
          </c:if>
          
          // 选中根节点
          dictTree.fireEvent("click",dictTree.root);
          formTree.fireEvent("click",formTree.root);
          formTree.root.expand(false, false,function(node){
              node.eachChild(function(innerNode){
                  innerNode.expand(false,false);
              });
          });
          
          Ext.getBody().addKeyMap([{
            key : Ext.EventObject.S,
            ctrl : true,
            fn : saveTpl
          },{
            key : Ext.EventObject.D,
            ctrl : true,
            fn : function(){previewForm('display');return true;}
          },{
            key : Ext.EventObject.U,
            ctrl : true,
            fn : function(){previewForm('update');return true;}
          },{
            key : Ext.EventObject.I,
            ctrl : true,
            fn : function(){previewForm('insert');return true;}
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

