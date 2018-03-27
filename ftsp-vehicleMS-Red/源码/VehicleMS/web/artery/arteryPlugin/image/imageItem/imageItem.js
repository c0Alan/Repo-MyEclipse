
/**
 * Artery ImageItem component
 * 
 * @author baon
 * @date 05/05/2009
 * 
 */
Artery.plugin.ImageItem = Ext.extend(Artery.plugin.BaseComponent, {
	
	value: null,
	
	onClickEvent:null,
	
	onRender : function(ct, position) {
		Artery.plugin.ImageItem.superclass.onRender.call(this, ct, position);
		this.el.addClassOnOver("imageItem-img-over-cust");
		this.pitem = Artery.get(this.pItemId);
		this.initImageEvent();
		
		if(this.selected){
			this.pitem.update(this);
		}
	},
	
	initImageEvent: function(){
		this.el.on("click",function(it){
			this.pitem.update(this);
			this.fireEvent('click',this);
		},this)
		
	},
	
	select: function(){
		if(this.el){
			this.el.addClass("imageItem-img-click-cust");
			this.el.removeClass("imageItem-img-over-cust");
		}
	},
	
	unselect: function(){
		if(this.el){
			this.el.removeClass("imageItem-img-click-cust");
		}
	},
	
	getValue: function(){
		return this.value;
	}
})

Ext.reg('apimageitem', Artery.plugin.ImageItem);