/**
 * 静态树导航
 * 
 * @author weijx
 * @date 2008-12-10
 */
Artery.plugin.TreeNav = Ext.extend(Ext.tree.TreePanel, {
	
	// render后，是否展开导航树
	expandTree: false,
	rootVisible: false,
	autoScroll: false,
	border: false,
	allowDomMove:false,
	//设置是否需要显示虚线的配置
//	lines : true,
	
	// 树不需要异步加载节点
	loader: new Ext.tree.TreeLoader({}),
	
	afterRender : function(){
        Ext.tree.TreePanel.superclass.afterRender.call(this);
        this.root.render();
        if(this.expandTree){
        	var me = this;
        	// 延迟展开树，防止node显示不全
        	var f = function(){
	        	me.doExpandTree(me.root);
        	}
        	f.defer(100);
        }else if(!this.rootVisible){
        	this.root.renderChildren();
        }
    },
    
   	// private 展开导航树
	doExpandTree: function(node){
		if(this.expandLevel==null || this.expandLevel<=0){
			node.expand(true);
		}else{
			function expand_node(n){
    			if(n.level>0 && !n.isLeaf()){
	      			n.expand(false,false,function(){
		          		n.eachChild(function(innerNode){
			          		innerNode.level = n.level-1;
				          	expand_node(innerNode);
			      		});
	      			});
    			}
			}
			// 由于隐藏根节点，level需要加1
			node.level = this.expandLevel+1;
			expand_node(node);
		}
	},
	
	// 重新设置子节点的Text
	resetNodeText: function(tc){
		var node = this.root;
		var fn = function(node){
			if(node.id && tc[node.id]){
				node.setText(tc[node.id]);
			}
			node.eachChild(fn);
		};
		node.eachChild(fn);
	},
	
	/**
	 * 重新加载全部节点计数
	 */
	reloadAllCount: function(){
		var p = this.getParams();
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=reloadCount",
			success : function(response, options) {
				var nodeTextObj = Ext.decode(response.responseText);
				this.resetNodeText(nodeTextObj);
			},
			params : p,
			scope : this
		});
	},
	
	/**
	 * 重新加载指定的节点计数
	 * @param na 节点cid列表 
	 */
	reloadCount: function(na){
		if(Ext.isEmpty(na)){
			na = [];
		}
		var p = this.getParams();
		p.nodes = Ext.encode(na);
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=reloadCount",
			success : function(response, options) {
				var nodeTextObj = Ext.decode(response.responseText);
				this.resetNodeText(nodeTextObj);
			},
			params : p,
			scope : this
		});
	},
	
	// private 获得参数
	getParams: function(){
		var p = Artery.getParams({}, this);
		return p;
	},
	
	// 单击节点事件函数
	onNodeClick: function(node){
		var cfg = node.attributes.linktoEvent;
		var hf = node.attributes.clickEvent;
		if(cfg){
			cfg = Ext.decode(cfg);
			Artery.openForm(cfg);
		}else if(hf){
			hf.call(node, node);
		}
	},
	
	onRender : function(ct, position){
		this.on("click", this.onNodeClick);
		Artery.plugin.BasePanel.prototype.onRender.call(this, ct, position);
        this.innerCt = this.body.createChild({tag:"ul",
               cls:"x-tree-root-ct " +
               (this.useArrows ? 'x-tree-arrows' : this.lines ? "x-tree-lines" : "x-tree-no-lines")});
	}
});

Ext.reg('apTreeNav', Artery.plugin.TreeNav);