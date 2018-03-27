<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>testJs</title>
    <script type="text/javascript">
    Ext.onReady(function(){
      //var s = "{client:'var a=0;',server:'a=1'}";
      //var obj = Ext.decode(s);
    });
    
    // 从字符串转换到对象
    function decode(){
        var s = document.getElementById('outArea').value;
        var obj = Ext.decode(s);
        document.getElementById('clientCode').value = obj.client;
        document.getElementById('serverCode').value = obj.server;
    }
    
    // 从对象转换到字符串
    function encode(){
        var cc = document.getElementById('clientCode').value;
        var sc = document.getElementById('serverCode').value;
        var obj = {};
        obj.client = cc;
        obj.server = sc;
        var s = Ext.encode(obj);
        document.getElementById('outArea').value = "";
        document.getElementById('outArea').value = s;
    }
    
    function keyPress(){
      alert("keypress");
    }
    </script>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a><br>
    
    <table width="95%" height="95%">
      <tr>
        <td>
          <textarea id="clientCode" rows="" cols="" style="width: 100%;height: 100%;padding: 2px;"></textarea>
        </td>
        <td>
          <textarea id="serverCode" rows="" cols="" style="width: 100%;height: 100%;padding: 2px;"></textarea>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <textarea id="outArea" rows="" cols="" style="width: 100%;height: 100%;padding: 2px;"></textarea>
        </td>
      </tr>
      <tr height="20">
        <td colspan="2">
          <a href="javascript:encode()">合并到一起</a>&nbsp;
          <a href="javascript:decode()">分开为两个</a>
        </td>
      </tr>
      <tr height="50">
        <td colspan="2">
          <div style="width: 100%;height: 100px;border: 1px solid red;overflow: scroll" onkeypress="alert('keypress');">
            <table width="100%" border="1" height="100%">
              <tr>
                <td width="30">11</td>
                <td>11<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
