// 表单元素-trigger-给控件赋值

/**
 * 客户端(button_set)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_set_onClickClient (rc){
	var triggerName = Artery.params.triggerName;
	var showV = Artery.get("input_show").getValue();
	var hiddenV = Artery.get("input_hidden").getValue();

	var comp = Artery.getWin().get(triggerName);
	comp.setValue(hiddenV, showV);
	Artery.getWin().close();
}