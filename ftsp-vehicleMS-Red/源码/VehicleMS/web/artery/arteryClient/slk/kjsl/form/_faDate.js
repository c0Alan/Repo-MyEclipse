// **********************************************//
// _faDate 客户端脚本
// 
// @author Artery
// @date 2011-09-20
// @id 9e74c9b77072612eb411b8333c006319
// **********************************************//
/**
 * onClickClient(tbSetValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbSetValue_onClickClient (rc){
	Artery.get("faDatedbe3d").setValue("2009-09-09");	
}
/**
 * onClickClient(tbSetNullValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbSetNullValue_onClickClient (rc){
	Artery.get("faDatedbe3d").setValue(null);	
}
/**
 * onClickClient(tbHide)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbHide_onClickClient (rc){
	Artery.get("faDatedbe3d").hide();	
}
/**
 * onClickClient(tbShow)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbShow_onClickClient (rc){
	Artery.get("faDatedbe3d").show();	
}
/**
 * onClickClient(tbDisabled)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbDisabled_onClickClient (rc){
	Artery.get("faDatedbe3d").disable();	
}
/**
 * onClickClient(tbEnable)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbEnable_onClickClient (rc){
	Artery.get("faDatedbe3d").enable();	
}