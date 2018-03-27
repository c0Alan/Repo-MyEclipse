// **********************************************//
// _office 客户端脚本
// 
// @author Artery
// @date 2011-09-20
// @id 1414b39d533de22836027f6ab5920143
// **********************************************//

/**
 * onClickClient(tbCreateWord)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbCreateWord_onClickClient(rc) {
  Artery.get("officeShow").createDocument("Word.Document");
}

/**
 * onClickClient(tbCreateExcel)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbCreateExcel_onClickClient (rc){
	Artery.get("officeShow").createDocument("Excel.Sheet");
}

/**
 * onClickClient(tbOpenFromURL)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbOpenFromURL_onClickClient(rc) {
  Artery.get("officeShow").openFromUrl("http://www.baidu.com");
}


/**
 * onClickClient(tbOpenLocalFile)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbOpenLocalFile_onClickClient(rc) {
  Artery.get("officeShow").openLocalFile("c:\\1.doc");
}


/**
 * onClickClient(tbReload)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbReload_onClickClient(rc) {
  Artery.get("officeShow").reload();
}


/**
 * onClickClient(tbClose)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbClose_onClickClient(rc) {
  Artery.get("officeShow").close();
}

