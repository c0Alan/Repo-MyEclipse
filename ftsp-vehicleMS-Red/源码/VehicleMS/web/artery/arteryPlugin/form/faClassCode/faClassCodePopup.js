﻿/**
 * 单选SClassCodePopup
 * 
 * @author weijx
 * @date 2009-11-18
 */
Artery.plugin.SClassCodePopup = Ext.extend(Artery.plugin.PopupTrigger, {
	
	// 分级代码树对象
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
	
	initComponent : function() {
		Artery.plugin.SClassCodePopup.superclass.initComponent.call(this);
		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.codeTree){
					this.codeTree.destroy();
					this.codeTree = null;
				}
			}catch(e){}	
			try{
				if(this.searchField){
					this.searchField.destroy();
					this.searchField = null;
				}
			}catch(e){}
			try{
				if(this.searchBtn){
					this.searchBtn.destroy();
					this.searchBtn = null;
				}
			}catch(e){}
			try{
				if(this.okBtn){
					this.okBtn.destroy();
					this.okBtn = null;
				}
			}catch(e){}
			try{
				if(this.codeLayer){
					this.codeLayer.destroy();
					this.codeLayer = null;
				}
			}catch(e){}
			try{
				this.layerEl = null;
				this.root = null;
			}catch(e){}
		},this)
	},
	
	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.codeLayer == null) {
			var paramObj = Artery.getParams({
				codeType : this.codeType
			}, this);
			if(!Artery.params){
				paramObj.itemType = "faClassCode";
				paramObj.moreProp = "STree";
			}
			// 得到初始化数据
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseClassCode",
				success : function(response, options) {
					if (Ext.isEmpty(response.responseText)) {
						Artery.alertMsg("错误提示", "根节点错误！");
						return;
					}
					var resObj = Ext.decode(response.responseText);
					this.rootId = resObj.rootId;
					this.rootName = resObj.rootName;
					this.initClassCodeLayer();
					this.showTreeLayer();
				},
				params : paramObj,
				scope : this
			})
		} else {
			this.showTreeLayer();
		}
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
			this.codeTree.render(this.codeLayer.dom);
		}
		this.skinTree();

		this.restrictLayer(this.codeLayer, this.codeTree);
	},
	
	// 扫描树上节点
	skinTree: function(){
		if(Ext.isEmpty(this.getValue())){
			this.clearTree();
		}else{
			Artery.plugin.faTreeFunc.skinSelectedNode(this.codeTree, this.getValue());
			this.expandNodePath();
		}
	},
	
	onExpandnode : function(){
		if(this.codeLayer.isVisible()){
			this.restrictLayer(this.codeLayer, this.codeTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.codeLayer.isVisible()){
			this.restrictLayer(this.codeLayer, this.codeTree);
		}
	},

	CreateTreePanel : function(cfg){
		try{
			if(cfg.field.searchField){
				cfg.field.searchField.destroy();
				cfg.field.searchField = null;
			}
			if(cfg.field.searchBtn){
				cfg.field.searchBtn.destroy();
				cfg.field.searchBtn = null;
			}
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
				cfg.field.okBtn = null;
			}
		}catch(e){}
		
		var barConf = [];
		cfg.field.searchField = new Ext.form.TextField({
			emptyText : '请输入名称',
			width : 230,
			enableKeyEvents : true
		});

		barConf.push(cfg.field.searchField);
		barConf.push("-");
		cfg.field.searchBtn = new Ext.Button({
			text:'查找'
		})
		barConf.push(cfg.field.searchBtn);
		
		barConf.push("->");
		cfg.field.okBtn = new Ext.Button({
			text:'确定'
		})
		barConf.push(cfg.field.okBtn);
		
		var uuid = Ext.id();
		var ctree = new Ext.tree.TreePanel({
		autoScroll : true,
		animate : false,
		enableDD : false,
		border : true,
		height: this.layerHeight,
		bbar: barConf,
		loader : new Artery.pwin.Ext.tree.TreeLoader({
			baseAttrs : {
				uiProvider : Artery.pwin.Ext.tree.TreeSingleNodeUI,
				uuid : uuid
			}, // 添加 uiProvider 属性
			dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadClassCodeTree"
		}),
		eventModel : Artery.pwin.Ext.tusc.TreeRadioEvent
		// 指定radio事件对象
		});
		return ctree; 
	},
	
	createPopupLayer : function(cfg){
		return new Artery.plugin.PopupLayer({
			shadow: true,
			constrain:false,
			zindex:20000,
			popupField: cfg.popupField
		});
	},
	// 初始化窗口
	initClassCodeLayer : function() {
		this.codeTree = Artery.pwin.Artery.plugin.SClassCodePopup.prototype.CreateTreePanel({field:this});
						
		this.codeTree.on("expandnode", this.onExpandnode, this);
		this.codeTree.on("collapsenode", this.onCollapsenode, this);
		this.codeTree.on("checkchange", this.onCheckchange, this);
//		// 加载节点时,传输其他参数
		this.codeTree.on("beforeload", this.onBeforeload, this);
		
		this.searchField.on("keydown",function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchCode();
				}},this);
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchCode();
			},this)
		}
		
		// 设置根节点
		this.initRootNode();
		this.root.expand();

		// 创建下拉层
		this.codeLayer = Artery.pwin.Artery.plugin.SClassCodePopup.prototype.createPopupLayer({popupField:this});
        this.layerEl = this.codeLayer;
	},
	
	// 创建根节点
	createRootNode: function(cfg){
		var rootConf = {
			text : cfg.rootName,
			draggable : false,
			cid : cfg.rootId,
			uiProvider : Ext.tree.TreeSingleNodeUI
		};
		if(this.selType==2){
			rootConf.checked = false;
			rootConf.uuid = cfg.uuid;
		}
		return new Ext.tree.AsyncTreeNode(rootConf); 
	},
	
	initRootNode : function(){
		if(this.root){
			this.root.destroy();
		}
		this.root = Artery.pwin.Artery.plugin.SClassCodePopup.prototype.createRootNode({
			rootName : this.rootName,
			rootId : this.rootId,
			uuid:this.codeTree.loader.baseAttrs.uuid
		});
		this.codeTree.setRootNode(this.root);
	},
	
	// 提交选中的节点，更新值
	submitValue: function(){
		var ov = this.getValue();
		if(this.valueTemp!==undefined && this.valueTextTemp!==undefined){
			this.setValue(this.valueTemp, this.valueTextTemp);
		}
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 需要设置值后在关闭
		this.collapse(true);
		this.fireEvent('change',this,this.value,ov);
	},
	
	// 清空临时值
	clearTempValue: function(){
		delete this.valueTemp;
		delete this.valueTextTemp;
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
		Ext.applyIf(loader.baseParams, Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = "faClassCode";
			loader.baseParams.moreProp = "STree";
		}
	},
	
	clearTree: function(){
		var node = this.codeTree.getSelectionModel().getSelectedNode();
		if(node){
			node.unselect();
			if(node.ui.checkbox){
				node.ui.checkbox.checked = false;
				node.ui.checkbox.defaultChecked = false;
			}
		}
	},

	// 根据valuePath展开节点
	expandNodePath : function() {
		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath)&&!Ext.isEmpty(this.value)) {
			this.expandNode(this.valuePath, true);
			this.valuePath = null;
		}
	},	

	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		var paramObj = Artery.getParams({
			code : this.getValue(),
			codeType : this.codeType
		}, this);
		if(!Artery.params){
			paramObj.itemType = "faClassCode";
			paramObj.moreProp = "STree";
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getClassNodeDetail",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				var vt = resObj.valueText;
				if (Ext.isEmpty(vt)) {
					vt = this.value;
				}
				this.valuePath = resObj.valuePath;
				this.setValueText(vt);
			},
			scope : this,
			syn : false,
			params : paramObj
		})
	}
})

