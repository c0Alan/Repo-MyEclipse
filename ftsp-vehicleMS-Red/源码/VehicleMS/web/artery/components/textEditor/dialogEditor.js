var editorObj = {};	// 脚本对象
var formTree;		// 表单树对象

// 节点单击事件，把id设置到输入框中
function clickNodeHandler(node){
	var nEle = node.attributes.data;
	var props = nEle.childNodes;
	var proplist;
	for (var i = 0; i < props.length; i++) {
		if (props[i].nodeName == "Properties") {
			proplist = props[i];
		}
	}
	if (proplist == null)
		return null;
	var itemid = "";
	for (var i = 0; i < proplist.childNodes.length; i++) {
		var element = proplist.childNodes[i];
		var elementname = element.getAttribute("name");
		if (elementname == "id") {
			itemid = element.childNodes[0].text;
			break;
		}
	}
	Ext.getCmp("select_id").setValue(itemid);
}

// 获得item的现实属性
function getNameProp(typeEl) {
	if (typeEl.nodeType != 1)
		return null;
	var nodeNameProp = typeEl.getAttribute("nameprop");
	if (nodeNameProp == null || !nodeNameProp)
		return null;

	var props = typeEl.childNodes;
	var proplist;
	for (var i = 0; i < props.length; i++) {
		if (props[i].nodeName == "Properties") {
			proplist = props[i];
		}
	}

	if (proplist == null)
		return null;

	for (var i = 0; i < proplist.childNodes.length; i++) {
		var element = proplist.childNodes[i];
		if (element.nodeType === 1) {
			var elementname = element.getAttribute("name");
			if (elementname == nodeNameProp) {
				return element.childNodes[0].text;
			}
		}
	}

	return null;
}

// 创建指定节点下的子节点
function genItemNode(itemEl, parentNode) {
	if (itemEl.nodeName != 'Item') {
		showTips("标记名称不是Item：" + itemEl.nodeName);
		return;
	}

	var nodeName = itemEl.getAttribute("cn");
	var nodeType = itemEl.getAttribute("type");
	var newNodeName = getNameProp(itemEl);
	if (newNodeName && newNodeName != null && newNodeName != "")
		nodeName = newNodeName;
	var sonNode = parentNode.appendChild(new Ext.tree.TreeNode({
		text : nodeName,
		type : nodeType,
		data : itemEl,
		iconCls : nodeType
	}));
	return sonNode;
}

function genTreeNode(parentEl, parentNode) {
	for (var i = 0; i < parentEl.childNodes.length; i++) {
		var subEl = parentEl.childNodes[i];
		if (subEl.nodeName == 'Items') {
			for (var j = 0; j < subEl.childNodes.length; j++) {
				var sonEl = subEl.childNodes[j];
				if(sonEl.nodeName=="Item"){
					var sonNode = genItemNode(sonEl, parentNode);
					genTreeNode(sonEl, sonNode);
				}
			}
		}
	}
}

// 初始化表单树对象
function initTreePanel(conf){
	if(!conf.tpldom){
		return ;
	}
	
	formTree = new Ext.tree.TreePanel({
		region : 'west',
		animate : false,
		id : 'formtpl',
		width : 200,
		split : true,
		minSize : 100,
		maxSize : 300,
		title : '表单模板',
		header : true,
		border : true,
		enableDD : true,
		tools : [{
			id : "plus",
			qtip : "展开全部节点",
			handler : function() {
				formTree.root.expand(true, false);
			}
		}, {
			id : "minus",
			qtip : "折叠全部节点",
			handler : function() {
				formTree.root.collapse(true, false);
				formTree.root.expand(false, false);
			}
		}],
		bbar:[{
			id: "select_id",
			xtype: "textfield",
			width: 200,
			selectOnFocus: true
		}],
		containerScroll : true,
		autoScroll : true
	});
	formTree.on("click", clickNodeHandler);
	
	var doc = conf.tpldom;
	var rootEl = doc.documentElement;
	var nodeText = rootEl.getAttribute("cn");
	var nodeType = rootEl.getAttribute("type");
	var newNodeName = getNameProp(rootEl);
	if (newNodeName && newNodeName != null && newNodeName != "")
		nodeText = newNodeName;
	var rootNode = formTree.setRootNode(new Ext.tree.TreeNode({
		text : nodeText,
		type : nodeType,
		data : rootEl,
		iconCls : nodeType
	}));
	genTreeNode(rootEl, rootNode);
}

