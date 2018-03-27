// 快捷菜单节点
var contextNode;
// sql显示面版
var sqlCodePanel;
var sqlWindow;

// 初始化sql窗口
function initSqlWindow() {
	sqlCodePanel = new CodePanel({
				language : "sql"
			});
	sqlWindow = new Ext.Window({
				title : 'SQL编辑器',
				width : 600,
				height : 400,
				resizable : false,
				border : false,
				closeAction : 'hide',
				modal : true,
				layout : 'fit',
				plain : true,
				buttonAlign : 'right',
				items : [sqlCodePanel],
				buttons : [{
							text : '取消',
							handler : function() {
								sqlWindow.setVisible(false);
							}
						}]
			});
}

function initFormTree() {
	formTree = new Ext.tree.TreePanel({
				region : 'west',
				animate : false,
				id : 'formtpl',
				width : 260,
				split : true,
				minSize : 175,
				maxSize : 400,
				title : '表单模板',
				header : true,
				border : true,
				enableDD : true,
				tools : [{
							id : "plus",
							qtip : "展开全部节点",
							handler : function() {
								formTree.root.expand(true, false);
							}
						}, {
							id : "minus",
							qtip : "折叠全部节点",
							handler : function() {
								formTree.root.collapse(true, false);
								formTree.root.expand(false, false);
							}
						}],
				containerScroll : true,
				autoScroll : true
			});

	formTree.on("click", selNode);
	// 注册拖拽事件
	formTree.on("beforenodedrop", dragNodeHander);
	formTree.on("nodedragover", dragoverHandler);
	formTree.on("contextmenu", function(node, e) {
				contextNode = node;
				if (node.myContextMenu) {
					checkContextMenu(node);
					node.myContextMenu.showAt(e.getXY());
				}
			});

	var doc = formtpl.dom;
	var rootEl = doc.documentElement;
	var nodeText = rootEl.getAttribute("cn");
	var nodeType = rootEl.getAttribute("type");
	var newNodeName = getNameProp(rootEl);
	if (newNodeName && newNodeName != null && newNodeName != "")
		nodeText = newNodeName;
	var rootNode = formTree.setRootNode(new Ext.tree.TreeNode({
				text : nodeText,
				type : nodeType,
				data : rootEl,
				iconCls : nodeType,
				qtipCfg : {
					text : "没有错误"
				}
			}));
	// 添加右键菜单
	var nodeMenu = genContextMenu(rootEl, false);
	rootNode.myContextMenu = nodeMenu;
	genTreeNode(rootEl, rootNode);
}

// 得到el的显示名称，这个名称可能来自el的子prop中的一个
function getNameProp(typeEl) {
	if (typeEl.nodeType != 1)
		return null;
	var nodeNameProp = typeEl.getAttribute("nameprop");
	if (nodeNameProp == null || !nodeNameProp)
		return null;

	var props = typeEl.childNodes;
	var proplist;
	for (var i = 0; i < props.length; i++) {
		if (props[i].nodeName == "Properties") {
			proplist = props[i];
		}
	}

	if (proplist == null)
		return null;

	for (var i = 0; i < proplist.childNodes.length; i++) {
		var element = proplist.childNodes[i];
		if (element.nodeType === 1) {
			var elementname = element.getAttribute("name");
			if (elementname == nodeNameProp) {
				return element.childNodes[0].text;
			}
		}
	}

	return null;
}

