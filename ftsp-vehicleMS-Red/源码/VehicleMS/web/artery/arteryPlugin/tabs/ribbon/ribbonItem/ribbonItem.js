/**
 * RibbonItem
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.RibbonItem = Ext.extend(Artery.plugin.BaseComponent,{
	
	pItemId:null,
	
	active:false,
	
	themeName:null,
	
	ribbonBody:null,
	
	ribbonMore:null,
	
	ribbonMoreCellEl:null,
	
	ribbonMoreCellBodyEl:null,
	
	ribbonMoreTextEl:null,
	
	ribbonMoreBody:null,
	
	onClickEvent:null,
	
	initComponent: function(){
		Artery.plugin.RibbonItem.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        this.ribbonBody = Ext.get(this.id + "_ribbonBody");
        this.ribbonMore = Ext.get(this.id + "MoreMenuGroup");
        this.ribbonMoreCellEl = this.ribbonMore.child('.x-ribbon-cell');
        this.ribbonMoreTextEl = this.ribbonMore.child('.x-ribbon-cell-text');
        this.ribbonMoreTextEl.update('更多')
        this.ribbonMoreCellBodyEl = this.ribbonMore.child('.x-ribbon-cell-body');
        if(this.themeName){
        	this.ribbonMore.addClass('x-group-more-'+ this.themeName);
        }else{
        	this.ribbonMore.addClass('x-group-more');
        }
        this.ribbonMoreBody = Ext.get(this.id + "_more_body");
        this.el.addClassOnOver('x-ribbon-item-over');
        Artery.plugin.RibbonItem.superclass.onRender.call(this, ct, position);
        this.el.on('click',function(item){
	        Artery.get(this.pItemId).fireEvent('active',this);
	        if(this.onClickEvent){
	        	Artery.regItemEvent(this,'onClickEvent','onClickServer');
	        }
        },this);
        this.el.on('dblclick',function(item){
        	Artery.get(this.pItemId).toggle();
        },this);
        this.ribbonMore.on('click',function(item){
        	this.onRibbonMoreClick();
        },this);

		// 计算每个group的实际宽度
		this.ribbonBody.setWidth(10000);
		var i = 0;
		var length = this.items.length - 1;
		for (; i < length; i++) {
			var group = Artery.get(this.items[i].id);
			group.elWidth = group.el.getWidth();
		}
		this.ribbonBody.setWidth("auto");

        this.pack();
        Ext.EventManager.onWindowResize(function(){
        	this.pack();
        },this);
    },
    
    onRibbonMoreClick: function(){
    	this.showMenu();
    },
    
    showMenu:function(){
    	if(!this.menu){
    		this.createMenu();
    	}
    	this.menu.show(this.ribbonMoreCellEl,'tl-bl?');
    	this.menu.hide();
    	this.menu.setWidth(this.ribbonMoreBody.getWidth());
    	this.menu.show(this.ribbonMoreCellEl,'tl-bl?');
    	this.menu.setWidth(this.ribbonMoreBody.getWidth());
    	// 弹出菜单宽度大于窗口宽度，出滚动条
    	var w = this.menu.ul.getWidth();
    	var cw = Ext.getBody().getWidth();
    	if (w - cw > 10) {
    		this.menu.el.setStyle("overflow-x","auto");
    		this.menu.setWidth(cw - 10);
    		this.menu.ul.setWidth(w);
    		if (!this.menu.height4Scroll) {
    			this.menu.height4Scroll = this.menu.getHeight() + 17;
    		}
    		this.menu.setHeight(this.menu.height4Scroll);
    	}
    },
    
    createMenu: function(){
    	this.menu = new Ext.menu.Menu({
    		plain:true,
    		minWidth :10,
    		cls:this.themeName?'x-theme-ribbonArea-'+this.themeName + ' x-menu-ribbon-' + this.themeName:'',
    		defaultOffsets:[0,10],
    		items : [{
    			xtype:'panel',
    			border:false,
    			bodyStyle:'background-color:transparent;',
    			contentEl:this.id + "_more_body"
    		}]
    	});
    },
    
    updateMore: function(cell){
    	this.ribbonMoreCellEl.removeClass('x-ribbon-cell-active');
    	if(Artery.get(cell.ribbonGroupId).showInMenu){
	    	//this.ribbonMoreTextEl.update(cell.ribbonTextEl.dom.innerHTML);
	    	//this.ribbonMoreCellBodyEl.setStyle('width',cell.ribbonCellBodyEl.getWidth() + 10);
	    	this.ribbonMoreCellEl.addClass('x-ribbon-cell-active');
    	}
    },
    
    pack:function(){
    	var itemWidth = this.ribbonBody.getWidth();
    	//alert(itemWidth)
    	var groupTotalWidth = 0;
    	var i=0;
    	var length = this.items.length-1;
    	if(length==0){
    		return;
    	}
    	for(;i< length;i++){
    		var group = Artery.get(this.items[i].id);
    		if(group.showInMenu){
    			group.el.insertBefore(this.ribbonMore);
    			group.showInMenu = false;
    		}
    		groupTotalWidth += group.elWidth;
    		if(groupTotalWidth >= itemWidth){
    			if(groupTotalWidth - group.elWidth + 80 > itemWidth){
    				i--;
    			}
    			break;
    		}
    	}
    	if(length>i){
    		this.ribbonMore.show();
    	}else{
    		this.ribbonMore.hide();
    	}
    	for(;length>i && length>=1 ;length--){
    		var group = Artery.get(this.items[length-1].id);
    		if(!group.showInMenu){
	    		this.ribbonMoreBody.insertFirst(group.id);
    			group.showInMenu = true;
    		}
    	}
    },
   
    select : function(){
    	this.el.addClass("x-ribbon-item-active");
    	this.active = true;
    	this.ribbonBody.removeClass('x-hidden');
    	this.pack();
    },
    
    deselect: function(){
    	this.el.removeClass("x-ribbon-item-active");
    	this.active = false;
    	this.ribbonBody.addClass('x-hidden');
    }
    //怎么获取值

    
    
})

Ext.reg('apRibbonItem', Artery.plugin.RibbonItem);