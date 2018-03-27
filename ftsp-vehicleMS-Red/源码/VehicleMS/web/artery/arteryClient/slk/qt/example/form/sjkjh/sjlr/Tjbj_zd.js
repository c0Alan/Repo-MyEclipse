// 数据录入-添加编辑图书（自动）
/**
 * 客户端(button_reset)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_reset_onClickClient (rc){
	Artery.get("formArea").reset();
}

/**
 * 客户端(button_add)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_add_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
		Artery.showMessage("添加成功，请继续");
		Artery.getWin().get("bookList").reload();
		Artery.getWin().close();
	});
}

/**
 * 客户端(button_update)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_update_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
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