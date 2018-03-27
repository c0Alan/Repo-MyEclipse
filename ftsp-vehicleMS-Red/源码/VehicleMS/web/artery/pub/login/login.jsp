<%@ page contentType="text/html;charset=utf-8" language="java"%>
<%@ page import="java.util.*"%>
<%@ page import="com.thunisoft.artery.*"%>
<%@ page import="com.thunisoft.artery.module.subsys.*"%>
<%@ page import="com.thunisoft.artery.core.subsys.*"%>
<jsp:directive.page import="com.thunisoft.artery.util.ArteryUtil"/>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />
    <title><%=ArteryUtil.getMessage("login.title")%></title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/artery/pub/css/login.css'/>">
    <script type="text/javascript" language='javascript' src="<c:url value='/artery/pub/js/cookie.js'/>"></script>
    <script language="javascript">
  //判断字符串是否为空
  String.prototype.isEmpty=function(){return ((this.replace(/ /g, "").length==0)?true:false);}

  var net=new Object();              
  net.READY_STATE_UNINITIALIZED=0;
  net.READY_STATE_LOADING=1;
  net.READY_STATE_LOADED=2;
  net.READY_STATE_INTERACTIVE=3;
  net.READY_STATE_COMPLETE=4;    
  var req=null;    
  var hadsubmit=false;
  
  function onload_body(){
    if(window.top && window.top!=this){
      window.top.location.href='<c:url value="/artery/pub/login/login.jsp" />';
      return ;
    }
    <%
    	String theSysUrl = request.getParameter("sysID");
    %>
    var loginusername=document.getElementById("j_username");
    var cookieval=GetCookie("lsn");
    var cookiesubsys = GetCookie("subsysid");
    if(cookieval!=null){
      loginusername.value=GetCookie("lsn");
    }
    var sysEle = document.getElementById("j_subsys");
    var theSysUrl = "<%=theSysUrl%>";
    var sysSelected = theSysUrl=="null"?cookiesubsys:theSysUrl;
    if(sysEle && sysEle.options && sysSelected!=null){
      var aryOp = sysEle.options;
      for(var i=0;i<aryOp.length;i++){
        if(aryOp[i].value==sysSelected){
          aryOp[i].selected = true;
          break;
        }
      }
    }
    loginusername.focus();
    loginusername.select();
  }
  
  function username_onkeydown(){
    if(event.keyCode == 13)
      event.keyCode=9;
  }

  function submit(){
  	var loginusername=document.getElementById("j_username");
    if(hadsubmit)
      return false;
    showProcess();
    var obj = document.getElementById("tips");
    obj.innerHTML="";  
    if(loginusername.value.isEmpty()){
      obj.innerHTML="<UL><LI><%=ArteryUtil.getMessage("login.error.nonameorpassword")%></LI></UL>";
      hideProcess();
      hadsubmit=false;
      loginusername.focus();
      loginusername.select();
      return false;
    }
    if (window.XMLHttpRequest){                  
      req=new XMLHttpRequest(); 
    } else if (window.ActiveXObject){             
      req=new ActiveXObject("Microsoft.XMLHTTP");   
    }
    if (req){
      req.onreadystatechange=function(){
        var ready=-1;
        try{
          ready=req.readyState;
        }catch(e){}
        if (ready==net.READY_STATE_COMPLETE){
	       try{
		      var httpStatus=req.status;
		      if (httpStatus==200 || httpStatus==0){
                var strResult=req.responseText;
		        if(strResult.indexOf("ok:")==0){
                  var strUrl=strResult.substr(3);
                  SetCookie("lsn",loginusername.value,30);
                  var sysEle = document.getElementById("j_subsys");
                  if(sysEle)
                      SetCookie("subsysid",sysEle.value,30);
                  location.assign("<c:out value='${pageContext.request.contextPath}'/>"+strUrl);                  
                }else if(strResult.indexOf("iperror")==0){
                  obj.innerHTML="<UL><LI><%=ArteryUtil.getMessage("login.error.authentication.iperror")%></LI></UL>";
                  hideProcess();
				  loginusername.focus();
				  loginusername.select();                  
                  hadsubmit=false;
                }else{
                  obj.innerHTML="<UL><LI>"+strResult+"</LI></UL>";
                  hideProcess();
				  loginusername.focus();
                  loginusername.select();                  
                  hadsubmit=false;
                }
		      }else{
                  obj.innerHTML="<UL><LI><%=ArteryUtil.getMessage("login.error.sysexception")%></LI></UL>";
                  hideProcess();
				  loginusername.focus();
      			  loginusername.select();                  
                  hadsubmit=false;
		      }
	       }finally{
	  	      req=null;
	       }
        }
      }
      req.open("post","<html:rewrite page='/summer/common/login.do?action=login'/>",true);
      req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      var userName = encodeURIComponent(loginusername.value);
      var userPassword = encodeURIComponent(document.getElementById("j_password").value);
      var screenwidth=screen.width+"";
      var screenheight=screen.height+"";
      if(screenwidth.length==3)
        screenwidth=" "+screenwidth;
      if(screenheight.length==3)
        screenheight=" "+screenheight;
      var content="j_username="+userName+"&j_password="+userPassword+"&screen="+screenwidth+"*"+screenheight;
      
      // 处理子系统
      var sysEle = document.getElementById("j_subsys");
      if(sysEle){
          var sysID = sysEle.value;
          content += ( "&sysID="+sysID );
      }
      req.send(content); 
      hadsubmit=true; 
    }
  }
    
  function reset(){
    document.getElementById("j_username").value='';
    document.getElementById("j_password").value='';
    var obj = document.getElementById("tips");
    obj.innerHTML="";
    document.getElementById("j_username").focus();
  }
  </script>
  </head>
  <body bgcolor="#cfddf5" onload="onload_body()">
    <table border="0" cellspacing="0" cellpadding="0" id="index">
      <tr>
        <td align="center">
          <div class="index_c">
            <table class="index_table" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td class="table_01">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td class="table_02">
                  <table class="table_02_x" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="535px">
                        <div class="logo"></div>
                      </td>
                      <td width="105px">
						<div style="padding-top:50px;font-weight:900;color:#7DB5FF;">v<%=ArteryUtil.getBaseCfgValue("artery.version") %></div>
					  </td>
                      <td width="86px">
                        <div class="logo1"></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="table_03">
                  <table class="table_03_x" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="40%">
                        <table class="table_left" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td height="25" colspan="3">
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td height="25" colspan="3">
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td width="40%" height="40">
                              <%=ArteryUtil.getMessage("login.prompt.userid")+"："%>
                            </td>
                            <td colspan="2">
                              <input type="text" name="j_username" id="j_username"
                                class="inputclass" onkeydown="username_onkeydown(this)" size="18"
                                maxlength="50" />
                            </td>
                          </tr>
                          <tr>
                            <td height="41">
                              <%=ArteryUtil.getMessage("login.prompt.password")+"："%>
                            </td>
                            <td colspan="2">
                              <input type="password" name="j_password" id="j_password"
                                class="inputclass" maxlength="50" size="20" />
                            </td>
                          </tr>
                          <tr>
                            <td height="41">
                              子系统：
                            </td>
                            <td colspan="2">
                              <select id="j_subsys" name="j_subsys" class="inputclass">
                                <%
                                List sysList = ArteryService.getSystemService().getPublishSystem();
                                for (int i = 0; i < sysList.size(); i++) {
                                    ISystem sys = (ISystem) sysList.get(i);
                                %>
                                <option value="<%=sys.getId()%>">
                                  <%=sys.getName()%>
                                </option>
                                <%
                                }
                                %>
                                <option value="console" style="color: blue">
                                  控制台
                                </option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td height="42">
                              &nbsp;
                            </td>
                            <td width="25%">
                              <input type="image"
                                src="<c:url value='/artery/pub/images/login/submit.gif'/>"
                                onclick="submit()" />
                            </td>
                            <td width="25%">
                              <input type="image" src="<c:url value='/artery/pub/images/login/reset.gif'/>"
                                onclick="reset()" />
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" id="tips" name="tips" class="tips" align="left">
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="60%">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="flash">
                              <OBJECT codeBase="<c:url value='/artery/arteryConsole/ocx/swflash.cab#version=10,1,102,64'/>" classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000 width=360 height=230>
                                <PARAM NAME="_cx" VALUE="9525">
                                <PARAM NAME="_cy" VALUE="6085">
                                <PARAM NAME="Movie" VALUE="<c:url value='/artery/pub/images/login/fl.swf'/>">
                                <PARAM NAME="Src" VALUE="<c:url value='/artery/pub/images/login/fl.swf'/>">
                                <PARAM NAME="WMode" VALUE="Transparent">
                                <PARAM NAME="Play" VALUE="-1">
                                <PARAM NAME="Loop" VALUE="-1">
                                <PARAM NAME="Quality" VALUE="High">
                                <PARAM NAME="SAlign" VALUE="">
                                <PARAM NAME="Menu" VALUE="-1">
                                <PARAM NAME="Base" VALUE="">
                                <PARAM NAME="AllowScriptAccess" VALUE="">
                                <PARAM NAME="Scale" VALUE="ShowAll">
                                <PARAM NAME="DeviceFont" VALUE="0">
                                <PARAM NAME="EmbedMovie" VALUE="0">
                                <PARAM NAME="SeamlessTabbing" VALUE="1">
                                <PARAM NAME="AllowNetworking" VALUE="all">
                                <PARAM NAME="AllowFullScreen" VALUE="false">
   								<embed width="360" height="230" src="<c:url value='/artery/pub/images/login/fl.swf'/>" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" wmode="transparent" id="flashobj" type="application/x-shockwave-flash"  ></embed>
   							  </OBJECT>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="table_04">
                  <table class="bottom" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                    <logic:notEqual name="limitTime" scope="request" value="0">
                      <td> <%=ArteryUtil.getMessage("about.license")%><c:out value="${limitTime}" /></td>
                    </logic:notEqual>
                      <td>
                      	 <%=ArteryUtil.getMessage("about.copyright1")%>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
