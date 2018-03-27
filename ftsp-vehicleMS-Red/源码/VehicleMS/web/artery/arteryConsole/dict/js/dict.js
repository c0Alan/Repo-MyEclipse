// 当前选中的节点
var selectedNode;
// 数据字典树
var dictTree;
// 创建类别窗口
var createMenuWindow;
var createMenu_name;
// 修改类别窗口
var editMenuWindow;
var editMenu_name;
// 修改表窗口
var editTableWindow;
var editTable_dbName;
var editTable_showName;
var editTable_key;
var editTable_desc;
var editTable_submitName;
var editTable_props;
var editTable_submit;
// 导入数据字典窗口
var importWindow;
// 同步表窗口
var synchWindow;
var synchFieldStore;	// 同步数据字段列表

var topbar;			// 工具栏
var bottombar;		// 状态栏

// 树上节点单击事件函数
function switchButton(node) {
	var isModify = AtyCon.FieldManager.isModify();
	if(isModify){
		Ext.Msg.confirm('信息', "字段信息没有保存，确定要切换节点？", function(btn){
           	if (btn == 'yes') {
               changePage(node);
           	}
       	});
	}else{
		changePage(node);
	}
}

// 更改页面显示的内容
function changePage(node){
	selectedNode = node;
	if (node.attributes.type == 'menu') {
		Ext.getCmp('toolbar_addMenu').enable();
		Ext.getCmp('toolbar_addTable').enable();
//		var mid = node.attributes.cid;
//		var cp = Ext.getCmp("centerPanel");
//		AtyCon.TableManager.showTables(mid,cp);
	} else if (node.attributes.type == 'table') {
		Ext.getCmp('toolbar_addMenu').disable();
		Ext.getCmp('toolbar_addTable').disable();
		var tid = node.attributes.cid;
		var cp = Ext.getCmp("centerPanel");
		AtyCon.FieldManager.showFields(tid,cp);
	}
}

function initCreateMenuWindow(){
	createMenu_name = new Ext.form.TextField({
		fieldLabel : '名 称',
		allowBlank : false,
		anchor : '100%' // anchor width by percentage
	});
	var form = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 55,
		items : [createMenu_name]
	});

	createMenuWindow = new Ext.Window({
		title : '新建类别',
		width : 400,
		height : 105,
		resizable : false,
		closeAction : 'hide',
		modal : true,
		layout : 'fit',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : form,
		buttons : [{
			text : '创 建',
			handler : function() {
				if (!createMenu_name.validate()) {
					return;
				}
				createMenuWindow.hide();
				var map = new Map();
				map.put("key", "dict.insertMenu");
				map.put("name", createMenu_name.getValue()); // 类型名称
				map.put("pid", selectedNode.attributes.cid); // 父类别编号
				var query = new QueryObj(map, function(query) {
					var msg = query.getDetail();
					// 表单id为32位uuid
					if (msg.length!=32) {
						showTips(msg, 4);
					} else {
						showTips("新建类别成功", 2);
						// 重新加载选中节点
						selectedNode.reload(function() {
							var addedNode = selectedNode.findChildBy(function(
									innerNode) {
								if (msg == innerNode.attributes.cid
										&& innerNode.attributes.type == 'menu') {
									return true;
								} else {
									return false;
								}
							}, this);
							if (addedNode) {
								dictTree.fireEvent('click', addedNode);
							}
						});
					}
				});
				query.send();
			}
		}, {
			text : '取 消',
			handler : function() {
				createMenuWindow.setVisible(false);
			}
		}]
	});
}

// 创建类别事件函数
function createMenuHandler() {
	// 如果选中节点不是目录，则什么也不做
	if (!selectedNode || selectedNode.attributes.type != 'menu') {
		return;
	}
	if (!createMenuWindow.isVisible()) {
		createMenuWindow.setTitle('新建类别，父类别为：' + selectedNode.text);
		createMenu_name.setValue(''); // 清空已填值
		createMenu_name.clearInvalid();
		createMenuWindow.show();
	}
}