// 给每个节点生成右键菜单
function genContextMenu(el, needDel) {
	if (el.nodeType != 1)
		return null;
		
	var nodeMenu = [];
	var sChild = el.getAttribute("child");
	if (sChild && sChild.length > 0) {
		var arrayChild = sChild.split(";");
		var subMenu = {};
		for (var k = 0; k < arrayChild.length; k=k+1) {
			var childMenu = arrayChild[k].split(",");
			if(childMenu[4]=="-1"){	// 不属于子菜单
				nodeMenu.push({
					text : '新建[' + childMenu[1] + ']',
					iconCls : childMenu[0] + 'New',
					myGroup : childMenu[2],
					isUnique : childMenu[3],
					typeEn : childMenu[0],
					typeCn : childMenu[1],
					handler : clickContextMenuHandler
				});
			}else{	// 属于子菜单
				if(subMenu[childMenu[4]]){
					subMenu[childMenu[4]].menu.items.push({
						text : '新建[' + childMenu[1] + ']',
						iconCls : childMenu[0] + 'New',
						myGroup : childMenu[2],
						isUnique : childMenu[3],
						typeEn : childMenu[0],
						handler : clickContextMenuHandler
					});
				}else{
					subMenu[childMenu[4]] = {
						text : childMenu[4],
						menu:{
							items:[{
								text : '新建[' + childMenu[1] + ']',
								iconCls : childMenu[0] + 'New',
								myGroup : childMenu[2],
								isUnique : childMenu[3],
								typeEn : childMenu[0],
								handler : clickContextMenuHandler
							}]
						}
					};
					nodeMenu.push(subMenu[childMenu[4]]);
				}
			}
		}
	}
	
	if (needDel) {
		if (sChild && sChild.length > 0) {
			nodeMenu.push("-");
		}
		nodeMenu.push({
			text : '删除' + el.getAttribute("cn")+"[HotKey:Delete]",
			iconCls : 'del',
			handler : delNode
		});
		nodeMenu.push({
			text : '复制',
			iconCls : 'copy',
			handler : copyHandler
		});
	}

	if (sChild && sChild.length > 0) {
		if (!needDel) {
			nodeMenu.push("-");
		}
		nodeMenu.push({
			id : 'paste',
			text : '粘贴',
			iconCls : 'paste',
			handler : pasteHandler
		});
		nodeMenu.push({
			text : '清除所有子节点',
			iconCls : 'clear',
			handler : clearNode
		});
	}

	if (el.getAttribute("type") == "listArea" || el.getAttribute("type") == "formArea") {
		var subMenu = {
			text : "脚本模板",
			menu:{
				items:[{
					text : "查询SQL",
					iconCls : "gensql",
					handler : function(){
						genSQL("select");
					}
				}]
			}
		};
		if(el.getAttribute("type")=="formArea"){
			subMenu.menu.items.push({
				text : '插入脚本',
				iconCls : 'gensql',
				handler : function(){
					genSQL("insert");
				}
			});
			subMenu.menu.items.push({
				text : '更新脚本',
				iconCls : 'gensql',
				handler : function(){
					genSQL("update");
				}
			});
			subMenu.menu.items.push({
				text: "ajax模板",
				iconCls: "gensql",
				handler: function(){
					genSQL("ajax");
				}
			});
		}
		nodeMenu.push(subMenu);
		nodeMenu.push({
			text:'同步所有子节点的数据源',
			handler:function(){
				var dsName = getPropValue(el,"ds");
				sychDSName(el,dsName);
			}
		});
	}
	nodeMenu.push({
	   text : '帮助',
	   iconCls : 'itemhelp',
	   handler : openHelp
	});
	var nm = new Ext.menu.Menu({
		items:nodeMenu
	});
	return nm;
}

// 递归同步字段数据源标签
function sychDSName(el,dsName){
	for(var i=0;i<el.childNodes.length;i++){
	var subEl = el.childNodes[i];
	if (subEl.nodeName == 'Items') {
		for(var j=0;j<subEl.childNodes.length;j++){
			var itemEl = subEl.childNodes[j];
			if(itemEl.nodeName == 'Item'){
				if(itemEl.getAttribute('type')=='faBlankLayout'){
					sychDSName(itemEl,dsName);
				}else{
					var oldval=getPropValue(itemEl,"dataName");
					if(oldval){
						var newval=oldval.replace(/\{(.*)\.(.*)\}/g,"{"+dsName+".$2}");
						setPropValue(itemEl,"dataName",newval);
					}
				}
			}
		}
	}
}
}

var sqlWindow;

// 生成sql
function genSQL(sqlType) {
	var el = contextNode.attributes.data;
	var map = new Map();
	map.put("key", "formmake.genSQL");
	map.put("sqlType",sqlType);
	map.put("xml", el.xml);
	map.put("formid", formtpl.id);
	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
				sqlCodePanel.setCode(msg);
				sqlWindow.show();
			});
	query.send();
}

// 打开此子节点的帮助
function openHelp(item, e) {
    var element = contextNode.attributes.data;
    var helpid = element.getAttribute("helpid");
    window.open(sys.getContextPath()
                    + "/artery/businesshelp/dealBusinesshelp.do?action=toItemEditPage&id="+ helpid+ "&type=4"
                    + "&readOnly=1");
}

