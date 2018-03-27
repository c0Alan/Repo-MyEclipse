// **********************************************//
// 角色维护 客户端脚本
// 
// @author Artery.hanf
// @date 2010-09-06
// @id 1b3b408e9d3d76daa4fcfc96facbb538
// **********************************************//

/**
 * 客户端(delRoleBtn, 删除角色)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function delRoleBtn_onClickClient (rc){
	//获得当前选择的节点
	var node = Artery.get("customRoleList").getClickNode();
	if(!node){
		Artery.showTipError("请选择待删除节点！", 'navTabArea9ee4f');
		return;
	}
	var roleId = node.attributes.cid;
	if(Ext.isEmpty(roleId)) {
		Artery.showTipError("角色编号为空！", 'navTabArea9ee4f');
		return;
	}
	Artery.confirmMsg("确认删除", "确定删除角色“"+node.text+"”?", function(btn){
		if(btn == "yes"){
			rc.put('roleId', roleId);// 角色id
			rc.send(function(result){
				if(result == "ok"){
					//重新加载“自定义角色”列表
					var customRoleList = Artery.get("customRoleList");
					customRoleList.root.reload();
					if(customRoleList.root.childNodes.length > 0 ){
						customRoleList.fireEvent('click',customRoleList.root.childNodes[0]);
					}
					Artery.showTip("删除角色成功！", 'navTabArea9ee4f');
				}
			});	
		}
	});
}

/**
 * 点击节点脚本(sysRoleList, 系统角色列表)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function sysRoleList_onNodeClickClient (rc, node){
	var selRoleId = node.attributes.cid;
	Artery.get("sysOperArea").showForm({
	  formId : "9351b100a3036cbdd43493c1d9ff2e4a",
	  formType : Artery.FORM,
	  runTimeType : "display",
	  params:{
	  	roleId: selRoleId,
	  	roleType: "sys"
	  }
	});	
}

/**
 * 点击节点脚本(customRoleList, 自定义角色列表)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function customRoleList_onNodeClickClient (rc, node){
	var selRoleId = node.attributes.cid;
	Artery.get("customOperArea").showForm({
	  formId : "9351b100a3036cbdd43493c1d9ff2e4a",
	  formType : Artery.FORM,
	  runTimeType : "display",
	  params:{
	  	roleId: selRoleId,
	  	roleType: "custom"
	  }
	});
}


/**
 * 回车时脚本(formAreaf1cd6)
 * 
 */
function formAreaf1cd6_onEnter() {
	Artery.get("searchBtn").click();
}


/**
 * 客户端(searchBtn, 查询按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function searchBtn_onClickClient(rc) {
	var st = Artery.get("searchString").getValue();
	if (st == "") {
		return;
	}
	var dn = Artery.get("customRoleList");
	if (st == dn.searchText) {
		if (++dn.searchAccount >= dn.searchPathList.length) {
			dn.searchAccount = 0;
		}
		dn.expandNode(dn.searchPathList[dn.searchAccount]);
	} else {
		rc.put("searchText", st);
		rc.send(function(result) {
			if (result.rs == "ok") {
				var path = result.pathList;
				dn.searchText = st;
				dn.searchAccount = 0;
				dn.searchPathList = path;
				Artery.get("customRoleList").expandNode(path[0]);
			} else {
				dn.searchText = "";
				dn.searchAccount = 0;
				dn.searchPathList = "";
				if (result.rs == "no") {
					Artery.showTipError("未找到符合条件的角色！", 'customOperArea');
				} else {
					Artery.showTipError(result.rs, 'customOperArea');
				}
			}
		});
	}
}
