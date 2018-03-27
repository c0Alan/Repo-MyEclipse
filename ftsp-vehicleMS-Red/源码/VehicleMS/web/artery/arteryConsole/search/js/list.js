var dataStore; 			// 数据源
var gridPanel;			// Grid面板
var condPanel;			// 条件panel

// 初始化数据源
function initDataStore() {
	dataStore = new Ext.data.JsonStore({
		url : sys.getContextPath()+'/artery/search.do?action=loadDataJson',
		root : 'rows',
		totalProperty : "totalCount",
		remoteSort: true,
		fields : storeJsonConf,
		autoLoad : {
			params : {
				start : 0,
				limit : 20
			}
		}
	});
	dataStore.on("beforeload",function(store,option){
		if(option.params){
			option.params.cid = cid;
		}else{
			option.params = {cid:cid};
		}
	});
}

// 初始化Grid面板
function initGridPanel() {
	var pageBar = new Ext.PagingToolbar({
		pageSize : 20,
		store : dataStore,
		displayInfo : true,
		displayMsg : '本页显示:{0} - {1} 总记录数:{2}',
		emptyMsg : "无记录",
		items: [{
			text: "导出Excel(本页)",
			handler: function(){
				exportExcel(false);
			}
		},{
			text: "导出Excel(全部)",
			handler: function(){
				exportExcel(true);
			}
		}]
	});
	gridPanel = new Ext.grid.GridPanel({
		region: "center",
		title : '查询结果',
		stripeRows : true,
		enableDragDrop : false,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		border : false,
		ds : dataStore,
		cm : new Ext.grid.ColumnModel(gridJsonConf),
		bbar : pageBar
	});
}

/**
 * 导出Excel
 */
function exportExcel(total){
	var url = sys.getContextPath() + "/artery/search.do";
	var p = {
		cid: cid,
		action: "exportExcel"
	};
	// 处理过滤
	dealFilterCond(p);
	if(total != true){
		var pageTbr = gridPanel.getBottomToolbar();
		if(pageTbr){
			p.start = pageTbr.cursor;
			p.limit = pageTbr.pageSize;
		}
	}else{
		p.exportAll = "true";
	}
	// 处理排序
	var sortInfo = gridPanel.store.getSortState();
	if (sortInfo) {
		p.sort = sortInfo.field;
		p.dir = sortInfo.direction;
	}
	url = url+"?"+Ext.urlEncode(p);
	window.location = url;
	//alert(url);
}

// 执行查询
function searchHandler(){
	var params = {};
	dealFilterCond(params);
	params.start = 0;
	params.limit = 20;
	dataStore.reload({
		params: params,
		add: false
	});
}

/**
 * 处理过滤条件
 */
function dealFilterCond(params){
	for(var i=0;i<condJsonConf.length;i++){
		var fld = Ext.getCmp(condJsonConf[i]);
		var val = fld.getValue();
		if(!Ext.isEmpty(val)){
			if(fld instanceof Artery.plugin.FaDateDate){
				val = fld.formatDate(val);
			}
			if(Ext.isEncode(val)){
				val = Artery.escape(val);
			}
			params[condJsonConf[i]] = val;
		}
	}
}

// 初始化条件panel
function initCondPanel(){
	if(condJsonConf.length==0){
		return ;
	}
	Artery.get("formArea");
	for(var i=0;i<condJsonConf.length;i++){
		Artery.get(condJsonConf[i]);
	}
	Artery.cfg_search_button.handler = searchHandler;
	Artery.get("search_button");
}

function initLayout(){
	initDataStore();
	initGridPanel();
	initCondPanel();
	
	var reszieHandler = function(){
		var box = Ext.fly("search_result").getBox();
    	gridPanel.setSize(box.width, box.height);
	}
	
	Ext.EventManager.onWindowResize(function(){
		reszieHandler();
	});
	
	var box = Ext.fly("search_result").getBox();
	gridPanel.render("search_result");
    gridPanel.setSize(box.width, box.height);
}