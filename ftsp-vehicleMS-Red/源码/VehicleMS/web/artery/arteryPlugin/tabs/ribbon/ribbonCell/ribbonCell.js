/**
 * RibbonCell
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.RibbonCell = Ext.extend(Artery.plugin.BaseComponent,{
	
	active:false,
	
	ribbonAreaId:null,
	
	ribbonGroupId:null,
	
	ribbonItemId:null,
	
	cellTipEl:null,
	
	ribbonTextEl:null,
	
	ribbonCellBodyEl:null,
	
	onReloadEvent:null,
	
	moreCell:false,
	
	onDeselectEvent:null,
	
	initComponent: function(){
		Artery.plugin.RibbonCell.superclass.initComponent.call(this);
		if(this.id == this.ribbonItemId + "MoreMenuCell"){
			this.moreCell = true;
		}
		// linkto事件
		if (!Ext.isEmpty(this.linktoEvent)) {
			if(this.linktoEvent.target == '_blank'){
				this.linktoEvent.target =  Artery.get(this.ribbonAreaId).operAreaId;
			}
		}
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
    	this.ribbonTextEl = this.el.child('.x-ribbon-cell-text');
    	this.ribbonCellBodyEl = this.el.child('.x-ribbon-cell-body');
    	this.cellTipEl = this.el.child('.x-ribbon-cell-tip');
        Artery.plugin.RibbonCell.superclass.onRender.call(this, ct, position);
        this.el.addClassOnOver('x-ribbon-cell-over');
        this.el.on('click',function(item){
        	this.onClick();
        	Ext.menu.MenuMgr.hideAll();
        },this);
        if(this.active){
        	Artery.get(this.ribbonAreaId).activeCell = this;
        	this.onClick();
        }
    },
    
    click: function(){
    	Artery.get(this.ribbonAreaId).activeRibbon(this.ribbonItemId)
    	this.onClick();
        Ext.menu.MenuMgr.hideAll();
    },
    
    onClick: function(){
    	if(Artery.get(this.ribbonAreaId).activeCell && !this.moreCell){
        	Artery.get(this.ribbonAreaId).activeCell.deselect();
    	}
        this.select();
    	this.updateMore();
        this.fireEvent('click',this);
    },
    
    updateMore:function(){
    	if(!this.moreCell){
			Artery.get(this.ribbonItemId).updateMore(this)
    	}
    },
    
    reload: function(params){
    	Artery.regItemEvent(this,'onReloadEvent','onReloadServer',params);
    },
    
    select: function(){
    	this.el.addClass('x-ribbon-cell-active');
    	if(this.moreCell){
    		return;
    	}
    	this.active = true;
    	Artery.get(this.ribbonAreaId).activeCell = this;
    },
    deselect: function(){
    	this.el.removeClass('x-ribbon-cell-active');
    	this.active = false;
    	Artery.get(this.ribbonAreaId).activeCell = null;
    	if(this.onDeselectEvent){
    		Artery.regItemEvent(this,'onDeselectEvent','onDeselectServer');
    	}
    },
    showTip : function(){
    	var tipEl = Ext.get(this.id+"_tip");
    	if(tipEl){
    		tipEl.removeClass("x-hidden");
    	}
    },
    hideTip : function(){
    	var tipEl = Ext.get(this.id+"_tip");
    	if(tipEl){
    		tipEl.addClass("x-hidden");
    	}
    },
    setTip: function(tip,required){
    	if(!this.cellTipEl){
    		return;
    	}
    	if(tip && tip!="")
    		this.showTip();
    	else{
    	    this.hideTip();
    	    return;
    	}
    	this.cellTipEl.removeClass('x-ribbon-cell-tip-ok');
    	this.cellTipEl.removeClass('x-ribbon-cell-tip-warn');
    	this.cellTipEl.removeClass('x-ribbon-cell-tip-sys');
    	if(required ===false){
    		this.cellTipEl.addClass('x-ribbon-cell-tip-norequired');
    	}else{
    		this.cellTipEl.removeClass('x-ribbon-cell-tip-norequired');
    	}
    	if(tip == 'ok'){
    		this.cellTipEl.addClass('x-ribbon-cell-tip-ok');
    		this.cellTipEl.addClass('x-ribbon-cell-tip-sys');
    	}else if(tip == 'warn'){
    		this.cellTipEl.addClass('x-ribbon-cell-tip-warn');
    		this.cellTipEl.addClass('x-ribbon-cell-tip-sys');
    	}else{
    		this.cellTipEl.child('.x-ribbon-cell-tip-body').update(tip);
    	}
    },
    setTipInfo: function(info){
    	if(!this.cellTipEl){
    		return;
    	}
    	this.cellTipEl.dom.title = info;
    }
})

Ext.reg('apRibbonCell', Artery.plugin.RibbonCell);