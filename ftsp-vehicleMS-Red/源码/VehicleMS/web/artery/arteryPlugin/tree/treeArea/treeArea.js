/**
 * Artery TreeArea component
 * 
 * @author baon
 * @date 4/1/2009
 * 
 */
Artery.plugin.TreeArea = Ext.extend(Ext.tree.TreePanel, {

	treeLoaderData : null, // 静态节点数据

	selType : 'none', // 选择类型:none,radio,checkbox

	expandTree : false, // 展开树

	value : '', // 值

	vo : null, // 值对象

	cascade : false, // 级联选择

	cascadeParent : 'allchild', // 级联父节点allchild,singlechild,false

	autoScroll : true,
	animate : false,
	enableDD : false,
	rootVisible : false,
	reloadParams:null,

	initComponent : function() {
		this.reloadParams={};
		this.vo = {};
		if (this.hidden) {
			this.hidden = false;
			this.on("render", function() {
						this.hide();
					}, this);

			this.on("show", function() {
						this.doLayout();
					}, this)
		}

		var tree = this;
		var treeLoaderCfg = {};

		// 若为单选
		if (this.selType == "radio") {
			var uuid = Ext.id();
			treeLoaderCfg = {
				baseAttrs : {
					uiProvider : Ext.tree.TreeSingleNodeUI,
					uuid : uuid,
					"cls" : "x-btn-text-icon",
					disable:true
				}
			};

			this.eventModel = Ext.tusc.TreeRadioEvent;
		} else if (this.selType == 'checkbox') {

		} else {
			treeLoaderCfg.createNode = function(attr) {
				// apply baseAttrs, nice idea Corey!
				if (this.baseAttrs) {
					Ext.applyIf(attr, this.baseAttrs);
				}
				if (this.applyLoader !== false) {
					attr.loader = this;
				}
				// modify
				attr.checked = null;

				if (typeof attr.uiProvider == 'string') {
					attr.uiProvider = this.uiProviders[attr.uiProvider]
							|| eval(attr.uiProvider);
				}
				if (attr.nodeType) {
					return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
				} else {
					return attr.leaf
							? new Ext.tree.TreeNode(attr)
							: new Ext.tree.AsyncTreeNode(attr);
				}
			}
		}

		// 若为动态节点
		if (this.treeLoaderData == null) {
			treeLoaderCfg.dataUrl = sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=loadCustTreeNode";
			treeLoaderCfg.listeners = {
				"beforeload" : function(treeLoader, node) {					
					Ext.apply(this.baseParams,tree.reloadParams);					
					this.baseParams.itemid = tree.dynamicNodeId;
					this.baseParams.node_type = node.attributes.type;
					this.baseParams.node_cid = node.attributes.cid;
					this.baseParams.node_name = node.text;
					this.baseParams.node_leaf = node.isLeaf() + "";
					if(node.attributes.cfg){
						this.baseParams.node_cfg = Ext.encode(node.attributes.cfg);
					}
					if (node.attributes.iconId) {
						this.baseParams.node_iconId = node.attributes.iconId;
					}
					// 添加请求中的参数
					Ext.applyIf(this.baseParams, Artery.getParams({}, tree));

					// 设置用户自定义参数
					this.baseParams.custParams = Ext.encode(tree.custParams);
					// 执行onBeforeLoad事件
					if (tree.onBeforeLoadEvent) {
						Artery.regItemEvent(tree, 'onBeforeLoadEvent', null, {
									'loader' : treeLoader,
									'node' : node
								});
					}
				}
			}
		}

		this.loader = new Ext.tree.TreeLoader(treeLoaderCfg);
		this.loader.on("load", this.onLoadHandler,this);

		this.on("expandnode", this.onExpandnode, this);
		this.on("checkchange", this.onCheckchange, this);
		this.on("click", this.onNodeClickHandler);

		Artery.plugin.TreeArea.superclass.initComponent.call(this);

		// 设置根节点
		this.setRootNode(new Ext.tree.AsyncTreeNode({
					text : "root",
					id : "root",
					type : "root",
					cid : "root",
					expanded : true,
					children : this.treeLoaderData
				}));
	},
	/**
	 * ajax加载完节点后，调用此方法，标记选中的节点
	 * 
	 * @param n
	 *            生成的节点
	 */
	onLoadHandler : function(loader, node) {
		var nodes = node.childNodes;
		if(nodes == null || nodes.length==0){
			return;
		}
		var path=null;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].attributes.selected) {
				nodes[i].fireEvent("click", nodes[i]);
			}
			if(path == null && !nodes[i].leaf && nodes[i].attributes.children!=null){
				var cn = nodes[i].attributes.children;
				var length = cn.length;
				for(var j=0;j<length;j++){
					path = this.findSelectedNodePath(cn[j]);
					if(path!=null){
						var cid = nodes[i].attributes.cid;
						if(!cid){
							cid = Ext.id();
							nodes[i].attributes.cid=cid;
						}
						path.push(cid);
					}
				}
			}
		}
		if(path != null){
			this.expandNode(path.reverse().join(','));
		}
	},
	
	onNodeClickHandler : function(node){
		if (node.disabled === true) {
			return;
		}

		if (this.onNodeClick) {
			this.onNodeClick(node);
		}
	},
	
	findSelectedNodePath: function(node){
		var cid = node.cid;
		if(!cid){
			cid = Ext.id();
			node.cid=cid;
		}
		if(node.selected){
			var path = [];
			path.push(cid);
			return path;
		}
		var path;
		if(!node.leaf && node.children){
			var cn = node.children;
			var length = cn.length;
			for(var j=0;j<length;j++){
				path = this.findSelectedNodePath(cn[j]);
				if(path != null ){
					path.push(cid);
					return path;
				}
			}
		}
	},
	// 重新加载，支持自定义参数和回调函数
	// {params:{},callback:function}
	reload: function(o){
		this.reloadParams=null;
		this.setValue("");
		if (o == null) {
			o = {}
		}
		if (o.params == null) {
			this.reloadParams={};
		}else{
			this.reloadParams=o.params;
		}
		
		this.root.reload(o.callback,this);
	},

	onRender : function(ct, position) {
		Artery.plugin.BasePanel.prototype.onRender.call(this, ct, position);
		this.el.addClass('x-tree');
		this.innerCt = this.body.createChild({
					tag : "ul",
					cls : "x-tree-root-ct "
							+ (this.useArrows ? 'x-tree-arrows' : this.lines
									? "x-tree-lines"
									: "x-tree-no-lines")
				});

		// Artery.plugin.TreeArea.superclass.onRender.call(this, ct, position);
		// 设置value
		this.setValue(this.value);

		if (this.treeLoaderData == null && this.expandTree) {
			this.root.expand(true, false);
		}
	},
	
	getLayout:function(){
		return null;
	},
	
	/**
	 * 获得选中值
	 */
	getValue : function() {
		var v = [];
		for (var i in this.vo) {
			v.push(i);
		}
		var separator = Artery.getMultiSelectSeparator();
		return v.join(separator);
	},

	setValue : function(value) {
		this.vo = {};
		if (value != null) {
			value = Artery.getCommaSplitValue(value);
			var separator = Artery.getMultiSelectSeparator();
			var arr = value.split(separator);
			for (var i = 0; i < arr.length; i++) {
				this.vo[arr[i]] = "";
			}
		}

		// 确认节点的选中状态
		if (!this.rendered) {
			return l
		}
		var me = this;
		var nf = function(node) {
			me.sureNode(node, true,true);
			node.isClick = false;
			if (!node.isLeaf() && (!node.isLoaded || node.isLoaded())) {
				node.eachChild(nf);
			}
		}
		nf(this.root);
	},

	// 节点展开时调用
	onExpandnode : Artery.plugin.faTreeFunc.onExpandnode,

	// 确认节点的选中状态
	// clearCas为true时，则清除级联状态
	// SetValue时仅判断vo中是否存在该节点
	sureNode : function(n, clearCas,clearState) {
		if (this.vo[n.attributes.cid] != undefined
			|| ((clearState==undefined || !clearState) && n.ui.checkbox && n.ui.checkbox.checked)) {
			if (n.ui.checkbox) {
				n.ui.checkbox.checked = true;
				this.addRecord(n);
			}
			if (this.cascade) {
				n.attributes.cascadestatus = "2";
			}
		} else {
			if (n.ui.checkbox) {
				n.ui.checkbox.checked = false;
			}
			// 当为级联选择且本节点未选中时，不初始化节点的级联状态，以便用户设置的值可以被选中
			if (this.cascade && n.attributes.cascadestatus !== undefined) {
				n.attributes.cascadestatus = "0";
			}
		}
		if (clearCas === true) {
			delete n.attributes.cascadestatus;
		}
	},

	// 删除记录
	delRecord : function(node) {
		var nid = node.attributes.cid;
		if (this.vo[nid] != undefined) {
			delete this.vo[nid];
		}
		if(node.ui && node.ui.checkbox){
			node.ui.checkbox.checked = false;
		}
	},

	// 添加所选记录
	addRecord : function(node) {
		var nid = node.attributes.cid;
		if (this.selType == "checkbox") {
			if (this.vo[nid] == undefined) {
				this.vo[nid] = "";
			}
		} else {
			this.vo = {};
			this.vo[nid] = "";
		}
	},

	// 节点切换时调用
	onCheckchange : Artery.plugin.faTreeFunc.onCheckchange,

	// 级联处理上下级节点
	onCascadeNode : Artery.plugin.faTreeFunc.onCascadeNode
})

Ext.reg('aptreearea', Artery.plugin.TreeArea);