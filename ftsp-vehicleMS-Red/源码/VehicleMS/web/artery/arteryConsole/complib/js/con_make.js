/**
 * form表单制作 布局界面
 */
AtyCon.Form_Layout = function(){
	
	var formtpl;		// 表单配置信息
	
	var dictTree;		// 相关表
	var dictFind;		// 相关表过滤
	
	var formTree;		// 表单模板树
	var selectedNode;   // 当前选中的表单
	var contextNode;	// 快捷菜单节点
	var sqlCodePanel;	// sql显示面版
	var sqlWindow;		// sql显示窗口
	var layoutPanel;
	var toolbar_save;	// 保存按钮
	var toolbar_cfgtbl;	// 相关表按钮
	var toolbar_valid;	// 校验按钮
	var toolbar_rel;	// 查看关联表单
	
	var propsPanel;		// 属性编辑grid
	var propEditor;		// 属性编辑对象
	
	var cfgTblDialog;	// 配置相关表对话框
	var cfgLeftTree;
	var cfgRightTree;
	var btnAdd;
	var btnDel;
	
	var infoTip;//组件提示信息
	var deferId;
	var tpl;//组件提示模板
	
	/**
	 * 树节点相关Menu的缓存，针对每种类型的组件，只创建一个Menu
	 */
	var menuCache;
	
	/**
	 * 记录此组件是否修改过
	 */
	var isModifyed = false;
	
	var currentState = "normal";//当前表单制作状态,默认为normal
	
	var showUnshowConfig;//是否显示不生成的控件
	
	/**
	 * 初始化相关表中的树
	 */
	function initCfgTree() {
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
			this.baseParams.complibId = formtpl.complibId;
		});
		cfgRightTree.on("click", function(node) {
			cfgTblDialog.ud.rightSelNode = node;
		});
	}
	
	/**
	 * 初始化相关表中的button
	 */
	function initCfgButton() {
		// 创建中间的button
		btnAdd = new Ext.Button({
			text : '>>',
			renderTo : 'center_addButton',
			handler : function() {
				if (!cfgTblDialog.ud.leftSelNode){
					return;
				}
				var leftSelNode = cfgTblDialog.ud.leftSelNode;
				var rightTreeRoot = cfgRightTree.getRootNode();
				// 如果节点已经加入到右边的树了，则返回
				var eenode = rightTreeRoot.findChild('cid',leftSelNode.attributes.cid);
				if (eenode){
					return;
				}
				// 插入node到右边树
				rightTreeRoot.appendChild(new Ext.tree.TreeNode({
					text : leftSelNode.text,
					cid : leftSelNode.attributes.cid,
					iconCls : 'dicttable',
					dict_key: leftSelNode.attributes.dict_key,
					dict_table: leftSelNode.attributes.dict_table,
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
	
	/**
	 * 初始化相关表窗口
	 */
	function initCfgTable() {
		initCfgTree();
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
					var rightNodes = [];
					rightRootNode.eachChild(function(node) {
						rightNodes.push({
							dict_key: node.attributes.dict_key,
							dict_table: node.attributes.dict_table
						});
					});
					var map = new Map();
					map.put("key", "formmake.savecfgtbl");
					map.put("formid", formtpl.id);
					map.put("complibId", formtpl.complibId);
					map.put("cfgtables", Ext.encode(rightNodes));
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
		cfgTblDialog.ud = {}; // 用户数据区
	}
	
	/**
	 * 初始化sql窗口
	 */
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
	
	/**
	 * 初始化数据字典 相关表
	 */
	function initDictTree() {
		dictFind = new Ext.form.TriggerField({
			emptyText : '字段过滤',
			triggerClass : "x-form-search-trigger",
			width : 220
		});
		dictFind.onTriggerClick = function() {
			dictTree.root.reload();
		};
		
		dictTree = new Ext.tree.TreePanel({
			region : 'west',
			animate : false,
			margins : '4 0 4 4',
			border : true,
			width : 220,
			split : true,
			minSize : 175,
			maxSize : 400,
			collapsible : true,
			hideCollapseTool : true,
			containerScroll : true,
			autoScroll : true,
			enableDD : true,
			collapseMode : 'mini',
			loader : new Ext.tree.TreeLoader({
				dataUrl : 'formmake.do?action=loadDictTree'
			}),
			root : new Ext.tree.AsyncTreeNode({
				text : '相关表',
				leaf : false,
				draggable : false,
				cid : '',
				iconCls : 'dictroot',
				type : 'root'
			}),
			tbar : [dictFind]
		});
		
		dictTree.getLoader().on("beforeload", function(treeLoader, node) {
			this.baseParams.formid = formtpl.id;
			this.baseParams.complibId = formtpl.complibId;
			this.baseParams.type = node.attributes.type;
			this.baseParams.cid = node.attributes.cid;
			this.baseParams.filter = dictFind.getValue();
		});
		dictTree.on("beforenodedrop", function(e) {
			if(currentState != "normal"){
				return false;
			}
			return true;
		});
		dictTree.on("nodedragover", function(e) {
			return false
		});
	}
	
	/**
	 * 单击节点事件函数
	 */
	function selNode(node) {
		selectedNode = node;
    	contextNode = node;
    	node.select();
		propsPanel.stopEditing();
		propEditor.propType = "common";
		/*
		var stateItemsEl = getCreateStateItemsEl(currentState);
		var nodeEl= node.attributes.data;
		var type = nodeEl.getAttribute("type");
		var stateNodeEl = getCreateSingleStateIemEl(currentState, nodeEl.getAttribute("sid"), type, stateItemsEl);
		propEditor.refreshData(node, currentState, stateNodeEl);
		*/
		propEditor.refreshData(node, currentState);
		propEditor.commonButton.toggle(true);
	}
	
	/**
	 * 初始化表单模板树
	 */
	function initFormTree() {
		formTree = new Ext.tree.TreePanel({
			region : 'west',
			animate : false,
			//id : 'formtpl',
			width : 260,
			split : true,
			minSize : 175,
			maxSize : 400,
			title : '表单模板',
			bodyCfg: {
        		cls: 'x-panel-body-clean'
    		},
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
		//var formLayout = this;
		formTree.on("contextmenu", function(node, e) {
			contextNode = node;
			//如果是IUDP状态视图，就不弹出右键菜单
			if(currentState != "normal") {
				return ;
			}
			if (node.myContextMenu) {
				checkContextMenu(node);
				node.myContextMenu.showAt(e.getXY());
			}
		});
		
		var rootNode = formTree.setRootNode(new Ext.tree.TreeNode({
			text : "表单模板",
			type : "form",
			iconCls : "form",
			qtipCfg : {
				text : "没有错误"
			}
		}));
		
		return ;
		var doc = formtpl.dom;
		var rootEl = doc.documentElement.childNodes[0];
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
	
	/**
	 * 判断拖拽是否可以放下
	 */
	function dragoverHandler(e) {
		if(currentState != "normal"){
			return false;
		}
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
	
	/**
	 * 拖拽节点事件函数
	 */
	function dragNodeHander(e) {
		if(currentState != "normal"){
			return false;
		}
		var t = e.target;
		var s = e.dropNode;
		var tEl = t.attributes.data;
		var sEl = s.attributes.data;
		if (t.getOwnerTree() == s.getOwnerTree()) {
			var newEl = sEl;
			var parentEl = sEl.parentNode;
			var oldptype = sEl.parentNode.parentNode.getAttribute("type");
			var newptype = null;
			if (e.point == "above"){
				tEl.parentNode.insertBefore(newEl, tEl);
				newptype = tEl.parentNode.parentNode.getAttribute("type");
			}else if(e.point == "append"){
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
				newptype = tEl.getAttribute("type");
			}
			s.attributes.data = newEl;
			genExtendProp(e, newEl, oldptype, newptype);
			isModifyed = true;
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
			isModifyed = true;
			return false;
		}
	}
	
	// 从服务器端生成节点的扩展属性
	function genExtendProp(e, el, oldptype, newptype){
		if(oldptype==newptype){
			return ;
		}
		if(newptype==null){
			return ;
		}
		var elProps = null;
		for (var i = 0; i < el.childNodes.length; i++) {
			var subEl = el.childNodes[i];
			if (subEl.nodeName == 'Properties') {
				elProps = subEl;
				break;
			}
		}
		var map = new Map();
		map.put("key", "formmake.genExtendProp");
		map.put("ptype", newptype);
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			var docObj = loadXMLString(msg);
			var rootEl = docObj.documentElement;
			// 去掉旧的扩展属性
			var tmp = [];
			for (var i = 0; i < elProps.childNodes.length; i++) {
				var subEl = elProps.childNodes[i];
				if (subEl.getAttribute("extend") == "true") {
					tmp.push(subEl);
				}
			}
			for(var i=0;i<tmp.length;i++){
				//alert("删除旧属性："+tmp[i].getAttribute("name"));
				elProps.removeChild(tmp[i]);
			}
			// 添加新的扩展属性
			for (var i = 0; i < rootEl.childNodes.length; i++) {
				var propEl = rootEl.childNodes[i].cloneNode(true);
				//alert("添加新属性："+propEl.getAttribute("name"));
				elProps.appendChild(propEl);
			}
			e.tree.fireEvent("click", e.dropNode);
		});
		query.send();
	}
	
	/**
	 * 初始化按钮
	 */
	function initButton(){
		toolbar_save = new Ext.Toolbar.Button({
			text : '保存',
			tooltip : '保存模板，并更新缓存<br/>HotKey:Ctrl+S',
			cls : 'x-btn-text-icon save',
			handler : saveTpl
		});
		toolbar_cfgtbl = new Ext.Toolbar.Button({
			text : '相关表',
			tooltip : '配置本表单用到的数据库表<br/>数据字典树中将只显示这些相关表',
			iconCls : 'cfgtbl',
			handler : function(){
				cfgTblDialog.show();
			}
		});
		toolbar_valid = new Ext.Toolbar.Button({
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
					showTips("验证发现错误，节点数：" + countObj.errorNumber, 4);
				} else {
					showTips("验证通过", 3);
				}
			}
		});
		toolbar_rel = new Ext.Toolbar.Button({
			text: "引用",
			tooltip: "查看本表单在其它地方的引用情况",
			cls : 'x-btn-text-icon export',
			handler: function(){
				var url = sys.getContextPath()+"/artery/complib.do?action=listRelForm";
				url += "&formid="+formtpl.id;
				url += "&complibId="+formtpl.complibId;
				var win = window.open(url, "rel_info");
				win.focus();
			}
		});
		toolbar_normal = new Ext.Toolbar.Button({
				tooltip : '点击切换至普通(normal)状态视图',
				cls : 'x-btn-text-icon change-n',
				pressed :true,
				enableToggle : true,
				toggleGroup : "changeStateGroup",
				handler : function() {
					changeStateView("normal");
				}
		});
		toolbar_display = new Ext.Toolbar.Button({
				tooltip : '点击切换至展示(display)状态视图',
				cls : 'x-btn-text-icon change-d',
				enableToggle : true,
				toggleGroup : "changeStateGroup",
				handler : function() {
					changeStateView("display");
				}
		});
		toolbar_update = new Ext.Toolbar.Button({
				tooltip : '点击切换至更新(update)状态视图',
				cls : 'x-btn-text-icon change-u',
				enableToggle : true,
				toggleGroup : "changeStateGroup",
				handler : function() {
					changeStateView("update");
				}
		});
		toolbar_insert = new Ext.Toolbar.Button({
				tooltip : '点击切换至插入(insert)状态视图',
				cls : 'x-btn-text-icon change-i',
				enableToggle : true,
				toggleGroup : "changeStateGroup",
				handler : function() {
					changeStateView("insert");
				}
		});
		toolbar_print = new Ext.Toolbar.Button({
				tooltip : '点击切换至打印(print)状态视图',
				cls : 'x-btn-text-icon change-p',
				enableToggle : true,
				toggleGroup : "changeStateGroup",
				handler : function() {
					changeStateView("print");
				}
		});
		toolbar_showUnshowItem = new Ext.Toolbar.Button({
				tooltip : '显示没有生成的控件',
				cls : 'x-btn-text-icon checked',
				handler : function() {
					changeShowUnshowConfig();
				}
		});
	}
	
	/**
	 * 初始化主界面
	 */
	function initMainPanel() {
		initButton();
		layoutPanel = new Ext.Panel({
			title: "设计界面",
			layout : 'fit',
			items : [{
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
			tbar : [toolbar_save, '-', toolbar_cfgtbl, toolbar_valid, toolbar_rel
			,'-',toolbar_normal, toolbar_insert, toolbar_update, toolbar_display, 
			toolbar_print,'-',toolbar_showUnshowItem,
			'->', 
			{
				tooltip : '预览插入表单效果',
				cls : 'x-btn-text-icon preview-i',
				handler : function() {
					previewForm("insert");
				}
			}, {
				tooltip : '预览更新表单效果',
				cls : 'x-btn-text-icon preview-u',
				handler : function() {
					previewForm("update");
				}
			},{
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
	}
	
	function changeShowUnshowConfig(){
		showUnshowConfig[currentState] = !showUnshowConfig[currentState];
		updateShowUnshowItemButton();
		showOrHideTreeNode();
	}
	
	/**
	 * 切换状态视图
	 */
	function changeStateView(newState){
		formTree.removeClass(getClassForState(currentState));
		currentState = newState;
		formTree.addClass(getClassForState(currentState));
		updateShowUnshowItemButton();
		updateFormTreeNode();
		updatePropView();
	}
	
	/**
	 * 更新按钮显示
	 */
	function updateShowUnshowItemButton(){
		var showConfig = showUnshowConfig[currentState];
		if(showConfig){
			toolbar_showUnshowItem.removeClass("unchecked");
			toolbar_showUnshowItem.addClass("checked");
		}else{
			toolbar_showUnshowItem.removeClass("checked");
			toolbar_showUnshowItem.addClass("unchecked");
		}
	}
	
	function showOrHideTreeNode(){
		if(currentState != "normal"){
			var stateItemsEl = getStateItemsEl(currentState);
			if(stateItemsEl == null || stateItemsEl.childNodes == null || stateItemsEl.childNodes.length == 0){
				updateNodeShowStatusInNormal(formTree.root);
			}else{
				updateNodeShowStatusInState(formTree.root, stateItemsEl);
			}
		}else{
			updateNodeShowStatusInNormal(formTree.root);
		}
	}
	
	function updateNodeShowStatusInNormal(node){
		var itemEl= node.attributes.data;
		var propShow = getNamePropByPropName(itemEl, "show");
		updateNodeShowStatus(propShow, node);
		
		node.eachChild(function(innerNode){
			updateNodeShowStatusInNormal(innerNode);
		});
	}
	
	function updateNodeShowStatusInState(node, stateItemsEl){
		var itemEl= node.attributes.data;
		var stateNodeEl = getSingleStateIemEl(itemEl.getAttribute("sid"),stateItemsEl);
		
		var propShow = getNamePropByPropName(itemEl, "show");
		var propShowState = null;
		if (itemEl.nodeType == 1 && stateNodeEl != null){
			propShowState = getNamePropByPropName(stateNodeEl, "show");
		}
		if(propShowState && propShowState != null){
			propShow = propShowState;
		}
		updateNodeShowStatus(propShow, node);
		
		node.eachChild(function(innerNode){
			updateNodeShowStatusInState(innerNode, stateItemsEl);
		});
	}
	
	/**
	 * 更新控件树节点(颜色,LABEL等)
	 */
	function updateFormTreeNode(){
		if(currentState != "normal"){
			var stateItemsEl = getStateItemsEl(currentState);
			if(stateItemsEl == null || stateItemsEl.childNodes == null || stateItemsEl.childNodes.length == 0){
				updateNodeInNormal(formTree.root);
			}else{
				updateNodeInState(formTree.root, stateItemsEl);
			}
		}else{
			updateNodeInNormal(formTree.root);
		}
	}
	
	function updateNodeInNormal(node) {
		//更新节点名称
		var itemEl = node.attributes.data;
		var newName = getNameProp(itemEl);
		updateNodeText(newName, node);
		
		//更新节点字体颜色
		node.getUI().removeClass("change-state-item");
		
		//是否需要隐藏
		var propShow = getNamePropByPropName(itemEl, "show");
		updateNodeShowStatus(propShow, node);
		
		node.eachChild(function(innerNode){
			updateNodeInNormal(innerNode);
		});
	}
	
	function updateNodeInState(node, stateItemsEl){
		var nodeEl= node.attributes.data;
		var stateNodeEl = getSingleStateIemEl(nodeEl.getAttribute("sid"),stateItemsEl);
		
		//更新节点名称
		var itemEl = node.attributes.data;
		var newName = getNameProp(itemEl);
		var newNameState = null;
		if (itemEl.nodeType == 1 && stateNodeEl != null){
			var nodeNameProp = itemEl.getAttribute("nameprop");
			newNameState = getNamePropByPropName(stateNodeEl, nodeNameProp);
		}
		if(newNameState && newNameState != null){
			newName = newNameState;
		}
		updateNodeText(newName, node);
		
		//更新节点字体颜色
		if(!isStateNodeElEmpty(stateNodeEl)){
			node.getUI().addClass("change-state-item");
		}else{
			node.getUI().removeClass("change-state-item");
		}
		
		//是否需要隐藏
		var propShow = getNamePropByPropName(itemEl, "show");
		var propShowState = null;
		if (itemEl.nodeType == 1 && stateNodeEl != null){
			propShowState = getNamePropByPropName(stateNodeEl, "show");
		}
		if(propShowState && propShowState != null){
			propShow = propShowState;
		}
		updateNodeShowStatus(propShow, node);
		
		node.eachChild(function(innerNode){
			updateNodeInState(innerNode, stateItemsEl);
		});
	}
	
	/**
	 * 更新节点文本
	 */
	function updateNodeText(newName, node){
		var itemEl = node.attributes.data;
		var oldName = node.text;
		if(oldName != newName){
			var nodeName = itemEl.getAttribute("cn");
			if(newName && newName != null && newName != ''){
				nodeName = newName;
			}
			node.setText(nodeName);
		}
	}
	
	/**
	 * 更新节点是否显示
	 */
	function updateNodeShowStatus(propShow, node){
		if(showUnshowConfig[currentState]){
			node.getUI().show();
		}else{
			if(propShow == "false"){
				node.getUI().hide();
				formTree.root.select();
			}else{
				node.getUI().show();
			}
		}
	} 
	
	/**
	 * 判断StateNodeEl属性是否为空（即<Properties>元素中没有子元素）
	 */
	function isStateNodeElEmpty(stateNodeEl) {
		if(stateNodeEl == null){
			return true;
		}
		var propsEl = stateNodeEl.childNodes[0];
		if(propsEl == null){
			return true;
		}
		var propEls = propsEl.childNodes;
		if(propEls != null && propEls.length > 0){
			return false;
		}
		return true;
	}
	
	/**
	 * 获得某状态下某控件的修改属性数据
	 */
	function getSingleStateIemEl(sid, stateItemsEl){
		var childNodeEls = stateItemsEl.childNodes;
		var tmpNodeEl = null;
		for(var i = 0; i < childNodeEls.length; i++){
			tmpNodeEl = childNodeEls[i];
			if(tmpNodeEl.getAttribute("sid") == sid){
				return tmpNodeEl;
			}
		}
		return null;
	}
	
	/**
	 * 获得某状态下的状态修改属性信息
	 */
	function getStateItemsEl(state){
		var doc = formtpl.dom;
		var rootEl = doc.documentElement;
		var stateTagName = Artery.getStateTagName(state);
		var nodeList = rootEl.getElementsByTagName(stateTagName);
		if(nodeList != null){
			return nodeList[0];
		}
		return null;
	}
	
	/**
	 * 更新属性视图
	 */
	function updatePropView(){
		propsPanel.stopEditing();
		propEditor.propType = "common";
		var stateNodeEl = null;
		/*
		if(currentState != "normal"){
			var doc = formtpl.dom;
			var stateItemsEl = getCreateStateItemsEl(currentState);
			var nodeEl= selectedNode.attributes.data;
			var type = nodeEl.getAttribute("type");
			stateNodeEl = getCreateSingleStateIemEl(currentState, nodeEl.getAttribute("sid"), type, stateItemsEl);
		}
		propEditor.refreshData(selectedNode, currentState, stateNodeEl);
		*/
		propEditor.refreshData(selectedNode, currentState);
		propEditor.commonButton.toggle(true);
	}
	
	/**
	 * 获得一个Item下的子类型列表
	 */
	function childTypeList(str){
		if(Ext.isEmpty(str)){
			return [];
		}
		var ta = [];
		var cs = str.split(";");
		for(var i=0;i<cs.length;i++){
			var td = cs[i].split(",");
			ta.push({
				typeEn: td[0],
				typeCn: td[1],
				isUnique: td[3],
				myGroup: td[2]
			});
		}
		return ta;
	}
	
	//递归进行校验
	// 检查一个节点的子节点是否满足要求
	function checkNodeRule(node, countObj) {
		var groupObj = {};
		var itemMap = {};
		var errorArray = [];
		// 标识唯一性
		var nodeEl= node.attributes.data;
		var itemList = childTypeList(nodeEl.getAttribute("child"));
		var nodeprop={};
		nodeprop.sid=nodeEl.getAttribute("sid");
		nodeprop.id=getPropValue(nodeEl,"id");
		if(nodeprop.id==null || nodeprop.id==""){
			nodeprop.id=nodeprop.sid;
		}
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
		for(var i=0;i<itemList.length;i++){
			var itemObj = itemList[i];
			itemObj.number = 0;
			// 找到分组并加入
			var myGroup = groupObj[itemObj.myGroup];
			if (!myGroup) {
				myGroup = new Array();
				myGroup.haveNode = 0;
				groupObj[itemObj.myGroup] = myGroup;
			}
			myGroup.push(itemObj);
			itemMap[itemObj.typeEn] = itemObj;
		}
		// 计算个数
		node.eachChild(function(innerNode) {
			if (innerNode.attributes.type) {
				var itemObj = itemMap[innerNode.attributes.type];
				if (itemObj) {
					itemObj.number++;
				}
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
	
	// 预览表单
	function previewForm(runTimeType) {
		win = Artery.open({
			name : 'previewWin',
			feature : {
				status : 'yes',
				location : 'yes'
			}
		});
		var url = sys.getContextPath() + '/artery/form/dealParse.do?action=previewForm&formid=' + formtpl.id 
						+ '&complibId=' + formtpl.complibId ;
		if (runTimeType) {
			url += "&runTimeType=" + runTimeType;
		}
		win.location.href = url;
		win.focus();
	}
	
	/**
	 * 保存模板
	 */
	function saveTpl() {
		cleanFormtpl();
		layoutPanel.body.mask("正在发送请求,请稍候...");
		var map = new Map();
		map.put("key", "formmake.savetpl");
		map.put("formid", formtpl.id);
		map.put("complibId", formtpl.complibId);
		map.put("template", XmlUtil.getXml(formtpl.dom));
		var query = new QueryObj(map, function(query) {
			layoutPanel.body.unmask();
			var msg = query.getDetail();
			if (msg == "ok") {
				showTips("保存form表单模板成功", 2);
			} else {
				showTips("未知错误：保存form表单模板失败", 4);
			}
		});
		query.send();
		isModifyed = false;
	}
	
	function cleanFormtpl() {
		var root = formtpl.dom.documentElement;
		var childNodes = root.childNodes;
		var tmpEl = null;
		for(var i = 0; i < childNodes.length; i++){
			tmpEl = childNodes[i];
			if(tmpEl.nodeName != "Item"){
				var itemEls = tmpEl.childNodes;
				
			}
		}
	}
	
	/**
	 * 初始化infoTip对象
	 */
	function initPropTip(){
		tpl = new Ext.XTemplate(
			'<div style="width:280;">',
				'<table style="font-size:12px;" cellpadding=5 cellspacing=5>',
					'<tr><td style="width:70;vertical-align:top;">作　　者：</td><td style="color:red;">{author}</td></tr>',
					'<tr><td style="vertical-align:top;">创建时间：</td><td>{createTime}</td></tr>',
					'<tr><td style="vertical-align:top;">说　　明：</td><td>{describe}</td></tr>',
				'</table>',
				'<tpl for="images">',
					'<div style="width:100%;margin:5px;padding:5px;text-align:center;overflow:hidden;border:1px solid #99BBE8;background-color:#fff;">',
						'<img src="{parent.ctx}{.}">',
					'</div>',
				'</tpl>',
			'</div>'
		)
		tpl.compile();
		
		infoTip = new Ext.Tip({
			floating:{shadow:false,shim:false,useDisplay:true,constrain:false}
		});
		infoTip.showAt([-10000,-10000])
	}
	
	function getPropPositon(){
		var x = document.body.clientWidth - infoTip.el.getWidth();
		var y = document.body.clientHeight - infoTip.el.getHeight();
		return [x,y]
	}
	
	/**
	 * 创建子组件菜单
	 * @param nodeMenu 菜单配置
	 * @param sChild 子组件配置
	 */
	function createSubMenu(nodeMenu, sChild){
		var arrayChild = sChild.split(";");
		var subMenu = {};
		var singleMenu = [];
		for (var k = 0; k < arrayChild.length; k=k+1) {
			var info = null;
			var childMenu = arrayChild[k].split(",");
			if(childMenu[5]){
				info = Ext.decode(unescape(childMenu[5]));
				if(info.images == null){
					info.images = [];
				}
			}
			var itemConf = {
				text : '新建[' + childMenu[1] + ']',
				iconCls : childMenu[0] + 'New',
				myGroup : childMenu[2],
				isUnique : childMenu[3],
				typeEn : childMenu[0],
				typeCn : childMenu[1],
				info:info,
				delayTask:new Ext.util.DelayedTask(),
				handler : clickContextMenuHandler,
				listeners :{
					"activate":{
						fn:function(item){
							if(item.info){
								clearTimeout(deferId);
								if(!infoTip.isVisible()){
									infoTip.showAt([-10000,-10000]);
								}
								item.info.ctx = sys.getContextPath()+"/artery/arteryPlugin";
								tpl.overwrite(infoTip.body.dom,item.info);
								(function(){
									infoTip.showAt(getPropPositon())
								}).defer(50)
							}
						},
						scope:this
					},
					"deactivate":{
						fn:function(item){
							if(item.info){
								deferId = infoTip.hide.defer(100,infoTip);
							}
						},
						scope:this
					}
				}
			};
			// 不属于子菜单
			if(childMenu[4]=="-1"||childMenu[4]=="null"){
				singleMenu.push(itemConf);
			}
			// 属于子菜单
			else{
				if(!subMenu[childMenu[4]]){
					var menuLevel = childMenu[4].split("/");
					var levelSize = menuLevel.length;
					var lastTmp;
					for(var idx=0;idx<levelSize;idx++){
						var tmp = menuLevel.slice(0, idx+1).join("/");
						if(!subMenu[tmp]){
							subMenu[tmp] = {
								text: menuLevel[idx],
								menu: []
							}
							if(idx==0){
								nodeMenu.push(subMenu[tmp]);
							}else{
								subMenu[lastTmp].menu.push(subMenu[tmp]);
							}
						}
						lastTmp = tmp;
					}
				}
				subMenu[childMenu[4]].menu.push(itemConf);
			}
			
			if(childMenu[0]=='loopArea' && loopArea==null){
				loopArea = childMenu;
			}
			if(childMenu[0]=='linkItem' && linkItem == null){
				linkItem = childMenu;
			}
		}
		// 不带子菜单的按钮放在最后
		for(var i=0;i<singleMenu.length;i++){
			nodeMenu.push(singleMenu[i]);
		}
	}
	
	/**
	 * 创建特殊的子组件菜单：循环区域和链接控件
	 * @param nodeMenu 菜单配置
	 */
	function addSpecialSubMenu(nodeMenu){
		var subMenu = {};
		var singleMenu = [];
		var plugins = ["loopArea","linkItem"];
		
		var pluginInfo = null;
		
		for(var i = 0; i < plugins.length; i++){
			pluginInfo = specialPluginInfo[plugins[i]];
			if(pluginInfo['info']){
				info = pluginInfo['info'];
				if(info.images == null){
					info.images = [];
				}
			}
		
			var itemConf = {
				text : '新建[' + pluginInfo['cn'] + ']',
				iconCls : pluginInfo['type'] + 'New',
				myGroup : pluginInfo['group'],
				isUnique : pluginInfo['unique'],
				typeEn : pluginInfo['type'],
				typeCn : pluginInfo['cn'],
				info:info,
				delayTask:new Ext.util.DelayedTask(),
				handler : clickContextMenuHandler,
				listeners :{
					"activate":{
						fn:function(item){
							if(item.info){
								clearTimeout(deferId);
								if(!infoTip.isVisible()){
									infoTip.showAt([-10000,-10000]);
								}
								item.info.ctx = sys.getContextPath()+"/artery/arteryPlugin";
								tpl.overwrite(infoTip.body.dom,item.info);
								(function(){
									infoTip.showAt(getPropPositon())
								}).defer(50)
							}
						},
						scope:this
					},
					"deactivate":{
						fn:function(item){
							if(item.info){
								deferId = infoTip.hide.defer(100,infoTip);
							}
						},
						scope:this
					}
				}
			};
			
			// 不属于子菜单
			if(pluginInfo['menu']=="-1"||pluginInfo['menu']=="null"){
				singleMenu.push(itemConf);
			}
			// 属于子菜单
			else{
				if(!subMenu[pluginInfo['menu']]){
					var menuLevel = pluginInfo['menu'].split("/");
					var levelSize = menuLevel.length;
					var lastTmp;
					for(var idx=0;idx<levelSize;idx++){
						var tmp = menuLevel.slice(0, idx+1).join("/");
						if(!subMenu[tmp]){
							subMenu[tmp] = {
								text: menuLevel[idx],
								menu: []
							}
							if(idx==0){
								nodeMenu.push(subMenu[tmp]);
							}else{
								subMenu[lastTmp].menu.push(subMenu[tmp]);
							}
						}
						lastTmp = tmp;
					}
				}
				subMenu[pluginInfo['menu']].menu.push(itemConf);
			}
		}
		
		// 不带子菜单的按钮放在最后
		for(var i=0;i<singleMenu.length;i++){
			nodeMenu.push(singleMenu[i]);
		}
	}
	
	/**
	 * 给每个节点生成右键菜单
	 * @param el xml节点
	 * @param needDel 为true，则生成删除选项
	 */
	function genContextMenu(el, needDel) {
		if (el.nodeType != 1){
			return null;
		}
		var itemType = el.getAttribute("type");
		
		//若节点为循环区域，垂直向上查找非循环区域节点右键菜单作为其右键菜单
		var pNode = el;
		var iType = itemType;
		while(iType == 'loopArea'){
			pNode = pNode.parentNode.parentNode;
			iType = pNode.getAttribute("type");
		}
		
		// 从缓存中获取菜单
		if(menuCache[iType]){
			return menuCache[iType];
		}
		
		var nodeMenu = [];
		var sChild = el.getAttribute("child");
		if (sChild && sChild.length > 0) {
			createSubMenu(nodeMenu, sChild);
		}
		//向右键菜单中添加新建循环区域和链接控件的菜单
		if((sChild && sChild.length > 0) || itemType == 'loopArea'){
			addSpecialSubMenu(nodeMenu);
			nodeMenu.push("-");
		}
		
		nodeMenu.push({
			text : '逻辑类模板',
			handler : genLogicTpl
		});

		//删除复制
		if (needDel) {
			nodeMenu.push("-");
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
		
		if (itemType == "listArea" || itemType == "formArea") {
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
			if(itemType=="formArea"){
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
		menuCache[itemType] = nm;
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

	// 单击快捷菜单事件函数
	function clickContextMenuHandler(item, e) {
		layoutPanel.body.mask("正在发送请求,请稍候...");
		var map = new Map();
		map.put("key", "formmake.createType");
		map.put("typeEn", item.typeEn);
		map.put("parentType", contextNode.attributes.type);
		var query = new QueryObj(map, function(query) {
			layoutPanel.body.unmask();
			var msg = query.getDetail();
			var docObj = loadXMLString(msg);
			var rootEl = docObj.documentElement;
			setRelation(contextNode.attributes.data, rootEl);
			genItemNode(rootEl, contextNode);
		});
		query.send();
		isModifyed = true;
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
		isModifyed = true;
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
					while (contextNode.firstChild){
						contextNode.removeChild(contextNode.firstChild);
					}
				}
			}
		});
		isModifyed = true;
	}
	
	// 打开此子节点的帮助
	function openHelp(item, e) {
    	var element = contextNode.attributes.data;
    	var helpid = element.getAttribute("helpid");
    	window.open(sys.getContextPath()
                    + "/artery/businesshelp/dealBusinesshelp.do?action=toItemEditPage&id="+ helpid+ "&type=4"
                    + "&readOnly=1");
	}
	
	/**
	 * 递归的生成树节点
	 */
	function genTreeNode(parentEl, parentNode) {
		for (var i = 0; i < parentEl.childNodes.length; i++) {
			var subEl = parentEl.childNodes[i];
			if (subEl.nodeName == 'Items') {
				for (var j = 0; j < subEl.childNodes.length; j++) {
					var sonEl = subEl.childNodes[j];
					if(sonEl.nodeName=="Item"){
						var sonNode = genItemNode(sonEl, parentNode);
						genTreeNode(sonEl, sonNode);
					}
				}
			}
		}
	}
	
	/**
	 * 创建指定节点下的子节点
	 * itemEl的标记名称为Item
	 */
	function genItemNode(itemEl, parentNode) {
		if (itemEl.nodeName != 'Item') {
			showTips("标记名称不是Item：" + itemEl.nodeName);
			return;
		}
		
		var nodeName = itemEl.getAttribute("cn");
		var nodeType = itemEl.getAttribute("type");
		var newNodeName = getNameProp(itemEl);
		if (newNodeName && newNodeName != null && newNodeName != ""){
			nodeName = newNodeName;
		}
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
	
	// 删除节点
	function delNode(item, e) {
    	if(contextNode == formTree.root){
      		return;
      	}
    	var nextNode = contextNode.nextSibling;
    	if(nextNode == null ){
      		nextNode = formTree.root;
      	}
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
					isModifyed = true;
				}
			}
		});
	}

	// 复制节点
	function copyHandler(item, e) {
    	var el = contextNode.attributes.data;
    	el.setAttribute("formid",formtpl.id);
    	el.setAttribute("complibId",formtpl.complibId);
		window.clipboardData.setData("Text", el.xml);
	}
	
	// 得到el的显示名称，这个名称可能来自el的子prop中的一个
	function getNameProp(typeEl) {
		if (typeEl.nodeType != 1)
			return null;
		var nodeNameProp = typeEl.getAttribute("nameprop");
		return getNamePropByPropName(typeEl, nodeNameProp);
	}
	
	// 根据el的显示名称属性名得到el的显示名称，这个名称可能来自el的子prop中的一个
	function getNamePropByPropName(typeEl, nodeNameProp){
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
	
		return ParsePropName(nodeNameProp,proplist);
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
								minGroup = minGroup <= intGroup? minGroup: intGroup;
							}
						}
						return false;
					}
				});
			}
			if (item.id && item.id == "paste") {
				var bDisabled = true;
				var doc = null;
				if (window.clipboardData && window.clipboardData.getData("Text") != null){
					doc = loadXMLString(window.clipboardData.getData("Text"));
				}
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
		
		return ; // 不做插入子Item的限制
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
							if (mgItems[i].haveMyType && mgItems[i].isUnique == "true") {
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

	/**
	 * 递归生成表单模板树的节点
	 */
	function genTreeNode1(){
		// 删除子节点
		var tmp = [];
		formTree.root.eachChild(function(innerNode){
			tmp.push(innerNode);
		});
		for(var i=0;i<tmp.length;i=i+1){
			tmp[i].remove();
			tmp[i].destroy();
		}
		
		var doc = formtpl.dom;
		var rootEl = doc.documentElement.childNodes[0];
		var rootNode = formTree.root;
		rootNode.attributes.data = rootEl;
		var nodeMenu = genContextMenu(rootEl, false);
		rootNode.myContextMenu = nodeMenu;
		genTreeNode(rootEl, rootNode);
	}
	
	/**
	 * 显示指定的form制作窗口
	 */
	function showLayout(complibId, formid){
		formtpl = {
			id: formid,
			complibId : complibId
		};
		
		toolbar_normal.toggle(true);
		initNormalConfig();
		
		//layoutPanel.body.mask("正在发送请求,请稍候...");
		var map = new Map();
        map.put("key", "formmake.loadFormXML1");
        map.put("id", formid);
        map.put("complibId", complibId);
        var query = new QueryObj(map,function(){
        	//layoutPanel.body.unmask();
        	isModifyed = false;
        	var msgObj = Ext.decode(query.getDetail());
        	formtpl.template = msgObj.formtpl;
        	formtpl.dom=loadXMLString(formtpl.template);
        	propEditor.formtpl = formtpl;
        	propEditor.showUnshowConfig = showUnshowConfig;
        	genTreeNode1();
        	formTree.fireEvent("click",formTree.root);
          	formTree.root.expand(false, false,function(node){
            	node.eachChild(function(innerNode){
                	innerNode.expand(false,false);
              	});
        	});
        });
        query.send();
        
        // 更新数据字典树
        dictFind.setValue("");
        dictTree.root.reload();
        dictTree.fireEvent("click",dictTree.root);
	}
	
	function initNormalConfig(){
		currentState = "normal";
		formTree.removeClass(".background-display");
		formTree.removeClass(".background-insert");
		formTree.removeClass(".background-update");
		formTree.removeClass(".background-print");
		formTree.addClass(getClassForState(currentState));
		var rootNode = formTree.root;
        if(rootNode.text.indexOf("<font color=blue>") != -1){
        	rootNode.setText(rootNode.text.replace("<font color=blue>", "").replace("</font>", ""));
        }
		initShowUnshowConfig();
		updateShowUnshowItemButton();
	}
	
	function getClassForState(state){
		return "background-" + state;
	}
	
	function initShowUnshowConfig(){
		showUnshowConfig = {};
		showUnshowConfig.normal = true;
		showUnshowConfig.insert = false;
		showUnshowConfig.update = false;
		showUnshowConfig.display = false;
		showUnshowConfig.print = false;
	}
	
	/**
	 * 初始化布局
	 */
	function initLayout(){
		initDictTree();
		initFormTree();
		initSqlWindow();
		initLogicTplWindow();
		initCfgTable();
		initPropTip();
		
		propEditor = new AtyCon.PropEditor();
		propEditor.onPropChange = function(){
			isModifyed = true;
		}
		propsPanel = propEditor.init({
			region: "center",
			editorTips: sqlTips
		});
		initMainPanel();
		menuCache = {};
		return layoutPanel;
	}

	/**
	 * 检查此组件是否修改
	 */
	function checkModify(){
		propsPanel.stopEditing();
		return isModifyed;
	}
	
	/**
	 * 清空右键菜单缓存
	 */
	function clearMenuCache(){
		menuCache = {};
	}
	
	/**
	 * 获得属性编辑对象
	 */
	function getPropEditor(){
		return propEditor;
	}

	return {
		showLayout: showLayout,
		initLayout: initLayout,
		isModify: checkModify,
		clearMenuCache: clearMenuCache,
		getPropEditor: getPropEditor
	};
}();