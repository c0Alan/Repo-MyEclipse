/**
 * 简单按钮，放在按钮区域
 * @author baon
 * @date 2009-07-20
 */
Artery.plugin.SimpleButton = Ext.extend(Artery.plugin.BaseComponent,{
	
	linkEl:null,
	
	toggleGroupId:null,
	
	icon:null,
	
	pressed:false,
    
    onRender : function(ct, position){
    	Artery.plugin.SimpleButton.superclass.onRender.call(this,ct, position);
        this.initButtonEl();
        if(this.pressed && this.toggleGroupId){
        	var group = Artery.get(this.toggleGroupId);
        	group.activeSimpleBtn = this;
        }
    },
    
    initButtonEl : function(){
		this.el.on('click', this.onClick, this);
    	
    	this.linkEl = this.el.child('.x-btn-simple-link');
    },
    
    //覆盖Ext.Component中的方法，将隐藏样式设置在按钮所在的TD上，而不是TABLE上
//    onHide : function(){
//    	var tdEl = this.getVisibiltyEl().findParent("td", 3, true);
//    	if(tdEl && tdEl != null){
//    		tdEl.addClass('x-hide-' + this.hideMode);
//    	}
//    },
    //覆盖Ext.Component中的方法，去除按钮所在的TD上的隐藏样式，而不是TABLE上
//    onShow : function(){
//        var tdEl = this.getVisibiltyEl().findParent("td", 3, true);
//    	if(tdEl && tdEl != null){
//    		tdEl.removeClass('x-hide-' + this.hideMode);
//    	}
//    },
    
    click: function(){
    	this.onClick();
    },
    onClick : function(e){
        if(e){
            e.stopEvent();
	        if(e.button != 0){
	            return;
	        }
        }
        if(!this.disabled){
            this.fireEvent("click", this, e);
        }
        if(this.toggleGroupId){
        	var group = Artery.get(this.toggleGroupId);
        	if(group.activeSimpleBtn){
        		group.activeSimpleBtn.unpresse();
        	}
        	group.activeSimpleBtn = this;
        }
        this.presse();
    },
    
    presse: function(){
    	this.linkEl.addClass('x-btn-pressed');
    },
    
    unpresse: function(){
    	this.linkEl.removeClass('x-btn-pressed');
    },
    
    setText: function(text){
    	var aEl = this.el.child("a");
    	aEl.dom.innerHTML = text;
    },
    isHidden : function(){
    	return this.hidden;
    },
    isDisabled : function(){
    	return this.disabled;
    },
    hideIcon: function(){
    	this.linkEl.setStyle('padding-left','0px');
    	this.linkEl.setStyle('padding-top','0px');
    	this.linkEl.setStyle('background-image','none');
    },
    showIcon: function(){
    	if(!Ext.isEmpty(this.icon)){
    		this.linkEl.setStyle('padding-left','20px');
    		this.linkEl.setStyle('padding-top','2px');
    		this.linkEl.setStyle('background-repeat','no-repeat');
    		this.linkEl.setStyle('background-image','url("' + sys.getContextPath() + this.icon+'")');
    	}
    },
    setIcon: function(imagePath){
    	this.icon = imagePath;
    	this.linkEl.setStyle('padding-left','20px');
    	this.linkEl.setStyle('padding-top','2px');
    	this.linkEl.setStyle('background-repeat','no-repeat');
    	this.linkEl.setStyle('background-image','url("' + sys.getContextPath() + imagePath +'")');
    },
    setTooltip : function(tooltip){
    	this.linkEl.dom.title = tooltip;
    }
});

Ext.reg('apSimpleButton', Artery.plugin.SimpleButton);