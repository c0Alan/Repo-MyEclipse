// **********************************************//
// _faHidden 客户端脚本
// 
// @author Artery
// @date 2011-10-17
// @id 7acb6f335bacc81ba997166260d1a272
// **********************************************//

/**
 * onClickClient(button1e6d1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button1e6d1_onClickClient(rc) {
	Artery.get('formArea8097b').submit(function(result) {
		Artery.showMessage(result);
	});
}

/**
 * onClickClient(button15da7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button15da7_onClickClient (rc){
	Artery.get('formArea8097b').disableAllSub();
	Artery.get('formArea8097b').submit(function(result) {
		Artery.showMessage(result);
	});
}