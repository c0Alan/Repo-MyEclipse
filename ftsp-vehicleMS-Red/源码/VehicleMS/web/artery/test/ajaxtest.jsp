<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/summer/component/common/sys.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>AjaxTest</title>
		<style>
td{
	font-size:9pt;
}
body{
	font-size:9pt;
}
h1{
	font-size:14pt;
}
h2{
	font-size:12pt;
}
</style>
	</head>
	<body>
		<a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
		<h1>
			Ajax Test
		</h1>
		<br>
		<h2>
			Response Str
		</h2>
		<table width="548" border="1" cellpadding="0" cellspacing="0"
			bordercolor="#999999" bgcolor="#FFFFFF">
			<tr>
				<td width="291">
					&nbsp;
				</td>
				<td width="241">
					<strong>Message:</strong>
				</td>
			</tr>
			<tr>
				<td height="25">
					name:
					<input type="text" name="textfield" id="username">
					<input type="button" name="button1" value="validate"
						onClick="validate();">
				</td>
				<td id="messageBox">
					&nbsp;
				</td>
			</tr>
		</table>
		<br>
		<h2>
			Response XML
		</h2>
		<table width="820" border="1" cellpadding="0" cellspacing="0"
			bordercolor="#999999">
			<tr>
				<td width="362">
					&nbsp;
				</td>
				<td width="452">
					<p>
						<strong>XML:</strong>
					</p>
				</td>
			</tr>
			<tr>
				<td>
					name :
					<input type="text" name="textfield2" id="xml_name">
				</td>
				<td rowspan="4" align="left" valign="top">
					<textarea name="textfield23" cols="60" rows="7" id="xmlBox"></textarea>
				</td>
			</tr>
			<tr>
				<td>
					department :
					<input type="text" name="textfield22" id="xml_dept">
				</td>
			</tr>
			<tr>
				<td>
					exception :
					<input type="text" name="textfield222" id="xml_exception">
				</td>
			</tr>
			<tr>
				<td align="center">
					<input type="button" name="button12" value="makeXML"
						onClick="makeXML();">
				</td>
			</tr>
		</table>
		<br>
		<h2>
			Exception Box
		</h2>
		<table width="587" border="1" cellpadding="0" cellspacing="0"
			bordercolor="#999999">
			<tr>
				<td width="577">
					<strong>Exception:</strong>
				</td>
			</tr>
			<tr>
				<td id="exceptionBox">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td id="stackBox">
					&nbsp;
				</td>
			</tr>
		</table>
		<br>
	</body>
</html>
<script language="javascript">
  function validate() {
    //取得用户输入的数据
    var userName = document.getElementById("username").value;
    
		//组织需要发送的参数
		var map = new Map();
		map.put("key", "pub.test.ajax.str");   //这个参数是必须的，与配置文件对应
		map.put("name", userName);             //用户自定义参数
	
		var query = new QueryObj(map, callBackValidate);
		query.send();    //发送
  }
  
  function callBackValidate(query) {
    //得到服务器返回的字符串信息
    var msg = query.getDetail();
	
		//动态改变页面上的内容
    var msgObj = document.getElementById("messageBox");
		msgObj.innerHTML = "<font color='red'>" + msg + "</font>";
  }
</script>
<script language="javascript">
	function makeXML() {
		var name = document.getElementById("xml_name").value; 
		var dept = document.getElementById("xml_dept").value;
		var excep = document.getElementById("xml_exception").value;
		
		var map = new Map();
		map.put("key","pub.test.ajax.xml");
		map.put("name", name);
		map.put("dept", dept);
		map.put("exception", excep);
		
		var exceBoxId = "exceptionBox";    //异常打印区域对象的ID
		var query = new QueryObj(map, callBackMakeXML, exceBoxId);
		query.send();
	}
	
	function callBackMakeXML(query) {
		var xmlObj = query.getDetail();
		if (query.isResultOK()) {
			var msgObj = document.getElementById("xmlBox");
			msgObj.value = xmlObj.xml;
		}
		else {
		  var stackObj = document.getElementById("stackBox");
		  stackObj.innerHTML = query.getExceptionStack();
		}
	}
</script>
