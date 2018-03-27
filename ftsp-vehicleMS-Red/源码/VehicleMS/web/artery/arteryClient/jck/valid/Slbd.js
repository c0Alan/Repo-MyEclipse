// **********************************************//
// valid 客户端脚本
// 
// @author Artery
// @date 2010-09-07
// @id 937f52ed0cb383f67ba89aea00ec1d38
// **********************************************//
/**
 * onClickClient(buttona267b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttona267b_onClickClient (rc){
	rc.send(function(result){
		if(result.phaseValid){
			top.Artery.valid.showPhaseValid(result.phaseValid);	
		}
	});	
}
/**
 * 验证脚本(faDate8bb44)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faDate8bb44_onValidClient (rc, value){
	return "abcc"
}
  	