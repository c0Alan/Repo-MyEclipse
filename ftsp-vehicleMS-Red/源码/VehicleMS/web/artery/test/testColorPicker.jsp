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
    Ext.onReady(function(){
        var picker = new Ext.ux.ColorPicker( {
            hidePanel: false,
            renderTo: Ext.get('xcolorPicker'),
            title: 'Pick Color',
            collapsible: true,
            autoHeight: true,
            shadow: true,
            captions: {
                red: 'red',
                green: 'grn',
                blue: 'blue',
                hue: 'hue',
                saturation: 'sat',
                brightness: 'val',
                hexa: 'col.',
                websafe: 'Safe'
            },
            rgb: { r:238, g:238, b:238 },
            animate: true
        });
    });
    </script>
  </head>
  <body>
    <div id="xcolorPicker" class="x-dlg-proxy" style="width:540px;border:2px dashed red;padding:5px 0 0 5px;background:#EEEEEE;"></div>
  </body>
</html>
