<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <title>链接到配置说明</title>
    <style type="text/css">
      .linkto{
  width: 100%;
}
.linkto table{
  font-size: 10pt;
  width: 100%;
  border-collapse: collapse;
}
.lt_td{
  vertical-align: top;
  padding: 2px;
  border: 1px solid blue;
}
    </style>
  </head>
  <body>
    <div class="linkto">
      <table cellspacing="0">
        <tr>
          <td class="lt_td" width="100"><b>配置</b></td>
          <td class="lt_td" width="50"><b>要求</b></td>
          <td class="lt_td"><b>描述</b></td>
        </tr>
        <tr>
          <td class="lt_td">formId</td>
          <td class="lt_td">必需</td>
          <td class="lt_td">表单id</td>
        </tr>
        <tr>
          <td class="lt_td">formName</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">表单名称</td>
        </tr>
        <tr>
          <td class="lt_td">formType</td>
          <td class="lt_td">必需</td>
          <td class="lt_td">表单类型，可选值有:
            <table>
              <tr>
                <td width="110">Artery.FORM(1)</td><td width="40">:</td><td>form表单</td>
              </tr>
              <tr>
                <td>Artery.REPORT(2)</td><td>:</td><td>报表</td>
              </tr>
              <tr>
                <td>Artery.WRIT(3)</td><td>:</td><td>文书</td>
              </tr>
              <tr>
                <td>Artery.PLUGIN(4)</td><td>:</td><td>外挂表单</td>
              </tr>
              <tr>
                <td>Artery.FRAME(5)</td><td>:</td><td>框架页面</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="lt_td">params</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">参数传输对象</td>
        </tr>
        <tr>
          <td class="lt_td">url</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">链接地址，如果没有配置表单，可以配置此属性，链接到指定的页面</td>
        </tr>
        <tr>
          <td class="lt_td">target</td>
          <td class="lt_td">必需</td>
          <td class="lt_td">打开位置，可选值有：
            <table>
              <tr>
                <td width="110">_window</td><td width="40">:</td><td>在Ext.Window中打开</td>
              </tr>
              <tr>
                <td>_blank</td><td>:</td><td>在新的浏览器窗口打开</td>
              </tr>
              <tr>
                <td>_self</td><td>:</td><td>在本页面窗口打开</td>
              </tr>
              <tr>
                <td>_parent</td><td>:</td><td>在父窗口中打开</td>
              </tr>
              <tr>
                <td>_top</td><td>:</td><td>在顶层窗口打开</td>
              </tr>
              <tr>
                <td>自定义字符串</td><td>:</td><td>在指定的操作区域打开，如果找不到，则在新窗口打开</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="lt_td">targetWidth</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口的宽度</td>
        </tr>
        <tr>
          <td class="lt_td">targetHeight</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口的高度</td>
        </tr>
        <tr>
          <td class="lt_td">runTimeType</td>
          <td class="lt_td">必需</td>
          <td class="lt_td">打开页面的运行时类型，可选值有：
            <table>
              <tr>
                <td width="110">display</td><td width="40">:</td><td>显示界面</td>
              </tr>
              <tr>
                <td>update</td><td>:</td><td>更新界面</td>
              </tr>
              <tr>
                <td>insert</td><td>:</td><td>插入界面</td>
              </tr>
              <tr>
                <td>parent</td><td>:</td><td>继承自父窗口</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="lt_td">targetLeft</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口左边距</td>
        </tr>
        <tr>
          <td class="lt_td">targetTop</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口顶边距</td>
        </tr>
        <tr>
          <td class="lt_td">targetRight</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口右边距</td>
        </tr>
        <tr>
          <td class="lt_td">targetBottom</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口底边距</td>
        </tr>
        <tr>
          <td class="lt_td">modal</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">true，则模态打开窗口</td>
        </tr>
        <tr>
          <td class="lt_td">resizable</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">true，则可以调整窗口大小</td>
        </tr>
        <tr>
          <td class="lt_td">title</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口的标题</td>
        </tr>
        <tr>
          <td class="lt_td">wincfg</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">打开窗口时的附加配置，可以编写窗口关闭事件</td>
        </tr>
        <tr>
          <td class="lt_td">location</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">1，则显示地址栏  在新窗口中打开有效</td>
        </tr>
        <tr>
          <td class="lt_td">menubar</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">1，则显示菜单栏  在新窗口中打开有效</td>
        </tr>
        <tr>
          <td class="lt_td">status</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">1，则显示状态栏  在新窗口中打开有效</td>
        </tr>
        <tr>
          <td class="lt_td">titlebar</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">1，则显示标题栏  在新窗口中打开有效</td>
        </tr>
        <tr>
          <td class="lt_td">toolbar</td>
          <td class="lt_td">可选</td>
          <td class="lt_td">1，则显示工具栏  在新窗口中打开有效</td>
        </tr>
      </table>
    </div>
  </body>
</html>
