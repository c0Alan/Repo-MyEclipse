/**
 * 单选Tree
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.STree = Ext.extend(Artery.plugin.TwinTriggerField, {

	// 静态树节点数据
	treeLoaderData : null,

	// 组织机构树对象
	custTree : null,

	// 组织机构窗口对象
	custWin : null,

	readOnly : false,

	// 显示值
	valueText : '',

	// 值路径
	valuePath : '',

	// 展开值
	expandValue : '',

	// 展开路径
	expandValuePath : '',

	// 动态节点的itemid
	dynamicNodeId : null,

	// 展开树
	expandTree : false,

	// 是否过滤
	showFilter : false,
	
	// 过滤框提示信息
	filterEmptyText : '',

	// 打开重新加载
	openReload : false,
	
	// 弹出层最大高度
	layerHeight : 300,
	
	// 弹出层最小宽度
	minLayerWidth : 150,

	//是否输入重新加载
	editReload: false,// （如果为false，则会在初始化的时候加载一次数据，之后每次输入是都在客户端做搜索；如果为true，每次都会请求服务端的loadSelectStore方法）


	initComponent : function() {
		if (this.margin) {
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.STree.superclass.initComponent.call(this);
		// 防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
					try {
						if (this.custTree) {
							this.custTree.destroy();
							this.custTree = null;
						}
						if (this.okButton) {
							this.okButton.destroy();
							this.okButton = null;
						}
						if (this.closeButton) {
							this.closeButton.destroy();
							this.closeButton = null;
						}
						if (this.filterField) {
							this.filterField.destroy();
							this.filterField = null;
						}
						if (this.searchButton) {
							this.searchButton.destroy();
							this.searchButton = null;
						}
						if (this.custWin) {
							this.custWin.destroy();
							this.custWin = null;
						}
						this.root = null;
					} catch (e) {
					}

				}, this);
		this.plugins = new Ext.tusc.plugins.Select();
	},

	// 提交选中的节点，更新值
	submitValue : function() {
		var ov = this.getValue();
		if (this.valueTemp !== undefined && this.valueTextTemp !== undefined) {
			this.setValue(this.valueTemp, this.valueTextTemp);
		}
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 需要设置值后在关闭
		this.custWin.hide();
		this.fireEvent('change', this, this.value, ov);
	},

	// 清空临时选择的值
	clearTempValue : function() {
		delete this.valueTemp;
		delete this.valueTextTemp;
	},

	onTrigger2Click : function() {
		if (this.disabled || this.readOnly) {
			return;
		}
		if (this.custWin == null) {
			this.initCustWin();
		}
		this.custWin.show();
		if (this.openReload) {
			this.root.reload();
		} else if (Ext.isEmpty(this.value)) {
			this.clearTree();
		} else {
			Artery.plugin.faTreeFunc.skinSelectedNode(this.custTree, this
							.getValue());
		}
		this.expandNodePath();
		if (this.geditor) {
			this.geditor.allowBlur = true;
		}
	},

	// 重新加载，支持自定义参数和回调函数
	// {params:{},callback:function(){}, clearValue:true}
	reload : function(o) {
		if (o == null) {
			o = {}
		}
		if (Ext.isEmpty(o.clearValue) || Ext.isTrue(o.clearValue)) {
			this.setValue("");
		}
		if (o.params != null) {
			this.reloadParams = {};
			Ext.apply(this.reloadParams, o.params);
		}
		var scope = this;
		this.root.reload(o.callback, this);
	},

	createTreePanel : function(cfg) {
		var uuid = Ext.id();

		if (cfg.field.showFilter) {
			cfg.field.filterField = new Ext.form.TextField({
						emptyText : '请输入过滤值',
						width : 230,
						enableKeyEvents : true
					});
			cfg.field.searchButton = new Ext.Button({
						text : '查找'
					});
			var toolbartemp = [cfg.field.filterField, '-',
					cfg.field.searchButton];
		} else {
			var toolbartemp = null;
		}

		var treeLoaderCfg = {
			baseAttrs : {
				uiProvider : Ext.tree.TreeSingleNodeUI,
				uuid : uuid,
				"cls" : "x-btn-text-icon"
			}
		};
		// 若为动态节点
		if (cfg.field.treeLoaderData == null) {
			treeLoaderCfg.dataUrl = sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=loadCustTreeNode";
		}
		return new Ext.tree.TreePanel({
					autoScroll : true,
					animate : false,
					enableDD : false,
					border : false,
					rootVisible : false,
					loader : new Ext.tree.TreeLoader(treeLoaderCfg),
					eventModel : Ext.tusc.TreeRadioEvent,
					tbar : toolbartemp
				});
	},

	createRootNode : function(cfg) {
		var rootCfg = {
			text : "root",
			id : "root",
			type : "root",
			cid : "root",
			expanded : true,
			children : cfg.field.treeLoaderData
		};

		return new Ext.tree.AsyncTreeNode(rootCfg);
	},

	// 初始化窗口
	initCustWin : function() {

		this.custTree = Artery.pwin.Artery.plugin.STree.prototype
				.createTreePanel({
							field : this
						});

		if (this.showFilter) {
			this.filterField.on("keydown", function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							this.filterSearch();
						}
					}, this);
			this.searchButton.on("click", this.filterSearch, this);
		}

		if (this.treeLoaderData == null) {
			this.custTree.on("beforeload", this.onBeforeload, this);
		}
		this.custTree.on("expandnode", this.onExpandnode, this);
		this.custTree.on("checkchange", this.onCheckchange, this);

		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.custTree.on("click", this.singleClickCheckHandler, this);
		}

		// 设置根节点
		if (this.root) {
			this.root.destroy();
		}
		// 设置根节点

		this.root = Artery.pwin.Artery.plugin.STree.prototype.createRootNode({
					field : this
				});
		this.custTree.setRootNode(this.root);

		this.custWin = Artery.pwin.Artery.plugin.STree.prototype.initWindow({
					field : this
				});

		this.okButton.on("click", this.submitValue, this);
		this.closeButton.on("click", function() {
					this.custWin.hide();
				}, this);

		this.custWin.on('hide', function(win) {
					this.clearTempValue();
					this.focus();
					this.validate();
					if (this.geditor) {
						this.geditor.allowBlur = false;
						this.geditor.completeEdit();
					}
				}, this);

		if (this.treeLoaderData == null && this.expandTree) {
			this.root.expand(true, false);
		}
	},

	// 加载子节点前调用
	onBeforeload : function(node) {
		var loader = this.custTree.loader;
		loader.baseParams.itemid = this.dynamicNodeId;
		loader.baseParams.formid = Artery.getFormId(this);
		loader.baseParams.node_type = node.attributes.type;
		loader.baseParams.node_cid = node.attributes.cid;
		loader.baseParams.node_name = node.text;
		loader.baseParams.node_leaf = node.isLeaf() + "";
		if(node.attributes.cfg){
			loader.baseParams.node_cfg = Ext.encode(node.attributes.cfg);
		}
		if (node.attributes.iconId) {
			loader.baseParams.node_iconId = node.attributes.iconId;
		}
		if (this.filterField) {
			var fv = this.filterField.getValue();
			if (!Ext.isEmpty(fv)) {
				loader.baseParams.filterValue = fv;
			} else {
				loader.baseParams.filterValue = "";
			}
		} else {
			loader.baseParams.filterValue = "";
		}
		// 添加请求中的参数
		Ext.applyIf(loader.baseParams, Artery.getParams({}, this));
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		//添加reload参数
		Ext.apply(loader.baseParams,this.reloadParams)
		// 执行onBeforeLoad事件
		if (this.onBeforeLoadEvent) {
			Artery.regItemEvent(this, 'onBeforeLoadEvent', null, {
						'loader' : loader,
						'node' : node
					});
		}
	},

	// 节点展开时调用
	onExpandnode : function(node) {
		node.eachChild(function(cnode) {
			if (!Ext.isEmpty(this.value) && cnode.attributes.cid == this.value) {
				cnode.select();
				cnode.ui.checkbox.checked = true;
				cnode.ui.checkbox.defaultChecked = true;
			}
		}, this);
	},

	// 节点切换时调用
	onCheckchange : function(node, checked) {
		this.valueTextTemp = node.text;
		this.valueTemp = node.attributes.cid;
		node.select();
	},

	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	clearTree : function() {
		var node = this.custTree.getSelectionModel().getSelectedNode();
		if (node) {
			node.unselect();
			if (node.ui.checkbox) {
				node.ui.checkbox.checked = false;
				node.ui.checkbox.defaultChecked = false;
			}
		}
	},

	initWindow : function(cfg) {

		cfg.field.okButton = new Ext.Button({
					text : '确定'
				});
		cfg.field.closeButton = new Ext.Button({
					text : '关闭'
				});
		return new Ext.Window({
					layout : 'fit',
					width : 300,
					height : 400,
					closeAction : 'hide',
					modal : true,
					shadow : false,
					resizable : false,
					items : [cfg.field.custTree],
					buttons : [cfg.field.okButton, cfg.field.closeButton]
				});

	},

	getFilterBar : function() {
		if (!this.showFilter) {
			return null;
		}

		return [this.filterField = new Artery.pwin.Ext.form.TextField({
							emptyText : '请输入过滤值',
							width : 230,
							enableKeyEvents : true,
							listeners : {
								"keydown" : {
									fn : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER) {
											this.filterSearch();
										}
									},
									scope : this
								}
							}
						}), '-', {
					text : '查找',
					handler : this.filterSearch,
					scope : this
				}];
	},

	// 查找代码
	filterSearch : function() {
		var searchText = this.filterField.getValue();
		if (Ext.isEmpty(searchText)) {
			return ;
		}
		var nodeId = null;
		var expandFn = function(node) {
			if(node.text.indexOf(searchText) > -1) {
				node.select();
				nodeId = node.attributes.cid;
			}
			for(var i=0; i<node.childNodes.length; i++) {
				var subNode = node.childNodes[i];
				if(nodeId != null) {
					break;
				}
				subNode.expand(false, false, expandFn);
				if(nodeId == null) {
					subNode.collapse();
				}
			}
		}
		this.root.expand(false, false, expandFn);
	},

	// 根据valuePath展开节点
	expandNodePath : function() {
		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath) && !Ext.isEmpty(this.value)) {
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

	// 根据路径展开节点
	expandNode : function(path, checked, expanded) {
		var tree = this;
		// 内部函数
		var pathFn = function(path) {
			var idarray = path.split(",");
			return idarray;
		}
		var expandFn = function(node) {
			if (idarray.length == 1) {
				var tnode = node.findChild('cid', idarray.shift());
				tnode.select();
				tnode.getUI().getEl().scrollIntoView();
				if (checked == true) {
					tnode.ui.checkbox.checked = true;
				}
				if (expanded == true) {
					tnode.expand(false, false, function(node){
						if (node.hasChildNodes() && node.lastChild) {
							node.lastChild.ensureVisible();
							node.ensureVisible();
						}
					});
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
		var idarray = pathFn(path);
		this.root.expand(false, false, expandFn);
	},

	/**
	 * 数据更新方法
	 */
	upValueText : function() {
		if (this.treeLoaderData) {
			var vt = this.findValueText();
			this.setValueText(vt);
		} else {
			var paramObj = Artery.getParams({
				value : this.getValue(),
				itemid : this.dynamicNodeId
			}, this);
			if (!Artery.params) {
				paramObj.itemType = "faTree";
				paramObj.moreProp = "STree";
			}
			Artery.request({
				url : sys.getContextPath()
						+ "/artery/form/dealParse.do?action=runItemLogic&method=onNodeDetail",
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
		}
	},

	// 查找节点的显示值（静态树）
	findValueText : function() {
		var pathArray = [];
		var fn = function(node) {
			var text = null;
			if (node.cid == this.value) {
				text = node.text;
				pathArray.push(node.cid);
				return text;
			}
			if (node.children) {
				for (var i = 0; i < node.children.length; i++) {
					text = fn.call(this, node.children[i]);
					if (text) {
						pathArray.push(node.cid);
						return text;
					}
				}
			}
			return null;
		}

		var vt = fn.call(this, {
					children : this.treeLoaderData
				});
		if (Ext.isEmpty(vt)) {
			vt = '';
		}
		pathArray.reverse();
		pathArray.shift();
		this.valuePath = pathArray.join(",");
//		this.valuePath = pathArray.join(",") + "root";
		return vt;
	},
	getLoadSelectStoreParam : function() {
		var param = {
			filterValue : this.getValueText()
		}
		return param;
	},	//是否显示下拉列表，如下
	isShowSelectList : function () {
		return this.editable;
	}
})

