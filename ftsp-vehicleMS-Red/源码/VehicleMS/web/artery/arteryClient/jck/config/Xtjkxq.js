// **********************************************//
// 系统监控详情 客户端脚本
// 
// @author Artery
// @date 2011-02-28
// @id 2f4771cd032b2f267c95f51fb4c64649
// **********************************************//
/**
 * onClickClient(tbButton61efc)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function tbButton61efc_onClickClient(rc) {
	Artery.get("dynamicNav2bb7e").expandAll();
}
/**
 * onClickClient(tbButton3d415)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function tbButton3d415_onClickClient(rc) {
	Artery.get("dynamicNav2bb7e").collapseAll();
}
/**
 * onClickClient(tbButtonbdf8e)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function tbButtonbdf8e_onClickClient(rc) {
	var tree = Artery.get("dynamicNav2bb7e");
	if (!tree.treeFilter) {
		tree.treeFilter = new Ext.tree.TreeFilter(tree);
		tree.on("load", function() {
					tree.treeFilter.filterBy(function(node) {
								var cost = node.attributes.cost;
								return cost > 0;
							});
				});

	}
	tree.treeFilter.filterBy(function(node) {
				var cost = node.attributes.cost;
				return cost > 0;
			});
}

/**
 * onClickClient(tbButton8f6c6)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function tbButton8f6c6_onClickClient(rc) {
	var tree = Artery.get("dynamicNav2bb7e");
	if (!tree.treeFilter) {
		tree.treeFilter = new Ext.tree.TreeFilter(tree);
		tree.on("load", function() {
					tree.treeFilter.clear();
				});

	}
	tree.treeFilter.clear();
}