// 清除所有子节点
function clearNode(item, e) {
	Ext.MessageBox.show({
				title : '确认是否删除所有子节点',
				msg : '确定要删除么？删除后，其所有子节点和属性将都被删除，且不可恢复。',
				width : 300,
				buttons : Ext.MessageBox.OKCANCEL,
				fn : function(btn) {
					if (btn == 'ok') {
						var element = contextNode.attributes.data;
						for (var i = 0; i < element.childNodes.length; i++) {
							var subEl = element.childNodes[i];
							if (subEl.nodeName == 'Items') {
								element.removeChild(subEl);
								break;
							}
						}
						while (contextNode.firstChild)
							contextNode.removeChild(contextNode.firstChild);
					}
				}
			});
}

// 删除节点
function delNode(item, e) {
    if(contextNode == formTree.root)
      return;
    var nextNode = contextNode.nextSibling;
    if(nextNode == null )
      nextNode = formTree.root;
	Ext.MessageBox.show({
				title : '确认是否删除',
				msg : '确定要删除此节点么？删除后，其所有子节点和属性将都被删除，且不可恢复。',
				width : 300,
				buttons : Ext.MessageBox.OKCANCEL,
				fn : function(btn) {
					if (btn == 'ok' && contextNode.parentNode) {
						var parentNode = contextNode.parentNode;
						var element = contextNode.attributes.data;
						var parentEl = element.parentNode;

						parentEl.removeChild(element);
						contextNode.remove();
						selNode(nextNode);
					}
				}
			});
}

// 复制节点
function copyHandler(item, e) {
    var el = contextNode.attributes.data;
    el.setAttribute("formid",formtpl.id);
	window.clipboardData.setData("Text", el.xml);
}

function pasteHandler() {
    var strContent = window.clipboardData.getData("Text");
    var domContent = loadXMLString(strContent);
    if(formtpl.id != domContent.documentElement.getAttribute("formid")){
      doPaste(strContent);
      return;
    }
    //到服务器端修改id
	var map = new Map();
	map.put("key", "formmake.paste");
	map.put("xml", strContent);
	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
				doPaste(msg);
			});
	query.send();
}

function doPaste(xmlStr){
        var docObj = loadXMLString(xmlStr);
        var rootEl = docObj.documentElement;

        var nodeText = rootEl.getAttribute("cn");
        var nodeType = rootEl.getAttribute("type");
        var newNodeName = getNameProp(rootEl);
        if (newNodeName && newNodeName != null && newNodeName != "")
          nodeText = newNodeName;
        var anode = new Ext.tree.TreeNode({
              text : nodeText,
              type : nodeType,
              data : rootEl,
              iconCls : nodeType,
              qtipCfg : {
					text : "没有错误"
			  }
            });
        // 添加右键菜单
        var nodeMenu = genContextMenu(rootEl, true);
        anode.myContextMenu = nodeMenu;
        contextNode.appendChild(anode);

        setRelation(contextNode.attributes.data, rootEl);
        genTreeNode(rootEl, anode);
}

// 单击快捷菜单事件函数
function clickContextMenuHandler(item, e) {
	Ext.getCmp('mainPanel').body.mask("正在发送请求,请稍候...");
	var map = new Map();
	map.put("key", "formmake.createType");
	map.put("typeEn", item.typeEn);
	var query = new QueryObj(map, function(query) {
				Ext.getCmp('mainPanel').body.unmask();
				var msg = query.getDetail();
				var docObj = loadXMLString(msg);
				var rootEl = docObj.documentElement;
				setRelation(contextNode.attributes.data, rootEl);
				genItemNode(rootEl, contextNode);
			});
	query.send();
}

// 建立父子element对象之间的关系
function setRelation(pEle, cEle) {
	var nodeList = pEle.getElementsByTagName("Items");
	var itemsNode;
	if (nodeList.length == 0) {
		itemsNode = formtpl.dom.createElement("Items");
		pEle.appendChild(itemsNode);
	} else {
		itemsNode = nodeList[0];
	}
	itemsNode.appendChild(cEle);
}

// 创建指定节点下的子节点
// itemEl的标记名称为Item
function genItemNode(itemEl, parentNode) {
	if (itemEl.tagName != 'Item') {
		showTips("标记名称不是Item：" + itemEl.tagName);
		return;
	}

	var nodeName = itemEl.getAttribute("cn");
	var nodeType = itemEl.getAttribute("type");
	var newNodeName = getNameProp(itemEl);
	if (newNodeName && newNodeName != null && newNodeName != "")
		nodeName = newNodeName;
	var sonNode = parentNode.appendChild(new Ext.tree.TreeNode({
				text : nodeName,
				type : nodeType,
				data : itemEl,
				iconCls : nodeType,
				qtipCfg : {
					text : "没有错误"
				}
			}));

	// 添加右键菜单
	sonNode.myContextMenu = genContextMenu(itemEl, true);
	return sonNode;
}

