/**
 * RibbonMenu
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.RibbonMenu = Ext.extend(Artery.plugin.BaseComponent,{
	
	ribbonAreaId:null,
	
	pItemId:null,
	
	pMenuId:null,
	
	themeName:null,
	
	initComponent: function(){
		Artery.plugin.RibbonMenu.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.RibbonMenu.superclass.onRender.call(this, ct, position);
        this.el.addClassOnOver('x-ribbon-cell-over');
        this.el.on('click',function(e,item){
        	this.onClick();
        },this);
        
    },
    
    onClick: function(){
        this.showMenu();
    },
    
    showMenu:function(){
    	if(!this.menu){
    		this.createMenu();
    	}
    	var postion =Ext.get(this.id).getXY();
    	postion[1] = postion[1]+Ext.get(this.id).getHeight();
    	//throw e;
    	if(postion[0]+this.menu.minWidth > document.body.scrollWidth){
    		postion[0] = postion[0]+Ext.get(this.id).getWidth()-this.menu.minWidth;
    	}
    	//this.menu.show(Artery.get(this.pItemId).el,'tl-bl?',this.getParentMenu());
    	this.menu.showAt(postion,this.getParentMenu());
    	// 弹出菜单宽度大于窗口宽度，出滚动条
    	var w = this.menu.ul.getWidth();
    	var cw = Ext.getBody().getWidth();
    	if (w - cw > 10) {
    		this.menu.setPosition(5);
    		this.menu.el.setStyle("overflow-x","auto");
    		this.menu.setWidth(cw - 10);
    		this.menu.ul.setWidth(w);
    		if (!this.menu.height4Scroll) {
    			this.menu.height4Scroll = this.menu.getHeight() + 17;
    		}
    		this.menu.setHeight(this.menu.height4Scroll);
    	}
    },
    
    getParentMenu: function(){
    	if(this.pMenuId){
    		return Artery.get(this.pMenuId).menu;
    	}
    	if(Artery.get(this.pItemId).showInMenu){
    		return Artery.get(Artery.get(this.pItemId).pItemId).menu;
    	}
    	return null;
    },
    
    createMenu: function(){
    	this.menu = new Ext.menu.Menu({
    		plain:true,
    		id:this.id + "_ribbonMenu",
    		cls:this.themeName?'x-theme-ribbonArea-'+this.themeName + ' x-menu-ribbon-' + this.themeName:'',
    		defaultOffsets:[0,-4],
    		items : [{
    			xtype:'panel',
    			border:false,
    			contentEl :this.id + "_menu"
    		}]
    	});
    },
    
    select: function(){
    	this.el.addClass('x-ribbon-cell-active');
    	this.active = true;
    	Artery.get(this.ribbonAreaId).activeCell = this;
    },
    deselect: function(){
    	this.el.removeClass('x-ribbon-cell-active');
    	this.active = false;
    	Artery.get(this.ribbonAreaId).activeCell = null;
    }
})

Ext.reg('apRibbonMenu', Artery.plugin.RibbonMenu);