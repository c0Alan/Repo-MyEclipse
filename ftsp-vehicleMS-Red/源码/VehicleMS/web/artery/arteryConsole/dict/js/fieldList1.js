Ext.ns("AtyCon");

/**
 * 数据字典 字段管理
 */
AtyCon.FieldManager = function() {
	/* ----------------------- private变量 ----------------------- */
	var init = false;		// 是否初始化
	var draginit = false;	// 拖拽是否初始化
	var cardIndex = 0;		// 本模块的索引
	var tableObj;			// 数据字典表配置信息
	var dataStore; 			// 数据源
	var tableGridPanel; 	// Grid面板
	var tableMsgText;		// 表描述信息
	var fieldWindow; 		// 创建修改字段窗口
	var fieldWindow_button_submit;
	var dbTypeStore;
	
	// 字段公共属性
	var field_dbName;
	var field_pk;
	var field_defaultValue;
	var field_unique;
	var field_dbType;
	var field_dbmsType;		// 数据库类型
	
	var panel_type;
	
	var isModify = false;

	/* ----------------------- private方法 ----------------------- */

	/**
	 * 清空fieldWindow中的附加属性值 fieldWindow.show() 以后在调用此方法
	 */
	function clearFieldProp() {
		for(var p in panel_type){
			var fieldPanel = panel_type[p];
			for(var m in fieldPanel.propMap){
				fieldPanel.propMap[m].initFldVal();
			}
		}
	}

	// 组装Field参数到Map中
	function dealFieldParam() {
		var map = {};
		var dbType = field_dbType.getValue();
		map["fieldName"] = field_dbName.getValue();					// 字段名
		map["fieldType"] = dbType;									// 控件类型
		map["dbmsType"] = field_dbmsType.getValue();				// 数据库类型
		map["pk"] = field_pk.getValue();							// 是否主键
		map["defaultValue"] = field_defaultValue.getValue();		// 默认值
		map["unique"] = field_unique.getValue();					// 是否唯一
		// 根据字段类型，处理其他参数
		map["propMap"] = propValueToMap(panel_type[dbType]);
		return map;
	}

	// 创建字段事件函数
	function createFieldHandler() {
		if (fieldWindow.isVisible()) {
			return;
		}
		fieldWindow.setTitle("创建字段");
		fieldWindow_button_submit.setText("创 建");
		fieldWindow_button_submit.setHandler(insertFieldHandler);
		// 清空值
		field_dbName.setValue();
		field_defaultValue.setValue();
		fieldWindow.show();
		field_dbType.setValue(fieldTypeList[0].type);
		field_dbType.old_val = null;
		field_dbType.fireEvent('select',field_dbType);
		field_pk.setValue();
		field_unique.setValue();
		// 清空附加属性
		clearFieldProp();
	}

	// 验证插入或更新字段的合法性
	function validField(map, fieldid){
		if(Ext.isEmpty(map.fieldName)){
			showTips("字段名称不能为空", 1);
			return false;
		}
		if(Ext.isEmpty(map.propMap["label"])){
			showTips("显示名称（标签文字）不能为空", 1);
			return false;
		}
		for(var i=0;i<tableObj.fieldList.length;i++){
			var fld = tableObj.fieldList[i];
			if(fld.id==fieldid){
				continue;
			}
			if(map.fieldName==fld.fieldName){
				showTips("字段名称重复", 1);
				return false;
			}
			if(map.propMap["label"]==fld.propMap["label"]){
				showTips("显示名称（标签文字）重复", 1);
				return false;
			}
		}
		return true;
	}
	
	// 插入字段事件函数
	function insertFieldHandler() {
		var map = dealFieldParam();
		if(!validField(map)){
			return ;
		}
		
		Ext.Ajax.request({
			url : "dealDict.do?action=getFieldUUID",
			params : {},
			success : function(response, options) {
				fieldWindow.setVisible(false);
				map["id"] = response.responseText;
				tableObj.fieldList.push(map);
				arrayToStore();
				parent.showTips("新建字段成功", 2);
				isModify = true;
			}
		});
	}

	// 编辑字段事件函数
	function editFieldHandler(cid) {
		if (fieldWindow.isVisible()) {
			return;
		}
		for(var i=0;i<tableObj.fieldList.length;i++){
			var field = tableObj.fieldList[i];
			if(field.id==cid){
				editFieldCallback(field);
			}
		}
	}

	// 编辑字段回调函数
	function editFieldCallback(fieldInfo) {
		fieldWindow.custom_field_obj = fieldInfo;
		// 设置窗口的一些属性
		fieldWindow.setTitle("编辑字段");
		fieldWindow_button_submit.setText("更 新");
		fieldWindow_button_submit.setHandler(updateFieldHandler);
		field_dbName.setValue(fieldInfo.fieldName);
		field_defaultValue.setValue(fieldInfo.defaultValue);
		field_dbType.setValue(fieldInfo.fieldType);
		field_dbType.old_val = null;
		field_dbType.fireEvent('select', field_dbType); // 触发验证事件
		if(Ext.isEmpty(fieldInfo.dbmsType)){
			var dv = getFieldType(fieldInfo.fieldType).dbmsType;
			field_dbmsType.setValue(dv);
		}else{
			field_dbmsType.setValue(fieldInfo.dbmsType);
		}
		fieldWindow.show();
		field_pk.setValue(fieldInfo.pk);
		field_unique.setValue(fieldInfo.unique);

		// 清空属性值
		clearFieldProp();
		// 设置属性值
		mapToPropValue(panel_type[fieldInfo.fieldType], fieldInfo.propMap);
	}
	
	/**
	 * 获得默认的数据库类型
	 */
	function getFieldType(ft){
		for(var i=0;i<fieldTypeList.length;i++){
			if(fieldTypeList[i].type==ft){
				return fieldTypeList[i];
			}
		}
		return null;
	}

	// 更新字段事件函数
	function updateFieldHandler() {
		var map = dealFieldParam();
		var fieldObj = fieldWindow.custom_field_obj;
		if(!validField(map, fieldObj.id)){
			return ;
		}
		
		for(var p in map){
			fieldObj[p] = map[p];
		}
		msgTips = "更新字段成功";
		showTips(msgTips, 2);
		fieldWindow.setVisible(false);
		arrayToStore();
		isModify = true;
	}

	// 删除字段
	function deleteFieldHandler(cid) {
		// 找到记录
		var index = dataStore.findBy(function(record) {
			if (record.get('CId') == cid) {
				return true;
			} else {
				return false;
			}
		});
		var record = dataStore.getAt(index);
		Ext.Msg.show({
			title : '确认删除',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			msg : '确定要删除字段：' + record.get('CShowName') + '？',
			width : 350,
			fn : function(btn) {
				if (btn == 'yes') {
					for(var i=0;i<tableObj.fieldList.length;i++){
						if(tableObj.fieldList[i].id==cid){
							tableObj.fieldList.splice(i,1);
							showTips("删除成功", 2);
							arrayToStore();
							isModify = true;
							break;
						}
					}
				}
			}
		});
	}

	// 保存字段配置到服务器
	function saveFieldToServer(){
		var infoJson = Ext.encode(tableObj);
		Ext.Ajax.request({
			url : "dealDict.do?action=saveFields",
			params : {
				"tableInfo": infoJson
			},
			success : function(response, options) {
				var msg = response.responseText;
				if(msg=="1"){
					showTips("保存成功", 2);
					isModify = false;
				}else{
					showTips(msg, 4);
				}
			}
		});
	}
	
	// 初始化数据源
	function initDataStore() {
		dataStore = new Ext.data.ArrayStore({
			fields : [{
				name : 'CDbname'
			}, {
				name : 'CShowName'
			}, {
				name : 'NPk'
			}, {
				name : 'NFldtype'
			}, {
				name : 'CId'
			}]
		});
		dataStore.load = function(options){
			if(isModify){
				Ext.Msg.confirm('信息', "字段信息没有保存，确认要进行过滤吗？", function(btn){
           			if (btn == 'no') {
               			return ;
           			}
       			});
			}
			options = options || {};
    		this.fireEvent('beforeload', this, options);
    		// 从options中读取过滤信息，页面过滤
    		var filter = options.params.filter;
			dataStore.filterBy(function(record, id){
				var filterKeys = filter.split(";");
				var key;
				for(var i = 0; i < filterKeys.length; i++){
					if(!Ext.isEmpty(filterKeys[i])){
						key = filterKeys[i].split(":");
						if(record.get(key[0]).indexOf(key[1]) == -1){
							return false;
						}
					}
				}
				return true;
			});
			tableGridPanel.loadMask.hide();
		};
	}
	
	// 初始化Grid面板
	function initGridPanel() {
		tableMsgText = new Ext.Toolbar.TextItem("");
		tableGridPanel = new Ext.grid.GridPanel({
			header : false,
			title : '字段列表',
			stripeRows : true,
			loadMask : true,
			enableDragDrop : true,
			viewConfig : {
				forceFit : true
			},
			border : false,
			plugins : new Ext.tusc.plugins.FilterGrid(),
			ds : dataStore,
			cm : new Ext.grid.ColumnModel([{
				header : "主健",
				width : 15,
				sortable : false,
				dataIndex : 'NPk',
				renderer : pkRenderer
			}, {
				header : "字段名",
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
				header : "数据库类型",
				width : 100,
				sortable : false,
				dataIndex : 'NFldtype',
				filter : true,
				renderer : typeRenderer
			}, {
				header : "操作",
				width : 100,
				sortable : false,
				dataIndex : 'CId',
				renderer : operRenderer
			}]),
			tbar : [{
				text : '新建字段',
				iconCls : 'field-add',
				handler : function() {
					createFieldHandler();
				}
			},{
				text : "保存字段",
				iconCls : 'field-add',
				handler : function(){
					saveFieldToServer();
				}
			},'->',tableMsgText]
		});

		tableGridPanel.on('rowdblclick', function(g, rowIndex, e) {
			var cid = dataStore.getAt(rowIndex).get('CId');
			editFieldHandler(cid);
		});
	}

	// 数据库属性panel
	function fieldPanel_db() {
		field_dbName = new Ext.form.TextField({
			fieldLabel : '字段名',
			anchor : '98%'
		});
		field_defaultValue = new Ext.form.TextField({
			xtype : 'textfield',
			fieldLabel : '默认值',
			anchor : '99%'
		});
		field_pk = new Ext.form.Checkbox({
			fieldLabel : '主键',
			value : '1'
		});
		field_unique = new Ext.form.Checkbox({
			fieldLabel : '唯一'
		});
		
		var typeList = [];
		for(var i=0;i<fieldTypeList.length;i++){
			typeList.push([fieldTypeList[i].type,fieldTypeList[i].name]);
		}
		dbTypeStore = new Ext.data.SimpleStore({
			fields:['codeValue','codeName'],
			data:typeList
		});
		field_dbType = new Ext.form.ComboBox({
			fieldLabel : '控件类型',
			store : dbTypeStore,
			valueField : 'codeValue',
			displayField : 'codeName',
			typeAhead : true,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			allowBlank : false,
			anchor : '98%'
		});
		// 数据库类型combobox的选择验证
		field_dbType.on('select', dbTypeChangeHandler);
		var dbmsStore = new Ext.data.SimpleStore({
			fields: ['typeValue','typeName'],
			data: [
				['number','number'],
				['varchar','varchar'],
				['char','char'],
				['text','text'],
				['date','date'],
				['image','image']
			]
		});
		field_dbmsType = new Ext.form.ComboBox({
			fieldLabel: "数据类型",
			store: dbmsStore,
			valueField: 'typeValue',
			displayField: 'typeName',
			editable: false,
			mode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			anchor: '99%',
			doQuery: function(){
				this.onLoad();
			}
		});
		
		var dbp = new Ext.Panel({
			baseCls : 'x-plain',
			layout : 'column',
			items : [{
				columnWidth : .5,
				layout : 'form',
				labelWidth : 55,
				baseCls : 'x-plain',
				items : [
					field_dbName,
					field_pk,
					field_dbType
				]
			}, {
				columnWidth : .5,
				baseCls : 'x-plain',
				labelWidth : 55,
				layout : 'form',
				items : [
					field_defaultValue,
					field_unique,
					field_dbmsType
				]
			}]
		});
		var dbSet = new Ext.form.FieldSet({
			id : 'field_panel_db',
			title : '数据库属性',
			labelWidth : 55,
			layout : 'form',
			items : [dbp],
			width : 550
		});
		return dbSet;
	}
	
	/**
	 * 控件类型改变时，调用此方法
	 */
	function dbTypeChangeHandler(combo){
		var newType = combo.getValue();
		var oldType = combo.old_val;
		var propMap = null;
		if(oldType){
			propMap = propValueToMap(panel_type[oldType]);
		}
		for(var p in panel_type){
			panel_type[p].setVisible(newType==p);
		}
		fieldWindow.doLayout();
		var fieldType = getFieldType(newType);
		if(fieldType){
			field_dbmsType.setValue(fieldType.dbmsType);
		}
		combo.old_val = newType;
		if(oldType){
			if(fieldWindow.custom_field_obj){
				var fldPropMap = fieldWindow.custom_field_obj.propMap;
				for(var p in fldPropMap){
					if(propMap[p]===undefined){
						propMap[p] = fldPropMap[p];
					}
				}
			}
			mapToPropValue(panel_type[newType], propMap);
		}
	}
	
	// 从输入框中收集值
	function propValueToMap(item_panel){
		var itemMap = item_panel["propMap"];
		var propMap = {};
		for(var p in itemMap){
			propMap[p] = itemMap[p].getValue();
		}
		return propMap;
	}
	
	// 把值写入到输入框
	function mapToPropValue(item_panel, propMap){
		var itemMap = item_panel["propMap"];
		for(var p in itemMap){
			if(propMap[p]===undefined){
				itemMap[p].initFldVal();
			}else{
				itemMap[p].setValue(propMap[p]);
			}
		}
	}

	// 根据属性配置创建输入控件
	function createPropField(propType){
		var propField;
		// comment特殊处理
		if(propType.name=="comment"){
			propField = new Ext.form.TextArea({
				fieldLabel : propType.desc,
				height: 48,
				initFldVal : function(){
					this.setValue();
				}
			});
		}else if(propType.optionList.length<1){
			propField = new Ext.form.TextField({
				fieldLabel : propType.desc,
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
	
	// 属性panel
	function fieldPanel_prop() {
		var pp = new Ext.form.FieldSet({
			title : '类型属性',
			autoHeight: true,
			labelWidth : 55,
			width : 550
		});
		
		panel_type = {};
		for(var i=0;i<fieldTypeList.length;i++){
			var fieldType = fieldTypeList[i];
			var group1 = [], group2 = [], propMap = {};
			for(var j=0;j<fieldType.propList.length;j++){
				var propType = fieldType.propList[j];
				var propField = createPropField(propType);
				propMap[propType.name] = propField;
				if(j%2==0){
					group1.push(propField);
					propField.anchor = '98%';
				}else{
					group2.push(propField);
					propField.anchor = '100%';
				}
			}
			var fieldPanel = new Ext.Panel({
				baseCls : 'x-plain',
				layout : 'column',
				items : [{
					columnWidth : .5,
					layout : 'form',
					labelWidth : 90,
					baseCls : 'x-plain',
					items : group1
				}, {
					columnWidth : .5,
					baseCls : 'x-plain',
					labelWidth : 90,
					layout : 'form',
					items : group2
				}],
				propMap : propMap
			});
			panel_type[fieldType.type] = fieldPanel;
			pp.add(fieldPanel);
		}
		
		return pp;
	}

	// 初始化字段窗口
	function initFieldWindow() {
		var dbPanel = fieldPanel_db();
		var propPanel = fieldPanel_prop();
		fieldWindow_button_submit = new Ext.Button({
			minWidth: 80,
			text : '修 改',
			handler : function() {
				alert('单击了处理按钮');
			}
		});
		fieldWindow = new Ext.Window({
			title : '创建字段',
			width : 600,
			height : 370,
			resizable : false,
			autoScroll : true,
			closeAction : 'hide',
			bodyStyle : 'padding:5px;',
			modal : true,
			plain : true,
			items : [dbPanel, propPanel],
			buttons : [fieldWindow_button_submit, {
				minWidth: 80,
				text : '取 消',
				handler : function() {
					fieldWindow.setVisible(false);
				}
			}],
			y : 20
		});
	}

	// 主健renderer
	function pkRenderer(value) {
		if (value == '1') {
			return "<img src='../pub/images/icon/pkey.gif'>";
		} else {
			return "";
		}
	}

	// 数据库类型renderer
	function typeRenderer(value) {
		var cIndex = dbTypeStore.find("codeValue", value);
		if (cIndex != -1) {
			var d = dbTypeStore.getAt(cIndex);
			return d.get("codeName");
		} else {
			return "";
		}
	}

	// 操作renderer
	function operRenderer(value) {
		var re = "<a href='javascript:AtyCon.FieldManager.editField(\"" + value
				+ "\")'>" + "<img src='../pub/images/icon/edit.gif'></a>";
		re = re + "&nbsp;<a href='javascript:AtyCon.FieldManager.deleteField(\"" + value
				+ "\")'>" + "<img src='../pub/images/icon/del.gif'></a>"
		return re;
	}
	
	// 延迟初始化本组件
	function doInit(){
		initDataStore();
		initFieldWindow();
		initGridPanel();
		init = true;
	}
	
	/**
	 * 显示指定table的所有field
	 */
	function showFields(tableid,panel){
		if(!init){
			doInit();
			cardIndex = panel.items.length;
			panel.add(tableGridPanel);
		}
		
		panel.getLayout().setActiveItem(cardIndex);
		
		if(!draginit){
			draginit = true;
			enableDrop();
		}
		
		Ext.Ajax.request({
			url : "dealDict.do?action=loadFieldListJson",
			params : {
				"tableId": tableid
			},
			success : function(response, options) {
				//alert(response.responseText);
				tableObj = Ext.decode(response.responseText);
				var tm = tableObj.showName + '( <font color="red">'
				   + tableObj.tableName + '</font> ) 表下的字段列表，共<font color=red>'
				   + tableObj.fieldList.length + "</font>个字段";
				tableMsgText.setText(tm);
				arrayToStore();
				isModify = false;
			}
		});
	}
	
	// 加载字段到store中
	function arrayToStore(){
		var fa = [];
		for(var i=0;i<tableObj.fieldList.length;i++){
			var fo = tableObj.fieldList[i];
			fa.push([
				fo.fieldName,
				fo.propMap.label,
				fo.pk,
				fo.fieldType,
				fo.id
			]);
		}
		dataStore.loadData(fa);
	}
	
	// 拖拽操作
	function enableDrop(){
		new Ext.dd.DropTarget(tableGridPanel.container, {
			ddGroup : 'GridDD',
			copy : false,
			notifyDrop : function(dd, e, data) {
				// 选中了哪些行
				var rows = data.selections;
				// 拖动到第几行
				var index = dd.getDragData(e).rowIndex;
				if (typeof(index) == "undefined") {
					return;
				}

				var oldList = tableObj.fieldList;
				var tmpList = [];
				var newList = [];
				var selectStart;
				for(var i=0;i<rows.length;i++){
					var cid = rows[i].get("CId");
					for(var j=0;j<oldList.length;j++){
						if(oldList[j].id==cid){
							tmpList.push(oldList[j]);
							oldList[j] = "aaa";
							break;
						}
					}
				}
				for(var i=0;i<oldList.length;i++){
					if(i<index){
						if(oldList[i]!="aaa"){
							newList.push(oldList[i]);
						}
					}else if(i==index){
						selectStart = newList.length;
						for(var j=0;j<tmpList.length;j++){
							newList.push(tmpList[j]);
						}
						if(oldList[i]!="aaa"){
							newList.push(oldList[i]);
						}
					}else{
						if(oldList[i]!="aaa"){
							newList.push(oldList[i]);
						}
					}
				}
				tableObj.fieldList = newList;
				arrayToStore();
				tableGridPanel.getSelectionModel().selectRange(selectStart, selectStart+tmpList.length-1);
				showTips("显示顺序调整成功", 2);
				isModify = true;
			}
		});
	}
	
	// 如果字段修改过，则返回true
	function checkModify(){
		return isModify;
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		// 编辑字段
		editField : function(cid) {
			editFieldHandler(cid);
		},
		// 删除字段
		deleteField : function(cid) {
			deleteFieldHandler(cid);
		},
		showFields: showFields,
		isModify: checkModify
	};
}();