function initLayout(conf){
	initTreePanel(conf);
	if(conf.language=="java"){
		initJavaEditor(conf);
	}else if(conf.language=="javascript"){
		initJsEditor(conf);
	}else if(conf.language=="script"){
		initScriptEditor(conf);
	}
}

// 语法检查
function checkSyntax(code) {
	var map = new Map();
	map.put("key", "console.syntax.check");
	map.put("code", code);
	var query = new QueryObj(map, function(query) {
		var msg = query.getDetail();
		if (msg == "ok") {
			msg = "脚本无语法错误";
		}
		editorObj.mainPanel.setVisible(false);
		Ext.Msg.alert("语法检查",msg,function(){
			editorObj.mainPanel.setVisible(true);
		});
	});
	query.send();
}

function initJavaEditor(conf){
	document.title = "java编辑器  "+conf.name;
	editorObj.textarea = new CodePanel({
		language : "java",
		editorTips : sqlTips,
		region : "center"
	});
	// 设置tips
	editorObj.textarea.setTips(conf.tips);
	// 设置值
	if(Ext.isEmpty(conf.code)){
		editorObj.textarea.setCode("");
	}else{
		editorObj.textarea.setCode(Ext.decode(conf.code));
	}
	editorObj.helpPanel = new Ext.Panel({
		region : "north",
		split : true,
		height : 50,
		html: conf.help
	});
	editorObj.helpPanel.setVisible(false);
	
	var itemsObj = [editorObj.helpPanel, editorObj.textarea];
	if(formTree){
		itemsObj.push(formTree);
	}
	
	editorObj.mainPanel = new Ext.Panel({
		layout : 'border',
		border : false,
		items : itemsObj,
		buttons : [{
			text: "提示信息",
			handler: showHelp
		},{
			text : '语法检查',
			handler : function() {
				var code = editorObj.textarea.getCode();
				checkSyntax(code);
			}
		}, {
			text : '确 定',
			handler : function() {
				var code = editorObj.textarea.getCode();
				if(Ext.isEmpty(code)){
					conf.callback("");
				}else{
					conf.callback(Ext.encode(code));
				}
				window.close();
			}
		}, {
			text : '取 消',
			handler : function() {
				window.close();
			}
		}]
	});
	new Ext.Viewport({
         layout:'fit',
         border:false,
         hideBorders :true,
         items:[editorObj.mainPanel]
    });
}

