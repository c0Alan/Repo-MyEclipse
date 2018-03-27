// writ布局树
var writTree;
// 属性对话框
var propsPanel;
// 快捷菜单节点
var contextNode;

function saveLayout() {
	Ext.getCmp('mainPanel').body.mask("正在发送请求,请稍候...");
	var map = new Map();
	map.put("key", "writmake.savelayout");
	map.put("writtplid", formtpl.id);
	map.put("complibId", formtpl.complibId);
	map.put("layout", formtpl.dom.xml);
	var query = new QueryObj(map, function(query) {
				Ext.getCmp('mainPanel').body.unmask();
				var msg = query.getDetail();
				if (msg == "ok") {
					showTips("保存文书表单布局成功", 2);
				} else {
					showTips("未知错误：保存文书表单布局失败", 4);
				}
			});
	query.send();
}

function refreshHandler() {
	var map = new Map();
	map.put("key", "writmake.refresh");
	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
				if (msg == "ok") {
					showTips("刷新文书表单缓存成功", 2);
				} else {
					showTips("未知错误：刷新文书表单缓存失败", 4);
				}
			});
	query.send();
}

// 预览表单
function previewWrit(runTimeType) {
	var url = sys.getContextPath()
			+ '/artery/writparse.do?action=previewWrit&runtype=insert&writtplid='
			+ formtpl.id;
	if (runTimeType) {
		url += "&runTimeType=" + runTimeType;
	}
	var winObj = window.open(url, "previewWin");
	winObj.focus();
}

function initLayout() {
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				layout : 'border',
				items : [{
							region : 'center',
							border : false,
							margins : '4 4 4 4',
							layout : 'border',
							items : [writTree, propsPanel]
						}],
				tbar : [{
							id : 'toolbar_save',
							text : '保存',
							tooltip : '保存布局，并更新缓存<br/>HotKey:Ctrl+S',
							cls : 'x-btn-text-icon save',
							handler : saveLayout
						}, '->', {
							tooltip : '预览编辑文书，必需有参数：writid',
							cls : 'x-btn-text-icon preview-u',
							handler : function() {
								previewWrit("update");
							}
						}, {
							tooltip : '预览文书效果',              
							cls : 'x-btn-text-icon preview-i',
							handler : function() {
								previewWrit("insert");
							}
						}]
			});

	new Ext.Viewport({
				layout : 'fit',
				border : false,
				hideBorders : true,
				items : [mainPanel]
			});
	initLogicTplWindow();
}

	/**
	 * 初始化逻辑类模板窗口
	 */
	function initLogicTplWindow() {
		logicTplPanel = new CodePanel({
			language : "java"
		});
		logicTplWindow = new Ext.Window({
			title : '逻辑类模板',
			width : 700,
			height : 450,
			shadow:false,
			resizable : true,
			border : false,
			closeAction : 'hide',
			modal : true,
			layout : 'fit',
			plain : true,
			buttonAlign : 'right',
			items : [logicTplPanel],
			buttons : [{
				text : '取消',
				handler : function() {
					logicTplWindow.setVisible(false);
				}
			}]
		});
	}

