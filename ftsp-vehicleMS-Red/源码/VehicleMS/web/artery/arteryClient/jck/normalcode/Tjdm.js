// **********************************************//
// 修改代码项2 客户端脚本
// 
// @author Artery
// @date 2010-08-09
// @id 0f6a2ea99b02427632d0ebe2897a7bae
// **********************************************//
/**
 * 取消按钮单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function shutdownBtn_onClickClient (rc){
	Artery.getWin().close();
}

/**
 * 添加按钮单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient(rc){
	Artery.get("codeFormArea").submit(function(res){
		if(res == "YES"){
			Artery.showTip("保存成功！");
			Artery.getWin().get("codeListArea").reload();
			Artery.getWin().close();
		}else if(res == "DUP"){
			Artery.showTip("存在重复的code!请更换代码标识提交！");
		}else {
			Artery.showTipError("提交失败！");
			Artery.getWin().close();
		}
		
	});	
}
/**
 * 客户端(modifyBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyBtn_onClickClient (rc){
	var code = Artery.getWin().get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	var params = {
					"type":Artery.params.type,
					"code": code
				};

	Artery.get("codeFormArea").submit(function(res){
		if(res == "YES"){
			Artery.showTip("保存成功！");
			Artery.getWin().get("codeListArea").reload();
			Artery.getWin().close();
		}else{
			Artery.showTipError("提交失败！");
			Artery.getWin().close();
		}
		
	},params);			
}

/**
 * 验证脚本(codeFaString)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function codeFaString_onValidClient (rc, value){
	if(Ext.isEmpty(Artery.params.code)){
		rc.put("type",Artery.params.type);
		rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
		rc.put("code",value);
		rc.asyn = false;
		rc.send();
		var result = rc.getResult();
		if(result != "YES")
			return "代码项标识已存在";
	}
}
  	