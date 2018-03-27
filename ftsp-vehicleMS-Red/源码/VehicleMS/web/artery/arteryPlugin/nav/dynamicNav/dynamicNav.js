/**
 * 动态导航树
 * 
 * @author weijx
 * @date 2009-01-09
 * 
 */
Artery.plugin.DynamicTree = Ext.extend(Ext.tree.TreePanel, {
	// 为了能够在列表导航中正确显示动态导航，将autoScroll设置改为false，如果在其他地方出现问题需要改回true。
	autoScroll : false,
	border : false,
	rootVisible : false,
	allowDomMove : false,

	data : null,

	initComponent : function() {
		this.loader = new Ext.tree.TreeLoader({
			itemId : this.id,
			dataUrl : sys.getContextPath()
					+ '/artery/form/dealParse.do?action=runItemLogic&method=loadTreeNode'
		});
		this.loader.on("beforeload", this.onBeforeLoad, this);
		this.loader.on("load", this.onLoadHandler,this);
		this.on("click", this.onNodeClickHandler);
		this.root = {
			text : '根',
			cid : "root",
			type : "root"
		};
//		if (this.data) {
//			Ext.each(this.data, function(item, idx) {
//						this.convertData(item);
//					}, this)
//			this.root.children = this.data;
//		}
		Artery.plugin.DynamicTree.superclass.initComponent.call(this);
	},

	// 转换href到link
	convertData : function(data) {
		if (data.href) {
			data.link = data.href;
			delete data.href;
		}
		if (data.name) {
			data.text = data.name;
		}
		if (data.children) {
			var length = data.children.length;
			for (var i = 0; i < length; i++) {
				this.convertData(data.children[i]);
			}
		}
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
	},

	afterRender : function() {
		Ext.tree.TreePanel.superclass.afterRender.call(this);
		this.root.render();
		if (!this.rootVisible) {
			this.root.renderChildren();
			if (this.expandTree) {
				this.doExpandTree();
			}
		}
	},

	/**
	 * 加载节点前，执行此方法
	 */
	onBeforeLoad : function(loader, node) {
		loader.baseParams.formType = Artery.params.formType;
		loader.baseParams.node_type = node.attributes.type;
		loader.baseParams.node_cid = node.attributes.cid;
		loader.baseParams.node_name = node.text;
		loader.baseParams.node_leaf = node.isLeaf() + "";
		loader.baseParams.node_iconId = node.attributes.iconId;
		if (node.attributes.link) {
			loader.baseParams.node_link = node.attributes.link;
		}
		
		var tempNode = node;
     	var path = "";
 		//循环拼出当前节点的路径
  		while(tempNode){
  			if(tempNode.parentNode ){
  				path =  "/"  + tempNode.text + path;
    		}
 	 		tempNode = tempNode.parentNode ;
 		}  
 		//设置当前节点的路径，格式为： /节点a/节点b;
		loader.baseParams.node_path = path;
		
		
		// 添加请求中的参数
		Ext.applyIf(loader.baseParams, Artery.getParams({}, this));
		// 设置用户自定义参数
		loader.baseParams.custParams = Ext.encode(this.custParams);
		//设置Artery参数
		Ext.apply(loader.baseParams,this.reloadParams);
		// 执行onBeforeLoad事件
		if (this.onBeforeLoadEvent) {
			Artery.regItemEvent(this, 'onBeforeLoadEvent', null, {
						'loader' : loader,
						'node' : node
					});
		}
	},

	/**
	 * 动态导航 单击节点
	 */
	onNodeClickHandler : function(node) {
		if (node.disabled === true) {
			return;
		}

		this.lastClickNode = node;
		if (node.attributes.link && this.operAreaId) {
			var linktoCfg = {
				url : node.attributes.link,
				target : this.operAreaId
			};
			Ext.getBlankWindow(linktoCfg);
		} else if (this.onNodeClick) {
			this.onNodeClick(node);
		}
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
						break;
					}
				}
			}
		}
		if(path != null){
			this.expandNode(path.reverse().join(','));
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

	reloadCallBack : null,
	reloadPath : null,
	// 2011.5.3 王卓
	// 用于处理reload时不需要触发点击事件的情况，withClick 选择true将触发点击，选false或不写默认触发点击事件
	// public
	reload : function(options, preventClick) {
		if(options){
			if(options.params){
				this.reloadParams = options.params;
				if(options.callback)
					this.reloadCallBack = options.callback;
			}else{
				if(options.callback)
					this.reloadCallBack = options.callback;
				else
					this.reloadCallBack = options;
			}
		}
		this.reloadParams = this.reloadParams || {};
		var node = this.getSelectionModel().getSelectedNode();
		if (node && node.attributes && node.attributes.selected) {
			this.reloadPath = node.getPath("cid");
			if (preventClick) {
				delete node.attributes.selected;
			}
		}
		this.getLoader().load(this.root, this.loadComplete, this);
	},
	// 2011.5.3 王卓
	// 用于处理reload完成时重新定位之前选择的节点的方法
	// private
	loadComplete : function() {
		if (this.reloadPath) {
			this.selectPath(this.reloadPath, "cid");
		}

		if (this.reloadCallBack) {
			this.reloadCallBack.call(this);
			this.reloadCallBack = null;
		}
		if (this.reloadPath) {
			this.reloadPath = null;
		}
	},
	/**
	 * 展开导航树
	 * 
	 * @param {}
	 *            node 被展开的节点，可以不设置，默认为根节点
	 */
	doExpandTree : function(node) {
		if (!node) {
			node = this.root;
		}
		if (this.expandLevel == null || this.expandLevel <= 0) {
			node.expand(true);
		} else {
			function expand_node(n) {
				if (n.level > 0 && !n.isLeaf()) {
					n.expand(false, false, function() {
								n.eachChild(function(innerNode) {
											innerNode.level = n.level - 1;
											expand_node(innerNode);
										});
							});
				}
			}
			// 由于隐藏根节点，level需要加1
			node.level = this.expandLevel + 1;
			expand_node(node);
		}
	},

	/**
	 * 获得最后单击的节点
	 */
	getClickNode : function() {
		return this.lastClickNode;
	},

	/**
	 * 清楚选中的节点
	 */
	clearClickNode : function() {
		if (this.lastClickNode) {
			try {
				this.lastClickNode.unselect();
			} catch (e) {
				// 忽略异常
			}
			delete this.lastClickNode;
		}
	},

	/**
	 * 查询指定节点
	 */
	search : function(str) {
		if (Ext.isEmpty(str)) {
			return;
		}
		var paramObj = Artery.getParams({
					searchText : str
				}, this);
		// 发送ajax请求
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=searchNode",
			success : function(response, options) {
				var resObj = Ext.decode(response.responseText);
				if (resObj.find) {
					this.expandNode(resObj.nodePath);
				}
			},
			scope : this,
			params : paramObj
		});
	},

	// 根据路径展开节点
	// 回调函数:callback:function(isExpand){};
	//        当节点展开之后会调用此方法，参数isExpand为true则已经展开节点，false未找到需要展开的节点
	expandNode : function(path, callback) {
		var me = this;
		var idarray = path.split(",");
		var expandFn = function(node) {
			if (idarray.length == 1) {
				var tnode = node.findChild('cid', idarray.shift());
				var isExpand = false;
				if (tnode) {
					isExpand = true;
					tnode.fireEvent("click", tnode);
				}
				if (callback) {
					callback.call(this, isExpand);
				}
				return;
			}
			var subNode = node.findChild('cid', idarray.shift());
			if (subNode == null) {
				return;
			}
			subNode.expand(false, false, expandFn);
		}
		if (this.loader.baseParams.filter) {
			delete this.loader.baseParams.filter;
			this.root.reload(function() {
				me.root.expand(false, false, expandFn);
			});
		} else {
			this.root.expand(false, false, expandFn);
		}
	},

	/**
	 * 过滤节点，重载root节点
	 */
	filter : function(str) {
		if (Ext.isEmpty(str)) {
			delete this.loader.baseParams.filter;
		} else {
			this.loader.baseParams.filter = str;
			this.root.reload();
		}
	}
});

Ext.reg('apDynamictree', Artery.plugin.DynamicTree);