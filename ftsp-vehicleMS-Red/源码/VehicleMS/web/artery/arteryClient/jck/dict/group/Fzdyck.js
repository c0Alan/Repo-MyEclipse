// **********************************************//
// 分组定义窗口 客户端脚本
// 
// @author Artery
// @date 2012-07-07
// @id d48c393f7570f25519b8821f046952d5
// **********************************************//
/**
 * onClickClient(buttonCancel)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonCancel_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * onClickClient(buttonOk)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonOk_onClickClient (rc){
	var groupValue = Artery.get("treeArea2c703").getValue();
	if(groupValue.length == 0) {
		Artery.showWarning("请选择分组目录！");
		return;
	}
	rc.put('groupValue', groupValue);
	rc.send(function(result) {
		if(result) {
			Artery.showMessage("数据字典分组成功！");
			Artery.getWin().get("treeAreaef1d4").reload();
			Artery.getWin().get("treeAreaef1d4").expandAll();
		} else {
			Artery.showError("分组失败！请检查");
		}
		Artery.getWin().close();
	});
}