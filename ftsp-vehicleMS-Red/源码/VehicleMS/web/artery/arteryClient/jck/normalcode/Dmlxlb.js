// **********************************************//
// 代码类型列表2 客户端脚本
// 
// @author Artery
// @date 2010-08-09
// @id 07eba2885ab0e1155b06027717a60bca
// **********************************************//

var db_key;

/**
 * 单击代码类型列表事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.type}
 */
function codeTypelistArea_onClickSingleClient (rc,type){
	var maintain = Artery.get("codeTypelistArea").getSelectedRowJson().maintainColumn;
	if(maintain == "true"){
		Artery.get("editBtn").enable();
		Artery.get("validBtn").enable();
		Artery.get("delBtn").enable();
	}else{
		Artery.get("editBtn").disable();
		Artery.get("validBtn").disable();
		Artery.get("delBtn").disable();
	}
	var dbKey = Artery.get("dbSelFaCode").getValue();
	Artery.get("codeOperArea").openForm({
		formId: "89afa1b226aabe18065ed01838e00ecd",
		params : {
			"type":type,
			"dbBelongsTo": dbKey
		}
	});
}
/**
 * 编辑选中代码类型
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function editBtn_onClickClient (rc){
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	var jas = Artery.get("codeTypelistArea").getSelectedRowJson();
	var type = jas.typeColumn;
	
	Artery.openForm({
		target:"_window",
		targetWidth:400,
		targetHeight:250,
		runTimeType : "update",
		title: "编辑代码类型",
		formId: "9cb46f46b33f6daa3d88728e8b0ef926",
		params : {
			"type":type,
			"dbBelongsTo":dbBelongsTo
		}
	});
}
/**
 * 删除选中代码类型
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function delBtn_onClickClient (rc){
	var type = Artery.get("codeTypelistArea").getSelectedRowJson().typeColumn;
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	Artery.confirmMsg("删除","此操作不可恢复，确定要删除吗？",function(btn){
		if(btn=="yes"){
			rc.put("type",type);
			rc.put("dbKey", dbBelongsTo);
			rc.send(function(result){
				Artery.showTip("删除成功，请继续！");
				Artery.get("codeTypelistArea").reload();
				Artery.get("codeOperArea").openForm({
					formId: "95af4e9e11d6c799ae3ec40af50a9f62"
				});
			});
			
		}
	});	
	
	
	
}
/**
 * 置选中代码类型有效/无效
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function validBtn_onClickClient (rc){
	var type = Artery.get("codeTypelistArea").getSelectedRowJson().typeColumn;
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	rc.put("type",type);
	rc.put("dbKey", dbBelongsTo);
	rc.send(function(result){
		Artery.showTip("置无效/有效成功！");
		Artery.get("codeTypelistArea").reload();
	});
}
/**
 * 刷新整个列表区域的代码类型
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function refreshBtn_onClickClient (rc){
	rc.send(function(result){
		if(result == "YES"){
			Artery.showTip("刷新成功，请继续！");
			Artery.get("codeTypelistArea").reload();
			
			var type = Artery.get("codeTypelistArea").getValuesArray("typeColumn")[0];
			var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
			
			Artery.get("codeOperArea").openForm({
				formId: "89afa1b226aabe18065ed01838e00ecd",
				params : {
					"type":type,
					"dbBelongsTo":dbBelongsTo
				}
			});
		}
	});
	
}
/**
 * 代码类型加载时
 * 
 * @param  store 数据存储对象
 * @param  records 加载回来的数据
 * @param  options 加载参数配置
 */
function codeTypelistArea_onLoad (store, records, options){
	Artery.get("editBtn").disable();
	Artery.get("validBtn").disable();
	Artery.get("delBtn").disable();
//	
//	var type = Artery.get("codeTypelistArea").getValuesArray("typeColumn")[0];
//	Artery.get("codeOperArea").openForm({
//		formId: "89afa1b226aabe18065ed01838e00ecd",
//		params : {
//			"type":type
//		}
//	});
//	
	//滚动到保存代码处
	var hlEl = this.el.child('.x-type-highlight');
	if(hlEl){
		hlEl.scrollIntoView(this.body);
		hlEl.dom.click();
	}
}
  	
/**
 * 全量生成点击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function allCoverBtn_onClickClient (rc){
	
	//滚动到保存代码处
	var hlEl = this.el.child('.x-type-highlight');
	if(hlEl){
		hlEl.scrollIntoView(this.body);
		hlEl.dom.click();
	}
	
	var selRowJson = Artery.get("codeTypelistArea").getSelectedRowJson();
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	rc.send(function(result){
		if(result == "YES"){
			Artery.showTip("全量生成成功！");
			if (selRowJson) {
				Artery.get("codeOperArea").openForm({
					formId: "89afa1b226aabe18065ed01838e00ecd",
					params : {
						"type" : selRowJson.typeColumn,
						"dbBelongsTo" : dbBelongsTo
					}
				});
			}
		}
	});
}
/**
 * 增量生成按钮点击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function increGenBtn_onClickClient (rc){
	//滚动到保存代码处
	var hlEl = this.el.child('.x-type-highlight');
	if(hlEl){
		hlEl.scrollIntoView(this.body);
		hlEl.dom.click();
	}
	
	var selRowJson = Artery.get("codeTypelistArea").getSelectedRowJson();
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	rc.send(function(result){
		if(result == "YES"){
			Artery.showTip("增量生成成功！");
			if (selRowJson) {
				Artery.get("codeOperArea").openForm({
					formId: "89afa1b226aabe18065ed01838e00ecd",
					params : {
						"type" : selRowJson.typeColumn,
						"dbBelongsTo" : dbBelongsTo
					}
				});
			}
		}
	});
}
/**
 * 当选择的数据库改变时
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function dbSelFaCode_onChangeClient (rc, oldValue, newValue){
	db_key = newValue;
	Artery.get("codeTypelistArea").reload({
		params : {
			dbKey : newValue
		}
	});
}
  	
/**
 * 添加代码类型单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addBtn_onClickClient (rc){
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	Artery.openForm({
		target:"_window",
		targetWidth:400,
		targetHeight:250,
		runTimeType : "insert",
		title: "添加代码类型",
		formId: "9cb46f46b33f6daa3d88728e8b0ef926",
		params : {
			"dbBelongsTo":dbBelongsTo
		}
	});
}
/**
 * 导入按钮的单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function importBtn_onClickClient (rc){
	var dbBelongsTo = Artery.get("dbSelFaCode").getValue();
	
	Artery.openForm({
		target:"_window",
		targetWidth:350,
		targetHeight:160,
		formId: "9371b5774899e71e1b1960b203466f79",
		params : {
			"dbBelongsTo":dbBelongsTo
		}
	});
}
