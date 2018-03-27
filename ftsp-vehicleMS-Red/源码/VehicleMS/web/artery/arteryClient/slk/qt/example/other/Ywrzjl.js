// example-other-activex示例

/**
 * 客户端(button_send)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_send_onClickClient (rc){
	Artery.get("formArea").submit(function(result){
    	Artery.showMessage('记录业务日志成功！');
	});
}