Ext.reg('apSTree', Artery.plugin.STree);

/**
 * 多选Tree
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.MTree = Ext.extend(Artery.plugin.TwinTriggerField, {

	// 组织机构数据
	custStore : null,

	// 组织机构树对象
	custTree : null,

	// 组织机构窗口对象
	custWin : null,

	readOnly : false,

	// 显示值
	valueText : '',

	// 展开值
	expandValue : '',

	// 展开路径
	expandValuePath : '',

	// 拼音
	valuePinyin : '',

	enableFilter : false,// 是否进行过滤循环

	// 展开树
	expandTree : false,

	// 是否过滤
	showFilter : false,
	
	// 过滤框提示信息
	filterEmptyText : '',

	// 打开重新加载
	openReload : false,

	// 级联选择
	cascade : false,

	// 级联父节点
	cascadeParent : 'allchild', // 级联父节点allchild,singlechild,false
	// 打开重新加载
	openReload : false,
	
	// 弹出层最大高度
	layerHeight : 300,
	
	// 弹出层最小宽度
	minLayerWidth : 150,

	//是否输入重新加载
	editReload: false,// （如果为false，则会在初始化的时候加载一次数据，之后每次输入是都在客户端做搜索；如果为true，每次都会请求服务端的loadSelectStore方法）

	initComponent : function() {
		if (this.margin) {
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.MTree.superclass.initComponent.call(this);

		if (!this.custStore) {
			this.custStore = new Artery.pwin.Ext.data.SimpleStore({
						fields : ['id', 'name', 'pinyin'],
						data : this.getStoreData(),
						id : 0
					});
		}

		// 防止内存泄露
			Ext.EventManager.on(window, 'beforeunload', function(){
					try {
						if (this.custTree) {
							this.custTree.destroy();
							this.custTree = null;
						}
						if (this.okButton) {
							this.okButton.destroy();
							this.okButton = null;
						}
						if (this.closeButton) {
							this.closeButton.destroy();
							this.closeButton = null;
						}
                        if (this.filterField) {
                            this.filterField.destroy();
                            this.filterField = null;
                        }
                        if (this.searchButton) {
                            this.searchButton.destroy();
                            this.searchButton = null;
                        }
						if (this.custWin) {
							this.custWin.destroy();
							this.custWin = null;
						}
						this.root = null;
					} catch (e) {
					}

				}, this);
			this.plugins = new Ext.tusc.plugins.Select();
	},

	onRender : function(ct, position) {
		Artery.plugin.MTreePopup.superclass.onRender.call(this, ct, position);
		// 如果级联选择，则创建cascadeField
		if (this.cascade) {
			this.cascadeField = this.el.insertSibling({
						tag : 'input',
						type : 'hidden',
						name : this.id + "Cascade"
					}, 'after', true);
		}
	},

	// 初始化数据
	getStoreData : function() {
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

	getValue : function() {
		return this.value;
	},

	/**
	 * 设置值
	 * 
	 * @param v
	 *            值
	 * @param vt
	 *            显示值
	 */
	setValue : function(v, vt, clearCas) {
		v = Artery.getSplitValue(v);
		vt = Artery.getSplitValue(vt);

		Artery.plugin.MTree.superclass.setValue.call(this, v, vt);
		this.custStore.loadData(this.getStoreData());
		this.sureSelectedNode(clearCas !== false);
		if (this.cascade) {
			if (Ext.isEmpty(v)) {
				this.clearCascadeValue();
			} else {
				this.genCascadeValue();
			}
		}
	},

	onTrigger1Click : function() {
		// 清空级联值
		if (!this.disabled && this.cascade) {
			this.clearCascadeValue();
		}
		Artery.plugin.MTreePopup.superclass.onTrigger1Click.call(this);
	},

	onTrigger2Click : function() {
		if (this.disabled || this.readOnly) {
			return;
		}
		if (this.custWin == null) {
			this.initCustWin();
		}
		this.custWin.show();
		if (this.openReload) {
			this.root.reload();
		} else {
			this.sureSelectedNode(false);
		}
		this.expandNodePath();
		if (this.geditor) {
			this.geditor.allowBlur = true;
		}
	},

	// 重新加载，支持自定义参数和回调函数
	// {params:{},callback:function(){}, clearValue:true}
	reload : Artery.plugin.STree.prototype.reload,

	createTreePanel : function(cfg) {
		// var tree = this;
		var uuid = Ext.id();

		if (cfg.field.showFilter) {
			cfg.field.filterField = new Ext.form.TextField({
						emptyText : '请输入过滤值',
						width : 230,
						enableKeyEvents : true
					});
			cfg.field.searchButton = new Ext.Button({
						text : '查找'
					});
			var toolbartemp = [cfg.field.filterField, '-',
					cfg.field.searchButton];
		} else {
			var toolbartemp = null;
		}

		var treeLoaderCfg = {
			baseAttrs : {
				"cls" : "x-btn-text-icon"
			}
		};
		// 若为动态节点
		if (cfg.field.treeLoaderData == null) {
			treeLoaderCfg.dataUrl = sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=loadCustTreeNode";
		}

		return new Ext.tree.TreePanel({
					autoScroll : true,
					animate : false,
					enableDD : false,
					border : false,
					rootVisible : false,
					loader : new Ext.tree.TreeLoader(treeLoaderCfg),
					tbar : toolbartemp
				});
	},

	createRootNode : function(cfg) {
		var rootCfg = {
			text : "root",
			id : "root",
			type : "root",
			cid : "root",
			expanded : true,
			children : cfg.field.treeLoaderData
		};

		return new Ext.tree.AsyncTreeNode(rootCfg);
	},

	// 初始化窗口
	initCustWin : function() {
		this.custTree = Artery.pwin.Artery.plugin.MTree.prototype
				.createTreePanel({
							field : this
						});

		if (this.showFilter) {
			this.filterField.on("keydown", function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							this.filterSearch();
						}
					}, this);
			this.searchButton.on("click", this.filterSearch, this);
		}
		if (this.treeLoaderData == null) {
			this.custTree.on("beforeload", this.onBeforeload, this);
		}
		this.custTree.on("expandnode", this.onExpandnode, this);
		this.custTree.on("checkchange", this.onCheckchange, this);

		// 单击树上节点时选中 功能
		if (Ext.isTrue(this.singleClickCheck)) {
			this.custTree.on("click", this.singleClickCheckHandler, this);
		}

		// 设置根节点
		if (this.root) {
			this.root.destroy();
		}
		// 设置根节点

		this.root = Artery.pwin.Artery.plugin.MTree.prototype.createRootNode({
					field : this
				});
		this.custTree.setRootNode(this.root);
		this.custWin = Artery.pwin.Artery.plugin.MTree.prototype.initWindow({
					field : this
				});
		this.okButton.on("click", this.submitValue, this);
		this.closeButton.on("click", function() {
					this.custWin.hide();
				}, this);

		this.custWin.on('hide', function(win) {
					this.clearTempValue();
					this.focus();
					this.validate();
					if (this.geditor) {
						this.geditor.allowBlur = false;
						this.geditor.completeEdit();
					}
				}, this);
		// 如果值为空，则清空选中的值
		this.custWin.on("beforeshow", function(win) {
					if (this.value == null || this.value == "") {
						this.delRecordAll();
					}
				}, this);
		if (this.treeLoaderData == null && this.expandTree) {
			this.root.expand(true, false);
		}
	},

	initWindow : function(cfg) {
		cfg.field.okButton = new Ext.Button({
					text : '确定'
				});
		cfg.field.closeButton = new Ext.Button({
					text : '关闭'
				});

		return new Ext.Window({
					layout : 'fit',
					width : 300,
					height : 400,
					closeAction : 'hide',
					modal : true,
					shadow : false,
					resizable : false,
					items : [cfg.field.custTree],
					buttons : [cfg.field.okButton, cfg.field.closeButton]
				});
	},

	// 加载子节点前调用
	onBeforeload : function(node) {
		var loader = this.custTree.loader;
		loader.baseParams.itemid = this.dynamicNodeId;
		loader.baseParams.formid = Artery.getFormId(this);
		loader.baseParams.node_type = node.attributes.type;
		loader.baseParams.node_cid = node.attributes.cid;
		loader.baseParams.node_name = node.text;
		loader.baseParams.node_leaf = node.isLeaf() + "";
		if(node.attributes.cfg){
			loader.baseParams.node_cfg = Ext.encode(node.attributes.cfg);
		}
		if (node.attributes.iconId) {
			loader.baseParams.node_iconId = node.attributes.iconId;
		}
		if (this.filterField) {
			var fv = this.filterField.getValue();
			if (!Ext.isEmpty(fv)) {
				loader.baseParams.filterValue = fv;
			} else {
				loader.baseParams.filterValue = "";
			}
		} else {
			loader.baseParams.filterValue = "";
		}
		// 添加请求中的参数
		Ext.applyIf(loader.baseParams, Artery.getParams({}, this));
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		//添加reload参数
		Ext.apply(loader.baseParams,this.reloadParams)
		// 执行onBeforeLoad事件
		if (this.onBeforeLoadEvent) {
			Artery.regItemEvent(this, 'onBeforeLoadEvent', null, {
						'loader' : loader,
						'node' : node
					});
		}
	},

	getFilterBar : Artery.plugin.STree.prototype.getFilterBar,

	/**
	 * 获得级联值
	 */
	getCascadeValue : Artery.plugin.faTreeFunc.getCascadeValue,

	sureSelectedNode : Artery.plugin.faTreeFunc.sureSelectedNode,

	sureNode : Artery.plugin.faTreeFunc.sureNode,

	// 节点展开时调用
	onExpandnode : Artery.plugin.faTreeFunc.onExpandnode,

	// 节点切换时调用
	onCheckchange : Artery.plugin.faTreeFunc.onCheckchange,

	/** 单击树上节点时选中 */
	singleClickCheckHandler: Artery.plugin.faTreeFunc.singleClickCheckHandler,

	// 级联处理上下级节点
	onCascadeNode : Artery.plugin.faTreeFunc.onCascadeNode,

	// 生成级联树状态
	genCascadeValue : Artery.plugin.faTreeFunc.genCascadeValue,

	// 清空级联树状态
	clearCascadeValue : Artery.plugin.faTreeFunc.clearCascadeValue,

	// 添加所选记录
	addRecord : Artery.plugin.faTreeFunc.addRecord,

	// 删除记录
	delRecord : Artery.plugin.faTreeFunc.delRecord,

	// 选择完节点后，设置选择的值
	submitValue : function() {
		Artery.plugin.faTreeFunc.onSubmitValue.call(this);
		// 需要设置值后在关闭
		this.custWin.hide();
	},

	// 清空临时选择的值
	clearTempValue : function() {
		this.custStore.loadData(this.getStoreData());
	},

	filterSearch : function() {
		var searchText = this.filterField.getValue();
		if (Ext.isEmpty(searchText)) {
			return ;
		}
		var nodeId = null;
		var expandFn = function(node) {
			if(node.text.indexOf(searchText) > -1) {
				node.select();
				nodeId = node.attributes.cid;
			}
			for(var i=0; i<node.childNodes.length; i++) {
				var subNode = node.childNodes[i];
				if(nodeId != null) {
					break;
				}
				subNode.expand(false, false, expandFn);
				if(nodeId == null) {
					subNode.collapse();
				}
			}
		}
		this.root.expand(false, false, expandFn);
	},

	// 删除记录
	delRecordAll : function() {
		this.custStore.removeAll();
	},
	
	// 根据valuePath展开节点
	expandNodePath : function() {
		var expandFn = function(bSuccess, node) {
			if (bSuccess) {
				node.select();
				if (node.hasChildNodes() && node.lastChild) {
					node.lastChild.ensureVisible();
					node.ensureVisible();
				}
			}
		};
		// 如果结点路径不为空，则展开节点
		if (!Ext.isEmpty(this.valuePath) && !Ext.isEmpty(this.value) && this.custTree) {
			var path = this.valuePath.split(";");
			for(var i=0;i<path.length;i++){
				if (i == 0) {
					this.custTree.expandPath("/root/"+path[i].replace(new RegExp(',',"gm"),'/'),"cid",expandFn);
				} else {
					this.custTree.expandPath("/root/"+path[i].replace(new RegExp(',',"gm"),'/'),"cid");
				}
			}
			this.valuePath = null;
			return;
		}
		// “展开值”属性不为空，则展开节点
		if (!Ext.isEmpty(this.expandValuePath)
				&& !Ext.isEmpty(this.expandValue)) {
			// this.expandNode(this.expandValuePath, false, true);
			this.custTree.expandPath("/root/" + this.expandValuePath.replace( new RegExp(',', "gm"), '/'),"cid",expandFn);
			return;
		}
	},

	/**
	 * 更新显示值
	 */
	upValueText : function() {
		if (this.treeLoaderData) {
			var vt = this.findValueText();
			this.setValueText(vt);
		} else {
			var paramObj = Artery.getParams({
				value : this.getValue(),
				itemid : this.dynamicNodeId
			}, this);
			if (!Artery.params) {
				paramObj.itemType = "faTree";
				paramObj.moreProp = "STree";
			}
			Artery.request({
				url : sys.getContextPath()
						+ "/artery/form/dealParse.do?action=runItemLogic&method=onNodeDetail",
				success : function(response, options) {
					var resObj = Ext.decode(response.responseText);
					var vt = resObj.valueText;
					if (Ext.isEmpty(vt)) {
						vt = this.value;
					}
					this.setValueText(vt);
				},
				scope : this,
				syn : false,
				params : paramObj
			});
		}
		this.custStore.loadData(this.getStoreData());
	},

	// 从节点中找到显示的值
	findValueText : function() {
		var separator = Artery.getMultiSelectSeparator();
		var v = {};
		var pathArray = {};
		var tempArray = this.value.split(separator);
		for (var i = 0; i < tempArray.length; i++) {
			v[tempArray[i]] = tempArray[i];
			pathArray[tempArray[i]] = [];
		}
		var vt = [];
		var fn = function(node) {
			var nodeid = null;
			if (node.leaf && v[node.cid] != null) {
				vt.push(node.text);
				nodeid = node.cid;
				pathArray[nodeid].push(node.cid);
			}
			if (node.children) {
				for (var i = 0; i < node.children.length; i++) {
					nodeid = fn.call(this, node.children[i]);
				}
				if(nodeid && node.cid){
					pathArray[nodeid].push(node.cid);
				}
			} 
			return nodeid;
		}

		fn.call(this, {
					children : this.treeLoaderData
				});
		
		for (var i = 0; i < tempArray.length; i++) {
			pathArray[tempArray[i]].reverse();
			var tmp = pathArray[tempArray[i]].join(",");
			if(tmp){
				if(this.valuePath)
				     this.valuePath+=";"+tmp;
				else
				     this.valuePath = tmp;
			}
		}
		
		return vt.join(separator);
	},
	getLoadSelectStoreParam : function() {
		var param = {
			filterValue : this.getValueText()
		}
		return param;
	},	
	//是否显示下拉列表，如下
	isShowSelectList : function () {
		return this.editable;
	},
	//是否可以多选
	getMultiSelect : function() {
		return true;
	}

})

Ext.reg('apMTree', Artery.plugin.MTree);