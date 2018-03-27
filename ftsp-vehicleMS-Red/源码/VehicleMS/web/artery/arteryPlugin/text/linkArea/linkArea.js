/**
 * Artery LinkArea component
 * 
 * @author baon
 * @date 05/05/2010
 * 
 */
Artery.plugin.LinkArea = Ext.extend(Artery.plugin.BaseContainer, {
	
	initComponent : function() {
		Artery.plugin.LinkArea.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.LinkArea.superclass.onRender.call(this, ct, position);
		this.el.on('click',function(e){
            this.fireEvent('click',this,e);
        },this);
	},
	
	setText: function(value){
		this.el.update(value);
	},
	
	setValue: function(value){
		this.setText(value);
	},
	setHtml: function(value){
		this.setText(value);
	},
	click: function(){
		this.fireEvent('click',this);
	}
})

Ext.reg('apLinkArea', Artery.plugin.LinkArea);