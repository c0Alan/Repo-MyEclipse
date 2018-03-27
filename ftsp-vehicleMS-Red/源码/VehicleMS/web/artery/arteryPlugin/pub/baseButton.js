Artery.plugin.BaseButton = Ext.extend(Ext.Button,{
	
	allowDepress:false,
	
	icon:null,
	
	loadingState:false,
	
	timeoutId : null,
	
	onRender : function(ct, position){
        var btn = Ext.get(this.id);
        this.btnEl = btn.child(".x-btn-button");
        this.mon(this.btnEl, {
            scope: this,
            focus: this.onFocus,
            blur: this.onBlur
        });
        this.initButtonEl(btn, this.btnEl);

        Ext.ButtonToggleMgr.register(this);
    },
    
    initButtonEl : function(btn, btnEl){
        this.el = btn;
        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }

        if(this.handleMouseEvents){
            this.mon(btn, {
                scope: this,
                mouseover: this.onMouseOver,
                mousedown: this.onMouseDown
            });
        }

        if(this.menu){
            this.mon(this.menu, {
                scope: this,
                show: this.onMenuShow,
                hide: this.onMenuHide
            });
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn, Ext.isObject(this.repeat) ? this.repeat : {});
            this.mon(repeater, 'click', this.onClick, this);
        }
        
        this.mon(btn, this.clickEvent, this.onClick, this);
    },
    
    //覆盖Ext.Component中的方法，将隐藏样式设置在按钮所在的TD上，而不是TABLE上
//    onHide : function(){
//    	if(this.buttonFloat){
//    		this.el.parent().addClass('x-hide-' + this.hideMode);
//    	}else{
//	    	var tdEl = this.getVisibiltyEl().findParent("td", 3, true);
//	    	if(tdEl && tdEl != null){
//	    		tdEl.addClass('x-hide-' + this.hideMode);
//	    	}
//    	}
//    },
    //覆盖Ext.Component中的方法，去除按钮所在的TD上的隐藏样式，而不是TABLE上
//    onShow : function(){
//    	if(this.buttonFloat){
//    		this.el.parent().removeClass('x-hide-' + this.hideMode);
//    	}else{
//	        var tdEl = this.getVisibiltyEl().findParent("td", 3, true);
//	    	if(tdEl && tdEl != null){
//	    		tdEl.removeClass('x-hide-' + this.hideMode);
//	    	}
//    	}
//    },
    
    setTooltip : function(tooltip){
    	this.el.dom.title = tooltip;
    },
    
    onDisableChange : function(disabled){
        if(this.el){
            //if(!Ext.isIE6 || !this.text){
                this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
            //}
            this.el.dom.disabled = disabled;
        }
        this.disabled = disabled;
    },
    doAutoWidth : function(){
    
    },
    onClick : function(e){
    	e.stopEvent();
    	if(this.cancleClick){
    		return;
    	}
        if(this.loadingState){
        	this.timeoutId = this.showLoading.defer(1000,this);
        	this.cancleClick = true;
        }
        Artery.plugin.BaseButton.superclass.onClick.call(this,e);
    },
    
    showLoading: function(){
    	this.cancleClick = true;
    	this.hideIcon();
    	Artery.showLoading(this.el,'l-l',[3,-1]);
    },
    
    hideLoading: function(){
    	if (this.timeoutId) {
    		clearTimeout(this.timeoutId);
    		this.timeoutId = null;
    	}
    	this.cancleClick = false;
    	Artery.hideLoading();
    	this.showIcon();
    },
    hideIcon: function(){
    	this.el.removeClass("x-btn-text-icon");
    	this.el.addClass("x-btn-text");
    	this.btnEl.setStyle('background-image','none');
    },
    showIcon: function(){
    	if(!Ext.isEmpty(this.icon)){
    		this.el.removeClass("x-btn-text");
    		this.el.addClass("x-btn-text-icon");
    		this.btnEl.setStyle('background-image','url("' + sys.getContextPath() + this.icon+'")');
    	}
    },
    setText : function(text){
        this.text = text;
        if(this.btnEl){
            this.btnEl.update(text);
        }
        return this;
    },
    setIcon: function(imagePath){
    	this.icon = imagePath;
    	this.el.removeClass("x-btn-text");
    	this.el.addClass("x-btn-text-icon");
    	this.btnEl.setStyle('background-image','url("' + sys.getContextPath() + imagePath +'")');
    },
    isHidden : function(){
    	return this.hidden;
    },
    isDisabled : function(){
    	return this.disabled;
    }
});

Ext.reg("apBaseButton", Artery.plugin.BaseButton);