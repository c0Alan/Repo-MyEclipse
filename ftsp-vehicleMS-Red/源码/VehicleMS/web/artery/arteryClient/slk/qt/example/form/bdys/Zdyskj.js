// 表单元素-日期控件

/**
 * 客户端(tbButton_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_1_onClickClient (rc){
	Artery.get("tree1").setValue("11,21");
}
/**
 * 客户端(tbButton_2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_2_onClickClient (rc){
	alert(Artery.get("tree1").getValue());
}

/**
 * 加载前脚本(faTree_1)
 * 
 * @param  loader 用于加载节点的对象
 * @param  node 展开的节点
 */
function faTree_1_onBeforeLoad (loader, node){
	loader.baseParams.pp1 = "userParam";
}
  	