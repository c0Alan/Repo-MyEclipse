// **********************************************//
// menu 客户端脚本
// 
// @author Artery
// @date 2010-05-19
// @id 8141029ce58b16d20fab8a44b71a52a8
// **********************************************//
/**
 * 客户端(tbMenuItemfefc7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbMenuItemfefc7_onClickClient (rc){
	alert(2);	
}
/**
 * 客户端(blankPanelc3b94)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function blankPanelc3b94_onClickClient (rc){
	Ext.menu.MenuMgr.hideAll();	
}
/**
 * 客户端(linkAreabd034)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function linkAreabd034_onClickClient (rc){
	Artery.get('listArea01964').setSortInfo({
		field:'C_NAME',
		direction:'asc'
	});	
	Artery.get('listArea01964').reload();
}