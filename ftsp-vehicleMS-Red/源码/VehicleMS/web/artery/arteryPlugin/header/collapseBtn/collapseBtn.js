/**
 * 普通按钮，放在按钮区域，footer中
 * @author weijx
 * @date 2009-02-22
 */
Artery.plugin.CollapseBtn = Ext.extend(Artery.plugin.BaseComponent,{
	
	panelId:null,
	
	onRender : function(ct, position){
		Artery.plugin.CollapseBtn.superclass.onRender.call(this,ct,position);
		this.panelCmp = Artery.get(this.panelId);
		var pdom = this.panelCmp.el.dom;
		this.panelHeight = pdom.xheight?pdom.xheight:pdom.style.height;
		this.el.on('click',function(){
			this.panelCmp.toggleCollapse(false);
			if(this.panelCmp.collapsed){
				this.panelCmp.el.dom.style.height="";
				this.panelCmp['bwrap'].setDisplayed(false);
			}else{
				this.panelCmp.el.dom.style.height=this.panelHeight;
				this.panelCmp['bwrap'].setDisplayed(true);
			}
		},this)
	},
	 
	change : function(){
		this.panelCmp.toggleCollapse(false);
	},
	collapse : function(){
		if(!this.panelCmp.collapsed){
			this.panelCmp.toggleCollapse(false);
		}
	},
	expand : function(){

		if(this.panelCmp.collapsed){
			this.panelCmp.toggleCollapse(false);
		}

	}
	
	
   
	
});

Ext.reg('apCollapseBtn', Artery.plugin.CollapseBtn);