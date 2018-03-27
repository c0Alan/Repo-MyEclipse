// 数据字典树
var dictTree;
// 表单模板树
var formTree;
// 配置相关表对话框
var cfgTblDialog;
// 属性对话框
var propsPanel;

function saveTpl() {
	Ext.getCmp('mainPanel').body.mask("正在发送请求,请稍候...");
	var map = new Map();
	map.put("key", "formmake.savetpl");
	map.put("formid", formtpl.id);
	map.put("template", formtpl.dom.xml);
	var query = new QueryObj(map, function(query) {
				Ext.getCmp('mainPanel').body.unmask();
				var msg = query.getDetail();
				if (msg == "ok") {
					showTips("保存form表单模板成功", 2);
				} else {
					showTips("未知错误：保存form表单模板失败", 4);
				}
			});
	query.send();
}

function refreshHandler() {
	var map = new Map();
	map.put("key", "formmake.refresh");
	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
				if (msg == "ok") {
					showTips("刷新form表单缓存成功", 2);
				} else {
					showTips("未知错误：刷新form表单缓存失败", 4);
				}
			});
	query.send();
}

// 预览表单
function previewForm(runTimeType) {
	win = Artery.open({
				name : 'previewWin',
				feature : {
					status : 'yes',
					location : 'yes'
				}
			});
	var url = sys.getContextPath()
			+ '/artery/form/dealParse.do?action=previewForm&formid=' + formtpl.id;
	if (runTimeType) {
		url += "&runTimeType=" + runTimeType;
	}
	win.location.href = url;
	win.focus();
}

//递归进行校验
// 检查一个节点的子节点是否满足要求
function checkNodeRule(node, countObj) {
	var itemList = node.myContextMenu.items; // 右键菜单项列表
	var groupObj = {};
	var itemMap = {};
	var errorArray = [];
	// 标识唯一性
	var nodeEl= node.attributes.data;
	var nodeprop={};
	nodeprop.sid=nodeEl.getAttribute("sid");
	nodeprop.id=getPropValue(nodeEl,"id");
	if(nodeprop.id==null || nodeprop.id=="")
		nodeprop.id=nodeprop.sid;
	nodeprop.node=node;
	for(var i=0;i<countObj.listNode.length;i++){
		var nodeprop1 = countObj.listNode[i];
		if(nodeprop1.id==nodeprop.id){
			countObj.errorNumber++;
			// 输出错误
			var errmsg="本控件标识和其他控件有重复";
			errorArray.push(errmsg);
			var oldtips=nodeprop1.node.attributes.qtipCfg.text;
			if(oldtips!="没有错误")
				nodeprop1.node.attributes.qtipCfg.text += "<br/>"+errmsg; 
			else
				nodeprop1.node.attributes.qtipCfg.text = errmsg;
			index = nodeprop1.node.text.indexOf("<font color=red>*</font>");
			if (index == -1) {
				nodeprop1.node.setText(nodeprop1.node.text + "<font color=red>*</font>");
			}
		}
	}
	countObj.listNode.push(nodeprop);
	
	// 分组信息
	itemList.each(function(item, index, length) {
				if (item.typeEn) {
					var itemObj = {};
					itemObj.typeEn = item.typeEn;
					itemObj.typeCn = item.typeCn;
					itemObj.isUnique = item.isUnique;
					itemObj.myGroup = item.myGroup;
					itemObj.number = 0;

					// 找到分组并加入
					var myGroup = groupObj[item.myGroup];
					if (!myGroup) {
						myGroup = new Array();
						myGroup.haveNode = 0;
						groupObj[item.myGroup] = myGroup;
					}
					myGroup.push(itemObj);
					itemMap[item.typeEn] = itemObj;
				}
			});
	// 计算个数
	var haveChild = false;
	node.eachChild(function(innerNode) {
				if (innerNode.attributes.type) {
					var itemObj = itemMap[innerNode.attributes.type];
					if (itemObj) {
						itemObj.number++;
					}
					haveChild = true;
				}
			});
	// 唯一性错误
	for (var p in itemMap) {
		var itemObj = itemMap[p];
		if (itemObj.isUnique == "true" && itemObj.number > 1) {
			errorArray.push("《"+itemObj.typeCn + "》 多于一个");
		}
		// 计算group信息
		if (itemObj.myGroup != "0") {
			if (itemObj.number > 0) {
				groupObj[itemObj.myGroup].haveNode = 1;
			}
		}
	}
	// 互斥性错误
	var huchiArray = [];
	for (var p in groupObj) {
		if (p != "0" && groupObj[p].haveNode == 1) {
			var tempArray = [];
			for (var i = 0; i < groupObj[p].length; i++) {
				tempArray.push(groupObj[p][i].typeCn);
			}
			huchiArray.push("(" + tempArray.join("&nbsp;&nbsp;") + ")");
		}
	}
	if (huchiArray.length > 1) {
		var huchiMsg = huchiArray.join("&nbsp;或&nbsp;");
		errorArray.push(huchiMsg);
	}

	// 输出错误
	if (errorArray.length > 0) {
		var errorMsg = errorArray.join("<br>");
		node.attributes.qtipCfg.text = errorMsg;
		var index = node.text.indexOf("<font color=red>*</font>");
		if (index == -1) {
			node.setText(node.text + "<font color=red>*</font>");
		}
		countObj.errorNumber++;
		node.expand();
	} else {
		node.attributes.qtipCfg.text = "没有错误";
		var index = node.text.indexOf("<font color=red>*</font>");
		if (index != -1) {
			node.setText(node.text.substring(0, index));
		}
	}

	// 检查子节点
	node.eachChild(function(innerNode) {
				checkNodeRule(innerNode, countObj);
			});
}

