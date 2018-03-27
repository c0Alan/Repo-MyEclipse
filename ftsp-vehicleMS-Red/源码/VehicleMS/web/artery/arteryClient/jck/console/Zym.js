// **********************************************//
// 主页面 客户端脚本
// 
// @author Artery
// @date 2010-09-04
// @id 240b6a89299f37240e82dd7bbab93d41
// **********************************************//
/**
 * 客户端(closeWizardBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeWizardBtn_onClickClient (rc){
	Artery.get('wizardMain').hide();	
}
/**
 * 客户端(wizardMainGoBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function wizardMainGoBtn_onClickClient (rc){
	Artery.get('wizardMain').hide();	
	var tip = Artery.get('wizardTipPanel');
	var htmlPanel = Artery.get('wizardTipHtmlPanel');
	tip.count = 1;
	tip.alignTo(Artery.get('ribbonItemXtwh').el,'tr?',[-5,-8]);
	htmlPanel.setHtml('操作区域太小？双击这里可以隐藏ribbon菜单哦');
	Artery.get('wizardTipGoBtn').setText('下一步>>')
}
/**
 * 客户端(wizardTipGoBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function wizardTipGoBtn_onClickClient (rc){
	var tip = Artery.get('wizardTipPanel');
	var htmlPanel = Artery.get('wizardTipHtmlPanel');
	tip.count++;
	if(tip.count == 2){
		tip.alignTo(Artery.get('ribbonItemKzmk').el,'tr?',[-10,-8]);
		htmlPanel.setHtml('点击这里可以切换显示不同的Ribbon页签');
	}else if(tip.count == 3){
		tip.alignTo(Artery.get('ribbonCellXtdd').cellTipEl,'tr?',[-5,-8]);
		htmlPanel.setHtml('这里提示当前模块的运行状态，此状态表示出错啦');
		Artery.get('wizardTipGoBtn').setText('结束');
	}else if(tip.count == 4){
		tip.hide();
	}
}
/**
 * onClickClient(ribbonCellRefreshValid)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCellRefreshValid_onClickClient (rc){
	rc.send(function(result){
		
	});	
}
/**
 * onClickClient(buttonb3cd3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {req.loginFrom}
 */
function buttonb3cd3_onClickClient (rc,loginFrom){
	var url = sys.getContextPath()+"/summer/common/login.do?action=logout_ajax";
    Ext.Ajax.request({
    	url: url,
        success: function(response){
        	var resText = response.responseText;
        	if(resText=="ok"){
        		if(loginFrom == "console"){
        			window.location = sys.getContextPath() + "/console";
        		}else{
        			window.location = sys.getContextPath();
        		}
        		
        	}else{
        		Artery.showTipError("退出控制台出错:"+resText, "blankPanel88057");
        	}
        }
    });	
}
/**
 * onClickClient(currentUserBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function currentUserBtn_onClickClient (rc){
	//展示用户信息表单
    Artery.get("operArea41165").showForm({
	    formId : "f05d07fb876d23216a51d181817ee258",
	    formType : Artery.FORM,
	    runTimeType : "insert"
	});	    		
}
/**
 * onRunClient(synchTimerae586)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function synchTimerae586_onRunClient (rc){
	rc.send(function(data){
		if(data.result == 'ok'){
			var count = data.count;
			var tipInfo = "有"+count+"个调度异常";
			if(count >0){
		    	Artery.get("ribbonCellXtdd").setTip("warn");
		    	Artery.get("ribbonCellXtdd").setTipInfo(tipInfo);
		    }else{
		    	Artery.get("ribbonCellXtdd").setTip("ok");
		    	Artery.get("ribbonCellXtdd").setTipInfo("");
		    }
		}
	});	
}