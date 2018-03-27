var Plugin={};

/**
 * 自定义button
 * 
 * @author weijx
 * @date 2009-01-07
 */
Plugin.MyAreaButton = function(conf){
	var c = {
		id: conf.id,
		text: conf.text
	};
	this.panelConf = {
		width: 200,
		height: 150,
		items: conf.items
	};
	if(conf.width!=0){
		this.panelConf.width = conf.width;
	}
	if(conf.height!=0){
		this.panelConf.height = conf.height;
	}
	Plugin.MyAreaButton.superclass.constructor.call(this, c);
	this.panelConf.contentEl = this.id+"_popup";
}

/**
 * 定义类的方法
 */
Ext.extend(Plugin.MyAreaButton,Artery.plugin.BaseButton,{
	
	onRender : function(ct, position){
		this.menu = this.createEl();
		var p = new Ext.Panel(this.panelConf);
		p.render(this.menu);
		var popupDom = Ext.getDom(this.id+"_popup");
		Ext.fly(popupDom).removeClass("x-hide-display");
		
		p.el.on("click",function(e){
			e.stopPropagation();
		});
		Ext.getDoc().on("click", this.hideMenu,this);
		
		Plugin.MyAreaButton.superclass.onRender.call(this, ct, position);
	},
	
	/**
     * Show this button's menu (if it has one)
     */
    showMenu : function(){
        if(this.menu){
            var xy = this.menu.getAlignToXY(this.el, this.menuAlign);
    		this.menu.setXY(xy);
        	this.menu.show();
        	this.menu.hidden = false;
        	this.menu.focus();
        }
        return this;
    },
    
    // private
    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                this.showMenu();
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                //this.el.removeClass("x-btn-over");
                this.handler.call(this.scope || this, this, e);
            }
        }
        e.stopPropagation();	// 停止事件向上传播
    },
    
    /**
     * Hide this button's menu (if it has one)
     */
    hideMenu : function(){
        if(this.menu){
            if(this.menu.isVisible()){
            	this.menu.hide();
            	this.menu.hidden = true;
        	}
        }
        return this;
    },
    
    // private
    createEl : function(){
        return new Ext.Layer({
            cls: "x-menu",
            shadow:this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex:15000
        });
    }
});

Ext.reg('myAreaButton', Plugin.MyAreaButton);