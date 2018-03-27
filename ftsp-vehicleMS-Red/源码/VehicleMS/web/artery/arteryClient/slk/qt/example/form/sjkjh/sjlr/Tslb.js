// 数据录入-图书列表
/**
 * 客户端(oper_del)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function oper_del_onClickClient (rc, bookid){
	Artery.confirmMsg("删除","此操作不可恢复，确定要删除吗？",function(btn){
		if(btn == "yes"){
			rc.putParam("bookid",bookid);
			rc.send(function(result){
				if(result=="ok"){
					Artery.showMessage("删除成功，请继续！");
					Artery.get("bookList").reload();
				}
			});
    	}
	});
}