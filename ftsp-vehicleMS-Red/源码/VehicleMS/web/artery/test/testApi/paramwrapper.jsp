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
public class ParameterWrapper {

	/**
	 * 获取cookie
	 * 
	 * @return 将cookie封装到了一个Map中
	 */
	public Map getCookieMap();

	/**
	 * 获取请求参数
	 * 
	 * @return Map 将请求中各种参数封装到了一个Map中
	 */
	public Map getRequestMap();

	/**
	 * 取得Session
	 * 
	 * @return Map 将Session中各种参数封装到了一个map中
	 */
	public Map getSessionMap();

	public Map getApplicationMap();

	/**
	 * 获取Http 请求
	 * 
	 * @return HttpServletRequest
	 */
	public HttpServletRequest getRequest();

	/**
	 * 获取Http 反馈
	 * 
	 * @return HttpServletResponse
	 */
	public HttpServletResponse getResponse();

	/**
	 * 根据对象的键值返回对象
	 * 
	 * @param key
	 *            对象名
	 * @return Object 对象
	 */
	public Object get(String key);
  
	/**
	 * 向包装器中填充一个对象
	 * 
	 * @param key
	 *            对象名
	 * @param value
	 *            Object 对象
	 */
	public void set(String key, Object value);
}
          </pre>
  </body>
</html>
