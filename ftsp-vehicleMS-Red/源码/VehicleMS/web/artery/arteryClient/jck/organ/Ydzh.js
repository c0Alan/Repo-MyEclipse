// **********************************************//
// 移动帐户 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-25
// @id e3ffa782cb626e50e808e722ffeb8ee4
// **********************************************//
/**
 * 客户端(moveBtn, 确定按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function moveBtn_onClickClient (rc){
	var newPId = Artery.get("organTreeArea").getValue();
	if(!newPId){
		Artery.showTipError("请选择目标组织！", 'form14083');
		return;
	}
	var userId = Artery.params.userId;
	if(Ext.isEmpty(userId)){
		Artery.showTipError("请选择需要移动的用户！", 'form14083');
		return;
	}
	rc.put("newPId",newPId);
	rc.put("userId",userId);
	rc.send(function(result){
		if(result.rs == "ok"){
			Artery.getWin().showTip("移动用户成功！", 'organForm');
			var dt = Artery.getWin().get("dynamicNav");// 更新组织树
			dt.root.reload();
			dt.expandNode(result.userPath);
			Artery.getWin().close();
		}else{
			Artery.showTipError("移动用户失败！"+result.rs, 'form14083');
		}
	});
}

/**
 * 关闭按钮
 * @param {} rc
 */
function closeBtn_onClickClient (rc){
	Artery.getWin().close();
}