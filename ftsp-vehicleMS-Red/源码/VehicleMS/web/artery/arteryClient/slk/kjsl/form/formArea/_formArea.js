// **********************************************//
// _formArea 客户端脚本
// 
// @author Artery
// @date 2011-10-20
// @id f5a6cedc3b2dd1e13583b80ca939ff8f
// **********************************************//
/**
 * onClickClient(button9091f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button9091f_onClickClient (rc){
	Artery.get('formAreac4992').submit(function(result) {
		Artery.showMessage("表单提交成功！");
	});
}
/**
 * onClickClient(buttonf7ccd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf7ccd_onClickClient (rc){
	Artery.get('formArea7052b').submit(function(result) {
		Artery.showMessage("表单提交成功！");
	});
}

/**
 * onClickClient(button9091f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttone0285_onClickClient(rc) {
	Artery.get('formArea0ce32').submit(function(result){
		Artery.showMessage(result);
	});
}


/**
 * onClickClient(buttonf7ccd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonbdfb7_onClickClient(rc) {
	Artery.get('formArea6da1c').submit(function(result) {
		Artery.showMessage(result);
	});
}
