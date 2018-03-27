/**
 * NavTabArea
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.NavTabArea = Ext.extend(Artery.plugin.BaseContainer,{
	
	layout:'atylayout',
	
	activePanel:null,
	
	activeTabItem:false,//默认激活页签
	
	initComponent: function(){
		this.addEvents('active');
		Artery.plugin.NavTabArea.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.NavTabArea.superclass.onRender.call(this, ct, position);
        this.initEvents();
    },
    
    initEvents: function(){
    	this.on('active',function(item){
    		var ap = this.getActivePanel();
    		if(ap){
	    		ap.deselect();
    		}
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
    }
})

Ext.reg('apNavTabArea', Artery.plugin.NavTabArea);