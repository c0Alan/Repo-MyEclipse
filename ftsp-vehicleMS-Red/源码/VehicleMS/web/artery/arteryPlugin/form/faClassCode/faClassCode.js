/**
 * 单选SClassCodeTree
 * 
 * @author baon
 * @date 10/07/2008
 * 
 */
Artery.plugin.SClassCodeTree = Ext.extend(Artery.plugin.TwinTriggerField, {

	margin: true,
	
	// 组织机构树对象
	codeTree : null,

	// 组织机构窗口对象
	codeWin : null,

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
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.SClassCodeTree.superclass.initComponent.call(this);
		//防止内存泄露
		Ext.EventManager.on(window,'beforeunload',function(){
			try{
				if(this.codeWin){
					this.codeWin.destroy();
					this.codeWin = null;
				}
			}catch(e){}
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
				if(this.closeBtn){
					this.closeBtn.destroy();
					this.closeBtn = null;
				}
			}catch(e){}
			try{
				this.root = null;
			}catch(e){}
		},this)
	},
	
	// 提交选中的节点，更新值
	submitValue: function(){
		var ov = this.getValue();
		if(this.valueTemp!==undefined && this.valueTextTemp!==undefined){
			this.setValue(this.valueTemp, this.valueTextTemp);
		}
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		this.fireEvent('change',this,this.value, ov);
		// 需要设置值后在关闭
		this.codeWin.hide();
	},
	
	// 清空临时值
	clearTempValue: function(){
		delete this.valueTemp;
		delete this.valueTextTemp;
	},

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.codeWin == null) {
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
					this.initClassCodeWin();
					this.showCodeWin();
				},
				params : paramObj,
				scope : this
			})
		} else {
			this.showCodeWin();
		}
	},
	
	// 显示代码窗口
	showCodeWin: function(){
		this.codeWin.show();
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
		if(Ext.isEmpty(this.getValue())){
			this.clearTree();
		}else{
			Artery.plugin.faTreeFunc.skinSelectedNode(this.codeTree, this.getValue());
			this.expandNodePath();
		}
	},
	
	getItemId: Artery.plugin.PopupTrigger.prototype.getItemId,

	createTreePanel : function(cfg){
		try{
			if(cfg.field.searchField){
				cfg.field.searchField.destroy();
			}
			if(cfg.field.searchBtn){
				cfg.field.searchBtn.destroy();
			}
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
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

		var uuid = Ext.id(); 
		var cTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : false,
			bbar : barConf,
			loader : new Ext.tree.TreeLoader({
								baseAttrs : {
									uiProvider : Ext.tree.TreeSingleNodeUI,
									uuid : uuid
								},
								dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadClassCodeTree"
							}),
			eventModel : Ext.tusc.TreeRadioEvent
			// 指定radio事件对象
		});
		return cTree;
	},
	
	createRootNode : function(cfg){
		var rootCfg ={
			text : cfg.rootName,
			draggable : false,
			cid : cfg.cid
		}
		return new Ext.tree.AsyncTreeNode(rootCfg);
	},
	
	initRootNode : function(){
		if(this.root){
			this.root.destroy();
		}
		this.root = Artery.pwin.Artery.plugin.SClassCodeTree.prototype.createRootNode({
			text : this.rootName,
			cid : this.rootId
		});
		this.codeTree.setRootNode(this.root);
	},
	createWin : function(cfg){
		try{
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
			}
			if(cfg.field.closeBtn){
				cfg.field.closeBtn.destroy();
			}
		}catch(e){}
		
		cfg.field.okBtn = new Ext.Button({
			text:'确定',
			disabled : false
		});
		cfg.field.closeBtn = new Ext.Button({
			text:'关闭'
		});
		
		var cWin = new Artery.pwin.Ext.Window({
			layout : 'fit',
			width : 300,
			height : 400,
			closeAction : 'hide',
			modal:true,
			shadow :false,
			resizable:false,
			items : [cfg.field.codeTree],
			buttons : [cfg.field.okBtn, cfg.field.closeBtn]
		});
		return cWin;
	},

	// 初始化窗口
	initClassCodeWin : function() {
		this.codeTree = Artery.pwin.Artery.plugin.SClassCodeTree.prototype.createTreePanel({field:this});
		
		this.codeTree.on("checkchange", this.onCheckchange, this);
		this.codeTree.on("beforeload", this.onBeforeload, this);
		
		if(this.searchField){
			this.searchField.on('keydown',function(field, e){
				if (e.getKey() == Ext.EventObject.ENTER) {
				    this.searchCode();
				}
			}
			,this);
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchCode();
			},this)
		}
		
		//初始化节点
		this.initRootNode();
		this.root.expand();

		this.codeWin = Artery.pwin.Artery.plugin.SClassCodeTree.prototype.createWin({field:this});
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this);
		}
		if(this.closeBtn){
			this.closeBtn.on('click',function(){
					this.codeWin.hide();
					// 清空临时选择值
					delete this.valueTemp;
					delete this.valueTextTemp;}
					,this);
		}
		this.codeWin.on('hide', function(win) {
			this.clearTempValue();
			this.focus();
			this.validate();
			if(this.geditor){
				this.geditor.allowBlur = false;
				this.geditor.completeEdit();
			}
		}, this);
	},
	
	// 切换选择节点时调用
	onCheckchange: function(node, checked) {
		var a = node.attributes;
		this.valueTextTemp = a.text;
		this.valueTemp = a.cid;
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
Ext.override(Artery.plugin.SClassCodeTree, Artery.plugin.faClassCodeFunc);
Ext.reg('apSClassCodeTree', Artery.plugin.SClassCodeTree);

/**
 * 多选MClassCodeTree
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.MClassCodeTree = Ext.extend(Artery.plugin.TwinTriggerField, {

	// 组织机构数据
	codeStore : null,

	// 组织机构树对象
	codeTree : null,

	// 组织机构窗口对象
	codeWin : null,

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
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.MClassCodeTree.superclass.initComponent.call(this);
		if (!this.codeStore) {
			this.codeStore = new Artery.pwin.Ext.data.SimpleStore({
				fields : ['id', 'name', 'pinyin'],
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
			}catch(e){}
			try{
				if(this.codeWin){
					this.codeWin.destroy();
					this.codeWin = null;
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
				if(this.closeBtn){
					this.closeBtn.destroy();
					this.closeBtn = null;
				}
			}catch(e){}
			try{
				this.root = null;
			}catch(e){}
		},this)
	},
	
	submitValue: function(){
		var val = [], valText = [],valPinyin=[];
		this.codeStore.each(function(record) {
			val[val.length] = record.get('id');
			valText[valText.length] = record.get('name');
			if(record.get('pinyin')!= null){
				valPinyin[valPinyin.length] = record.get('pinyin');
			}
		}, this);
		var ov = this.getValue();
		var separator = Artery.getMultiSelectSeparator();
		this.value = val.join(separator);
		this.valueText = valText.join(separator);
		this.valuePinyin = valPinyin.join(separator);
		this.setValue(this.value, this.valueText);
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		// 需要设置值后在关闭
		this.codeWin.hide();
		this.fireEvent('change',this,this.value, ov);
	},
	
	clearTempValue: function(){
		this.codeStore.loadData(this.getStoreData());
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

	setValue : function(v, vt,triggerChange) {
		var ov = this.getValue();
		v = Artery.getCommaSplitValue(v);
		vt = Artery.getCommaSplitValue(vt);
		Artery.plugin.MClassCodeTree.superclass.setValue.call(this, v, vt);
		this.codeStore.loadData(this.getStoreData());
		if(triggerChange === true && v!=ov){
			this.fireEvent('change', this, v, ov);
		}
	},

	onTrigger2Click : function() {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.codeWin == null) {
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
					this.initClassCodeWin();
					this.showCodeWin();
				},
				params : paramObj,
				scope : this
			});
		} else {
			this.showCodeWin();
		}
	},
	
	// 显示代码窗口
	showCodeWin: function(){
		this.codeWin.show();
		if(this.geditor){
			this.geditor.allowBlur = true;
		}
		// 确认每个节点的选中状态
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
	
	getItemId: Artery.plugin.PopupTrigger.prototype.getItemId,

	createTreePanel : function(cfg){
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

		var uuid = Ext.id(); 
		var cTree = new Ext.tree.TreePanel({			
			region : 'center',
			autoScroll : true,
			animate : false,
			enableDD : false,
			border : false,
			bbar: barConf,
			style : 'background-color:#fff;',
			loader : new Artery.pwin.Ext.tree.TreeLoader({
				baseAttrs : {
					uuid : uuid
				},
				dataUrl : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadClassCodeTree"
			})
		})
		return cTree;	
	},
	createRootNode : function(cfg){
		var rootConf = {
			text : cfg.rootName,
			draggable : false,
			cid : cfg.cid
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
		this.root = Artery.pwin.Artery.plugin.MClassCodeTree.prototype.createRootNode({
			text : this.rootName,
			cid : this.rootId
		});
		this.codeTree.setRootNode(this.root);
	},
	createWin : function(cfg){
		try{
			if(cfg.field.okBtn){
				cfg.field.okBtn.destroy();
			}
			if(cfg.field.closeBtn){
				cfg.field.closeBtn.destroy();
			}
		}catch(e){}
		
		cfg.field.okBtn = new Ext.Button({
			text:'确定'
		});
		cfg.field.closeBtn = new Ext.Button({
			text:'关闭'
		});
		
		var cWin = new Artery.pwin.Ext.Window({
			layout : 'border',
			width : 300,
			height : 400,
			closeAction : 'hide',
			plain : true,
			modal:true,
			shadow :false,
			resizable:false,
			items : [cfg.field.codeTree],
			buttons : [cfg.field.okBtn, cfg.field.closeBtn]
		});
		return cWin;
	},
	// 初始化窗口
	initClassCodeWin : function() {
		this.codeTree = Artery.pwin.Artery.plugin.MClassCodeTree.prototype.createTreePanel({field:this});
		if(this.searchField){
			this.searchField.on('keydown',function(field, e){
				if (e.getKey() == Ext.EventObject.ENTER) {
				    this.searchCode();
				}
			}
			,this);
		}
		if(this.searchBtn){
			this.searchBtn.on('click',function(){
				this.searchCode();
			},this)
		}
		this.codeTree.on("append", this.onAppendNode, this);
		this.codeTree.on("checkchange", this.onCheckchange, this);
		this.codeTree.on("beforeload", this.onBeforeload, this);

		// 设置根节点
		this.initRootNode();
		this.root.expand();

		this.codeWin = Artery.pwin.Artery.plugin.MClassCodeTree.prototype.createWin({field:this});
		if(this.okBtn){
			this.okBtn.on('click',this.submitValue,this);
		}
		if(this.closeBtn){
			this.closeBtn.on('click',function(){this.codeWin.hide();},this);
		}
		this.codeWin.on('hide', function(win) {
			this.clearTempValue();
			this.focus();
			this.validate();
			if(this.geditor){
				this.geditor.allowBlur = false;
				this.geditor.completeEdit();
			}
		}, this);
	},
	
	// 加载节点后调用
	onAppendNode: function(tree,pn,n,idx){
		if(this.codeStore.getById(n.attributes.cid)!=null){
			if(n.attributes.checked!==undefined){
				n.attributes.checked = true;
			}
		}
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
			loader.baseParams.moreProp = "MTree";
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
Ext.override(Artery.plugin.MClassCodeTree, Artery.plugin.faClassCodeFunc);
Ext.reg('apMClassCodeTree', Artery.plugin.MClassCodeTree);