// ***************************************************************************************//
// FaHidden
// ***************************************************************************************//
/**
 * Artery FaHidden component
 * 
 * @author baon
 * @date 17/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaHidden = Ext.extend(Ext.form.Hidden, {

	onRender : function(ct, position) {
		Artery.plugin.FaStringInput.prototype.onRender.call(this, ct, position);
	},
	
	onDisable : function (){
		Artery.plugin.FaStringInput.prototype.onDisable.call(this);
	},
	
	onEnable : function (){
		Artery.plugin.FaStringInput.prototype.onEnable.call(this);
	},
	onHide : function() {
		
	},
	onShow: function(){
	
	}
})

// register xtype
Ext.reg('apfahidden', Artery.plugin.FaHidden);