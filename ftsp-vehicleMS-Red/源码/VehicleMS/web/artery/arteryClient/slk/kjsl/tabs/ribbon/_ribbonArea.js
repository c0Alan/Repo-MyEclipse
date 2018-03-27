// **********************************************//
// _ribbonArea 客户端脚本
// 
// @author Artery
// @date 2011-09-21
// @id 245867d5a896a8f38c30305b1c33723f
// **********************************************//
/**
 * onClickClient(ribbonCell7ea72)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell7ea72_onClickClient (rc){
	var message = "提示信息....";
	Artery.showMessage(message);	
}
/**
 * onClickClient(ribbonCell19afd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell19afd_onClickClient (rc){
	var tip = "0个"
	Artery.get("ribbonCell19afd").setTip(tip, true);
}
/**
 * onClickClient(ribbonCellaa08a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCellaa08a_onClickClient (rc){
	var tip = "0个"
	Artery.get("ribbonCellaa08a").setTip(tip, false);
}
/**
 * onClickClient(ribbonCell6688f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell6688f_onClickClient (rc){
	Artery.get("ribbonCell6688f").hideTip();
	
	//或
	
//	var tip = ""
//	Artery.get("ribbonCell6688f").setTip(tip, false);
}