var eformtpl = {};
// eformtpl.id = "<c:out value='${formid}'/>";
eformtpl.id = '11111';
eformtpl.type = "4";
eformtpl.ds = "";
eformtpl.dom = loadXMLString(eformtpl.ds);
var urlParams, urlForWin, locationForWin, widthForWin, heightForWin;
var toolbar;
var urlStore;
var mainPnl;
var sqlField;
var gridEditor;

function initStore() {

	if (!urlStore) {
		urlStore = new Ext.data.Store({
					proxy : new Ext.data.MemoryProxy([]),
					reader : new Ext.data.ArrayReader({}, [{
										name : 'name'
									}, {
										name : 'value'
									}])
				});
	}
	urlStore.load();
	var rootEl = eformtpl.dom.documentElement;
	if (rootEl != null) {
		for (var i = 0; i < rootEl.childNodes.length; i++) {
			var subEl = rootEl.childNodes[i];
			var p = new Ext.data.Record({
						name : subEl.getAttribute("name"),
						value : subEl.text
					});
			if (subEl.getAttribute("name") != null
					&& subEl.getAttribute("name").trim() != "") {
				urlStore.addSorted(p);
			}

		}
	}

}

function saveHandler() {
	var jsonArray = [];
	urlStore.each(function(item) {
				jsonArray.push(item.data);
			});

	// 校验，（1）id不能重复；（2）id不可空；（3）sql不可空
	var sValid = ",";
	for (var i = 0; i < jsonArray.length; i++) {
		if (jsonArray[i].name == null || jsonArray[i].name == ""
				|| Ext.isEmpty(jsonArray[i].name.trim())) {
			showTips("验证出错：参数name不可为空", 4);
			return false;
		}
		if (sValid.indexOf("," + jsonArray[i].name.trim() + ",") > -1) {
			showTips("验证出错：参数name不可重复", 4);
			return false;
		}
		if (jsonArray[i].value == null || jsonArray[i].value == ""
				|| Ext.isEmpty(jsonArray[i].value.trim())) {
			showTips("验证出错：参数value不可为空", 4);
			return false;
		}
		sValid += jsonArray[i].name.trim() + ",";
		// sValid+=((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim())+",");
	}
	var docDs = loadXMLString("<?xml version='1.0' encoding='gbk'?><dslist/>");
	var rootEl = docDs.documentElement;

	params = {};
	for (var i = 0; i < jsonArray.length; i++) {
		var newNode = docDs.createElement("url");
		var attrName = docDs.createAttribute("name");
		attrName.value = jsonArray[i].name;
		newNode.setAttributeNode(attrName);

		if (jsonArray[i].value == null || jsonArray[i].value == "") {
			newNode.text = "";
			params[jsonArray[i].name] = "";
		}

		else {
			newNode.text = jsonArray[i].value;
			params[jsonArray[i].name] = jsonArray[i].value;
		}

		rootEl.appendChild(newNode);
	}
	urlParams = docDs.xml;
	selectText = getParams(params);
	
	selectRel.target = urlForm.getForm().findField("location").getValue();
	selectRel.targetWidth = urlForm.getForm().findField("urlWidth").getValue();
	selectRel.targetHeight = urlForm.getForm().findField("urlHeight").getValue();
	selectRel.formId = urlForm.getForm().findField("urlHeight").getValue();
	selectRel.url = urlForm.getForm().findField("urlAddForWin").getValue();
	selectRel.params = params;
	
	urlForWin = urlForm.getForm().findField("urlAddForWin").getValue();
	locationForWin = urlForm.getForm().findField("location").getValue();
	widthForWin = urlForm.getForm().findField("urlWidth").getValue();
	heightForWin = urlForm.getForm().findField("urlHeight").getValue();
	urlWin.setVisible(false);
	relationFromId = urlForm.getForm().findField("urlAddForWin").getValue();
	// var map = new Map();
	// map.put("key", "report.saveds");
	// map.put("eformid", eformtpl.id);
	// map.put("eformtype", eformtpl.type);
	// map.put("ds", docDs.xml);
	// var query = new QueryObj(map, function(query) {
	// var msg = query.getDetail();
	// if (msg == "ok") {
	// showTips("保存表单数据源成功", 2);
	// } else {
	// showTips("未知错误：保存表单数据源失败", 4);
	// }
	// });
	// query.send();
}

function addHandler() {
	var p = new Ext.data.Record({
				name : 'param1',
				value : ''
			});
	mainPnl.stopEditing();
	urlStore.add(p);
	mainPnl.startEditing(urlStore.getCount() - 1, 1);
	mainPnl.view.refresh();
}

