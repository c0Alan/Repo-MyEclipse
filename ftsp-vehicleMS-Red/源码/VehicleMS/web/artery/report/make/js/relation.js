var params = {};
var store, storeData;

var selectId = "";	// 选中行idx
var selectRel = {};	// 选中的rel

var relationData;	// 关联数据
var relGrid;		// 关联列表
var relationWin;	// 编辑窗口
var relationForm;

var relationPanel;
var relationName;
var relationType;
var relationOption;

var urlPanel;
var urlAddInf;

var urlWin;
var urlForm;

// 初始化关联grid
function initRelGrid(){
	var reader = new Ext.data.ArrayReader({}, [{
		name : 'name'
	}, {
		name : 'resourcename'
	}, {
		name : 'targetName'
	}, {
		name : 'target'
	}, {
		name : 'description'
	}, {
		name : 'CId'
	}]);

	// row expander
	var expander = new Ext.grid.RowExpander({
		tpl : new Ext.Template('', '<p> {description}</p>')
	});
	relationData = document.getElementById("relationStr").value;
	if (relationData == "" || relationData == " " || relationData == null) {
		relationData = "<?xml version=\"1.0\" encoding=\"GBK\"?>"
				+ "<relations>" + "</relations>";
	}
	storeData = eval(getStoreData(relationData));
	store = new Ext.data.Store({
		reader : reader,
		data : storeData
	});
	// 定义视图按钮
	var refreshButton = new Ext.Button({
		text : 'xml源码',
		tooltip : 'xml源码,您可以直接修改源码',
		handler : function(item) {
			openXml(relationData, 9);
		}
	});
	relGrid = new Ext.grid.GridPanel({
		store : store,
		border : false,
		plugins : expander,
		collapsible : false,
		animCollapse : false,
		iconCls : 'icon-grid',
		viewConfig : {
			forceFit : true
		},
		cm : new Ext.grid.ColumnModel([expander, {
			header : "关联名称",
			width : 200,
			dataIndex : 'name'
		}, {
			header : "关联模板/链接",
			width : 400,
			dataIndex : 'resourcename'
		}, {
			header : "目标",
			width : 200,
			dataIndex : 'targetName'
		}, {
			header : "操作",
			dataIndex : 'CId',
			renderer : operRenderer
		}]),
		tbar : [{
			text : '新建',
			cls : 'x-btn-text-icon add',
			tooltip : '新建',
			handler : createRelHandler
		}, {
			id : "button_save",
			text : '保存',
			cls : 'x-btn-text-icon save',
			tooltip : '保存',
			handler : saveRelation
		}, {
			text : "预览",
			cls : 'x-btn-text-icon preview',
			handler : previewForm
		}, {
			xtype : 'tbfill'
		}, refreshButton]
	});
	relGrid.on('rowdblclick', function(g, rowIndex, e) {
		var rec = store.getAt(rowIndex);
		var cid = rec.get('CId');
		var orderName = rec.get("orderName");
		var fieldName = rec.get("fieldName");
		var def = rec.get("Default");
		editRelation(cid, orderName, fieldName, def, rowIndex)
	});
}

// 创建关联
function createRelHandler(){
	selectId = "";
	openRelation(1);
	relationName.setValue("");
	relationType.setValue("1");
	relationOption.setValue("");
	urlForWin = "";
	locationForWin = "";
	widthForWin = "";
	heightForWin = "";
	urlParams = "<?xml version=\"1.0\"?><dslist></dslist>";
	try {
		eformtpl.ds = urlParams;
		eformtpl.dom = loadXMLString(eformtpl.ds);
		initStore();
	} catch (e) {
	}
}

Ext.onReady(function() {
	Ext.QuickTips.init();
	initRelGrid();
	initUrlWin();
	initRelWindow();
	// try {
	// formatXml(relationData);// 格式化一下，避免发生意想不到的错
	// } catch (e) {
	//
	// }
	// store.load();
	var viewPort = new Ext.Viewport({
		layout : 'fit',
		border : false,
		hideBorders : true,
		items : [relGrid]
	});
});

