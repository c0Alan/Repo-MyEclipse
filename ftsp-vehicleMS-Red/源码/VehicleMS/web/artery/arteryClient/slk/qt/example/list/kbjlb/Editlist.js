// example-list-可编辑列表-editlist

/**
 * 客户端(tbButton_save)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_save_onClickClient (rc){
	Artery.get("bookList").submit(function(result){
		if(result.success){
			Artery.showMessage("保存成功，请继续");
		}
	});
}

/**
 * 客户端(tbButton_insert)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_insert_onClickClient (rc){
	Artery.get("bookList").insertRecord();
}

/**
 * 客户端(tbButton_delete)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_delete_onClickClient (rc){
	Artery.get("bookList").deleteRecord();
}