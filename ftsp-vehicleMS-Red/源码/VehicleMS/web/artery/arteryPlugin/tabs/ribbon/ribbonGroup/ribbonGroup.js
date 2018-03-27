/**
 * RibbonGroup
 * 
 * @author baon
 * @date 07/12/2009
 */
Artery.plugin.RibbonGroup = Ext.extend(Artery.plugin.BaseComponent,{
	
	initComponent: function(){
		Artery.plugin.RibbonGroup.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.RibbonGroup.superclass.onRender.call(this, ct, position);
    }
})

Ext.reg('apRibbonGroup', Artery.plugin.RibbonGroup);