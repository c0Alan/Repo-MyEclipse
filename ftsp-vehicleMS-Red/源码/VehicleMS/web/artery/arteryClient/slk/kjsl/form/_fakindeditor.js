// **********************************************//
// _fakindeditor 客户端脚本
// 
// @author Artery
// @date 2011-09-20
// @id b45a1943d2dee7a1c3b09e4c45e56933
// **********************************************//
/**
 * onClickClient(tbGetHtml)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbGetHtml_onClickClient (rc){
	alert(Artery.get("editorExample").getHtml());	
}

/**
 * 输入时脚本(editorExample)
 * 
 * @param  rc           系统提供的AJAX调用对象
 */
function editorExample_onKeyupClient (rc){
	var num = Artery.get("editorExample").getCount();
	Artery.get("faString2a034").setValue(num);
	num = Artery.get("editorExample").getCount("text");
	Artery.get("faStringfe1f6").setValue(num);
}
	
/**
 * onClickClient(tbSetHtml)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbSetHtml_onClickClient (rc){
	Artery.get("editorExample").setHtml("<li>setHtml</li>");	
}
/**
 * onClickClient(tbGetText)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbGetText_onClickClient (rc){
	alert(Artery.get("editorExample").getText());	
}
/**
 * onClickClient(tbSetText)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbSetText_onClickClient (rc){
	var text ="setText";
	Artery.get("editorExample").setText(text);
}
/**
 * onClickClient(tbInsertHtml)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbInsertHtml_onClickClient (rc){
	Artery.get("editorExample").insertHtml("<li>插入文本</li>");	
}
/**
 * onClickClient(tbAppendHtml)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbAppendHtml_onClickClient (rc){
	Artery.get("editorExample").appendHtml("<li>追加文本</li>");	
}
/**
 * onClickClient(tbGetBrowser)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbGetBrowser_onClickClient (rc){
	alert(Ext.encode(Artery.get("editorExample").getBrowser()));	
}