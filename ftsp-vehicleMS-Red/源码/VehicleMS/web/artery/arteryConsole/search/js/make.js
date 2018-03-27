
var currSearchInfo;		// 当前编辑的查询实例

var searchTree;			// 查询实例树
var dictTree;			// 数据字典树
var westTab;			// 左侧TabPanel
var toolbar;

var instanceWindow;		// 用于创建，修改目录或查询实例
var win_nameField;		// 名称
var win_visitRight;		// 访问权限
var win_dataSource;		// 数据源
var win_submit;			// 提交按钮

var condTree;			// 条件树
var resGrid;			// 结果字段列表

var field_type_name;	// 字段类型名称对应

var rootNodeMenu;		// 实例树，根节点右键菜单
var foldNodeMenu;		// 实例树，目录右键菜单
var searchNodeMenu;		// 实例树，查询实例右键菜单
var ct_rootMenu;		// 条件树，根节点菜单
var ct_foldMenu;		// 条件树，目录菜单
var ct_condMenu;		// 条件树，条件菜单

var FOLDER_HEIGHT = 140;	// 目录窗口高度
var SEARCH_HEIGHT = 160;	// 实例窗口高度

/**
 * 初始化右键菜单
 */
function initMenu(){
	rootNodeMenu = new Ext.menu.Menu({
		items: [{
			text: "新建目录",
			handler: function(){
				createFoldHandler(rootNodeMenu);
			}
		},{
			text: "新建实例",
			handler: function(){
				createSearchHandler(rootNodeMenu);
			}
		}]
	});
	
	foldNodeMenu = new Ext.menu.Menu({
		items: [{
			text: "新建目录",
			handler: function(){
				createFoldHandler(foldNodeMenu);
			}
		},{
			text: "新建实例",
			handler: function(){
				createSearchHandler(foldNodeMenu);
			}
		},{
			text: "编辑",
			handler: function(){
				renameHandler(foldNodeMenu,"folder");
			}
		},{
			text: "删除",
			handler: function(){
				deleteNodeHandler(foldNodeMenu);
			}
		}]
	});
	
	searchNodeMenu = new Ext.menu.Menu({
		items: [{
			text: "编辑",
			handler: function(){
				renameHandler(searchNodeMenu,"search");
			}
		},{
			text: "删除",
			handler: function(){
				deleteNodeHandler(searchNodeMenu);
			}
		}]
	});
	
	ct_rootMenu = new Ext.menu.Menu({
		items: [{
			text: "关系切换",
			handler: function(){
				changeRelHandler(ct_rootMenu.contextNode);
			}
		},{
			text: "清空子节点",
			handler: function(){
				removeAllHandler(ct_rootMenu.contextNode);
			}
		}]
	});
	
	ct_foldMenu = new Ext.menu.Menu({
		items: [{
			text: "关系切换",
			handler: function(){
				changeRelHandler(ct_foldMenu.contextNode);
			}
		},{
			text: "清空子节点",
			handler: function(){
				removeAllHandler(ct_foldMenu.contextNode);
			}
		},{
			text: "删除",
			handler: function(){
				ct_foldMenu.contextNode.remove();
			}
		}]
	});
	
	ct_condMenu = new Ext.menu.Menu({
		items: [{
			text: "删除",
			handler: function(){
				ct_condMenu.contextNode.remove();
			}
		}]
	});
}

/**
 * 关系切换函数
 */
function changeRelHandler(node){
	if(node.attributes.logicType=="and"){
		node.attributes.logicType="or";
		node.setText("或者");
	}else if(node.attributes.logicType=="or"){
		node.attributes.logicType="and";
		node.setText("并且");
	}
}

/**
 * 清空子节点
 */
function removeAllHandler(node){
	var ca = [];
	node.eachChild(function(inNode){
		ca.push(inNode);
	});
	for(var i=0;i<ca.length;i++){
		node.removeChild(ca[i]);
	}
}

/**
 * 创建Fold事件函数
 */
