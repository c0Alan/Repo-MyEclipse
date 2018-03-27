// example-list-选择列-图书列表

/**
 * 客户端(tbButton_delete)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_delete_onClickClient (rc){
	//List对象的getValues(colName)方法为得到选择列的值，如aaa,bbb
	//List对象的getValuesQuote(colName)方法为得到加单引号的值，如'aaa','bbb'
	Artery.confirmMsg("删除","此操作不可恢复，确定要删除吗？",function(btn){
		if(btn == "yes"){
			var params = Artery.get("bookList").getValuesQuote('deletecol');
			rc.put("bookids",params);
			rc.send(function(result){
				if(result=="ok"){
					Artery.showMessage("删除成功，请继续！");
					Artery.get("bookList").reload();
				}
			});
		}
	});
}