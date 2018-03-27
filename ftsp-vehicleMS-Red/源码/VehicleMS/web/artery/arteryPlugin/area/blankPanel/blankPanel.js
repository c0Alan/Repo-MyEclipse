var blankPanelToggleContainer = [];

/**
 * Artery BlankPanel component
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.BlankPanel = Ext.extend(Artery.plugin.BasePanel, {
	
	onClickEvent:null,
	onDbClickEvent:null,
	onMouseOverEvent:null,
	onMouseOutEvent:null,
	onSelectEvent:null,
	onDeselectEvent:null,
	
	selected:false,
	toggleGroup:null,//控件所属的分组，同一个分组中的控件只会有一个选中
	
	formAreaId:null,//如果空面板在formArea中，会生成formArea的id，则添加删除组件时会同步更新formArea的Field
	moreBtnEl:null,//更多按钮
	moreCntEl:null,//更多容器
	collapseStateName:null,
	expandStateName:null,
	
	initComponent: function(){
		Artery.plugin.BlankPanel.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	Artery.plugin.BlankPanel.superclass.onRender.call(this,ct, position);
    	this.el.on('mouseenter',function(e){
    		Artery.regItemEvent(this,'onMouseOverEvent','onMouseOverServer');
    	},this);
    	this.el.on('mouseleave',function(e){
    		Artery.regItemEvent(this,'onMouseOutEvent','onMouseOutServer');
    	},this);
    	this.el.on('click',function(e){
    		this.click();
    	},this);
    	this.el.on('dblclick',function(e){
    		Artery.regItemEvent(this,'onDbClickEvent','onDbClickServer');
    	},this);
    	this.initMoreContainer();
    },
    
    initMoreContainer: function(){
    	this.moreBtnEl = Ext.get(this.id + "MoreBtn");
    	if(this.moreBtnEl){
    		this.moreCntEl = Ext.get(this.id + "MoreCnt");
    		this.moreBtnEl.on("click",function(){
    			if(this.moreCntEl.isVisible()){
    				this.moreCntEl.setDisplayed(false);
    				this.moreBtnEl.update(this.collapseStateName);
    			}else{
    				this.moreCntEl.setDisplayed(true);
    				this.moreBtnEl.update(this.expandStateName);
    			}
    		},this);
    	}
    },
    
    click: function(){
    	if(!this.selected){
    		this.select();
		}
		this.fireEvent('click',this);
    },
    
    select: function(){
    	Artery.regItemEvent(this,'onSelectEvent','onSelectServer');
		this.selected = true;
		if(!Ext.isEmpty(this.toggleGroup)){
			var toggleItem = blankPanelToggleContainer[this.toggleGroup];
			if(toggleItem != null){
				toggleItem.onDeselect();
			}
			blankPanelToggleContainer[this.toggleGroup] = this;
		}
    },
    
    deselect: function(){
    	this.onDeselect();
    },
    
    onDeselect: function(){
    	Artery.regItemEvent(this,'onDeselectEvent','onDeselectServer');
    	this.selected = false;
    },
    
	//增加组件
	addItem: function(cfg,where){
		if(where == null || where == 'end'){
			where = 'beforeEnd';
		}else{
			where = 'afterBegin';
		}
		//html
		Ext.DomHelper.insertHtml(where,this.body.dom,cfg.html);
		var me = this;
		if(cfg.imports){
			Artery.addImports(cfg.imports,function(){
				eval(cfg.script);
				var newItem = eval(cfg.initItemId);
				me.getCfgItems().add(newItem.id,newItem);
				me.refreshFormAreaFields();
			});
		}else{
		    eval(cfg.script);
		    var newItem = eval(cfg.initItemId);
		    me.getCfgItems().add(newItem.id,newItem);
		    me.refreshFormAreaFields();
		}
		
		
	},
	
	//移除组件
	removeItem: function(id){
		var el = Ext.get(id);
		Artery.cascadeDestroy(el);
		el.remove();
		this.getCfgItems().removeKey(id);
		this.refreshFormAreaFields();
	},
	
	//清除本控件下所有子组件
	removeAll: function(){
		var childEl = this.body.first();
		while(childEl){
			var del = childEl;
			childEl = childEl.next();
			Artery.cascadeDestroy(del);
			del.remove();
		}
		this.getCfgItems().clear();
		this.refreshFormAreaFields();
	},
	
	refreshFormAreaFields:function(){
		if(this.formAreaId){
			Artery.get(this.formAreaId).initFields();
		}
	}
	
	// override
	//当空面板的父控件是formArea的时候，为了调用hide的时候将label一起隐藏
//	getVisibiltyEl : function() {
//		//return this.hideParent ? this.container : this.getActionEl();
//		if(this.formAreaId) {
//			var ctn = this.el.findParentNode('td.x-form-td-cust', 5, true);
//			if (!Ext.isEmpty(ctn)) {
//				return ctn;
//			}
//		}
//		return this.getActionEl();
//	}
})

Ext.reg('apBlankPanel', Artery.plugin.BlankPanel);

/**
 * Artery Blank container
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.BlankContainer = Ext.extend(Artery.plugin.BaseContainer, {
	
	onDbClickEvent:null,
	onMouseOverEvent:null,
	onMouseOutEvent:null,
	onSelectEvent:null,
	onDeselectEvent:null,
	
	selected:false,
	toggleGroup:null,//控件所属的分组，同一个分组中的控件只会有一个选中
	
	formAreaId:null,//如果空面板在formArea中，会生成formArea的id，则添加删除组件时会同步更新formArea的Field
	moreBtnEl:null,//更多按钮
	moreCntEl:null,//更多容器
	collapseStateName:null,
	expandStateName:null,
	
	initComponent: function(){
		Artery.plugin.BlankContainer.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	Artery.plugin.BlankContainer.superclass.onRender.call(this,ct, position);
    	this.el.on('mouseenter',function(e){
    		Artery.regItemEvent(this,'onMouseOverEvent','onMouseOverServer');
    	},this);
    	this.el.on('mouseleave',function(e){
    		Artery.regItemEvent(this,'onMouseOutEvent','onMouseOutServer');
    	},this);
    	this.el.on('click',function(e){
    		this.click();
    	},this);
    	this.el.on('dblclick',function(e){
    		Artery.regItemEvent(this,'onDbClickEvent','onDbClickServer');
    	},this);
    	this.initMoreContainer();
    },
    
    initMoreContainer: function(){
    	this.moreBtnEl = Ext.get(this.id + "MoreBtn");
    	if(this.moreBtnEl){
    		this.moreCntEl = Ext.get(this.id + "MoreCnt");
    		this.moreBtnEl.on("click",function(){
    			if(this.moreCntEl.isVisible()){
    				this.moreCntEl.setDisplayed(false);
    				this.moreBtnEl.update(this.collapseStateName);
    			}else{
    				this.moreCntEl.setDisplayed(true);
    				this.moreBtnEl.update(this.expandStateName);
    			}
    		},this);
    	}
    },
    click: function(){
    	if(!this.selected){
    		this.select();
		}
		this.fireEvent('click',this);
    },
    
    select: function(){
    	Artery.regItemEvent(this,'onSelectEvent','onSelectServer');
		this.selected = true;
		if(!Ext.isEmpty(this.toggleGroup)){
			var toggleItem = blankPanelToggleContainer[this.toggleGroup];
			if(toggleItem != null){
				toggleItem.onDeselect();
			}
			blankPanelToggleContainer[this.toggleGroup] = this;
		}
    },
    
    deselect: function(){
    	this.onDeselect();
    },
    
    onDeselect: function(){
    	Artery.regItemEvent(this,'onDeselectEvent','onDeselectServer');
    	this.selected = false;
    },
    
	//增加组件
	addItem: function(cfg,where){
		if(where == null || where == 'end'){
			where = 'beforeEnd';
		}else{
			where = 'afterBegin';
		}
		//html
		Ext.DomHelper.insertHtml(where,this.el.dom,cfg.html);
		
		var me = this;
		//js
		if(cfg.imports){
			Artery.addImports(cfg.imports,function(){
				eval(cfg.script);
				var newItem = eval(cfg.initItemId);
				me.getCfgItems().add(newItem.id,newItem);
				me.refreshFormAreaFields();
			});
		}else{
			eval(cfg.script);
			var newItem = eval(cfg.initItemId);
			me.getCfgItems().add(newItem.id,newItem);
			me.refreshFormAreaFields();
		}
	},
	//移除组件
	removeItem: function(id){
		var el = Ext.get(id);
		Artery.cascadeDestroy(el);
		el.remove();
		this.getCfgItems().removeKey(id);
		this.refreshFormAreaFields();
	},
	//清除本控件下所有子组件
	removeAll: function(){
		var childEl = this.el.first();
		while(childEl){
			var del = childEl;
			childEl = childEl.next();
			Artery.cascadeDestroy(del);
			del.remove();
		}
		this.getCfgItems().clear();
		this.refreshFormAreaFields();
	},
	
	refreshFormAreaFields:function(){
		if(this.formAreaId){
			Artery.get(this.formAreaId).initFields();
		}
	}
	
	// override
	//当空面板的父控件是formArea的时候，为了调用hide的时候将label一起隐藏
//	getVisibiltyEl : function() {
//		//return this.hideParent ? this.container : this.getActionEl();
//		if(this.formAreaId) {
//			var ctn = this.el.findParentNode('td.x-form-td-cust', 5, true);
//			if (!Ext.isEmpty(ctn)) {
//				return ctn;
//			}
//		}
//		return this.getActionEl();
//	}
})

Ext.reg('apBlankContainer', Artery.plugin.BlankContainer);