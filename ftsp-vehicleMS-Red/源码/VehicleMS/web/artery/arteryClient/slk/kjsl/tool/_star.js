// **********************************************//
// _star 客户端脚本
// 
// @author Artery
// @date 2011-10-10
// @id 0cf95c9b29efd1518314cf3b0a7c0dfd
// **********************************************//
/**
 * onClickClient(tbSetStarNum)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbSetStarNum_onClickClient (rc){
	Artery.get("starShow").setStarSelNum(2);	
}
/**
 * onClickClient(tbGetStarNum)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbGetStarNum_onClickClient (rc){
	alert(Artery.get("starShow").getValue())	
}