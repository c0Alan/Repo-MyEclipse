// 表单元素-日期控件

/**
 * 客户端(tbButton_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_1_onClickClient (rc){
	Artery.get("field1").setValue("dddd");
}

/**
 * 值改变时脚本(field1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function field1_onChangeClient (rc, oldValue, newValue){
	Artery.get("field2").setValue(newValue)
}
  	
/**
 * 值改变时脚本(field3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function field3_onChangeClient (rc, oldValue, newValue){
	if(Artery.get("field3").value=="1"){
		Artery.get("field4").hide();
	}else{
		Artery.get("field4").show();
	}
}
  	
/**
 * 值改变时脚本(field5)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function field5_onChangeClient (rc, oldValue, newValue){
	if(newValue !="-5"){
		Artery.get("field6").setCodeType(newValue);
	}
}
  	
/**
 * 值改变时脚本(numberFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function numberFld_onChangeClient (rc, oldValue, newValue){
	Artery.get("field2").setValue(Artery.get("numberFld").getValue());
}
  	
/**
 * 值改变时脚本(dateFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function dateFld_onChangeClient (rc, oldValue, newValue){
	Artery.get("field2").setValue(Artery.get("dateFld").getValue());
}
  	
/**
 * 值改变时脚本(organFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function organFld_onChangeClient (rc, oldValue, newValue){
	Artery.get("field2").setValue(Artery.get("organFld").getValueText())
}
  	
/**
 * 值改变时脚本(sradioFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function sradioFld_onChangeClient (rc, oldValue, newValue){
	Artery.get("field2").setValue(Artery.get("sradioFld").getValue());
}
  	