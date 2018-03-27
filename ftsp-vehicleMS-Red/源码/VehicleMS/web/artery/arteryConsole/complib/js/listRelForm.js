var dataStore; 			// 数据源
var gridPanel; 			// Grid面板

/**
 * 初始化数据源
 */
function initDataStore() {
	dataStore = new Ext.data.JsonStore({
		url : sys.getContextPath() + '/artery/complib.do?action=loadRelList&formid='+formInfo.formid
					+ "&complibId=" + formInfo.complibId,
		root : 'rows',
		totalProperty : "totalCount",
		fields : [{
			name : 'complibName',
			mapping : 'complibName'
		}, {
			name : 'complibId',
			mapping : 'complibId'
		}, {
			name : 'formName',
			mapping : 'formName'
		}, {
			name : 'formId',
			mapping : 'formId'
		}, {
			name : 'type',
			mapping : 'type'
		}, {
			name : 'prop',
			mapping : 'prop'
		}]
	});
}

/**
 * 初始化Grid面板
 */
function initGridPanel() {
	gridPanel = new Ext.grid.GridPanel({
		stripeRows : true,
		enableDragDrop : false,
		loadMask : true,
		autoExpandColumn: "prop",
		viewConfig : {
			forceFit : true
		},
		border : false,
		tbar: ["关联表单情况，表单名称：<font color=red>"+formInfo.formname+"</font>，",
			   "表单id：<font color=red>"+formInfo.formid+"</font>","->",{
			text: "刷新列表",
			cls : 'x-btn-text-icon refresh',
			handler: function(){
				dataStore.reload();
			}
		}],
		ds : dataStore,
		cm : new Ext.grid.ColumnModel([{
			header : "构件库名称",
			width : 50,
			sortable : true,
			dataIndex: 'complibName'
		}, {
			header : "构件库Id",
			width : 30,
			sortable : true,
			dataIndex: 'complibId',
			hidden : true
		}, {
			header : "表单名称",
			width : 70,
			sortable : true,
			dataIndex : 'formName',
			renderer: formRenderer
		}, {
			header : "表单id",
			width : 80,
			sortable : true,
			dataIndex : 'formId'
		}, {
			header : "类型",
			width : 30,
			sortable : true,
			dataIndex: "type"
		}, {
			header : "属性信息",
			width : 150,
			sortable : true,
			dataIndex: 'prop'
		}])
	});
}

/**
 * 表单名称渲染方法
 */
function formRenderer(value, metadata, record){
	var val = "<a href='javascript:openForm(\""+record.get("formId")+"\", \""+record.get("complibId")+"\");'>"+value+"</a>";
	return val;
}

/**
 * 打开表单
 */
function openForm(formid, complibId){
	if(opener && opener.AtyCon.CompManager){
		opener.focus();
		opener.AtyCon.CompManager.findFormById(formid, complibId);
	}
}

function init(){
	initDataStore();
	initGridPanel();
	
	viewport = new Ext.Viewport({
		layout : 'fit',
		border : false,
		hideBorders : true,
		items : [gridPanel]
	});
	
	dataStore.load();
}

Ext.onReady(function(){
	Ext.QuickTips.init();
	init();
});