// **********************************************//
// form3 客户端脚本
// 
// @author Artery
// @date 2010-06-25
// @id 62bf048ab20c060d3bcc772958f3d5b3
// **********************************************//
/**
 * 客户端(button8975b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button8975b_onClickClient (rc){
	(function(){
		Artery.getWin().getWindow().Artery.showTip('保存成功!','blankPanel39a8c');
		Artery.getWin().close();
	}).defer(4000,this);
}
/**
 * 客户端(simpleButton4a65d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function simpleButton4a65d_onClickClient (rc){
	Artery.getWin().close();	
}
/**
 * 客户端(button61310)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button61310_onClickClient (rc){
	Artery.showTipError('保存失败，请重试!','blankPanelba0a8');	
}
/**
 * 客户端(button4c12d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button4c12d_onClickClient (rc){
	(function(){
		Artery.showTip('保存成功!','blankPanelba0a8');	
		this.hideLoading();
	}).defer(3000,this);
}