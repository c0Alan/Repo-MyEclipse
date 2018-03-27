RightEditor = function() {
	/* ----------------------- privat变量 ----------------------- */
	var rightWindow;	// 权限编辑窗口
	var rightTree;		// 权限树
	var rightArea;		// textArea编辑
	var callback;		// 保存回调方法
	
	/* ----------------------- private方法 ---------------------- */
	
	// 重载权限树
	function reloadRightTree(){
	    // 删除所有的节点
	    var na = [];
	    rightTree.root.eachChild(function(innerNode){
	    	na.push(innerNode);
	    });
	    for(var i=0;i<na.length;i++){
	    	rightTree.root.removeChild(na[i]);
	    }
	    // 重新获取节点
		var map = new Map();
        map.put("key", "complib.loadRightTree");
        var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			var obj = Ext.decode(msg);
			genTreeNode(rightTree.root,obj.children);
			rightTree.root.expand(true);
		});
        query.send();
	}
	
	// 递归的生成节点
	function genTreeNode(pnode,conf){
		for(var i=0;i<conf.length;i++){
			var cnode = new Ext.tree.TreeNode({
				text : conf[i].text,
				rightKey : conf[i].rightKey,
				qtip : conf[i].qtip,
				leaf: conf[i].leaf
			});
			pnode.appendChild(cnode);
			if(conf[i].children){
				genTreeNode(cnode,conf[i].children);
			}
		}
	}
	
	function addText(text){
		window.clipboardData.setData('Text',text);
		rightArea.focus();
		var r1 = document.selection.createRange();
		r1.execCommand("Paste");
	}
	
	function initRightTree(){
		rightTree = new Ext.tree.TreePanel({
			region : 'west',
			animate : false,
			margins : '4 4 4 4',
			width : 200,
			autoScroll : true,
			enableDD : false,
			rootVisible : false,
			containerScroll : true,
			root: new Ext.tree.AsyncTreeNode(rightTreeJson),
			loader: new Ext.tree.TreeLoader({
			})
		});
		rightTree.on("click",function(node){
			addText(node.attributes.rightKey);
		});
	}
	
	function initWindow(){
		rightArea = new Ext.form.TextArea({
			focusClass: ""
		});
		rightWindow = new Ext.Window({
			title : '编辑权限',
			width : 670,
			height : 410,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			border : false,
			layout : 'border',
			items : [rightTree,{
				region: "center",
				layout: "fit",
				margins : '4 4 4 0',
				tbar:[{
					text: " ( ",
					handler: function(){
						addText(" ( ");
					}
				},{
					text: " ) ",
					handler: function(){
						addText(" ) ");
					}
				},{
					text: "and",
					handler: function(){
						addText(" & ");
					}
				},{
					text: "or",
					handler: function(){
						addText(" | ");
					}
				}],
				items:[rightArea]
			}],
			buttons : [{
				text : '清除并关闭',
				handler : function(){
					if(callback && (typeof callback =="function")){
						callback("");
					}
					rightWindow.setVisible(false);
				}
			}, {
				text : '重载权限树',
				handler : function() {
					reloadRightTree();
				}
			}, {
				text : '确 定',
				handler : function(){
					if(callback && (typeof callback =="function")){
						var rightStr = rightArea.getValue();
						callback(rightStr);
					}
					rightWindow.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					rightWindow.setVisible(false);
				}
			}]
		});
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		init : function() {
			initRightTree();
			initWindow();
		},

		/*
		 * 编辑属性 @callback 当保存时调用此方法
		 */
		edit : function(rightStr,cb) {
			callback = cb;
			rightArea.setValue(rightStr);
			rightWindow.show();
			rightTree.root.expand(true);
		}
	};
}();