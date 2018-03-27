<%@ page language="java" pageEncoding="UTF-8"
  contentType="text/html;charset=UTF-8"%>
<%@ include file="/summer/jsp/head/taglibs.jsp"%>
<html>
  <head>
    <title><bean:message key="title.hintpage" />
    </title>
    <link href="<c:url value='/summer/css/datadic.css'/>" rel="stylesheet"
      type="text/css" />
  </head>
  <body class="error_body">
    <br />
    <br />
    <br />
    <br />
    <table width="80%" align="center" border="0" cellspacing="0" cellpadding="0"
      bgcolor="#FFFFFF">
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
                      <strong><bean:message key="error.title.app" /> </strong>
                    </td>
                  </tr>
                  <tr>
                    <td width="30" align="left" style="padding-left:10px">
                      <img
                        src="<c:url value='/summer/images/warning.gif'/>">
                    </td>
                    <td width="100%" align="left">
                      <br />
                      <html:errors />
                    </td>
                  </tr>
                  <c:if test="${showbutton!='false'}">
                    <tr>
                      <td align="center" colspan="2">
                        <a onClick="javascript:history.go(-1)"
                          style="cursor:hand;"><bean:message key="link.back" />
                        </a>
                      </td>
                    </tr>
                  </c:if>
                  <tr>
                    <td width="100%" align="center" colspan="2">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
        <td width="8"
          background="<c:url value='/summer/images/mid_shadow.gif'/>">
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
</html>
