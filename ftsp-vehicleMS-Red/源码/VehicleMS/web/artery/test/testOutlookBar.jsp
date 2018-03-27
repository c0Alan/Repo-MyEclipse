<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<title>测试outlook bar</title>
    <style type="text/css">
    .out_item{
      margin: 4px;
      cursor: pointer;
    }
    .out_item .item-icon{
      background: url('../console/images/refresh.gif') no-repeat center;
      width: 22px;
      height: 20px;
    }
    .out_item .item-text{
      font-size: 14px;
    }
    </style>
    <script type="text/javascript">
    Ext.ns("Artery.plugin");
    </script>
    <script type="text/javascript" src="<c:url value='/artery/arteryPlugin/frame/staticNav/outlookbar.js'/>"></script>
    <script type="text/javascript">
    Ext.onReady(function(){
      var olp = new Artery.plugin.NavPanel({
        title: "panel1",
        collapsible: true,
        style: "margin:5px"
      });
      olp.render("div1");
      var dd = new Ext.Panel({
        border: false,
        items: [{
          xtype: "apNavPanel",
          title: "panel1",
          collapsible: true,
          titleCollapse: true,
          style: "margin:5px"
          
        },{
          xtype: "apNavPanel",
          title: "panel2",
          collapsible: true,
          titleCollapse: true,
          animCollapse: false,
          style: "margin:5px"
        }]
      });
      dd.render("div3");
    });
    </script>
  </head>
  <body>
    <table width="600px">
      <tr>
        <td width="220" valign="top">
          <div id="div1" style="width:200px;border:1px solid red;"></div>
        </td>
        <td width="200">
          <div id="div3" style="height: 300px;border:1px solid red;"></div>
        </td>
        <td>
          <div id="div2" style="width:100%;border:1px solid red;">
            <div class="out_item">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td class="item-icon"></td>
                  <td class="item-text">整体设置</td>
                </tr>
              </table>
            </div>
            <div class="out_item">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td class="item-icon"></td>
                  <td class="item-text"">整体设置</td>
                </tr>
              </table>
            </div>
            <div class="out_item">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td class="item-icon"></td>
                  <td class="item-text">整体设置</td>
                </tr>
              </table>
            </div>
            <div class="out_item">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td class="item-icon"></td>
                  <td class="item-text">整体设置</td>
                </tr>
              </table>
            </div>
            <div class="out_item">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td class="item-icon"></td>
                  <td class="item-text">整体设置</td>
                </tr>
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
