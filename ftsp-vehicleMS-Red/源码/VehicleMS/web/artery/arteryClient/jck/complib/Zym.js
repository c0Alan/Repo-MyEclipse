// **********************************************//
// 主页面 客户端脚本
// 
// @author Artery
// @date 2010-07-28
// @id f66bcc4d51f25c9c1fe11ca6d4689721
// **********************************************//
/**
 * 新建类别
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addFolderBtn_onClickClient (rc){
	Artery.get('createFolderWin').showWindow();
	var selectedNode = Artery.get('complibTree').getSelectionModel().getSelectedNode();
	if(selectedNode == null){
		selectedNode = Artery.get('complibTree').root.firstChild;
	}
	Artery.get('parentFolderName').setValue(selectedNode.text);
}
/**
 * 创建类别
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function createFolderBtn_onClickClient (rc){
	var valid = Artery.get('createfolderForm').isValid();	
}
/**
 * 关闭创建类别窗口
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancleCreateFolderBtn_onClickClient (rc){
	Artery.get('createFolderWin').hideWindow();	
}