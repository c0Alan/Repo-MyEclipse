/**
 * 带有菜单项的按钮，放在按钮区域，footer中
 * @author dingql
 * @date 2010-04-12
 */
Artery.plugin.SplitButton = Ext.extend(Ext.SplitButton,{
	icon:null,
	
	allowDepress:false,
	
	allowButton:true,
	
	themeName:null,
	
	menuPosition:'left',
	
	initComponent : function(){
		if(this.menu){
			this.menu.enableScrolling = false;
			this.menu.style="overflow:visible;";
		}
        Artery.plugin.SplitButton.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
		
        var btn = Ext.get(this.id);
        this.btnCnt = btn.parent();
        this.btnWrap = this.btnCnt.parent();
        this.btnEl = btn.child(".x-btn-center");
        this.mon(this.btnEl, {
            scope: this,
            focus: this.onFocus,
            blur: this.onBlur
        });
        
        if(this.menuPosition == 'center'){
        	this.menuAlign = 't-b';
        }else if(this.menuPosition == 'right'){
        	this.menuAlign = 'tr-br?';
        }
        this.initButtonEl(btn, this.btnEl);

    },
    
    render : function(container, position){
    	Artery.plugin.SplitButton.superclass.render.call(this,container,position);
    	if(this.themeName == 'bluePlain'){
	    	this.btnWrap.setWidth(this.btnWrap.getWidth());
	    	this.btnWrap.setHeight(this.btnWrap.getHeight());
	        this.btnWrap.setStyle('position','relative');
	        this.btnCnt.setWidth(this.btnCnt.getWidth());
	        // 解决多浏览器时，splitButton当初始化时向下移动的问题
	        //this.btnCnt.setStyle('position','absolute');
	        this.btnCnt.setStyle('z-index','20000');
    	}
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
                hide: this.onMenuHide,
                beforeshow: this.onMenuBeforeShow
            });
            if(this.themeName == 'bluePlain'){
            	this.menu.defaultOffsets = [0,-3];
            }
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn, Ext.isObject(this.repeat) ? this.repeat : {});
            this.mon(repeater, 'click', this.onClick, this);
        }
        
        this.mon(btn, this.clickEvent, this.onClick, this);
    },
    
    //覆盖Ext.Component中的方法，将隐藏样式设置在按钮所在的TD上，而不是TABLE上
//    onHide : function(){
//    	var tdEl = this.getVisibiltyEl().findParent("td", 4, true);
//    	if(tdEl && tdEl != null){
//    		tdEl.addClass('x-hide-' + this.hideMode);
//    	}
//    },
    //覆盖Ext.Component中的方法，去除按钮所在的TD上的隐藏样式，而不是TABLE上
//    onShow : function(){
//        var tdEl = this.getVisibiltyEl().findParent("td", 4, true);
//    	if(tdEl && tdEl != null){
//    		tdEl.removeClass('x-hide-' + this.hideMode);
//    	}
//    },
    
    onMenuBeforeShow: function(){
    	if(this.themeName == 'bluePlain'){
	    	Ext.getBody().appendChild(this.btnCnt);
	        this.btnCnt.setXY(this.btnWrap.getXY());
    	}
    	// onExpandEvent事件
		if (!Ext.isEmpty(this.onExpandEvent)) {
			Artery.regItemEvent(this,'onExpandEvent','onExpandServer');
		}
    },
    
    onMenuHide : function(e){
    	// onCollapseEvent事件
		if (!Ext.isEmpty(this.onCollapseEvent)) {
			Artery.regItemEvent(this,'onCollapseEvent','onCollapseServer');
		}
    	if(this.themeName == 'bluePlain'){
	    	this.el.removeClass('x-btn-menu-active');
	    	(function(){
		    	this.btnWrap.appendChild(this.btnCnt);
		        this.btnCnt.setStyle('position','static');
		    	Artery.plugin.SplitButton.superclass.onMenuHide.call(this,e);
	    	}).defer(10,this,[e]);
    	}else{
    		Artery.plugin.SplitButton.superclass.onMenuHide.call(this,e);
    	}
    },
    
    onClick : function(e, t){
        e.stopEvent();
        if(!this.disabled){
            if(this.isClickOnArrow(e)||!this.allowButton){
                if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                    this.showMenu();
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                if(this.enableToggle){
                    this.toggle();
                }
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },
    setText : function(text){
        this.text = text;
        if(this.btnEl){
        	var btnTextEl = this.btnEl.child(".x-btn-text");
            btnTextEl.update(text);
        }
        return this;
    },
    setArrowAlign : function(arrowAlign){
        this.arrowAlign = arrowAlign;
        return this;
    },
    isHidden : function(){
    	return this.hidden;
    },
    isDisabled : function(){
    	return this.disabled;
    },
    hideIcon: function(){
    	this.el.removeClass("x-btn-text-icon");
    	this.el.addClass("x-btn-noicon");
    	var btnTextEl = this.btnEl.child(".x-btn-text");
    	btnTextEl.setStyle('background-image','none');
    },
    showIcon: function(){
    	if(!Ext.isEmpty(this.icon)){
    		this.el.removeClass("x-btn-noicon");
    		this.el.addClass("x-btn-text-icon");
    		var btnTextEl = this.btnEl.child(".x-btn-text");
    		btnTextEl.setStyle('background-image','url("' + sys.getContextPath() + this.icon+'")');
    	}
    },
    setIcon: function(imagePath){
    	this.icon = imagePath;
    	this.el.removeClass("x-btn-noicon");
    	this.el.addClass("x-btn-text-icon");
    	var btnTextEl = this.btnEl.child(".x-btn-text");
    	btnTextEl.setStyle('background-image','url("' + sys.getContextPath() + imagePath +'")');
    },
    setTooltip : function(tooltip){
    	this.el.dom.title = tooltip;
    }
});

Ext.reg('npSplitButton', Artery.plugin.SplitButton);