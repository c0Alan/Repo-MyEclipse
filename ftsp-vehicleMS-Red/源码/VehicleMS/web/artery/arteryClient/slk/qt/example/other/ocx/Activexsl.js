// example-other-activex示例
    
/**
 * 客户端(button_new)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {ctx}
 */
function button_new_onClickClient (rc, ctx){
	alert(ctx);
	Artery.get("ntko1").active.BeginOpenFromURL(ctx+"/artery/pub/_blank.doc");
}
/**
 * 客户端(button_save)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_save_onClickClient (rc){
	var obj =Artery.get("ntko1").active;
	alert("文档内容是否已经保存了："+obj.ActiveDocument.Saved);
}
/**
 * onClickClient(tbButton0455d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton0455d_onClickClient (rc){
	Artery.alertMsg('abc','ddd');	
	Artery.promptMsg('abc','ddd');	
}