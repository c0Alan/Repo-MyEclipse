// **********************************************//
// _splitButton 客户端脚本
// 
// @author Artery
// @date 2011-09-22
// @id dceec3ab17091a9ddf33e3d4ab2d03e0
// **********************************************//
/**
 * onClickClient(splitButton97e10)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function splitButton97e10_onClickClient (rc){
	alert("触发了按钮点击事件");	
}
/**
 * onClickClient(splitButton59e1c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function splitButton59e1c_onClickClient (rc){
	alert("触发了按钮点击事件，点击右侧的小箭头会弹出菜单项");		
}
/**
 * onExpandClient(splitButton480f3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function splitButton480f3_onExpandClient (rc){
	alert("您展开了分割按钮");	
}
/**
 * onCollapseClient(splitButtonb8f81)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function splitButtonb8f81_onCollapseClient (rc){
	alert("您折叠了分割按钮");	
}
/**
 * onClickClient(button72bb9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button72bb9_onClickClient (rc){
	Artery.get("splitButtonafe92").hide();	
}
/**
 * onClickClient(button9e403)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button9e403_onClickClient (rc){
	Artery.get("splitButtonafe92").show();	
}
/**
 * onClickClient(buttonb9a6b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonb9a6b_onClickClient (rc){
	Artery.get("splitButtonafe92").disable();	
}
/**
 * onClickClient(button15335)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button15335_onClickClient (rc){
	Artery.get("splitButtonafe92").enable();	
}
/**
 * onClickClient(button1c5cf)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button1c5cf_onClickClient (rc){
	Artery.get("splitButtonafe92").setTooltip("点击我");	
}
/**
 * onClickClient(splitButtonafe92)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function splitButtonafe92_onClickClient (rc){
	alert("触发了按钮点击事件");	
}
/**
 * onClickClient(button8676f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button8676f_onClickClient (rc){
	Artery.get("splitButtonafe92").click();
}
/**
 * onClickClient(buttonac8f9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonac8f9_onClickClient (rc){
	Artery.get("splitButtonafe92").hideIcon();	
}
/**
 * onClickClient(button8e288)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button8e288_onClickClient (rc){
	Artery.get("splitButtonafe92").showIcon();	
}
/**
 * onClickClient(button86de8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button86de8_onClickClient (rc){
	Artery.get("splitButtonafe92").setIcon("/artery/arteryImage/sample/help.gif");
}