// **********************************************//
// 权限维护 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-23
// @id 4d042c93e9b328c4093958824b52dbe1
// **********************************************//
/**
 * 客户端(delRightCOT,删除操作)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.rightKey}
 */
function delRightCOT_onClickClient (rc, rightKey){
	Artery.confirmMsg("确认删除", "确认删除权限？", function(btn){
		if(btn == "yes"){
			rc.put('rightKey',rightKey);
			rc.send(function(result){
				if(result == "ok"){
					Artery.get("rightList").reload();	
					Artery.showTip("删除权限成功", "formbd24a");
				}else{
					Artery.showTipError("删除权限失败！\n" + result, "formbd24a");
				}
			});
		}
	});
}

/**
 * 客户端(rightList, 单击列表区域的行)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.rightKey}
 */
function rightList_onClickSingleClient (rc, rightKey){
	var uta = Artery.get("userTreeArea"); 
	uta.loader.baseParams.curRightKey = rightKey; //当前行的权限字
	uta.root.reload(function(){ //重新加载人员树
		uta.root.expandChildNodes(false);
	});
	
	var rta = Artery.get("roleTreeArea");  //重新加载角色树
	rta.loader.baseParams.curRightKey = rightKey; //当前行的权限字
	rta.root.reload(); 
}

/**
 * 分页查询脚本(rightpagingbar)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function rightpagingbar_onSearch (params){
	Artery.get('rightList').reload({params:params})
}