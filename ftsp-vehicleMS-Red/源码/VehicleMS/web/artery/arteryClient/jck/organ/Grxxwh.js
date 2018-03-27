// **********************************************//
// 个人信息维护 客户端脚本
// 
// @author Artery
// @date 2010-11-11
// @id 7b857b9491d6824c2faa278c6d1a8265
// **********************************************//
/**
 * onClickClient(button34ba5)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button34ba5_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
		if(result == 'ok'){
			Artery.showTip("修改个人信息成功！","blankPanel841af");
		}else{
			Artery.showErrorTip("修改个人信息失败！","blankPanel841af");
		}
	});	
}