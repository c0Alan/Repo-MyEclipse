// **********************************************//
// 代码列表2 客户端脚本
// 
// @author Artery
// @date 2010-08-09
// @id 89afa1b226aabe18065ed01838e00ecd
// **********************************************//

/**
 * 代码列表一行里的删除按钮单击
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function delColOperText_onClickClient (rc){
	var type = Artery.params.type;
	var code = Artery.get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	
	Artery.confirmMsg("删除","此操作不可恢复，确定要删除吗？",function(btn){
		if(btn=="yes"){
			rc.put("type",type);
			rc.put("code",code);
			rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
			rc.send(function(result){
				if(result=="YES"){
					Artery.showTip("删除成功，请继续！");
					Artery.get("codeListArea").reload();
				}
			});
		}
	});
}
/**
 * 代码列表一行里的置有效/无效单击
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function validColOperText_onClickClient (rc){
	var type = Artery.params.type;
	var code = Artery.get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	
	rc.put("type",type);
	rc.put("code",code);
	rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
	rc.send(function(result){
		if(result == "YES"){
			Artery.get("codeListArea").reload({
								params:{"highlightId":code}
							});
		}else{
			Artery.showTipError("修改valid属性失败！");
		}
	});

}
/**
 * 代码列表一行里的向上按钮单击
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function upColOperText_onClickClient (rc){
	var type = Artery.params.type;
	var code = Artery.get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	
	rc.put("type",type);
	rc.put("code",code);
	rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
	
	rc.send(function(result){
		if(result == "YES"){
			Artery.get("codeListArea").reload({
								params:{"highlightId":code}
							});
		}else if(result == "NO"){
			Artery.showTipError("向上移动失败！");
		}
	});
	
}
/**
 * 代码列表一行里的向下按钮单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function downColOperText_onClickClient (rc){
	var type = Artery.params.type;
	var code = Artery.get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	
	rc.put("type",type);
	rc.put("code",code);
	rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
	rc.send(function(result){
		if(result == "YES"){
			Artery.get("codeListArea").reload({
								params:{"highlightId":code}
							});
		}else if(result == "NO"){
			Artery.showTipError("向下移动失败！");
		}
	});
}
/**
 * 代码简拼单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function dmjpBtn_onClickClient (rc){
	var type = Artery.params.type;
	
	rc.put("type",type);
	rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
	rc.send(function(result){
		if(result == "YES"){
			Artery.get("codeListArea").reload();
		}else{
			Artery.showTipError("修改valid属性失败！");
		}
	});
	
}
/**
 * 自动排序按钮单击时事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function sortBtn_onClickClient (rc){
	var type = Artery.params.type;
	Artery.confirmMsg("确认自动编排顺序","按代码标识排序，修改显示排序，确定要这样做？",function(btn){
		if(btn == 'yes'){
			rc.put("type",type);
			rc.put("dbBelongsTo", Artery.params.dbBelongsTo);
			rc.send(function(result){
				if(result == "YES"){
					Artery.get("codeListArea").reload();
					Artery.showTip("排序成功！");
				}else{
					Artery.showTipError("自动排序失败！");
				}
			});
		}
	});
}
/**
 * 客户端(editColOperText)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function editColOperText_onClickClient (rc){
	var type = Artery.params.type;
	var code = Artery.get("codeListArea").getSelectedRowJson().codeColumnNumeric;
	
	Artery.openForm({
		target:"_window",
		targetWidth:400,
		targetHeight:370,
		runTimeType : "update",
		title: "编辑代码项",
		formId: "07b0dabc3a955cdd6ac61b60110d6162",
		params : {
			"type":type,
			"code":code,
			"dbBelongsTo": Artery.params.dbBelongsTo
		}
	});
}
/**
 * 加载时脚本(codeListArea)
 * 
 * @param  store 数据存储对象
 * @param  records 加载回来的数据
 * @param  options 加载参数配置
 */
function codeListArea_onLoad (store, records, options){
	var hlEl = this.el.child('.x-type-highlight');
	if(hlEl){
		hlEl.scrollIntoView(this.body);
		hlEl.dom.click();
	}
}
