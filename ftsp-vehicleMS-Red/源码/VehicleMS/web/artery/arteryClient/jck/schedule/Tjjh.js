// **********************************************//
// 增加计划 客户端脚本
// 
// @author Artery
// @date 2010-09-29
// @id 94b7328fc85c93cf74a03917be5e5678
// **********************************************//
/**
 * onClickClient(cancelBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
	Artery.getWin().close();
}

/**
 * onClickClient(addBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient (rc){
	Artery.get("plan_formArea").submit(function(res){
		if(res == "YES"){
			Artery.getWin().showTip("保存成功！","planList_form");
			Artery.getWin().get("plans_listArea").reload({
				params:{"highlightId":Artery.get('planName_faString').getValue()}
			});
		}else{
			Artery.getWin().showTipError("保存失败！","planList_form");
		}
		Artery.getWin().close();
	});		
}

/**
 * onClickClient(modifyBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyBtn_onClickClient (rc){
	var params = {
					"plan.cid":Artery.params.cid
				};

	Artery.get("plan_formArea").submit(function(res){
		if(res == "YES"){
			Artery.getWin().showTip("保存成功！","planList_form");
			Artery.getWin().get("plans_listArea").reload({
				params:{"highlightId":Artery.get('planName_faString').getValue()}
			});
		}else{
			Artery.getWin().showTipError("保存失败！","planList_form");
		}
		Artery.getWin().close();
	},params);	
}


/**
 * 值改变时脚本(jobType_faCode)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function jobType_faCode_onChangeClient (rc, oldValue, newValue){
	if(newValue == "2"){
		Artery.get("scriptOrSql_faString").hide();
		Artery.get("className_faString").show();
		Artery.get("methodName_faString").show();
	}else{
		Artery.get("scriptOrSql_faString").show();
		Artery.get("className_faString").hide();
		Artery.get("methodName_faString").hide();
	}
}
  	