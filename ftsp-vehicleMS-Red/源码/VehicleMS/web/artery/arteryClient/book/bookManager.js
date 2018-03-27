
/**
 * 点击节点脚本(bookLib_tree)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function bookLib_tree_onNodeClickClient (rc, node){
	Artery.get("bookList").reload({params:{
		libraryId:node.attributes.cid	
	}});
}
    

/**
 * 客户端(tbButtonF01D4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonF01D4_onClickClient (rc){
	Artery.get("tb1").show();
	Artery.get("tb2").hide();
	Artery.get("tb3").hide();
}

/**
 * 客户端(tbButtonAD920)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonAD920_onClickClient (rc){
	Artery.get("tb1").hide();
	Artery.get("tb2").show();
	Artery.get("tb3").hide();	
}

/**
 * 客户端(tbButton8F6B9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton8F6B9_onClickClient (rc){
	Artery.get("tb1").hide();
	Artery.get("tb2").hide();
	Artery.get("tb3").show();
}