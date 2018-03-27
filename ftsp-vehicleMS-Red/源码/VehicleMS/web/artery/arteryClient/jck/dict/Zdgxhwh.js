// **********************************************//
// 字典个性化维护 客户端脚本
// 
// @author Artery
// @date 2010-10-08
// @id 0e15aeb8b8b09ab77673b755c2d5e39a
// **********************************************//
  	
/**
 * 点击节点脚本(groupTree)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function groupTree_onNodeClickClient (rc, node){
	// 如果表或目录有个性化配置，则可以使用 tbButton_clear
	if(node.text.indexOf("<font color=red>")==-1){
		Artery.get("tbButton_clear").setDisabled(true);
	}else{
		Artery.get("tbButton_clear").setDisabled(false);
	}
	
	if(node.attributes.type!="table"){
		return ;
	}
	Artery.openForm({
		formId: "3841caaebeabf9c8b87f91c4a3e3770b",
		target: "operArea_table",
		runTimeType: "update",
		params: {
			groupId: Artery.params.groupId,
			tableId: node.attributes.cid
		}
	});
}

// 重新加载字典树
function reloadDictTree(){
	var groupTree = Artery.get("groupTree");
	groupTree.root.reload(function(){
		groupTree.doExpandTree();
	});
}

/**
 * 清空目录或表的个性化配置
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_clear_onClickClient (rc){
	var node = Artery.get("groupTree").getClickNode();
	if(!node || node.text.indexOf("<font color=red>")==-1){
		return ;
	}
	var msg = null;
	if(node.attributes.type=="menu"){
		msg = "您确定要清空目录："+node.text+" ?";
	}else{
		msg = "您确定要清空表："+node.text+" ?";
	}
	Artery.confirmMsg("确认窗口", msg, function(btn){
		if(btn=="yes"){
			rc.put("groupId",Artery.params.groupId);
			rc.put("nodeType", node.attributes.type);
			rc.put("nodeId", node.attributes.cid);
			rc.send(function(res){
				if(res=="ok"){
					Artery.showMessage("操作成功");
					reloadDictTree();
					Artery.get("operArea_table").openForm({
						"formId":"95af4e9e11d6c799ae3ec40af50a9f62",
						"formType":"1",
						"runTimeType":"insert"
					});
				}
			});
		}
	});
}

/**
 * 刷新字典个性化缓存
 * onClickClient(tbButton_refresh)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_refresh_onClickClient (rc){
	rc.send(function(res){
		if(res=="ok"){
			Artery.showMessage("刷新缓存成功");
			reloadDictTree();
		}
	});
}

/**
 * 值改变时脚本(faTree_group)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function faTree_group_onChangeClient (rc, oldValue, newValue){
	if(Ext.isEmpty(newValue)){
		return ;
	}
	Artery.openForm({
		formId: "0e15aeb8b8b09ab77673b755c2d5e39a",
		target: "_self",
		params: {
			groupId: newValue
		}
	});
}
  	