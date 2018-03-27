<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<html>
  <head>
    <title>代码编辑器</title>
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/artery/form/parse/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/artery/pub/console/contree.css">
    <style type="text/css">
<%=EformUtil.getConsoleCSS()%>
    </style>
    <script type="text/javascript" src="<%=request.getContextPath()%>/artery/components/ext-3.0/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/artery/components/ext-3.0/ext-all-debug.js"></script>
    <script type="text/javascript" language="javascript" src="<%=request.getContextPath()%>/artery/pub/js/ext-lang-zh_CN.js"></script>
    <script src="<%=request.getContextPath()%>/summer/component/common/util.js"></script>
    <script src="<%=request.getContextPath()%>/summer/component/ajax/xmlhttp.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/artery/components/textEditor/swfobject.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/artery/components/textEditor/CodePanel.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/artery/components/textEditor/dialogEditor.js"></script>
    <script type="text/javascript">
    Sys.DEFAULT_PLUGIN_PATH = "/summer/component";
    sys = new Sys();
    function Sys() {
      this._pluginPath = Sys.DEFAULT_PLUGIN_PATH;
    }
    Sys.prototype.getContextPath = function(){
      var ctxpath =  "<%=request.getContextPath()%>";
      return ctxpath;
    }
    Sys.prototype.setPluginPath = function(path) {
      this._pluginPath = path;
    }
    Sys.prototype.getPluginPath = function() {
      return this.getContextPath() + this._pluginPath;
    }
    
    Ext.SSL_SECURE_URL= "<%=request.getContextPath()%>/artery/form/parse/images/default/s.gif";
    Ext.BLANK_IMAGE_URL= "<%=request.getContextPath()%>/artery/form/parse/images/default/s.gif";
    var sqlTips = "";
    Ext.onReady(function(){
      var lastConf = null;
      if(Ext.isIE){
        lastConf = window.dialogArguments;
      }else{
        var propEditor = window.opener.AtyCon.Form_Layout.getPropEditor();
        lastConf = propEditor.lastConf;
      }
      if(lastConf){
        initLayout(lastConf);
      }else{
        var conf = {
          language: "script",
          code: "{\"client\":\"var a=0;\",\"server\":\"var b=0;\"}",
          tips: "aaa,aaa.bbb;bbb,bbb.ccc",
          help: "这时测试帮助",
          name: "生成时脚本",
          callback: function(codeValue){
            alert("callback____"+codeValue);
          }
        };
        initLayout(conf);
      }
    });
    </script>
  </head>
  <body>
  </body>
</html>