// 数据库交互-附件-图书列表

/**
 * 客户端(oper_delete)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function oper_delete_onClickClient (rc, bookid){
	Artery.confirmMsg("删除","此操作不可恢复，确定要删除吗？",function(btn){
		if(btn == "yes"){
			rc.putParam("bookid",bookid);
			rc.send(function(result){
				if(result.success){
					Artery.showMessage("删除成功，请继续！");
					Artery.get("bookList").reload();
				}
			});
    	}
	});
}

/**
 * 客户端(column_down)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function column_down_onClickClient (rc, bookid){
	Artery.download({
		bookid: bookid
	});
}

/**
 * 客户端(column_search)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function column_search_onClickClient (rc, bookid){
	rc.put("bookid",bookid);
	rc.send(function(result){
 		window.location.href=result.url;
	});
}