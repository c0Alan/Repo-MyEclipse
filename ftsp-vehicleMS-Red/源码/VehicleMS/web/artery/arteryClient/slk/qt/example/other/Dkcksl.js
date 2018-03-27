// example-other-打开窗口示例

/**
 * 客户端(button_window1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_window1_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_window",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert"
	});
}
/**
 * 客户端(button_window2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_window2_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_window",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert",
		"targetRight":0,
		"targetBottom":0
	});
}
/**
 * 客户端(button_blank)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_blank_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_blank",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert",
		"title":""
	});
}
/**
 * 客户端(button_window3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_window3_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_window",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert",
		"modal":true,//模态
		"wincfg":{
			collapsible :true,
			resizable :false,
			listeners:{
				"close":{
					fn:function(){
						alert("触发关闭窗口事件");
					},
					scope:this
				}
			}
		}
	});
}
/**
 * 客户端(button_window4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_window4_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_window",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert",
		"modal":true//模态
	});
}
/**
 * 客户端(button_blank2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_blank2_onClickClient (rc){
	Artery.openForm({
		"formId":"140D01A1AE5728D43D97D79B6DB9B4B0",
		"formType":Artery.FORM,
		"params":{"bookId":""},
		"target":"_blank",
		"targetWidth":550,
		"targetHeight":450,
		"runTimeType":"insert",
		"modal":true//模态
	});
}
/**
 * onClickClient(button_blankClose)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_blankClose_onClickClient (rc){
	Artery.openForm({
		"formId":"ac9fad29240f3d1a747c92772d316d6e",
		"formType":Artery.FORM,
		"target":"_blank",
		"targetWidth":550,
		"targetHeight":260,
		"runTimeType":"insert",
		// subWin为子窗口window对象
		// subAty为子窗口Artery对象
		"closeHandler": function(subWin,subAty){
			alert("blank窗口关闭了");
			var strCmp = subAty.get("faString_textarea");
			alert("子窗口控件值 :  " + strCmp.getValue());
		}
	});
}
/**
 * onClickClient(button_windowClose)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_windowClose_onClickClient (rc){
	Artery.openForm({
		"formId":"ac9fad29240f3d1a747c92772d316d6e",
		"formType":Artery.FORM,
		"target":"_window",
		"targetWidth":550,
		"targetHeight":260,
		"runTimeType":"insert",
		// subWin为子窗口window对象
		// subAty为子窗口Artery对象
		"closeHandler": function(subWin,subAty){
			alert("window窗口关闭了");
			var strCmp = subAty.get("faString_textarea");
			alert("子窗口控件值 :  " + strCmp.getValue());
		}
	});
}

// 窗口回调函数
// subWin为子窗口window对象
// subAty为子窗口Artery对象
function callbackFunc(subWin,subAty){
	var strCmp = subAty.get("faString_textarea");
	alert("callbackFunc :  " + strCmp.getValue());
}