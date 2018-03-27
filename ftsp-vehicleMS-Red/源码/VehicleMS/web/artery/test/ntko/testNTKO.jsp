<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>测试NTKO控件</title>
    <script>
    var ntkoObj = null;

    function saveToServer(){
      alert("saveToServer");
      var url = "sample.do?action=testNTKOSave";
      var fileFieldName = "ntkoFile";
      var params = "a=b&b=c";
      var fileName = "testNTKOFile.doc";
      var formName = "ntkoForm";
      ntkoObj.SaveToURL(url,fileFieldName,params,fileName,formName);
    }
    
    Ext.onReady(function(){
        ntkoObj = document.getElementById("ntkoObj");
        ntkoObj.BeginOpenFromURL("ntko/ntkoTestFile.doc");
    });
    </script>
  </head>
  <body>
    <div id="testActivePanel" style="border: 2px solid red;width: 500px;height: 500px;">
      <object id="ntkoObj" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
        codebase="/artery/arteryConsole/ocx/OfficeControl.cab#version=4,0,3,2" width="100%" height="100%"></object>
    </div>
    <button onclick="saveToServer();">保存文件</button>
    <form id="ntkoForm" action="sample.do?action=testNTKOSave" enctype="multipart/form-data;charset=utf-8">
      <input name="param1" value="100" type="text">
    </form>
  </body>
</html>
