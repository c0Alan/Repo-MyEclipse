<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <html:base />
    <title>beanshell可用的公共上下文api调用说明</title>
    <script src="<html:rewrite page='/artery/components/textEditor/swfobject.js'/>"></script>
    <script src="<html:rewrite page='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript">
    Ext.onReady(function(){
        
        var codePanel = new CodePanel({
            language: "java"
        });
        codePanel.setCode(document.getElementById("myCode").innerText.replace(/\r/g,""));
        
        new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[codePanel]
        });
    });
    </script>
  </head>
  <body>
    <pre style="display: none;" id="myCode">
public class Session {
    public String userid;
    public String username;
    public String deptid;
    public String deptname;
    public String corpid;
    public String corpname;
    public String ip;
    public String os;
    public String browser;
    public String email;
    public String identifier;
}
</pre>
  </body>
</html>
