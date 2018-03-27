/**
 * 单选popup OrganTree
 * 
 * @author weijx
 * @date 2009-11-17
 */
Artery.plugin.SOrganPopup = Ext.extend(Artery.plugin.PopupTrigger, {

	// 是否启用拼音控件
	enablePinyin : true,

	// 组织机构树对象
	organTree : null,

	readOnly : false,

	// 单选类型，默认为用户
	organType : 'user',

	// 根节点配置
	rootCfg : null,

	// 显示值
	valueText : '',

	// 值路径
	valuePath : '',

	// 展开值
	expandValue : '',

	// 展开路径
	expandValuePath : '',

	// 选中节点的类型
	nodeType : null,

	// 查询计数器
	searchCount : -1,

	searchFlag : 1,// 1:普通查询，2：级连查询（即第一次查询的结点不可见，自动查询下一个结点）
	
	//是否启用下拉列表
	selectList : true,
	
	initComponent : function() {
		this.originalType = this.organType;
		Artery.plugin.SOrganPopup.superclass.initComponent.call(this);
		
		if (Ext.isTrue(this.selectList)) {
			//增加下拉选择列表支持
			this.plugins = new Ext.tusc.plugins.Select();
		}
				
		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
		try{
				if(this.organTree){
					this.organTree.destroy();
					this.organTree = null;
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
		},this);
	},

	reset : function(){
		if(!this.rendered){
			return;
		}
		this.organType = this.originalType;
		this.nodeType = this.originalType;
		if(this.originalValue + "" == this.value + ""){
			return;
		}
        this.setValueNoValid(this.originalValue);
	    this.clearInvalid();
    },

	/**
	 * 设置值
	 * @param v 值
	 * @param sv 显示值
	 */
	setValue: function(v, sv,triggerChange){
		var ov = this.getValue();
		// 设置隐藏值
		if (this.hiddenField) {
			this.hiddenField.value = Ext.isEmpty(v)?"":v;
		}
		this.setTriggerState(v);
		
		if (Ext.isEmpty(v)) {
			this.valueText = "";
			Artery.plugin.TwinTriggerField.superclass.setValue.call(this, this.valueText);
			this.value = v;
		}else if(sv===undefined && this.upValueText){
			this.value = v;
			this.upValueText(v);
		}else{
			this.valueText = sv;
			Artery.plugin.TwinTriggerField.superclass.setValue.call(this, this.valueText);
			this.value = v;
		}
		//判断是否初始设置值，初始设置值时不进行验证
		if(!Ext.isTrue(this.initSte)){
			this.validate();
		}
		if(triggerChange === true && v!=ov){
			this.fireEvent('change', this, v, ov);
		}
	},
    
	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.layerEl == null) {
			var paramObj = Artery.getParams({
				organType : this.organType
			}, this);
			if(!Artery.params){
				paramObj.itemType = 'faOrgan';
				paramObj.moreProp = 'STree';
			}
			// 得到初始化数据
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseOrgan",
				success : function(response, options) {
					if (Ext.isEmpty(response.responseText)) {
						Artery.alertMsg("错误提示", "根节点错误！");
						return;
					}
					this.rootCfg = Ext.decode(response.responseText);
					this.initOrganLayer();
					this.showTreeLayer();
				},
				params : paramObj,
				scope : this
			})
		} else {
			this.showTreeLayer();
		}
	},
	
	// 重新加载，支持自定义参数和回调函数
	// {params:{}, clearParam:false, callback:function}
	reload: function(o){
		// 清空控件的值
		this.initSte = true; //设置初始状态参数
		this.setValue("");
		this.initSte = false;

		if(o == null){
			o = {}
		}
		if(o.params == null){
			o.params = {};
		}
		
		var paramObj = Artery.getParams({
			organType : this.organType
		}, this);
		if(!Artery.params){
			paramObj.itemType = 'faOrgan';
			paramObj.moreProp = 'STree';
		}
		
		if (Ext.isTrue(o.clearParam)) {
			this.reloadParams = o.params;
		} else {
			if (!this.reloadParams) {
				this.reloadParams = {};
			}
			Ext.apply(this.reloadParams, o.params);
		}
		Ext.apply(paramObj, o.params);
		
		// 得到初始化数据
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseOrgan",
			success : function(response, options) {
				if (Ext.isEmpty(response.responseText)) {
					Artery.alertMsg("错误提示", "根节点错误！");
					return;
				}
				this.rootCfg = Ext.decode(response.responseText);
				if(this.layerEl == null){
					this.initOrganLayer();
				}else{
					this.initRootNode();
				}
				if (o.callback) {
					o.callback.call(this);
				}
			},
			params : paramObj,
			scope : this
		});
	},
	
	createRootNode:function(cfg){
		var rootCfg = {
			draggable : false, 
			expanded:true 
		}
		Ext.apply(rootCfg, cfg);
		if(!cfg.multi){
			rootCfg.uiProvider = Ext.tree.TreeSingleNodeUI;
			rootCfg.uuid = cfg.uuid;
		}
		return new Ext.tree.AsyncTreeNode(rootCfg);
	},
	
	initRootNode: function(){
		if(this.root){
			this.root.destroy();
		}
		var cfg = {
			organType : this.organType,
			uuid : this.organTree.loader.baseAttrs.uuid
		};
		Ext.apply(cfg, this.rootCfg);
		this.root = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createRootNode(cfg);
		this.organTree.setRootNode(this.root);
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
		if(!this.organTree.rendered){
			this.organTree.render(this.layerEl.dom);
		}
		this.skinTree();
		this.restrictLayer(this.layerEl, this.organTree);
	},
	
	// 扫描树上节点
	skinTree: function(){
		if(Ext.isEmpty(this.getValue())){
			this.clearTree();
		}else{
			Artery.plugin.faTreeFunc.skinSelectedNode(this.organTree, this.getValue());
		}
		this.expandNodePath();
	},
	
	onExpandnode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.organTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.organTree);
		}
	},
	
	createTreePanel: function(cfg){
		var bbar = [];
		if (cfg.field.organType == "user" || cfg.field.organType == "all") {
			var searchField = new Ext.form.TextField({
				emptyText : '请输入人员姓名'+(cfg.field.enablePinyin?'或简拼':''),
				width : 100,
				enableKeyEvents : true
			});
			cfg.field.searchField = searchField;
			bbar.push(searchField);
			bbar.push("-");
			var searchBtn = new Ext.Button({
				text:'查找'
			})
			cfg.field.searchBtn = searchBtn;
			bbar.push(searchBtn);
		}
		bbar.push("->");
		var okBtn = new Ext.Button({
			text:'确定'
		})
		cfg.field.okBtn = okBtn;
		bbar.push(okBtn);
		
		var uuid = Ext.id();
		var otree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			height: this.layerHeight,
			border : true,
			bbar : bbar,
			loader : new Ext.tree.TreeLoader({
				baseAttrs : cfg.multi ? null : {
					uiProvider : Ext.tree.TreeSingleNodeUI,
					uuid : uuid
				}, // 添加 uiProvider 属性
				dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadOrganTree"
			}),
			eventModel : cfg.multi ? null : Ext.tusc.TreeRadioEvent
			// 指定radio事件对象
		})
		return otree;
	},

	// 初始化弹出层
	initOrganLayer : function() {
		this.organTree = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createTreePanel({field:this});

		this.organTree.on("expandnode", this.onExpandnode, this);
		this.organTree.on("collapsenode", this.onCollapsenode, this);
		this.organTree.on("checkchange", this.onCheckchange, this);
//		// 加载节点时,传输其他参数
		this.organTree.on("beforeload", this.onBeforeload, this);

		// 单击树上节点时选中功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.organTree.on("click", this.singleClickCheckHandler, this);
		}

		// 双击树上节点时确定
		if (Ext.isTrue(this.dblClickReturn)) {
			this.organTree.on("dblclick", this.dblClickReturnHandler, this);
		}

		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchFlag = 1;
				this.searchUser();
			},this)
		}
		
		if(this.searchField){
			this.searchField.on('keydown',function(field, e){
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchFlag = 1;
					this.searchUser();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		
		// 设置根节点
		this.initRootNode();
		this.layerEl = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createOrganLayer({popupField:this});

//        this.organLayer.swallowEvent('mousewheel');
//        this.layerEl = this.organLayer;
	},
	
	createOrganLayer: function(cfg){
		return new Artery.plugin.PopupLayer({
			shadow: false,
			constrain:false,
			zindex:20000,
			popupField: cfg.popupField
		});		
	},
	
	// 切换选择节点时调用
	onCheckchange: function(node, checked) {
		var a = node.attributes;
//		if(checked){
			this.valueTextTemp = a.text;
			this.valueTemp = a.cid;
			//alert(this.id+":" + this.valueTemp)
			this.nodeTypeTemp = a.type;
//		}else{
//			delete this.nodeTypeTemp;
//			delete this.valueTemp;
//			delete this.valueTextTemp;
//		}
		node.select();
	},
	
	// 加载子节点前调用
	onBeforeload: function(node) {
		var loader = this.organTree.loader;
		loader.baseParams.type = node.attributes.type;
		loader.baseParams.id = node.attributes.cid;
		loader.baseParams.organType = this.organType;
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		// 设置reload参数
		Ext.apply(loader.baseParams, this.reloadParams);
		
		Ext.applyIf(loader.baseParams,Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = 'faOrgan';
			loader.baseParams.moreProp = 'STree';
		}
	},
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	/** 双击树上节点时确定 */
	dblClickReturnHandler: Artery.plugin.faTreeFunc.dblClickReturnHandler,

	// 清空树上选中节点
	clearTree: function(){
		var node = this.organTree.getSelectionModel().getSelectedNode();
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
			this.expandNode(this.valuePath, true, true);
			this.valuePath = null;
			return;
		}
		// “展开值”属性不为空，则展开节点
		if (!Ext.isEmpty(this.expandValuePath)&&!Ext.isEmpty(this.expandValue)) {
			this.expandNode(this.expandValuePath, false, true);
			return;
		}
	},
	
	// 提交选中的节点，更新值
	submitValue: function(){
		var ov = this.getValue();
		if(this.valueTemp!==undefined && this.valueTextTemp!==undefined){
			this.nodeType = this.nodeTypeTemp;
			this.setValue(this.valueTemp, this.valueTextTemp);
		}
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 先设值，后隐藏(validate)
		this.collapse(true);
		this.fireEvent('change',this,this.value,ov);
	},
	
	// 清空临时值
	clearTempValue: function(){
		delete this.nodeTypeTemp;
		delete this.valueTemp;
		delete this.valueTextTemp;
		this.clearSearchInfo()
	},

	clearSearchInfo : function(){
		//清空查询信息
		if(this.searchField != null){
			this.searchField.setValue(null);
			this.searchCount = -1;
			this.searchFlag = 1;
		}
	},
	
	// 查询用户
	searchUser : function() {
		if(this.searchField == null){
			return;
		}
		var searchText = this.searchField.getValue();
		if (!Ext.isEmpty(searchText)) {
			var paramObj = Artery.getParams({
				searchCount : this.searchCount,
				searchText : searchText,
				searchFlag : this.searchFlag
			}, this);
			if(!Artery.params){
				paramObj.itemType = 'faOrgan';
				paramObj.moreProp = 'STree';
			}
			if(this.organTree && this.organTree.container){
				this.organTree.container.mask("正在加载数据...");
			}
			if (this.reloadParams) {
				Ext.apply(paramObj, this.reloadParams);
			}
			// 发送ajax请求
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=searchOrganTree",
				success : function(response, options) {
					var resObj = Ext.decode(response.responseText);
					// 设置searchCount
					if (resObj.searchCount != null) {
						this.searchCount = resObj.searchCount;
					}

					if (resObj.errorCode == 1) {
						if(this.organTree && this.organTree.container){
							this.organTree.container.unmask();
						}
						return;
					}

					this.expandNode(resObj.path);
					if(this.organTree && this.organTree.container){
						this.organTree.container.unmask();
					}
				},
				scope : this,
				params : paramObj
			})
		}
	},
	// 根据路径展开节点
	expandNode : function(path, checked, expanded) {
		var organ = this;
		var vwt = this.valueWithType;
		var idarray = path.split(",");
		// 查找根节点
		if (Ext.isTrue(vwt)) {
			var rootnodeid = this.rootCfg.cid;
		} else {
			var rootnodeid = this.rootCfg.type+"_"+this.rootCfg.cid;
		}
		var isRootFind = false;
		while (idarray.length > 0) {
			var id = idarray.shift();
			if (rootnodeid==id) {
				isRootFind = true;
				break;
			}
		}
		
		if(idarray.length == 0){
			if(isRootFind){	//选中根节点
				this.root.select();
				if (checked == true) {
					this.root.ui.checkbox.checked = true;
				}
				if (expanded == true) {
					this.root.expand(false, false);
				}
				if(this.searchField){
					this.searchField.focus();
				}
			}else{	//要展开的路径不在当前显示的树上
				organ.searchUser();
			}
			return;
		}
		
		var expandFn = function(node) {
			var subOrganId = idarray.shift();
			var subNode = node.findChildBy(function(node){
				if (Ext.isTrue(vwt)) {
					if(node.attributes.cid == subOrganId){
						return true;
					}
				} else {
					var organType = subOrganId.substring(0, 4);
					var organId = subOrganId.substr(5);
					if(node.attributes.type==organType && node.attributes.cid==organId){
						return true;
					}
				}
			});
			if (subNode == null) {
				organ.searchFlag = 2;
				organ.searchUser();
				return;
			}
			if (idarray.length == 0) {
				subNode.select();
				if (checked == true) {
					subNode.ui.checkbox.checked = true;
				}
				if (expanded == true) {
					subNode.expand(false, false, function(node){
						if (node.hasChildNodes() && node.lastChild) {
							node.lastChild.ensureVisible();
							node.ensureVisible();
						}
					});
					
				}
				if(this.searchField){
					this.searchField.focus();
				}
				return;
			}
			subNode.expand(false, false, expandFn, this);
		}

		this.root.expand(false, false, expandFn, this);
	},
	
	/**
	 * 更新显示值
	 */
	upValueText : function() {
		var paramObj = Artery.getParams({
			id : this.getValue(),
			type : this.nodeType == null ? this.organType : this.nodeType,
			valueWithType : this.valueWithType
		}, this);
		if(!Artery.params){
			paramObj.itemType = 'faOrgan';
			paramObj.moreProp = 'STree';
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getOrganNodeDetail",
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
		});
	},

	/**
	 * 验证输入是否为可选项
	 */
	validateRightValue : function(){
		if (Ext.isTrue(this.isCallByVRV)) {
			// 防止在此方法中调用setValue()方法时再次触发此方法
			return this.lastVRV_Result;
		}
		var params = Artery.getParams({
			itemType : "faOrgan",
			organType : this.organType,
			valueText : this.getValueText(),
			value : this.getValue()
		}, this);

		if (this.reloadParams) {
			Ext.apply(params, this.reloadParams);
		}

		var isValid = true;
		// 提交请求并调用回调函数
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=validateRightValue",
			success : function(response, options) {
				var res = Ext.decode(response.responseText);

				this.isCallByVRV = true;
				if (Ext.isEmpty(res.value)) {
					this.setValue();
					this.setValueText(res.valueText);
				} else {
					this.setValue(res.value, res.valueText);
				}
				delete this.isCallByVRV;

				if(!Ext.isTrue(res.success)){
					if (!(this.plugins && this.plugins.isExpanded())) {
						this.markInvalid(res.message);
					}
					isValid = false;
				}
			},
			syn : false,
			// 参数
			params : params,
			scope : this
		});
		this.lastVRV_Result = isValid;
		return isValid;
	},
	
	//BEGIN: 增加下拉选择列表支持========================================================================================
	getEventElement : function() {
		return this.el;
	},
	
	getWrap : function() {
		return this.wrap;
	},
	
	getLoadSelectStoreParam : function() {
		var param = {
			organType : this.organType,
			value : this.getRawValue()
		}
		return param;
	},
	
	getEnableJP : function() {
		return this.enablePinyin;
	},
	
	getMultiSelect : function() {
		return false;
	},
	
	isShowSelectList : function () {
		return this.editable && !this.readOnly;
	}
	//END：增加下拉选择列表支持==========================================================================================
})

