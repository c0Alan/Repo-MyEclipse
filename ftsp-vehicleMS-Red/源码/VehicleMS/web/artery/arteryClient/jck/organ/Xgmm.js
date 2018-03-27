// **********************************************//
// 修改密码 客户端脚本
// 
// @author Artery
// @date 2010-11-11
// @id 00f148434070a4fbe80fbd0c65c169e5
// **********************************************//
/**
 * onClickClient(button1d0d8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button1d0d8_onClickClient (rc){
	var oldPass = Artery.get("faOldPass").getValue();	 
    var newPass = Artery.get("faNewPass").getValue();	
    var cfmNewPass = Artery.get("faCfmNewPass").getValue();	
    if(newPass!=cfmNewPass){
    	Artery.showTipError("修改密码失败！\"新密码\"与\"确认新密码\"不一致！","blankPanel0e57f");
    	return ;
    }
    Artery.get("formArea").submit(function(result){
    	if(result=="ok")
    		Artery.showTip("修改密码成功！","blankPanel0e57f");
    	else
    	    Artery.showTipError("修改密码失败！\"旧密码\"输入错误！","blankPanel0e57f");
    });
}