// **********************************************//
// _formArea_method 客户端脚本
// 
// @author Artery
// @date 2011-10-21
// @id f28eccaa32af40e4a378034d5a1fa841
// **********************************************//



/**
 * onClickClient(button2bb8f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button2bb8f_onClickClient (rc){
	var values = Artery.get("formAreab1e49").getValues();
	alert(values + "\n\n" + Ext.encode(values));
}
/**
 * onClickClient(button7b1c8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button7b1c8_onClickClient (rc){
	var values = Artery.get("formAreab1e49").getValues(true);
	alert(values);
}
/**
 * onClickClient(button15015)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button15015_onClickClient (rc){
	Artery.get('formAreab1e49').submit(function(result) {
		Artery.showMessage(result);
	});
}
/**
 * onClickClient(button44c1e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button44c1e_onClickClient (rc){
	Artery.showMessage(Artery.get('formAreab1e49').isValid());
}
/**
 * onClickClient(button156c8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button156c8_onClickClient (rc){
	Artery.get('formAreab1e49').reset();
}
/**
 * onClickClient(button04294)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button04294_onClickClient (rc){
	Artery.showMessage(Artery.get('formAreab1e49').isChange());
}
/**
 * onClickClient(buttonfccca)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonfccca_onClickClient (rc){
	Artery.get("formAreab1e49").reload({
		params : { //重新加载时的参数
			userId : "-1"
		},
		callback : function() { //重新加载之后的回调函数
			Artery.showMessage("表单重新加载成功！");
		}
	});
}
/**
 * onClickClient(button04a36)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button04a36_onClickClient (rc){
	Artery.get('formAreab1e49').hide();
}
/**
 * onClickClient(button25d25)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button25d25_onClickClient (rc){
	Artery.get('formAreab1e49').show();
}
/**
 * onClickClient(button19b70)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button19b70_onClickClient (rc){
	Artery.get('formAreab1e49').readAllSub();
}
/**
 * onClickClient(button49b52)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button49b52_onClickClient (rc){
	Artery.get('formAreab1e49').editAllSub();
}
/**
 * onClickClient(button11304)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button11304_onClickClient (rc){
	Artery.get('formAreab1e49').disableAllSub();
}
/**
 * onClickClient(button64b52)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button64b52_onClickClient (rc){
	Artery.get('formAreab1e49').enableAllSub();
}
/**
 * onClickClient(buttonf702a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf702a_onClickClient (rc){
	Artery.get('formAreab1e49').clearAllSub();
}