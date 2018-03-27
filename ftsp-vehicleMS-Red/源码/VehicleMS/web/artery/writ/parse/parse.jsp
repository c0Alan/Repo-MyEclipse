<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ page import="com.thunisoft.artery.util.ArteryUtil" %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ page import="com.thunisoft.artery.parse.support.ConfigureLoader" %>
<%
response.setDateHeader("Expires", 0);
request.setAttribute("contextPath", request.getContextPath());
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<!-- Powered by Artery <%=ConfigureLoader.getArteryVersion() %> -->
<title><c:out value="${formName}" escapeXml="false"/></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />
<%=EformUtil.getPubCSS() %>
<style  id="writStyle">
  <c:out value="${style}" escapeXml="false"></c:out>
</style>
<script language="javascript">
Sys.DEFAULT_PLUGIN_PATH = "/summer/component";
sys = new Sys();
function Sys() {
  this._pluginPath = Sys.DEFAULT_PLUGIN_PATH;
}
Sys.prototype.getContextPath = function(){
  var ctxpath =  "<%=request.getContextPath()%>";
  return ctxpath;
}
Sys.prototype.setPluginPath = function(path) {
  this._pluginPath = path;
}
Sys.prototype.getPluginPath = function() {
  return this.getContextPath() + this._pluginPath;
}
</script>
  
<%=EformUtil.getPluginJs() %>
<jsp:include page='<%=ArteryUtil.getBaseCfgValue("artery.userhead")%>'/>
  <script type="text/javascript">
  // for ext
  Ext.SSL_SECURE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
  Ext.BLANK_IMAGE_URL= "<c:url value='/artery/form/parse/images/default/s.gif'/>";
  Ext.enableGarbageCollector = false;
  
  var ntko;
  var ntkopanelid;
  
  //参数列表，包含隐藏参数，公共参数
  Artery.params = <c:out value="${params}" escapeXml="false"/>;
  Artery.params.writtplid='<c:out value="${writtplid}"/>';
  Artery.params.writid='<c:out value="${writid}"/>';
  Artery.params.writTplSize='<c:out value="${writTplSize}"/>';
  var va = <c:out value='${parseDataXml}' escapeXml='false' default='""'/>;
  parsedata_dom=loadXMLString(va.xml);
  Artery.userParams = <c:out value="${userParams}" escapeXml="false"/>;
  Artery.linktoParams = <c:out value="${linktoParams}" escapeXml="false"/>;
  Artery.errors = "<c:out value="${errors}" escapeXml="false"/>";
  Artery.config = <c:out value="${atycfg}" escapeXml="false"/>;
  Artery.userInfo = <c:out value="${atyUserInfo}" escapeXml="false"/>;
  
  //页面初始化
  Ext.onReady(function(){
	Ext.QuickTips.init();
    initDocument();
  });

<c:out value="${script}" escapeXml="false"></c:out>

function initDocument(){
  ntko = Artery.getCmp(ntkopanelid).ntko;
  
  var url;
  if(Artery.params.runTimeType == "insert"){
    if(Artery.params.writTplSize != 0){
      url='writparse.do?action=loadDocTpl&writtplid=' + Artery.params.writtplid;
    }else{
      alert("没有文书模板");
    }
  }else{
      url='writparse.do?action=loadDoc&writtplid='+Artery.params.writtplid + '&id=' + Artery.params.writid;
  }
  Artery.getCmp(ntkopanelid).loadDoc(url);
}

// 替换Doc中的字符串
function replaceTagInDoc(range,text,replace){
  range.Find.Execute(text,false,false,false,false,false,false,1,false,replace,2,false,false,false,false);
}

// 结束替换字符串后调用的方法，用户可以重写这个方法
function afterReplaceTagInDoc() {
}
</script>

<script language=javascript FOR="NTKO_OCX" EVENT="OnDocumentOpened(fileURL,wordDoc)">
    // Execute方法参数描述：
    // FindText     --    要查找的字符串
    // MatchCase    --    大小写敏感(true)
    // MatchWholeWord --  匹配整个单词
    // MatchWildcards --  True to have the find text be a special search operator
    // MatchSoundsLike -- True to have the find operation locate words that sound similar to the find text
    // MatchAllWordForms  --  True to have the find operation locate all forms of the find text (for example, "sit" locates "sitting" and "sat")
    // Forward      --    向前查找
    // Wrap         --    1
    // Format       --    格式化
    // ReplaceWith  --    替换字符串
    // Replace      --    2
    // MatchKashida --    false
    // MatchDiacritics  --false
    // MatchAlefHamza --  false
    // MatchControl --    false
    if(Artery.params.runTimeType=="insert" && parsedata_dom){
        var range = ntko.ActiveDocument.Range(0, 0);
        var rootNode = parsedata_dom.documentElement;
        if(rootNode){
            for(var i=0;i<rootNode.childNodes.length;i++){
                var subEl = rootNode.childNodes[i];
                if(subEl.nodeName=='Mark'){
                    var name = subEl.childNodes[0].text;
                    var value = subEl.childNodes[1].text;
                    if(value){
                        replaceTagInDoc(range,name,value);
                    }else{
                    	replaceTagInDoc(range,name,"");
                    }
                }
            }
        }
        afterReplaceTagInDoc();
    }
    
</script>

<c:out value="${import}" escapeXml="false"/>
</head>
<body scroll=no>
<c:out value="${html}" escapeXml="false"/>
<div style="display:none">
  <form id="uploadForm"
    enctype="multipart/form-data;charset=utf-8">
    <input type="text" id="writtplid" name="writtplid" value="<c:out value="${writtplid}"/>"></input>
    <input type="text" id="writtplname" name="writtplname" value="<c:out value="${writtplname}"/>"></input>
    <input type="text" id="writid" name="writid" value="<c:out value="${writid}"/>"></input>
  </form>
</div>
</body>
</html>