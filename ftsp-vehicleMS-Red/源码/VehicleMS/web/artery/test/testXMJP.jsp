<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>用户姓名简拼</title>
    <script>
  
  Ext.onReady(function(){
    showXMJPSelected("state");
    
    showtestJp();
    showtestJp1();
    showtestJp2();
  });
  
</script>
  <style>
  .x-combo-list-item{
    font-family: monospace;
    font-size:12px;
    font-style:normal;
    padding:2px;border:1px solid #fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  </style>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <br />
    <br>
    <h2>
      在 Ext.onReady 中增加一个方法调用：show + 标签XMJPSelect的id属性
    </h2>
    <table>
      <tr>
        <td>
          <div>
            <select name="state" id="state" style="font-family:courier;">
              <%
                                  String[] chars = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                                  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" };
                          java.util.Random radom = new java.util.Random();

                          for (int i = 0; i < 100; i++) {
                              StringBuffer temp = new StringBuffer();
                              for (int j = 0; j < 10; j++) {
                                  temp.append(chars[radom.nextInt(26)]);
                              }
                              out.println("<option value=\"" + i + "\"><font style='font-family: courier;'>"
                                      + temp.toString() + "</font></option>");
                          }
              %>
            </select>
            <script type="text/javascript">
    function showXMJPSelected(obj_show){
      new Ext.form.ComboBox({
      id: "radom_test",
      typeAhead: false,
      triggerAction: 'all',
      transform: obj_show,
      width:135,
      forceSelection:true,
      typeAhead: true
      });
    }
    
</script>
          </div>
        </td>
      </tr>
    </table>
    
    <table>
      <tr>
        <td>
        测试列出单位
        </td>
        <td>
          <%
            request.setAttribute("selectedValue","10301");
           %>
          <artery:XMJPSelect name="test" id="testJp" width="200" selected="${selectedValue}" corp="1"/>
        </td>
      </tr>
      <tr>
        <td>
        测试列出所有人
        </td>
        <td>
          <%
            request.setAttribute("selectedValue","10301");
           %>
          <artery:XMJPSelect name="test" id="testJp1" width="200" selected="${selectedValue}"/>
        </td>
      </tr>
      <tr>
        <td>
        测试列出部门
        </td>
        <td>
          <%
            request.setAttribute("selectedValue","10301");
           %>
          <artery:XMJPSelect name="test" id="testJp2" width="200" selected="${selectedValue}" dept="103"/>
        </td>
      </tr>
    </table>
    <br>
    <font style="font-family:courier;">ikkk&nbsp;&nbsp;&nbsp;kkkkkkkkkk</font>
    <br>
    <font style="font-family:courier;">kiiiiii&nbsp;&nbsp;&nbsp;iiiiiii</font>
    <br>
    <select style="font-family:courier;">
      <option value="404">
        qxzqdegucv
      </option>
      <option value="493">
        zrrpqsfrng
      </option>
      <option value="494">
        pwvtmdfsan
      </option>
    </select>
  </body>
</html>
