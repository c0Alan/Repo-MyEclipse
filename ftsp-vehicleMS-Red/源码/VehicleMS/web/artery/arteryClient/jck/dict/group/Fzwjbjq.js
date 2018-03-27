// **********************************************//
// 分组文件编辑器 客户端脚本
// 
// @author Artery
// @date 2012-07-09
// @id 82dcba65115d0ce8e4406c864209ac6a
// **********************************************//

/**
 * onClickClient(buttonadd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonadd_onClickClient (rc){
	insertOrUpdate(rc);
}
/**
 * onClickClient(buttonupdate)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonupdate_onClickClient (rc){
	insertOrUpdate(rc);
}

function insertOrUpdate(rc) {
	var faStringGroupName = Artery.get("faStringGroupName").getValue();
	var faStringShowName = Artery.get("faStringShowName").getValue();
	var desc = Artery.get("faStringDesc").getValue();
	var faHiddenCid = Artery.get("faHiddenId").getValue();
	
	if(!faStringGroupName) {
		faStringGroupName = "";
	}
	if(!desc) {
		desc = "";
	}
	rc.put("groupName", faStringGroupName);
	rc.put("showName", faStringShowName);
	rc.put("desc", desc);
	rc.put("groupId", faHiddenCid);
	rc.send(function(resultValue){
		Artery.getWin().get("operArea3939f").openForm({
			formId: "6abde7032f184bee36c0ce208b066fd0",
			formType: "1",
			target: "_window",
			targetHeight: 400,
			targetHeight: 350,
			modal: "1",
			resizable: "1",
			title:"文件编辑器",
			forceContextPath: true,
			fullScreen: false,
			runTimeType: "update",
			params:{
				cid : resultValue
			}
		});
		var tree = Artery.getWin().get("treeAreaef1d4");
		tree.reload();
		tree.expandAll();
		Artery.getWin().close();
		Artery.showMessage("操作成功！");
	})
}