function saveRelation() {
	var templateId = reportParams.id;
	var map = new Map();
	map.put("key", "template.relation.save");
	map.put("id", templateId);
	map.put("complibId", reportParams.complibId);
	map.put("relationData", relationData);
	var query = new QueryObj(map, relationCallback);
	query.send();
}

// 保存回调函数
function relationCallback(query) {
	if (!query.isResultOK()) {
		showTips("未知系统错误,请检查格式", 4);
		return;
	}
	showTips("保存关联信息成功", 2);
}

function initUrlPanel(){
	urlAddInf = new Ext.form.TriggerField({
		triggerClass : "x-form-search-trigger",
		fieldLabel : 'url地址',
		width : 198,
		name : 'urlAdd',
		id : 'urlAdd',
		anchor : '100%',
		readOnly : true,
		onTriggerClick: function(){
			openUrlWin();
		}
	});
	urlPanel = new Ext.Panel({
		id : 'two',
		baseCls : 'x-plain',
		layout : 'column',
		items : [{
			columnWidth : 1,
			layout : 'form',
			labelWidth : 60,
			width : 198,
			baseCls : 'x-plain',
			defaultType : 'textfield',
			items : [urlAddInf]
		}]
	});
}

function initLinktoPanel(){
	relationOption = new Ext.form.TriggerField({
		triggerClass : "x-form-search-trigger",
		fieldLabel : '关联模板',
		width : 198,
		anchor : '100%',
		id : 'relationTmp',
		readOnly : true
	});
	
	relationOption.onTriggerClick = function() {
		var startInfo;
		if (selectRel.type == "report") {
			startInfo = Ext.decode(selectRel.linkto);
		} else {
			startInfo = null;
		}
		FormEditor.init();
		FormEditor.edit(function(info) {
			var fi = Ext.encode(info);
			if(selectRel==null){
				selectRel = {};
			}
			selectRel.linkto = fi;
			relationOption.setValue(info.formName);
			selectRel.valueName = info.formName;
			selectRel.target = info.target;
			selectRel.targetWidth = info.targetWidth;
			selectRel.targetHeight = info.targetHeight;
			selectRel.formId = info.formId;
			selectRel.formType = info.formType;
			selectRel.runTimeType = info.runTimeType;
			selectRel.params = info.params;
		}, startInfo);
	};
	
	relationPanel = new Ext.Panel({
		id : 'one',
		baseCls : 'x-plain',
		layout : 'column',
		items : [{
			columnWidth : 1,
			layout : 'form',
			labelWidth : 60,
			width : 198,
			anchor : '100',
			baseCls : 'x-plain',
			defaultType : 'textfield',
			items : [relationOption]
		}]
	});
}
		
// 初始化rel窗口
function initRelWindow(){
	initUrlPanel();
	initLinktoPanel();
	
	relationName = new Ext.form.NumberField({
		fieldLabel : '关联rel',
		name : 'relationName',
		id : 'relationName',
		width : 198,
		maxLength : 50,
		anchor : '100%',
		allowBlank : false
	});
	relationType = new Ext.form.ComboBox({
		fieldLabel : '类型',
		id : 'relationType',
		name : 'relationType',
		editable : false,
		width : 200,
		anchor : '100%',
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [[1, '表单'], [2, '链接']]
		}),
		value : 1,
		triggerAction : 'all',
		mode : 'local',
		valueField : 'value',
		displayField : 'text'
	});
	relationType.on('select', function(combo) {
		var v = combo.getValue();
		if (v == '1') { // 报表
			relationPanel.setVisible(true);
			relationOption.setValue();
			urlPanel.setVisible(false);
		} else {
			urlPanel.setVisible(true);
			urlAddInf.setValue();
			relationPanel.setVisible(false);
		}
		relationWin.doLayout();
	});
	relationForm = new Ext.form.FormPanel({
		defaultType : 'textfield',
		buttonAlign : 'right',
		labelAlign : 'right',
		frame : true,
		border : false,
		autoWidth : true,
		autoScroll : true,
		autoShow : true,
		labelWidth : 60,
		width : 400,
		items : [relationName, relationType, relationPanel, urlPanel]
	});
	
	relationWin = new Ext.Window({
		width : 350,
		height : 220,
		resizable : false,
		closeAction : 'hide',
		closable : false,
		layout : 'fit',
		plain : true,
		border : false,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		title : '新建关联信息',
		titleCollapse : true,
			items : relationForm,
			buttons : [{
				text : '确定',
				handler : function() {
					// 新建时
					selectId += " ";
					if (selectId.trim() == "") {
						relationGetIdCallback();
					} else {// 编辑时的操作
						updateRelHander();
					}
				}
			}, {
				text : '取 消',
				handler : function() {
					relationWin.setVisible(false);
				}
			}]
		});
}

