// **********************************************//
// 导出权限 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-26
// @id b350e33d306a78430b03a67730cefd6d
// **********************************************//
/**
 * 值改变时脚本(exportType, 导出类型)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function exportType_onChangeClient (rc, oldValue, newValue){
	if(newValue == 2){
		Artery.get("exportExpression").enable();
	}else{
		Artery.get("exportExpression").disable();
	}
}

/**
 * 客户端(exportRightBtn, 导出按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function exportRightBtn_onClickClient (rc){
	Artery.download({
		"exportModel": Artery.get("exportType").getValue(),
		"regex" : Artery.get("exportExpression").getValue()
	});
	//Artery.getWin().close();
}

/**
 * 客户端(closeBtn, 关闭按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeBtn_onClickClient (rc){
	Artery.getWin().close();
}