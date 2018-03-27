<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <html:base />
    <title>tag解析测试</title>
    <style>
      body{
        font-size:9pt;
      }
      td{
        font-size:9pt;
        padding:4px;
        vertical-align:top;
      }
    </style>
    <script>
      function tagparse(){
        var source = document.getElementById("source").value;
        document.getElementById("valstr").innerText = "";
        var map = new Map();
        map.put("key", "pub.test.tagparse");
        map.put("source", source);
        map.put("source1", "testtestetsttesttest");
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            document.getElementById("valstr").innerText = msg;
        });
        query.send();
      }
    </script>
  </head>
  <body style="margin:10px">
    <a href="<%=request.getContextPath()%>/artery/test/index.jsp">后退</a>
    <table border="1" cellpadding="0" bordercolor="#cccccc" cellspacing="0" width="100%">
      <tr>
        <td colspan="2">
          支持标签:引号包括的为变量，实际使用中不需要引号
        </td>
      </tr>
      <tr>
        <td width="50%">
          （1）{cfg."key"} 
          <br />
          （2）{img."id"}/{imgwidth."id"}/{imgheight."id"}
          <br />
          （3）{req."key"}
          <br />
          （4）{ses.userid}/{ses.username}/{ses.deptid}/{ses.deptname}/{ses.corpid}/{ses.corpname}/{ses.identifier}/{ses.email}/{ses.ip}/{ses.os}/{ses.browser}/{sesright."rightexpress"}
          <br />
          （5）{nf("val","fmt")}/{df("val","oldfmt","newfmt")}/{df("val","newfmt")}
          <br />
          （6）{ncode("val","codetype")}/{ncode("codetype")}/{ncode_m('val1,val2,...','codetype','分隔符')}
          <br />
          （7）{ocode("val","codetype")}/{ocode_m('val1,val2,....','codetype',',')} 其中codetype: corp,dept,user
          <br />
          （8）{exp("expression")}
          <br />
          （9）{ccode("val","codetype")}/{ccode_m('val1,val2,...','codetype','分隔符')} 其中codetype为classcode配置表中的分级代码表名
        </td>
        <td width="50%">
          （10）{isnull("val","defaultval")}
          <br />
          （11）{decode("express")} 其中express分为[val],[符号][条件],[结果值],...,[默认值] 以逗号分割－－参数个数必须为偶数
          <br />
          （12）{rs"1".#"1"}/{rs"1"."fldname"}/{list("rsid","字段名","条件","'分隔符'")}，如{list(rs1,C_Name,N_PID=1,',')}
          <br />
          （13）标签嵌套，支持无限极嵌套，使用"["和"]"替代"{"、"}"
          <br/>
          （14）{var."key"} 读取通过脚本ParameterWrapper.getWrapper().set(key,value)的值,此值一定要是string型的
          <br/>
          （15）{calendar("val"[,"format"])} 日期标签，val中支持y,m,d,h,ni,s,用点分割开,如{calendar(y.m.0,yyyy年mm月dd日))}表示当前月的上一个月最后一天
        </td>
      </tr>
      <tr>
        <td>
          <textarea cols="60" rows="12" id="source" wrap="true">
【1】{img.4e5df3eeec1d831adb3910d464f985a8}:{imgwidth.4e5df3eeec1d831adb3910d464f985a8}:{imgheight.4e5df3eeec1d831adb3910d464f985a8}
【2】{cfg.corp.curcorpname}
【3】{req.source1}:{req.key}
【4】{ses.userid}/{ses.username}/{ses.deptid}/{ses.deptname}/{ses.corpid}/{ses.corpname}/{ses.identifier}/{ses.email}/{ses.ip}/{ses.os}/{ses.browser}/{sesright.artery.metadata & artery.eform}
【5】{nf(12345123.4567,aa#,###.00bb)}/{df(2008-07-07,yyyy-MM-dd,yyyy年MM月dd日 E)}/{df(2008-03-25 00:23:34,yyyy年MM月dd日 E HH:mm:ss)}
【6】{ncoDe(1,-1)}/{ncode(-11)}/{ncode_m('1,2','-1',',')}
【7】{ocode(10000002,corp)}/{ocode(100000003,dept)}/{ocode(100000000000001,user)}/{ocode_m('100000000000001,100000000000002','user',',')}
【8】{exp((1+100)*12-122/2)}
【9】{ccode(2,T_Eg_ClassCode)}/{ccode_m('2;3;4','T_Eg_ClassCode',';')}
【10】{isnull(,sss)}
【11】{decode(1+1,<2,小于2,=2,等于2,>2,大于2,默认值)}
【12】{rs1.#1}/{rs1.C_Name}/{list(rs1,C_Name,N_PID=-12,',')}
【13】aa{nf([nf([rs1.#1]2347.6723,#.0)],#,###.00)}bb={nf([exp(87*29*27-[exp(12345*1)])].[exp(73+3)],#.0)}cc
【14】{var.key1}
【15】{calendar(y.m.0,yyyy年MM月dd日))}/{calendar(y.m-1.1,yyyy年MM月dd日))}/{calendar(y.m-1.1))}
    </textarea>
          <br />
          <input type="button" onclick="tagparse()" value="翻译标签">
        </td>
        <td>
          <div id="valstr" />&nbsp;</div>
        </td>
      </tr>
    </table>
  </body>
</html>