function createFoldHandler(menu){
	instanceWindow.show();
	instanceWindow.setTitle("新建目录");
	win_nameField.setValue();
	win_visitRight.setValue("1");
	var pp = win_dataSource.el.findParent(".x-form-item");
	Ext.fly(pp).hide();
	instanceWindow.setHeight(FOLDER_HEIGHT);
	win_submit.setHandler(function(){
		var name = win_nameField.getValue();
		if(Ext.isEmpty(name)){
			return ;
		}
		var visit = win_visitRight.getValue();
		if(Ext.isEmpty(visit)){
			return ;
		}
		var map = new Map();
		map.put("key", "search.insertFold");
		map.put("pcid", menu.contextNode.attributes.cid);
		map.put("name", name);
		map.put("visit", visit);
		var query = new QueryObj(map, function() {
			instanceWindow.hide();
			showTips("新建目录成功",2);
			menu.contextNode.reload();
		});
		query.send();
	});
}

/**
 * 创建查询实例函数
 */
function createSearchHandler(menu){
	instanceWindow.show();
	instanceWindow.setTitle("新建实例");
	win_nameField.setValue();
	win_visitRight.setValue("1");
	var pp = win_dataSource.el.findParent(".x-form-item");
	Ext.fly(pp).show();
	instanceWindow.setHeight(SEARCH_HEIGHT);
	if(hasUserDataSource){
		win_dataSource.setValue("userDataSource");
	}else{
		win_dataSource.setValue(null);
	}
	win_submit.setHandler(function(){
		var name = win_nameField.getValue();
		if(Ext.isEmpty(name)){
			return ;
		}
		var visit = win_visitRight.getValue();
		if(Ext.isEmpty(visit)){
			return ;
		}
		var ds = win_dataSource.getValue();
		var map = new Map();
		map.put("key", "search.insertSearch");
		map.put("pcid", menu.contextNode.attributes.cid);
		map.put("name", name);
		map.put("visit", visit);
		map.put("dataSource", ds);
		var query = new QueryObj(map, function() {
			instanceWindow.hide();
			showTips("新建实例成功",2);
			menu.contextNode.reload();
		});
		query.send();
	});
}

/**
 * 重命名函数
 */
function renameHandler(menu,type){
	instanceWindow.show();
	var title = type=="folder"? "修改目录": "修改实例";
	instanceWindow.setTitle(title);
	if(type=="folder"){
		var pp = win_dataSource.el.findParent(".x-form-item");
		Ext.fly(pp).hide();
		instanceWindow.setHeight(FOLDER_HEIGHT);
	}else{
		var pp = win_dataSource.el.findParent(".x-form-item");
		Ext.fly(pp).show();
		instanceWindow.setHeight(SEARCH_HEIGHT);
	}
	var node = menu.contextNode;
	win_nameField.setValue(node.text);
	win_visitRight.setValue(node.attributes.visitRight);
	win_dataSource.setValue(node.attributes.dataSource);
	win_submit.setHandler(function(){
		var name = win_nameField.getValue();
		if(Ext.isEmpty(name)){
			return ;
		}
		var visit = win_visitRight.getValue();
		if(Ext.isEmpty(visit)){
			return ;
		}
		var ds = win_dataSource.getValue();
		var map = new Map();
		map.put("key", "search.renameNode");
		map.put("cid", node.attributes.cid);
		map.put("newName", name);
		map.put("visit", visit);
		map.put("dataSource", ds);
		var query = new QueryObj(map, function() {
			instanceWindow.hide();
			var msg = query.getDetail();
			if (msg == "1") {
				showTips(title+"成功",2);
				menu.contextNode.setText(name);
				menu.contextNode.attributes.visitRight = visit;
				menu.contextNode.attributes.dataSource = ds;
			} else if(msg == "-1"){
				showTips("要更改的节点不存在", 4);
			}else {
				showTips("出错", 4);
			}
		});
		query.send();
	});
}

/**
 * 删除节点事件函数
 */
function deleteNodeHandler(menu){
	var warnMsg = null;
	var okTips = null;
	if(menu.contextNode.isLeaf()){
		warnMsg = "确定要删除查询实例？";
		okTips = "删除实例成功";
	}else{
		warnMsg = "确定要删除查询目录？该目录下的所有查询实例都将被删除";
		okTips = "删除目录成功";
	}
	Ext.Msg.confirm('删除节点', warnMsg, function(btn){
	    if (btn != 'yes'){
	        return ;
	    }
	    var map = new Map();
		map.put("key", "search.deleteNode");
		map.put("cid", menu.contextNode.attributes.cid);
		var query = new QueryObj(map, function() {
			var msg = query.getDetail();
			if (msg == "1") {
				showTips(okTips,2);
				menu.contextNode.parentNode.reload();
				currSearchInfo = null;
			} else if(msg == "-1"){
				showTips("要删除的节点不存在", 4);
			}else {
				showTips("出错", 4);
			}
		});
		query.send();
	});
}

