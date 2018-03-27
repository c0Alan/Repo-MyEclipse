/**
 * 客户端(A5477c75ec7b23f102a26cb167208a549)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addButton_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
    	Artery.getWin().get("bookList").reload();
    	Artery.getWin().close();
	});
}

/**
 * 客户端(updateButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateButton_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
    	Artery.getWin().get("bookList").reload();
    	Artery.getWin().close();
	});
}

/**
 * 客户端(closeButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeButton_onClickClient (rc){
	Artery.getWin().close();
}