// **********************************************//
// 添加修改部门 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-19
// @id 2952202e7c204ea6a2ba90c90dfba36a
// **********************************************//
/**
 * 客户端(addDeptBtn, 添加部门)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addDeptBtn_onClickClient (rc){
	var name = Artery.get("deptName").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("新建名称为\"" + name + "\"的部门成功！", 'blankPanel9dc18');
			var dt = Artery.getWin().get("dynamicNav"); // 更新组织树
			var node = dt.getClickNode(); 
			node.reload(function(){
				var addedNode = node.findChild('cid', "dept_" + result.id);
				if(addedNode){
					dt.fireEvent('click',addedNode);
				}
			});
		}else{
			Artery.showTipError("新建部门失败！\n"+result.rs, 'blankPanel9dc18');
		}
	});
}

/**
 * 客户端(updateDeptBtn, 更新部门)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateDeptBtn_onClickClient (rc){
	var name = Artery.get("deptName").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("更新名称为\"" + name + "\"的部门成功！", 'blankPanel9dc18');
			var node = Artery.getWin().get("dynamicNav").getClickNode();
			if(null != result.name && "" != result.name){ // 判断是否要更新节点名称
				node.setText(result.name);	
			}
			var valid = Artery.get("deptValid").getValue();
			if(valid == "1"){
				node.getUI().removeClass("organ-treenode-invalid");
			}else if(valid == "2"){
				node.getUI().addClass("organ-treenode-invalid");
			}
		}else{
			Artery.showTipError("更新部门失败！\n"+result.rs, 'blankPanel9dc18');
		}
	});
}

/**
 * 验证脚本(deptName)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function deptName_onValidClient (rc, value){
	var curdeptId;
	var curparentId;
	var parentType;
	if(Artery.params.runTimeType == 'update'){
		curdeptId = Artery.get("faHiddenb1ea3").getValue();
		if(!Ext.isEmpty(Artery.get("u_pdeptId").getValue())){ //更新时从页面中获得数据
			curparentId = Artery.get("u_pdeptId").getValue();
			parentType = "dept";
		}else if(!Ext.isEmpty(Artery.get("u_corpId").getValue())){
			curparentId = Artery.get("u_corpId").getValue();
			parentType = "corp";
		}
	}
	if(Artery.params.runTimeType == 'insert'){
		curparentId = Artery.params.parentId; //添加时从url参数中获得
		parentType = Artery.params.parentType;
	}
	rc.asyn = false;
	rc.put('curdeptId',curdeptId);
	rc.put('deptName',value);
	rc.put('curparentId',curparentId);
	rc.put('parentType',parentType);
	rc.send();
	
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "同级部门中存在值为“"+value+"”的部门名称！";
	}
}