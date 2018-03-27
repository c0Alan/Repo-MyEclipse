// **********************************************//
// 添加修改模板 客户端脚本
// 
// @author Artery
// @date 2010-09-15
// @id 3cc25f7b34f6eabf26b9eec886c280b6
// **********************************************//
/**
 * 关闭窗口
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
	Artery.getWin().close();	
}
/**
 * 新建模板
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient (rc){
	Artery.get('templateForm').submit(function(result){
		Artery.getWin().showTip('模板新建成功！');
		Artery.getWin().get('listAreaTemplates').reload({
			highlightValue:Artery.get('faStringTplId').getValue()
		});
		Artery.getWin().close();
	});
}
/**
 * 修改模板
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyBtn_onClickClient (rc){
	Artery.get('templateForm').submit(function(result){
		Artery.getWin().showTip('模板更新成功！');
		Artery.getWin().get('listAreaTemplates').reload({
			highlightValue:Artery.get('faStringTplId').getValue()
		});
		Artery.getWin().close();
	},{initTplId:Artery.get('faStringTplId').originalValue});
}
/**
 * 验证模板id唯一
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faStringTplId_onValidClient (rc, value){
	if(Artery.params.runTimeType == 'update'){
		if(value == this.originalValue){
			return;
		}
	}
	rc.asyn = false;
	rc.put('tplId',value);
	rc.send();
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "已经存在值为"+value+"的模板";
	}
}
  	