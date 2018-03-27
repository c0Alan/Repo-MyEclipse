<%@ page language="java" contentType="text/html; charset=UTF-8"
  pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>框架页面导入表单</title>
    <script type="text/javascript">
    function doChangeWork(){
      var sp = document.getElementById("systemPath").value;
      Ext.Ajax.request({
        url: 'sample.do?action=frameToForm2',
        success: function(response){
          alert(response.responseText);
        },
        failure: function(){
          alert("failure");
        },
        params: {
          systemPath: sp
        }
      });
    }
    </script>
  </head>
  <body>
    <table border="1px" width="600px">
      <tr>
        <td width="100">子系统路径：</td>
        <td>
          <input id="systemPath" type="text" style="width: 100%;" value="<c:out value="${subsysRoot}"/>">
        </td>
      </tr>
      <tr>
        <td>构件库路径：</td>
        <td>
          <c:out value="${complibRoot}"/>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button onclick="doChangeWork()">执行转换</button>
        </td>
      </tr>
    </table>
  </body>
</html>
