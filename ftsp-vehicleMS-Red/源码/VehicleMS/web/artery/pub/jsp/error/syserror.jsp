<%@ page contentType="text/html;charset=utf-8" language="java" pageEncoding="utf-8"%>
<jsp:directive.page import="com.thunisoft.artery.support.filter.ArteryThread"/>
<%@ page import="com.thunisoft.artery.util.ArteryUtil"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ page import="com.thunisoft.summer.exception.BaseException" %>
<%@ page import="com.thunisoft.artery.support.filter.*" %>
<%@ page import="com.thunisoft.artery.util.ExceptionUtil" %>
<html:html>
<head>
<title><%=ArteryUtil.getMessage("title.errorpage")%></title>
<link href="<html:rewrite page='/summer/css/datadic.css'/>" rel="stylesheet" type="text/css">
<html:base/>
<script type="text/javascript">
Ext.onReady(function() {
	if (!Ext.isEmpty(Artery.errors)) {
		Artery.showSysError({
			itemid:Artery.errorItem,
			prop:Artery.errorProp,
			error:Artery.errors
		});
	}
});
Artery.errors = "<%=ArteryThread.getError()%>";
Artery.errorItem = "<%=ArteryThread.getParseItem()%>";
Artery.errorProp = "<%=ArteryThread.getParseProperty()%>";
</script>
<%
BaseException ex = (BaseException)request.getAttribute(BaseException.GLOBAL_ERROR_KEY);

String errorTitle = "";
if(null != ex){
   try{
        Throwable t = ex;
   		while (t.getCause() != null && t != t.getCause()) {
			t = t.getCause();
   		}
   		errorTitle = t.getMessage();
   		
		errorTitle = ExceptionUtil.findMessage(ex);
   }catch(Exception e){
   }
   if(errorTitle==null || "".equals(errorTitle.trim())){
     errorTitle = ArteryUtil.getMessage("error.title.sys");
   }
   errorTitle = errorTitle.replaceAll(">", "&gt;");
   errorTitle = errorTitle.replaceAll("<", "&lt;");
   if(!ArteryUtil.isDebug()){
   		ex = null;
   }
}

%>
</head>
<body class="error_body">
  <br/>
  <br/>
  <br/>
  <br/>
  <table valign="center" width="80%" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
      <tr>
      <td>
      <table width="100%"  border="0" cellpadding="1" cellspacing="1" bgcolor="#D0DAE6">
        <tr>
          <td width="100%" align="center" bgcolor="#FFFFFF">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr bgcolor="white">
		  <td height="22" align="left" colspan="2" bgcolor="#dbeaf5" style="padding-left:10px">
		      <strong><%=ArteryUtil.getMessage("error.title.sys") %></strong></td>
		</tr>
		<tr>
		  <td width="30" align="left" style="padding-left:10px">
		      <img src="<html:rewrite page='/summer/images/error.gif'/>"></td>
		  <td width="100%" align="left"><br/>
			<%=errorTitle%>
		  </td>
		</tr>
		<tr>
		  <td align="center" colspan="2">
		    <%if(null != ex){%>
		      &nbsp;&nbsp;<a href="" onclick="return showMore()"><%=ArteryUtil.getMessage("link.detail") %></a>
		    <%}%>
		  </td>
		</tr>
		<tr><td width="100%" align="left" colspan="2">
		    <%if(null != ex){%>
		      <script>
			  function showMore(){
			      if( document.all("moreinfo").style.display=="none")
				  document.all("moreinfo").style.display="inline";
			      else
			      document.all("moreinfo").style.display="none";
			      return false;
			  }
		      </script>
		      <div id="moreinfo" style="display:none">
		      <table width="100%">
		      <tr><td>
		          <hr size=1 width="100%">
			  <%ex.printStackTrace(out);%>
		      </td></tr>
		      </table>
		      </div>
		    <%}else{%>		    
		      &nbsp;
		    <%}%>		    
		</td></tr>
	    </table>
	</td>
    </tr>
  </table>
  </td>
  <td width="8" background="<html:rewrite page='/summer/images/mid_shadow.gif'/>">&nbsp;</td>
  </tr>
     <tr>
      <td align="left" valign="top" background="<html:rewrite page='/summer/images/bt_shadow.gif'/>">
      	  <img src="<html:rewrite page='/summer/images/lft_shadow.gif'/>" width="12" height="6"></td>
      <td><img src="<html:rewrite page='/summer/images/rgt_shadow.gif'/>" width="8" height="6"></td>
    </tr>
  </table>
</body>
</html:html>