function delHandler() {
	var sm = mainPnl.getSelectionModel();
	var cell = sm.getSelectedCell();
	if (!cell)
		return;
	var record = urlStore.getAt(cell[0]);
	if (!record)
		return;
	Ext.Msg.confirm('信息', '确定要删除此参数么？', function(btn) {
				if (btn == 'yes') {
					urlStore.remove(record);
					mainPnl.view.refresh();
				}
			});
}

function initToolbar() {
	toolbar = new Ext.Toolbar([{
				text : '添加参数',
				iconCls : 'x-btn-text-icon add',
				tooltip : '添加一个参数',
				handler : addHandler
			}, '-', {
				text : '删除参数',
				iconCls : 'x-btn-text-icon del',
				tooltip : '删除当前选中的url<br>删除后将无法恢复，需谨慎操作',
				handler : delHandler
			}])
}
function previewForm() {
	saveHandler();
    winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
	winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + eformtpl.id;
	winObj.focus();
}
// /**
// * 格式化xml
// */
// function formatXml(xmlStr) {
// var map = new Map();
// map.put("key", "template.report.formatxml");
// map.put("xmlStr", xmlStr);
// var query = new QueryObj(map, formatCallback);
// query.send();
// }
// /**
// * 格式化之后的回调函数
// */
// function formatCallback(query) {
// var retXml = query.getDetail();
// openXml(retXml, 1);
// }
function getNewXml() {
	var jsonArray = [];
	urlStore.each(function(item) {
				jsonArray.push(item.data);
			});

	// 校验，（1）id不能重复；（2）id不可空；（3）sql不可空
	var sValid = ",";
	for (var i = 0; i < jsonArray.length; i++) {
		if (jsonArray[i].name == null || jsonArray[i].name == ""
				|| Ext.isEmpty(jsonArray[i].name.trim())) {
			showTips("验证出错：查询id不可为空", 4);
			return false;
		}
		if (sValid.indexOf("," + jsonArray[i].name.trim() + ",") > -1) {
			showTips("验证出错：查询id不可重复", 4);
			return false;
		}
		if (jsonArray[i].value == null || jsonArray[i].value == ""
				|| Ext.isEmpty(jsonArray[i].value.trim())) {
			showTips("验证出错：查询sql不可为空", 4);
			return false;
		}
		sValid += jsonArray[i].name.trim() + ",";
		// sValid+=((jsonArray[i].pageSplit==null?"":jsonArray[i].pageSplit.trim())+",");
	}
	var docDs = loadXMLString("<?xml version='1.0' encoding='gbk'?><dslist/>");
	var rootEl = docDs.documentElement;

	for (var i = 0; i < jsonArray.length; i++) {
		var newNode = docDs.createElement("ds");
		var attrName = docDs.createAttribute("rsName");
		attrName.value = jsonArray[i].name;
		var pageName = docDs.createAttribute("splitpage");
		pageName.value = ((jsonArray[i].pageSplit == null
				? ""
				: jsonArray[i].pageSplit.trim()));
		var pageNumber = docDs.createAttribute("record");
		pageNumber.value = ((jsonArray[i].pageNumber == null
				? ""
				: jsonArray[i].pageNumber));
		newNode.setAttributeNode(attrName);
		newNode.setAttributeNode(pageName);
		newNode.setAttributeNode(pageNumber);
		if (jsonArray[i].value == null || jsonArray[i].value == "")
			newNode.text = "";
		else
			newNode.text = Ext.decode(jsonArray[i].value);
		rootEl.appendChild(newNode);
	}
	return docDs.xml;
}

function initGridPanel() {

	var cmForUrl = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '参数',
				dataIndex : 'name',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({
							allowBlank : false
						}))
			}, {
				header : '参数值',
				dataIndex : 'value',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({
							allowBlank : true
						}))
			}]);

	mainPnl = new Ext.grid.EditorGridPanel({
				cm : cmForUrl,
				region : 'center',
				store : urlStore,
				loadMask : true,
				border : false,
				stripeRows : true,
				clicksToEdit : 1,
				viewConfig : {
					forceFit : true
				},
				tbar : toolbar
			});
}

function getUrlPanel(urlTable) {
	var map = new Map();
	map.put("key", "report.loadDSXML.relation");
	map.put("urlGrid", urlTable);
	var query = new QueryObj(map);
	query.send();
	eformtpl.ds = query.getDetail();
	eformtpl.dom = loadXMLString(eformtpl.ds);
	initStore();
	if (!mainPnl) {
		initToolbar();
		initGridPanel();
	}
	return mainPnl;
}
