/**
 * 静态列表导航
 * 
 * @author weijx
 * @date 2009-07-20
 */
Artery.plugin.ListNav = Ext.extend(Artery.plugin.BasePanel, {
	
	autoScroll: true,
	border: false,
	layout: "aplistnavlayout",
	
	navTableEl:null,
	
	expandMode:null,
	
	initComponent : function(){
		this.layoutConfig = {
			expandNode: this.expandNode,
			expandMode: this.expandMode,
			expandTree: this.expandList
		};
        Artery.plugin.ListNav.superclass.initComponent.call(this);
    },
    
    onRender: function(ct,pos){
    	Artery.plugin.ListNav.superclass.onRender.call(this,ct,pos);
    	this.navTableEl = this.el.child('.nav-table');
    },
    
    getActiveItem: function(){
    	return this.layout.activeItem;
    },
    
    deselect: function(){
    	var activeItem = this.getActiveItem();
    	if(activeItem){
    		activeItem.deselect();
		}
    },
    
    select: function(itemid){
		Artery.plugin.ListItemMgr.toggle(Artery.get(itemid));
    },

	// 展开itemid节点
	expand: function(itemid) {
		var item = Artery.get(itemid);
		var items = new Array();
		while("apListCatalog" == item.xtype || "apListItem" == item.xtype) {
			items.push(item);
			item = item.ownerCt;
		}
		if (item !== this) { // itemid不是当前listNav下的节点
			return;
		}
		item = items.pop();
		while (item !== undefined) {
			if ("apListCatalog" == item.xtype) {
				item.header.dom.click();
			}
			if ("apListItem" == item.xtype) {
				item.el.dom.click();
			}
			item = items.pop();
		}
	}
});
Ext.reg('apListNav', Artery.plugin.ListNav);

/**
 * 列表导航操作项
 * 
 * @class Artery.plugin.NavItem
 * @extends Ext.Component
 */
Artery.plugin.ListItem = Ext.extend(Ext.Component, {
	
	listItem:true,
	
	onDeselectEvent:null,
	
	navGroup:null,
	
	onRender: function(ct, pos){
        this.el = Ext.get(this.id);
        this.el.on("click", this.onClick, this);
        Artery.plugin.ListItemMgr.register(this);
        this.el.addClassOnOver("nav-item-over");
	},
	
	getSelectEl: function(){
		return this.el;
	},
	onClick: function(){
		Artery.plugin.ListItemMgr.toggle(this);
		if(this.linktoEvent){
			Artery.openForm(this.linktoEvent);
		}
		if(this.clickEvent){
			this.clickEvent();
		}
	},
	deselect: function(){
		this.getSelectEl().removeClass("nav-item-selected");
		this.hideSep();
		if(this.onDeselectEvent){
			Artery.regItemEvent(this,'onDeselectEvent','onDeselectServer');
		}
	},
	hideSep: function(){
	   	if(this.tipSupport){
	   	   var sep = Ext.get(this.navGroup + "_sep");
	       sep.hide();
	   	}
    },
    select: function(){
    	this.getSelectEl().addClass("nav-item-selected");
        this.showSep();
    },
    showSep:function(){
   	   if(this.tipSupport){
	   	   var sep = Ext.get(this.navGroup + "_sep");
	       sep.show();
	       sep.alignTo(this.el,'tl-tr',[-1,0]);
   	   }
   },
   hide:function(){   		
   		this.el.parent("tr").setDisplayed(false);
   },
   
   show:function(){
   		this.el.parent("tr").setDisplayed(true);
   }
});

Ext.reg('apListItem', Artery.plugin.ListItem);

/**
 * 导航项集合panel
 * 
 * @author weijx
 * @date 2008-12-10
 */
