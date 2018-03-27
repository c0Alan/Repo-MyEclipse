Ext.ns("AtyCon");

// 报表布局树
var reportTree;
// 快捷菜单节点
var contextNode;
// 属性对话框
var propsPanel;
// 属性编辑器
var propEditor;

// 初始化报表树
function initReportTree() {
	reportTree = new Ext.tree.TreePanel({
				region : 'west',
				animate : false,
				margins : '4 0 4 4',
				width : 300,
				split : true,
				minSize : 175,
				maxSize : 400,
				enableDD : true,
				border : true,
				containerScroll : true,
				autoScroll : true
			});

	// 注册单击事件函数
	reportTree.on("click", selNode);

	// 注册拖拽事件
	reportTree.on("beforenodedrop", dragNodeHander);
	reportTree.on("nodedragover", dragoverHandler);

	reportTree.on("contextmenu", function(node, e) {
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
	var rootNode = new Ext.tree.TreeNode({
				text : nodeText,
				type : nodeType,
				data : rootEl,
				iconCls : nodeType
			});
	reportTree.setRootNode(rootNode);

	// 添加右键菜单
	rootNode.myContextMenu = genContextMenu(rootEl, false);
	genTreeNode(rootEl, rootNode);
	return reportTree;
}

// 递归的生成树节点
function genTreeNode(parentEl, parentNode) {
	for (var i = 0; i < parentEl.childNodes.length; i = i + 1) {
		var subEl = parentEl.childNodes[i];
		if (subEl.nodeName == 'Items') {
			for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
				var sonEl = subEl.childNodes[j];
				var sonNode = genItemNode(sonEl, parentNode);
				genTreeNode(sonEl, sonNode);
			}
		}
	}
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

// 初始化布局
function initLayout() {
	propEditor = new AtyCon.PropEditor();
	propsPanel = propEditor.init({
		region: "center",
		margins : '4 4 4 0',
		editorTips: sqlTips
	});
	initReportTree();
	var mainPanel = new Ext.Panel({
				id : "mainPanel",
				layout : 'border',
				border : false,
				items : [propsPanel, reportTree],
				tbar : [{
							id : "button_save",
							text : "保存",
							cls : 'x-btn-text-icon save',
							handler : saveTpl
						}, {
							text : "预览",
							cls : 'x-btn-text-icon preview',
							handler : previewForm
						},'-','->','注意："报表条件区域"中增加条件时，条件的标识属性的格式为<span style="color:red;">conNumber</span>，如<span style="color:red;">con1</span>']
			});
	new Ext.Viewport({
				layout : 'fit',
				border : false,
				hideBorders : true,
				items : [mainPanel]
			});
	initLogicTplWindow();
}

// 预览表单
function previewForm() {
	winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
	winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + formtpl.id;
	winObj.focus();
}

// 生成右键菜单
function genContextMenu(el, needDel) {
	var nodeMenu = new Ext.menu.Menu();
	var sChild = el.getAttribute("child");
	if (sChild && sChild.length > 0) {
		var arrayChild = sChild.split(";");
		for (var k = 0; k < arrayChild.length; k = k + 1) {
			var childMenu = arrayChild[k].split(",");
			nodeMenu.add({
						text : '新建[' + childMenu[1] + ']',
						iconCls : childMenu[0] + 'New',
						myGroup : childMenu[2],
						isUnique : childMenu[3],
						typeEn : childMenu[0],
						typeCn : childMenu[1],
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
		if (sChild && sChild.length > 0) {
			nodeMenu.add("-");
		}
		nodeMenu.add({
					text : '删除' + el.getAttribute("cn"),
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
		if (!needDel) {
			nodeMenu.add("-");
		}
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
	window.clipboardData.setData("Text", contextNode.attributes.data.xml);
}

function pasteHandler() {
	var map = new Map();
	map.put("key", "formmake.paste");
	map.put("xml", window.clipboardData.getData("Text"));
	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
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
			});
	query.send();
}

/**
 * 设置Item节点属性
 */
function setNodeAttr(itemEle,name,val){
	for(var i=0; i<itemEle.childNodes.length; i++){
		var subEl = itemEle.childNodes[i];
		if (subEl.nodeName == 'Properties') {
			for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
				var propEl = subEl.childNodes[j];
				var propname = propEl.getAttribute("name");
				if(propname==name){
					propEl.childNodes[0].text = val;
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * 获得Item节点属性
 */
function getNodeAttr(itemEle,name){
	for(var i=0; i<itemEle.childNodes.length; i++){
		var subEl = itemEle.childNodes[i];
		if (subEl.nodeName == 'Properties') {
			for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
				var propEl = subEl.childNodes[j];
				var propname = propEl.getAttribute("name");
				if(propname==name){
					return propEl.childNodes[0].text
				}
			}
		}
	}
	return null;
}

/**
 * 改变创建节点的id
 */
function changeItemId(pele,ele){
	var ptype = pele.getAttribute("name");
	if(ptype="rptCondition"){
		var conNum = 1;
		for(var i=0;i<pele.childNodes.length; i++){
			var subEl = pele.childNodes[i];
			if (subEl.nodeName == 'Items') {
				for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
					var subItem = subEl.childNodes[j];
					var subId = getNodeAttr(subItem,"id");
					if(subId.substr(0,3)=='con'){
						var sn = subId.substr(3);
						sn = parseInt(sn,10);
						if(typeof sn == 'number' && sn>=conNum){
							conNum=sn+1;
						}
					}
				}
			}
		}
		setNodeAttr(ele,"id","con"+conNum);
	}
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
		changeItemId(contextNode.attributes.data, rootEl);
		setRelation(contextNode.attributes.data, rootEl);
		genItemNode(rootEl, contextNode);
	});
	query.send();
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
	if (newNodeName && newNodeName != "") {
		nodeName = newNodeName;
	}
	var sonNode = new Ext.tree.TreeNode({
				text : nodeName,
				type : nodeType,
				data : itemEl,
				iconCls : nodeType
			});
	parentNode.appendChild(sonNode);

	// 添加右键菜单
	sonNode.myContextMenu = genContextMenu(itemEl, true);
	return sonNode;
}

// 单击节点事件函数
function selNode(node) {
	contextNode = node;
    node.select();
	propsPanel.stopEditing();
	propEditor.refreshData(node);
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

// 拖拽节点事件函数
function dragNodeHander(e) {
	var t = e.target;
	var s = e.dropNode;

	if (t.getOwnerTree() != s.getOwnerTree()) {
		return false;
	}

	var tEl = t.attributes.data;
	var sEl = s.attributes.data;
	var newEl = sEl.parentNode.removeChild(sEl);
	if (e.point == "above") {
		tEl.parentNode.insertBefore(newEl, tEl);
	} else if (e.point == "below") {
		if (tEl.nextSibling) {
			tEl.parentNode.insertBefore(newEl, tEl.nextSibling);
		} else {
			tEl.parentNode.appendChild(newEl);
		}
	} else if (e.point == "append") {
		setRelation(tEl, newEl);
	}
	e.tree.fireEvent("click", s);
	return true;
}

// 检查是否可以移动
// t -- 目标节点
// s -- 要移动的节点
function checkDrag(t, s) {
	var nodeMenu = t.myContextMenu;
	if (!nodeMenu) {
		return false;
	}

	var result = false;
	nodeMenu.items.each(function(item, index, length) {
				if (item.typeEn && item.typeEn == s.attributes.type) {
					result = true;
					return false;
				}
			});
	return result;
}

// 判断是否可以放下节点
function dragoverHandler(e) {
	var t = e.target;
	var s = e.dropNode;

	if (t.getOwnerTree() != s.getOwnerTree()) {
		return false;
	}

	if (!s.parentNode || !t.parentNode) {
		return false;
	}

	if (t == s.parentNode) {
		return false;
	}

	if (e.point == "append") {
		return checkDrag(t, s);
	} else {
		return checkDrag(t.parentNode, s);
	}
}

// 保存report模板
function saveTpl() {
	Ext.getCmp('mainPanel').body.mask("正在发送请求,请稍候...");
	var map = new Map();
	map.put("key", "reportmake.saveTpl");
	map.put("id", formtpl.id);
	map.put("complibId", formtpl.complibId);
	map.put("layoutTemplate", formtpl.dom.xml);
	var query = new QueryObj(map, function(query) {
				Ext.getCmp('mainPanel').body.unmask();
				var msg = query.getDetail();
				if (msg == "ok") {
					showTips("报表布局保存成功", 2);
				} else {
					showTips("报表布局保存失败，请查看系统日志", 4);
				}
			});
	query.send();
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
						// 删除xml中的节点
						var element = contextNode.attributes.data;
						for (var i = 0; i < element.childNodes.length; i++) {
							var subEl = element.childNodes[i];
							if (subEl.nodeName == 'Items') {
								element.removeChild(subEl);
								break;
							}
						}
						// 删除ext tree中的节点
						while (contextNode.firstChild) {
							contextNode.removeChild(contextNode.firstChild);
						}
					}
				}
			});
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

function getNameProp(typeEl) {
	var nodeNameProp = typeEl.getAttribute("nameprop");
	if (nodeNameProp == null || !nodeNameProp) {
		return null;
	}

	var props = typeEl.childNodes;
	var proplist;
	for (var i = 0; i < props.length; i++) {
		if (props[i].nodeName == "Properties") {
			proplist = props[i];
			break;
		}
	}

	if (proplist == null) {
		return null;
	}

	for (var i = 0; i < proplist.childNodes.length; i++) {
		var element = proplist.childNodes[i];
		if (element.getAttribute("name") == nodeNameProp) {
			return element.childNodes[0].text;
		}
	}
	return null;
}

// 删除节点
function delNode(item, e) {
    if(contextNode == reportTree.root)
      return;
    var nextNode = contextNode.nextSibling;
    if(nextNode == null )
      nextNode = reportTree.root;
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
						parentNode.removeChild(contextNode);
						selNode(nextNode);
					}
				}
			});
}