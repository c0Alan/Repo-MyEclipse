function initDictTree() {
	var txtFind = new Ext.form.TriggerField({
				emptyText : '字段过滤',
				triggerClass : "x-form-search-trigger",
				width : 220
			});
	txtFind.onTriggerClick = function() {
		dictTree.root.reload();
	};

	dictTree = new Ext.tree.TreePanel({
				region : 'west',
				animate : false,
				margins : '4 0 4 4',
				border : true,
				width : 220,
				split : true,
				minSize : 175,
				maxSize : 400,
				collapsible : true,
				hideCollapseTool : true,
				containerScroll : true,
				autoScroll : true,
				enableDD : true,
				collapseMode : 'mini',
				loader : new Ext.tree.TreeLoader({
							dataUrl : 'formmake.do?action=loadDictTree'
						}),
				root : new Ext.tree.AsyncTreeNode({
							text : '相关表',
							leaf : false,
							draggable : false,
							cid : '',
							iconCls : 'dictroot',
							type : 'root'
						}),
				tbar : [txtFind]
			});

	// 加载节点时,传输其他参数
	dictTree.getLoader().on("beforeload", function(treeLoader, node) {
				this.baseParams.formid = formtpl.id;
				this.baseParams.type = node.attributes.type;
				this.baseParams.cid = node.attributes.cid;
				this.baseParams.filter = txtFind.getValue();
			});
	dictTree.on("nodedragover", function(e) {
				return false
			});

	dictTree.root.expand(false, false);
}