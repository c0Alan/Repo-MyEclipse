// **********************************************//
// 计划列表 客户端脚本
// 
// @author Artery
// @date 2010-09-29
// @id 47126f43ac28aaf736a6a83e0b96bb11
// **********************************************//
/**
 * onClickClient(deploy_colOperImg)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.cid}
 * @param  {rs1.deploy}
 * @param  {rs1.name}
 */
function deploy_colOperImg_onClickClient (rc,cid,deploy,name){
	var temp = "";
	if(deploy == "1"){
		temp += "取消";
	}
	
	Artery.confirmMsg("确定" + temp + "部署","确定要" + temp + "部署计划\"" + name + "\"?" ,function(btn){
		if(btn=="yes"){
			rc.put("plan.cid",cid);
			rc.send(function(result){
				if(result=="YES"){
					Artery.showTip( temp + "部署成功，请继续！");
					Artery.get("plans_listArea").reload();
				}else{
					Artery.showTipError( temp + "部署失败！");
				}
			});
		}
	});
}
/**
 * onClickClient(del_colOperImg)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.cid}
 * @param  {rs1.name}
 * @param  {rs1.deploy}
 */
function del_colOperImg_onClickClient (rc,cid,name,deploy){
	if(deploy == 1){
		Artery.showTipError("计划\"" + name + "\"已部署，不能删除！请取消部署之后再删除！" );
		return ;
	}
	Artery.confirmMsg("确定删除","确定要删除计划\"" + name + "\"?" ,function(btn){
		if(btn=="yes"){
			rc.put("plan.cid",cid);
			rc.send(function(result){
				if(result=="YES"){
					Artery.showTip(  "删除成功！");
					Artery.get("plans_listArea").reload();
				}else{
					Artery.showTipError(  "删除失败！");
				}
			});
		}
	});
}
/**
 * onClickClient(edit_colOperImg)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.cid}
 * @param  {rs1.name}
 * @param  {rs1.deploy}
 */
function edit_colOperImg_onClickClient (rc,scid,name,deploy){
	if(deploy == 1){
		Artery.showTipError("计划\"" + name + "\"已部署，不能编辑！请取消部署之后再编辑！" );
		return ;
	}
	Artery.openForm({
	    formId: "94b7328fc85c93cf74a03917be5e5678",
	    formType : Artery.FORM,
	    runTimeType : Artery.INSERT,
       	target: "_window",
       	targetHeight: 500,
       	targetWidth: 500,
       	title: "修改计划",
       	params: {
       	   cid:scid
       	}
	});
}

/**
 * 分页查询脚本(pagingbar1e3a20)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar1e3a20_onSearch (params){
	Artery.get('plans_listArea').reload({params:params});
}

		
/**
 * onClickClient(tbButton9f217)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function reloadCache_tbButton_onClickClient (rc){
	rc.send(function(result){
		if(result == 'ok'){
			Artery.showTip("更新缓存成功！", 'blankPanelf7be9');
			Artery.get("plans_listArea").reload();
		}else{
			Artery.showTipError("更新缓存失败！", 'blankPanelf7be9');
		}
	});	
}
/**
 * onClickClient(deployAll_tbButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function deployAll_tbButton_onClickClient (rc){
	Artery.confirmMsg("确认","确定要部署所有计划吗？",function(btn){
		if(btn == "yes"){
			rc.send(function(result){
				if(result == "ok"){
					Artery.showTip("部署所有计划成功！", 'blankPanelf7be9');
					Artery.get("plans_listArea").reload();
				}
			});
		}
	});	
}
/**
 * onClickClient(undeployAll_tbBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function undeployAll_tbBtn_onClickClient (rc){
	Artery.confirmMsg("确认","确定要取消所有计划的部署吗？",function(btn){
		if(btn == "yes"){
			rc.send(function(result){
				if(result == "ok"){
					Artery.showTip("取消所有部署成功！", 'blankPanelf7be9');
					Artery.get("plans_listArea").reload();
				}
			});
		}
	});		
}