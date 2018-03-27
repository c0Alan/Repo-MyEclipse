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
public class App {
    
    /**
     * 得到当前法院代码
     * 
     * @return
     */
    public static int getCurrCorpCode();

    /**
     * 得到当前法院名称
     * 
     * @return
     */
    public static String getCurrCorpName();
    
    /**
     * 得到ContextPath
     * 
     * @return ContextPath
     */
    public static String getContextPath();
    
    /**
     * 得到request 注意：此方法只能在http请求上下文环境中调用，否则报错
     * 
     * @return
     */
    public static HttpServletRequest getRequest();
    
    /**
     * 得到response 注意：此方法只能在http请求上下文环境中调用，否则报错
     * 
     * @return
     */
    public static HttpServletResponse getResponse();
    
    /**
     * 生成uuid的方法
     * @return
     */
    public static String getUUID();
    
    /**
     * 校验用户是否拥有指定权限<br>
     * 1、权限表达式为空则返回true<br>
     * 
     * @param request HttpServletRequest
     * @param rightExpress 权限表达式
     * @return true|false
     */
    public static final boolean hasRight(HttpServletRequest request, String rightExpress);
    
    /**
     * 校验用户是否拥有指定权限<br>
     * 1、权限表达式为空则返回true<br>
     * 
     * @param rightExpress 权限表达式
     * @return true|false
     */
    public static final boolean hasRight(String rightExpress);
    
    /**
     * 得到基础设置中的值
     * 
     * @param sKey
     * @return
     */
    public static String getBaseCfgValue(String sKey);
}
          </pre>
  </body>
</html>