// **********************************************//
// 新建bySql 客户端脚本
// 
// @author Artery
// @date 2011-04-14
// @id 5d0e102e82bafa2b25a955f50d8c1659
// **********************************************//
/**
 * 提交
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function submitBtn_onClickClient (rc){
	Artery.get('formAreae6958').submit(function(result){
		Artery.showTip("保存成功！")
	});	
}