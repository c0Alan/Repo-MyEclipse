// **********************************************//
// 验证模板主页面 客户端脚本
// 
// @author Artery
// @date 2010-09-15
// @id b2eba28069111f677327fc0f29215d0e
// **********************************************//
/**
 * 模板列表
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.id}
 */
function listAreaTemplates_onClickSingleClient (rc,tplId){
	Artery.openForm({
		"formId" : "61dd97188b0adb321bfcfbc0c7984809",
		"formType" : "1",
		"title" : "模板维护",
		"params" : {
			"tplId" : tplId
		},
		"runTimeType" : "display",
		"target" : "operArea11f19"
	});
	Artery.get('deleteTplBtn').enable();
	Artery.get('modifyTplBtn').enable();
}
/**
 * 删除模板
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function deleteTplBtn_onClickClient (rc){
	Artery.confirmMsg("提示信息","此操作不可恢复，确定要删除模板吗？",function(btn){
		if(btn == "yes"){
			var data = Artery.get('listAreaTemplates').getSelectedRowJson();	
			rc.put('tplId',data.templateIdCol);
			rc.send(function(result){
				Artery.showTip('删除成功');
				Artery.get('listAreaTemplates').reload({callback:function(){
					refreshRight();
				}});
			});
		}
	})
}
/**
 * 修改模板
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyTplBtn_onClickClient (rc){
	var data = Artery.get('listAreaTemplates').getSelectedRowJson();
	Artery.openForm({
		"formId" : "3cc25f7b34f6eabf26b9eec886c280b6",
		"formType" : "1",//1表单，2报表，3文书
		"title" : "修改模板",
		"params" : {
			"tplId" : data.templateIdCol
		},
		"runTimeType" : "update",
		"target" : "_window",//_window或_blank
		"targetWidth" : 330,
		"targetHeight" : 150
	});

}
/**
 * 刷新模板
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function refreshBtn_onClickClient (rc){
	rc.send(function(result){
		Artery.showTip('刷新成功');
		Artery.get('listAreaTemplates').reload({callback:function(){
			refreshRight();
		}});
	});
}

//private 刷新右侧
function refreshRight(){
	var tr = Artery.get('listAreaTemplates').getFirstTr();
	if(tr== null){
		Artery.openForm({
			"formId" : "95af4e9e11d6c799ae3ec40af50a9f62",
			"formType" : "1",//1表单，2报表，3文书
			"runTimeType" : "insert",
			"target" : "operArea11f19"
		});
	}else{
		Artery.get('listAreaTemplates').body.dom.scrollTop=0;
		tr.click();
	}
}
/**
 * 加载时脚本(listAreaTemplates)
 * 
 * @param  store 数据存储对象
 * @param  records 加载回来的数据
 * @param  options 加载参数配置
 */
function listAreaTemplates_onLoad (store, records, options){
	//滚动到保存代码处
	var hlEl = this.el.child('.x-type-highlight');
	if(hlEl){
		hlEl.scrollIntoView(this.body);
		hlEl.dom.click();
	}
}