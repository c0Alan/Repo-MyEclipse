// 数据库交互-登录，退出登录

/**
 * 客户端(button_login)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_login_onClickClient (rc){
	Artery.get("formArea").login(function(result){
		location.reload(true);
	});
}
/**
 * 客户端(button_logout)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_logout_onClickClient (rc){
	Artery.logout(function(result){
		location.reload(true);
	});
}