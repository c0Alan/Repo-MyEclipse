// **********************************************//
// 主题维护 客户端脚本
// 
// @author Artery
// @date 2010-10-26
// @id d7c9bdb1eefaa649de1baa779177de41
// **********************************************//
var pluginPros = {};

/**
 * 点击节点脚本(plugins)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function plugins_onNodeClickClient (rc, node){
	//刷新属性列表
	var pluginType = "";
	var type = node.attributes.type;
	type = type.substr(type.indexOf("_")+1);
	if(type == "plugin"){
		pluginType = node.attributes.cid;
	}

	Artery.get("blankPanel8e121").setTitle("<span style=\"font-size:14px;padding:3px;\">控件类型："+node.attributes.text+"</span>");

	var pluginCfgPro = {};
	var pluginNode = Artery.get("plugins").getClickNode();
	if(pluginNode){
		Ext.apply(pluginCfgPro, pluginPros[pluginNode.attributes.cid]);
	}
	Artery.get("pluginPros").reload({
		params:{
		   	pluginType : pluginType, //控件类型
		   	pluginCfgPro : Ext.encode(pluginCfgPro)
		}
	});
}
    
/**
 * onClickClient(tbButton79644)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function saveBtn_onClickClient (rc){
	rc.put("themeName", Artery.get("themes").getValue());
	rc.put("themeCss", Artery.get("themeCss").getValue());
	rc.put("pluginPros", Ext.encode(pluginPros));
	
	rc.send(function(result){
		if(result == "ok"){
			Artery.showTip("保存成功！", 'navTabAreae7c37');
			var pluginDN = Artery.get("plugins");
			var clickNode = pluginDN.getClickNode();
			if(clickNode){
				var nodePath = clickNode.getPath("cid"); 
				pluginDN.root.reload();
				pluginDN.selectPath(nodePath, "cid", function(bSuccess, oLastNode){
					if(bSuccess && oLastNode){
						oLastNode.fireEvent("click", oLastNode);
					}
				});
			}else{
				pluginDN.root.reload();
			}
		}
	});
}

/**
 * 值改变时脚本(proValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function proValue_onChangeClient (rc, oldValue, newValue){
	var curPluginType = Artery.get("plugins").getClickNode().attributes.cid;
	var rowJson = Artery.get("pluginPros").getRowJson();
	var plugin = pluginPros[curPluginType]; 
	if(Ext.isEmpty(newValue)){
		if(plugin){
			delete plugin[rowJson.proName];
			var hasSub = false;
			for(var sub in plugin){
				hasSub = true;break;
			}
			if(!hasSub){
				delete pluginPros[curPluginType];
			}
		}
		return;
	}
	
	if(plugin){
		plugin[rowJson.proName] = newValue;
	}else{
		pluginPros[curPluginType] = {};
		pluginPros[curPluginType][rowJson.proName] = newValue;
	}
}
  	
/**
 * onLoadClient(formf044e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {var.pluginPros}
 */
function formf044e_onLoadClient (rc, pros){
	pluginPros = eval(pros);
}

  	
/**
 * onClickClient(reloadCacheBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function reloadCacheBtn_onClickClient (rc){
	rc.send(function(result){
		if(result == "ok"){
			Artery.showTip("刷新缓存成功！", 'navTabAreae7c37');
		}
	});	
}
/**
 * onClickClient(searchBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function searchBtn_onClickClient (rc){
	var st = Artery.get("searchString").getValue();
	if(st == ""){
		return;
	}
	var dn = Artery.get("plugins");
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
				Artery.get("plugins").expandNode(path[0]);
			} else {
				dn.searchText = "";
				dn.searchAccount = 0;
				dn.searchPathList = "";;
				if(result.rs == "no"){
					Artery.showTipError("未找到符合条件的控件", 'navTabAreae7c37');
				}else{
					Artery.showTipError(result.rs, 'navTabAreae7c37');
				}
			}
		});
	}
}
/**
 * 回车时脚本(formAreaf1cd6)
 * 
 */
function formAreaf1cd6_onEnter (){
	Artery.get("searchBtn").click();
}