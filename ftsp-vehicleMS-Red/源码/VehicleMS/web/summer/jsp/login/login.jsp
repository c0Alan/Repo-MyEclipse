<%@ page language="java" pageEncoding="UTF-8"
  contentType="text/html;charset=UTF-8"%>
<%@ include file="/summer/jsp/head/taglibs.jsp"%>
<html:html>
<head>
  <title>user login</title>
  <script type="text/javascript">
  	function doFocus(){
  		document.getElementById("j_username").focus();
  	}
    function beforeSubmit(){
      document.getElementsByName("username")[0].value = 
        document.getElementsByName("j_username")[0].value;
      document.getElementsByName("password")[0].value = 
        document.getElementsByName("j_password")[0].value;
    }
  </script>
  <html:base />
</head>
<body bgcolor="white" onload="doFocus()">
  <form id="loginForm" action="<html:rewrite page='/login.do?action=login'/>"
    method="post" enctype="multipart/form-data" onsubmit="beforeSubmit()">
    username:&nbsp;&nbsp;
    <input type="text" name="j_username" />
    <br>
    password:&nbsp;&nbsp;
    <input type="text" name="j_password" />
    <br>
    <input type="hidden" name="action" value="login_" />
    <input type="hidden" name="username" />
    <input type="hidden" name="password" />
    <input type="hidden" name="userNo" value="123" />
    <input type="submit" value="submit" />
  </form>
  <html:errors />
</body>
</html:html>
