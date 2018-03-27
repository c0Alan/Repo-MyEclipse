/**
 * NavTabItem
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.NavTabItem = Ext.extend(Artery.plugin.BaseComponent,{
	
	pItemId:null,
	
	active:false,
	
	formUrl:null,
	
	operAreaId:null,
	
	value:null,
	
	bodyEl:null,
	
	textEl:null,
	
	first:null,
	
	last:null,
	
	title:null,
	
	initComponent: function(){
		Artery.plugin.NavTabItem.superclass.initComponent.call(this);
		this.operAreaId = Artery.get(this.pItemId).operAreaId;
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
    	this.bodyEl = Ext.get(this.id + "_body");
    	this.textEl = this.el.child('.x-grouptabs-text-inner');//
        Artery.plugin.NavTabItem.superclass.onRender.call(this, ct, position);
        this.el.on('click',function(item){
	        Artery.get(this.pItemId).fireEvent('active',this);
        	this.fireEvent('click',this);
	        if(this.formUrl){
	        	if(!Ext.isEmpty(this.operAreaId)){
	        		Ext.getDom(this.operAreaId + "_iframe").src=this.formUrl;
	        	}
	        }else{
				Artery.initSubItems(this);
			}
        },this);
        if(this.active && Artery.get(this.pItemId).activeTabItem){
        	this.el.dom.click();
        }
    },
    
    click: function(){
    	this.el.dom.click();
    },
    
    getValue: function(){
    	return this.value;
    },
    setValue: function(newValue){
    	this.value = newValue;
    },
    
    select : function(){
    	this.el.addClass("x-grouptabs-strip-active");
    	if(this.first){
    		this.el.addClass("x-grouptabs-strip-active-first");	
    	}else{
    		this.el.removeClass("x-grouptabs-strip-active-first");	
    	}
    	if(this.last){
    		this.el.addClass("x-grouptabs-strip-active-last");	
    	}else{
    		this.el.removeClass("x-grouptabs-strip-active-last");	
    	}
    	this.active = true;
    	if(this.bodyEl){
    		this.bodyEl.setDisplayed(true);
    	}
    },
    
    deselect: function(){
    	this.el.removeClass("x-grouptabs-strip-active");
    	if(this.first){
    		this.el.removeClass("x-grouptabs-strip-active-first");	
    	}
    	if(this.last){
    		this.el.removeClass("x-grouptabs-strip-active-last");	
    	}
    	this.active = false;
    	if(this.bodyEl){
    		this.bodyEl.setDisplayed(false);
    	}
    },
    //更新title
    setTitle : function(newTitle){
        this.title = newTitle;
        this.textEl.update(newTitle);
    },

    getTitle : function(){
    	return this.title;
    }
});

Ext.reg('apNavTabItem', Artery.plugin.NavTabItem);