/**
 * 显示右键菜单 -- 查询实例树
 */
function showContextMenu(node, e){
	var cid = node.attributes.cid;
	var ctrl = node.attributes.ctrl;
	if(cid=="root"){
		rootNodeMenu.showAt(e.getXY());
		rootNodeMenu.contextNode = node;
	}else if(node.isLeaf()){
		searchNodeMenu.showAt(e.getXY());
	 	searchNodeMenu.items.each(function(obj){
	 		obj.setDisabled(!ctrl);
		});
		searchNodeMenu.contextNode = node;
	}else{
		foldNodeMenu.showAt(e.getXY());
		foldNodeMenu.items.each(function(obj){
	 		obj.setDisabled(!ctrl);
		});
		foldNodeMenu.contextNode = node;
	}
}

/**
 * 显示右键菜单 -- 条件树
 */
function showContextMenu1(node, e){
	if(node==condTree.root){
		ct_rootMenu.showAt(e.getXY());
		ct_rootMenu.contextNode = node;
	}else if(node.attributes.logicType=="and" || node.attributes.logicType=="or"){
		ct_foldMenu.showAt(e.getXY());
		ct_foldMenu.contextNode = node;
	}else if(node.attributes.logicType=="cond"){
		ct_condMenu.showAt(e.getXY());
		ct_condMenu.contextNode = node;
	}
}

/**
 * 初始化查询实例树
 */
function initSearchTree(){
	searchTree = new Ext.tree.TreePanel({
		tbar:["查询实例树","->",{
			cls: "x-btn-icon",
			tooltip: "重载查询实例树",
			icon: sys.getContextPath()+"/artery/pub/images/icon/refresh.gif",
			handler: function(){
				searchTree.root.reload();
			}
		}],
		title: "查询实例",
		collapsible: true,
		autoScroll:true,
		animate : false,
		loader: new Ext.tree.TreeLoader({
		    dataUrl: 'search.do?action=loadSearchTree'
		}),
		root: new Ext.tree.AsyncTreeNode({
			text: "查询实例",
			cid: "root"
		})
	});
	
	searchTree.getLoader().on("beforeload", function(treeLoader, node) {
        this.baseParams.cid = node.attributes.cid;
    });
    
    searchTree.on("contextmenu",showContextMenu);
    searchTree.on('click', loadSearchConf);
}

/**
 * 加载查询实例的配置信息
 */
function loadSearchConf(node){
	if(!node.isLeaf()){
		return ;
	}
	
	Ext.getCmp("btn_saveSearch").setDisabled(!node.attributes.ctrl);
	
	var map = new Map();
	map.put("key", "search.loadSearchConf");
	map.put("cid", node.attributes.cid);
	var query = new QueryObj(map, function() {
		var msg = query.getDetail();
		currSearchInfo = {
			cid: node.attributes.cid,
			name: node.text,
			ctrl: node.attributes.ctrl
		};
		doParseXML(msg);
	});
	query.send();
}

/**
 * 解析xml，生成条件树
 */
function doParseXML(xmlStr){
	var ni = "当前编辑查询实例：<font color=red>"+currSearchInfo.name+"</font>";
	document.getElementById("se_tb_name").innerHTML = ni;
	condEditor.showBlankPanel();
	
	var docParam = loadXMLString(xmlStr);
	var rootEle = docParam.documentElement;	
	// 还原条件树
	removeAllHandler(condTree.root);
	condTree.root.setText("并且");
	condTree.root.attributes.logicType = "and";
	// 清空结果列表
	resGrid.store.removeAll();
	
	// 加载查询实例配置
	if(rootEle.hasChildNodes()){
		var crEle = rootEle.childNodes[0].childNodes[0];
		if(crEle.tagName=="and"){
			condTree.root.setText("并且");
			condTree.root.attributes.logicType = "and";
		}else{
			condTree.root.setText("或者");
			condTree.root.attributes.logicType = "or";
		}
		xmlToNode(crEle,condTree.root);
		
		var rfEle = rootEle.childNodes[1];
		for (var i = 0; i < rfEle.childNodes.length; i++){
			var subEl = rfEle.childNodes[i];
			var record = new Ext.data.Record({
				tableName: subEl.getAttribute("tableName"),
				tableShowName: subEl.getAttribute("tableShowName"),
				fieldName: subEl.getAttribute("fieldName"),
				fieldShowName: subEl.getAttribute("fieldShowName"),
				dataType: subEl.getAttribute("dataType")
			});
			resGrid.store.add(record);
		}
		resGrid.view.refresh();
	}
	
	condTree.root.expand(true);
}

