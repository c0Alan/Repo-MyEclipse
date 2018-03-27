// **********************************************//
// 添加表单页面 客户端脚本
// 
// @author Artery
// @date 2010-11-29
// @id 16f34c39f2d52c178ba69fc743a28328
// **********************************************//
/**
 * onClickClient(saveBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_onClickClient (rc){
		var value = Artery.get('treeAreaff5cb').getValue();
		rc.put('forms',value);
		rc.put('tplId',Artery.getWin().getWindow().Artery.params.tplId)
		rc.send(function(result){
			Artery.getWin().showTip('表单参数添加成功！');
			Artery.getWin().get('formsList').reload();
			Artery.getWin().close();
		});
}
/**
 * onClickClient(cancelBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * 加载前脚本(complibDynamicNode)
 * 
 * @param  loader 加载器
 * @param  node 导航树节点
 */
function complibDynamicNode_onBeforeLoad (loader, node){
	loader.baseParams.node_complibId = node.attributes.complibId;
}
    