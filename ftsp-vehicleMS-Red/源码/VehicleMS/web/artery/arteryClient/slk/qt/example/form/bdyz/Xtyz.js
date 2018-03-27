// form-表单验证-系统验证

/**
 * 客户端(formArea)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function formArea_onValidClient (rc){
	if(Artery.get("frmCNAME").getValue() == ""){
		return {errorText:"图书名称不能为空",errorId:"frmCNAME"};
	}

	rc.put("frmCNAME",Artery.get("frmCNAME").getValue());
	rc.sync = false;	// 同步执行调用
	var rc_error = null;
	rc.send(function(result){
		if(result.errorText){
			rc_error =  result;
		}
	});
	if(rc_error!=null){
		return rc_error;
	}
	
	if(Artery.get("frmDPUBLISHER").getValue() == ""){
    	return {errorText:"出版日期不能为空",errorId:"frmDPUBLISHER"};
	}
	if(Artery.get("frmDBUY").getValue() == ""){
    	return {errorText:"购买日期不能为空",errorId:"frmDBUY"};
	}
	
	if(Artery.get("frmDPUBLISHER").getValue() > Artery.get("frmDBUY").getValue()){
		return {errorText:"购买日期不能在出版日期之前",errorId:"frmDBUY"};
	}
}