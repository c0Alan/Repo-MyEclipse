// **********************************************//
// 添加修改单位 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-17
// @id dac805668603a448d08bd83e6f42ec92
// **********************************************//
/**
 * 客户端(addCorpBtn, 新建单位)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addCorpBtn_onClickClient (rc){
	var name = Artery.get("corpName").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("新建名称为\"" + name + "\"的单位成功！", 'blankPanele9a85');
			var dt = Artery.getWin().get("dynamicNav"); // 更新组织树
			var node = dt.getClickNode(); 
			node.reload(function(){
				var addedNode = node.findChild('cid', "corp_" + result.id);
				if(addedNode){
					dt.fireEvent('click',addedNode);
				}
			});
		}else{
			Artery.showTipError("新建单位失败！\n"+result.rs, 'blankPanele9a85');
		}
	});	
}

/**
 * 客户端(updateCorpBtn, 更新单位)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updateCorpBtn_onClickClient (rc){
	var name = Artery.get("corpName").getValue();
	Artery.get("formArea").submit(function(result){
		if(result.rs == "ok"){
			Artery.showTip("更新名称为\"" + name + "\"的单位成功！", 'blankPanele9a85');
			var node = Artery.getWin().get("dynamicNav").getClickNode();
			if(null != result.name && "" != result.name){ // 判断是否要更新节点名称
				node.setText(result.name);
			}
			var valid = Artery.get("corpValid").getValue();
			if(valid == "1"){
				node.getUI().removeClass("organ-treenode-invalid");
			}else if(valid == "2"){
				node.getUI().addClass("organ-treenode-invalid");
			}
		}else{
			Artery.showTipError("更新单位失败！\n"+result.rs, 'blankPanele9a85');
		}
	});
}

/**
 * 验证脚本(corpName)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function corpName_onValidClient (rc, value){
	var curcorpId;
	var parentId;
	var parentType;
	if(Artery.params.runTimeType == 'update'){
		curcorpId = Artery.get("faHidden6bcf8").getValue();
		parentId = Artery.get("parentId").getValue();
	}
	if(Artery.params.runTimeType == 'insert'){
		parentId = Artery.params.pcorpId; //添加时从url参数中获得
	}
	rc.asyn = false;
	rc.put('curcorpId',curcorpId);
	rc.put('corpName',value);
	rc.put('parentId',parentId);
	rc.send();
	
	var result =  rc.getResult();
	if(!Ext.isTrue(result)){
		return "同级单位中存在值为“"+value+"”的单位名称！";
	}
}