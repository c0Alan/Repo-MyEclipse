// **********************************************//
// 添加代码类型项 客户端脚本
// 
// @author Artery
// @date 2010-08-12
// @id 9cb46f46b33f6daa3d88728e8b0ef926
// **********************************************//
/**
 * 添加代码按钮单击，将触发服务端添加代码类型事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient (rc){
	Artery.get("dmlxFormArea").submit(function(res){
		if(res == "YES"){
			Artery.getWin().showTip("保存成功！","formd3771");
			Artery.getWin().get("codeTypelistArea").reload({
				params:{"highlightId":Artery.get('faStringbe572').getValue()}
			});
		}else{
			Artery.getWin().showTipError("保存失败！","formd3771");
		}
		Artery.getWin().close();
	});		
}

/**
 * 取消按钮单击
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * 客户端(modifyBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyBtn_onClickClient (rc){
	var params = {
					"type.type":Artery.params.type,
					"type.name":Artery.params.maintain
				 }
	Artery.get("dmlxFormArea").submit(function(res){
		if(res == "YES"){
			Artery.getWin().showTip("保存成功！","formd3771");
			Artery.getWin().get("codeTypelistArea").reload({
				params:{"highlightId":Artery.get('faStringbe572').getValue()}
			});
			Artery.getWin().close();
		}
	},params);		
}
  	
/**
 * 验证脚本(faStringbe572)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faStringbe572_onValidClient (rc, value){
	if(Ext.isEmpty(Artery.params.type)){
		rc.put("type",value);
		rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
		rc.asyn = false;
		rc.send();
		var result = rc.getResult();
		if(result != "YES")
			return "代码类型标识已存在";
	}
}
  	