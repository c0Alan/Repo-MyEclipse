<%@ page language="java" pageEncoding="UTF-8"
  contentType="text/html;charset=UTF-8"%>
<%@ include file="/summer/jsp/head/taglibs.jsp"%>
<%@ page import="com.thunisoft.summer.exception.BaseException"%>
<html:html>
<head>
  <title><bean:message key="title.errorpage" />
  </title>
  <link href="<c:url value='/summer/css/datadic.css'/>" rel="stylesheet"
    type="text/css">
  <script type="text/javascript">
  function showMore(){
      if( document.all("moreinfo").style.display=="none"){
        document.all("moreinfo").style.display="inline";
      }else{
        document.all("moreinfo").style.display="none";
      }
      return false;
  }
  </script>
  <html:base />
</head>
<body class="error_body">
  <br />
  <br />
  <br />
  <br />
  <table valign="center" width="80%" align="center" border="0" cellspacing="0"
    cellpadding="0" bgcolor="#FFFFFF">
    <tr>
      <td>
        <table width="100%" border="0" cellpadding="1" cellspacing="1"
          bgcolor="#D0DAE6">
          <tr>
            <td width="100%" align="center" bgcolor="#FFFFFF">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr bgcolor="white">
                  <td height="22" align="left" colspan="2" bgcolor="#dbeaf5"
                    style="padding-left:10px">
                    <strong><bean:message key="error.title.sys" /> </strong>
                  </td>
                </tr>
                <tr>
                  <td width="30" align="left" style="padding-left:10px">
                    <img src="<c:url value='/summer/images/error.gif'/>">
                  </td>
                  <td width="100%" align="left">
                    <br />
                    <html:errors />
                  </td>
                </tr>
                <tr>
                  <td align="center" colspan="2">
                    <a onClick="javascript:history.go(-1)" style="cursor:hand;"><bean:message
                        key="link.back" /> </a>
                    <c:if test="${not empty SUMMER_EX}">
                    &nbsp;
                    <a href="" onclick="return showMore()"><bean:message
                          key="link.detail" /> </a>
                    </c:if>
                  </td>
                </tr>
                <tr>
                  <td width="100%" align="center" colspan="2">
                    <c:choose>
                      <c:when test="${not empty SUMMER_EX}">
                        <div id="moreinfo" style="display:none">
                          <table width="100%">
                            <tr>
                              <td>
                                <hr size=1 width="100%">
                                <c:out value="${ex}" />
                              </td>
                            </tr>
                          </table>
                        </div>
                      </c:when>
                      <c:otherwise>
                      &nbsp;
                      </c:otherwise>
                    </c:choose>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
      <td width="8" background="<c:url value='/summer/images/mid_shadow.gif'/>">
        &nbsp;
      </td>
    </tr>
    <tr>
      <td align="left" valign="top"
        background="<c:url value='/summer/images/bt_shadow.gif' />">
        <img src="<c:url value='/summer/images/lft_shadow.gif' />"
          width="12" height="6"></td>
      <td>
        <img src="<c:url value='/summer/images/rgt_shadow.gif' />"
          width="8" height="6"></td>
    </tr>
  </table>
</body>
</html:html>
