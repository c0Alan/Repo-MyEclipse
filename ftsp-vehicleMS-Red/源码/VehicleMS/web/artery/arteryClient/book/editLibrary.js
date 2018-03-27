/**
 * 客户端(addButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addButton_onClickClient (rc){
	Artery.get("formArea").submit(function(result){ 
    	Artery.getWin().get("libraryList").reload(); 
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
    	Artery.getWin().get("libraryList").reload(); 
    	Artery.getWin().close(); 
	});
}

/**
 * 客户端(cancelButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelButton_onClickClient (rc){
	Artery.getWin().close();
}