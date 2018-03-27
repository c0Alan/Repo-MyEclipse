// **********************************************//
// 添加修改帐号 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-19
// @id 164e57c06ee31f07f8f592b2a4b9f02c
// **********************************************//
/**
 * 客户端(addUserBtn, 添加用户按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addUserBtn_onClickClient (rc){
	var lognId = Artery.get("userLoginId").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("新建登录名称为\"" + lognId + "\"的用户成功！", 'blankPanel21477');
			var dt = Artery.getWin().get("dynamicNav");// 更新组织树
			var node = dt.getClickNode(); 
			node.reload(function(){
				var addedNode = node.findChild('cid', "user_"+result.id);
				if(addedNode){
				dt.fireEvent('click',addedNode);
				}
			});
		}else{
			Artery.showTipError("新建用户失败！\n"+result.rs, 'blankPanel21477');
		}
	});
}

/**
 * 客户端(updateUserBtn, 更新用户按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateUserBtn_onClickClient (rc){
	var li = Artery.get("userLoginId");
	var lognId = li.getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("更新登录名称为\"" + lognId + "\"的用户成功！",'blankPanel21477');
			li.originalValue = lognId; //修改loginId控件的原始值
			var node = Artery.getWin().get("dynamicNav").getClickNode();
			if(null != result.name && "" != result.name){ // 判断是否要更新节点名称
				node.setText(result.name);
			}
			var valid = Artery.get("userValid").getValue();
			if(valid == "1"){
				node.getUI().removeClass("organ-treenode-invalid");
			}else if(valid == "2"){
				node.getUI().addClass("organ-treenode-invalid");
			}
		}else{
			Artery.showTipError("更新登录名称为\"" + lognId + "\"的用户成功！",'blankPanel21477');
		}
	});	
}

/**
 * 客户端(initUserPwdBtn, 初始化密码按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function initUserPwdBtn_onClickClient (rc){
	var loginId = Artery.get("userLoginId").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.get('infoArea').setHtml("用户密码初始化成功！\n" + loginId
				+ "的密码初始化为<span style="
				+ "'font-family: Arial, Helvetica, sans-serif;font-weight: bold;"
				+ "font-size: 16px;color:blue'>[&nbsp;" + result.pwd
				+ "&nbsp;]</span>");
			Artery.get('blankPanel8768f').show();
			Artery.get('blankPanel8768f').center();
		}else{
			Artery.showError("用户密码初始化失败！\n"+result.rs);
		}
	});		
}

/**
 * 客户端(closeSBtn, 关闭提示消息按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeSBtn_onClickClient (rc){
	Artery.get('blankPanel8768f').hide();
}

/**
 * 客户端(saveBtn_Role)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_Role_onClickClient (rc){
	var userId = Artery.params.userId;
	if(Ext.isEmpty(userId)){
		Artery.showTipError("用户编号为空！", "navTabArea16e66");
		return;
	}
	
	newRoleValue = Artery.get("roleTreeArea").getValue();
	newRightValue = Artery.get("rightTreeArea").getValue();
	
	rc.put('userId', userId);
	rc.put('rawRoleValue', Artery.get("roleTreeArea").value);
	rc.put('newRoleValue', newRoleValue);
	rc.put('rawRightValue', Artery.get("rightTreeArea").value);
	rc.put('newRightValue', newRightValue);
	rc.send(function(result){
		if(result == "ok"){
			Artery.get("roleTreeArea").value = newRoleValue;  //更新角色树的初始值
			Artery.get("rightTreeArea").value = newRightValue;  //更新拥有权限树的初始值
			Artery.get("hasRightTreeArea").root.reload(function(){	//刷新全部权限树
				Artery.get("hasRightTreeArea").root.expand(true);
			});
			Artery.showTip("保存用户权限成功！", "navTabArea16e66");
		}else{
			Artery.showTipError("保存用户权限失败！", "navTabArea16e66");
		}
	});
}

/**
 * onClickClient(saveBtn_Right)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_Right_onClickClient (rc){
	Artery.get("saveBtn_Role").click();
}

/**
 * 验证脚本(userLoginId)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function userLoginId_onValidClient (rc, value){
	if(Artery.params.runTimeType == 'update'){
		if(this.originalValue === undefined || value == this.originalValue){
			return;
		}
	}
	rc.asyn = false;
	rc.put('loginId',value);
	rc.send();
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "已经存在值为“"+value+"”的登录名称！";
	}
}
