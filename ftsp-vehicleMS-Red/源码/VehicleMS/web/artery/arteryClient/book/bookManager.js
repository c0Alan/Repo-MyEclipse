
/**
 * ����ڵ�ű�(bookLib_tree)
 * 
 * @param  rc ϵͳ�ṩ��AJAX���ö���
 * @param  node �������ڵ�
 */
function bookLib_tree_onNodeClickClient (rc, node){
	Artery.get("bookList").reload({params:{
		libraryId:node.attributes.cid	
	}});
}
    

/**
 * �ͻ���(tbButtonF01D4)
 * 
 * @param  rc ϵͳ�ṩ��AJAX���ö���
 */
function tbButtonF01D4_onClickClient (rc){
	Artery.get("tb1").show();
	Artery.get("tb2").hide();
	Artery.get("tb3").hide();
}

/**
 * �ͻ���(tbButtonAD920)
 * 
 * @param  rc ϵͳ�ṩ��AJAX���ö���
 */
function tbButtonAD920_onClickClient (rc){
	Artery.get("tb1").hide();
	Artery.get("tb2").show();
	Artery.get("tb3").hide();	
}

/**
 * �ͻ���(tbButton8F6B9)
 * 
 * @param  rc ϵͳ�ṩ��AJAX���ö���
 */
function tbButton8F6B9_onClickClient (rc){
	Artery.get("tb1").hide();
	Artery.get("tb2").hide();
	Artery.get("tb3").show();
}