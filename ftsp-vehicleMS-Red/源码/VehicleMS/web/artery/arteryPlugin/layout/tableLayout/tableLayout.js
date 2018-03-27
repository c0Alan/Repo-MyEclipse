// ***************************************************************************************//
// TableLayout
// ***************************************************************************************//
/**
 * Artery TableLayout component
 * 
 * @author baon
 * @date 19/02/2009
 * 
 * @class Artery.plugin.TableLayou
 * @extends Ext.Container
 */
Artery.plugin.TableLayout = Ext.extend(Ext.Container, {
	
	initComponent : function() {
		Artery.plugin.TableLayout.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		if (!this.el) {
			this.el = Ext.get(this.id);
			ct.appendChild(this.el);
		}
		Artery.plugin.TableLayout.superclass.onRender.call(this, ct, position);
	}
})

// register xtype
Ext.reg('aptablelayout', Artery.plugin.TableLayout);