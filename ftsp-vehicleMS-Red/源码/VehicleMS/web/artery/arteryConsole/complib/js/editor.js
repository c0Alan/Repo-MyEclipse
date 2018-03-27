// 让propertiesgrid不默认为按照name正排序
Ext.grid.PropertyGrid.prototype.initComponent = function() {
	this.customEditors = this.customEditors || {};
	this.lastEditRow = null;
	var store = new Ext.grid.PropertyStore(this);
	this.propStore = store;
	var cm = new Ext.grid.PropertyColumnModel(this, store);
	// store.store.sort('name', 'ASC');
	this.addEvents('beforepropertychange', 'propertychange');
	this.cm = cm;
	this.ds = store.store;
	Ext.grid.PropertyGrid.superclass.initComponent.call(this);

	this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex) {
		if (colIndex === 0) {
			this.startEditing.defer(200, this, [rowIndex, 1]);
			return false;
		}
	}, this);
};

Ext.ns('AtyCon');

/**
 * 属性编辑器，里面包含propGrid
 */
AtyCon.PropEditor = function(){
};

Ext.apply(AtyCon.PropEditor.prototype,{
	
	/**
	 * 属性编辑Grid
	 */
	propGrid: null,
	
	/**
	 * 自定义编辑器
	 */
	customEditors: {},
	
	/**
	 * 自定义编辑器Map key=dataType value=editor
	 */
	editorMap: {},
	
	/**
	 * 属性提示
	 */
	propTip: null,
	
	/**
	 * 当属性值改变时，将调用此方法
	 */
	onPropChange: Ext.emptyFn,
	
	/**
	 * 表单模板信息
	 */
	formtpl: null,
	
	/**
	 * 属性显示类别，分为：common,advanced,event
	 */
	propType: 'common',
	
	/**
	 * 普通属性按钮
	 */
	commonButton: null,
	
	/**
	 * 当前状态
	 */
	currentState: "normal",
	
	/**
	 * 是否显示不生成的控件
	 */
	showUnshowConfig : null,
	
	/**
	 * id属性中文名
	 */
	idPropName : "标识",
	
	/**
	 * 初始化方法
	 */
	init : function(extendConfig) {
		var sqlTips = null;
		try {
			sqlTips = extendConfig.editorTips;
			delete extendConfig.editorTips;
		} catch (e) {
		}
		this.initPropPanel(extendConfig);
		this.initCustomEditor(sqlTips);
		this.initPropTip();
		return this.propGrid;
	},
	
	// 初始化属性编辑窗口
	// extendConfig -- 附加属性
	initPropPanel: function (extendConfig) {
		var config = {
			region : extendConfig.region,
			source : {},
			hideHeaders : true,
			loadMask : true,
			stripeRows : true,
			viewConfig : {
				forceFit : true
			},
			customEditors : this.customEditors
		};
		config.tbar = this.initToolbar(Ext.id());
		Ext.applyIf(config, extendConfig);
		this.propGrid = new Ext.grid.PropertyGrid(config);
		
		var currentcol = 1;
		this.propGrid.on("cellclick", function(grid, row, col, e) {
			currentcol = col;
		});
		var propEd = this;
		this.propGrid.on("beforeedit", function(e) {
			if (currentcol == 0)
				e.cancel = true;
			if(propEd.currentState != 'normal' && e.record.id == propEd.idPropName){
				e.cancel = true;
			}
		});
		this.propGrid.on("celldblclick", this.showPropTip,this);
		this.propGrid.on("afteredit", this.savePropToNode,this);
	},
	
	/**
	 * 初始化工具栏
	 */
	initToolbar: function(tg){
		var tc = ['属性列表<双击查看帮助>','->'];
		tc.push(' ');
		var me = this;
		this.commonButton = new Ext.Toolbar.Button({
			pressed: true,
			toggleGroup: tg,
			cls : 'x-btn-icon all',
			tooltip: '显示属性',
			handler: function(){
				this.propType = "common";
				this.refreshData(this.propGrid.data);
			},
			scope: me
		});
		tc.push(this.commonButton);
		tc.push(' ');
		tc.push({
			toggleGroup: tg,
			cls : 'x-btn-icon event',
			tooltip: '显示事件',
			handler: function(){
				this.propType = "event";
				this.refreshData(this.propGrid.data);
			},
			scope: this
		});
		return tc;
	},
	
	/**
	 * 显示属性提示
	 */
	showPropTip: function(grid,row,col,e){
		var cc = col;
		var rr = row;
		var xy = e.getXY();
		xy[0] = xy[0] + 5;
		xy[1] = xy[1] + 5;
		var record = this.propGrid.propStore.store.getAt(rr);
		if(record){
			var pt = this.propTip;
			if(!pt.rendered){
				pt.render(document.body);
			}
			var propname = record.get("name");
			var propen = pt.propens[propname];
			var helpid = pt.helpids[propname];
			document.getElementById(pt.nameid).innerHTML = propen;
			var proptip = pt.tips[propname];
			if(Ext.isEmpty(proptip)){
				document.getElementById(pt.tipid).innerHTML = "";
			}else{
				document.getElementById(pt.tipid).innerHTML = proptip;
			}
//            document.getElementById(pt.linkid).href=sys.getContextPath()
//                + "/artery/businesshelp/dealBusinesshelp.do?action=toItemEditPage&id="+ helpid+ "&type=4"
//                + "&readOnly=1#"+propen.replace("-","_");
			document.getElementById(pt.linkid).onclick=function(){
				var propHelpWin = Artery.open({
					url:'http://api.thunisoft.com?plugin='+pt.itemType+'&prop='+propen,
					feature:{width:'800',height:'600'},
					center:true
				});
				if(propHelpWin != null){
					propHelpWin.focus();
				}
			};
			pt.showAt(xy);
		}
	},
	
	/**
	 * 获得某状态下的状态修改属性信息,没有则创建一个空的
	 */
	getCreateStateItemsEl: function(state){
		if(state == "normal") {
			return null;
		}
		var stateItemsEl = this.getStateItemsEl(state);
		if(stateItemsEl == null || stateItemsEl.childNodes == null || stateItemsEl.childNodes.length == 0){
		    var doc = this.formtpl.dom;
		    var rootEl = doc.documentElement;
			var stateItemsEl = doc.createElement(Artery.getStateTagName(state));
			rootEl.appendChild(stateItemsEl);
		}
		return stateItemsEl;
	},
	
	/**
	 * 获得某状态下的状态修改属性信息
	 */
	getStateItemsEl: function(state){
		var doc = this.formtpl.dom;
		var rootEl = doc.documentElement;
		var stateTagName = Artery.getStateTagName(state);
		var nodeList = rootEl.getElementsByTagName(stateTagName);
		if(nodeList != null){
			return nodeList[0];
		}
		return null;
	},
	
	/**
	 * 获得某状态下某控件的修改属性数据,没有则创建一个空的
	 */
    getCreateSingleStateIemEl: function(state, sid, type){
		if(state == "normal") {
			return null;
		}
		var stateItemsEl = this.getCreateStateItemsEl(state);
		var stateNodeEl = this.getSingleStateIemEl(sid, stateItemsEl);
		if(stateNodeEl == null){
			var doc = this.formtpl.dom;
			stateNodeEl = doc.createElement("Item");
			stateNodeEl.setAttribute("sid", sid);
			if(!Ext.isEmpty(type)){
				stateNodeEl.setAttribute("type", type);
			}
			var propsEl = doc.createElement("Properties");
			stateNodeEl.appendChild(propsEl);
			stateItemsEl.appendChild(stateNodeEl);
		}
		return stateNodeEl;
	},
	
	/**
	 * 获得某状态下某控件的修改属性数据
	 */
	getSingleStateIemEl: function(sid, stateItemsEl){
		if(stateItemsEl == null){
			return null;
		}
		var childNodeEls = stateItemsEl.childNodes;
		var tmpNodeEl = null;
		for(var i = 0; i < childNodeEls.length; i++){
			tmpNodeEl = childNodeEls[i];
			if(tmpNodeEl.getAttribute("sid") == sid){
				return tmpNodeEl;
			}
		}
		return null;
	},
	
	/**
	 * 删除某个状态修改属性
	 */
	removeStateProp: function(propname, nodeEl) {
		var sid = nodeEl.getAttribute("sid");
		var stateItemsEl = this.getStateItemsEl(this.currentState);
		var stateNodeEl = this.getSingleStateIemEl(sid, stateItemsEl);
		var statePropEl = this.findPropFromStateNodeElByCn(propname, stateNodeEl);
		if(statePropEl == null) {
			return false;
		}
		var propsEl = stateNodeEl.childNodes[0];
		propsEl.removeChild(statePropEl);
		if(propsEl.childNodes == null || propsEl.childNodes.length == 0){
			stateItemsEl.removeChild(stateNodeEl);
		}
		if(stateItemsEl.childNodes == null || stateItemsEl.childNodes.length == 0){
			var rootEl = this.formtpl.dom.documentElement;
			rootEl.removeChild(stateItemsEl);
		}
		return true;
	},
	
	/**
	 * 添加状态修改属性
	 * 返回值，表示属性值是否改变
	 */
	addStateProp: function(propname, newValue, nodeEl) {
		var type = nodeEl.getAttribute("type");
		var sid = nodeEl.getAttribute("sid");
		var stateNodeEl = this.getCreateSingleStateIemEl(this.currentState, sid, type);
		
		var statePropEl = this.findPropFromStateNodeElByCn(propname, stateNodeEl);
		if(statePropEl == null) {
			var propsEl = stateNodeEl.childNodes[0];
			var doc = this.formtpl.dom;
			statePropEl = doc.createElement("Property");
			propsEl.appendChild(statePropEl);
			var pt = this.propTip;
			var propen = pt.propens[propname];
			statePropEl.setAttribute("name", propen);
			var valEl = doc.createElement("Value");
			statePropEl.appendChild(valEl);
			XmlUtil.setText(valEl, newValue);
			return true;
		}else {
			var valueEle = XmlUtil.getChild(statePropEl, "Value");
			var valueText = XmlUtil.getText(valueEle);
			if(newValue != valueText) {
				XmlUtil.setText(valueEle, newValue);
				return true;
			}
			return false;
		}
	},
	
	/**
	 * 保存属性到Node
	 */
	savePropToNode: function(e) {
		var propStateModi = {};
		var node = this.propGrid.data;
		var el = node.attributes.data;
		var propsSource = this.propGrid.getSource();
		var propChange = false;
		
		var modified = false;
		//throw e;
		var needUpdateNameProp = false;
		var valNameProp = "";
		var cnNameProp = "";
		var SelectEL = null;
		for (var i = 0; i < el.childNodes.length; i = i + 1) {
			var subEl = el.childNodes[i];
			if (subEl.nodeName == 'Properties') {
				SelectEL = subEl;
				for (var j = 0; j < subEl.childNodes.length; j = j+ 1) {
					var propEl = subEl.childNodes[j];
					if(propEl.nodeType!=1){
						continue;
					}
					var propname = this.getPropName(propEl);
					var proptype = propEl.getAttribute("type");
					var valueEle = XmlUtil.getChild(propEl, "Value");
					if (propsSource[propname] != undefined) {
						var nameprop = el.getAttribute("nameprop");
						valNameProp = nameprop;
						cnNameProp = el.getAttribute("cn");
						var newV = propsSource[propname] + "";
						var oldV = XmlUtil.getText(valueEle);
						if(this.currentState == "normal") {
							if(newV!=oldV){
								XmlUtil.setText(valueEle, newV);
								propChange = true;
							}
						}else {
							if(newV != oldV){
								if(!modified) {
									modified = true;
								}
								propChange = this.addStateProp(propname, newV, el);
								propStateModi[propname] = newV;
							}else {
								propChange = this.removeStateProp(propname, el);
							}
						}
						if (nameprop != null && nameprop && nameprop == propEl.getAttribute("name")){
							//alert('fds');
							//var valueText = XmlUtil.getText(valueEle);
							var valueText = newV;
							if (valueText == ""){
								node.setText(el.getAttribute("cn"));
							}else{
								node.setText(valueText);
							}
						}else if(nameprop != null && nameprop && nameprop.indexOf(propEl.getAttribute("name"))>-1 && newV != oldV){
							needUpdateNameProp = true;
						}
						/**
						 * 当编辑的是报表和文书时，不涉及多状态
						 */
						if(this.showUnshowConfig != null){
							if(propEl.getAttribute("name") == "show"){
								this.updateNodeShowStatus(newV, node);
							}
						}
					}
				}
			}
		}
		//更改了NameProp对应属性的值
		if(needUpdateNameProp){
			var nodeText = ParsePropName(valNameProp,SelectEL);
			if(nodeText==null || nodeText==""){
				nodeText = cnNameProp;
			}
			node.setText(nodeText);
//			alert(valNameProp);
//			alert(cnNameProp);
		}
		if(this.currentState != "normal") {
		    if(modified){
		    	node.getUI().addClass("change-state-item");
		    }else{
		    	node.getUI().removeClass("change-state-item");
		    }
		}
		this.updateStatePropColor(propStateModi);
		if(propChange){
			this.onPropChange();
		}
	},
	
	/**
	 * 更新节点是否显示
	 */
	updateNodeShowStatus: function(propShow, node){
		if(this.showUnshowConfig[this.currentState]){
			node.getUI().show();
		}else{
			if(propShow == "false"){
				node.getUI().hide();
				node.getOwnerTree().root.select();
			}else{
				node.getUI().show();
			}
		}
	},
	
	/**
	 * 初始化propTip对象
	 */
	initPropTip: function(){
		var nameid = Ext.id();
		var tipid = Ext.id();
		var linkid = Ext.id();
		var pt = this.propTip = new Ext.Tip({
			html: "<table class=prop-tip>"+
			      "  <tr><td width=50>英文名:</td><td><font id="+nameid+" color=red>aaa</font></td>"
                    + "<td align='right'><a id='"+linkid+"' href='javascript:void(0)'>more...</a></td></tr>"+
			      "  <tr><td style='vertical-align:top;'>描　述:</td><td width=150 colspan=2><font id="+tipid+" color =gray style='word-break:break-all;'>aaa</td></font></tr>"+
			      "</table>"
		});
		pt.nameid = nameid;
		pt.tipid = tipid;
        pt.linkid = linkid;
		Ext.EventManager.on(document.body, "click", function(e) {
			pt.hide();
		});
	},
	
	/**
	 * 初始化自定义编辑器
	 */
	initCustomEditor: function(sqlTips) {
		// text(str)
		this.editorMap["1"] = this.initStrEditor();

		// normalcode
		this.editorMap["3"] = this.initNCEditor();
		
		// classcode
		var classCodeTrigger = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger",
			readOnly : true
		});
		classCodeTrigger.onTriggerClick = function() {
			alert("classcode");
		};
		this.editorMap["4"] = new Ext.grid.GridEditor(classCodeTrigger);

		// icon
		this.editorMap["5"] = this.editorMap["1"];

		// linkform
		this.editorMap["6"] = this.initFormEditor();

		// textarea
		this.editorMap["7"] = this.initAreaEditor();

		// htmleditor
		this.editorMap["8"] = this.initHTMLEditor();

		// datapicker
		this.editorMap["9"] = this.initDateEditor();
		
		// color
		this.editorMap["10"] = this.initColorEditor();

		// boolean
		this.editorMap["11"] = this.initBooleanEditor();
		// sql
		this.editorMap["12"] = this.initSqlEditor();
		// script
		this.editorMap["13"] = this.initScriptEditor(sqlTips);
		// java
		this.editorMap["14"] = this.initJavaEditor(sqlTips);
		// javascript
		this.editorMap["15"] = this.initJsEditor(sqlTips);
		// xml
		this.editorMap["16"] = this.initXmlEditor(sqlTips);
		// list选择
		this.editorMap["17"] = this.initListEditor();
		// chart编辑
		this.editorMap["18"] = this.initChartEditor();
	},
	
	/**
	 * 初始化字符串编辑器，支持mask
	 */
	initStrEditor: function(){
		var strEditorObj = {};
		// 验证对象
		strEditorObj.maskObj = {};
		// 验证方法
		strEditorObj.maskObj.test = function(cc) {
			if (strEditorObj.maskReg) {
				return strEditorObj.maskReg.test(cc);
			} else {
				return true;
			}
		};
		strEditorObj.textField = new Ext.form.TriggerField({
			regex : strEditorObj.maskObj,
			msgTarget : "qtip",
			selectOnFocus: true,
			triggerClass: "trigger_sel",
			onTriggerClick : function() {
				strEditorObj.gridEditor.completeEdit();
				strEditorObj.textArea.setValue(strEditorObj.textField.getValue());
				strEditorObj.textAreaWindow.show();
			}
		});
		strEditorObj.textArea = new Ext.form.TextArea({});
		var pg = this.propGrid;
		strEditorObj.textAreaWindow = new Ext.Window({
			title : '文本编辑窗口',
			width : 450,
			height : 300,
			modal : true,
			resizable : true,
			closeAction : 'hide',
			layout : 'fit',
			border : false,
			maximizable : true,
			items : [strEditorObj.textArea],
			buttons : [{
				text : '确 定',
				handler : function() {
					var v = strEditorObj.textArea.getValue();
					var r = strEditorObj.gridEditor.record;
					pg.getSource()[r.id] = v;
					r.set("value", v);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					strEditorObj.textAreaWindow.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					strEditorObj.textAreaWindow.setVisible(false);
				}
			}]
		});
		strEditorObj.gridEditor = new Ext.grid.GridEditor(strEditorObj.textField);
		strEditorObj.gridEditor.propEle = {}; // 用于存放xml节点( tagName=property )
		// 创建正则表达式
		strEditorObj.gridEditor.on("beforestartedit", function() {
			var propname = strEditorObj.gridEditor.record.get("name");
			var propEle = strEditorObj.gridEditor.propEle[propname];
			if(!propEle){
				return ;
			}
			var maskValue = propEle.getAttribute("mask");
			var errorMsg = propEle.getAttribute("et");
			if (maskValue && maskValue.trim() != "") {
				strEditorObj.maskReg = new RegExp(maskValue);
				strEditorObj.textField.regexText = errorMsg
						? errorMsg
						: "非法输入值";
			}
			// test
			// strEditorObj.maskReg = new RegExp("^\\d{1,}%{0,1}$");
			// strEditorObj.textField.regexText = errorMsg ? errorMsg:
			// "非法输入值";
		});
		// 销毁正则表达式
		strEditorObj.gridEditor.on("complete", function() {
			strEditorObj.maskReg = null;
		});
		return strEditorObj.gridEditor;
	},
	
	/**
	 * 初始化normal编辑器
	 */
	initNCEditor: function(){
		var ncEditorObj = {};
		ncEditorObj.store = new Ext.data.JsonStore({
			url : sys.getContextPath()+'/artery/formmake.do?action=loadCodeJson',
			root : 'fields',
			fields : [{
				name : 'codeValue'
			}, {
				name : 'codeName'
			}]
		});
		ncEditorObj.store.on("beforeload", function() {
			var propname = ncEditorObj.gridEditor.record.get("name");
			this.baseParams.codeType = ncEditorObj.gridEditor.codeType[propname];
		});
		ncEditorObj.field = new Ext.form.ComboBox({
			store : ncEditorObj.store,
			valueField : 'codeValue',
			displayField : 'codeName',
			typeAhead : true,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true
		});
		ncEditorObj.field.on("show", function() {
			var r = ncEditorObj.gridEditor.record;
			if (r) {
				ncEditorObj.store.load();
			}
		});
		ncEditorObj.gridEditor = new Ext.grid.GridEditor(ncEditorObj.field);
		// 用于存放每个属性对应的codetype
		ncEditorObj.gridEditor.codeType = {};
		return ncEditorObj.gridEditor;
	},
	
	// 初始化表单链接编辑器
	initFormEditor: function(){
		FormEditor.init();
		var formEditorObj = {};
		var pg = this.propGrid;
		formEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger",
			readOnly : false,
			onTriggerClick : function() {
				var formInfo = formEditorObj.gridEditor.record.get("value");
				var propname = formEditorObj.gridEditor.record.get("name");
				var formTypeShow = formEditorObj.gridEditor.formType[propname];
				formEditorObj.gridEditor.completeEdit();
				var startInfo;
				if (formInfo != null && formInfo != "") {
					startInfo = Ext.decode(formInfo);
				} else {
					startInfo = null;
				}
				FormEditor.edit(function(info) {
					var fi = "";
					if (info) {
						fi = Ext.encode(info);
					}
					var r = formEditorObj.gridEditor.record;
					pg.getSource()[r.id] = fi;
					r.set("value", fi);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
				}, startInfo, formTypeShow);
			}
		});
		formEditorObj.gridEditor = new Ext.grid.GridEditor(formEditorObj.field);
		// 用于存放显示的表单类型
		formEditorObj.gridEditor.formType = {};
		return formEditorObj.gridEditor;
	},
	
	/**
	 * 初始化文本编辑区域
	 */
	initAreaEditor: function(){
		var areaEditorObj = {};
		areaEditorObj.textarea = new Ext.form.TextArea({});
		var pg = this.propGrid;
		areaEditorObj.window = new Ext.Window({
			title : '文本编辑窗口',
			width : 450,
			height : 300,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			layout : 'fit',
			border : false,
			items : [areaEditorObj.textarea],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = areaEditorObj.gridEditor.record;
					var tv = areaEditorObj.textarea.getValue();
					tv = Ext.encode(tv);
					pg.getSource()[r.id] = tv
					r.set("value", tv);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					areaEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					areaEditorObj.window.setVisible(false);
				}
			}]
		});
		areaEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		areaEditorObj.field.onTriggerClick = function() {
			var r = areaEditorObj.gridEditor.record;
			var tv = r.get("value");
			if(Ext.isEmpty(tv)){
				tv = "";
			}else{
				var fc = tv.substr(0,1);var tmp;
				if(fc=="\""){
					tmp = "{code:"+tv+"}";
				}else{
					tmp = "{code:\""+tv+"\"}";
				}
				try{
					tv = Ext.decode(tmp).code;
				}catch(e){}
			}
			areaEditorObj.textarea.setValue(tv);
			areaEditorObj.gridEditor.completeEdit();
			areaEditorObj.window.show();
		};
		areaEditorObj.gridEditor = new Ext.grid.GridEditor(areaEditorObj.field);
		return areaEditorObj.gridEditor;
	},
	
	// 初始化HTML编辑器
	initHTMLEditor: function(){
		var htmlEditorObj = {};
		htmlEditorObj.textarea = new Ext.form.HtmlEditor({});
		var pg = this.propGrid;
		htmlEditorObj.window = new Ext.Window({
			title : 'HTML编辑窗口',
			width : 600,
			height : 400,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			layout : 'fit',
			border : false,
			items : [htmlEditorObj.textarea],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = htmlEditorObj.gridEditor.record;
					var v = htmlEditorObj.textarea.getValue();
					pg.getSource()[r.id] = v;
					r.set("value", v);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					htmlEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					htmlEditorObj.window.setVisible(false);
				}
			}]
		});
		htmlEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		htmlEditorObj.field.onTriggerClick = function() {
			var r = htmlEditorObj.gridEditor.record;
			htmlEditorObj.textarea.setValue(r.get("value"));
			htmlEditorObj.gridEditor.completeEdit();
			htmlEditorObj.window.setTitle("HTML编辑窗口 <font color=red>" + r.get("name") + "</font>");
			htmlEditorObj.window.show();
		};
		htmlEditorObj.gridEditor = new Ext.grid.GridEditor(htmlEditorObj.field);
		return htmlEditorObj.gridEditor;
	},
	
	// 初始化日期编辑器
	initDateEditor: function(){
		var dateFld = new Ext.form.DateField({
			format: "Y-m-d"
		});
		var gridEditor = new Ext.grid.GridEditor(dateFld);
		gridEditor.getValue = function(){
			var val = this.field.getValue();
			val = this.field.formatDate(val);
        	return val;
    	};
		return gridEditor;
	},
	
	/**
	 * 初始化color编辑器
	 */
	initColorEditor: function() {
		var colorEditorObj = {};
		colorEditorObj.colorPalette = new Ext.ColorPalette({});
		colorEditorObj.colorPalette.on('select', function(palette, selColor) {
			colorEditorObj.colorField.setValue("#" + selColor);
		});
		colorEditorObj.colorField = new Ext.form.TextField({
			width : 148
		});
		var pg = this.propGrid;
		colorEditorObj.window = new Ext.Window({
			title : 'color编辑窗口',
			bodyStyle : 'padding:5px;',
			width : 180,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			items : [
				colorEditorObj.colorPalette,
				colorEditorObj.colorField
			],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = colorEditorObj.gridEditor.record;
					var v = colorEditorObj.colorField.getValue();
					pg.getSource()[r.id] = v;
					r.set("value", v);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					colorEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					colorEditorObj.window.setVisible(false);
				}
			}]
		});
		colorEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		colorEditorObj.field.onTriggerClick = function() {
			colorEditorObj.gridEditor.completeEdit();
			colorEditorObj.window.show();
			var r = colorEditorObj.gridEditor.record;
			var cvalue = r.get("value");
			colorEditorObj.colorField.setValue(cvalue);
			try {
				if (cvalue.indexOf("#") != -1) {
					cvalue = cvalue.substr(1);
					colorEditorObj.colorPalette.select(cvalue);
				}
			} catch (e) {
				// 忽略这里的错误
			}
		};
		colorEditorObj.gridEditor = new Ext.grid.GridEditor(colorEditorObj.field);
		return colorEditorObj.gridEditor;
	},
	
	/**
	 * 初始化boolean编辑器
	 */
	initBooleanEditor: function(){
		var bStore = new Ext.data.SimpleStore({
			fields:['name','value'],
			data:[
				['true','true'],
				['false','false']
			]
		});
		var booleanCombo = new Ext.form.ComboBox({
			store : bStore,
			valueField : 'value',
			displayField : 'name',
			typeAhead : true,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			allowBlank : false,
			anchor : '98%'
		});
		
		var gridEditor = new Ext.grid.GridEditor(booleanCombo);
		gridEditor.booleanEmpty = {};
		return gridEditor;
	},
	
	/**
	 * 初始化sql编辑器
	 */
	initSqlEditor: function(){
		var sqlEditorObj = {};
		sqlEditorObj.codePanel = new CodePanel({
			language : "sql",
			editorTips : sqlTips,
			border : true
		});
		var pg = this.propGrid;
		sqlEditorObj.window = new Ext.Window({
			title : 'sql编辑窗口',
			width : 600,
			height : 400,
			modal : true,
			resizable : true,
			closeAction : 'hide',
			maximizable : true,
			closable : true,
			layout : 'fit',
			border : false,
			items : [sqlEditorObj.codePanel],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = sqlEditorObj.gridEditor.record;
					var sqlStr = sqlEditorObj.codePanel.getCode();
					pg.getSource()[r.id] = sqlStr;
					r.set("value", sqlStr);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					sqlEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					sqlEditorObj.window.setVisible(false);
				}
			}]
		});
		sqlEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		sqlEditorObj.field.onTriggerClick = function() {
			var r = sqlEditorObj.gridEditor.record;
			sqlEditorObj.codePanel.setCode(r.get("value"));
			sqlEditorObj.gridEditor.completeEdit();
			sqlEditorObj.window.setTitle("sql编辑窗口 <font color=red>" + r.get("name") + "</font>");
			sqlEditorObj.window.show();
			sqlEditorObj.window.maximize();
		};
		sqlEditorObj.gridEditor = new Ext.grid.GridEditor(sqlEditorObj.field);
		return sqlEditorObj.gridEditor;
	},
	
	/**
	 * 初始化脚本编辑器
	 */
	initScriptEditor: function(sqlTips){
		var scriptEditor = {};
		scriptEditor.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		var xt = this;
		var pg = this.propGrid;
		scriptEditor.field.onTriggerClick = function() {
			scriptEditor.gridEditor.completeEdit();
			var r = scriptEditor.gridEditor.record;
			var s = r.get("value").trim();
			var propName = r.get("name");
			var scriptT = scriptEditor.gridEditor.scriptTips[propName];
			var scriptHelp = scriptEditor.gridEditor.scriptHelp[propName];
			
			var url = sys.getContextPath()+"/artery/components/textEditor/editor.jsp";
			
			var tpldom;
			var ft = xt.formtpl;
			if(ft){
				tpldom = ft.dom;
			}
			
			var conf = {
				language: "script",
				code: s,
				tips: scriptT,
				tpldom: tpldom,
				help: scriptHelp,
				name: propName,
				callback: function(codeValue){
					var r = scriptEditor.gridEditor.record;
					pg.getSource()[r.id] = codeValue;
					r.set("value", codeValue);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
				}
			};
			xt.lastConf = conf;
			if(Ext.isIE){
				window.showModalDialog(url,conf,"dialogWidth:850px;dialogHeight:550px;resizable:on");
			}else{
				window.open(url,null,'modal=yes,width=850,height=550');
			}
		};
		scriptEditor.gridEditor = new Ext.grid.GridEditor(scriptEditor.field);
		scriptEditor.gridEditor.scriptHelp = {};
		scriptEditor.gridEditor.scriptTips = {};
		return scriptEditor.gridEditor;
	},
	
	// 初始化java编辑器
	initJavaEditor: function(sqlTips){
		var javaEditorObj = {};
		javaEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		var xt = this;
		var pg = this.propGrid;
		javaEditorObj.field.onTriggerClick = function() {
			javaEditorObj.gridEditor.completeEdit();
			var r = javaEditorObj.gridEditor.record;
			var value = r.get("value");
			var propName = r.get("name");
			var ctips = javaEditorObj.gridEditor.scriptTips[propName];
			var scriptHelp = javaEditorObj.gridEditor.scriptHelp[propName];
			
			var tpldom;
			var ft = xt.formtpl;
			if(ft){
				tpldom = ft.dom;
			}
			
			var url = sys.getContextPath()+"/artery/components/textEditor/editor.jsp";
			var conf = {
				language: "java",
				code: value,
				tips: ctips,
				tpldom: tpldom,
				help: scriptHelp,
				name: propName,
				callback: function(codeValue){
					var r = javaEditorObj.gridEditor.record;
					pg.getSource()[r.id] = codeValue;
					r.set("value", codeValue);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
				}
			};
			xt.lastConf = conf;
			if(Ext.isIE){
				window.showModalDialog(url,conf,"dialogWidth:850px;dialogHeight:550px;resizable:on");
			}else{
				window.open(url,null,'modal=yes,width=850,height=550');
			}
		};
		javaEditorObj.gridEditor = new Ext.grid.GridEditor(javaEditorObj.field);
		javaEditorObj.gridEditor.scriptHelp = {};
		javaEditorObj.gridEditor.scriptTips = {};
		return javaEditorObj.gridEditor;
	},
	
	// 初始化javascript编辑器
	initJsEditor: function(sqlTips){
		var jsEditorObj = {};
		jsEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		var xt = this;
		var pg = this.propGrid;
		jsEditorObj.field.onTriggerClick = function() {
			jsEditorObj.gridEditor.completeEdit();
			var r = jsEditorObj.gridEditor.record;
			var value = r.get("value");
			var propName = r.get("name");
			var ctips = jsEditorObj.gridEditor.scriptTips[propName];
			var scriptHelp = jsEditorObj.gridEditor.scriptHelp[propName];
			
			var url = sys.getContextPath()+"/artery/components/textEditor/editor.jsp";
			
			var tpldom;
			var ft = xt.formtpl;
			if(ft){
				tpldom = ft.dom;
			}
			
			var conf = {
				language: "javascript",
				code: value,
				tips: ctips,
				tpldom: tpldom,
				help: scriptHelp,
				name: propName,
				callback: function(codeValue){
					var r = jsEditorObj.gridEditor.record;
					pg.getSource()[r.id] = codeValue;
					r.set("value", codeValue);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
				}
			};
			xt.lastConf = conf;
			if(Ext.isIE){
				window.showModalDialog(url,conf,"dialogWidth:850px;dialogHeight:550px;resizable:on");
			}else{
				window.open(url,null,'modal=yes,width=850,height=550');
			}
		};
		jsEditorObj.gridEditor = new Ext.grid.GridEditor(jsEditorObj.field);
		jsEditorObj.gridEditor.scriptHelp = {};
		jsEditorObj.gridEditor.scriptTips = {};
		return jsEditorObj.gridEditor;
	},
	
	/**
	 * 初始化javascript编辑器
	 */
	initXmlEditor: function(sqlTips){
		var xmlEditorObj = {};
		xmlEditorObj.codePanel = new CodePanel({
			editorTips : sqlTips,
			language : "xml"
		});
		var pg = this.propGrid;
		xmlEditorObj.window = new Ext.Window({
			title : 'xml编辑窗口',
			width : 600,
			height : 400,
			modal : true,
			resizable : true,
			closeAction : 'hide',
			layout : 'fit',
			border : false,
			maximizable : true,
			items : [xmlEditorObj.codePanel],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = xmlEditorObj.gridEditor.record;
					var value = xmlEditorObj.codePanel.getCode();
					if (value == null || value.trim() == "") {
						value = "";
					} else {
						// value = Ext.encode(value);
					}
					pg.getSource()[r.id] = value;
					r.set("value", value);
					// 手动触发 afteredit 事件
					pg.fireEvent("afteredit");
					xmlEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					xmlEditorObj.window.setVisible(false);
				}
			}]
		});
		xmlEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger"
		});
		xmlEditorObj.field.onTriggerClick = function() {
			var r = xmlEditorObj.gridEditor.record;
			var value = r.get("value");
			if (value.length == 0) {
				xmlEditorObj.codePanel.setCode("");
			} else {
				// xmlEditorObj.codePanel.setCode(Ext.decode(value));
				xmlEditorObj.codePanel.setCode(value);
			}
			xmlEditorObj.gridEditor.completeEdit();
			var propName = r.get("name");
			xmlEditorObj.window.setTitle("xml编辑窗口 <font color=red>" + propName
					+ "</font>");
			xmlEditorObj.window.show();
		};
		xmlEditorObj.gridEditor = new Ext.grid.GridEditor(xmlEditorObj.field);
		return xmlEditorObj.gridEditor;
	},
	
	/**
	 * 初始化List选择窗口
	 */
	initListEditor: function(){
		var listEditorObj = {};
		var pg = this.propGrid;
		listEditorObj.dataStore = new Ext.data.JsonStore({
			url : sys.getContextPath() + '/artery/formmake.do?action=loadListJson',
			root : 'fields',
			totalProperty : "totalCount",
			fields : [{
				name : 'codeName'
			}, {
				name : 'codeValue'
			}]
		});
		listEditorObj.gridPanel = new Ext.grid.GridPanel({
			stripeRows : true,
			enableDragDrop : false,
			loadMask : true,
			viewConfig : {
				forceFit : true
			},
			border : false,
			ds : listEditorObj.dataStore,
			cm : new Ext.grid.ColumnModel([{
				header : "代码名称",
				width : 150,
				sortable : false,
				dataIndex : 'codeName'
			}, {
				header : "代码值",
				width : 100,
				sortable : false,
				dataIndex : 'codeValue'
			}]),
			bbar: new Ext.PagingToolbar({
				pageSize : 20,
				store : listEditorObj.dataStore,
				displayInfo : true,
				displayMsg : '本页显示:{0} - {1} 总记录数:{2}',
				emptyMsg : "无记录"
			}),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			})
		});
		listEditorObj.window = new Ext.Window({
			title : '列表选择窗口',
			width : 600,
			height : 400,
			modal : true,
			resizable : true,
			closeAction : 'hide',
			layout : 'fit',
			border : false,
			maximizable : true,
			items : [listEditorObj.gridPanel],
			buttons : [{
				text : '确 定',
				handler : function() {
					var r = listEditorObj.gridEditor.record;
					var sr = listEditorObj.gridPanel.getSelectionModel().getSelected();
					if(sr){
						var value = sr.data["codeValue"];
						pg.getSource()[r.id] = value;
						r.set("value", value);
						// 手动触发 afteredit 事件
						pg.fireEvent("afteredit");
					}
					listEditorObj.window.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					listEditorObj.window.setVisible(false);
				}
			}]
		});
		listEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger",
			onTriggerClick: function(){
				var r = listEditorObj.gridEditor.record;
				var propName = r.get("name");
				listEditorObj.gridEditor.completeEdit();
				listEditorObj.window.setTitle("列表选择窗口 <font color=red>" + propName + "</font>");
				listEditorObj.window.show();
				var ct = listEditorObj.gridEditor.codeType[propName];
				listEditorObj.dataStore.baseParams.codeType = ct;
				listEditorObj.dataStore.load();
			}
		});
		listEditorObj.gridEditor = new Ext.grid.GridEditor(listEditorObj.field);
		listEditorObj.gridEditor.codeType = {};
		return listEditorObj.gridEditor;
	},
	
	/**
	 * 初始化chart编辑器
	 */
	initChartEditor: function(){
		var pg = this.propGrid;
		var chartEditorObj = {};
		chartEditorObj.editor = new AtyCon.ChartEditor();
		chartEditorObj.field = new Ext.form.TriggerField({
			triggerClass : "x-form-search-trigger",
			onTriggerClick: function(){
				var r = chartEditorObj.gridEditor.record;
				var v = r.get("value");
				try{
					v = Ext.decode(v);
				}catch(e){}
				chartEditorObj.gridEditor.completeEdit();
				chartEditorObj.editor.edit(v, function(nv){
					var r = chartEditorObj.gridEditor.record;
					pg.getSource()[r.id] = nv;
					r.set("value", nv);
					pg.fireEvent("afteredit");
				});
			}
		});
		chartEditorObj.gridEditor = new Ext.grid.GridEditor(chartEditorObj.field);
		return chartEditorObj.gridEditor;
	},
	
	/**
	 * 根据英文属性名获得state状态下修改的属性元素
	 */
	findPropFromStateNodeElByEn: function(nameEn, stateNodeEl) {
		if(stateNodeEl == null){
			return null;
		}
		var propsEl = stateNodeEl.childNodes[0];
		if (propsEl.nodeName == 'Properties') {
		    for (var i = 0; i < propsEl.childNodes.length; i = i + 1) {
				var propEl = propsEl.childNodes[i];
				var propName = propEl.getAttribute("name");
				if(propName == nameEn) {
					return propEl;
				}
			}
		}
		return null;
	},
	
	/**
	 * 根据中文属性名获得state状态下修改的属性元素
	 */
	findPropFromStateNodeElByCn: function(nameCn, stateNodeEl) {
		if(stateNodeEl == null){
			return null;
		}
		var pt = this.propTip;
		var nameEn = pt.propens[nameCn];
		return this.findPropFromStateNodeElByEn(nameEn, stateNodeEl);
	},
	
	/**
	 * 编辑指定xml节点的属性
	 */
	refreshData: function(node, state, stateNodeEl) {
		var propStateModi = {};
		if(!Ext.isEmpty(state)) {
			this.currentState = state;
		}
		var theState = this.currentState;
		
		var el = node.attributes.data;
		this.propGrid.stopEditing();
		
		var theStateNodeEl = null;
		if(this.currentState != "normal"){
			var stateItemsEl = this.getStateItemsEl(theState);
			var sid = el.getAttribute("sid");
			theStateNodeEl = this.getSingleStateIemEl(sid, stateItemsEl);
		}

		// 清空属性编辑器映射
		var ce = this.customEditors;
		for (var p in ce) {
			delete ce[p];
		}
		
		var pt = this.propTip;
		pt.propens = {};
		pt.tips = {};
		pt.helpids = {};
		pt.itemType=el.getAttribute('type');
		// 用于存放复杂对象，如：js代码，beanshell代码等
		var complexObj = {};
		for (var i = 0; i < el.childNodes.length; i = i + 1) {
			var subEl = el.childNodes[i];
			if (subEl.nodeName == 'Properties') {
				for (var j = 0; j < subEl.childNodes.length; j = j + 1) {
					var propEl = subEl.childNodes[j];
					if(propEl.nodeType!=1){
						continue;
					}
					var propishidden = propEl.getAttribute("isHidden");
					if (propishidden == '1') {
						continue;
					}
					
					var propname = this.getPropName(propEl);
					var propnameEn = propEl.getAttribute("name")
					var proptype = propEl.getAttribute("type");
					var propvalue = XmlUtil.getChildText(propEl, "Value");
					if(theState != "normal") {
						var statePropEl = this.findPropFromStateNodeElByEn(propnameEn, theStateNodeEl);
						var propValue = ( statePropEl == null ? null : XmlUtil.getChildText(statePropEl, "Value"));
						if(propValue != null) {
							propvalue = propValue;
							propStateModi[propname] = propvalue;
						}
					}
					var scriptHelp = propEl.getAttribute("sh");
					
					// 进行属性的过滤
					if(this.filterProp(proptype)===true){
						continue;
					}
					
					pt.propens[propname] = propnameEn;
                    if(propEl.getAttribute("helpid")){
    					pt.helpids[propname] = propEl.getAttribute("helpid");
                    }else{
    					pt.helpids[propname] = propEl.parentNode.parentNode.getAttribute("helpid");
                    }
					var scriptTips = propEl.getAttribute("tips");
					pt.tips[propname] = scriptTips;

					// 根据类型设置属性值
					if (proptype == '2') { // numeric
						if (propvalue == "") {
							complexObj[propname] = "";
						} else {
							complexObj[propname] = eval(propvalue);
						}
					} else if (proptype == '11') { // boolean
						complexObj[propname] = eval(propvalue);
					} else {
						complexObj[propname] = propvalue;
					}

					// 设置属性编辑器
					if (this.editorMap[proptype]) {
						ce[propname] = this.editorMap[proptype];
						// 对于normalcode，需要传送代码类型
						if (proptype == "3") {
							ce[propname].codeType[propname] = propEl.getAttribute("ct");
						}
						// 对于字符串信息，需要传送掩码(mask)
						else if (proptype == "1") {
							ce[propname].propEle[propname] = propEl;// propEl.getAttribute("mask");
						}
						// 对于linkto编辑器，可以提供显示表单类型参数
						else if(proptype == "6"){
							ce[propname].formType[propname] = propEl.getAttribute("ft");
						}
						// 对于boolean，判断是否有空值
						else if(proptype == "11"){
							ce[propname].booleanEmpty[propname] = propEl.getAttribute("be");
						}
						// 对于list列表，需要传送代码类型
						else if(proptype == "17"){
							ce[propname].codeType[propname] = propEl.getAttribute("ct");
						}
						// 脚本编写帮助
						if (ce[propname].scriptHelp) {
							ce[propname].scriptHelp[propname] = scriptTips;
						}
						// 脚本编写上下文提示
						if (ce[propname].scriptTips) {
							ce[propname].scriptTips[propname] = scriptHelp;
						}
					}
				}
			}
		}
		this.propGrid.setSource(complexObj);
		this.propGrid.data = node;
		this.updateStatePropColor(propStateModi);
	},
	
	updateStatePropColor: function(propStateModi) {
		var el = this.propGrid.el;
		el.select(".x-grid3-row").each(function(e){
			var nameCell = e.child(".x-grid3-col-name");
			var valueCell = e.child(".x-grid3-col-value");
			var typeCn = nameCell.dom.innerHTML;
			if(propStateModi[typeCn] != null) {
				valueCell.addClass("change-state-property");
			}else {
				valueCell.removeClass("change-state-property");
			}
		});
	},
	
	/**
	 * 过滤属性
	 */
	filterProp: function(type){
		if(this.propType=="common"){
			return type=="13" || type=="14" || type=="15";
		}else{
			return type!="13" && type!="14" && type!="15";
		}
	},
	
	getPropName: function(propEl){
		var propname = propEl.getAttribute("cn");
		var propgroup = propEl.getAttribute("group");
		if(propgroup!=null && propgroup!=""){
			propname = propgroup+"/"+propname;
		}
		return propname;
	}
		
});