// 更新指定的记录
function updateRelHander(){
	var xmlDoc = loadXMLString(relationData);
	var relation = xmlDoc.getElementsByTagName("relation")[selectId];
	var tmp = [];
	for(var i=0;i<relation.childNodes.length;i++){
		tmp.push(relation.childNodes[i]);
	}
	for(var i=0;i<tmp.length;i++){
		relation.removeChild(tmp[i]);
	}
	saveRelToEle(relation, xmlDoc);
	relationData = xmlDoc.xml;
	relationWin.setVisible(false);
	formatXml(relationData);
}
		
		
// 弹出窗口 type=1则为添加，type=2则为修改
function openRelation(type) {
	relationWin.show();
	relationWin.focus();
	relationType.setValue("1");
	relationType.fireEvent('select', relationType);
}

function initUrlWin(){
	urlForm = new Ext.form.FormPanel({
		labelAlign : 'right',
		frame : true,
		region : 'north',
		border : false,
		width : 400,
		height : 80,
		labelWidth : 60,
		items : [{
			fieldLabel : 'url地址',
			name : 'urlAddForWin',
			xtype : 'textfield',
			id : 'urlAddForWin',
			anchor : '97%',
			maxlength : 30
		}, {
			layout : 'column',
			items : [{
				columnWidth : .33,
				layout : 'form',
				items : [{
					fieldLabel : '打开位置',
					name : 'location',
					xtype : 'textfield',
					id : 'location',
					border : false,
					anchor : '97%',
					maxLength : 10
				}]
			}, {
				columnWidth : .33,
				layout : 'form',
				items : [{
					fieldLabel : '高度',
					name : 'urlWidth',
					xtype : 'numberfield',
					id : 'urlWidth',
					anchor : '97%',
					border : false,
					maxLength : 10
				}]
			}, {
				columnWidth : .33,
				layout : 'form',
				items : [{
					fieldLabel : '宽度',
					name : 'urlHeight',
					xtype : 'numberfield',
					id : 'urlHeight',
					anchor : '97%',
					border : false,
					maxLength : 10
				}]
			}]
		}]
	});
	
	urlWin = new Ext.Window({
		width : 500,
		height : 400,
		resizable : false,
		closeAction : 'hide',
		closable : false,
		border : false,
		layout : 'border',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		title : 'url信息',
		titleCollapse : true,
		items : [urlForm, getUrlPanel(urlParams)],
		buttons : [{
			text : '确定',
			handler : function() {
				saveHandler();
				relationType.setValue("2");
				relationType.fireEvent('select',relationType);
				urlAddInf.setValue(urlForWin);
			}
		}, {
			text : '取 消',
			handler : function() {
				urlWin.setVisible(false);
				relationType.setValue("2");
				relationType.fireEvent('select',relationType);
				urlAddInf.setValue(urlForWin);
			}
		}]
	});
}

// 弹出url的窗口
function openUrlWin() {
	urlWin.show();
	urlForm.getForm().findField("urlAddForWin").setValue(urlForWin);
	urlForm.getForm().findField("location").setValue(locationForWin);
	urlForm.getForm().findField("urlWidth").setValue(widthForWin);
	urlForm.getForm().findField("urlHeight").setValue(heightForWin);
	try {
		eformtpl.ds = urlParams;
		eformtpl.dom = loadXMLString(eformtpl.ds);
		initStore();
	} catch (e) {

	}
	urlWin.focus();
	relationType.setValue("1");
	relationType.fireEvent('select', Ext.getCmp('relationType'));
}
// 取得主键之后的对表格的操作
function relationGetIdCallback() {
	var xmlDoc = loadXMLString(relationData);
	var relation = xmlDoc.createElement("relation");
	saveRelToEle(relation, xmlDoc);
	var code = xmlDoc.getElementsByTagName("relations")[0];
	code.appendChild(relation);
	relationData = xmlDoc.xml;
	relationWin.setVisible(false);
	formatXml(relationData);
};

