Ext.ns("AtyCon");

/**
 * 数据字典 反向工程
 */
AtyCon.ReverseManager = (function(){
	var reverseWindow;			// 反向工程窗口
	var reverseResultWindow;	// 反向工程处理结果Window
	var userTableTree;			// 业务数据库表Tree
	var reverseTree;			// 需要反向工程处理的表
	var reverseResultStore;

	// 初始化相关树
	function initTree(){
		var filterField = new Ext.form.TextField({
			enableKeyEvents : true,
			width : 250
		});
		filterField.on("keyup", function(cmp) {
			var fs = cmp.getValue();
			if (fs == null || fs.length == 0) {
				reverseWindow.ud.userTableFilter.clear();
			} else {
				var r = new RegExp(fs, "i");
				reverseWindow.ud.userTableFilter.filter(r);
			}
		});
		userTableTree = new Ext.tree.TreePanel({
			region : 'west',
			animate : false,
			margins : '4 0 4 4',
			width : 250,
			autoScroll : true,
			enableDD : false,
			border : false,
			rootVisible : false,
			containerScroll : true,
			loader : new Ext.tree.TreeLoader({
				dataUrl : 'dealDict.do?action=loadUTListJson'
			}),
			root : new Ext.tree.AsyncTreeNode({
				text: '反向工程根节点',
				type: "root",
				cid: "root"
			}),
			tbar : [filterField]
		});
		userTableTree.getLoader().on("beforeload", function(loader,node){
			this.baseParams.type = node.attributes.type;
			this.baseParams.cid = node.attributes.cid;
		});
		userTableTree.getLoader().on('load', loadUTTableHandler);
		reverseTree = new Ext.tree.TreePanel({
			region : 'east',
			animate : false,
			margins : '4 4 4 0',
			width : 250,
			autoScroll : true,
			enableDD : false,
			border : false,
			rootVisible : false,
			containerScroll : true,
			loader : new Ext.tree.TreeLoader(),
			root : new Ext.tree.AsyncTreeNode({
				text : '反向工程根节点'
			})
		});
	}

	// 初始化反向工程窗口
	function initWindow() {
		initTree();
		reverseWindow = new Ext.Window({
			title : '反向工程',
			width : 600,
			height : 400,
			resizable : false,
			closeAction : 'hide',
			modal : true,
			layout : 'border',
			items : [userTableTree, {
				region : 'center',
				border : false,
				margins : '4 4 4 4',
				contentEl : 'reverseWindow_center',
				border : false
			}, reverseTree],
			buttons : [{
				text : '刷新业务库',
				handler : function() {
					userTableTree.root.reload();
				}
			}, {
				id : 'reverseWindow_button_submit',
				text : '确 定',
				handler : submitHandler
			}, {
				text : '取 消',
				handler : function() {
					reverseWindow.setVisible(false);
				}
			}]
		});
		reverseWindow.ud = {}; // 用户数据区
		// 创建中间的button
		new Ext.Button({
			text : '添 加',
			cls : 'x-btn-text-icon add',
			renderTo : 'reverseWindow_center_addButton',
			handler : addTableHandler
		});
		new Ext.Button({
			text : '删 除',
			cls : 'x-btn-text-icon delete',
			renderTo : 'reverseWindow_center_deleteButton',
			handler : deleteTableHandler
		});
		// 注册事件
		userTableTree.on('click', function(node) {
			if(node.isLeaf()){
				reverseWindow.ud.leftSelectedNode = node;				
			}
		});
		reverseTree.on('click', function(node) {
			reverseWindow.ud.rightSelectedNode = node;
		});
		// 实现表过滤功能
		reverseWindow.ud.userTableFilter = new Ext.tree.TreeFilter(userTableTree, {
			autoClear : true
		});
	}

	// 反向工程按钮事件函数
	function reverseButtonHandler() {
		reverseWindow.show();
	}

	// 加载业务表事件函数，在业务表加载完毕后执行，用于使选中的表红色显示
	function loadUTTableHandler(loader,node) {
		if(node.attributes.type!="ds"){
			return ;
		}
		reverseTree.root.eachChild(function(inner) {
			if(inner.attributes.ds==node.attributes.cid){
				var ln = node.findChild('cid',inner.attributes.cid);
				if (ln) {
					ln.oldText = ln.text;
					ln.setText('<font color=red>' + ln.text + '</font>');
				}
			}
		});
	}

	// 添加表按钮事件函数
	function addTableHandler() {
		var lsn = reverseWindow.ud.leftSelectedNode;
		if (!lsn) {
			return;
		}
		var reRootNode = reverseTree.root;
		var eenode = reRootNode.findChildBy(function(inner){
			var dsEqual = inner.attributes.ds == lsn.attributes.ds;
			var cidEqual = inner.attributes.cid == lsn.attributes.cid;
			if(dsEqual && cidEqual){
				return true;
			}
		});
		if (eenode) {
			return;
		}
		reRootNode.appendChild(new Ext.tree.TreeNode({
			text : lsn.text,
			cid : lsn.attributes.cid,
			ds : lsn.attributes.ds,
			cls : 'added_node'
		}));
		lsn.oldText = lsn.text;
		lsn.setText("<font color=red>" + lsn.text + "</font>");
	}

	// 删除表按钮事件函数
	function deleteTableHandler() {
		var rsn = reverseWindow.ud.rightSelectedNode;
		if (!rsn) {
			return;
		}
		var reRootNode = reverseTree.root;
		reRootNode.removeChild(rsn);
		var leftRootNode = userTableTree.root;
		var dsNode = leftRootNode.findChildBy(function(inner){
			if(inner.attributes.cid==rsn.attributes.ds){
				return true;
			}
		});
		if(dsNode.isLoaded()){
			var tabNode = dsNode.findChildBy(function(inner){
				if(inner.attributes.cid==rsn.attributes.cid){
					return true;
				}
			});
			if (tabNode && tabNode.oldText) {
				tabNode.setText(tabNode.oldText);
			}
		}
	}

	// 提交并进行反向工程
	function submitHandler() {
		var rightRootNode = reverseTree.root;
		var reverseString = "";
		rightRootNode.eachChild(function(node) {
			reverseString += (node.attributes.ds + ";" + node.text + ",");
		});
		// 如果没有选中表，则什么也不做
		if (reverseString == "") {
			return;
		}
		var map = new Map();
		map.put("key", "dict.reverse");
		map.put("reverseString", reverseString);
		var query = new QueryObj(map, function(query) {
			Ext.get(document.body).unmask();
			reverseWindow.setVisible(false);
			var resultObj = Ext.decode(query.getDetail());
			reverseResultStore.removeAll();
			reverseResultStore.loadData(resultObj.results);
			reverseResultWindow.setTitle('反向工程处理结果');
			reverseResultWindow.show();
			// 清空选中节点
			selectedNode = null;
			// 重新加载树
			dictTree.root.reload();
		});
		Ext.get(document.body).mask("正在执行反向工程,请稍候...");
		query.send();
	}

	// 初始化反向工程处理结果Window
	function initResultWindow() {
		// 创建SimpleStore
		reverseResultStore = new Ext.data.SimpleStore({
			id : 'reverse_result_store',
			fields : ['tableName', 'dealResult', 'columnNumber', 'errorMessage'],
			data : [['aaa', '失败', '', '表名重复'], ['aaa', '成功', '23', '']]
		});
		// 处理结果Grid
		var resultGridPanel = new Ext.grid.GridPanel({
			header : false,
			title : '反向工程处理结果',
			stripeRows : true,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : false,
			ds : reverseResultStore,
			cm : new Ext.grid.ColumnModel([{
				header : "表名",
				width : 150,
				sortable : false,
				dataIndex : 'tableName'
			}, {
				header : "处理结果",
				width : 100,
				sortable : false,
				dataIndex : 'dealResult'
			}, {
				header : "创建字段数",
				width : 200,
				sortable : false,
				dataIndex : 'columnNumber'
			}, {
				header : "失败原因",
				width : 150,
				sortable : false,
				dataIndex : 'errorMessage'
			}])
		});
		// 创建窗口
		reverseResultWindow = new Ext.Window({
			title : '反向工程处理结果',
			width : 600,
			height : 300,
			resizable : false,
			closeAction : 'hide',
			modal : true,
			layout : 'fit',
			items : [resultGridPanel],
			buttons : [{
				text : '关 闭',
				handler : function() {
					reverseResultWindow.setVisible(false);
				}
			}]
		});
	}

	return {
		show: reverseButtonHandler,
		init: function(){
			initWindow();
			initResultWindow();
		}
	}
})();