// 添加公共方法
Ext.override(Artery.plugin.SClassCodePopup, Artery.plugin.faClassCodeFunc);
Ext.reg('apSClassCodePopup', Artery.plugin.SClassCodePopup);

/**
 * 多选MClassCodePopup
 * 
 * @author weijx
 * @date 2009-11-19
 */
Artery.plugin.MClassCodePopup = Ext.extend(Artery.plugin.PopupTrigger, {

	// 组织机构数据
	codeStore : null,

	// 组织机构Grid
	codeGrid : null,

	// 组织机构树对象
	codeTree : null,

	// 组织机构窗口对象
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

	// 显示值
	valueText : '',

	// 拼音
	valuePinyin : '',

	enableFilter : false,// 是否进行过滤循环
	
	initComponent : function() {
		Artery.plugin.MClassCodeTree.superclass.initComponent.call(this);
		if (!this.codeStore) {
			this.codeStore = new Ext.data.SimpleStore({
				fields : ['id', 'name', 'pinyin'],
				data : this.getStoreData(),
				id : 0
			});
		}
		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload',function(){
		   try{
				if(this.codeTree){
					this.codeTree.destroy();
					this.codeTree = null;
				}
			}catch(e){}	
			try{
				if(this.searchField){
					this.searchField.destroy();
					this.searchField = null;
				}
			}catch(e){}
			try{
				if(this.searchBtn){
					this.searchBtn.destroy();
					this.searchBtn = null;
				}
			}catch(e){}
			try{
				if(this.okBtn){
					this.okBtn.destroy();
					this.okBtn = null;
				}
			}catch(e){}
			try{
				if(this.codeLayer){
					this.codeLayer.destroy();
					this.codeLayer = null;
				}
			}catch(e){}
			try{
				this.layerEl = null;
				this.root = null;
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
			var valPy = null;
			if (!Ext.isEmpty(this.valuePinyin)) {
				valPy = this.valuePinyin.split(separator);
			}
			for (var i = 0; i < val.length; i++) {
				if (!Ext.isEmpty(val[i])) {
					data[data.length] = [val[i], valText[i],
							valPy == null ? '' : valPy[i]];
				}
			}
		}
		return data;
	},

	setValue : function(v, vt) {
		v = Artery.getCommaSplitValue(v);
		vt = Artery.getCommaSplitValue(vt);
		Artery.plugin.MClassCodeTree.superclass.setValue.call(this, v, vt);
		this.codeStore.loadData(this.getStoreData());
	},

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.codeLayer == null) {
			var paramObj = Artery.getParams({
				codeType : this.codeType
			}, this);
			if(!Artery.params){
				paramObj.itemType = "faClassCode";
				paramObj.moreProp = "MTree";
			}
			// 得到初始化数据
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseClassCode",
				success : function(response, options) {
					if (Ext.isEmpty(response.responseText)) {
						Artery.alertMsg("错误提示", "根节点错误！");
						return;
					}
					var resObj = Ext.decode(response.responseText);
					this.rootId = resObj.rootId;
					this.rootName = resObj.rootName;
					this.initClassCodeLayer();
					this.showTreeLayer();
				},
				params : paramObj,
				scope : this
			});
		} else {
			this.showTreeLayer();
		}
	},
	
	showTreeLayer: Artery.plugin.SClassCodePopup.prototype.showTreeLayer,
	
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
		if(this.codeLayer.isVisible()){
			this.restrictLayer(this.codeLayer, this.codeTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.codeLayer.isVisible()){
			this.restrictLayer(this.codeLayer, this.codeTree);
		}
	},
	createTreePanel : function(cfg){
		try{
			if(cfg.field.searchField){
				cfg.field.searchField.destroy();
				cfg.field.searchField = null;
			}
			if(cfg.field.searchBtn){
				cfg.field.searchBtn.destroy();
				cfg.field.searchBtn = null;
			}
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
				cfg.field.okBtn = null;
			}
		}catch(e){}
		
		var barConf = [];
		cfg.field.searchField = new Ext.form.TextField({
			emptyText : '请输入名称',
			width : 230,
			enableKeyEvents : true
		});
		barConf.push(cfg.field.searchField);
		
		cfg.field.searchBtn = new Ext.Button({
			text:'查找'
		})
		barConf.push(cfg.field.searchBtn);
		
		barConf.push("->");
		cfg.field.okBtn = new Ext.Button({
			text:'确定'
		})
		barConf.push(cfg.field.okBtn);
		
		var uuid = Ext.id();
		var cTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : true,
			height: this.layerHeight,
			bbar: barConf,
			loader : new Artery.pwin.Ext.tree.TreeLoader({
				baseAttrs : {
					uuid:uuid
				},
				dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadClassCodeTree"
			})
		});
		return cTree;
	},
	createPopupLayer : function(cfg){
		return new Artery.pwin.Artery.plugin.PopupLayer({
			shadow: true,
			constrain:false,
			zindex:20000,
			popupField: cfg.popupField
		});
	},
	// 初始化窗口
	initClassCodeLayer : function() {
		this.codeTree = Artery.pwin.Artery.plugin.MClassCodePopup.prototype.createTreePanel({field:this});
		
		this.codeTree.on("expandnode", this.onExpandnode, this);
		this.codeTree.on("collapsenode", this.onCollapsenode, this);
		this.codeTree.on("append", this.onAppendNode, this);
		this.codeTree.on("checkchange", this.onCheckchange, this);
		this.codeTree.on("beforeload", this.onBeforeload, this);

		this.searchField.on("keydown",function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchCode();
				}},this);
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchCode();
			},this)
		}
		
		// 设置根节点
		this.initRootNode();
		this.root.expand();

		// 创建下拉层
		this.codeLayer = Artery.pwin.Artery.plugin.MClassCodePopup.prototype.createPopupLayer({popupField:this});
    	this.layerEl = this.codeLayer;
	},
	// 创建根节点
	createRootNode: function(cfg){
		var rootConf = {
			text : cfg.rootName,
			draggable : false,
			cid : cfg.rootId
		};
		if(this.selType==2){
			rootConf.checked = false;
		}
		return new Ext.tree.AsyncTreeNode(rootConf); 
	},
	
	initRootNode : function(){
		if(this.root){
			this.root.destroy();
		}
		this.root = Artery.pwin.Artery.plugin.MClassCodePopup.prototype.createRootNode({
			rootName : this.rootName,
			rootId : this.rootId,
			uuid:this.codeTree.loader.baseAttrs.uuid
		});
		this.codeTree.setRootNode(this.root);
	},
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
	
	// 加载子节点前调用
	onBeforeload: function(node) {
		var loader = this.codeTree.loader;
		loader.baseParams.code = node.attributes.cid;
		loader.baseParams.codeType = this.codeType;
		loader.baseParams.selType = this.selType;
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		Ext.applyIf(loader.baseParams,Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = "faClassCode";
			loader.baseParams.moreProp = "MTree";
		}
	},
	
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
			data.push([a.cid, node.text, a.pinyin == null ? '' : a.pinyin]);
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

	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		var paramObj = Artery.getParams({
			code : this.getValue(),
			codeType : this.codeType
		}, this);
		if(!Artery.params){
			paramObj.itemType = "faClassCode";
			paramObj.moreProp = "MTree";
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getClassNodeDetail",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				var vt = resObj.valueText;
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
	}

})

// 添加公共方法
Ext.override(Artery.plugin.MClassCodePopup, Artery.plugin.faClassCodeFunc);
Ext.reg('apMClassCodePopup', Artery.plugin.MClassCodePopup);