// **********************************************//
// 导入代码 客户端脚本
// 
// @author Artery
// @date 2010-08-17
// @id 9371b5774899e71e1b1960b203466f79
// **********************************************//
/**
 * 关闭按钮单击时事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function shutdownBtn_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * 导入按钮单击时事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function importBtn_onClickClient (rc){
	Artery.get("formAreac8d03").submit(function(res){
		if(res == "YES"){
			Artery.showTip("导入成功！");
			Artery.getWin().get("codeTypelistArea").reload();
			Artery.getWin().close();
		}else{
			Artery.showTipError("导入失败！")
		}
	});
}