Artery.plugin.ListCatalog = Ext.extend(Artery.plugin.BasePanel, {
	
	collapsible: true,
	
	titleCollapse: false,
	
	layout:'atylayout',
	
	onlyGroup:false,
	
	animCollapse :false,
	
	pItemId:null,
	
	navGroup:null,
	
	initComponent : function(){
		if(this.onlyGroup){
			this.collapsible = false;
		}else if(!this.navGroup){
			// 不是listNav的直接子节点，则点击标题就可以折叠
			this.titleCollapse = true;
		}
		Artery.plugin.ListCatalog.superclass.initComponent.call(this);
	},
	
	afterExpand : function(){
		Artery.plugin.ListCatalog.superclass.afterExpand.call(this);
		var pNav = Artery.get(this.pItemId);
		if(pNav != null && pNav.expandMode == 'fillExpand'){
			this.el.parent().dom.style.height='100%';
			pNav.navTableEl.dom.style.height='100%';
		}
	},
	
    afterCollapse : function(){
    	// 使collapseEL隐藏
    	this[this.collapseEl].setStyle("display", "none");
    	Artery.plugin.ListCatalog.superclass.afterCollapse.call(this);
    	var pNav = Artery.get(this.pItemId);
		if(pNav != null && pNav.expandMode == 'fillExpand'){
			this.el.parent().dom.style.height='';
			pNav.navTableEl.dom.style.height='';
		}
    },

    render : function(){
        Ext.Container.superclass.render.apply(this, arguments);
        if(this.layout){
            if(Ext.isObject(this.layout) && !this.layout.layout){
                this.layoutConfig = this.layout;
                this.layout = this.layoutConfig.type;
            }
            if(typeof this.layout == 'string'){
                this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
            }
            this.setLayout(this.layout);

            if(this.activeItem !== undefined){
                var item = this.activeItem;
                delete this.activeItem;
                this.layout.setActiveItem(item);
            }
        }
        // 去掉ownerCt判断，强制执行doLayout方法
        //if(!this.ownerCt){
            // force a layout if no ownerCt is set
            this.doLayout(false, true);
        //}
        if(this.monitorResize === true){
            Ext.EventManager.onWindowResize(this.doLayout, this, [false]);
        }
    },

    afterRender : function(){
    	Artery.plugin.ListCatalog.superclass.afterRender.call(this);
    	if(this.onlyGroup){
    		return;
    	}
    	// 有nagGroup才需要往ListItemMgr中注册
    	if(this.navGroup){
    		Artery.plugin.ListItemMgr.register(this);
    		if(this.header){
    			this.header.on("click",function(){
    				Artery.plugin.ListItemMgr.toggle(this);
    			},this);
    			this.header.addClassOnOver("nav-item-over");
    			this.header.addClassOnOver("nav-item-head-over");
    		}
    	}
    	if(this.onClickClient){
    	   	this.el.on("click", this.onClick, this);
    	}
    },
    
    getSelectEl: function(){
		return this.header;
	},
	
    onClick: function(){
		Artery.regItemEvent(this,'onClickClient','onClickServer',null);
	},
	
	// 当点击列表导航中的其他项时，会调用此方法
	deselect: function(){
		if(this.getSelectEl()){
			if(this.getSelectEl().hasClass('nav-item-selected')){
				this.getSelectEl().removeClass("nav-item-selected");
				this.getSelectEl().removeClass("nav-item-head-selected");
				if(this.onDeselectEvent){
					Artery.regItemEvent(this,'onDeselectEvent','onDeselectServer');
				}
			}
		}
		
		var ly = Artery.get(this.navGroup).getLayout();
		var activeItem = ly.activeItem;
		if(activeItem && !this.isChild(this,activeItem)){//&&!activeItem.listItem
			if(ly.expandMode=="multeExpand"){
				// 可展开多个catalog
			}else{
				this.collapse();
			}
		}
	},
	select: function(){
		if(this.getSelectEl()){
			this.getSelectEl().addClass("nav-item-selected");
			this.getSelectEl().addClass("nav-item-head-selected");
			if(this.collapsed){
		       	this.expand();
	       	}else{
	       		this.collapse();
	       	}
		}else{
			this.expand();
		}
	},
	isChild:function(parent,child){
		var res = false;
		if(child && parent){
			if(parent.items){
				for(var i=0; i<parent.items.length;i++){
					res = this.isChild(parent.items.get(i),child);
					if(res)
						break;
				}
			}else if(parent.listItem){
				if(parent.id==child.id)
					res= true;
			}
		}
		return res;
	}
});

