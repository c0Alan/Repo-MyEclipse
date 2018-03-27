<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"  %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language='javascript' src="<html:rewrite page='/artery/report/make/js/cells.js'/>"></script>
		<script type="text/javascript">
	    var table= {
          id: '<c:out value="${id}"/>',
          complibId: '<c:out value="${complibId}"/>'
        };
        var cellData;
        
        Ext.onReady(function(){
          var mainPanel = new Ext.Panel({
            contentEl: "CellBody",
            tbar:[{
              id: "button_save",
              text:"保存",
              cls: 'x-btn-text-icon save',
              handler: saveTemplate
            },{
          		text: "预览",
          		cls: 'x-btn-text-icon preview',
          		handler: previewForm
          	}]
          });
            
          new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[mainPanel]
          });
            
          <c:if test="${readOnly=='1'}">
          Ext.getCmp("button_save").disable();
          </c:if>
            
          initTable();
        });
        
        //预览表单
        function previewForm(){
        	winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
			winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + table.id;
        	winObj.focus();
        }
		</script>
	</head>
	<body>
        <ui:hidden name="templateContent"/>
		<div id="CellBody" style="width: 100%; height: 100%;">
            <ui:hidden name="templateContent"/>
			<center>
				<font size=5></font>
			</center>
		</div>
	</body>
</html>