function genTreeNode(parentEl, parentNode) {
	for (var i = 0; i < parentEl.childNodes.length; i++) {
		var subEl = parentEl.childNodes[i];
		if (subEl.nodeName == 'Items') {
			for (var j = 0; j < subEl.childNodes.length; j++) {
				var sonEl = subEl.childNodes[j];
				var sonNode = genItemNode(sonEl, parentNode);
				genTreeNode(sonEl, sonNode);
			}
		}
	}
}

function selNode(node) {
    contextNode = node;
    node.select();
	propsPanel.stopEditing();
	propsPanel.render();

	EditorObject.refreshData(node);
}

// 检查右键菜单，使能相应的菜单项
function checkContextMenu(node) {
	var itemList = node.myContextMenu.items; // 右键菜单项列表
	var groupObj = {};
	var minGroup = 0;
	itemList.each(function(item, index, length) {
				if (item.typeEn) {
					// 找到分组并加入
					var myGroup = groupObj[item.myGroup];
					if (!myGroup) {
						myGroup = {};
						myGroup.menuItems = new Array();
						groupObj[item.myGroup] = myGroup;
					}
					myGroup.menuItems.push(item);
					// 清空初始状态
					item.haveMyType = false;
					// 寻找是否有本类型的下级节点
					node.eachChild(function(innerNode) {
								if (innerNode.attributes.type == item.typeEn) {
									item.haveMyType = true;
									var intGroup = parseInt(item.myGroup);
									if (intGroup != 0) {
										if (minGroup == 0) {
											minGroup = intGroup;
										} else {
											minGroup = minGroup <= intGroup
													? minGroup
													: intGroup;
										}
									}
									return false;
								}
							});
				}
				if (item.id && item.id == "paste") {
					var bDisabled = true;
					var doc = null;
					if (window.clipboardData.getData("Text") != null)
						doc = loadXMLString(window.clipboardData
								.getData("Text"));
					var copyedNodeEl = null;
					if (doc != null)
						copyedNodeEl = doc.documentElement;
					if (copyedNodeEl != null) {
						var nodeEl = contextNode.attributes.data;
						var sChild = nodeEl.getAttribute("child");
						if (sChild && sChild.length > 0) {
							var aryChild = sChild.split(";");
							for (var i = 0; i < aryChild.length; i++) {
								var aryChildProp = aryChild[i].split(",");
								var childType = aryChildProp[0];
								if (copyedNodeEl.getAttribute("type") == childType) {
									bDisabled = false;
									break;
								}
							}
						}
					}
					item.setDisabled(bDisabled);
				}
			});

	for (var p in groupObj) {
		var mg = groupObj[p];
		var mgItems = mg.menuItems;
		if (p == "0") { // 0分组不和任何其他组冲突
			for (var i = 0; i < mgItems.length; i = i + 1) {
				if (mgItems[i].haveMyType && mgItems[i].isUnique == "true") {
					mgItems[i].setDisabled(true);
				} else {
					mgItems[i].setDisabled(false);
				}
			}
		} else {
			if (minGroup == 0) {
				for (var i = 0; i < mgItems.length; i = i + 1) {
					mgItems[i].setDisabled(false);
				}
			} else {
				if (p != (minGroup + "")) {
					for (var i = 0; i < mgItems.length; i = i + 1) {
						mgItems[i].setDisabled(true);
					}
				} else {
					for (var i = 0; i < mgItems.length; i = i + 1) {
						if (mgItems[i].haveMyType
								&& mgItems[i].isUnique == "true") {
							mgItems[i].setDisabled(true);
						} else {
							mgItems[i].setDisabled(false);
						}
					}
				}
			}
		}
	}
}