/**
 * xml配置转换为条件树节点
 */
function xmlToNode(ele,node){
	for (var i = 0; i < ele.childNodes.length; i++){
		var subEl = ele.childNodes[i];
		if(subEl.tagName=="and"){
			var nn = new Ext.tree.TreeNode({
				text: "并且",
				iconCls: "folder",
				logicType: "and"
			});
			node.appendChild(nn);
			xmlToNode(subEl,nn);
		}else if(subEl.tagName=="or"){
			var nn = new Ext.tree.TreeNode({
				text: "或者",
				iconCls: "folder",
				logicType: "or"
			});
			node.appendChild(nn);
			xmlToNode(subEl,nn);
		}else if(subEl.tagName=="cond"){
			var conf = {
				text: subEl.getAttribute("fieldShowName"),
				logicType: "cond",
				tableName: subEl.getAttribute("tableName"),
				tableShowName: subEl.getAttribute("tableShowName"),
				fieldName: subEl.getAttribute("fieldName"),
				fieldShowName: subEl.getAttribute("fieldShowName"),
				dataType: subEl.getAttribute("dataType"),
				condReverse: subEl.getAttribute("condReverse"),
				condRun: subEl.getAttribute("condRun")
			};
			conf.qtipCfg = {
				text: getNodeTip(conf)
			};
			var condType = subEl.getAttribute("condType");
			if(!Ext.isEmpty(condType)){
				conf.condType = condType;
			}
			var condValue = subEl.text;
			if(!Ext.isEmpty(condValue)){
				conf.condValue = condValue;
			}
			var showValue = subEl.getAttribute("showValue");
			if(!Ext.isEmpty(showValue)){
				conf.showValue = showValue;
			}
			var prop_codeType = subEl.getAttribute("prop_codeType");
			if(!Ext.isEmpty(prop_codeType)){
				conf.prop_codeType = prop_codeType;
			}
			var prop_organType = subEl.getAttribute("prop_organType");
			if(!Ext.isEmpty(prop_organType)){
				conf.prop_organType = prop_organType;
			}
			genNodeText(conf);
			var nn = new Ext.tree.TreeNode(conf);
			node.appendChild(nn);
		}
	}
}

/**
 * 获得提示信息
 */
function getNodeTip(conf){
	return conf.tableShowName+
	       "(<font color=red>"+conf.tableName+"</font>)--"+
	       conf.fieldShowName+
	       "(<font color=red>"+conf.fieldName+"</font>)";
}

/**
 * 计算节点的显示文本
 */
function genNodeText(nc){
	var showValue = nc.showValue ? nc.showValue : nc.condValue;
	if(nc.condType=="equal"){
		if(nc.condRun=="true"){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 不等于 %查询时指定%";
			}else{
				nc.text = nc.fieldShowName+" 等于 %查询时指定%";
			}
		}else if(!Ext.isEmpty(nc.condValue)){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 不等于 "+showValue;
			}else{
				nc.text = nc.fieldShowName+" 等于 "+showValue;
			}
		}
	}else if(nc.condType=="big"){
		if(nc.condRun=="true"){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 小于等于 %查询时指定%";
			}else{
				nc.text = nc.fieldShowName+" 大于 %查询时指定%";
			}
		}else if(!Ext.isEmpty(nc.condValue)){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 小于等于 "+showValue;
			}else{
				nc.text = nc.fieldShowName+" 大于 "+showValue;
			}
		}
	}else if(nc.condType=="small"){
		if(nc.condRun=="true"){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 大于等于 %查询时指定%";
			}else{
				nc.text = nc.fieldShowName+" 小于 %查询时指定%";
			}
		}else if(!Ext.isEmpty(nc.condValue)){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 大于等于 "+showValue;
			}else{
				nc.text = nc.fieldShowName+" 小于 "+showValue;
			}
		}
	}else if(nc.condType=="contain"){
		if(nc.condRun=="true"){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 不包含 %查询时指定%";
			}else{
				nc.text = nc.fieldShowName+" 包含 %查询时指定%";
			}
		}else if(!Ext.isEmpty(nc.condValue)){
			if(nc.condReverse=="true"){
				nc.text = nc.fieldShowName+" 不包含 "+showValue;
			}else{
				nc.text = nc.fieldShowName+" 包含 "+showValue;
			}
		}
	}else if(nc.condType=="empty"){
		if(nc.condReverse=="true"){
			nc.text = nc.fieldShowName+" 不为空";
		}else{
			nc.text = nc.fieldShowName+" 为空";
		}
	}
}

