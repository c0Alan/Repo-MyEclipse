// **********************************************//
// 修改角色 客户端脚本
// 
// @author Artery.hanf
// @date 2010-09-08
// @id 9351b100a3036cbdd43493c1d9ff2e4a
// **********************************************//
/**
 * onClickClient(saveBtn1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_Right_onClickClient (rc){
	var roleId = Artery.params.roleId;
	if(Ext.isEmpty(roleId)){
		Artery.showTipError("请选择要保存的角色！", "");
	}
	
	var newRightValue = Artery.get("rightTreeArea").getValue();
	var newUserValue = Artery.get("organTreeArea").getValue();
	
	rc.put('roleId', roleId);
	rc.put('rawRightValue', Artery.get("rightTreeArea").value);
	rc.put('newRightValue', newRightValue);
	rc.put('rawUserValue', Artery.get("organTreeArea").value);
	rc.put('newUserValue', newUserValue);
	rc.send(function(result){
		if(result == "ok"){
			Artery.get("rightTreeArea").value = newRightValue;  //更新角色树的初始值
			Artery.get("organTreeArea").value = newUserValue;  //更新拥有权限树的初始值
			Artery.showTip("保存角色成功！", "");
		}else{
			Artery.showTipError("保存角色失败！", "");
		}
	});	
}
/**
 * onClickClient(saveBtn2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_Organ_onClickClient (rc){
	Artery.get("saveBtn_Right").click();
}
/**
 * onLoadClient(form988b4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function form988b4_onLoadClient (rc){
	var organTree = Artery.get("organTreeArea");
	if (organTree && organTree.userPaths) {
		var userPaths = organTree.userPaths.split(";");
		for (var i = 0, len = userPaths.length; i < len; i++) {
			var userPath = "/root/" + userPaths[i].replace(/,/g, "/");
			organTree.expandPath(userPath, "cid");
		}
	}
	
}