function initLayout() {
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				layout : 'border',
				items : [{
							region : 'center',
							border : false,
							layout : 'border',
							items : [dictTree, {
										region : 'center',
										margins : '4 4 4 0',
										layout : 'border',
										border : false,
										items : [formTree, propsPanel]
									}]
						}],
				tbar : [{
							id : 'toolbar_save',
							text : '保存',
							tooltip : '保存模板，并更新缓存<br/>HotKey:Ctrl+S',
							iconCls : 'save',
							handler : saveTpl
						}, '-', {
							id : 'toolbar_cfgtbl',
							text : '相关表',
							tooltip : '配置本表单用到的数据库表<br/>数据字典树中将只显示这些相关表',
							iconCls : 'cfgtbl',
							handler : configTable
						},{
							id : 'toolbar_valid',
							text : '校验',
							tooltip : '验证表单模板的规范性，<br/>（1）判断对象标识是否重复<br/>（2）判断对象唯一性',
							cls : 'x-btn-text-icon validate',
							handler : function(){
								  var root = formTree.root;
								  var countObj = {
								    errorNumber : 0,
								    listNode : []
								  };
								  checkNodeRule(root, countObj);
								  if (countObj.errorNumber > 0) {
								    showTips("验证发现错误，节点数："
								            + countObj.errorNumber, 4);
								  } else {
								    showTips("验证通过", 3);
								  }
							}
						}, {
							tooltip : '预览插入表单效果',
							cls : 'x-btn-text-icon preview-i',
							handler : function() {
								previewForm("insert");
							}
						},{
							tooltip : '预览更新表单效果',
							cls : 'x-btn-text-icon preview-u',
							handler : function() {
								previewForm("update");
							}
						}, {
							tooltip : '预览展示表单（只读）效果',
							cls : 'x-btn-text-icon preview-d',
							handler : function() {
								previewForm("display");
							}
						}, {
							tooltip : '预览打印表单效果',
							cls : 'x-btn-text-icon preview-p',
							handler : function() {
								previewForm("print");
							}
						}]
			});

	new Ext.Viewport({
				layout : 'fit',
				border : false,
				hideBorders : true,
				items : [mainPanel]
			});
}

var cfgLeftTree;
var cfgRightTree;

