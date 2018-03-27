// **********************************************//
// 被打开的窗口 客户端脚本
// 
// @author Artery
// @date 2010-11-22
// @id 0b862b9fedb1596b26fde72e8b02adc5
// **********************************************//

/**
 * onClickClient(button58989)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button58989_onClickClient (rc){
	Artery.getWin().callback("callbackFunc");
}

/**
 * onClickClient(button00249)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button00249_onClickClient (rc){
	Artery.getWin().close();
}