function initEditMenuWindow(){
	editMenu_name = new Ext.form.TextField({
		fieldLabel : '名 称',
		allowBlank : false,
		anchor : '100%' // anchor width by percentage
	});
	var form = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 55,
		items : [editMenu_name]
	});

	editMenuWindow = new Ext.Window({
		title : '修改类别',
		width : 400,
		height : 105,
		resizable : false,
		closeAction : 'hide',
		modal : true,
		layout : 'fit',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : form,
		buttons : [{
			text : '修 改',
			handler : function() {
				if (!editMenu_name.validate()) {
					return;
				}
				// 如果名称一样，就什么也不做
				if (editMenu_name.getValue() == selectedNode.text) {
					return;
				}
				editMenuWindow.hide();
				var map = new Map();
				map.put("key", "dict.updateMenu");
				map.put("name", editMenu_name.getValue()); // 类型名称
				map.put("id", selectedNode.attributes.cid); // 父类别编号
				var query = new QueryObj(map, function(query) {
					var msg = query.getDetail();
					var msgTips = "";
					if (msg == "1") {
						msgTips = "修改类别成功";
						showTips(msgTips, 2);
						selectedNode.parentNode.reload();
					} else {
						showTips(msg, 4);
					}
				});
				query.send();
			}
		}, {
			text : '取 消',
			handler : function() {
				editMenuWindow.setVisible(false);
			}
		}]
	});
}

// 修改类别名称
function editMenuHandler() {
	if (selectedNode == dictTree.root) {
		return;
	}
	if (!editMenuWindow.isVisible()) {
		editMenuWindow.setTitle('修改类别：' + selectedNode.text);
		editMenu_name.setValue(selectedNode.text); // 设置类别名称
		editMenuWindow.show();
	}
}

// 删除按钮事件函数
function deleteHandler() {
	if (!selectedNode) {
		return;
	}
	if (selectedNode == dictTree.root) {
		return;
	}

	var selectedName = selectedNode.text;
	var type = selectedNode.attributes.type;
	var typeName;
	if (type == 'menu') {
		typeName = '类别';
	} else if (type == 'table') {
		typeName = '表';
	}
	Ext.Msg.show({
				title : '确认删除',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				msg : '确定要删除' + typeName + '：“' + selectedName + '”？',
				width : 350,
				fn : function(btn) {
					if (btn == 'yes') {
						var map = new Map();
						map.put("key", "dict.deleteMenuOrTable");
						map.put("type", selectedNode.attributes.type); // 对象类型
						map.put("id", selectedNode.attributes.cid); // 对象编号
						var query = new QueryObj(map, function(query) {
							var msg = query.getDetail();
							var msgTips = "";
							if (msg == "1") {
								msgTips = "删除成功";
								showTips(msgTips, 2);
								// 重新加载父节点
								selectedNode.parentNode.reload();
							} else {
								showTips(msg, 4);
							}
						});
						query.send();
					}
				}
			});
}

// 创建表按钮事件函数
function createTableHandler() {
	// 如果选中节点不是目录，则什么也不做
	if (!selectedNode || selectedNode.attributes.type != 'menu') {
		return;
	}
	if (editTableWindow.isVisible()) {
		return ;
	}
	editTableWindow.setTitle('新建表，所属目录为：' + selectedNode.text);
	editTable_submit.setText('创 建');
	editTable_submit.setHandler(insertTableHandler);
	// 清空已填值
	editTable_dbName.setValue('');
	editTable_dbName.clearInvalid();
	editTable_showName.setValue('');
	editTable_showName.clearInvalid();
	editTable_key.setValue("");
	editTable_desc.setValue('');
	editTable_submitName.setValue("");
	editTableWindow.show();
	for(var p in editTable_props){
		editTable_props[p].initFldVal();
	}
}

// 组装table信息到Map中
function createTableMap(){
	var map = new Map();
	map.put("dbname", editTable_dbName.getValue()); 	// 数据库表名
	map.put("showname", editTable_showName.getValue()); // 显示名称
	map.put("tableKey", editTable_key.getValue());		// table对应的key
	map.put("desc", editTable_desc.getValue()); 		// 描述
	map.put("submitName", editTable_submitName.getValue());	// 提交名称
	var extendprop = {};
	for(var p in editTable_props){
		var propValue = editTable_props[p].getValue();
		if(!Ext.isEmpty(propValue)){
			extendprop[p] = propValue;
		}
	}
	map.put("extendprop", Ext.encode(extendprop));			// 扩展属性
	return map;
}

