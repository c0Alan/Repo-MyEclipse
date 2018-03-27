<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ page import="com.thunisoft.summer.security.login.*"%>
<%
	if(UserAuthentication.isLogin(session)){
 %>
<logic:forward name="enterLoginSystem"/>
<%
	}else{
 %>
<logic:forward name="login"/>
<%
	} 
  %>
