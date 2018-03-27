// ***************************************************************************************//
// FaIndentity
// ***************************************************************************************//
/**
 * Artery FaIndentity component
 * 
 * @author baon
 * @date 1/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaIdentity = Ext.extend(Ext.form.TextField, {

	allowDomMove:false,
	
	onlyParam:true,
	
	onRender : function(ct, position) {
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if(Ext.get(this.id)){
			this.el = Ext.get(this.id);
		}
	},
	getContanerEl : function() {
		if(this.onlyParam){
			return null;
		}
		return Artery.plugin.FaIdentity.superclass.getContanerEl.call(this);
	},
	
	onDisable : function (){
		Artery.plugin.FaStringInput.prototype.onDisable.call(this);
	},
	
	onEnable : function (){
		Artery.plugin.FaStringInput.prototype.onEnable.call(this);
	}
	
})

// register xtype
Ext.reg('apFaIdentity', Artery.plugin.FaIdentity);

