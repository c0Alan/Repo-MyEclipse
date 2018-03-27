/**
 * 单选SCodeTreePopup
 * 
 * @author weijx
 * @date 2010-08-19
 */
Artery.plugin.SCodePopup = Ext.extend(Artery.plugin.PopupTrigger, {
	
	// 代码树对象
	codeTree : null,

	// 弹出层对象
	codeLayer : null,

	readOnly : false,

	// 代码类型
	codeType : '',

	// 选择类型1:子节点 2:全部
	selType : '1',

	// 根节点名称
	rootName : 'Root',

	// 根节点Id
	rootId : 'rootid',

	// 值路径
	valuePath : '',
	
	// 异步加载，则为true
	ajaxLoad : true,
	
	// 非异步加载时，用于存放节点数据
	treeLoaderData : null,
	
	// 非异步加载时，用于翻译代码
	codeNodeMap : null,
	
	searchCount: -1,// 查询计数器
	searchPaths: [],// 节点路径数组
	
	reloadParams : null,//非异步加载时，调用reload()方法，保存改方法中传过来的参数
	
	initComponent : function() {
		Artery.plugin.SCodePopup.superclass.initComponent.call(this);
				//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.codeTree){
					this.codeTree.destroy();
					this.codeTree = null;
				}
				if(this.searchField){
					this.searchField.destroy();
					this.searchField = null;
				}
				if(this.okBtn){
					this.okBtn.destroy();
					this.okBtn = null;
				}
				if(this.searchBtn){
					this.searchBtn.destroy();
					this.searchBtn = null;
				}
				this.root = null;
				this.layerEl = null;
			}catch(e){}
		},this)
	},
	
	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.layerEl == null) {
			this.initCodeLayer();
		}
		this.showTreeLayer();
	},
	
	// 显示树层
	showTreeLayer: function(){
		
		if(this.isExpanded()){
            return;
        }
        if(this.searchField){
        	var lw = Math.max(this.wrap.getWidth(), this.minLayerWidth);
        	this.searchField.setWidth(lw - 85);
        }
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
		
		if(!this.codeTree.rendered){
			this.codeTree.render(this.layerEl.dom);
		}
		
		this.skinTree();
		this.restrictLayer(this.layerEl, this.codeTree);
	},
	
	// 扫描树上节点
	skinTree: function(){
		if(Ext.isEmpty(this.getValue())){
			Artery.plugin.faTreeFunc.skinSelectedNode(this.codeTree, this.getValue());
		}else{
			Artery.plugin.faTreeFunc.skinSelectedNode(this.codeTree, this.getValue());
			this.expandNodePath();
		}
	},
	
	onExpandnode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.codeTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.codeTree);
		}
	},
	
	createTree : function(cfg){

		var treeLoaderCfg = {
			baseAttrs : {
				uiProvider : Ext.tree.TreeSingleNodeUI,
				uuid : cfg.uuid
			}
		};
		if(cfg.field.ajaxLoad){
			treeLoaderCfg.dataUrl = sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadCodeTree";
		}
		cfg.field.treeLoader = new Ext.tree.TreeLoader(treeLoaderCfg);
		
		if(cfg.field.reloadParams != null){
			Ext.apply(cfg.field.treeLoader.baseParams, cfg.field.reloadParams);
			cfg.field.reloadParams = null;
		}
		
		try{
			if(cfg.field.searchField){
				cfg.field.searchField.destroy();
				cfg.field.searchField = null;
			}
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
				cfg.field.okBtn = null;
			}
			if(cfg.field.searchBtn){
				cfg.field.searchBtn.destroy();
				cfg.field.searchBtn = null;
			}
		}catch(e){}
		var et = null;
		if(cfg.field.enablePinyin){
			et = "请输入名称或简拼";
		}else{
			et = "请输入名称";
		}
		var bbar = [];
		cfg.field.searchField = new Ext.form.TextField({
			emptyText : et,
			width : 150,
			enableKeyEvents : true
		});
		bbar.push(cfg.field.searchField);
		bbar.push("-");
		var searchBtn = new Ext.Button({text:'查找'});
		cfg.field.searchBtn = searchBtn;
		bbar.push(searchBtn);
		bbar.push("->");
		var okBtn = new Ext.Button({text:'确定'});
		cfg.field.okBtn = okBtn;
		bbar.push(okBtn);
		
		var vTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : true,
			height: this.layerHeight,
			rootVisible: false,
			bbar: bbar,
			loader : cfg.field.treeLoader,
			eventModel : Ext.tusc.TreeRadioEvent
			// 指定radio事件对象
		});
		
		return vTree;
	},
	
	createLayer : function(cfg){
		var vlayer = new Artery.plugin.PopupLayer({
			shadow: true,
			constrain:false,
			zindex:20000,
			popupField: cfg.field
		});
		return vlayer;
	},

	// 初始化窗口
	initCodeLayer : function() {
		
		var uuid = Ext.id();// 用户单选按钮的名称后缀，防止多个分级代码中的节点名称一样
		this.codeTree = Artery.pwin.Artery.plugin.SCodePopup.prototype.createTree({field : this, uuid : uuid});
		
		if(this.ajaxLoad){
			// 加载节点时,传输其他参数
			this.codeTree.on("beforeload", this.onBeforeload, this);
		}
		this.codeTree.on("expandnode", this.onExpandnode, this);
		this.codeTree.on("collapsenode", this.onCollapsenode, this);
		this.codeTree.on("append", this.onAppendNode, this);
		this.codeTree.on("checkchange", this.onCheckchange, this);
		
		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.codeTree.on("click", this.singleClickCheckHandler, this);
		}
		
		// 双击树上节点时确定
		if (Ext.isTrue(this.dblClickReturn)) {
			this.codeTree.on("dblclick", this.dblClickReturnHandler, this);
		}
		
		if(this.searchField){
			this.searchField.on('keydown',function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchCode();
					this.searchField.focus();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',this.searchCode,this)
		}

		// 设置根节点
		this.root = this.createRootNode(uuid);
		this.codeTree.setRootNode(this.root);

		// 创建下拉层
		this.layerEl = Artery.pwin.Artery.plugin.SCodePopup.prototype.createLayer({field : this});
		if(this.isExpandNode) {
			var expandFn = function(node) {
				if(node == null || node.childNodes.length == 0) {
					return;
				}
				var subNode = node.childNodes[0];
				if (subNode == null) {
					return;
				}
				subNode.expand(false, false);
			}
			this.root.expand(false, false, expandFn);
		}
        //this.codeLayer.swallowEvent('mousewheel');
        //this.layerEl = this.codeLayer;
	},
	
	reload : function(userParams){
		var o = {};
		var me = this;
		if (userParams) {
			o = Ext.decode(Ext.encode(userParams));
			if (userParams.callback) {
				o.callback = userParams.callback;
			}
		}
		if(o.params == null){
			o.params = {};
		}
		
		this.lastReloadParams = {}
		Ext.apply(this.lastReloadParams,o.params);

		if(!Ext.isEmpty(o.codeType)){
			o.codeType = o.codeType + "";
			this.codeType = o.codeType;
		}
		if(!this.ajaxLoad){
			var paramObj = Artery.getParams({
				codeType : this.codeType,
				ajaxLoad : this.ajaxLoad,
				selType : this.selType,
				method : 'getCodeTreeJsonReload'
			}, this);
			Ext.apply(paramObj, o.params);
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
				scope : this,
				syn : false,
				params : paramObj,
				success : function(response, options) {
					var jsonData = Ext.decode(response.responseText);
					this.treeLoaderData = jsonData.treeLoaderData;
					this.codeNodeMap = jsonData.codeNodeMap;
					if(this.codeTree != null){
						this.root = this.createRootNode();
						this.codeTree.setRootNode(this.root);
					}
					me.setValue('');
					if (o.callback) {
						o.callback.call(this, response, options, true);
					}
				}
			})
		}else{
			var me = this;
			if(this.treeLoader != null){
				Ext.apply(this.treeLoader.baseParams, o.params);
				this.codeTree.root.reload(function(){
					me.setValue('');
					if (o.callback) {
						o.callback.call(me, null, null, true);
					}
				});
			}else{
				this.reloadParams = o.params;
				me.setValue('');
				if (o.callback) {
					o.callback.call(me, null, null, true);
				}
			}
		}
	},
	
	getWinBbar : function(){
		var et = null;
		if(this.enablePinyin){
			et = "请输入名称或简拼";
		}else{
			et = "请输入名称";
		}
		var bbar = [];
		this.searchField = Artery.pwin.Artery.plugin.SCodePopup.prototype.createSearchField({field : this, et : et});
		bbar.push(this.searchField);
		bbar.push("-");
		bbar.push({text : '查找',handler : this.searchCode,scope : this});
		bbar.push("->");
		bbar.push({text : '确定',handler : this.submitValue,scope: this});
		return bbar;
	},
	
	createSearchField : function(cfg){
		var vfield = new Ext.form.TextField({
			emptyText : cfg.et,
			width : 150,
			enableKeyEvents : true
		});
		return vfield
	},
	
	// 查找代码
	searchCode: function(){
		var searchText = this.searchField.getValue();
		if (Ext.isEmpty(searchText)) {
			return ;
		}
		if(this.searchCount==-1){
			var paramObj = Artery.getParams({
				searchText : searchText,
				enablePinyin : this.enablePinyin,
				codeType : this.codeType
			}, this);
			if(!Artery.params){
				paramObj.itemType = "faCode";
				paramObj.moreProp = "STree";
			}
			//reload参数传递到后台
			Ext.apply(paramObj, this.lastReloadParams);
			
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getCodePaths",
				success : function(response, options) {
					this.searchPaths = Ext.decode(response.responseText);
					this.searchCount = 0;
					this.doExpandCode();
				},
				scope : this,
				syn : false,
				params : paramObj
			});
		}else{
			this.doExpandCode();
		}
	},
	
	// 循环展开代码节点
	doExpandCode: function(){
		if(this.searchPaths.length==0){
			return ;
		}
		this.searchCount = (this.searchCount)%(this.searchPaths.length);
		this.expandNode(this.searchPaths[this.searchCount], false);
		this.searchCount++; 
	},
	
	// 创建根节点
	createRootNode: function(uuid){
		var rootConf = {
			text : this.rootName,
			draggable : false,
			cid : this.rootId
		};
		if(!this.ajaxLoad){
			rootConf.children = this.treeLoaderData;
		}
		return Artery.pwin.Artery.plugin.SCodePopup.prototype.createRootNode_bak(rootConf);
	},
	
	createRootNode_bak: function(rootConf){
		return new Ext.tree.AsyncTreeNode(rootConf);
	},
	
	// 提交选中的节点，更新值
	submitValue: function(){
		if (this.fireEvent('beforeselect', this, this.valueTemp, this.getValue()) !== false) {
			var ov = this.getValue();
			if(this.valueTemp!==undefined && this.valueTextTemp!==undefined){
				this.setValue(this.valueTemp, this.valueTextTemp);
			}
			//防止onblur的时候再次触发onChange事件
			this.startValue = this.getValue();
			// 需要设置值后在关闭
			this.collapse(true);
			this.fireEvent('change',this,this.value,ov);
		}
	},
	
	// 清空临时值
	clearTempValue : function(){
		delete this.valueTemp;
		delete this.valueTextTemp;
	},
	
	// 加载节点后调用
	onAppendNode: function(tree,pn,n,idx){
		if(this.getValue()==n.attributes.cid){
			if(n.attributes.checked!==undefined){
				n.attributes.checked = true;
			}
		}
	},
	
	// 切换选择节点时调用
	onCheckchange: function(node, checked) {
		if(checked){
			var a = node.attributes;
			this.valueTextTemp = a.text;
			this.valueTemp = a.cid;
		}else{
			this.clearTempValue();
		}
		node.select();
	},
	
	// 加载子节点前调用
	onBeforeload: function(node) {
		var loader = this.codeTree.loader;
		loader.baseParams.code = node.attributes.cid;
		loader.baseParams.codeType = this.codeType;
		loader.baseParams.selType = this.selType;
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		Ext.apply(loader.baseParams, Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = "faCode";
			loader.baseParams.moreProp = "STree";
		}
	},

	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	/** 双击树上节点时确定 */
	dblClickReturnHandler: Artery.plugin.faTreeFunc.dblClickReturnHandler,

	// 根据valuePath展开节点
	expandNodePath : function() {
		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath)&&!Ext.isEmpty(this.getValue())) {
			this.expandNode(this.valuePath, true);
			this.valuePath = null;
		}
	},
	// 根据路径展开节点
	expandNode : function(path, checked) {
		var idarray = path.split(",");
		var expandFn = function(node) {
			if (idarray.length == 1) {
				var tnode = node.findChild('cid', idarray.shift());
				if (tnode) {
					tnode.select();
					if(tnode.ui.wasLeaf == true && checked == true){
						tnode.ui.checkbox.checked = true;
					}
				}
				return;
			}
			var subNode = node.findChild('cid', idarray.shift());
			if (subNode == null) {
				return;
			}
			subNode.expand(false, false, expandFn);
		}

		// 展开定位节点
		this.root.expand(false, false, expandFn);
	},

	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		if(this.ajaxLoad){
			this.upTextAjax();
		}else{
			this.upTextCache();
		}
	},
	
	upTextAjax: function(){
		var paramObj = Artery.getParams({
			codeValue : this.getValue(),
			codeType : this.codeType
		}, this);
		if(!Artery.params){
			paramObj.itemType = "faCode";
			paramObj.moreProp = "STree";
		}
		if(this.lastReloadParams){
			Ext.apply(paramObj, this.lastReloadParams);
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getCodeValueText",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				var vt = resObj.valueText;
				if (Ext.isEmpty(vt)) {
					vt = this.value;
				}
				this.setValueText(vt);
				this.valuePath = resObj.valuePath;
			},
			scope : this,
			syn : false,
			params : paramObj
		});
	},
	
	upTextCache: function(){
		var separator = Artery.getMultiSelectSeparator();
		var va = this.getValue().split(separator);
		var tmp1 = {}, tmp2 = [];
		for(var i=0;i<va.length;i++){
			if(this.codeNodeMap[va[i]]===undefined){
				tmp2.push(va[i]);
			}else{
				tmp2.push(this.codeNodeMap[va[i]].valueText);
				this.valuePath = this.codeNodeMap[va[i]].valuePath;
			}
		}
		this.setValueText(tmp2.join(separator));
	},
	
	validateValue : function(value){
		if (!Artery.plugin.PopupTrigger.superclass.validateValue.call(this, value)) {
			return false;
		}
		var codeValue = this.value?this.value:"";
		if (codeValue.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if (codeValue.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		return true;
    },
    
    validateRightValue : function(value){
    	//--  A00009921   单值代码控件：如果value重名取得的key值是重复的,如果有重复值，就不验证输入是否为可选择项
    	if(value){
			var valText = value.split(";");
			if(valText.length>1){
				 var hash = {};
				 for(var i in valText) {
				     if(hash[valText[i]])
				          return true;
				     hash[valText[i]] = true;
				 }
			}
		}
		//--add by zhyue
		if (Ext.isTrue(this.isCallByVRV)) {
			// 防止在此方法中调用setValue()方法时再次触发此方法
			return this.lastVRV_Result;
		}
		if (this.lastVRV_V && this.lastVRV_V == value){
			if (!this.lastVRV_Result) {
				this.markInvalid(this.lastVRV_M);
			}
			return this.lastVRV_Result;
		}
		this.lastVRV_V = value;

    	var params = Artery.getParams(this.lastReloadParams, this);
		var methodParams = {
			"formid" : Artery.getFormId(this),
			"itemid" : Artery.getEventId(this),
			"itemType" : "faCode",
			"codeType" : this.codeType,
			"value" : value
		}
		Ext.apply(params,methodParams);
		
		var isValid = true;
		// 提交请求并调用回调函数
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=isRightValue",
			success : function(response, options) {
				var res = Ext.decode(response.responseText);
				if(!res.success===true){
					this.lastVRV_M = res.message;
					this.markInvalid(res.message);
					isValid = false;
				}else{
					if(res.value && this.setValue) {
						this.isCallByVRV = true;
						this.setValue(res.value);
						delete this.isCallByVRV;
					}
				}
			},
			// 参数
			syn : false,
			params : params,
			scope : this
		});
		this.lastVRV_Result = isValid;
		return isValid;
	}
})

