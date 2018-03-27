// **********************************************//
// _navTabLeft 客户端脚本
// 
// @author Artery
// @date 2011-09-27
// @id cb2991cca8de995e13a2e5a7359edf3b
// **********************************************//

/**
 * onClickClient(navTabItem6e830)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function navTabItem6e830_onClickClient(rc) {
  var link = "http://www.google.cn"  
  Artery.get("operAreacdea0").showLink(link);
}


/**
 * onClickClient(navTabItem042fa)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function navTabItem042fa_onClickClient(rc) {
  var link = {
	  formId: "74376239e57d9cf210ca7c7ad50f7de1", 
	  formType: Artery.FORM,
	  target: "_self"
  }  
  Artery.get("operAreacdea0").showForm(link);
}

/**
 * onClickClient(navTabItemfa452)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function navTabItemfa452_onClickClient (rc){
	var message = "第三个选项卡";
	Artery.showMessage(message);	
}