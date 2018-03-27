Ext.ns("AtyCon");

/**
 * 表单解析监控
 */
AtyCon.FormMonitor = function() {
	var dataStore; 			// 数据源
	var gridPanel; 			// Grid面板
	
	var detailTree;			// 解析详情树
	var treeLoader;
	var treeFilter;
	
	var viewport;

	// 初始化数据源
	function initDataStore() {
		dataStore = new Ext.data.JsonStore({
			url : sys.getContextPath() + '/artery/monitor.do?action=loadRecordList',
			root : 'rows',
			totalProperty : "totalCount",
			fields : [{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'formName',
				mapping : 'formName'
			}, {
				name : 'start',
				mapping : 'start'
			}, {
				name : 'end',
				mapping : 'end'
			}, {
				name : 'cost',
				mapping : 'cost'
			}, {
				name : 'detailNumber',
				mapping : 'detailNumber'
			}]
		});
		dataStore.on("load", afterRecordLoad);
	}
	
	/**
	 * 列表加载完后执行一些操作
	 */
	function afterRecordLoad(st, res){
		var avgTime = st.reader.jsonData.avgTime;
		document.getElementById("avgTime").innerHTML = avgTime + "ms";
	}
	
	// 初始化Grid面板
	function initGridPanel() {
		gridPanel = new Ext.grid.GridPanel({
			tbar:["表单解析记录，平均解析时间：<font color=red id='avgTime'></font>", "->", {
				text: ""
			}],
			stripeRows : true,
			enableDragDrop : false,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : false,
			ds : dataStore,
			cm : new Ext.grid.ColumnModel([{
				header : "表单名称",
				width : 150,
				sortable : false,
				dataIndex : 'formName'
			}, {
				header : "开始时间",
				width : 100,
				sortable : false,
				dataIndex : 'start'
			}, {
				header : "结束时间",
				width : 200,
				sortable : false,
				dataIndex : 'end'
			}, {
				header : "花费时间",
				sortable : true,
				dataIndex: "cost"
			}, {
				header : "详情记录数",
				sortable : true,
				dataIndex: 'detailNumber'
			}])
		});

		gridPanel.on('rowdblclick', function(g, rowIndex, e) {
			var id = dataStore.getAt(rowIndex).get('id');
			showRecord(id);
		});
	}
	
	/**
	 * 过滤详情树
	 */
	function filterDetailTree(){
		treeFilter.filterBy(function(node){
			var cost = node.attributes.cost;
			return cost>0;
		});
	}
	
	/**
	 * 初始化详情树
	 */
	function initTreePanel(){
		treeLoader = new Ext.tree.TreeLoader({
			url: sys.getContextPath()+"/artery/monitor.do?action=loadRecordInfo"
		});
		treeLoader.on("load", function(){
			if(expandButton.pressed){
				detailTree.root.expand(true);
			}
			if(filterButton.pressed){
				filterDetailTree();
			}
		});
		var expandButton = new Ext.Toolbar.Button({
			text: "展开",
			toggleGroup: "record_expand",
			handler: function(){
				detailTree.root.expand(true);
			}
		});
		var colapseButton = new Ext.Toolbar.Button({
			text: "折叠",
			toggleGroup: "record_expand",
			pressed: true,
			handler: function(){
				detailTree.root.collapse(true);
			}
		});
		var filterButton = new Ext.Toolbar.Button({
			text: "过滤",
			tooltip: "显示时间大于零的节点",
			toggleGroup: "record_filter",
			handler: filterDetailTree
		});
		var unfilterButton = new Ext.Toolbar.Button({
			text: "全部",
			tooltip: "显示全部节点，可能包括大量无用节点",
			toggleGroup: "record_filter",
			pressed: true,
			handler: function(){
				treeFilter.clear();
			}
		});
		var backButton = new Ext.Toolbar.Button({
			text: "返回列表",
			cls: "x-btn-text-icon back",
			handler: function(){
				viewport.getLayout().setActiveItem(0);
				dataStore.load();
			}
		});
		detailTree = new Ext.tree.TreePanel({
			tbar: [
				"解析详情","->",
				expandButton," ",
				colapseButton," ",
				filterButton," ",
				unfilterButton," ",
				backButton
			],
			root: new Ext.tree.AsyncTreeNode({}),
			rootVisible: false,
			animate: false,
			autoScroll: true,
			loader: treeLoader
		});
		treeFilter = new Ext.tree.TreeFilter(detailTree,{
		});
	}
	
	function showRecord(recordid){
		viewport.getLayout().setActiveItem(1);
		treeLoader.baseParams.recordid = recordid;
		detailTree.root.reload();
		//detailTree.root.expand(true);
	}

	function init(){
		initDataStore();
		initGridPanel();
		initTreePanel();
		viewport = new Ext.Viewport({
			layout : 'card',
			activeItem: 0,
			border : false,
			hideBorders : true,
			items : [gridPanel,detailTree]
		});
		
		dataStore.load();
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		init: init
	};
}();