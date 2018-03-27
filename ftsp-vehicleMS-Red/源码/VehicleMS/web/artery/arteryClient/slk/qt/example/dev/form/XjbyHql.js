// **********************************************//
// 新建byHql 客户端脚本
// 
// @author Artery
// @date 2011-04-14
// @id 1fa920fc9aa114d4ece4d2786dc02079
// **********************************************//
/**
 * onClickClient(submitBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function submitBtn_onClickClient (rc){
	Artery.get('formAread4faa').submit(function(result){
		Artery.showTip("保存成功！")
	});	
}