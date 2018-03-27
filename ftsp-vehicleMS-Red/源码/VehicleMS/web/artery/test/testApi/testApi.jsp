<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <html:base />
    <title>beanshell脚本测试</title>
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
        document.getElementById("valstr").innerText ="";
        var map = new Map();
        map.put("key", "pub.test.testapi");
        map.put("source", source);
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            document.getElementById("valstr").innerText = msg;
        });
        query.send();
      }
    </script>
  </head>
  <body style="margin:10px">
    <table border="0" cellpadding="0" bordercolor="#cccccc" cellspacing="0" width="100%">
      <tr>
        <td width="50%">
          <textarea cols="60" rows="22" id="source" wrap="true">import com.thunisoft.artery.eform.dataset.DataSet; 
import com.thunisoft.artery.eform.dataset.QueryManager;     
String s = "";                                          
s+="---SessionObj-------\n";         
s+=Aty.session.userid+"\n";                      
s+=Aty.session.username+"\n";                      
s+=Aty.session.deptid+"\n";                      
s+=Aty.session.deptname+"\n";                     
s+=Aty.session.corpid+"\n";                     
s+=Aty.session.corpname+"\n";                     
s+=Aty.session.ip+"\n";                     
s+=Aty.session.email+"\n";                     
s+=Aty.session.os+"\n";                     
s+=Aty.session.browser+"\n";                     
s+=Aty.session.identifier+"\n";                    
s+="---AppObj-------"+"\n";                      
s+=Aty.app.getUUID()+"\n";                   
s+=Aty.app.getCurrCorpCode()+"\n";                   
s+=Aty.app.getCurrCorpName()+"\n";                  
s+=Aty.app.getContextPath()+"\n";                
s+=Aty.app.hasRight("artery.eform & artery.subsys & aaa")+"\n";             
s+="---CacheObj-------"+"\n";            
s+=Aty.cache.normalcode.transCode("1","1")+"\n";            
s+="---CookieObj-------"+"\n";            
Aty.cookie.setCookie("okk","oookkk");          
s+=Aty.cookie.getCookieValue("okk","pppp")+"\n";        
s+="---OrganObj-------"+"\n";           
s+=Aty.organ.getUserNameById("100000000000002")+"\n";      
s+="---ParamWrapper-------"+"\n";  
Aty.set("key1","test paramwrapper");
s+=Aty.get("key1");
return s;</textarea>
          <br />
          <input type="button" onclick="tagparse()" value="提交">
        </td>
        <td width="50%">
          <div id="valstr" />&nbsp;</div>
        </td>
      </tr>
    </table>
  </body>
</html>
