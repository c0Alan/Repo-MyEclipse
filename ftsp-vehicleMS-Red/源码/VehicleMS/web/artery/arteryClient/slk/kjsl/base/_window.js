// **********************************************//
// _window 客户端脚本
// 
// @author Artery
// @date 2011-09-20
// @id 74376239e57d9cf210ca7c7ad50f7de1
// **********************************************//
/**
 * onClickClient(tbShow)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbShow_onClickClient (rc){
	Artery.get("winExample").show();
}
/**
 * onClickClient(tbShowAt)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbShowAt_onClickClient (rc){
	var x = 10;
	var y = 20;
	Artery.get("winExample").showAt([x,y]);	
}
/**
 * onClickClient(tbHide)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbHide_onClickClient (rc){
	Artery.get("winExample").hide();
}
/**
 * onClickClient(tbAlignTo)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbAlignTo_onClickClient (rc){
	Artery.get("winExample").alignTo("htmlAreade9b8","l",[100,50]);	
	Artery.get("winExample");
}