// example-other-提示窗口示例

/**
 * 客户端(button_alert)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_alert_onClickClient (rc){
	Artery.alertMsg("提示信息","Alert提示窗口");
}
/**
 * 客户端(button_confirm)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_confirm_onClickClient (rc){
	Artery.confirmMsg("提示","点击'是'继续操作",function(btn){
		if(btn == "yes"){
			alert("点击的按钮为‘是’");           
		}
	});
}
/**
 * 客户端(button_prompt)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_prompt_onClickClient (rc){
	Artery.promptMsg("提示","注意，您输入的内容会显示出来",function(btn,text){
		if(btn == 'yes'){
			alert(text);
		}
	},"这是默认值");
}
/**
 * 客户端(button_message)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_message_onClickClient (rc){
	Artery.showMessage("系统提示Message");
}
/**
 * 客户端(button_info)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_info_onClickClient (rc){
	Artery.showInfo("这是普通提示信息");
}
/**
 * 客户端(button_warning)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_warning_onClickClient (rc){
	Artery.showWarning("警告，此操作很危险！");
}
/**
 * 客户端(button_error)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_error_onClickClient (rc){
	Artery.showError("出错啦，请检查！");
}
/**
 * 客户端(button_loading)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_loading_onClickClient (rc){
	Artery.loading();
}
/**
 * 客户端(button_loadTrue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_loadTrue_onClickClient (rc){
	Artery.loadTrue("请求成功，请继续");
}
/**
 * 客户端(button_loadFalse)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_loadFalse_onClickClient (rc){
	Artery.loadFalse("加载失败，请检查！");
}
/**
 * 客户端(button_hide)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_hide_onClickClient (rc){
	Artery.hideMessage();
}