Ext.reg('apSCodePopup', Artery.plugin.SCodePopup);

/**
 * 多选MCodeTreePopup
 * 
 * @author weijx
 * @date 2010-08-19
 */
Artery.plugin.MCodePopup = Ext.extend(Artery.plugin.PopupTrigger, {

	// 值数据store
	codeStore : null,

	// 代码树对象
	codeTree : null,

	// 弹出层对象
	codeLayer : null,

	readOnly : false,

	// 代码类型
	codeType : '',

	// 选择类型1:子节点 2:全部
	selType : '1',

	// 根节点名称
	rootName : 'Root',

	// 根节点Id
	rootId : 'rootid',
	
	// 异步加载，则为true
	ajaxLoad : true,
	
	// 非异步加载时，用于存放节点数据
	treeLoaderData : null,
	
	// 非异步加载时，用于翻译代码
	codeNodeMap : null,
	
	searchCount: -1,// 查询计数器
	searchPaths: [],// 节点路径数组
	
	reloadParams : null,//非异步加载时，调用reload()方法，保存改方法中传过来的参数
	
	initComponent : function() {
		Artery.plugin.MCodePopup.superclass.initComponent.call(this);
		if (!this.codeStore) {
			this.codeStore = new Ext.data.SimpleStore({
				fields : ['id', 'name'],
				data : this.getStoreData(),
				id : 0
			});
		}
				//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.codeTree){
					this.codeTree.destroy();
					this.codeTree = null;
				}
				if(this.searchField){
					this.searchField.destroy();
					this.searchField = null;
				}
				if(this.okBtn){
					this.okBtn.destroy();
					this.okBtn = null;
				}
				if(this.searchBtn){
					this.searchBtn.destroy();
					this.searchBtn = null;
				}
				this.root = null;
				this.layerEl = null;
			}catch(e){}
		},this)
	},

	getStoreData : function() {
		// 初始化数据
		var data = [];
		if (!Ext.isEmpty(this.value)) {
			var separator = Artery.getMultiSelectSeparator();
			var val = (this.value + "").split(separator);
			var valText = this.valueText.split(separator);
			for (var i = 0; i < val.length; i++) {
				if (!Ext.isEmpty(val[i])) {
					data[data.length] = [val[i], valText[i]];
				}
			}
		}
		return data;
	},

	setValue : function(v, vt) {
		v = Artery.getCommaSplitValue(v);
		vt = Artery.getCommaSplitValue(vt);
		Artery.plugin.MCodePopup.superclass.setValue.call(this, v, vt);
		this.codeStore.loadData(this.getStoreData());
	},

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.layerEl == null) {
			this.initCodeLayer();
		}
		this.showTreeLayer();
	},
	
	showTreeLayer: Artery.plugin.SCodePopup.prototype.showTreeLayer,
	
	// 扫描树上节点
	skinTree: function(){
		var os = this.codeStore;
		var nf = function(node){
			var checked = false;
			if(os.getById(node.attributes.cid)!=null){
				checked = true;
			}
			if(node.ui.checkbox){
				node.ui.checkbox.checked = checked;
			}
			if(!node.isLeaf() && node.isLoaded()){
				node.eachChild(nf);
			}
		}
		nf(this.codeTree.root);
	},
	
	onExpandnode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.codeTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.codeTree);
		}
	},
	
	createTree : function(cfg){
		var treeLoaderCfg = {};
		if(cfg.field.ajaxLoad){
			treeLoaderCfg.dataUrl = sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadCodeTree";
		}
		cfg.field.treeLoader = new Ext.tree.TreeLoader(treeLoaderCfg);
		//如果之前调用了reload方法，将方法中传过来的参数添加到loader的baseParams中
		if(cfg.field.reloadParams != null){
			Ext.apply(cfg.field.treeLoader.baseParams, cfg.field.reloadParams);
			cfg.field.reloadParams = null;
		}
		
		var et = null;
		if(cfg.field.enablePinyin){
			et = "请输入名称或简拼";
		}else{
			et = "请输入名称";
		}
		var bbar = [];
		cfg.field.searchField = new Ext.form.TextField({
			emptyText : et,
			width : 150,
			enableKeyEvents : true
		});
		bbar.push(cfg.field.searchField);
		bbar.push("-");
		var searchBtn = new Ext.Button({text:'查找'});
		cfg.field.searchBtn = searchBtn;
		bbar.push(searchBtn);
		bbar.push("->");
		var okBtn = new Ext.Button({text:'确定'});
		cfg.field.okBtn = okBtn;
		bbar.push(okBtn);
		
		var vTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : true,
			rootVisible: false,
			height: cfg.field.layerHeight,
			bbar: bbar,
			loader : cfg.field.treeLoader
		});
		
		return vTree;
	},
	
	createLayer : function(cfg){
		var vLayer = new Artery.plugin.PopupLayer({
			shadow: true,
			constrain:false,
			zindex:20000,
			popupField: cfg.field
		});
		return vLayer;
	},
	
	// 初始化窗口
	initCodeLayer : function() {
		this.codeTree = Artery.pwin.Artery.plugin.MCodePopup.prototype.createTree({field : this});
		if(this.ajaxLoad){
			// 加载节点时,传输其他参数
			this.codeTree.on("beforeload", this.onBeforeload, this);
		}
		this.codeTree.on("expandnode", this.onExpandnode, this);
		this.codeTree.on("collapsenode", this.onCollapsenode, this);
		this.codeTree.on("append", this.onAppendNode, this);
		this.codeTree.on("checkchange", this.onCheckchange, this);
		
		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.codeTree.on("click", this.singleClickCheckHandler, this);
		}
		
		if(this.searchField){
			this.searchField.on('keydown',function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchCode();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',this.searchCode,this)
		}

		// 设置根节点
		this.root = this.createRootNode();
		this.codeTree.setRootNode(this.root);

		// 创建下拉层
		this.layerEl = Artery.pwin.Artery.plugin.MCodePopup.prototype.createLayer({field : this});
		if(this.isExpandNode) {
			var expandFn = function(node) {
				if(node == null || node.childNodes.length == 0) {
					return;
				}
				var subNode = node.childNodes[0];
				if (subNode == null) {
					return;
				}
				subNode.expand(false, false);
			}
			this.root.expand(false, false, expandFn);
		}
        //this.codeLayer.swallowEvent('mousewheel');
        //this.layerEl = this.codeLayer;
	},
	
	reload : function(userParams){
		var o = {};
		var me = this;
		if (userParams) {
			o = Ext.decode(Ext.encode(userParams));
			if (userParams.callback) {
				o.callback = userParams.callback;
			}
		}
		if(o.params == null){
			o.params = {};
		}
		
		this.lastReloadParams = {}
		Ext.apply(this.lastReloadParams,o.params);
		
		if(!this.ajaxLoad){
			var paramObj = Artery.getParams({
				codeType : this.codeType,
				ajaxLoad : this.ajaxLoad,
				selType : this.selType,
				method : 'getCodeTreeJsonReload'
			}, this);
			Ext.apply(paramObj, o.params);
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
				scope : this,
				syn : false,
				params : paramObj,
				success : function(response, options) {
					var jsonData = Ext.decode(response.responseText);
					this.treeLoaderData = jsonData.treeLoaderData;
					this.codeNodeMap = jsonData.codeNodeMap;
					if(this.codeTree != null){
						this.root = this.createRootNode();
						this.codeTree.setRootNode(this.root);
					}
					me.setValue('');
					if (o.callback) {
						o.callback.call(this, response, options, true);
					}
				}
			})
		}else{
			var me = this;
			if(this.treeLoader != null){
				Ext.apply(this.treeLoader.baseParams, o.params);
				this.codeTree.root.reload(function(){
					me.setValue('');
					if (o.callback) {
						o.callback.call(me, null, null, true);
					}
				});
			}else{
				this.reloadParams = o.params;
				me.setValue('');
				if (o.callback) {
					o.callback.call(me, null, null, true);
				}
			}
		}
	},
	
	getWinBbar : Artery.plugin.SCodePopup.prototype.getWinBbar,
	
	// 查找代码
	searchCode: function(){
		var searchText = this.searchField.getValue();
		if (Ext.isEmpty(searchText)) {
			return ;
		}
		if(this.searchCount==-1){
			var paramObj = Artery.getParams({
				searchText : searchText,
				enablePinyin : this.enablePinyin,
				codeType : this.codeType
			}, this);
			if(!Artery.params){
				paramObj.itemType = "faCode";
				paramObj.moreProp = "MTree";
			}
			//reload参数传递到后台
			Ext.apply(paramObj, this.lastReloadParams);

			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getCodePaths",
				success : function(response, options) {
					this.searchPaths = Ext.decode(response.responseText);
					this.searchCount = 0;
					this.doExpandCode();
				},
				scope : this,
				syn : false,
				params : paramObj
			});
		}else{
			this.doExpandCode();
		}
	},
	
	doExpandCode : Artery.plugin.SCodePopup.prototype.doExpandCode,
	
	// 选择完节点后，设置选择的值
	submitValue: function(){
		var val = [], valText = [];
		this.codeStore.each(function(record) {
			val[val.length] = record.get('id');
			valText[valText.length] = record.get('name');
		});
		var ov = this.getValue();
		var separator = Artery.getMultiSelectSeparator();
		this.value = val.join(separator);
		this.valueText = valText.join(separator);
		this.setValue(this.value, this.valueText);
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 需要设置值后在关闭
		this.collapse(true);
		this.fireEvent('change',this,this.value, ov);
	},
	
	clearTempValue: function(){
		this.codeStore.loadData(this.getStoreData());
	},
	
	// 创建根节点
	createRootNode: function(){
		var rootConf = {
			text : this.rootName,
			draggable : false,
			cid : this.rootId
		};
		if(!this.ajaxLoad){
			rootConf.children = this.treeLoaderData;
		}
		return new Artery.pwin.Artery.plugin.MCodePopup.prototype.createRootNode_bak(rootConf); 
	},
	
	createRootNode_bak: function(rootConf){
		return new Ext.tree.AsyncTreeNode(rootConf);
	},
	
	// 加载子节点前调用
	onBeforeload: function(node) {
		var loader = this.codeTree.loader;
		loader.baseParams.code = node.attributes.cid;
		loader.baseParams.codeType = this.codeType;
		loader.baseParams.selType = this.selType;
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		Ext.applyIf(loader.baseParams, Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = "faCode";
			loader.baseParams.moreProp = "MTree";
		}
	},
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,
	
	// 加载节点后调用
	onAppendNode: function(tree,pn,n,idx){
		if(this.codeStore.getById(n.attributes.cid)!=null){
			if(n.attributes.checked!==undefined){
				n.attributes.checked = true;
			}
		}
	},
	
	// 切换选择节点时调用
	onCheckchange: function(node, checked) {
		if(checked){
			this.addRecord(node);
		}else{
			this.delRecord(node);
		}
	},

	// 添加所选节点
	addRecord : function(node) {
		var a = node.attributes
		if (this.codeStore.getById(a.cid) == null) {
			var data = [];
			data.push([a.cid, node.text]);
			this.codeStore.loadData(data, true);
		}
	},

	// 删除记录
	delRecord : function(node) {
		var rec = this.codeStore.getById(node.attributes.cid);
		if(rec){
			this.codeStore.remove(rec);			
		}
	},
	
	// 根据路径展开节点
	expandNode : Artery.plugin.SCodePopup.prototype.expandNode,

	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		if(this.ajaxLoad){
			this.upTextAjax();
		}else{
			this.upTextCache();
		}
	},
	
	upTextAjax : function(){
		var paramObj = Artery.getParams({
			codeValue : this.getValue(),
			codeType : this.codeType
		}, this);
		if(!Artery.params){
			paramObj.itemType = "faCode";
			paramObj.moreProp = "MTree";
		}
		if(this.lastReloadParams){
			Ext.apply(paramObj, this.lastReloadParams);
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getCodeValueText",
			success : function(response, options) {
				//var resObj = Ext.decode(response.responseText);
				//var vt = resObj.valueText;
				var vt = response.responseText;
				if (Ext.isEmpty(vt)) {
					vt = this.value;
				}
				this.setValueText(vt);
				this.codeStore.loadData(this.getStoreData());
			},
			scope : this,
			syn : false,
			params : paramObj
		})
	},
	
	upTextCache: function(){
		var separator = Artery.getMultiSelectSeparator();
		var va = this.getValue().split(separator);
		var tmp1 = {}, tmp2 = [];
		for(var i=0;i<va.length;i++){
			if(this.codeNodeMap[va[i]]===undefined){
				tmp2.push(va[i]);
			}else{
				tmp2.push(this.codeNodeMap[va[i]].valueText);
			}
		}
		this.setValueText(tmp2.join(separator));
		this.codeStore.loadData(this.getStoreData());
	},
	
	validateValue: Artery.plugin.SCodePopup.prototype.validateValue,
	validateRightValue: Artery.plugin.SCodePopup.prototype.validateRightValue

});

Ext.reg('apMCodePopup', Artery.plugin.MCodePopup);