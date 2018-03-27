// **********************************************//
// 动态树测试 客户端脚本
// 
// @author Artery
// @date 2012-07-06
// @id bdd9a60ac9255be9b65676c11c7e9a83
// **********************************************//
var srcParentCid = null;
/**
 * onClickClient(buttonbbabb)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonbbabb_onClickClient (rc){
	var nodeCids = Artery.get("treeAreaef1d4").getValue();
	if(nodeCids.length == 0) {
		Artery.showMessage("请选择字典表");
		return;
	}
	if(nodeCids.indexOf(".group") != -1) {
		Artery.showWarning("不能选择分组目录！");
		return;
	}
	Artery.openForm({
		formId: "d48c393f7570f25519b8821f046952d5",
		formType: "1",
		target: "_window",
		targetHeight: 400,
		targetHeight: 350,
		modal: "1",
		resizable: "1",
		title:"设置分组",
		forceContextPath: true,
		fullScreen: false,
		params:{
			groupInfo : nodeCids
		}
	});
}
/**
 * onClickClient(treeAreaef1d4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(treeAreaef1d4).id}
 */
function treeAreaef1d4_onClickClient (rc, id){
	var attributes = Artery.get("treeAreaef1d4").eventModel.lastOverNode.attributes;
	if(attributes.cid == "ungroup" || attributes.leaf) {
		return;
	}
	var index = attributes.cid.indexOf(".group");
	Artery.openForm({
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
			cid : attributes.cid.substring(0, index)
		}
	});
}
    
/**
 * onClickClient(buttonafde2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonafde2_onClickClient (rc){
	Artery.openForm({
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
		runTimeType: "insert"
	});
}
/**
 * onClickClient(buttonDel)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonDel_onClickClient (rc){
	var tree = Artery.get("treeAreaef1d4");
	var idString = tree.getValue();
	if(idString.length == 0) {
		Artery.showWarning("请选择节点！");
		return;
	}
	var attributes = Artery.get("treeAreaef1d4").eventModel.lastOverNode.attributes;
	Artery.confirmMsg("删除表","此操作不可恢复，确定要删除吗？",function(btn){
        if(btn == "yes"){
        	rc.put("id",idString);
        	rc.send(function(result) {
        		if(result) {
        			Artery.showMessage("删除成功！");
        			tree.reload();
        			tree.expandAll();
        		} else {
        			Artery.showError("删除失败！请检查");
        		}
        	})
        }
	});
}