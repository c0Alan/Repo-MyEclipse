// example-frame-动态导航

/**
 * 客户端(tbButton_reload)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_reload_onClickClient (rc){
	var lastClick = Artery.get("daynmic_tree").getClickNode();
	if(lastClick && !lastClick.isLeaf()){
		lastClick.reload();
	}
}

/**
 * 点击节点脚本(daynmic_tree)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function daynmic_tree_onNodeClickClient (rc, node){
	alert(node.text);
}
    