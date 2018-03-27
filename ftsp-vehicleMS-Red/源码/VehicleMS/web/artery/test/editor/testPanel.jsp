<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>测试编辑器</title>
    <script src="<html:rewrite page='/artery/components/textEditor/swfobject.js'/>"></script>
    <script src="<html:rewrite page='/artery/components/textEditor/CodePanel.js'/>"></script>
    <style>
td{
  font-size:9pt;
}
body{
  font-size:9pt;
}
b{
  font-size:14pt;
}
</style>    
    <script type="text/javascript">
    var sqlTips = null; //EformUtil.genSqlTips()
    var codePan = null;
    Ext.onReady(function(){
      codePan = new CodePanel({
        language:"java",
        editorTips: sqlTips
      });
      var p = new Ext.Panel({
        title: "test",
        width:600,
        height:400,
        layout:"fit",
        items:[codePan]
      });
      p.render("test_panel");
    });
    
    function setCodeToEditor(){
      var co = document.getElementById("mycode").value;
      codePan.setCode(co);
    }
    
    function getCodeToShow(){
      alert(codePan.getCode());
    }
    
    function setSqlTips(){
      codePan.setTips("aaa.bbb,aaa.ccc");
    }
    
    function clearTips(){
      codePan.setTips("");
    }
    </script>
  </head>
    <body style="margin: 10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <table>
      <tr>
        <td>
          <div id="test_panel"></div>
        </td>
        <td>
          <button onclick="setCodeToEditor();">设置代码</button>
          <button onclick="getCodeToShow();">获得代码</button>
          <button onclick="setSqlTips();">设置tips1</button>
          <button onclick="clearTips();">清空tips</button>
          <textarea class="codepress java linenumbers-on" id="mycode" rows="15" cols="40">
public String createTypeXML(){
    String typeEn = (String)getParameter("typeEn");
    Element e = createObj(typeEn);
}
          </textarea>
        </td>
      </tr>
    </table>
  </body>
</html>

