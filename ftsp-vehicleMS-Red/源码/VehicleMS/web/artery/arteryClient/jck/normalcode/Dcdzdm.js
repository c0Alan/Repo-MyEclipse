// **********************************************//
// 导出单值代码 客户端脚本
// 
// @author Artery
// @date 2010-08-17
// @id 01a2df75619e7764851d165b3559b630
// **********************************************//
/**
 * 关闭按钮事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function shutBtn_onClickClient (rc){
	Artery.getWin().close();
}

/**
 * 导出按钮点击时事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function exportBtn_onClickClient (rc){
	Artery.download({
		"exportModel": Artery.get("conFaCode").getValue(),
		"regex" : Artery.get("exportFaString").getValue()
	});
}
  	
/**
 * 导出代码模式改变时触发的客户端事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function conFaCode_onChangeClient (rc, oldValue, newValue){
	if(newValue == "3")
		Artery.get("exportFaString").enable();
	else
		Artery.get("exportFaString").disable();
}
  	