/**
 * 初始化数据字典树
 */
function initDictTree(){
	dictTree = new Ext.tree.TreePanel({
		tbar:["数据字典","->",{
			cls: "x-btn-icon",
			tooltip: "重载数据字典",
			icon: sys.getContextPath()+"/artery/pub/images/icon/refresh.gif",
			handler: function(){
				dictTree.root.reload();
			}
		}],
		title: "数据字典",
		autoScroll:true,
		enableDrag: true,
		animate : false,
		rootVisible: false,
		loader: new Ext.tree.TreeLoader({
		    dataUrl: 'search.do?action=loadDictTree'
		}),
		root: new Ext.tree.AsyncTreeNode({
       		text: '数据字典',
        	type: 'root'
        })
	});
	
    dictTree.getLoader().on("beforeload", function(treeLoader, node) {
        var t = node.attributes.type;
        this.baseParams.type = t;
        if(t=='table'){
        	this.baseParams.table = node.attributes.table;
        }
        if(!Ext.isEmpty(search_param_value)){
        	this.baseParams[search_param_name] = search_param_value;
        }
    });
}

/**
 * 保存查询实例的配置
 */
function saveSearchInfo(){
	if(!currSearchInfo){
		showTips("无当前编辑实例",4);
		return ;
	}
	var docParam=loadXMLString("<?xml version='1.0' encoding='utf-8'?><search/>");
    var rootEle = docParam.documentElement;
    // 处理条件部分
    var condNode = docParam.createElement("condition");
    rootEle.appendChild(condNode);
    nodeToXml(condTree.root,condNode,docParam);
    
    // 处理结果部分
    var resNode = docParam.createElement("resultFields");
    rootEle.appendChild(resNode);
    resGrid.store.each(function(record){
    	var fldEle = docParam.createElement("field");
    	// 处理表名
        var tableAttr = docParam.createAttribute("tableName");
	    tableAttr.value = record.data["tableName"];
	    fldEle.setAttributeNode(tableAttr);
	    // 处理表显示名
	    var tabShowAttr = docParam.createAttribute("tableShowName");
	    tabShowAttr.value = record.data["tableShowName"];
	    fldEle.setAttributeNode(tabShowAttr);
	    // 处理字段名
	    var fieldAttr = docParam.createAttribute("fieldName");
	    fieldAttr.value = record.data["fieldName"];
	    fldEle.setAttributeNode(fieldAttr);
	    // 处理字段显示名
	    var fldShowAttr = docParam.createAttribute("fieldShowName");
	    fldShowAttr.value = record.data["fieldShowName"];
	    fldEle.setAttributeNode(fldShowAttr);
	    // 处理数据类型
	    var dataTypeAttr = docParam.createAttribute("dataType");
	    dataTypeAttr.value = record.data["dataType"]+"";
	    fldEle.setAttributeNode(dataTypeAttr);
	    resNode.appendChild(fldEle);
    });
   	
   	var map = new Map();
	map.put("key", "search.saveSearchInfo");
	map.put("cid", currSearchInfo.cid);
	map.put("conf", docParam.xml);
	var query = new QueryObj(map, function() {
		var msg = query.getDetail();
		if (msg == "1") {
			showTips("保存成功",2);
		} else if(msg == "-1"){
			showTips("查询实例不存在", 4);
		}else {
			showTips("出错", 4);
		}
	});
	query.send();
}

