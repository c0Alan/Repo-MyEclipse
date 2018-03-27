// form-表单验证-数据字典验证

/**
 * 客户端(button_add)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_add_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
    	Artery.showMessage("保存成功")
	});
}