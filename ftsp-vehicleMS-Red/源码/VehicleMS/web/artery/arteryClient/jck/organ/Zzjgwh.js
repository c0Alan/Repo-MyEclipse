// **********************************************//
// 组织结构维护 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-16
// @id c6c8b9ed478292fde2ae90f6e4261681
// **********************************************//

/**
 * 客户端(gxhcBtn, 更新缓存按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function gxhcBtn_onClickClient (rc){
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		if(result == 'ok'){
			Artery.showTip("更新缓存成功！", 'operArea');
			var rn = Artery.get("dynamicNav").root; //刷新组织结构树
			rn.reload(function(){
				if(rn.firstChild){
					rn.firstChild.expand(false);
				}
			});
			Artery.get("operArea").showForm({ // 刷新右侧操作区域
				"formId" : "95af4e9e11d6c799ae3ec40af50a9f62",
				"formType" : "1",  //1表单，2报表，3文书
				"runTimeType" : "insert"
			});
		}else{
			Artery.showTipError("更新缓存失败！", 'operArea');
		}
	});
}

/**
 * 点击节点脚本(dynamicNav, 点击组织结构树时脚本)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function dynamicNav_onNodeClickClient (rc, node){ //工具栏按钮可用控制
	var type = node.attributes.type;
	var add_corp = Artery.get('addCorpBtn');   //添加单位按钮
	var add_dept = Artery.get('addDeptBtn');   //添加部门按钮
	var add_user = Artery.get('addUserBtn');   //添加人员按钮
	var move_user = Artery.get("moveUserBtn"); //移动人员按钮
	var del_organ = Artery.get('delOrganBtn'); //删除按钮
	if (type == 'corp') {
		add_corp.enable();
		add_dept.enable();
		add_user.enable();
		move_user.disable();
	} else if (type == 'dept') {
		add_corp.disable();
		add_dept.enable();
		add_user.enable();
		move_user.disable();
	} else {
		add_corp.disable();
		add_dept.disable();
		add_user.disable();
		move_user.enable();
	}
	if(node.parentNode.isRoot){ // 只要选中，删除按钮就可以使用
		del_organ.disable();
	}else{
		del_organ.enable();
	}
	
	if(type == "corp"){	//打开相应的可编辑页面
		openCorpEditFor(node, "update");
	}else if(type == "dept"){
		openDeptEditFor(node, "update");
	}else if(type == "user"){
		openUserEditFor(node, "update");
	}
}

/**
 * 客户端(scjpzlBtn, 增量生成简拼按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function scjpzlBtn_onClickClient (rc){
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		if(result == 'ok'){
			Artery.showTip("（增量）生成简拼成功！", 'operArea');
		}else{
			Artery.showTipError("（增量）生成简拼失败！", 'operArea');
		}
	});
}

/**
 * 客户端(scjpqlBtn, 全量生成简拼按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function scjpqlBtn_onClickClient (rc){
	//发送请求，在回调函数中处理返回结果
	rc.send(function(result){
		if(result == 'ok'){
			Artery.showTip("（全量）生成简拼成功！", 'operArea');
		}else{
			Artery.showTipError("（全量）生成简拼失败！", 'operArea');
		}
	});
}

/**
 * 客户端(delOrganBtn, 删除组织机构按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function delOrganBtn_onClickClient (rc){
	var node = Artery.get("dynamicNav").getClickNode();  //获得当前选择的节点
	if(!node || Ext.isEmpty(node.attributes.cid)){
		Artery.showTipError("请选择待删除节点！", 'operArea');
		return;
	}

	var type = node.attributes.type;
	if(type=="user"){
		var msg = "确定删除人员“"+node.text+"”？";
		deleteOrganInner(rc, node, msg);
	}else{
		rc.put("methodName", "getChildCount");
		rc.put("organId", node.attributes.cid.substring(5));
		rc.put("organType", type);
		rc.send(function(result){
			var tmp = [];
			// ~~将变量转换为数值类型
			if(~~(result.corp) > 0){
				tmp.push("单位");
			}
			if(~~(result.dept) > 0){
				tmp.push("部门");
			}
			if(~~(result.user) > 0){
				tmp.push("人员");
			}
			var cm = tmp.join(",");
			if(type=="corp"){
				if(tmp.length < 1){
					var msg = "确定删除单位“"+node.text+"”？";
					deleteOrganInner(rc, node, msg);
				}else{
					var msg = "警告：此单位下包含<font color=red>"+cm+"</font> ，删除此单位将同时删除下面的所有机构，你确定进行此操作？";
					deleteOrganInner(rc, node, msg);
				}
			}else{
				if(tmp.length < 1){
					var msg = "确定删除部门“"+node.text+"”？";
					deleteOrganInner(rc, node, msg);
				}else{
					var msg = "警告：此部门下包含<font color=red>"+cm+"</font> ，删除此部门将同时删除下面的所有机构，你确定进行此操作？";
					deleteOrganInner(rc, node, msg);
				}
			}
		});
	}
}

//private 删除组织机构
function deleteOrganInner(rc,node, deleteMsg){
	Artery.confirmMsg("确认删除", deleteMsg, function(btn){
		if(btn == "yes"){
			rc.put("methodName", "deleteOrgan");
			var organId = node.attributes.cid.substring(5);
			rc.put("organId", organId);
			rc.put("organType", node.attributes.type);
			var pNode = node.parentNode;
			rc.send(function(result){
				if (result == "ok") {
					if (pNode) {//展开到删除节点的父节点
						pNode.reload(function() {
							Artery.get("dynamicNav").fireEvent('click',pNode);
						});
					}
					Artery.showTip("删除组织机构节点成功！", 'operArea');
				} else {
					Artery.showTipError("删除节点失败！\n"+result, 'operArea');
				}
			});
		}
	});
}

/**
 * 客户端(addCorpBtn, 添加单位按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addCorpBtn_onClickClient (rc){
	var node = Artery.get("dynamicNav").getClickNode();
	if(!node || node.attributes.type != "corp"){
		Artery.showTipError("请选择父单位节点！", 'operArea');
		return;
	}
	openCorpEditFor(node, "insert");
}


//private  打开单位添加修改页面
function openCorpEditFor(node, runTimeType){
	var pidStr = "";
	var idStr = "";
	var headStr = "";
	if(runTimeType == "insert"){
		headStr = "上级单位：" + node.attributes.text;
		pidStr = node.attributes.cid.substring(5);
	}
	if(runTimeType == "update"){
		headStr = "编辑单位";
		idStr = node.attributes.cid.substring(5);
	}
	
	Artery.get("operArea").showForm({
	  formId : "dac805668603a448d08bd83e6f42ec92",
	  formType : Artery.FORM,
	  runTimeType : runTimeType,
	  params:{
	  	pcorpId    : pidStr,
	    corpId     : idStr,
	    headString : headStr
	  }
	});	
	
}

/**
 * 客户端(addDeptBtn, 添加部门按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addDeptBtn_onClickClient (rc){
	var node = Artery.get("dynamicNav").getClickNode();
	if(!node || (node.attributes.type != "corp" && node.attributes.type != "dept")){
		Artery.showTipError("请选择父部门或父单位节点！", 'operArea');
		return;
	}
	openDeptEditFor(node, "insert");
}

//private  打开部门添加修改页面
function openDeptEditFor(node, runTimeType){
	var pidStr = "";
	var pTypeStr = "";
	var idStr = "";
	var headStr = "";
	
	if(runTimeType == "insert"){
		pidStr = node.attributes.cid.substring(5);
		pTypeStr = node.attributes.type;
		headStr = "上级" + (pTypeStr=="corp"?"单位：":"部门：") + node.attributes.text;
	}
	if(runTimeType == "update"){
		headStr = "编辑部门";
		idStr = node.attributes.cid.substring(5);
	}
	
	Artery.get("operArea").showForm({
	  formId : "2952202e7c204ea6a2ba90c90dfba36a",
	  formType : Artery.FORM,
	  runTimeType : runTimeType,
	  params:{
	  	parentId   : pidStr,
	  	parentType : pTypeStr,
	  	deptId     : idStr,
	    headString : headStr
	  }
	});	
	
}

/**
 * 客户端(addUserBtn, 添加帐号按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addUserBtn_onClickClient (rc){
	var node = Artery.get("dynamicNav").getClickNode();
	if(!node || (node.attributes.type != "corp" && node.attributes.type != "dept")){
		Artery.showTipError("请选择父部门或父单位节点！", 'operArea');
		return;
	}
	openUserEditFor(node, "insert");
}


//private  打开帐号添加修改页面
function openUserEditFor(node, runTimeType){
	var pidStr = "";
	var pTypeStr = "";
	var idStr = "";
	var headStr = "";
	
	if(runTimeType == "insert"){
		pidStr = node.attributes.cid.substring(5);
		pTypeStr = node.attributes.type;
		headStr = "上级" + (pTypeStr=="corp"?"单位：":"部门：") + node.attributes.text;
	}
	if(runTimeType == "update"){
		headStr = "编辑用户";
		idStr = node.attributes.cid.substring(5);
	}
	
	Artery.get("operArea").showForm({
	  formId : "164e57c06ee31f07f8f592b2a4b9f02c",
	  formType : Artery.FORM,
	  runTimeType : runTimeType,
	  params:{
	  	parentId   : pidStr,
	  	parentType : pTypeStr,
	  	userId     : idStr,
	    headString : headStr
	  }
	});	
	
}

/**
 * 客户端(searchBtn, 查询按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function searchBtn_onClickClient (rc){
	var st = Artery.get("searchString").getValue();
	if(st == ""){
		return;
	}
	
	var dn = Artery.get("dynamicNav");
	if(st == dn.searchText){
		if(++dn.searchAccount >= dn.searchPathList.length){
			dn.searchAccount = 0; //循环
		}
		dn.expandNode(dn.searchPathList[dn.searchAccount]);
	}else{
		rc.put("searchText", st);
		rc.send(function(result){
			if (result.rs == "ok") {
				var path = result.pathList;
				dn.searchText = st;
				dn.searchAccount = 0;
				dn.searchPathList = path;;
				Artery.get("dynamicNav").expandNode(path[0]);
			} else {
				dn.searchText = "";
				dn.searchAccount = 0;
				dn.searchPathList = "";;
				if(result.rs == "no"){
					Artery.showTipError("未找到符合条件的用户！", 'operArea');
				}else{
					Artery.showTipError(result.rs, 'operArea');
				}
			}
		});
	}
}

/**
 * 客户端(moveUserBtn, 移动用户按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function moveUserBtn_onClickClient (rc){
	var node = Artery.get("dynamicNav").getClickNode();
	if(!node || node.attributes.type != "user"){
		Artery.showTipError("请选择需要移动的用户节点！", 'operArea');
		return;
	}
	var userIdStr = node.attributes.cid;
	var pOrganIdStr = node.parentNode.attributes.cid;
	Artery.openForm({
	  formId : "e3ffa782cb626e50e808e722ffeb8ee4",
	  formType : Artery.FORM,
	  runTimeType : "insert",
	  title : "移动账户",
	  target: "_window",
	  targetWidth : 350,
	  targetHeight : 400,
	  params:{
	  	userId   : userIdStr,
	  	pOrganId : pOrganIdStr
	  }
	});		
}

/**
 * 回车时脚本(formAreaf1cd6)
 * 
 */
function formAreaf1cd6_onEnter (){
	Artery.get("searchBtn").click();
}
  	