function initScriptEditor(conf){
	document.title = "脚本编辑器  "+conf.name;
	editorObj.clientArea = new CodePanel({
		language : "javascript",
		editorTips : sqlTips,
		border : true
	});
	editorObj.serverArea = new CodePanel({
		language : "java",
		editorTips : sqlTips,
		border : true
	});
	// 设置code
	if (conf.code.indexOf('{') == 0) {
		var obj = Ext.decode(conf.code);
		editorObj.clientArea.setCode(obj.client);
		editorObj.serverArea.setCode(obj.server);
	} else {
		editorObj.clientArea.setCode("");
		editorObj.serverArea.setCode("");
	}
	// 设置tips
	if (Ext.isEmpty(conf.tips)) {
		editorObj.clientArea.setTips("");
		editorObj.serverArea.setTips("");
	} else {
		var pos = conf.tips.indexOf(";");
		var clientTips = conf.tips.substring(0, pos);
		var serverTips = conf.tips.substr(pos + 1);
		editorObj.clientArea.setTips(clientTips);
		editorObj.serverArea.setTips(serverTips);
	}
	editorObj.tabPanel = new Ext.TabPanel({
		region : "center",
		activeTab : 0,
		border : false,
		items : [{
			title : "客户端代码",
			layout : "fit",
			border : false,
			items : editorObj.clientArea
		}, {
			title : "服务器端代码",
			layout : "fit",
			border : false,
			items : editorObj.serverArea
		}]
	});
	editorObj.tabPanel.on("beforetabchange", function(tp, np, op) {
		if (np.title == "服务器端代码")
			Ext.getCmp("btnCheck").show();
		else
			Ext.getCmp("btnCheck").hide();
		if (editorObj.clientArea.editorObj)
			Ext.getCmp("btn_ok").focus();
	});
	// 提示帮助Panel
	editorObj.helpPanel = new Ext.Panel({
		region : "north",
		split : true,
		height : 50,
		html: conf.help
	});
	editorObj.helpPanel.setVisible(false);
	
	var itemsObj = [editorObj.helpPanel, editorObj.tabPanel];
	if(formTree){
		itemsObj.push(formTree);
	}
	
	editorObj.mainPanel = new Ext.Panel({
		layout : 'border',
		border : false,
		items : itemsObj,
		buttons : [{
			id : 'btnCheck',
			text : '语法检查',
			handler : function() {
				var code = editorObj.serverArea.getCode();
				checkSyntax(code);
			}
		},{
			text: "提示信息",
			handler: showHelp
		}, {
			id : "btn_ok",
			text : '确 定',
			handler : function() {
				var obj = {};
				obj.client = editorObj.clientArea.getCode();
				if (obj.client == null || obj.client.trim() == "") {
					obj.client = "";
				}
				obj.server = editorObj.serverArea.getCode();
				if (obj.server == null || obj.server.trim() == "") {
					obj.server = "";
				}
				var code = Ext.encode(obj);
				conf.callback(code);
				window.close();
			}
		}, {
			text : '取 消',
			handler : function() {
				window.close();
			}
		}]
	});
	new Ext.Viewport({
         layout:'fit',
         border:false,
         hideBorders :true,
         items:[editorObj.mainPanel]
    });
}

function initJsEditor(conf){
	document.title = "javascript编辑器  "+conf.name;
	editorObj.textarea = new CodePanel({
		region : "center",
		editorTips : sqlTips,
		language : "javascript"
	});
	// 设置tips
	editorObj.textarea.setTips(conf.tips);
	// 设置code
	if(Ext.isEmpty(conf.code)){
		editorObj.textarea.setCode("");
	}else{
		editorObj.textarea.setCode(Ext.decode(conf.code));
	}
	editorObj.helpPanel = new Ext.Panel({
		region : "north",
		split : true,
		height : 50,
		html: conf.help
	});
	editorObj.helpPanel.setVisible(false);
	
	var itemsObj = [editorObj.helpPanel, editorObj.textarea];
	if(formTree){
		itemsObj.push(formTree);
	}
	
	editorObj.mainPanel = new Ext.Panel({
		layout : 'border',
		border : false,
		items : itemsObj,
		buttons : [{
			text: "提示信息",
			handler: showHelp
		},{
			text : '确 定',
			handler : function() {
				var code = editorObj.textarea.getCode();
				if(Ext.isEmpty(code)){
					conf.callback("");
				}else{
					conf.callback(Ext.encode(code));
				}
				window.close();
			}
		}, {
			text : '取 消',
			handler : function() {
				window.close();
			}
		}]
	});
	new Ext.Viewport({
         layout:'fit',
         border:false,
         hideBorders :true,
         items:[editorObj.mainPanel]
    });
}

// 显示帮助信息
function showHelp(){
	if (editorObj.helpPanel.isVisible()) {
		editorObj.helpPanel.setVisible(false);
	} else {
		editorObj.helpPanel.setVisible(true);
	}
	editorObj.mainPanel.doLayout();
}