// **********************************************//
// 用户信息 客户端脚本
// 
// @author Artery
// @date 2010-11-11
// @id f05d07fb876d23216a51d181817ee258
// **********************************************//
/**
 * onClickClient(buttonb9759)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonb9759_onClickClient (rc){
	//展示个人信息表单
    Artery.get("operArea").showForm({
	    formId : "7b857b9491d6824c2faa278c6d1a8265",
	    formType : Artery.FORM,
	    runTimeType : "insert"
	});	    	
}
/**
 * onClickClient(button2c77b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button2c77b_onClickClient (rc){
	//展示修改密码表单
    Artery.get("operArea").showForm({
	    formId : "00f148434070a4fbe80fbd0c65c169e5",
	    formType : Artery.FORM,
	    runTimeType : "insert"
	});	    	
}