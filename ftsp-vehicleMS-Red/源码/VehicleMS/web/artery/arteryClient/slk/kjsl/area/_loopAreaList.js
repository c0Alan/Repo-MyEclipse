// **********************************************//
// _loopAreaList 客户端脚本
// 
// @author Artery
// @date 2011-10-10
// @id 252ad8f2447eef550ffce41cf674919e
// **********************************************//

/**
 * 客户端(columnStringCNAME)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs2.C_NAME}
 */
function columnStringCNAME_onClickClient(rc, bookName) {
  alert(bookName);
  rc.put('bookName', bookName);
  rc.send(function(result) {
  alert(result);
});
}


/**
 * 客户端(colOperText52dbd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs2.C_NAME}
 */
function colOperText52dbd_onClickClient(rc, bookName) {
  alert(this.id);
  alert(bookName);
  rc.put('bookName', bookName);
  rc.send(function(result) {
  alert(result);
});
}