function initCfgTbl() {
	var txtFind = new Ext.form.TextField({
				emptyText : '表名过滤',
				value : '',
				triggerClass : "x-form-search-trigger",
				enableKeyEvents : true,
				width : 280
			});

	cfgLeftTree = new Ext.tree.TreePanel({
				region : 'west',
				animate : false,
				margins : '4 4 4 4',
				border : true,
				width : 280,
				autoScroll : true,
				loader : new Ext.tree.TreeLoader({
							dataUrl : 'formmake.do?action=loadCfgLeftTree'
						}),
				root : new Ext.tree.AsyncTreeNode({
							text : '表定义',
							leaf : false,
							draggable : false,
							cid : '',
							iconCls : 'dictroot'
						}),
				rootVisible : false,
				lines : false,
				tbar : [txtFind]
			});

	// 实现表过滤功能
	var userTableFilter = new Ext.tree.TreeFilter(cfgLeftTree, {
				autoClear : true
			});
	// 加载节点时,传输其他参数
	cfgLeftTree.getLoader().on("beforeload", function(treeLoader, node) {
				this.baseParams.filter = txtFind.getValue();
			});
	cfgLeftTree.on("click", function(node) {
				cfgTblDialog.ud.leftSelNode = node;
			});

	txtFind.on("keyup", function(cmp) {
				var fs = cmp.getValue();
				if (fs == null || fs.length == 0) {
					userTableFilter.clear();
				} else {
					try {
						var r = new RegExp(fs, "i");
						userTableFilter.filter(r);
					} catch (e) {
						userTableFilter.filter(fs);
					}
				}
			});

	cfgRightTree = new Ext.tree.TreePanel({
				region : 'east',
				animate : false,
				margins : '4 4 4 4',
				border : true,
				width : 200,
				autoScroll : true,
				loader : new Ext.tree.TreeLoader({
							dataUrl : 'formmake.do?action=loadCfgRightTree'
						}),
				root : new Ext.tree.AsyncTreeNode({
							text : '表定义',
							leaf : false,
							draggable : false,
							cid : ''
						}),
				rootVisible : false,
				lines : false
			});

	// 加载节点时,传输其他参数
	cfgRightTree.getLoader().on("beforeload", function(treeLoader, node) {
				this.baseParams.formid = formtpl.id;
			});
	cfgRightTree.on("click", function(node) {
				cfgTblDialog.ud.rightSelNode = node;
			});
}

var btnAdd;
var btnDel;

function initCfgButton() {
	// 创建中间的button
	btnAdd = new Ext.Button({
				text : '>>',
				renderTo : 'center_addButton',
				handler : function() {
					if (!cfgTblDialog.ud.leftSelNode)
						return;

					var rightTreeRoot = cfgRightTree.getRootNode();
					// 如果节点已经加入到右边的树了，则返回
					var eenode = rightTreeRoot.findChild('cid',
							cfgTblDialog.ud.leftSelNode.attributes.cid);
					if (eenode)
						return;
					// 插入node到右边树
					rightTreeRoot.appendChild(new Ext.tree.TreeNode({
								text : cfgTblDialog.ud.leftSelNode.text,
								cid : cfgTblDialog.ud.leftSelNode.attributes.cid,
								iconCls : 'dicttable',
								leaf : true
							}));
				}
			});
	btnDel = new Ext.Button({
				text : '<<',
				renderTo : 'center_deleteButton',
				handler : function() {
					if (!cfgTblDialog.ud.rightSelNode)
						return;

					var rightTreeRoot = cfgRightTree.getRootNode();
					rightTreeRoot.removeChild(cfgTblDialog.ud.rightSelNode);
				}
			});
}

function configTable() {
	if (cfgTblDialog) {
		if (!cfgTblDialog.isVisible()) {
			cfgTblDialog.show();
		}
		return;
	}

	initCfgTbl();
	initCfgButton();

	cfgTblDialog = new Ext.Window({
				title : '配置相关表',
				width : 560,
				height : 330,
				resizable : false,
				closeAction : 'hide',
				modal : true,
				closable : false,
				layout : 'fit',
				plain : false,
				border : false,
				items : [{
							layout : 'border',
							border : false,
							items : [cfgLeftTree, {
										region : 'center',
										border : false,
										bodyStyle : 'background:#dfe8f6',
										contentEl : 'cfgWindow_center'
									}, cfgRightTree]
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								var rightRootNode = cfgRightTree.root;
								var rightNodes = "";
								rightRootNode.eachChild(function(node) {
											rightNodes = rightNodes + node.text
													+ ",";
										});
								// 如果没有选中表，则什么也不做
								// if (rightNodes == "") {
								// return;
								// }
								var map = new Map();
								map.put("key", "formmake.savecfgtbl");
								map.put("formid", formtpl.id);
								map.put("cfgtables", rightNodes);
								var query = new QueryObj(map, function(query) {
											var msg = query.getDetail();
											var msgTips = "";
											if (msg == "ok") {
												dictTree.root.reload();
												cfgTblDialog.hide();
											}
										});
								query.send();
							}
						}, {
							text : '取消',
							handler : function() {
								cfgTblDialog.setVisible(false);
							}
						}]
			});

	cfgTblDialog.on("show", function() {
				cfgLeftTree.getRootNode().reload()
				cfgRightTree.getRootNode().reload()
			})

	cfgTblDialog.show();
	cfgTblDialog.ud = {}; // 用户数据区
}