// 插入字典表
function insertTableHandler(){
	if (!editTable_dbName.validate()) {
		return;
	}
	if (!editTable_showName.validate()) {
		return;
	}
	editTableWindow.hide();
	var map = createTableMap();
	map.put("key", "dict.insertTable");
	map.put("menuid", selectedNode.attributes.cid); 	// 所属目录
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		if (msg.length != 32) {
			showTips(msg, 4);
		} else {
			showTips("新建表成功", 2);
			// 重新加载选中节点
			selectedNode.reload(function() {
				var addedNode = selectedNode.findChildBy(function(innerNode) {
					if (msg == innerNode.attributes.cid && innerNode.attributes.type == 'table') {
						return true;
					} else {
						return false;
					}
				}, this);
				if (addedNode) {
					dictTree.fireEvent('click', addedNode);
				}
			});
		}
	});
	query.send();
}

// 根据属性配置创建输入控件
function createTablePropField(propType){
	var propField;
	if(propType.propType=="string" || propType.propType=="number"){
		propField = new Ext.form.TextField({
			fieldLabel : propType.desc,
			anchor : '100%',
			initFldVal : function(){
				this.setValue();
			}
		});
	}else if(propType.propType=="textarea"){
		propField = new Ext.form.TextArea({
			fieldLabel : propType.desc,
			anchor : '100%',
			height: 48,
			initFldVal : function(){
				this.setValue();
			}
		});
	}else{
		var dataArray = [];
		for(var i=0;i<propType.optionList.length;i++){
			dataArray.push([
				propType.optionList[i],
				propType.optionList[i]
			]);
		}
		var optionStore = new Ext.data.SimpleStore({
			fields: ['typeValue','typeName'],
			data: dataArray
		});
		propField = new Ext.form.ComboBox({
			fieldLabel : propType.desc,
			anchor : '100%',
			store: optionStore,
			valueField: 'typeValue',
			displayField: 'typeName',
			editable: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			defaultOption : propType.defaultOption,
			initFldVal : function(){
				this.setValue(this.defaultOption);
			}
		});
	}
	return propField;
}

// 延迟初始化编辑表窗口
function initEditTableWindow() {
	editTable_dbName = new Ext.form.TextField({
		fieldLabel : '数据库表名',
		allowBlank : false,
		anchor : '100%'
	});
	editTable_showName = new Ext.form.TextField({
		fieldLabel : '显示名称',
		allowBlank : false,
		anchor : '100%'
	});
	editTable_key = new Ext.form.TextField({
		fieldLabel : 'key',
		anchor : '100%'
	});
	editTable_desc = new Ext.form.TextArea({
		fieldLabel : '描述',
		height : 85,
		anchor : '100%'
	});
	editTable_submitName = new Ext.form.TextField({
		fieldLabel: "类名称",
		anchor: "100%"
	});
	editTable_submit = new Ext.Button({
		text : '修 改',
		handler : function() {
			alert('单击了处理按钮');
		}
	});
	var panelitems = [
		editTable_dbName,
		editTable_showName,
		editTable_key,
		editTable_desc,
		editTable_submitName
	];
	var panelheight = 250;
	editTable_props = {};
	if(tableExtendList && tableExtendList.length>0){
		for(var i=0;i<tableExtendList.length;i++){
			var propType = tableExtendList[i];
			var propfld = createTablePropField(propType);
			if(propType.propType=="textarea"){
				panelheight += 56;
			}else{
				panelheight += 28;
			}
			editTable_props[propType["name"]] = propfld;
			panelitems.push(propfld);
		}
	}
	var form = new Ext.FormPanel({
		labelWidth : 85,
		baseCls : 'x-plain',
		items : panelitems
	});
	editTableWindow = new Ext.Window({
		title : '编辑表',
		width : 450,
		height : panelheight,
		resizable : true,
		closeAction : 'hide',
		modal : true,
		layout : 'fit',
		bodyStyle : 'padding:5px;',
		plain : true,
		buttonAlign : 'center',
		items : form,
		buttons : [editTable_submit, {
			text : '取 消',
			handler : function() {
				editTableWindow.setVisible(false);
			}
		}]
	});
}

