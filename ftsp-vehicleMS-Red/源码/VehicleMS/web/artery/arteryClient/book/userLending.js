// **********************************************//
// 图书管理 个人借阅图书列表
// 
// @author Artery
// @date 2010-03-30
// @id B5327983AA4C4B5160C52C1EBD63C431
// **********************************************//



/**
 * 客户端(cancelOper)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs2.C_ID}
 */
function cancelOper_onClickClient (rc, bookCId){
	rc.put("bookCId",bookCId);
	rc.send(function(result){
    	Artery.get("bookingList").reload(); 
	});
}