Ext.reg('apListCatalog', Artery.plugin.ListCatalog);

/**
 * 导航布局
 */
Artery.plugin.ListNavLayout = Ext.extend(Ext.layout.ContainerLayout, {

	// 展开的节点
	expandNode: null,
	// 展开模式
	expandMode: "singleExpand",
	// 展开导航树
	expandTree: true,
	
	renderAll : function(ct, target){
		var pCatalog = null;
		var selItem = null;
		// 查找展开的节点
		if(this.expandNode){
	        var items = ct.items.items;
	        for(var i = 0, len = items.length; i < len; i++) {
	            var c = items[i];
	            if(c.getId()==this.expandNode){
        				selItem = c;
	            		break;   
	            }
	            if(c.xtype == "apListCatalog" && c.items && c.items.items){
	            	var subItems = c.items.items;
	            	for(var j = 0; j<subItems.length; j++) {
	            		if(subItems[j].getId() == this.expandNode){
	            			selItem = subItems[j];
	            			pCatalog = c;
	            			break; 
	            		}
	            	}
	            	if(selItem){
	            		break; 
	            	}
	            }
	        }
		}
		Artery.plugin.ListNavLayout.superclass.renderAll.apply(this, arguments);
		if(pCatalog){
			pCatalog.expand();
		}
		if(selItem || this.activeItem){
			Artery.plugin.ListItemMgr.toggle(selItem||this.activeItem);
		}
    },
	
    renderItem : function(c){
    	if(this.expandTree){
	    	if(this.expandMode=="singleExpand" || this.expandMode=="fillExpand"){
		        if(!this.activeItem && !c.listItem){
		        	c.collapsed = true;
		            this.activeItem = c;
		        }else if(this.activeItem && this.activeItem!=c){
		            c.collapsed = true;
		        }
	    	}
    	}else{
    		c.collapsed = true;
    	}
    	//如果列表导航分类按钮中不包括子节点，则将该按钮设置为不可下拉，另外可以在此处判断按钮显示样式。
    	if(c.onlyGroup || !c.items){
    		c.collapsible = false;
    		c.collapsed = false;
    	}
    	var tar = Ext.getDom(c.id).parentNode;
        Artery.plugin.ListNavLayout.superclass.renderItem.apply(this, [c, null, tar]);
    }
});
Ext.Container.LAYOUTS['aplistnavlayout'] = Artery.plugin.ListNavLayout;

/**
 * 用于支持节点选中切换
 */
Artery.plugin.ListItemMgr = function(){
   var groups = {};

	function toggleGroup(nav){
		if((!Artery.get(nav.navGroup).onlyItem && "apListCatalog"==nav.xtype)
			|| "apListItem"==nav.xtype
			|| nav==Artery.get(nav.navGroup).getLayout().activeItem){
			Artery.get(nav.navGroup).getLayout().activeItem = nav;
			var g = groups[nav.navGroup];
			if(!(g && g.length)){
				return;
			}
			for(var i = 0, l = g.length; i < l; i++){
				g[i].deselect();
			}
		}
		nav.select();
	}

   return {
       register : function(nav){
           if(!nav.navGroup){
               return;
           }
           var g = groups[nav.navGroup];
           if(!g){
               g = groups[nav.navGroup] = [];
           }
           g.push(nav);
       },

       unregister : function(nav){
           if(!nav.navGroup){
               return;
           }
           var g = groups[nav.navGroup];
           if(g){
               g.remove(nav);
           }
       },
       
       toggle: function(nav){
       	toggleGroup(nav);
       }
   };
}();