// 修改表的属性
function editTableHandler() {
	// 如果窗口可见，则什么也不做
	if (editTableWindow.isVisible()) {
		return;
	}
	dictTree.body.mask("正在发送请求,请稍候...");
	// 从服务器获得表的属性
	var map = new Map();
	map.put("key", "dict.getTableInfo");
	map.put("id", selectedNode.attributes.cid);
	var query = new QueryObj(map, function(query) {
		dictTree.body.unmask();
		editTableWindow.setTitle("编辑表");
		editTable_submit.setText("修 改");
		editTable_submit.setHandler(updateTableHandler);
		var tableInfo = Ext.decode(query.getDetail());
		editTable_dbName.setValue(tableInfo.dbName);
		editTable_showName.setValue(tableInfo.showName);
		editTable_key.setValue(tableInfo.key);
		editTable_desc.setValue(tableInfo.desc);
		editTable_submitName.setValue(tableInfo.submitName);
		editTableWindow.show();
		for(var p in editTable_props){
			var propfield = editTable_props[p];
			var propValue = tableInfo.propMap[p];
			if(propValue===undefined){
				propfield.initFldVal();
			}else{
				propfield.setValue(propValue);
			}
		}
	});
	query.send();
}

// 更新字典表
function updateTableHandler(){
	if (!editTable_dbName.validate()) {
		return;
	}
	if (!editTable_showName.validate()) {
		return;
	}
	editTableWindow.hide();
	var map = createTableMap();
	map.put("key", "dict.updateTable");
	map.put("id", selectedNode.attributes.cid); 			// 表编号
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		if (msg == "1") {
			showTips("更新表成功", 2);
			// 刷新选中节点的父节点
			var pn = selectedNode.parentNode;
			if (pn != null) {
				pn.reload();
			}
			selectedNode = null;
		} else {
			showTips(msg, 4);
		}
	});
	query.send();
}

// 同步表结构
function synchTableHandler(){
	var map = new Map();
	map.put("key", "dict.synchTable");
	map.put("tableCid", selectedNode.attributes.cid);
	Ext.getCmp("mainPanel").body.mask("正在同步,请稍候...");
	var query = new QueryObj(map, function(query) {
		var msgObj = Ext.decode(query.getDetail());
		Ext.getCmp("mainPanel").body.unmask();
		if(msgObj.resCode=="-1"){
			Ext.Msg.alert("确认窗口", "表不存在，不能进行同步操作");
			return ;
		}
		synchFieldStore.removeAll();
		synchFieldStore.loadData(msgObj.fieldList);
		synchWindow.tableInfo = msgObj;
		synchWindow.show();
	});
	query.send();
}

// 处理字段的pojo属性
function dealFieldPojo(addOrDel){
	var map = new Map();
	map.put("key", "dict.dealFieldPojo");
	map.put("tableCid", selectedNode.attributes.cid);
	map.put("addOrDel", addOrDel);
	Ext.getCmp("mainPanel").body.mask("正在处理,请稍候...");
	var query = new QueryObj(map, function(query) {
		Ext.getCmp("mainPanel").body.unmask();
		var msg = query.getDetail();
		if(msg=="1"){
			showTips("处理字段pojo属性成功", 2);
		}else{
			showTips(msg, 4);
		}
	});
	query.send();
}

// 同步数据字典
function synchDictTable(type){
	var map = new Map();
	map.put("key", "dict.doTableSynch");
	map.put("tableCid", selectedNode.attributes.cid);
	map.put("dsName", synchWindow.tableInfo.dsName);
	map.put("synchType", type);
	Ext.getBody().mask("正在同步,请稍候...");
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		Ext.getBody().unmask();
		if(msg=="1"){
			showTips("同步表成功", 2);
		}else{
			showTips("同步表失败", 2);
		}
		synchWindow.setVisible(false);
		dictTree.fireEvent("click",selectedNode);
	});
	query.send();
}

// 刷新缓存
function refreshCacheHandler() {
	var map = new Map();
	map.put("key", "dict.refreshCache");
	Ext.getCmp("mainPanel").body.mask("正在刷新缓存,请稍候...");
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		Ext.getCmp("mainPanel").body.unmask();
		if (msg == "-1") {
			showTips("刷新缓存失败", 1);
		} else {
			showTips("刷新缓存成功", 2);
			// 重新加载树和列表
			dictTree.root.reload();
		}
	});
	query.send();
}