// 操作renderer
function operRenderer(value, cellmeta, record, rowIndex, columnIndex, store) {
	var re = "<a href='#' onclick='editRelation(\"" + value + "\",\""
			+ record.data["orderName"] + "\",\"" + record.data["fieldName"]
			+ "\",\"" + record.data["Default"] + "\",\"" + rowIndex + "\")'>"
			+ "<img src='"+sys.getContextPath()+"/artery/pub/images/icon/edit.gif'></a>";
	re = re + "&nbsp;<a href='#' onclick='delRelation(\"" + rowIndex + "\")'>"
			+ "<img src='"+sys.getContextPath()+"/artery/pub/images/icon/del.gif'></a>"
	return re;
}
/**
 * grid点击编辑时的操作 编辑dom
 */
function editRelation(cid, orderName, fieldName, Default, rowIndex) {
	selectId = rowIndex;
	openRelation();
	relationWin.setTitle("编辑关联");
	var xmlDoc = loadXMLString(relationData);
	var con = xmlDoc.getElementsByTagName("relation")[rowIndex];
	var relObj = selectRel = readRelFromEle(con);
	relationName.setValue(relObj.name.slice(3,relObj.name.length));
	if (relObj.type == "report"){
		relationType.setValue(1);
	}else{
		relationType.setValue(2);
	}
	relationType.fireEvent('select', relationType);
	if (relObj.type == "report") {// 报表
		try {
			relationOption.setValue(relObj.valueName);
			var reportInfo = Ext.decode(relObj.linkto);
		} catch (e) {
		}
	} else {
		urlAddInf.setValue(relObj.url);
	}
}

// 从xml中读取rel信息
function readRelFromEle(con){
	var obj = {};
	obj.name = con.getElementsByTagName("name")[0].text;
	obj.valueName = con.getElementsByTagName("valueName")[0].text;
	obj.type = con.getElementsByTagName("type")[0].text;
	obj.target = con.getElementsByTagName("target")[0].text;
	obj.targetWidth = con.getElementsByTagName("targetWidth")[0].text;
	obj.targetHeight = con.getElementsByTagName("targetHeight")[0].text;
	if(obj.type=="report"){
		obj.formId = con.getElementsByTagName("formId")[0].text;
		obj.formType = con.getElementsByTagName("formType")[0].text;
		obj.runTimeType = con.getElementsByTagName("runTimeType")[0].text;
		obj.linkto = con.getElementsByTagName("linkto")[0].text;
	}else{
		obj.url = con.getElementsByTagName("url")[0].text;
	}
	var pl = con.getElementsByTagName("param");
	if(pl!=null && pl.length>0){
		obj.params = {};
		for(var i=0;i<pl.length;i++){
			var key = pl[i].getAttribute("key");
			obj.params[key] = pl[i].text;
		}
	}
	return obj;
}

// 保存rel信息到xml中
function saveRelToEle(con, xmlDoc){
	var name = xmlDoc.createElement("name");
	name.text = "rel" + relationName.getValue();
	con.appendChild(name);
	
	var valueName = xmlDoc.createElement("valueName");
	if (relationPanel.isVisible()) {
		valueName.text = relationOption.getValue();
	} else {
		valueName.text = urlAddInf.getValue();
	}
	con.appendChild(valueName);
	
	var type = xmlDoc.createElement("type");
	if (relationType.getValue() == 1){
		type.text = "report";
	}else{
		type.text = "url";
	}
	con.appendChild(type);
	
	var target = xmlDoc.createElement("target");
	target.text = selectRel.target;
	con.appendChild(target);
	
	var targetWidth = xmlDoc.createElement("targetWidth");
	targetWidth.text = selectRel.targetWidth;
	con.appendChild(targetWidth);
	
	var targetHeight = xmlDoc.createElement("targetHeight");
	targetHeight.text = selectRel.targetHeight;
	con.appendChild(targetHeight);
	
	var formId = xmlDoc.createElement("formId");
	formId.text = selectRel.formId;
	con.appendChild(formId);
	
	var formType = xmlDoc.createElement("formType");
	formType.text = selectRel.formType;
	con.appendChild(formType);
	
	var runTimeType = xmlDoc.createElement("runTimeType");
	runTimeType.text = selectRel.runTimeType;
	con.appendChild(runTimeType);
	
	var linkto = xmlDoc.createElement("linkto");
	linkto.text = selectRel.linkto;
	con.appendChild(linkto);
	
	var url = xmlDoc.createElement("url");
	url.text = selectRel.url;
	con.appendChild(url);
	
	if(selectRel.params!=null){
		for(var p in selectRel.params){
			var pe = xmlDoc.createElement("param");
			pe.setAttribute("key", p);
			pe.text = selectRel.params[p];
			con.appendChild(pe);
		}
	}
}

