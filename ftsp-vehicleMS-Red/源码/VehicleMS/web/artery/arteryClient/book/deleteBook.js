/**
 * 客户端(deleteButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function deleteButton_onClickClient (rc){
	Artery.confirmMsg('删除',"确定要删除吗？",function(btn){
		if(btn == 'yes'){
        	Artery.getCmp("formArea").submit(function(result){
				Artery.getWin().get("bookList").reload(); 
				Artery.getWin().close();
        	});
     	}
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