/**
 * 条件树节点转换为xml
 */
function nodeToXml(node,pEle,doc){
	if(node.attributes.logicType=="and"){
		var nEle = doc.createElement("and");
		pEle.appendChild(nEle);
		node.eachChild(function(innerNode){
			nodeToXml(innerNode,nEle,doc);
		});
	}else if(node.attributes.logicType=="or"){
		var nEle = doc.createElement("or");
		pEle.appendChild(nEle);
		node.eachChild(function(innerNode){
			nodeToXml(innerNode,nEle,doc);
		});
	}else if(node.attributes.logicType=="cond"){
		var nEle = doc.createElement("cond");
		// 处理表名
		nEle.setAttribute("tableName",node.attributes.tableName);
	    // 处理表显示名
	    nEle.setAttribute("tableShowName",node.attributes.tableShowName);
	    // 处理字段名
	    nEle.setAttribute("fieldName",node.attributes.fieldName);
	    // 处理字段显示名
	    nEle.setAttribute("fieldShowName",node.attributes.fieldShowName);
	    // 处理数据类型
	    nEle.setAttribute("dataType",node.attributes.dataType+"");
	    // 处理条件类型
	    if(node.attributes.condType){
	    	nEle.setAttribute("condType",node.attributes.condType);
	    	nEle.setAttribute("condReverse",node.attributes.condReverse);
	    	nEle.setAttribute("condRun",node.attributes.condRun);
	    	if(node.attributes.condValue){
	    		nEle.text = node.attributes.condValue;
	    	}
	    }
		pEle.appendChild(nEle);
	}
}

/**
 * 初始化条件树
 */
function initCondTree(){
	condTree = new Ext.tree.TreePanel({
		region: 'west',
		margins: '4 0 0 4',
		split: true,
		width: 200,
		enableDD: true,
		tbar:["条件树","->",{
			cls: "x-btn-icon",
			tooltip: "清空所有条件",
			icon: sys.getContextPath()+"/artery/pub/images/icon/delete_all.gif",
			handler: function(){
				removeAllHandler(condTree.root);
			}
		}],
		autoScroll:true,
		animate : false,
		root: new Ext.tree.TreeNode({
			text: "并且",
			iconCls: "folder",
			logicType: "and"
		})
	});
	condTree.on("beforenodedrop", dragNodeHander);
	condTree.on("nodedragover", dragoverHandler);
	condTree.on("contextmenu", showContextMenu1);
	condTree.on("click", function(node,e){
		condEditor.editCond(node);
	});
}

/**
 * 节点移入事件函数
 */
function dragoverHandler(e){
	var t = e.target;
	var s = e.dropNode;
	if (t.getOwnerTree() == s.getOwnerTree()) {
		return true;
	} else {
		if(!s.isLeaf()){
			return false;
		}
		if (e.point == "append"){
			return true;
		}else{
			return false;
		}
	}
}

/**
 * 放下节点事件函数
 */
function dragNodeHander(e){
	var t = e.target;
	var s = e.dropNode;
	if(t.getOwnerTree()==s.getOwnerTree()) {
		if(e.point=="append" && t.attributes.logicType=="cond"){
			var an = new Ext.tree.TreeNode({
				text: "并且",
				iconCls: "folder",
				logicType: "and"
			});
			t.parentNode.insertBefore(an,t);
			an.appendChild(t);
			an.appendChild(s);
			an.expand();
			return false;
		}
		return true;
	}else{
		var st = new Ext.tree.TreeNode({
			text: s.text,
			logicType: "cond",
			tableName: s.attributes.tableName,
			tableShowName: s.attributes.tableShowName,
			fieldName: s.attributes.fieldName,
			fieldShowName: s.attributes.fieldShowName,
			dataType: s.attributes.dataType,
			prop_codeType: s.attributes.prop_codeType,
			prop_organType: s.attributes.prop_organType,
			qtipCfg: {
				text: getNodeTip(s.attributes)
			}
		});
		if(t.attributes.logicType=="and" || t.attributes.logicType=="or"){
			t.appendChild(st);
			t.expand();
		}else{
			var foldNode = new Ext.tree.TreeNode({
				text: "并且",
				iconCls: "folder",
				logicType: "and"
			});
			t.parentNode.insertBefore(foldNode,t);
			foldNode.appendChild(t);
			foldNode.appendChild(st);
			foldNode.expand();
		}
		return false;
	}
}

