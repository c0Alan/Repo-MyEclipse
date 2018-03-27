// **********************************************//
// _navTab 客户端脚本
// 
// @author Artery
// @date 2011-09-27
// @id 0a5356a719f38bdb00f24c07c9dd82f8
// **********************************************//
/**
 * onClickClient(navTabItem6e830)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function navTabItem6e830_onClickClient (rc){
	var link = "http://www.google.cn"
	Artery.get("operAreacdea0").showLink(link);	
}
/**
 * onClickClient(navTabItem042fa)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function navTabItem042fa_onClickClient (rc){
	var link = {
		formId :"74376239e57d9cf210ca7c7ad50f7de1",
		formType : Artery.FORM,
		target : "_self"
	}
	Artery.get("operAreacdea0").showForm(link);	
}