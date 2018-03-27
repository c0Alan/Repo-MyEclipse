// **********************************************//
// _faTime 客户端脚本
// 
// @author Artery
// @date 2011-10-18
// @id 7156e9146271465001bf9028fda36ec8
// **********************************************//

/**
 * onClickClient(button1e6d1)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button1e6d1_onClickClient(rc) {
	Artery.get('formArea8097b').submit(function(result) {
		Artery.showMessage(result);
	});
}

/**
 * onClickClient(button18fab)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button18fab_onClickClient(rc) {
	Artery.get("faTimefdb1b").show();
}

/**
 * onClickClient(buttona5e6e)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttona5e6e_onClickClient(rc) {
	Artery.get("faTimefdb1b").hide();
}

/**
 * onClickClient(button72cba)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button72cba_onClickClient(rc) {
	Artery.get("faTimef4530").show();
}

/**
 * onClickClient(buttoncfde9)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttoncfde9_onClickClient(rc) {
	Artery.get("faTimef4530").hide();
}

/**
 * onClickClient(buttonafc9d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonafc9d_onClickClient(rc) {
	Artery.get("faTime85ec8").show();
}

/**
 * onClickClient(buttonf4be1)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonf4be1_onClickClient(rc) {
	Artery.get("faTime85ec8").hide();
}

/**
 * onClickClient(button3dddd)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button3dddd_onClickClient(rc) {
	alert(Artery.get("faTime79d00").getValue());
}



/**
 * onClickClient(buttonda1c1)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonda1c1_onClickClient(rc) {
	Artery.get("faTime79d00").setValue("12:12:12");
}

/**
 * onClickClient(buttona2d9f)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttona2d9f_onClickClient(rc) {
	Artery.get("faTime79d00").reset();
}

/**
 * onClickClient(button5f155)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button5f155_onClickClient(rc) {
	Artery.get("faTime79d00").setOriginalValue("11:11:11");
}

/**
 * onClickClient(buttoncd37b)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttoncd37b_onClickClient(rc) {
	Artery.get("faTime79d00").setLabel("设置的标签");
}

/**
 * onClickClient(buttonb43cf)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonb43cf_onClickClient(rc) {
	Artery.get("faTime79d00").setLabelColor("red");
}

/**
 * onClickClient(button3cbf8)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button3cbf8_onClickClient(rc) {
	Artery.get("faTime79d00").setLabelStyle("background-color:blue;");
}

/**
 * onClickClient(buttonc6030)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonc6030_onClickClient(rc) {
	Artery.get("faTime79d00").setLabelCntStyle("background-color:green;");
}

/**
 * onClickClient(button5e466)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button5e466_onClickClient(rc) {
	Artery.get("faTime79d00").setValueStyle("color:blue;");
}

/**
 * onClickClient(button55e17)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button55e17_onClickClient(rc) {
	if (Artery.get("faTime79d00").allowBlank) {
		Artery.get("faTime79d00").setRequired(true);
	} else {
		Artery.get("faTime79d00").setRequired(false);
	}
}

/**
 * onClickClient(button18f1e)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button18f1e_onClickClient(rc) {
	Artery.get("faTime79d00").read();
}

/**
 * onClickClient(buttoneca99)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttoneca99_onClickClient(rc) {
	Artery.get("faTime79d00").edit();
}

/**
 * onClickClient(buttonb633c)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonb633c_onClickClient(rc) {
	Artery.get("faTime79d00").disable();
}

/**
 * onClickClient(button34f1a)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button34f1a_onClickClient(rc) {
	Artery.get("faTime79d00").enable();
}

/**
 * onClickClient(buttonf9726)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonf9726_onClickClient(rc) {
	Artery.get("faTime79d00").hide();
}

/**
 * onClickClient(buttonfd0d3)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonfd0d3_onClickClient(rc) {
	Artery.get("faTime79d00").show();
}

/**
 * 值改变时脚本(faTime71526)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 * @param oldValue
 *            控件改变前的旧值
 * @param newValue
 *            控件改变后的新值
 */
function faTime71526_onChangeClient(rc, oldValue, newValue) {
	rc.put('oldValue', oldValue);
	rc.put('newValue', newValue);
	rc.send(function(result) {
		alert("【值改变时脚本】客户端：\noldValue=" + oldValue + "\nnewValue=" + newValue);
	});
}

/**
 * 验证脚本(faTime881d9)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 * @param value
 *            控件的值
 */
function faTime881d9_onValidClient(rc, value) {
	rc.put('value', value);
	rc.asyn = false;
	rc.send();
	var result = rc.getResult();
	if (result == "ok") {
		return true;
	} else {
		return "【验证脚本】客户端：您输入的数据不合法，请输入10:10:10";
	}
}

/**
 * 输入时脚本(faTimea4ef5)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 * @param value
 *            控件的值
 * @param eventObject
 *            触发事件的对象，Ext.EventObject类型
 */
function faTimea4ef5_onKeyupClient(rc, value, eventObject) {
	rc.put('key', eventObject.getKey());
	rc.put('value', value);
	rc.send(function(result) {
		alert("【输入时脚本】客户端：\nkey=" + eventObject.getKey() + "\nvalue=" + value);
	});
}

/**
 * 验证脚本(faTimeb2b50)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faTimeb2b50_onValidClient (rc, value){
	return "验证信息";
}
  	
/**
 * 验证脚本(faTime4640b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faTime4640b_onValidClient (rc, value){
	return "验证信息";
}
  	
/**
 * onClickClient(button26637)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button26637_onClickClient (rc){
	Artery.get("faTime79d00").validate();
}
/**
 * 验证脚本(faTime79d00)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faTime79d00_onValidClient (rc, value){
	return "验证信息";
}