// 初始化工具栏
function initToolbar(){
	topbar = new Ext.Toolbar([{
		id : 'toolbar_addMenu',
		cls : 'x-btn-icon addmenu',
		tooltip : '新建类别',
		handler : createMenuHandler
	}, {
		id : 'toolbar_addTable',
		cls : 'x-btn-icon addtable',
		tooltip : '新建表',
		handler : createTableHandler
	}, {
		id : 'toolbar_delete',
		cls : 'x-btn-icon delete',
		tooltip : '删除对象',
		handler : deleteHandler
	},'-', {
		id : 'toolbar_reverse',
		cls : 'x-btn-icon reverse',
		tooltip : '反向工程：读取数据库结构，直接生成数据字典',
		handler : function(){
			AtyCon.ReverseManager.show();
		}
	}, {
		cls : 'x-btn-icon gensql',
		tooltip : '导出SQL',
		menu: {
			items:[{
				text: "sybase",
				handler: function(){
					exportSQLHandler("sybase");
				}
			},{
				text: "oracle",
				handler: function(){
					exportSQLHandler("oracle");
				}
			},{
				text: "sqlserver",
				handler: function(){
					exportSQLHandler("sqlserver");
				}
			},{
				text: "mysql",
				handler: function(){
					exportSQLHandler("mysql");
				}
			},{
				text: "kingbase",
				handler: function(){
					exportSQLHandler("kingbase");
				}
			},{
				text: "db2",
				handler: function(){
					exportSQLHandler("db2");
				}
			}]
		}
	}, {
		cls : 'x-btn-icon refresh',
		tooltip : '刷新缓存',
		handler : refreshCacheHandler
	}]);
	
	var search_box = new Ext.form.TextField({
		id : 'search_box',
		width : 150
	});
	bottombar = new Ext.Toolbar([search_box, ' ', {
		text : '查找',
		handler : findTableByName
	}]);
}

// 创建数据字典树
function makeDictTree(){
	dictTree = new Ext.tree.TreePanel({
		region : 'west',
		margins : '4 0 4 4',
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 400,
		bbar : bottombar,
		tbar : topbar,
		id: 'dictTree',
		autoScroll:true,
		animate : false,
		enableDD: true,
		containerScroll: true,
		loader: new Ext.tree.TreeLoader({
		    dataUrl: sys.getContextPath()+'/artery/dict/dealDict.do?action=loadTree'
		})
	});
	// 加载节点时,传输其他参数
	dictTree.getLoader().on("beforeload", function(treeLoader, node) {
	    this.baseParams.type = node.attributes.type;
	    this.baseParams.cid = node.attributes.cid;
	});
	// 单击事件
	dictTree.on('click',switchButton);
	// 设置根节点
	var root = new Ext.tree.AsyncTreeNode({
	    text: '数据字典',
	    draggable:false,
	    cid:'',
	    iconCls:'dict',
	    type: 'menu'
	}); 
	// 对树进行排序
	new Ext.tree.TreeSorter(dictTree, {
	    folderSort: true,
	    dir: "asc",
	    sortType: function(node) {
	        return node.attributes.order;
	    }
	});
	// 注册拖拽事件
	dictTree.on("beforemovenode",dragNodeHander);
	// 注册右键单击事件
	dictTree.on("contextmenu",cmManager.show,dictTree);
	dictTree.setRootNode(root);
}

// 初始化表同步窗口
function initSynchWindow(){
	synchFieldStore = new Ext.data.SimpleStore({
		fields : ['dict_field', 'dict_show', 'db_field'],
		data : [['abc', 'abc', 'abc']]
	});
	var synchFieldPanel = new Ext.grid.GridPanel({
		stripeRows : true,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		border : false,
		ds : synchFieldStore,
		cm : new Ext.grid.ColumnModel([{
			header : "数据字典-字段",
			width : 150,
			sortable : false,
			dataIndex : 'dict_field'
		}, {
			header : "数据字典-显示",
			width : 150,
			sortable : false,
			dataIndex : 'dict_show'
		}, {
			header : "数据库-字段",
			width : 150,
			sortable : false,
			dataIndex : 'db_field'
		}])
	});
	synchWindow = new Ext.Window({
		title : '同步表处理窗口',
		width : 600,
		height : 350,
		resizable : false,
		closeAction : 'hide',
		modal : true,
		layout : 'fit',
		items : [synchFieldPanel],
		buttons : [{
			text: "删除字典多于字段",
			handler: function(){
				synchDictTable("1");
			}
		},{
			text: "添加字典缺少字段",
			handler: function(){
				synchDictTable("2");
			}
		},{
			text : "同步字典",
			handler: function(){
				synchDictTable("3");
			}
		},{
			text : '关 闭',
			handler : function() {
				synchWindow.setVisible(false);
			}
		}]
	});
}

