/**
 * Artery HtmlArea component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.HtmlArea = Ext.extend(Artery.plugin.BaseContainer, {
	
	initComponent : function() {
		Artery.plugin.HtmlArea.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.HtmlArea.superclass.onRender.call(this, ct, position);
	},
	
	setHtml: function(value){
		this.el.update(value);
		this.value = value;//同事改变当前的valus属性的值
	},
	
	setValue:function(value){
		this.setHtml(value);
	},
	
	setText: function(value){
		this.setHtml(value);
	},
	getText : function(){
		return this.value;
	}
})

Ext.reg('aphtmlarea', Artery.plugin.HtmlArea);