function dragoverHandler(e) {
	var t = e.target;
	var s = e.dropNode;
	var tEl = t.attributes.data;
	var itemtype = tEl.getAttribute("type");
	
	if (t.getOwnerTree() == s.getOwnerTree()) {
		
		// 目标节点的类型	
		var b = false;
		var itemchildren = tEl.getAttribute("child");
		if (itemchildren && itemchildren.length > 0) {
			var aryChild = itemchildren.split(";");
			for (var i = 0; i < aryChild.length; i++) {
				var aryChildProp = aryChild[i].split(",");
				var childType = aryChildProp[0];
				if (s.attributes.data.getAttribute("type") == childType) {
					b = true;
					break;
				}
			}
		}
	
		/*if (!s.parentNode || !t.parentNode || t.parentNode != s.parentNode)
			return false;
		if (e.point == "append")
			return false;*/
		if(t.parentNode == s.parentNode && e.point=="above")
			return true;
		else if(e.point=="append" && b)
			return true;
		else 
			return false;
	} else {
		if (t == e.tree.root){
			return false;
		}
		if (e.point == "append"
				&& (itemtype == "formArea" || itemtype == "listArea" || itemtype=="faBlankLayout")){
			return true;
		}else{
			return false;
		}
	}
}

// set el的所有属性中，名称为propname的属性值
function setPropValue(el, propname, value) {
	for (var i = 0; i < el.childNodes.length; i = i + 1) {
		var subEl = el.childNodes[i];
		if (subEl.nodeName == 'Properties') {
			for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
				var propEl = subEl.childNodes[j];
				var propnametmp = propEl.getAttribute("name");
				if (propnametmp == propname) {
					propEl.childNodes[0].text=value;
				}
			}
		}
	}
	return null;
}

// 得到el的所有属性中，名称为propname的属性值
function getPropValue(el, propname) {
	if(el.getAttribute("type")=="faBlankLayout" && propname=="ds"){
		el = el.parentNode.parentNode;
	}
	for (var i = 0; i < el.childNodes.length; i = i + 1) {
		var subEl = el.childNodes[i];
		if (subEl.nodeName == 'Properties') {
			for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
				var propEl = subEl.childNodes[j];
				var propnametmp = propEl.getAttribute("name");
				if (propnametmp == propname) {
					return propEl.childNodes[0].text;
				}
			}
		}
	}
	return null;
}

// 拖拽节点事件函数
function dragNodeHander(e) {
	var t = e.target;
	var s = e.dropNode;
	var tEl = t.attributes.data;
	var sEl = s.attributes.data;
	if (t.getOwnerTree() == s.getOwnerTree()) {
		var newEl = sEl.cloneNode(true);
		var parentEl = sEl.parentNode;
		if (e.point == "above")
			parentEl.insertBefore(newEl, tEl);
		//else if (tEl.nextSibling)
		//	parentEl.insertBefore(newEl, tEl.nextSibling);
		//else
		//	parentEl.appendChild(newEl);
		else if(e.point == "append"){
			var b = false;
			for (var i = 0; i < tEl.childNodes.length; i++) {
				var subEl = tEl.childNodes[i];
				if (subEl.nodeName == 'Items') {
					subEl.appendChild(newEl);
					b = true;
					break;
				}
			}
			if(!b){
				var newItemNode = formtpl.dom.createElement("Items");
				tEl.appendChild(newItemNode);
				newItemNode.appendChild(newEl);
			}
		}
		parentEl.removeChild(sEl);
		s.attributes.data = newEl;
		e.tree.fireEvent("click", s);
		return true;
	} else {
		var dictnode = {};
		dictnode.type = s.attributes.type;
		dictnode.id = s.attributes.cid;
		if (dictnode.type == "table")
			dictnode.tableid = dictnode.id;
		else
			dictnode.tableid = s.parentNode.attributes.cid;
		var itemtype = tEl.getAttribute("type");
		var map = new Map();
		map.put("key", "formmake.dragNode");
		map.put("type", dictnode.type);
		map.put("id", dictnode.id);
		map.put("formorlist", itemtype == "listArea" ? "list" : "form");
		map.put("tableid", dictnode.tableid);
		map.put("ds", getPropValue(tEl, "ds"));
		var query = new QueryObj(map, function(query) {
					var msg = query.getDetail();
					var docObj = loadXMLString(msg);
					var rootEl = docObj.documentElement;
					for (var i = 0; i < rootEl.childNodes.length; i++) {
						var itemEl = rootEl.childNodes[i].cloneNode(true);
						setRelation(t.attributes.data, itemEl);
						genItemNode(itemEl, t);
						t.expand(false, false);
					}
				});
		query.send();

		return false;
	}
}