// 初始化布局
function initLayout() {
	initToolbar();
	makeDictTree();
	AtyCon.ReverseManager.init();
	initSynchWindow();
    initImportWindow();
    initCreateMenuWindow();
    initEditMenuWindow();
    initEditTableWindow();
	var mainPanel = new Ext.Panel({
		id : "mainPanel",
		layout : 'border',
		items : [{
			id: "centerPanel",
			region : 'center',
			layout: "card",
			margins : '4 4 4 0'
		}, dictTree]
	});
	new Ext.Viewport({
		layout : 'fit',
		border : false,
		hideBorders : true,
		items : [mainPanel]
	});
	dictTree.root.expand();
	// 选中根节点
   	dictTree.fireEvent("click",dictTree.root);
   	selectedNode = dictTree.root;
}

// 拖拽节点事件函数
function dragNodeHander(tree, node, oldP, newP, index) {
	node.attributes.order = index + 1;
	dictTree.body.mask("正在发送请求,请稍候...");

	var map = new Map();
	map.put("key", "dict.dragNode");
	map.put("nodeID", node.attributes.cid); // 节点编号
	map.put("nodeType", node.attributes.type); // 节点类型，menu或table
	map.put("oldParentID", oldP.attributes.cid); // 原来父节点编号
	map.put("newParentID", newP.attributes.cid); // 新父节点编号
	map.put("index", index); // 节点所在位置编号
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		var msgTips = "";
		if (msg == "1") {
			showTips("移动成功", 2);
		} else {
			showTips(msg, 1);
		}
		dictTree.body.unmask();
	});
	query.send();
	return true;
}

// 右键快捷菜单控制对象
var cmManager = {};
// 类别菜单
cmManager.leibieMenu = new Ext.menu.Menu({
	items : [{
		text : '新建类别',
		iconCls : 'menu-add',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			createMenuHandler();
		}
	}, {
		text : '新建表',
		iconCls : 'table-add',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			createTableHandler();
		}
	}, {
		text : '修改名称',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			editMenuHandler();
		}
	}, {
		text : '删除',
		iconCls : 'menu-delete',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			deleteHandler();
		}
	}]
});
// 表菜单
cmManager.tableMenu = new Ext.menu.Menu({
	items : [{
		text : '修改表',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			editTableHandler();
		}
	}, {
		text: "同步表",
		handler: function(){
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			synchTableHandler();
		}
	}, {
		text: "生成字段pojo属性",
		handler: function(){
			dealFieldPojo("1");
		}
	}, {
		text: "删除字段pojo属性",
		handler: function(){
			dealFieldPojo("2");
		}
	}, {
		text : '删  除',
		iconCls : 'menu-delete',
		handler : function() {
			selectedNode = cmManager.clickNode;
			selectedNode.select();
			deleteHandler();
		}
	}]
});
// 显示快捷菜单
cmManager.show = function(node, e) {
	cmManager.clickNode = node;
	if (node.attributes.type == 'menu') {
		cmManager.leibieMenu.showAt(e.getXY());
	} else if (node.attributes.type == 'table') {
		cmManager.tableMenu.showAt(e.getXY());
	}
}

// ***************** 根据combobox快速定位表 ******************

// 根据表名，快速定位表节点
function findTableByName() {
	var combox_value = Ext.getCmp('search_box').getValue();
	if (combox_value != null && combox_value != "") {
		// 往服务器发送请求，返回组织路径字符串
		var map = new Map();
		map.put("key", "dict.findTablePath");
		map.put("tableId", combox_value);
		var query = new QueryObj(map, function() {
			var msg = query.getDetail();
			var msgTips = "";
			if (msg == "-1") {
				msgTips = "表不存在";
				showTips(msgTips, 2);
			} else {
				clickTableByPath(msg);
			}
		});
		query.send();
	}
}

// 选中的节点列表
var findNodeList = [];

// 添加节点到列表，保证不重复
function addNodeToList(nodeList, node){
	for(var i=0;i<nodeList.length;i++){
		if(nodeList[i]==node){
			return ;
		}
	}
	nodeList.push(node);
}

