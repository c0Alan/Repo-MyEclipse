// **********************************************//
// slist2 客户端脚本
// 
// @author Artery
// @date 2010-05-06
// @id a7e4d095e864f70a0b3f5a957f0b7326
// **********************************************//
/**
 * 客户端(columnStringCNAME)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs2.C_NAME}
 */
function columnStringCNAME_onClickClient (rc,bookName){
	alert(bookName);
	rc.put('bookName',bookName);//增加一个参数
	
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		alert(result);
	});
}
///**
// * 客户端(listArea2bac0)
// * 
// * @param  rc 系统提供的AJAX调用对象
// * @param  {rs2.C_NAME}
// */
//function listArea2bac0_onClickSingleClient (rc,bookName){
//	alert(bookName);
//	rc.put('bookName',bookName);//增加一个参数
//	
//	//发送请求，在回调函数中处理返回结果
//	rc.send(function(result){
//		alert(result);
//	});
//}
/**
 * 客户端(colOperText52dbd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs2.C_NAME}
 */
function colOperText52dbd_onClickClient (rc,bookName){
	alert(bookName);
	rc.put('bookName',bookName);//增加一个参数
	
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		alert(result);
	});
}