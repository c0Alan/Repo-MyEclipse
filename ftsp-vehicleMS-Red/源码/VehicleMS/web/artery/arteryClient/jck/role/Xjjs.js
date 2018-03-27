// **********************************************//
// 新建角色 客户端脚本
// 
// @author Artery.hanf
// @date 2010-09-07
// @id ba646ede9e99a1c0326e84bb05bc00ac
// **********************************************//
/**
 * 客户端(closeBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeBtn_onClickClient (rc){
	Artery.getWin().close();	
}

/**
 * 客户端(insertBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function insertBtn_onClickClient (rc){
	Artery.get('formArea98754').submit(function(result){
		if(result.rs == "ok"){
			Artery.getWin().showTip("创建角色成功！", "form9195f");
			var crl = Artery.getWin().get("customRoleList"); // 角色列表
			crl.reload({
				"params" : {
					"selectId" : result.id
				},
				"callback" : function(){
					Artery.getWin().close();
				}
			}, false);
		}
	});	
}

/**
 * 验证脚本(roleName, 角色名称)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function roleName_onValidClient (rc, value){
	if(Artery.params.runTimeType == 'update'){
		if(this.originalValue === undefined || value == this.originalValue){
			return;
		}
	}
	rc.asyn = false;
	rc.put('roleName',value);
	rc.send();
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "存在值为“"+value+"”的角色名称！";
	}
}