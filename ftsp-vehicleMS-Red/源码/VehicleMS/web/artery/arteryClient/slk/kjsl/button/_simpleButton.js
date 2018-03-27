// **********************************************//
// _simpleButton 客户端脚本
// 
// @author Artery
// @date 2011-09-21
// @id b36500051612c98eb0440dff4fc01a36
// **********************************************//
/**
 * onClickClient(simpleButton3f71a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton3f71a_onClickClient (rc){
	Artery.get("simpleButton3489f").setText("新的按钮文本");	
}
/**
 * onClickClient(simpleButton6b482)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton6b482_onClickClient (rc){
	Artery.get("simpleButton3489f").hideIcon();		
}
/**
 * onClickClient(simpleButton5939c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton5939c_onClickClient (rc){
	Artery.get("simpleButton3489f").showIcon();			
}
/**
 * onClickClient(simpleButtona3b84)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButtona3b84_onClickClient (rc){
	Artery.get("simpleButton3489f").setIcon("/artery/arteryImage/other/flag_green.png");			
}
/**
 * onClickClient(simpleButton7fb13)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton7fb13_onClickClient (rc){
	Artery.get("simpleButton3489f").click();
}
/**
 * onClickClient(simpleButton93445)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton93445_onClickClient (rc){
	Artery.get("simpleButton3489f").hide();
}
/**
 * onClickClient(simpleButton73df3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton73df3_onClickClient (rc){
	Artery.get("simpleButton3489f").show();
}
/**
 * onClickClient(simpleButton2f50c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton2f50c_onClickClient (rc){
	Artery.get("simpleButton3489f").disable();
}
/**
 * onClickClient(simpleButtona6ddc)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButtona6ddc_onClickClient (rc){
	Artery.get("simpleButton3489f").enable();
}
/**
 * onClickClient(simpleButton58e1b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton58e1b_onClickClient (rc){
	Artery.get("simpleButton3489f").setTooltip("请点击");	
}
/**
 * onClickClient(simpleButton3489f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton3489f_onClickClient (rc){
	alert("触发控件的点击事件");	
}