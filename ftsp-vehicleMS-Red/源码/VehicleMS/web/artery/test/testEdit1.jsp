<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>测试codepress</title>
    <script src="<html:rewrite page='/artery/components/codepress/codepress.js'/>"></script>
    <script src="<html:rewrite page='/artery/components/codepress/CodePanel.js'/>"></script>
    <script type="text/javascript">
    var codePan = null;
    Ext.onReady(function(){
      codePan = new CodePanel({language:"java"})
      var p = new Ext.Panel({
        title:"测试Editor",
        width:600,
        height:400,
        layout:"fit",
        items:[codePan]
      });
      p.render("test_panel");
      setCodeToEditor();
    });
    
    function setCodeToEditor(){
      var co = document.getElementById("mycode").value;
      codePan.setCode(co);
    }
    function getCodeToShow(){
      alert(codePan.getCode());
    }
    </script>
  </head>
    <body style="margin: 10px">
    <table>
      <tr>
        <td>
          <div id="test_panel"></div>
        </td>
        <td>
          <button onclick="setCodeToEditor();">
            设置值
          </button>
          <button onclick="getCodeToShow();">
            显示值
          </button>
          <br>
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
