// **********************************************//
// form 客户端脚本
// 
// @author Artery
// @date 2010-03-28
// @id 6da74c5e663188240f70f467a60d917b
// **********************************************//

/**
 * 客户端(button2f952)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button2f952_onClickClient(rc) {
	rc.put("abc");
	rc.send(function(result) {
				alert(result);
			})
}

/**
 * 客户端(buttonbde43)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs4.type}
 */
function buttonbde43_onClickClient (rc,type){
	alert(2);
	rc.put("type",type);
	rc.send(function(result){
		alert(result);
	});
}

/**
 * 客户端(tbButtoncc1d7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtoncc1d7_onClickClient (rc){
	alert(Artery.get("loopAreaa5dab").id);	
}
/**
 * 值改变时脚本(faString1e342)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function faString1e342_onChangeClient (rc, oldValue, newValue){
	alert(oldValue + ":" + newValue);
}
  	