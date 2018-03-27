Ext.ns("AtyCon");

/**
 * 数据字典 表列表
 */
AtyCon.TableManager = function() {
	/* ----------------------- private变量 ----------------------- */
	var init = false;		// 是否初始化
	var cardIndex = 0;		// 本模块的索引
	var menuObj;			// 目录信息
	var dataStore; 			// 数据源
	var tableGridPanel; 	// Grid面板
	var editTableWindow; 	// 编辑表窗口
	
	var dbName;
	var showName;
	var editTable_key;
	var desc;

	/* ----------------------- private方法 ----------------------- */

	// 更新表信息
	function updateTableHandler(){
		if (!dbName.validate()) {
			return;
		}
		if (!showName.validate()) {
			return;
		}
		editTableWindow.hide();
		var map = new Map();
		map.put("key", "dict.updateTable");
		map.put("dbname", dbName.getValue()); // 数据库表名
		map.put("showname", showName.getValue()); // 显示名称
		map.put("tableKey", editTable_key.getValue());			// key
		map.put("desc", desc.getValue()); // 描述
		map.put("id", editTableWindow.tableid); // 表编号
		Ext.get(document.body).mask("正在保存信息,请稍候...");
		var query = new QueryObj(map, function(query) {
			Ext.get(document.body).unmask();
			var msg = query.getDetail();
			if (msg == "-1") {
				showTips("更新表失败，数据库名重复", 1);
			} else if (msg == '-2') {
				showTips("更新表失败，显示名称重复", 1);
			} else if (msg == "-3") {
				showTips("更新表失败，表名称重复", 1);
			} else {
				showTips("更新表成功", 2);
				dataStore.reload();
				// 修改左边的节点
				if (selectedNode) {
					var no = selectedNode;
					if (!no.isLeaf()) {
						no.reload();
					}
				}
			}
		});
		query.send();
	}

	// 初始化编辑表窗口
	function initEditTableWindow() {
		dbName = new Ext.form.TextField({
			fieldLabel : '数据库表名',
			allowBlank : false,
			anchor : '100%'
		});
		showName = new Ext.form.TextField({
			fieldLabel : '显示名称',
			allowBlank : false,
			anchor : '100%'
		});
		editTable_key = new Ext.form.TextField({
			fieldLabel : 'key',
			anchor : '100%'
		});
		desc = new Ext.form.TextArea({
			fieldLabel : '描述',
			height : 85,
			anchor : '100%'
		});
		var form = new Ext.FormPanel({
			labelWidth : 85,
			baseCls : 'x-plain',
			items : [
				dbName,
				showName,
				editTable_key,
				desc
			]
		});
		editTableWindow = new Ext.Window({
			title : '编辑表',
			width : 450,
			height : 250,
			resizable : false,
			closeAction : 'hide',
			layout : 'fit',
			modal : true,
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			items : form,
			buttons : [{
				text : '修 改',
				handler : updateTableHandler
			}, {
				text : '取 消',
				handler : function() {
					editTableWindow.setVisible(false);
				}
			}]
		});
	}

	// 修改表的属性
	function editTableHandler(tableid) {
		Ext.get(document.body).mask("正在发送请求,请稍候...");
		// 从服务器获得表的属性
		var map = new Map();
		map.put("key", "dict.getTableInfo");
		map.put("id", tableid);
		var query = new QueryObj(map, function(query) {
			Ext.get(document.body).unmask();
			var tableInfo = Ext.decode(query.getDetail());
			dbName.setValue(tableInfo.dbName);
			showName.setValue(tableInfo.showName);
			desc.setValue(tableInfo.desc);
			editTableWindow.tableid = tableid;
			editTableWindow.show();
		});
		query.send();
	}

	// 初始化数据源
	function initDataStore() {
		dataStore = new Ext.data.JsonStore({
			url : 'dealDict.do?action=loadTableListJson',
			root : 'rows',
			totalProperty : "totalCount",
			fields : [{
				name : 'CDbname',
				mapping : 'CDbname'
			}, {
				name : 'CShowName',
				mapping : 'CShowName'
			}, {
				name : 'CDescription',
				mapping : 'CDescription'
			}, {
				name : 'CId',
				mapping : 'CId'
			}]
		});
		dataStore.on("load",function(ds){
			var jo = ds.reader.jsonData;
			menuObj = {
				cid: jo.menuid,
				name: jo.menuName
			};
			var tm = '<font color="red">'+menuObj.name+'</font> 目录下的数据库表';
			menuMsgText.getEl().innerHTML = tm;
		});
	}
	// 初始化Grid面板
	function initGridPanel() {
		menuMsgText = new Ext.Toolbar.TextItem("");
		tableGridPanel = new Ext.grid.GridPanel({
			header : false,
			title : '数据库表',
			stripeRows : true,
			enableDragDrop : false,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : false,
			ds : dataStore,
			plugins : new Ext.tusc.plugins.FilterGrid(),
			cm : new Ext.grid.ColumnModel([{
				header : "数据库表名",
				width : 150,
				sortable : false,
				dataIndex : 'CDbname',
				filter : true
			}, {
				header : "显示名称",
				width : 100,
				sortable : false,
				dataIndex : 'CShowName',
				filter : true
			}, {
				header : "描 述",
				width : 200,
				sortable : false,
				dataIndex : 'CDescription'
			}]),
			tbar : ["->",{text : '',disabled : true},menuMsgText]
		});

		tableGridPanel.on('rowdblclick', function(g, rowIndex, e) {
			var cid = dataStore.getAt(rowIndex).get('CId');
			editTableHandler(cid);
		});
	}

	// 延迟初始化本组件
	function doInit(){
		initEditTableWindow();
		initDataStore();
		initGridPanel();
		init = true;
	}

	/**
	 * 显示指定menu下的所有table
	 */
	function showTables(menuid,panel){
		if(!init){
			doInit();
			cardIndex = panel.items.length;
			panel.add(tableGridPanel);
		}
		
		panel.getLayout().setActiveItem(cardIndex);
		
		dataStore.load({
			params: {
				menuId: menuid
			}
		});
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		showTables: showTables
	};
}();