/**
 * 初始化结果字段列表
 */
function initResGrid(){
	var dataStore = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy([]),
		reader: new Ext.data.ArrayReader({}, [
           	{name: 'tableName'},
           	{name: 'tableShowName'},
           	{name: 'fieldName'},
           	{name: 'fieldShowName'},
           	{name: 'dataType'}
       	])
	});
	
	var resTbar = new Ext.Toolbar(["结果字段列表","->",{
		text: "删除",
		cls: "x-btn-text-icon",
		tooltip: "删除选中的结果字段",
		icon: sys.getContextPath()+"/artery/pub/images/icon/del.gif",
		handler: function(){
			var rec = resGrid.getSelectionModel().getSelected();
			if(rec){
				resGrid.store.remove(rec);
			}
		}
	},{
		text: "清空",
		cls: "x-btn-text-icon",
		tooltip: "清空所有结果字段",
		icon: sys.getContextPath()+"/artery/pub/images/icon/delete_all.gif",
		handler: function(){
			resGrid.store.removeAll();
		}
	},{
		text: "前移",
		cls: "x-btn-text-icon",
		tooltip: "前移选中的结果字段",
		icon: sys.getContextPath()+"/artery/pub/images/icon/back.gif",
		handler: function(){
			var rec = resGrid.getSelectionModel().getSelected();
			if(rec){
				var store = resGrid.store;
				var index = store.indexOf(rec);
				if(index>0){
					var prec = store.getAt(index-1);
					store.remove(rec);
					store.insert(index-1,[rec]);
					resGrid.getSelectionModel().selectRow(index-1);
				}
			}
		}
	},{
		text: "后移",
		cls: "x-btn-text-icon",
		tooltip: "后移选中的结果字段",
		icon: sys.getContextPath()+"/artery/pub/images/icon/forward.gif",
		handler: function(){
			var rec = resGrid.getSelectionModel().getSelected();
			if(rec){
				var store = resGrid.store;
				var index = store.indexOf(rec);
				var count = store.getCount();
				if(index<count-1){
					var nrec = store.getAt(index+1);
					store.remove(rec);
					store.insert(index+1,[rec]);
					resGrid.getSelectionModel().selectRow(index+1);
				}
			}
		}
	}]);
	
	var resSM = new Ext.grid.RowSelectionModel({
		singleSelect: true
	});
	
	resGrid = new Ext.grid.GridPanel({
		region: 'south',
		height: 200,
		margins: '0 4 4 4',
		split: true,
		tbar: resTbar,
		stripeRows : true,
		viewConfig : {
			forceFit : true
		},
		ds : dataStore,
		selModel: resSM,
		cm : new Ext.grid.ColumnModel([{
			header : "表名",
			width : 30,
			sortable : false,
			dataIndex : 'tableShowName'
		}, {
			header : "字段名",
			width : 50,
			sortable : false,
			dataIndex : 'fieldShowName'
		}, {
			header : "数据类型",
			width : 50,
			sortable : false,
			dataIndex : 'dataType',
			renderer: function(v){
				return field_type_name[v+""];
			}
		}])
	});
}

/**
 * 初始化拖拽
 */
function initDragEvent(){
	new Ext.dd.DropTarget(resGrid.body,{
		ddGroup: "TreeDD",
		notifyOver: function(dd, e, data){
			var node = data.node;
			if(res_checkDrop(node)){
				return this.dropAllowed;
			}else{
				return this.dropNotAllowed;
			}
		},
		notifyDrop: function(dd, e, data){
			var node = data.node;
			if(res_checkDrop(node)){
				addResField(node);
				return true;
			}else{
				return false;
			}
		}
	});
}

/**
 * 检查是否能够放下
 */
function res_checkDrop(node){
	var type = node.attributes.type;
	var dt = node.attributes.dataType;
	if(type!="field"){
		return false;
	}
	if(dt!="number" && dt!="text" && dt!="date" && dt!="normalcode" && dt!="classcode" && dt!="organ"){
		return false;
	}
	
	var allowAdd = true;
	var tn = node.attributes.tableName;
	var fn = node.attributes.fieldName;
	resGrid.store.each(function(rec){
		if(tn==rec.data["tableName"] && fn==rec.data["fieldName"]){
			allowAdd = false;
			return false;
		}
	});
	
	return allowAdd;
}

