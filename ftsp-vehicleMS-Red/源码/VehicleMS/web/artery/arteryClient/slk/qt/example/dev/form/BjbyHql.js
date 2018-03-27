// **********************************************//
// 编辑byHql 客户端脚本
// 
// @author Artery
// @date 2011-04-14
// @id af9b50de8320f7c8070ad125010de4b6
// **********************************************//
/**
 * onClickClient(submitBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function submitBtn_onClickClient (rc){
	Artery.get('formAreade288').submit(function(result){
		Artery.showTip("保存成功！")
	});	
}