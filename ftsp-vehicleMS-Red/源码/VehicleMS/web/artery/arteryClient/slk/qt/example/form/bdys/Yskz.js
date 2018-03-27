// 表单元素-日期控件

/**
 * 客户端(tbButton_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_1_onClickClient (rc){
	Artery.get("frmCNAME").setValue("这是设置的名称啊");
}

/**
 * 客户端(authReadBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function authReadBtn_onClickClient (rc){
	Artery.get("frmCAUTH").read();
	Artery.get("authReadBtn").hide();
	Artery.get("authEditBtn").show();
}

/**
 * 客户端(authEditBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function authEditBtn_onClickClient (rc){
	Artery.get("frmCAUTH").edit();
	Artery.get("authReadBtn").show();
	Artery.get("authEditBtn").hide();
}

/**
 * 客户端(disableTypeBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function disableTypeBtn_onClickClient (rc){
	var item = Artery.get("frmNTYPE");
	if(item.disabled == true){
		item.enable()
		Artery.get("disableTypeBtn").setText("类别置无效")
	}else{
		item.disable();
		Artery.get("disableTypeBtn").setText("类别置有效")
	}
}

/**
 * 客户端(hideTypeBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function hideTypeBtn_onClickClient (rc){
	var item = Artery.get("frmCPUBLISHER");
	if(item.hidden == true){
		item.show();
		Artery.get("hideTypeBtn").setText("隐藏出版社")
	}else{
		item.hide();
		Artery.get("hideTypeBtn").setText("显示出版社")
	}
}