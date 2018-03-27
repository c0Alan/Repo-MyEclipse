// **********************************************//
// _listArea_method 客户端脚本
// 
// @author Artery
// @date 2011-09-28
// @id ca3fb21fdaeb944e00b01ab74502ce8e
// **********************************************//
/**
 * onClickClient(button832a2)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button832a2_onClickClient(rc) {
	Artery.get("listArea05297").exportExcel();
}
/**
 * onClickClient(button7430c)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button7430c_onClickClient(rc) {
	Artery.get("listArea05297").exportPdf();
}
/**
 * onClickClient(button93fd0)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button93fd0_onClickClient(rc) {
	Artery.get("listArea05297").reload();

}
/**
 * onClickClient(button2c729)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button2c729_onClickClient(rc) {
	var msg = Artery.get("listArea05297").getValues('columnStringCNAME');
	Artery.showMessage(msg);

}
/**
 * onClickClient(button5449a)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button5449a_onClickClient(rc) {
	var msg = Artery.get("listArea05297").getSelectedRowValue();
	Artery.showMessage(msg);
}
/**
 * onClickClient(buttone9d61)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttone9d61_onClickClient(rc) {
	var msg = Artery.get("listArea05297")
			.getCheckedRowValue('columnIdentityCID');
	Artery.showMessage(msg);
}
/**
 * onClickClient(button8136c)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button8136c_onClickClient(rc) {
	Artery.get("listArea05297").selectAllCheckbox('columnIdentityCID', true);

}
/**
 * onClickClient(button9cd30)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button9cd30_onClickClient(rc) {
	Artery.get("listArea05297").insertRecord({
				columnIdentityCID : "001",
				columnStringCNAME : "new Book"
			});
}
/**
 * onClickClient(buttonaf55d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonaf55d_onClickClient(rc) {
	Artery.get("listArea05297").deleteRecord();
}
/**
 * onClickClient(button9d74b)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button9d74b_onClickClient(rc) {
	Artery.get("listArea05297").deselectAllCheckbox('columnIdentityCID', true);
}

/**
 * onClickClient(execSQLBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function execSQLBtn_onClickClient (rc){
	Artery.get("sqlFormArea").submit(function(result) {
		Artery.showMessage(result);
	})
}