// **********************************************//
// _faString 客户端脚本
// 
// @author Artery
// @date 2011-10-12
// @id 2ebcd056b405a736f73a9dd554dd0cc8
// **********************************************//

  	

  	

/**
 * onClickClient(button1e6d1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button1e6d1_onClickClient (rc){
	Artery.get('formArea8097b').submit(function(result) {
		Artery.showMessage(result);
	});
}
/**
 * onClickClient(button18fab)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button18fab_onClickClient (rc){
	Artery.get("faStringfdb1b").show();
}
/**
 * onClickClient(buttona5e6e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttona5e6e_onClickClient (rc){
	Artery.get("faStringfdb1b").hide();
}
/**
 * onClickClient(button72cba)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button72cba_onClickClient (rc){
	Artery.get("faStringf4530").show();
}
/**
 * onClickClient(buttoncfde9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttoncfde9_onClickClient (rc){
	Artery.get("faStringf4530").hide();
}
/**
 * onClickClient(buttonafc9d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonafc9d_onClickClient (rc){
	Artery.get("faString85ec8").show();
}
/**
 * onClickClient(buttonf4be1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf4be1_onClickClient (rc){
	Artery.get("faString85ec8").hide();
}
/**
 * onClickClient(button3dddd)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button3dddd_onClickClient (rc){
	Artery.showTip(Artery.get("faString79d00").getValue());
}
/**
 * onClickClient(buttond954e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttond954e_onClickClient (rc){
	Artery.showTip(Artery.get("faString79d00").getValueText());
}
/**
 * onClickClient(buttonda1c1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonda1c1_onClickClient (rc){
	Artery.get("faString79d00").setValue("设置的值");
}
/**
 * onClickClient(buttona2d9f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttona2d9f_onClickClient (rc){
	Artery.get("faString79d00").reset();
}
/**
 * onClickClient(button5f155)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button5f155_onClickClient (rc){
	Artery.get("faString79d00").setOriginalValue("设置的原始值");
}
/**
 * onClickClient(buttoncd37b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttoncd37b_onClickClient (rc){
	Artery.get("faString79d00").setLabel("设置的标签");
}
/**
 * onClickClient(buttonb43cf)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonb43cf_onClickClient (rc){
	Artery.get("faString79d00").setLabelColor("red");
}
/**
 * onClickClient(button3cbf8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button3cbf8_onClickClient (rc){
	Artery.get("faString79d00").setLabelStyle("background-color:blue;");
}
/**
 * onClickClient(buttonc6030)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonc6030_onClickClient (rc){
	Artery.get("faString79d00").setLabelCntStyle("background-color:green;");
}
/**
 * onClickClient(button5e466)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button5e466_onClickClient (rc){
	Artery.get("faString79d00").setValueStyle("color:blue;");
}
/**
 * onClickClient(button55e17)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button55e17_onClickClient (rc){
	if (Artery.get("faString79d00").allowBlank) {
		Artery.get("faString79d00").setRequired(true);
	} else {
		Artery.get("faString79d00").setRequired(false);
	}
}
/**
 * onClickClient(button18f1e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button18f1e_onClickClient (rc){
	Artery.get("faString79d00").read();
}
/**
 * onClickClient(buttoneca99)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttoneca99_onClickClient (rc){
	Artery.get("faString79d00").edit();
}
/**
 * onClickClient(buttonb633c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonb633c_onClickClient (rc){
	Artery.get("faString79d00").disable();
}
/**
 * onClickClient(button34f1a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button34f1a_onClickClient (rc){
	Artery.get("faString79d00").enable();
}
/**
 * onClickClient(buttonf9726)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf9726_onClickClient (rc){
	Artery.get("faString79d00").hide();
}
/**
 * onClickClient(buttonfd0d3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonfd0d3_onClickClient (rc){
	Artery.get("faString79d00").show();
}
/**
 * 值改变时脚本(faString71526)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function faString71526_onChangeClient (rc, oldValue, newValue){
	rc.put('oldValue',oldValue);
	rc.put('newValue',newValue);
	
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		Artery.showMessage("【值改变时脚本】客户端：<br>oldValue=" + oldValue + "<br>newValue=" + newValue);
	});
}
  	
/**
 * 验证脚本(faString881d9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faString881d9_onValidClient (rc, value){
	rc.put('value', value);
	rc.asyn = false;
	rc.send();
	var result = rc.getResult();
	if (result == "ok") {
		// 验证通过，返回true
		return true;
	} else {
		// 验证没有通过，返回提示信息
		return "【验证脚本】客户端：您输入的数据不合法";
	}
}

/**
 * 输入时脚本(faStringa4ef5)
 * 
 * @param  rc           系统提供的AJAX调用对象
 * @param  value        控件的值
 * @param  eventObject  触发事件的对象，Ext.EventObject类型
 */
function faStringa4ef5_onKeyupClient (rc, value, eventObject){
	var eKey = eventObject.getKey()
	rc.put('key', eKey);
	rc.put('value',value);
	
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		Artery.showMessage("【输入时脚本】客户端：<br>key=" + eKey + "<br>value=" + value);
	});
}
