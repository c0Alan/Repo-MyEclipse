// **********************************************//
// 验证模板维护页面 客户端脚本
// 
// @author Artery
// @date 2010-09-15
// @id 61dd97188b0adb321bfcfbc0c7984809
// **********************************************//
/**
 * 展开、折叠模板脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(scriptContainer).id}
 */
function scriptExpandBtn_onClickClient (rc,scriptContainerId){
	var cnt = Artery.get(scriptContainerId);
	if(cnt.isVisible()){
		cnt.hide();
		this.changeImage('/artery/arteryImage/other/plus.gif');
	}else{
		cnt.show();
		this.changeImage('/artery/arteryImage/other/minus.gif');
	}
}
/**
 * 展开列表中全部脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function expandAllScriptBtn_onClickClient (rc){
	var btns = Artery.get('templateList').el.query(".x-scirpt-expand");
	for(var i=0;i<btns.length;i++){
		Artery.get(btns[i].id).click();
	}
}
/**
 * 新建脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function createScriptBtn_onClickClient (rc){
	Artery.get('scriptListCnt').hide();
	Artery.get('modifyScriptTitleText').setText('新建脚本');
	Artery.get('saveScriptBtn').type='insert';
	Artery.get('scriptCreateCnt').show();
}
/**
 * 修改脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.id} 脚本id
 */
function modifyScriptBtn_onClickClient (rc,scriptId){
	Artery.get('scriptListCnt').hide();
	Artery.get('modifyScriptTitleText').setText('修改脚本');
	Artery.get('saveScriptBtn').type='update';
	Artery.get('scriptCreateCnt').show();
	Artery.get('editScriptForm').reload({
		params:{scriptId:scriptId}
	});
}
/**
 * 删除脚本
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.id} 脚本id
 */
function deleteScriptBtn_onClickClient (rc,scriptId){
	Artery.confirmMsg("提示信息","此操作不可恢复，确定要删除脚本吗？",function(btn){
		if(btn == "yes"){
			rc.put('scriptId',scriptId);
			rc.put('tplId',Artery.params.tplId);
			rc.send(function(result){
				Artery.showTip('删除成功！')
				Artery.get('templateList').reload();
			})
		}
	})
}
/**
 * 参数列表单击事件
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function paramsList_onClickSingleClient (rc){
	var data = Artery.get('paramsList').getSelectedRowJson();
	if(data.paramKeyCol != 'focusItemId' && data.paramKeyCol != 'validMessage' ){
		Artery.get('modifyParamBtn').enable();
		Artery.get('deleteParamBtn').enable();
	}else{
		Artery.get('modifyParamBtn').disable();
		Artery.get('deleteParamBtn').disable();
	}
}
/**
 * 修改参数
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function modifyParamBtn_onClickClient (rc){
	var data = Artery.get('paramsList').getSelectedRowJson();
	Artery.openForm({
		"formId" : "3efd8086fbcb16b4029b875e4191dbd6",
		"formType" : "1",//1表单，2报表，3文书
		"title" : "修改参数",
		"params" : {
			"tplId" : Artery.params.tplId,
			"paramId": data.paramKeyCol
		},
		"runTimeType" : "update",
		"target" : "_window",//_window或_blank
		"targetWidth" : 330,
		"targetHeight" : 150
	});
}
/**
 * 删除参数
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function deleteParamBtn_onClickClient (rc){
	Artery.confirmMsg("提示信息","此操作不可恢复，确定要删除参数吗？",function(btn){
		if(btn == "yes"){
			var data = Artery.get('paramsList').getSelectedRowJson();
			rc.put('tplId',Artery.params.tplId);
			rc.put('paramId',data.paramKeyCol);
			rc.send(function(result){
				Artery.showTip('删除成功！');
				Artery.get('paramsList').reload();
			});
		}
	})
	
}
/**
 * onClickSingleClient(formsList)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function formsList_onClickSingleClient (rc){
	Artery.get('deleteFormBtn').enable();	
}
/**
 * onClickClient(deleteFormBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function deleteFormBtn_onClickClient (rc){
	Artery.confirmMsg("提示信息","此操作不可恢复，确定要删除表单吗？",function(btn){
		if(btn == "yes"){
			var data = Artery.get('formsList').getSelectedRowJson();
			rc.put('tplId',Artery.params.tplId);
			rc.put('formId',data.formIdCol);
			rc.send(function(result){
				Artery.showTip('删除成功！');
				Artery.get('formsList').reload();
			});
		}
	})	
}