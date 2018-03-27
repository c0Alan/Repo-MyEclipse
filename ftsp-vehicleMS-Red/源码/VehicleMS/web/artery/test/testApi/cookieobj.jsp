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
public class CookieUtil {
    /**
     * 得到cookie值
     * 
     * @param cookieName
     * @param defaultValue
     * @return
     */
    public static String getCookieValue(String cookieName, String defaultValue);
    /**
     * 根据name得到cookie
     * @param name
     * @return
     */
    public static Cookie getCookie(String name);

    /**
     * 删除指定name的cookie
     * @param name
     */
    public static void deleteCookieByName(String name);
    
    /**
     * 删除cookie
     * @param cookie
     */
    public static void deleteCookie(Cookie cookie);

    /**
     * 设置cookie
     * @param name
     * @param value
     */
    public static void setCookie(String name, String value);

    /**
     * 设置cookie
     * @param name
     * @param value
     * @param maxAge
     */
    public static void setCookie(String name, String value, int maxAge);
}
          </pre>
  </body>
</html>
