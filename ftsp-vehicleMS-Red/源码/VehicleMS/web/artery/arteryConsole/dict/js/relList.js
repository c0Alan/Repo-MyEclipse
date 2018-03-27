GridObject = function() {
	/* ----------------------- private变量 ----------------------- */
	var dataStore; // 数据源
	var relGridPanel; // Grid面板
	var relWindow; // 表间关系窗口
	var relWindow_props; // 表间关系扩展属性
	var relWindow_button_submit;
	var mainStore; // 主表Store
	var subStore; // 子表Store
	
	var rel_main_table;
	var rel_main_key;
	var rel_main_tablename;
	var rel_main_rk;
	var rel_sub_table;
	var rel_sub_key;
	var rel_sub_tablename
	var rel_sub_fk;
	var rel_cascade_true;
	var rel_cascade_false;
	var pageSizeConfig = 20;
	
	var tempMainTable = '';
	var tempMainKey = '';
	var tempSubTable = '';
	var tempSubKey = '';

	/* ----------------------- private方法 ----------------------- */

	// 组装参数到Map中，如果验证失败，则返回false
	function dealRelParam(map) {
		// 处理主表
		var temp;
		if (tempMainTable == '') {
			alert('主表为空');
			return false;
		} else {
			map.put('rel.mainTableId', tempMainTable);
		}
		//处理主key
		temp = rel_main_key.getValue();
		if(temp!='' && tempMainKey && tempMainKey.indexOf(","+temp+",")==-1){
			alert('主Key只能为空或其中之一');
			return false;
		}else{
			map.put('rel.mainKey',temp);
		}
		// 处理关联字段
		temp = rel_main_rk.getValue();
		if (temp == '') {
			alert('主表关联字段为空');
			return false;
		} else {
			map.put('rel.mainTblPkId', temp);
		}
		// 处理子表
		//temp = rel_sub_table.getValue();
		if (tempSubTable == '') {
			alert('子表为空');
			return false;
		} else {
			map.put('rel.subTableId', tempSubTable);
		}
		//处理子key
		temp = rel_sub_key.getValue();
		if(temp!='' && tempSubKey && tempSubKey.indexOf(","+temp+",")==-1){
			alert('子Key只能为空或其中之一');
			return false;
		}else{
			map.put('rel.subKey',temp);
		}
		// 处理外键字段名
		temp = rel_sub_fk.getValue();
		if (temp == '') {
			alert('子表外键为空');
			return false;
		} else {
			map.put('rel.subTblFkId', temp);
		}
		// 处理级联删除
		if (rel_cascade_true.getValue()) {
			map.put('rel.cascadeDelete', 'true');
		} else {
			map.put('rel.cascadeDelete', 'false');
		}
		// 处理扩展属性
		var extendprop = {};
		for(var p in relWindow_props){
			var val = relWindow_props[p].getValue();
			if(!Ext.isEmpty(val)){
				extendprop[p] = val;
			}
		}
		map.put("extendprop", Ext.encode(extendprop));
		return true;
	}

	// 创建表间关系事件函数
	function createRelHandler() {
		if (relWindow.isVisible()) { // 如果窗口没有关闭，则什么也不做
			return;
		}
		relWindow.setTitle('新建表间关系');
		relWindow_button_submit.setText('创 建');
		relWindow_button_submit.setHandler(insertRelHandler);
		relWindow.show();
		// 清空一些信息
		relWindow.custom_relObj = null;
		rel_main_table.clearValue();
		rel_main_key.setValue('');
		rel_main_tablename.setValue('');
		rel_main_rk.clearValue();
		rel_sub_table.clearValue();
		rel_sub_key.setValue('');
		rel_sub_tablename.setValue('');
		rel_sub_fk.clearValue();
		rel_cascade_true.setValue(true);
		rel_cascade_false.setValue(false);
		for(var p in relWindow_props){
			relWindow_props[p].initFldVal();
		}
	}

	// 插入表间关系
	function insertRelHandler() {
		var map = new Map();
		if (!dealRelParam(map)) {
			alert('验证失败');
			return;
		}
		// 验证通过
		map.put("key", "rel.insertRel");
		var query = new QueryObj(map, function(query) {
			relWindow.setVisible(false);
			var msg = query.getDetail();
			var msgTips = "";
			if (msg == "1") {
				showTips("新建表间关系成功", 2);
				dataStore.reload();
			} else {
				showTips(msg, 4);
			}
		});
		query.send();
	}

	// 编辑关系事件函数
	function editRelHandler(relId) {
		if (relWindow.isVisible()) { // 如果窗口没有关闭，则什么也不做
			return;
		}
		relGridPanel.body.mask("正在发送请求,请稍候...");
		// 从服务器获得表间关系的属性
		var map = new Map();
		map.put("key", "rel.getRelInfo");
		map.put("relId", relId);
		var query = new QueryObj(map, function(query) {
			relGridPanel.body.unmask();
			
			var relInfo = Ext.decode(query.getDetail());
			editRelCallback(relInfo);
		});
		query.send();
	}

	// 编辑关系回调函数
	function editRelCallback(relInfo) {
		relWindow.custom_relObj = relInfo;
		relWindow.custom_first_main = true;
		relWindow.custom_first_sub = true;
		relWindow.show();
		// 设置一些属性
		relWindow.setTitle('编辑表间关系');
		relWindow_button_submit.setText('更 新');
		relWindow_button_submit.setHandler(updateRelHandler);
		// 把表间关系值置入relWindow
		if (relInfo.cascadeDelete == 'true') {
			rel_cascade_true.setValue(true);
			rel_cascade_false.setValue(false);
		} else {
			rel_cascade_true.setValue(false);
			rel_cascade_false.setValue(true);
		}
		rel_main_table.setValue(relInfo.mainTable);
		mainStore.baseParams.tableId = relInfo.mainTable;
		mainStore.reload();
		rel_sub_table.setValue(relInfo.subTable);
		subStore.baseParams.tableId = relInfo.subTable;
		subStore.reload();
		rel_main_key.setValue(relInfo.mainKey);
		rel_main_tablename.setValue(getTableNamebyTable(rel_main_table.getRawValue()));
		rel_sub_key.setValue(relInfo.subKey);
		rel_sub_tablename.setValue(getTableNamebyTable(rel_sub_table.getRawValue()));
		tempMainTable = relInfo.mainTable;
		tempSubTable = relInfo.subTable;
		//alert(getKeybytable(rel_main_table.getRawValue()));
		tempMainKey = ","+getKeybytable(rel_main_table.getRawValue())+",";
		tempSubKey = ","+getKeybytable(rel_sub_table.getRawValue())+",";
		// 设置扩展属性
		for(var p in relWindow_props){
			var propfield = relWindow_props[p];
			var propValue = relInfo.propMap[p];
			if(propValue===undefined){
				propfield.initFldVal();
			}else{
				propfield.setValue(propValue);
			}
		}
	}

	// 更新表间关系
	function updateRelHandler() {
		var map = new Map();
		// 如果验证没有通过，则什么也不做
		if (!dealRelParam(map)) {
			return;
		}

		map.put("key", "rel.updateRel");
		map.put("rel.id", relWindow.custom_relObj.id); // 设置记录的主键
		var query = new QueryObj(map, function(query) {
			relWindow.setVisible(false);
			var msg = query.getDetail();
			if (msg == "1") {
				showTips("更新表间关系成功", 2);
				dataStore.reload();
			} else {
				showTips(msg, 4);
			}
		});
		query.send();
	}

	// 删除表间关系事件函数
	function deleteRelHandler(relId) {
		// 找到记录
		var index = dataStore.find('C_ID', relId);
		Ext.Msg.show({
			title : '确认删除',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			msg : '确定要删除表间关系？',
			width : 350,
			fn : function(btn) {
				if (btn == 'yes') {
					var map = new Map();
					map.put("key", "rel.deleteRel");
					map.put("relId", relId);
					var query = new QueryObj(map, function(query) {
						var msg = query.getDetail();
						if (msg != "1") {
							parent.showTips(msg, 1);
						} else {
							parent.showTips("删除成功", 2);
							dataStore.reload();
						}
					});
					query.send();
				}
			}
		});
	}

	// 初始化数据源
	function initDataStore() {		
		dataStore = new Ext.data.JsonStore({
			url : 'dealRel.do?action=loadRelListJson',
			root : 'rows',
			totalProperty: 'totalCount',
			fields : [{
				name : 'mainTable'
			}, {
				name : "mainKey"
			}, {
				name : 'mainField'
			}, {
				name : 'subTable'
			}, {
				name : "subKey"
			}, {
				name : 'subField'
			}, {
				name : 'cascadeDelete'
			}, {
				name : 'cid'
			}]
		});
		// 字段列表Store
		mainStore = new Ext.data.JsonStore({
			url : 'dealRel.do?action=loadFieldListJson',
			root : 'fields',
			fields : [{
				name : 'fieldId'
			}, {
				name : 'showName'
			}]
		});
		mainStore.on("load", function() {
			if (relWindow.custom_relObj) {
				if (relWindow.custom_first_main) {
					rel_main_rk.setValue(relWindow.custom_relObj.mainField);
					relWindow.custom_first_main = false;
				}
			}
		});
		subStore = new Ext.data.JsonStore({
			url : 'dealRel.do?action=loadFieldListJson',
			root : 'fields',
			fields : [{
				name : 'fieldId'
			}, {
				name : 'showName'
			}]
		});
		subStore.on("load", function() {
			if (relWindow.custom_relObj) {
				if (relWindow.custom_first_sub) {
					rel_sub_fk.setValue(relWindow.custom_relObj.subField);
					relWindow.custom_first_sub = false;
				}
			}
		});
	}

	// 初始化Grid面板
	function initGridPanel() {
		relGridPanel = new Ext.grid.GridPanel({
			header : false,
			region : 'center',
			margins : '4 4 4 4',
			stripeRows : true,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : true,
			ds : dataStore,
			cm : new Ext.grid.ColumnModel([{
				header : "主key",
				width : 50,
				sortable : false,
				dataIndex : "mainKey"
			}, {
				header : "主表名",
				width : 100,
				sortable : false,
				dataIndex : 'mainTable'
			}, {
				header : "关联字段名",
				width : 100,
				sortable : false,
				dataIndex : 'mainField'
			}, {
				header : "子key",
				width: 50,
				sortable : false,
				dataIndex : "subKey"
			}, {
				header : "子表名",
				width : 100,
				sortable : false,
				dataIndex : 'subTable'
			}, {
				header : "外键字段名",
				width : 100,
				sortable : false,
				dataIndex : 'subField'
			}, {
				header : "级联删除",
				Width : 30,
				sortable : false,
				dateIndex : 'cascadeDelete',
				renderer : casRenderer
			}, {
				header : "操作",
				Width : 60,
				sortable : false,
				dateIndex : 'cid',
				renderer : operRenderer
			}]),
			bbar : new Ext.PagingToolbar({
				pageSize : pageSizeConfig,
				store : dataStore,
				displayInfo : true,
				displayMsg : '本页显示:{0} - {1} 总记录数:{2}',
				emptyMsg : "无记录"
			}),
			tbar : [{
				text : '新建关系',
				cls : 'x-btn-text-icon add',
				handler : createRelHandler
				}, '->',
				'<font color="red">表间关系</font>&nbsp;&nbsp;'
			]
		});

		// 双击行编辑"表间关系"
		relGridPanel.on('rowdblclick', function(g, rowIndex, e) {
			//Artery.showMessage("刷新数据.....");
			searchData('main','');
			searchData('sub','');
			var cid = dataStore.getAt(rowIndex).get('cid');
			editRelHandler(cid)
		});

		new Ext.Viewport({
			layout : 'border',
			border : false,
			hideBorders : true,
			items : [relGridPanel]
		});
		
		dataStore.load({params:{start:0, limit:pageSizeConfig}});
	}

	// 根据属性配置创建输入控件
	function createRelPropField(propType){
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
	
	// 初始化RelWindow
	function initRelWindow() {
		rel_main_table = new Ext.form.ComboBox({
			fieldLabel : '主表名',
			store : tableStore,
			valueField : 'tableId',
			displayField : 'tableName',
			typeAhead : false,
			editable : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		rel_main_key = new Ext.form.TextField({
			fieldLabel : '主Key',
			value : '',
			anchor : '80%'
		});
		rel_main_tablename = new Ext.form.TextField({
			fieldLabel : '主表名',
			value : '',
			disabled: true,
			anchor : '80%'
		});
		rel_main_rk = new Ext.form.ComboBox({
			fieldLabel : '关联字段名',
			store : mainStore,
			valueField : 'fieldId',
			displayField : 'showName',
			typeAhead : true,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		rel_sub_table = new Ext.form.ComboBox({
			fieldLabel : '子表名',
			store : subtableStore,
			valueField : 'tableId',
			displayField : 'tableName',
			typeAhead : false,
			editable : true,
			mode : 'local',
			triggerAction : 'all',
			allowBlank : false,
			anchor : '100%'
		});
		rel_sub_key = new Ext.form.TextField({
			fieldLabel : '子Key',
			value : '',
			anchor : '80%'
		});
		rel_sub_tablename = new Ext.form.TextField({
			fieldLabel : '子表名',
			value : '',
			disabled: true,
			anchor : '80%'
		});
		rel_sub_fk = new Ext.form.ComboBox({
			fieldLabel : '外键字段名',
			store : subStore,
			valueField : 'fieldId',
			displayField : 'showName',
			typeAhead : true,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		rel_cascade_true = new Ext.form.Radio({
			name : 'cascade_type',
			checked : true,
			boxLabel : '是'
		});
		rel_cascade_false = new Ext.form.Radio({
			name : 'cascade_type',
			boxLabel : '否'
		});
		var panelitems = [
			rel_main_table,
			rel_main_key,
			rel_main_tablename,
			rel_main_rk,
			rel_sub_table,
			rel_sub_key,
			rel_sub_tablename,
			rel_sub_fk, {
				baseCls : 'x-plain',
				layout : 'column',
				items : [{
					columnWidth : .23,
					baseCls : 'x-plain',
					html : '级联删除:'
				}, {
					columnWidth : .21,
					baseCls : 'x-plain',
					items : [rel_cascade_true]
				}, {
					columnWidth : .56,
					baseCls : 'x-plain',
					items : [rel_cascade_false]
				}]
			}
		];
		var panelheight = 330;
		relWindow_props = {};
		if(relExtendList && relExtendList.length>0){
			for(var i=0;i<relExtendList.length;i++){
				var propType = relExtendList[i];
				var propfld = createRelPropField(propType);
				if(propType.propType=="textarea"){
					panelheight += 56;
				}else{
					panelheight += 28;
				}
				relWindow_props[propType["name"]] = propfld;
				panelitems.push(propfld);
			}
		}
		
		relWindow_button_submit = new Ext.Button({
			text : '创 建',
			handler : function() {
				alert('单击了处理按钮');
			}
		});
		//throw e;
		relWindow = new Ext.Window({
			title : '新建表间关系',
			width : 400,
			height : panelheight,
			labelWidth : 75,
			layout : 'form',
			resizable : false,
			closeAction : 'hide',
			bodyStyle : 'padding:5px;',
			closable : false,
			plain : true,
			items : panelitems,
			buttons : [relWindow_button_submit, {
				text : '取 消',
				handler : function() {
					//Artery.showMessage("刷新数据.....");
					searchData('main','');
					searchData('sub','');
					relWindow.setVisible(false);
				}
			}]
		});
		// 注册事件函数
		rel_main_table.on("select", function(combo, record, index) {
			rel_main_rk.clearValue();
			mainStore.baseParams.tableId = record.get('tableId');
			tempMainKey = getKeybytable(record.get("tableName"));
			rel_main_key.setValue(tempMainKey);
			tempMainKey = ","+tempMainKey+",";
			tempMainTable = record.get('tableId');
			rel_main_tablename.setValue(getTableNamebyTable(record.get("tableName")));
			mainStore.reload();
		});
		
		rel_main_table.on("blur", function(combo){
			try{
				//手输时才重新绑定
				if(tempMainTable!=rel_main_table.getValue() || rel_main_table.getValue()==''){
					//rel_main_table.clearValue();
					refreshData('main',true);
					//tableStore.setValue(rel_main_table.getValue());
				}
			}catch(e){
			}
		});

		rel_sub_table.on("select", function(combo, record, index) {
			rel_sub_fk.clearValue();
			subStore.baseParams.tableId = record.get('tableId');
			tempSubKey = getKeybytable(record.get("tableName"));
			rel_sub_key.setValue(tempSubKey);
			tempSubKey = ","+tempSubKey+",";
			tempSubTable = record.get('tableId');
			rel_sub_tablename.setValue(getTableNamebyTable(record.get("tableName")));
			subStore.reload();
		});
		
		rel_sub_table.on("blur", function(combo){
			try{
				//手输时才重新绑定
				if(tempSubTable!=rel_sub_table.getValue() || rel_sub_table.getValue()==''){
					//rel_main_table.clearValue();
					refreshData('sub',true);
					//tableStore.setValue(rel_main_table.getValue());
				}
			}catch(e){
			}
		});
	}
	
	//根据table获得key
	function getKeybytable(table){
		if(table && table.indexOf("]")>-1)
			return table.split("]")[0].replace("[","");
		return "";
	}
	//根据table获得tablename
	function getTableNamebyTable(table){
		if(table){
			if(table.indexOf("]")>-1 && table.indexOf("]")!=table.length)
				return table.split("]")[1];
		}else{
			table = "";
		}
		return table;
	}
	//刷新数据
	function refreshData(type,showMsg){
		if(type=='main'){
			rel_main_tablename.setValue('');
			rel_main_key.setValue('');
			tempMainTable = '';
			if(showMsg){
				Artery.showMessage("刷新主表名，搜索：【"+rel_main_table.getValue()+"】")
			}
			searchData(type,rel_main_table.getValue());
		}else if(type=='sub'){
			rel_sub_tablename.setValue('');
			rel_sub_key.setValue('');
			tempSubTable ='';
			if(showMsg){
				Artery.showMessage("刷新子表名，搜索：【"+rel_sub_table.getValue()+"】")
			}
			searchData(type,rel_sub_table.getValue());
		}
	}
	function searchData(type,value){
		if(type=='main'){
			tableStore.baseParams.searchtable = value;
			tableStore.reload();
		}else if(type=='sub'){
			subtableStore.baseParams.searchtable = value;
			subtableStore.reload();
		}
	}

	// 级联删除renderer
	function casRenderer(value) {
		if (value == "true") {
			return "是";
		} else {
			return "否";
		}
	}

	// 操作renderer
	function operRenderer(value) {
		var re = "<a href='javascript:GridObject.editRel(\"" + value + "\")'>"
				+ "<img src='../pub/images/icon/edit.gif'></a>";
		re = re + "&nbsp;<a href='javascript:GridObject.deleteRel(\"" + value
				+ "\")'>" + "<img src='../pub/images/icon/del.gif'></a>"
		return re;
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		// 初始化方法
		init : function() {
			initDataStore();
			initRelWindow();
			initGridPanel();
		},
		// 编辑关系方法
		editRel : function(relId) {
			editRelHandler(relId);
		},
		// 删除关系方法
		deleteRel : function(relId) {
			deleteRelHandler(relId);
		}
	};
}();

Ext.onReady(GridObject.init);