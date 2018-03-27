/**
 * 单选SOrganTree
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.SOrganTree = Ext.extend(Artery.plugin.TwinTriggerField, {
	
	margin: true,

	// 是否启用拼音控件
	enablePinyin : true,

	// 组织机构树对象
	organTree : null,

	// 组织机构窗口对象
	organWin : null,

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
	
	itemType : "faOrgan",
	moreProp : "STree",

	initComponent : function() {
		this.originalType = this.organType;
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.SOrganTree.superclass.initComponent.call(this);
		
		if (Ext.isTrue(this.selectList)) {
			//增加下拉选择列表支持
			this.plugins = new Ext.tusc.plugins.Select();
		}
		
		//防止内存泄露
		Ext.EventManager.on(window, 'unload', function(){
			try{
				if(this.organWin){
					this.organWin.destroy();
					this.organWin = null;
				}
			}catch(e){}
		},this);
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
		this.organWin.hide();
		this.fireEvent('change',this,this.value,ov);
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

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		
		if (this.organWin == null) {
			var paramObj = Artery.getParams({
				organType : this.organType
			}, this);
			if(!Artery.params){
				paramObj.itemType = this.itemType;
				paramObj.moreProp = this.moreProp;
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
					this.initOrganWin();
					this.showOrganWin();
				},
				params : paramObj,
				scope : this
			})
		} else {
			this.showOrganWin();
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
			paramObj.itemType = this.itemType;
			paramObj.moreProp = this.moreProp;
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
				if(this.organWin == null){
					this.initOrganWin();
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
		this.root = Artery.pwin.Artery.plugin.SOrganTree.prototype.createRootNode(cfg);
		this.organTree.setRootNode(this.root);
	},
	
	// 显示window窗口
	showOrganWin: function(){
		this.organWin.show();
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
		if(Ext.isEmpty(this.value)){
			this.clearTree()
		}else if(this.organTree){
			Artery.plugin.faTreeFunc.skinSelectedNode(this.organTree, this.getValue());
		}
		this.expandNodePath();
	},
	
	getItemId: Artery.plugin.PopupTrigger.prototype.getItemId,

	// 初始化窗口
	initOrganWin : function() {
		this.organWin = Artery.pwin.Artery.plugin.SOrganTree.prototype.createOrganWin({
			field:this,
			windowHeight:this.windowHeight
		});
		
		this.organTree.on("checkchange", this.onCheckchange, this);
		// 加载节点时,传输其他参数
		this.organTree.on("beforeload", this.onBeforeload, this);
		
		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.organTree.on("click", this.singleClickCheckHandler, this);
		}

		// 双击树上节点时确定
		if (Ext.isTrue(this.dblClickReturn)) {
			this.organTree.on("dblclick", this.dblClickReturnHandler, this);
		}

		if(this.searchField){
			this.searchField.on('keydown',function(field,e){
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchFlag = 1;
					this.searchUser();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchFlag = 1;
				this.searchUser();
			},this)
		}
		this.okBtn.on('click', this.submitValue,this)
		this.closeBtn.on('click',function(){
			this.organWin.hide();
		},this);
		
		// 设置根节点
		this.initRootNode();
		this.organWin.on('hide', this.onWinHide, this);
	},
	
	createOrganWin: function(cfg){
		var bbar = null;
		if (cfg.field.organType == "user" || cfg.field.organType == "all") {
			bbar =  [cfg.field.searchField = new Ext.form.TextField({
						emptyText : '请输入人员姓名'+(cfg.field.enablePinyin?'或简拼':''),
						width : 230,
						enableKeyEvents : true
					}), '-', cfg.field.searchBtn = new Ext.Button({
				text:'查找'
			})];
		}
				
		var uuid = Ext.id();// 用户单选按钮的名称后缀，防止多个组织机构字段中的节点名称一样
		cfg.field.organTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : false,
			bbar : bbar,
			style : 'background-color:#fff;',
			loader : new Ext.tree.TreeLoader({
				baseAttrs :cfg.multi ? null : {
					uiProvider : Ext.tree.TreeSingleNodeUI,
					uuid : uuid
				}, // 添加 uiProvider 属性
				dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadOrganTree"
			}),
			eventModel : cfg.multi ? null : Ext.tusc.TreeRadioEvent
				// 指定radio事件对象
		});
		
		var win = new Ext.Window({
			layout : 'fit',
			width : 300,
			height : Ext.num(cfg.windowHeight, 400),
			closeAction : 'hide',
			modal:true,
			shadow :false,
			resizable:false,
			items : [cfg.field.organTree],
			buttons : [cfg.field.okBtn = new Ext.Button({
				text : '确定'
			}), cfg.field.closeBtn = new Ext.Button({
				text : '关闭'
			})]
		});
		return win;
	},
	
	// window隐藏时调用
	onWinHide: function(){
		this.clearTempValue();
		this.focus();
		this.validate();
		if(this.geditor){
			this.geditor.allowBlur = false;
			this.geditor.completeEdit();
		}
	},
	
	// 清空临时选择值
	clearTempValue: function(){
		delete this.valueTemp;
		delete this.valueTextTemp;
		delete this.nodeTypeTemp;
		this.clearSearchInfo();
	},
		
	//清空查询信息
	clearSearchInfo : function(){
		if(this.searchField != null){
			this.searchField.setValue(null);
			this.searchCount = -1;
			this.searchFlag = 1;
		}
	},
	
	// 切换选择节点时调用
	onCheckchange: function(node, checked) {
		var a = node.attributes;
		this.valueTextTemp = a.text;
		this.valueTemp = a.cid;
		this.nodeTypeTemp = a.type;
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
			loader.baseParams.itemType = this.itemType;
			loader.baseParams.moreProp = this.moreProp;
		}
	},
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	/** 双击树上节点时确定 */
	dblClickReturnHandler: Artery.plugin.faTreeFunc.dblClickReturnHandler,

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
				paramObj.itemType = this.itemType;
				paramObj.moreProp = this.moreProp;
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
			paramObj.itemType = this.itemType;
			paramObj.moreProp = this.moreProp;
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

