// 表单元素-trigger-trigger

/**
 * 点击时脚本(trigger_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function trigger_1_onTriggerClickClient (rc){
	var obj = Artery.get("trigger_1");
	Artery.openForm({
		formId: "418A6B631CE44CE7DD1A807D71C2B111",
		formType: "1",
		target: "_window",
		targetHeight: 240,
		params:{
			triggerName: "trigger_1",
			showValue: obj.getShowValue(),
			hiddenValue: obj.getValue()
		}
	});
}
  	
/**
 * 客户端(button_submit)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_submit_onClickClient (rc){
	var t1Obj = Artery.get("trigger_1");
	alert("trigger值："+t1Obj.getValue());
	alert("trigger显示值："+t1Obj.getValueText());
	Artery.get("form1").submit(function(resObj){
		Artery.showMessage("提交完毕");
		alert(resObj.vv);
	});
}