// 递归的展开树节点，走后选中用户
function path_expand_callback(innerNode) {
	var path_arr = innerNode.find_path_array;
	delete innerNode.find_path_array;

	var nodeList = [];
	for(var i=0;i<path_arr.length;i++){
		var pathObj = path_arr[i];
		pathObj.path_i++;
		var nextNode = innerNode.findChild('cid', pathObj.path_array[pathObj.path_i]);
		if (!nextNode) {
			alert("nextNode is null: " + innerNode.attributes.text);
		}else{
			if ((pathObj.path_i + 1) >= pathObj.path_array.length) {
				findNodeList.push(nextNode);
				if(pathObj.select){
					dictTree.fireEvent('click', nextNode);
				}
				nextNode.init_text = nextNode.text;
				nextNode.setText("<font color=red>"+nextNode.text+"</font>");
			}else{
				if(!nextNode.find_path_array){
					nextNode.find_path_array = [];
				}
				nextNode.find_path_array.push(pathObj);
				addNodeToList(nodeList, nextNode);
			}
		}
	}
	for(var i=0;i<nodeList.length;i++){
		nodeList[i].expand(false, false, path_expand_callback);
	}
}

// 根据组织路径字符串，选中用户所在节点
function clickTableByPath(msg) {
	// 清空上次查询结果
	for(var i=0;i<findNodeList.length;i++){
		try{
			findNodeList[i].setText(findNodeList[i].init_text);
		}catch(e){}
	}
	findNodeList.length = 0;
	
	var pathList = Ext.decode(msg);
	var tmp = [];
	for(var i=0;i<pathList.length;i++){
		var obj = {
			path_array: pathList[i].split(","),
			path_i: 0
		};
		if(i==0){
			obj.select = true;
		}
		tmp.push(obj);
	}
	var oprNode = dictTree.root;
	oprNode.find_path_array = tmp;
	oprNode.expand(false, false, path_expand_callback);
}

// 初始化导入窗口
function initImportWindow() {
	importWindow = new Ext.Window({
		title : '导入数据字典',
		width : 450,
		height : 120,
		resizable : false,
		plain : true,
		closeAction : 'hide',
		modal : true,
		bodyStyle : 'padding:5px;',
		items : [new Ext.form.FormPanel({
			id : 'zipUploadForm',
			enctype : 'multipart/form-data',
			baseCls : 'x-plain',
			labelAlign : 'left',
			labelWidth : 55,
			height : 50,
			width : 410,
			fileUpload : true,
			url : 'dealDict.do?action=importDict',
			items : [{
						xtype : 'textfield',
						fieldLabel : '文件名称',
						id : 'import_uploadfile',
						name : 'zipfile',
						inputType : 'file',
						anchor : '100%'
					}, new Ext.Panel({
								baseCls : 'x-plain',
								html : '<font color=red id="import_valid_text"></font>'
							})]
		})],
		buttons : [{
					text : '导 入',
					handler : submitImportHandler
				}, {
					text : '关 闭',
					handler : function() {
						importWindow.setVisible(false);
					}
				}]
	});

	Ext.getCmp('import_uploadfile').on("blur", function() {
		// 验证传入的文件名是否为.zip
		var fileName = Ext.getCmp('import_uploadfile').getValue();
		var validResult = Ext.validUpZipFile(fileName);
		if (validResult != true) {
			document.getElementById('import_valid_text').innerHTML = validResult;
		} else {
			document.getElementById('import_valid_text').innerHTML = '';
		}
	});
}

// 执行导入按钮事件函数
function submitImportHandler() {
	var fileName = Ext.getCmp('import_uploadfile').getValue();
	var validResult = Ext.validUpZipFile(fileName);
	if (validResult != true) {
		return;
	}
	// 验证通过
	var form = Ext.getCmp('zipUploadForm').getForm();
	form.submit({
				method : 'post',
				waitMsg : '正在执行导入...',
				success : function(form, action) {
					importWindow.setVisible(false);
					reverseResultStore.removeAll();
					reverseResultStore.loadData(action.result.tables);
					reverseResultWindow.setTitle('导入数据字典结果');
					reverseResultWindow.show();
					dictTree.root.reload();
				},
				failure : function(form, action) {
					importWindow.setVisible(false);
					alert(action.result.errorMessage);
				}
			});
}

// 导出SQL按钮事件函数
function exportSQLHandler(dbType) {
	window.location = 'dealDict.do?action=exportSQL&dbType='+dbType;
}