// register xtype
Ext.reg('apSOrganTree', Artery.plugin.SOrganTree);

/**
 * 多选MOrganTree
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.MOrganTree = Ext.extend(Artery.plugin.TwinTriggerField, {
	
	margin: true,

	// 是否启用拼音控件
	enablePinyin : true,

	// 组织机构数据
	organStore : null,

	// 组织机构树对象
	organTree : null,

	// 组织机构窗口对象
	organWin : null,

	readOnly : false,

	// 多选类型，默认为用户
	organType : 'user',

	// 根节点配置
	rootCfg : null,

	// 显示值
	valueText : '',

	// 展开值
	expandValue : '',

	// 展开路径
	expandValuePath : '',

	// 拼音
	valuePinyin : '',

	// 查询计数器
	searchCount : -1,

	searchFlag : 1,// 1:普通查询，2：级连查询（即第一次查询的结点不可见，自动查询下一个结点）

	enableFilter : false,// 是否进行过滤循环
	
	//是否启用下拉列表
	selectList : true,
	
	itemType: "faOrgan",
	moreProp: "MTree",

	// 级联选择
	cascade : false,
	// 级联父节点
	cascadeParent : 'allchild', // 级联父节点allchild,singlechild,false

	initComponent : function() {
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.MOrganTree.superclass.initComponent.call(this);
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
			if(this.organWin){
				this.organWin.destroy();
				this.organWin = null;
			}
			}catch(e){}
		},this)
	},

	onRender : function(ct, position) {
		Artery.plugin.MOrganTree.superclass.onRender.call(this, ct, position);
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
					data[data.length] = [val[i], valText[i],
							valPy == null ? '' : valPy[i]];
				}
			}
		}
		return data;
	},

	setValue : function(v, vt,triggerChange, clearCas) {
		var ov = this.getValue();
		v = Artery.getSplitValue(v);
		vt = Artery.getSplitValue(vt);
		Artery.plugin.MOrganTree.superclass.setValue.call(this, v, vt);
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

	onTrigger1Click : function() {
		// 清空级联值
		if (!this.disabled && this.cascade) {
			this.clearCascadeValue();
		}
		Artery.plugin.MOrganTree.superclass.onTrigger1Click.call(this);
	},

	onTrigger2Click : Artery.plugin.SOrganTree.prototype.onTrigger2Click,
	
	reload : Artery.plugin.SOrganTree.prototype.reload,
	
	initRootNode: function(){
		if(this.root){
			this.root.destroy();
		}
		var cfg = {
			organType : this.organType,
			multi:true
		};
		Ext.apply(cfg, this.rootCfg);
		this.root = Artery.pwin.Artery.plugin.SOrganTree.prototype.createRootNode(cfg);
		this.organTree.setRootNode(this.root);
	},
	
	// 显示人员窗口
	showOrganWin: function(){
		this.organWin.show();
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
		this.sureSelectedNode();
		this.expandNodePath();
	},

	// 根据valuePath展开节点
	expandNodePath : function() {
		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath)) {
			this.expandNode(this.valuePath, true, true);
			return;
		}
		// “展开值”属性不为空，则展开节点
		if (!Ext.isEmpty(this.expandValuePath)&&!Ext.isEmpty(this.expandValue)) {
			this.expandNode(this.expandValuePath, false, true);
			return;
		}
	},

	sureSelectedNode: function(){
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
	},
	
	getItemId: Artery.plugin.PopupTrigger.prototype.getItemId,
	
	// 初始化窗口
	initOrganWin : function() {
		this.organWin = Artery.pwin.Artery.plugin.SOrganTree.prototype.createOrganWin({
			field:this,
			multi:true,
			windowHeight:this.windowHeight
		});
		this.custTree = this.organTree;
		this.organTree.on("expandnode", this.onExpandnode, this);
		this.organTree.on("checkchange", this.onCheckchange, this);
		this.organTree.on("append", this.onAppendNode, this);
		// 加载节点时,传输其他参数
		this.organTree.on("beforeload", this.onBeforeload, this);
		
		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.organTree.on("click", this.singleClickCheckHandler, this);
		}

		if(this.searchField){
			this.searchField.on('keydown',function(field,e){
				if (e.getKey() == Ext.EventObject.ENTER) {
					this.searchFlag = 1;
					this.searchUser();
				} else {
					this.searchCount = -1;
				}
			},this);
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchFlag = 1;
				this.searchUser();
			},this)
		}
		this.okBtn.on('click', this.submitValue,this)
		this.closeBtn.on('click',function(){
			this.organWin.hide();
		},this);		
		
		// 设置根节点
		this.initRootNode();
		this.organWin.on('hide', this.onWinHide, this);
	},
	
	onWinHide: Artery.plugin.SOrganTree.prototype.onWinHide,
	
	// 加载节点后调用
	onAppendNode: function(tree,pn,n,idx){
		if(this.organStore.getById(n.attributes.cid)!=null){
			if(n.attributes.checked!==undefined){
				n.attributes.checked = true;
			}
		}
	},
	
	// 加载子节点前调用
	onBeforeload: Artery.plugin.SOrganTree.prototype.onBeforeload,
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	// 提交选中的节点，更新值
	submitValue: function(){
		var val = [], valText = [],valPinyin=[];
		this.organStore.each(function(record) {
			val[val.length] = record.get('id');
			valText[valText.length] = record.get('name');
			if(record.get('pinyin')!= null){
				valPinyin[valPinyin.length] = record.get('pinyin');
			}
		}, this);
		var ov = this.getValue();
		var separator = Artery.getMultiSelectSeparator();
		this.value = val.join(separator)
		this.valueText = valText.join(separator)
		this.valuePinyin = valPinyin.join(separator);
		this.setValue(this.value, this.valueText, false, false);
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 先设值，后隐藏(validate)
		this.organWin.hide();
		this.fireEvent('change',this,this.value,ov);
	},
	
	// 清空临时值
	clearTempValue: function(){
		this.organStore.loadData(this.getStoreData());
		this.clearSearchInfo();
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

	clearSearchInfo : Artery.plugin.SOrganTree.prototype.clearSearchInfo,
	
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
				paramObj.itemType = this.itemType;
				paramObj.moreProp = this.moreProp;
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
			paramObj.itemType = this.itemType;
			paramObj.moreProp = this.moreProp;
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
	validateRightValue : Artery.plugin.SOrganTree.prototype.validateRightValue,
	
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

Ext.reg('apMOrganTree', Artery.plugin.MOrganTree);

/**
 * 多选MOrganList
 */
