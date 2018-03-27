/**
 * RibbonArea
 * 
 * @author baon
 * @date 12/05/2010
 */
Artery.plugin.RibbonArea = Ext.extend(Artery.plugin.BaseContainer,{
	
	layout:'auto',
	
	activePanel:null,
	
	activeCell:null,
	
	ribbonBody:null,
	
	ribbonCollapsebar:null,
	
	expanded:true,
	
	themeName:null,
	
	initComponent: function(){
		this.addEvents('active');
		Artery.plugin.RibbonArea.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.RibbonArea.superclass.onRender.call(this, ct, position);
        this.ribbonBody = this.el.child('.x-ribbon-body');
        this.ribbonCollapsebar = this.el.child('.x-ribbon-collapsebar');
        if(this.ribbonCollapsebar){
        	this.ribbonCollapsebar.addClassOnOver('x-ribbon-collapsebar-over');
        }
        this.initEvents();
    },
    
    initEvents: function(){
    	this.on('active',function(item){
    		if(this.getActivePanel().id != item.id){
	    		this.getActivePanel().deselect();
	    		this.activePanel = item;
	    		item.select();
    		}
    	},this);
    	if(this.ribbonCollapsebar){
	    	this.ribbonCollapsebar.on('click',function(){
	    		this.toggle();
	    	},this);
    	}
    },
    
    activeRibbon: function(id){
    	this.fireEvent('active',Artery.get(id));
    },
    
    getActivePanel: function(){
    	if(!this.activePanel){
    		this.activePanel = this.items.find(function(item,idx){
    			if(item.active){
    				return true;
    			}
    		},this)
    	}
    	return this.activePanel;
    },
    
    toggle: function(){
    	if(this.expanded){
    		this.collpase();
    	}else{
    		this.expand();
    	}
    },
     
    collpase : function() {
		if (this.ribbonCollapsebar) {
			var arrow = this.ribbonCollapsebar.child('.x-ribbon-collapsebar-arrow');
			arrow.addClass('x-ribbon-collapsebar-arrow-expand');
		}
		this.ribbonBody.addClass('x-hidden');
		this.expanded = false;
		Ext.EventManager.fireResize();
	},

	expand : function() {
		if (this.ribbonCollapsebar) {
			var arrow = this.ribbonCollapsebar.child('.x-ribbon-collapsebar-arrow');
			arrow.removeClass('x-ribbon-collapsebar-arrow-expand');
		}
		this.ribbonBody.removeClass('x-hidden');
		this.expanded = true;
		Ext.EventManager.fireResize();
	},

    getActiveCell :function(){
    	return this.activeCell;
    }
    
})

Ext.reg('apRibbonArea', Artery.plugin.RibbonArea);