Ext.reg('apSOrganPopup', Artery.plugin.SOrganPopup);

/**
 * 单选popup OrganTree
 * 
 * @author weijx
 * @date 2009-11-17
 */
Artery.plugin.MOrganPopup = Ext.extend(Artery.plugin.PopupTrigger, {

	// 是否启用拼音控件
	enablePinyin : true,

	// 组织机构树对象
	organTree : null,

	readOnly : false,

	// 单选类型，默认为用户
	organType : 'user',

	// 根节点配置
	rootCfg : null,

	// 显示值
	valueText : '',

	// 值路径
	valuePath : '',

	// 展开值
	expandValue : '',

	// 展开路径
	expandValuePath : '',

	// 选中节点的类型
	nodeType : null,

	// 查询计数器
	searchCount : -1,

	searchFlag : 1,// 1:普通查询，2：级连查询（即第一次查询的结点不可见，自动查询下一个结点）
	
	//是否启用下拉列表
	selectList : true,

	// 级联选择
	cascade : false,
	// 级联父节点
	cascadeParent : 'allchild', // 级联父节点allchild,singlechild,false

	initComponent : function() {
		this.originalType = this.organType;
		Artery.plugin.MOrganPopup.superclass.initComponent.call(this);
		if (!this.organStore) {
			this.organStore = new Ext.data.SimpleStore({
				fields : ['id', 'name', 'pinyin'],
				data : this.getStoreData(),
				id : 0
			});
			this.custStore = this.organStore;
		}
		
		if (Ext.isTrue(this.selectList)) {
			//增加下拉选择列表支持
			this.plugins = new Ext.tusc.plugins.Select();
		}
		
		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.organTree){
					this.organTree.destroy();
					this.organTree = null;
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

	onRender : function(ct, position) {
		Artery.plugin.MOrganPopup.superclass.onRender.call(this, ct, position);
		// 如果级联选择，则创建cascadeField
		if (this.cascade || this.checkbox) {
			this.cascadeField = this.el.insertSibling({
						tag : 'input',
						type : 'hidden',
						name : this.id + "Cascade"
					}, 'after', true);
		}
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
					data[data.length] = [val[i], valText[i],valPy == null ? '' : valPy[i]];
				}
			}
		}
		return data;
	},

	setValue : function(v, vt,triggerChange, clearCas) {
		var ov = this.getValue();
		v = Artery.getSplitValue(v);
		vt = Artery.getSplitValue(vt);
		Artery.plugin.MOrganPopup.superclass.setValue.call(this, v, vt);
		this.organStore.loadData(this.getStoreData());
		// 级联
		this.sureSelectedNode(clearCas !== false);
		if (this.cascade) {
			if (Ext.isEmpty(v)) {
				this.clearCascadeValue();
			} else {
				this.genCascadeValue();
			}
		}
		// 值改变
		if(triggerChange === true && v!=ov){
			this.fireEvent('change', this, v, ov);
		}
	},	
	
	reset : function(){
		if(!this.rendered){
			return;
		}
		this.organType = this.originalType;
		this.nodeType = this.originalType;
		if(this.originalValue + "" == this.value + ""){
			return;
		}
        this.setValueNoValid(this.originalValue);
	    this.clearInvalid();
    },

	onTrigger1Click : function() {
		// 清空级联值
		if (!this.disabled && this.cascade) {
			this.clearCascadeValue();
		}
		Artery.plugin.MOrganPopup.superclass.onTrigger1Click.call(this);
	},

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.layerEl == null) {
			var paramObj = Artery.getParams({
				organType : this.organType
			}, this);
			if(!Artery.params){
				paramObj.itemType = 'faOrgan';
				paramObj.moreProp = 'MTree';
			}
			// 得到初始化数据
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseOrgan",
				success : function(response, options) {
					if (Ext.isEmpty(response.responseText)) {
						Artery.alertMsg("错误提示", "根节点错误！");
						return;
					}
					this.rootCfg = Ext.decode(response.responseText);
					this.initOrganLayer();
					this.showTreeLayer();
				},
				params : paramObj,
				scope : this
			})
		} else {
			this.showTreeLayer();
		}
	},
	
	// 重新加载，支持自定义参数和回调函数
	// {params:{}, clearParam:false, callback:function}
	reload: function(o){
		// 清空控件的值
		this.initSte = true; //设置初始状态参数
		this.setValue("");
		this.initSte = false;

		if(o == null){
			o = {}
		}
		if(o.params == null){
			o.params = {};
		}
		
		var paramObj = Artery.getParams({
			organType : this.organType
		}, this);
		if(!Artery.params){
			paramObj.itemType = 'faOrgan';
			paramObj.moreProp = 'MTree';
		}
		
		if (Ext.isTrue(o.clearParam)) {
			this.reloadParams = o.params;
		} else {
			if (!this.reloadParams) {
				this.reloadParams = {};
			}
			Ext.apply(this.reloadParams, o.params);
		}
		
		Ext.apply(paramObj, o.params);
		
		// 得到初始化数据
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=parseOrgan",
			success : function(response, options) {
				if (Ext.isEmpty(response.responseText)) {
					Artery.alertMsg("错误提示", "根节点错误！");
					return;
				}
				this.rootCfg = Ext.decode(response.responseText);
				if(this.layerEl == null){
					this.initOrganLayer();
				}else{
					this.initRootNode();
				}
				if (o.callback) {
					o.callback.call(this);
				}
			},
			params : paramObj,
			scope : this
		});
	},
	
	initRootNode: function(){
		if(this.root){
			this.root.destroy();
		}
		var cfg = {
			organType : this.organType,
			multi:true
		};
		Ext.apply(cfg, this.rootCfg);
		this.root = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createRootNode(cfg);
		this.organTree.setRootNode(this.root);
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
		if(!this.organTree.rendered){
			this.organTree.render(this.layerEl.dom);
		}
		this.skinTree();
		this.restrictLayer(this.layerEl, this.organTree);
	},
	    // 扫描树上节点
	skinTree: function(){
		var os = this.organStore;
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
		nf(this.organTree.root);
		this.expandNodePath();
	},

	// 根据valuePath展开节点
	expandNodePath : function() {
		// “展开值”属性不为空，则展开节点
		if (!Ext.isEmpty(this.expandValuePath)&&!Ext.isEmpty(this.expandValue)) {
			this.expandNode(this.expandValuePath, false, true);
			return;
		}
	},

	// 加载节点后调用
	onAppendNode: function(tree,pn,n,idx){
		if(this.organStore.getById(n.attributes.cid)!=null){
			if(n.attributes.checked!==undefined){
				n.attributes.checked = true;
			}
		}
	},
	
	// 加载子节点前调用
	onBeforeload: function(node) {
		var loader = this.organTree.loader;
		loader.baseParams.type = node.attributes.type;
		loader.baseParams.id = node.attributes.cid;
		loader.baseParams.organType = this.organType;
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		// 设置reload参数
		Ext.apply(loader.baseParams, this.reloadParams);
		
		Ext.applyIf(loader.baseParams,Artery.getParams({}, this));
		if (!Artery.params) {
			loader.baseParams.itemType = 'faOrgan';
			loader.baseParams.moreProp = 'MTree';
		}
	},
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	onExpandnodeMain : function(node){
		this.onExpandnode(node)
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.organTree);
		}
	},
	
	onCollapsenode : function(){
		if(this.layerEl.isVisible()){
			this.restrictLayer(this.layerEl, this.organTree);
		}
	},

	// 初始化弹出层
	initOrganLayer : function() {
		this.organTree = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createTreePanel({field:this,multi:true});
		this.custTree = this.organTree;

		this.organTree.on("expandnode", this.onExpandnodeMain, this);
		this.organTree.on("collapsenode", this.onCollapsenode, this);
		this.organTree.on("checkchange", this.onCheckchange, this);
		this.organTree.on("append", this.onAppendNode, this);
		// 加载节点时,传输其他参数
		this.organTree.on("beforeload", this.onBeforeload, this);

		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.organTree.on("click", this.singleClickCheckHandler, this);
		}

		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this)
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchFlag = 1;
				this.searchUser();
			},this)
		}
		
		if(this.searchField){
			this.searchField.on('keydown',function(field, e){
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchFlag = 1;
					this.searchUser();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		
		// 设置根节点
		this.initRootNode();
		this.layerEl = Artery.pwin.Artery.plugin.SOrganPopup.prototype.createOrganLayer({popupField:this});

//        this.organLayer.swallowEvent('mousewheel');
//        this.layerEl = this.organLayer;
	},

	// 添加所选记录
	addRecord : function(node) {
		var a = node.attributes
		if(this.organType.indexOf(a.type)< 0 && this.organType != "all"){
			return
		}
		if (this.organStore.getById(a.cid) == null) {
			var data = [];
			data.push([a.cid, node.text, a.pinyin == null ? '' : a.pinyin]);
			this.organStore.loadData(data, true);
		}
	},

	// 删除记录
	delRecord : function(node) {
		var rec = this.organStore.getById(node.attributes.cid);
		if(rec){
			this.organStore.remove(rec);
		}
	},
	
	// 提交选中的节点，更新值
	submitValue: function(){
		var val = [], valText = [];
		this.organStore.each(function(record) {
			val[val.length] = record.get('id');
			valText[valText.length] = record.get('name');
		}, this);
		var ov = this.getValue();
		var separator = Artery.getMultiSelectSeparator();
		this.value = val.join(separator);
		this.valueText = valText.join(separator);
		this.setValue(this.value, this.valueText, false, false);
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 先设值，后隐藏(validate)
		this.collapse(true);
		this.fireEvent('change',this,this.value,ov);
	},
	
	// 清空临时值
	clearTempValue: function(){
		this.organStore.loadData(this.getStoreData());
		this.clearSearchInfo();
	},
	
	clearSearchInfo : Artery.plugin.SOrganPopup.prototype.clearSearchInfo,
	
	// 查询用户
	searchUser : function() {
		if(this.searchField == null){
			return;
		}
		var searchText = this.searchField.getValue();
		if (!Ext.isEmpty(searchText)) {
			var paramObj = Artery.getParams({
				searchCount : this.searchCount,
				searchText : searchText,
				searchFlag : this.searchFlag
			}, this);
			if(!Artery.params){
				paramObj.itemType = "faOrgan";
				paramObj.moreProp = "MTree";
			}
			if(this.organTree && this.organTree.container){
				this.organTree.container.mask("正在加载数据...");
			}
			if (this.reloadParams) {
				Ext.apply(paramObj, this.reloadParams);
			}
			// 发送ajax请求
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=searchOrganTree",
				success : function(response, options) {
					var resObj = Ext.decode(response.responseText);
					// 设置searchCount
					if (resObj.searchCount != null) {
						this.searchCount = resObj.searchCount;
					}

					if (resObj.errorCode == 1) {
						if(this.organTree && this.organTree.container){
							this.organTree.container.unmask();
						}
						return;
					}

					this.expandNode(resObj.path);
					if(this.organTree && this.organTree.container){
						this.organTree.container.unmask();
					}
				},
				scope : this,
				params : paramObj
			})
		}
	},
	
	// 根据路径展开节点
	expandNode : function(path, checked, expanded) {
		var organ = this;
		var vwt = this.valueWithType;
		var idarray = path.split(",");
		// 查找根节点
		if (Ext.isTrue(vwt)) {
			var rootnodeid = this.rootCfg.cid;
		} else {
			var rootnodeid = this.rootCfg.type+"_"+this.rootCfg.cid;
		}
		var isRootFind = false;
		while (idarray.length > 0) {
			var id = idarray.shift();
			if (rootnodeid==id) {
				isRootFind = true;
				break;
			}
		}
		
		if(idarray.length == 0){
			if(isRootFind){	//选中根节点
				this.root.select();
				if (checked == true) {
					this.root.ui.checkbox.checked = true;
				}
				if (expanded == true) {
					this.root.expand(false, false);
				}
				if(this.searchField){
					this.searchField.focus();
				}
			}else{	//要展开的路径不在当前显示的树上
				organ.searchUser();
			}
			return;
		}
		
		var expandFn = function(node) {
			var subOrganId = idarray.shift();
			var subNode = node.findChildBy(function(node){
				if (Ext.isTrue(vwt)) {
					if(node.attributes.cid == subOrganId){
						return true;
					}
				} else {
					var organType = subOrganId.substring(0, 4);
					var organId = subOrganId.substr(5);
					if(node.attributes.type==organType && node.attributes.cid==organId){
						return true;
					}
				}
			});
			if (subNode == null) {
				organ.searchFlag = 2;
				organ.searchUser();
				return;
			}
			if (idarray.length == 0) {
				subNode.select();
				if (checked == true) {
					subNode.ui.checkbox.checked = true;
				}
				if (expanded == true) {
					subNode.expand(false, false, function(node){
						if (node.hasChildNodes() && node.lastChild) {
							node.lastChild.ensureVisible();
							node.ensureVisible();
						}
					});
				}
				if(this.searchField){
					this.searchField.focus();
				}
				return;
			}
			subNode.expand(false, false, expandFn, this);
		}

		this.root.expand(false, false, expandFn, this);
	},
	
	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		var paramObj = Artery.getParams({
			id : this.getValue(),
			type : this.organType,
			valueWithType : this.valueWithType
		}, this);
		if(!Artery.params){
			paramObj.itemType = "faOrgan";
			paramObj.moreProp = "MTree";
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getOrganNodeDetail",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				var vt = resObj.valueText;
				if (Ext.isEmpty(vt)) {
					vt = this.value;
				}
				this.valuePinyin = resObj.valuePinyin;
				this.setValueText(vt);
				this.organStore.loadData(this.getStoreData());
			},
			scope : this,
			syn : false,
			params : paramObj
		})
	},

	/**
	 * 验证输入是否为可选项
	 */
	validateRightValue : Artery.plugin.SOrganPopup.prototype.validateRightValue,
	
	//BEGIN: 增加下拉选择列表支持========================================================================================
	getEventElement : function() {
		return this.el;
	},
	
	getWrap : function() {
		return this.wrap;
	},
	
	getLoadSelectStoreParam : function() {
		var st =  this.getRawValue();
		var begin =  st.lastIndexOf(Artery.getMultiSelectSeparator());
		if (begin != -1) {
			st = st.substring(begin + 1);
		}
		var param = {
			organType : this.organType,
			value : st
		}
		return param;
	},
	
	getEnableJP : function() {
		return this.enablePinyin;
	},
	
	getMultiSelect : function() {
		return true;
	},
	
	isShowSelectList : function () {
		return this.editable && !this.readOnly;
	},
	//END：增加下拉选择列表支持==========================================================================================

	//BEGIN:级联选择
	setCascade : Artery.plugin.faTreeFunc.setCascade, // 设置是否级联
	getCascadeValue : Artery.plugin.faTreeFunc.getCascadeValue, // 获得级联值
	sureSelectedNode : Artery.plugin.faTreeFunc.sureSelectedNode,// 确认节点的级联状态
	sureNode : Artery.plugin.faTreeFunc.sureNode,// 确认节点的选中状态
	onCascadeNode : Artery.plugin.faTreeFunc.onCascadeNode,// 级联处理上下级节点
	genCascadeValue : Artery.plugin.faTreeFunc.genCascadeValue,// 生成级联树状态
	clearCascadeValue : Artery.plugin.faTreeFunc.clearCascadeValue,// 清空级联树状态
	onExpandnode : Artery.plugin.faTreeFunc.onExpandnode,// 节点展开时调用
	onCheckchange : Artery.plugin.faTreeFunc.onCheckchange// 节点切换时调用
	//END:级联选择
})

Ext.reg('apMOrganPopup', Artery.plugin.MOrganPopup);