Artery.plugin.MOrganList = Ext.extend(Artery.plugin.TwinTriggerField, {
	
	margin: true,

	// 是否启用拼音控件
	enablePinyin : true,

	// 组织机构数据
	organStore : null,

	// 组织机构Grid
	organGrid : null,

	// 组织机构树对象
	organTree : null,

	// 组织机构窗口对象
	organWin : null,

	readOnly : false,

	// 多选类型，默认为用户
	organType : 'user',

	// 根节点配置
	rootCfg : null,

	// 显示值
	valueText : '',

	// 拼音
	valuePinyin : '',

	// 查询计数器
	searchCount : -1,

	searchFlag : 1,// 1:普通查询，2：级连查询（即第一次查询的结点不可见，自动查询下一个结点）

	enableFilter : false,// 是否进行过滤循环
	
	//是否启用下拉列表
	selectList : true,
	
	itemType: "faOrgan",
	moreProp: "MList",

	initComponent : function() {
		this.upImgPath = sys.getContextPath() + "/artery/pub/images/icon/up.gif";
		this.downImgPath = sys.getContextPath() + "/artery/pub/images/icon/down.gif";
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.MOrganList.superclass.initComponent.call(this);
		this.initOrganStore();
		
		if (Ext.isTrue(this.selectList)) {
			//增加下拉选择列表支持
			this.plugins = new Ext.tusc.plugins.Select();
		}
		
		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.organWin){
					this.searchField.destroy();
					this.filterField.destroy();
					this.organGrid.destroy();
					this.organTree.destroy();
					this.organWin.destroy();
					
					this.organStore = null;
					this.smtree = null;
					this.organTree = null;
					this.treeLoader = null;
					this.root = null;
					this.organGrid = null;
					this.dragSelector = null;
					this.filterField = null;
					this.organWin = null;
					this.searchField = null;
				}
			}catch(e){}
		},this);
	},

	initOrganStore: function(){
		if (!this.organStore) {
			this.organStore = new Artery.pwin.Ext.data.SimpleStore({
				fields : ['id', 'name', 'pinyin'],
				data : this.getStoreData(),
				id : 0
			});
		}
	},

	getStoreData : Artery.plugin.MOrganTree.prototype.getStoreData,

	setValue : function(v, vt,triggerChange) {
		var ov = this.getValue();
		v = Artery.getSplitValue(v);
		vt = Artery.getSplitValue(vt);
		Artery.plugin.MOrganList.superclass.setValue.call(this, v, vt);
		this.organStore.loadData(this.getStoreData());
		if(triggerChange === true && v!=ov){
			this.fireEvent('change', this, v, ov);
		}
	},

	// 定时过滤
	filterInterval : function() {
		if (!this.enableFilter) {
			return;
		}
		if (Ext.isEmpty(this.filterVal)) {
			this.filterVal = '';
		}
		var filterFieldVal = this.filterField.getValue();
		if (Ext.isEmpty(filterFieldVal)) {
			filterFieldVal = '';
		}
		if (this.filterVal != filterFieldVal) {
			this.filter(filterFieldVal)
			this.filterVal = filterFieldVal;
		}
		this.filterInterval.defer(500, this);
	},

	// 过滤
	filter : function(val) {
		if (val == null) {
			val = '';
		}
		if (this.organType != 'user') {
			this.organStore.filter('name', val, false, true)
		} else {
			this.organStore.filterBy(function(record, id) {
				try{
					var reg = new RegExp("("+val+")");
					if (reg.test(record.get('pinyin'))) {
						return true;
					} else if (reg.test(record.get('name'))) {
						return true;
					}
				}catch(e){
					return true;
				}
				return false;
			}, this);
		}
	},

	onTrigger2Click : Artery.plugin.SOrganTree.prototype.onTrigger2Click,
	
	reload : Artery.plugin.SOrganTree.prototype.reload,
	
	initRootNode: function(){
		if(this.root){
			this.root.destroy();
		}
		var cfg = {
			draggable : false,
			expanded: true
		};
		Ext.apply(cfg, this.rootCfg);
		this.root = new Artery.pwin.Ext.tree.AsyncTreeNode(cfg);
		this.organTree.setRootNode(this.root);
	},
	
	// 显示人员窗口
	showOrganWin: function(){
		this.organStore.loadData(this.getStoreData());
		this.organWin.show();
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
	},
	
	getItemId: Artery.plugin.PopupTrigger.prototype.getItemId,

	// 初始化tree
	initOrganTree: function(){
		this.smtree = new Artery.pwin.Ext.tusc.MultiSelectModel();
		this.treeLoader = new Artery.pwin.Ext.tree.TreeLoader({
			dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadOrganTree"
		});
		this.organTree = new Artery.pwin.Ext.tree.TreePanel({
			region : 'center',
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : false,
			bbar : this.getWinBbar(),
			style : 'background-color:#fff;',
			loader : this.treeLoader,
			selModel : this.smtree
		});

		// 加载节点时,传输其他参数
		this.organTree.on("beforeload", this.onBeforeload, this);
		this.organTree.on("dblclick", this.onOrganTree2Click, this);
		// 设置根节点
		this.initRootNode();
	},
	
	//双击目录树事件
	onOrganTree2Click : function(e) {
		var nodes = this.smtree.getSelectedNodes();
		if(nodes != null && nodes[0] != null && nodes[0].isLeaf())
		    this.addRecord();
	},
	// 加载子节点前调用
	onBeforeload: Artery.plugin.SOrganTree.prototype.onBeforeload,
	
	// 初始化grid
	initOrganGrid: function(){
		this.filterField = new Artery.pwin.Ext.form.TextField({
			emptyText : '请输入名称或者简拼查找。如：张三，zs。',
			width : 230,
			listeners : {
				'focus' : {
					fn : function() {
						this.enableFilter = true;
						this.filterInterval();
					},
					scope : this
				},
				'blur' : {
					fn : function() {
						this.enableFilter = false;
					},
					scope : this
				}
			}
		});
		var me = this;
		var operRenderer = function(data, metadata, record, rowIdx, colIdx, store){
			return me.upAndDownRenderer(data, metadata, record, rowIdx, colIdx, store);
		};
		// 初始化Grid
		this.organGrid = new Artery.pwin.Ext.grid.GridPanel({
			region : 'center',
			store : this.organStore,
			columns : [{
				header : "名称",
				width : 75,
				sortable : false,
				dataIndex : 'name'
			},{
				header: "操作",
				width: 30,
				dataIndex: "id",
				renderer: operRenderer
			}],
			viewConfig : {
				forceFit : true,
				scrollOffset:0
			},
			plugins : [this.dragSelector = new Artery.pwin.Ext.ux.grid.DragSelector()],
			stripeRows : true,
			border : false,
			bbar : [this.filterField]
		});
		this.smgrid = this.organGrid.getSelectionModel();
		this.organGrid.on("click", this.gridClickHandler, this);
	},
	
	// 用于生成up和down按钮
	upAndDownRenderer: function(data, metadata, record, rowIdx, colIdx, store){
		var val = "<img src=\""+this.upImgPath+"\" style=\"cursor:hand;\" rowIdx=\""+rowIdx+"\">&nbsp;"+
				  "<img src=\""+this.downImgPath+"\" style=\"cursor:hand;\" rowIdx=\""+rowIdx+"\">";
		return val;
	},
	
	// 单击grid时执行
	gridClickHandler: function(e){
		var dom = e.getTarget();
		if(!dom || dom.nodeName.toLowerCase()!="img"){
			return ;
		}
		// 向上移动
		if(dom.src.indexOf(this.upImgPath)!=-1){
			var rowIdx = parseInt(dom.attributes.rowIdx.value);
			if(rowIdx>0){
				this.organStore.suspendEvents(false);
				var rec = this.organStore.getAt(rowIdx);
				this.organStore.removeAt(rowIdx);
				this.organStore.insert(rowIdx-1,[rec]);
				this.organStore.resumeEvents();
				this.organGrid.view.refresh();
			}
		}
		// 向下移动
		else if(dom.src.indexOf(this.downImgPath)!=-1){
			var rowIdx = parseInt(dom.attributes.rowIdx.value);
			if(rowIdx<this.organStore.getCount()-1){
				this.organStore.suspendEvents(false);
				var rec = this.organStore.getAt(rowIdx);
				this.organStore.removeAt(rowIdx);
				this.organStore.insert(rowIdx+1,[rec]);
				this.organStore.resumeEvents();
				this.organGrid.view.refresh();
			}
		}
	},
	
	// 初始化窗口
	initOrganWin : function() {
		var me = this;
		this.initOrganTree();
		this.initOrganStore();
		this.initOrganGrid();

		this.win_addButton = new Artery.pwin.Ext.Button({
			text : '添加->',
			handler : function(){
				me.addRecord();
			}
		});
		this.win_delButton = new Artery.pwin.Ext.Button({
			text : '删除<-',
			handler : function(){
				me.delRecord();
			}
		});
		this.win_delAllButton = new Artery.pwin.Ext.Button({
			text : '全删<-',
			handler : function(){
				me.delRecordAll();
			}
		});
		
		this.organWin = new Artery.pwin.Ext.Window({
			layout : 'border',
			width : 600,
			height : Ext.num(this.windowHeight, 400),
			closeAction : 'hide',
			plain : true,
			modal:true,
			shadow :false,
			items : [this.organTree, {
				region : 'east',
				layout : 'border',
				width : 300,
				border : false,
				items : [{
					region : 'west',
					width : 65,
					border : false,
					style : 'border-left:1px solid #99BBE8;border-right:1px solid #99BBE8;background-color:#fff;',
					bodyStyle : 'background-color:#D2E0F1;',
					items : [{
						bodyStyle : 'background-color:#D2E0F1;padding-top:50px;text-align:center;',
						border : false,
						items : [this.win_addButton]
					}, {
						bodyStyle : 'background-color:#D2E0F1;padding-top:15px;text-align:center;',
						border : false,
						items : [this.win_delButton]
					}, {
						bodyStyle : 'background-color:#D2E0F1;padding-top:15px;text-align:center;',
						border : false,
						items : [this.win_delAllButton]
					}]
				}, this.organGrid]
			}],
			buttons : [{
				text : '确定',
				disabled : false,
				handler : this.submitValue,
				scope : this
			}, {
				text : '关闭',
				handler : function() {
					this.organWin.hide();
				},
				scope : this
			}]
		});

		this.organWin.on('hide', function(win) {
			this.clearSearchInfo();
			this.focus();
			this.validate();
			if(this.geditor){
				this.geditor.allowBlur = false;
				this.geditor.completeEdit();
			}
		}, this)

		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath)) {
			this.expandNode(this.valuePath, true);
		}
		
		this.filterInterval();
	},
	
	// 提交选中的节点，更新值
	submitValue: Artery.plugin.MOrganTree.prototype.submitValue,

	// 添加所选记录
	addRecord : function() {
		// 添加记录时清除过滤
		if (!Ext.isEmpty(this.filterField.getValue())) {
			this.filterField.setValue('');
			this.filter();
		}
		var nodes = this.smtree.getSelectedNodes();
		var data = [];
		for (var i = 0; i < nodes.length; i++) {
			this.justRecord(nodes[i], data);
		}
		if (data.length != 0) {
			this.organStore.loadData(data, true);
		}
	},

	justRecord : function(node, data) {
		var a = node.attributes;
		if(this.organType.indexOf(a.type)>-1 || this.organType == "all"){
			this.addData(node, data);
		}
		//如果是叶子节点或不需要添加子节点，不需要进行处理
		if (node.isLeaf()) {
			return;
		}
		// 判断节点是否加载数据
		if (!this.addAllSubNode && node.isLoaded()) {
			node.eachChild(function(subnode) {
				if (this.organType.indexOf(subnode.attributes.type)>-1 || this.organType == "all") {
					this.addData(subnode, data);
				}
			}, this)
		} else {
			// 加载数据
			var records = this.getAjaxRecords(node);
			this.addDataArray(records, data)
		}
	},

	getAjaxRecords : function(node) {
		var records = [];
		var paramObj = Artery.getParams({
			id : node.attributes.cid,
			type : node.attributes.type,
			organType : this.organType,
			valueWithType : this.valueWithType
		}, this);
		if(!Artery.params){
			paramObj.itemType = this.itemType;
			paramObj.moreProp = this.moreProp;
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=getOrganData",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				records = resObj.data;
			},
			scope : this,
			syn : false,// 同步方法参数
			params : paramObj
		})
		return records
	},

	addData : function(node, data) {
		var a = node.attributes
		if (this.organStore.getById(a.cid) == null) {
			data.push([a.cid, node.text, a.pinyin == null ? '' : a.pinyin]);
		}
	},

	addDataArray : function(array, data) {
		for (var i = 0; i < array.length; i++) {
			if (this.organStore.getById(array[i][0]) == null) {
				data.push(array[i]);
			}
		}
	},

	// 删除记录
	delRecord : function() {
		var records = this.smgrid.getSelections();
		Ext.each(records, function(item, idx, itemAll) {
			this.organStore.remove(item);
		}, this)
	},

	// 删除记录
	delRecordAll : function() {
		this.organStore.removeAll();
	},

	// 获得organTree中的bbar
	getWinBbar : function() {
		if (this.organType != "user" || !this.enablePinyin) {
			return null
		}
		this.searchField = new Artery.pwin.Ext.form.TextField({
			emptyText : '请输入名称或者简拼查找。如：张三，zs。',
			width : 230,
			enableKeyEvents : true,
			listeners : {
				"keydown" : {
					fn : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							this.searchFlag = 1;
							this.searchUser();
						} else {
							this.searchCount = -1;
						}
					},
					scope : this
				}
			}
		});
		return [this.searchField, '-', {
			text : '查找',
			handler : function (){this.searchFlag = 1;this.searchUser();},
			scope : this
		}];
	},
	
	clearSearchInfo : Artery.plugin.MOrganTree.prototype.clearSearchInfo,
	
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
				paramObj.itemType = this.itemType;
				paramObj.moreProp = this.moreProp;
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
	expandNode : function(path, checked) {
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
				if(this.searchField){
					this.searchField.focus();
				}
				return;
			}
			subNode.expand(false, false, expandFn, this);
		}

		this.root.expand(false, false, expandFn, this);
	},
	
	// 数据更新方法
	upValueText : Artery.plugin.MOrganTree.prototype.upValueText,

	/**
	 * 验证输入是否为可选项
	 */
	validateRightValue : Artery.plugin.SOrganTree.prototype.validateRightValue,
	
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
	}
	//END：增加下拉选择列表支持==========================================================================================
})

Ext.reg('apMOrganList', Artery.plugin.MOrganList);
