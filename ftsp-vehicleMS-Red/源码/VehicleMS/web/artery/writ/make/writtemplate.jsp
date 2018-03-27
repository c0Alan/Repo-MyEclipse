<%@ page language="java" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>文书模板编辑页面</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/writ/make/css/writtemplate.css'/>" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/parse/css/form-parse.css'/>" />

    <script src="<html:rewrite page='/artery/arteryPlugin/pub/Artery.js'/>"></script>
	<script src="<html:rewrite page='/artery/arteryPlugin/pub/parse-pub.js'/>"></script>
	<script src="<html:rewrite page='/artery/arteryPlugin/writ/writTplContainer/NTKOPanel.js'/>"></script>
    <script src="<html:rewrite page='/artery/writ/make/js/writtemplate.js'/>"></script>
    
    <script type="text/javascript">
      var writTpl={};
      writTpl.id="<c:out value='${writTpl.id}'/>";
      writTpl.complibId="<c:out value='${writTpl.complibId}'/>";
      writTpl.tplSize=<c:out value='${tplSize}'/>;
      // 通过ajax方法，加载xml
      var map = new Map();
      map.put("key", "writmake.loadMarks");
      map.put("id",writTpl.id);
      map.put("complibId",writTpl.complibId);
      var query = new QueryObj(map);
      query.send();
      writTpl.dom=loadXMLString(query.getDetail());      
      
      Ext.onReady(function(){
          Ext.QuickTips.init();
          var writTemplate = new WritTemplate();
          writTemplate.init();
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("button_save").disable();
          </c:if>
      });
    </script>
  </head>
  <body>
    <div style="display:none">
      <form id="uploadForm" action="writmake.do?action=uploadFile"
        enctype="multipart/form-data;charset=utf-8">
        <textarea id="xml" name="xml"></textarea>
      </form>
    </div>
  </body>
</html>
