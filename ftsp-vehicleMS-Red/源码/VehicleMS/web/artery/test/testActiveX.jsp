<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>测试ActiveX</title>
    <script src="<html:rewrite page='/artery/form/parse/js/plugin/Select.js'/>"></script>
    <script type="text/javascript" language='javascript' src="<c:url value='/artery/form/parse/js/parse-form.js'/>"></script>
    <script>
    
    function showActivePanel(){
        var panel = new Ext.tusc.ActivePanel({
            tbar: [{
                text: "加载flash",
                handler: function(){
                    var ap = Ext.getCmp("activePanel_id");
                    ap.clearAllParam();
                    ap.codebase = "/artery/arteryConsole/ocx/swflash.cab#version=9,0,28,0";
                    ap.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000";
                    ap.putParam("movie","/Artery/artery/pub/images/login/fl.swf");
                    ap.showActive();
                }
            },{
                text: "加载NTKO",
                handler: function(){
                    var ap = Ext.getCmp("activePanel_id");
                    ap.clearAllParam();
                    ap.codebase = "/artery/arteryConsole/ocx/OfficeControl.cab#version=4,0,3,2";
                    ap.classid = "clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404";
                    ap.putParam("MakerCaption","北京紫光华宇软件股份有限公司");
                    ap.putParam("MakerKey","38B4D34C447C7535C0060C51FF5707A8812BCC51");
                    ap.putParam("ProductCaption","通用MIS系统构建平台");
                    ap.putParam("ProductKey","F2AFEE15E32A9E589BD5B11CF1AFFC158A9F9D41");
                    ap.showActive();
                }
            },{
                text: "NTKO-另存为",
                handler: function(){
                    var ap = Ext.getCmp("activePanel_id");
                    var act = ap.active;
                    if(!act){
                        return ;
                    }
                    act.ShowDialog(3);
                }
            }],
            id: "activePanel_id",
            height: 400,
            width: 600
        });
        
        panel.render("testActivePanel");
    }
    
    Ext.onReady(function(){
        showActivePanel();
    });
    </script>
  </head>
  <body>
    <div id="testActivePanel"></div>
  </body>
</html>
