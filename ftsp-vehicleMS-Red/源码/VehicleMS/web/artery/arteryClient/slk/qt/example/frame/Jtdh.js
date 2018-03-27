// example-frame-静态导航

/**
 * 客户端(tbButton_reloadAll)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_reloadAll_onClickClient (rc){
	Artery.get("static_tree").reloadAllCount();
}

/**
 * 客户端(tbButton_reloadPart)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_reloadPart_onClickClient (rc){
	Artery.get("static_tree").reloadCount(["sn_book","sn_library"]);
}

/**
 * 客户端(snItem_click)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function snItem_click_onClickClient (rc){
	alert("您点击了节点："+this.text);
}

/**
 * 客户端(catalog_click)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function catalog_click_onClickClient (rc){
	alert("您点击了目录："+this.text);
}

/**
 * 客户端(listItem_click)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem_click_onClickClient (rc){
	Artery.openForm({
		"formId":"C2C1D368AD7106377EB34B882AEC07A7",
		"formName":"打开窗口示例",
		"formType":"1",
		"params":{},
		"target":"myoper",
		"runTimeType":"insert"
	});
}