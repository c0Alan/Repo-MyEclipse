// **********************************************//
// _dynamicNav 客户端脚本
// 
// @author Artery
// @date 2011-09-20
// @id ea9c2375e9e6d516561629510756b286
// **********************************************//
/**
 * onClickClient(tbReload)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbReload_onClickClient (rc){
	var lastClick = Artery.get("daynmic_tree").getClickNode();
	if (lastClick && !lastClick.isLeaf()) {
		lastClick.reload();
	}
}
/**
 * onClickClient(tbButton53998)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton53998_onClickClient (rc){
	var dt = Artery.get("daynmic_tree");
	dt.root.reload(function() {
				dt.doExpandTree();
			});	
}

/**
 * onClickClient(execSQLBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function execSQLBtn_onClickClient(rc) {
	Artery.get("sqlFormArea").submit(function(result) {
		Artery.showMessage(result);
	});
}