/**
 * 删除排序
 */
function delRelation(rowIndex) {
	Ext.MessageBox.minWidth = 200;
	Ext.MessageBox.confirm('提示', '确认删除?', delConfirm);
	selectId = rowIndex;
}
/**
 * 删除操作 删除dom
 */
function delConfirm(btn) {
	if (btn == "yes") {
		var xmlDoc = loadXMLString(relationData);
		var relation = xmlDoc.getElementsByTagName("relation")[selectId];
		relation.parentNode.removeChild(relation);
		relationData = xmlDoc.xml;
		formatXml(relationData);
	} else {
		selectId = "";
	}
}
/**
 * 刷新grid
 */
function refreshData(xmlStr) {
	var retData = getStoreData(xmlStr);
	storeData = eval(retData);
	store.loadData(storeData);
}
/**
 * 格式化xml
 */
function formatXml(xmlStr) {
	var map = new Map();
	map.put("key", "template.report.formatxml");
	map.put("xmlStr", xmlStr);
	var query = new QueryObj(map, formatCallback);
	query.send();
}
/**
 * 格式化之后得回调函数
 */
function formatCallback(query) {
	var retXml = query.getDetail();
	relationData = retXml;
	// var xdoc = loadXMLString(eval(retXml));
	var storeData = eval(getStoreData(retXml))
	store.loadData(storeData);
}
/**
 * 组织成例子grid3一样的数据
 */
function getStoreData(xmlStr) {
	var xmlDoc = loadXMLString(xmlStr);
	var returnStr = "[";
	var con = xmlDoc.getElementsByTagName("relation");
	for (var i = 0; i < con.length; i++) {
		var relation = con[i];
		returnStr += "[";
		var relationChilds = relation.childNodes;
		for (var j = 0; j < 5; j++) {
			var relationChild = relationChilds[j];
			returnStr += "'";
			returnStr += relationChild.text;
			returnStr += "'";
			if (j != 4) {
				returnStr += ",";
			}
		}
		returnStr += "]";
		if (i != (con.length - 1))
			returnStr += ",";
	}
	returnStr += "]";
	return returnStr;
}
/**
 * 按双引号分割字符串
 */
function getParams(params) {
	var sb = [];
	for(var i in params){
		sb.push(i + ":" + params[i] + "<br>");
	}
//	var returnStr = "";
//	var sliceParams = params.slice(1, params.length - 1);
//	var paramsArrays = sliceParams.split(",");
//	for (var paramsIndex = 0; paramsIndex < paramsArrays.length; paramsIndex++) {
//		var paramsGroup = paramsArrays[paramsIndex];
//		var paramsGroupSplice = paramsGroup.split(":");
//		for (var j = 0; j < paramsGroupSplice.length; j++) {
//			var paramsGroupValue = paramsGroupSplice[j];
//			// returnStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
//			if (j == 0) {
//				returnStr += (paramsGroupValue.slice(1, paramsGroupValue.length
//								- 1));
//				returnStr += ":  ";
//			} else {
//				returnStr += (paramsGroupValue.slice(1, paramsGroupValue.length
//								- 1));
//			}
//
//		}
//		returnStr += "<br>";
//	}
	return sb.join();
}
function previewForm() {
	saveRelation();
    winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
	winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + reportParams.id;
	winObj.focus();
}
