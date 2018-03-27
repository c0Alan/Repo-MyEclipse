// **********************************************//
// _listArea_extendedPanel 客户端脚本
// 
// @author Artery
// @date 2011-09-26
// @id e9bb584c0ad66e3b35901a74d885d23a
// **********************************************//
/**
 * onMouseOverClient(blankPanel891dd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(blankPanel89ced).id}
 */
function blankPanel891dd_onMouseOverClient (rc, cooltip){
Artery.get(cooltip).alignTo(this.el, 'tr?', [ -6, -10 ]);	
}
/**
 * onMouseOutClient(blankPanel891dd)
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(blankPanel89ced).id}
 */
function blankPanel891dd_onMouseOutClient (rc, cooltip){
(function() {
		if (!Artery.get(cooltip).mouseOver) {
			Artery.get(cooltip).hide();
		}
	}).defer(100);
}