function initWritTree() {
	writTree = new Ext.tree.TreePanel({
				region : 'west',
				animate : false,
				id : 'writtpl',
				width : 380,
				split : true,
				minSize : 175,
				maxSize : 500,
				title : '文书布局',
				header : true,
				border : true,
				enableDD : true,
				containerScroll : true,
				autoScroll : true
			});

	writTree.on("click", selNode);
	// 注册拖拽事件
	writTree.on("beforenodedrop", dragNodeHander);
	writTree.on("nodedragover", dragoverHandler);
	writTree.on("contextmenu", function(node, e) {
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
	var rootNode = writTree.setRootNode(new Ext.tree.TreeNode({
				text : nodeText,
				type : nodeType,
				data : rootEl,
				isLeaf : true,
				iconCls : nodeType
			}));
	// 添加右键菜单
	var nodeMenu = genContextMenu(rootEl, false);
	rootNode.myContextMenu = nodeMenu;
	genTreeNode(rootEl, rootNode);
}

function getNameProp(typeEl) {
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
		if (element.getAttribute("name") == nodeNameProp) {
			return element.childNodes[0].text;
		}
	}

	return null;
}

function genContextMenu(el, needDel) {
	// 添加右键菜单
	var nodeMenu = new Ext.menu.Menu();

	var sChild = el.getAttribute("child");
	if (sChild && sChild.length > 0) {
		var arrayChild = sChild.split(";");
		for (var k = 0; k < arrayChild.length; k++) {
			var childMenu = arrayChild[k].split(",");
			nodeMenu.add({
						text : '新建[' + childMenu[1] + ']',
						iconCls : childMenu[0] + 'New',
						myGroup : childMenu[2],
						isUnique : childMenu[3],
						typeEn : childMenu[0],
						handler : clickContextMenuHandler
					});
		}
	}
			//脚本模板
		if (sChild && sChild.length > 0) {
			nodeMenu.add("-");
		}
		nodeMenu.add({
			text : '逻辑类模板',
			handler : genLogicTpl
		});
		
	if (needDel) {
		nodeMenu.add('-');
		nodeMenu.add({
					text : '删除' + el.getAttribute("cn")+"[HotKey:Delete]",
					iconCls : 'del',
					handler : delNode
				});
		nodeMenu.add({
					text : '复制',
					iconCls : 'copy',
					handler : copyHandler
				});
	}
	if (sChild && sChild.length > 0) {
		nodeMenu.add({
					id : 'paste',
					text : '粘贴',
					iconCls : 'paste',
					handler : pasteHandler
				});
		nodeMenu.add({
					text : '清除所有子节点',
					iconCls : 'clear',
					handler : clearNode
				});
	}
	return nodeMenu;
}
	// 生成逻辑类模板	
	function genLogicTpl(){
		var map = new Map();
		map.put("key", "formmake.genLogicTpl");
		map.put("type",contextNode.attributes.type);
		map.put("itemid",getPropValue(contextNode.attributes.data,"id"));
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			logicTplPanel.setCode(msg);
			logicTplWindow.show();
		});
		query.send();
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
// 复制节点
function copyHandler(item, e) {
    var el = contextNode.attributes.data;
    el.setAttribute("formid",formtpl.id);
    el.setAttribute("complibId",formtpl.complibId);
    window.clipboardData.setData("Text", el.xml);
}

function pasteHandler() {
    var strContent = window.clipboardData.getData("Text");
    var domContent = loadXMLString(strContent);
    if(formtpl.id != domContent.documentElement.getAttribute("formid")
    	&& formtpl.complibId != domContent.documentElement.getAttribute("complibId")){
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

function doPaste(msg){
        var docObj = loadXMLString(msg);
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
              iconCls : nodeType
            });
        // 添加右键菜单
        var nodeMenu = genContextMenu(rootEl, true);
        anode.myContextMenu = nodeMenu;
        contextNode.appendChild(anode);

        setRelation(contextNode.attributes.data, rootEl);
        genTreeNode(rootEl, anode);
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
    if(contextNode == writTree.root)
      return;
    var nextNode = contextNode.nextSibling;
    if(nextNode == null )
      nextNode = writTree.root;
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

// 单击快捷菜单事件函数
function clickContextMenuHandler(item, e) {
	Ext.getCmp('mainPanel').body.mask("正在发送请求,请稍候...");
	var map = new Map();
	map.put("key", "writmake.createType");
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
				iconCls : nodeType
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
	if (!s.parentNode || !t.parentNode || t.parentNode != s.parentNode)
		return false;
	if (e.point == "append")
		return false;
}

// 得到el的所有属性中，名称为propname的属性值
function getPropValue(el, propname) {
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
	var newEl = sEl.cloneNode(true);
	var parentEl = sEl.parentNode;
	if (e.point == "above")
		parentEl.insertBefore(newEl, tEl);
	else if (tEl.nextSibling)
		parentEl.insertBefore(newEl, tEl.nextSibling);
	else
		parentEl.appendChild(newEl);
	parentEl.removeChild(sEl);
	s.attributes.data = newEl;
	e.tree.fireEvent("click", s);
	return true;
}