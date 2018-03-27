// **********************************************//
// 新建权限 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-23
// @id 96f47aa3ddb495844a3c1cb6132f791b
// **********************************************//
/**
 * 客户端(buttone135c, 取消按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeBtn_onClickClient (rc){
	Artery.getWin().close();	
}

/**
 * 客户端(ddBtn,添加按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient (rc){
	var userJson = {users:Artery.get("selUserTreeArea").getValue()};//需要增加权限的用户列表
	Artery.get('formArea98754').submit(function(result){
		if(result == "ok"){
			Artery.getWin().get("rightList").reload({
				highlightValue:Artery.get('keyStr').getValue()
			});
			Artery.getWin().showTip("新增权限成功", "formbd24a");
			Artery.getWin().close();
		}else{
			Artery.showTipError("新增权限失败！" + result, "form777e1");
		}
	}, userJson);
}

/**
 * 客户端(updateBtn, 更新按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateBtn_onClickClient (rc){
	//需要增权限和删除权限的用户列表
	var userJson = {rawUsers:Artery.get("selUserTreeArea").value, newUsers:Artery.get("selUserTreeArea").getValue()};
	Artery.get('formArea98754').submit(function(result){
		if(result == "ok"){
			Artery.getWin().get("rightList").reload({
				highlightValue:Artery.get('keyStr').getValue()
			});
			Artery.getWin().showTip("更新权限成功", "formbd24a");
			Artery.getWin().close();
		}else{
			Artery.showTipError("更新权限失败！" + result, "form777e1");
		}
	}, userJson);
}

/**
 * 验证脚本(keyStr, 权限字)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function keyStr_onValidClient (rc, value){
	if(Artery.params.runTimeType == 'update'){
		if(this.originalValue === undefined || value == this.originalValue){
			return;
		}
	}
	rc.asyn = false;
	rc.put('rightKey',value);
	rc.send();
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "存在值为“"+value+"”的权限字！";
	}
}