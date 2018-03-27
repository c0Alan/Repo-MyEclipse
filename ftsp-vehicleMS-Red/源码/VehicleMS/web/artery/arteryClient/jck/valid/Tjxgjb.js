// **********************************************//
// 添加修改脚本 客户端脚本
// 
// @author Artery
// @date 2010-09-16
// @id 25fe3f97f19e6df408fa58966ee95c45
// **********************************************//
/**
 * 保存脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveScriptBtn_onClickClient (rc){
	Artery.get('editScriptForm').submit(function(result){
		Artery.get('scriptCreateCnt').hide();
		Artery.get('scriptListCnt').show();
		Artery.showTip('保存成功！')
		Artery.get('templateList').reload({highlightValue:result});
		Artery.get('editScriptForm').reset();
	},{optype:this.type});
}
/**
 * 返回脚本列表
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function returnBtn_onClickClient (rc){
	Artery.get('scriptCreateCnt').hide();
	Artery.get('scriptListCnt').show();
	Artery.get('editScriptForm').reset();
}