/**
 * 增加结果字段
 */
function addResField(node){
	var p = new Ext.data.Record({
		tableName: node.attributes.tableName,
		tableShowName: node.attributes.tableShowName,
		fieldName: node.attributes.fieldName,
		fieldShowName: node.text,
		dataType: node.attributes.dataType
	});
	resGrid.store.add(p);
	resGrid.view.refresh();
}

/**
 * 初始化左侧的TabPanel
 */
function initWestTab(){
	initDictTree();
	initSearchTree();
	
	westTab = new Ext.TabPanel({
		activeTab: 0,
		tabPosition: "bottom",
		region: 'west',
		split: true,
		margins : '4 0 4 4',
		width: 200,
		items: [searchTree,dictTree]
	});
}

/**
 * 初始化工具栏
 */
function initToolbar(){
	toolbar = new Ext.Toolbar(["<span id='se_tb_name'>查询实例制作区</span>","->",{
		text: "查询",
		cls: "x-btn-text-icon",
		tooltip: "执行查询",
		icon: sys.getContextPath()+"/artery/pub/images/icon/search.gif",
		handler: function(){
			if(currSearchInfo && currSearchInfo.cid){
				var url = sys.getContextPath()+"/artery/search.do?action=list&cid="+currSearchInfo.cid;
				var win = Artery.open({
					name : 'searchWin',
					feature : {
						status : 'yes',
						location : 'yes'
					}
				});
				win.location.href = url;
				win.focus();
			}
		}
	},{
		id: "btn_saveSearch",
		text: "保存",
		cls: "x-btn-text-icon",
		tooltip: "保存配置",
		icon: sys.getContextPath()+"/artery/pub/images/icon/save.gif",
		handler: saveSearchInfo
	}]);
}

/**
 * 初始化实例修改窗口
 */
function initInstanceWindow(){
	win_nameField = new Ext.form.TextField({
		fieldLabel: "名称",
		anchor: "100%"
	});
	win_visitRight = new Ext.form.ComboBox({
		fieldLabel: "访问权限",
		editable: false,
		triggerAction: "all",
		typeAhead: true,
		anchor: "100%",
		store: [["1","私有"],["2","公共"]]
	});
	win_dataSource = new Ext.form.ComboBox({
		fieldLabel: "数据源",
		editable: false,
		triggerAction: "all",
		typeAhead: true,
		anchor: "100%",
		store: new Ext.data.SimpleStore({
        	data:dataSourceStore,
            fields: ['name']
        }),
        displayField:'name',
        valueField:'name',
        mode: 'local'
	});
	win_submit = new Ext.Button({
		text: "确定",
		minWidth: 70,
		handler: function(){
			alert("不定");
		}
	});
	instanceWindow = new Ext.Window({
		title: "需要修改",
		layout: "form",
		closeAction: "hide",
		width: 300,
		//height: 127,
		height: 153,
		modal: true,
		plain : true,
		autoDestroy: false,
		bodyStyle: "padding:4px;",
		labelWidth: 60,
		items: [win_nameField,win_visitRight,win_dataSource],
		buttons: [win_submit,{
			text: "取消",
			minWidth: 70,
			handler: function(){
				instanceWindow.hide();
			}
		}]
	});
}

/**
 * 初始化布局
 */
function initLayout(){
	field_type_name = {
		"1": "数字",
		"2": "文本",
		"3": "日期",
		"4": "二进制",
		"5": "普通代码",
		"6": "分级代码",
		"7": "组织机构",
		"8": "自动增长"
	};
	
	initMenu();
	initWestTab();
	initToolbar();
	initCondTree();
	initInstanceWindow();
	condEditor.initEditor();
	initResGrid();
	
	new Ext.Viewport({
		layout : 'border',
		border : false,
		items : [westTab,{
			xtype: "panel",
			region : 'center',
			margins : '4 4 4 0',
			layout: 'border',
			tbar: toolbar,
			items: [condTree,condEditor.getPanel(),resGrid]
		}]
	});
	
	initDragEvent();
	searchTree.root.reload();
}

Ext.onReady(function(){
	Ext.QuickTips.init();
	initLayout();
});