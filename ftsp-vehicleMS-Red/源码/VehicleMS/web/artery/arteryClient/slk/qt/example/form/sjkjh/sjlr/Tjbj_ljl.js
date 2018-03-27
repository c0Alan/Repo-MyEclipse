// 数据录入-添加编辑图书（逻辑类）

/**
 * 客户端(resetBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function resetBtn_onClickClient (rc){
	Artery.get("formArea").reset();
}
/**
 * 客户端(addBookBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBookBtn_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
		Artery.showMessage("添加成功，请继续");
		Artery.getWin().get("bookList").reload();
		Artery.getWin().close();
	});
}
/**
 * 客户端(updateBookBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateBookBtn_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
		Artery.showMessage("更新成功，请继续");
		Artery.getWin().get("bookList").reload();
		Artery.getWin().close();
	});
}
/**
 * 客户端(button_cancel)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_cancel_onClickClient (rc){
	Artery.getWin().close();
}