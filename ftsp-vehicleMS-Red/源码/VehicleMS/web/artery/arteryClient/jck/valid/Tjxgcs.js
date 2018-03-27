// **********************************************//
// 添加修改参数 客户端脚本
// 
// @author Artery
// @date 2010-09-17
// @id 3efd8086fbcb16b4029b875e4191dbd6
// **********************************************//
/**
 * 关闭窗口
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancleBtn_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * 保存参数
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function insertParamBtn_onClickClient (rc){
	Artery.get('paramForm').submit(function(result){
		Artery.getWin().showTip('参数新建成功！');
		Artery.getWin().get('paramsList').reload({
			highlightValue:Artery.get('paramKeyInput').getValue()
		});
		Artery.getWin().close();
	});
}

/**
 * 更新参数
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateParamBtn_onClickClient (rc){
	Artery.get('paramForm').submit(function(result){
		Artery.getWin().showTip('参数更新成功！');
		Artery.getWin().get('paramsList').reload({
			highlightValue:Artery.get('paramKeyInput').getValue()
		});
		Artery.getWin().close();
	},{initParamId:Artery.get('paramKeyInput').originalValue});
}