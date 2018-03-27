/**
 * Artery HtmlArea component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.IncludeItem = Ext.extend(Artery.plugin.BaseContainer, {
	
	initComponent : function() {
		Artery.plugin.IncludeItem.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.IncludeItem.superclass.onRender.call(this, ct, position);
	}
})

Ext.reg('apincludeitem', Artery.plugin.IncludeItem);