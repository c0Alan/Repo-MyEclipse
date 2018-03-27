/**
 * 客户端(okBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function okBtn_onClickClient (rc){
	rc.put("bookId",Artery.params.bookId);
	rc.put("frmNUSER",Artery.get("listArea").getValues("checkUser"));
	rc.send(function(result){
 		Artery.getWin().get("bookList").reload();
 		Artery.getWin().close();
	});
}

/**
 * 客户端(cancelBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
	Artery.getWin().close();
}