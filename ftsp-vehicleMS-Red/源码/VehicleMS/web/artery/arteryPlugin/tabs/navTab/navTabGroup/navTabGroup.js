/**
 * NavTabArea
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.NavTabGroup = Ext.extend(Artery.plugin.BasePanel,{
	
	layout:'auto',
	
	activePanel:null,
	
	activeTabItem:false,//默认激活页签
	
	collapsible:true,
	
	collapsed: null,
	
	initComponent: function(){
		this.addEvents('active');
		Artery.plugin.NavTabGroup.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.NavTabGroup.superclass.onRender.call(this, ct, position);
        this.initEvents();  
    },
    
    initEvents: function(){
    	this.on('active',function(item){
    		if(this.getActivePanel())
	    		this.getActivePanel().deselect();
    		this.activePanel = item;
    		item.select();
    	},this);
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
    
    getActiveValue: function(){
    	return this.getActivePanel().getValue();
    },
    

    afterCollapse : function(){
    	// 使collapseEL隐藏
    	this[this.collapseEl].setStyle("display", "none");
    	Artery.plugin.NavTabGroup.superclass.afterCollapse.call(this);
    },

    afterExpand : function(){
        this.collapsed = false;
        this.afterEffect();
//        if(this.deferLayout !== undefined){
//           this.doLayout(true);
//        }
        this.fireEvent('expand', this);
    }
})

Ext.reg('apNavTabGroup', Artery.plugin.NavTabGroup);