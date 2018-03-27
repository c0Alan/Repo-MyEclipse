/**
 * Artery PercentBar component
 * 
 * @author baon
 * @date 04/03/2011
 * 
 */
Artery.plugin.PercentBar = Ext.extend(Artery.plugin.BaseContainer, {
	
	showPercentNum:true,//是否显示数值
	
	innerBarEl:null,
	
	numEl:null,
	
	initComponent : function() {
		Artery.plugin.PercentBar.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.PercentBar.superclass.onRender.call(this, ct, position);
		this.innerBarEl = this.el.child('.x-percentBar-inner');
		if(this.showPercentNum){
			this.numEl = this.el.child('.x-percentBar-num');
		}
	},
	setPercentNum: function(num){
		this.innerBarEl.setStyle('width',num + '%');
		if(this.numEl){
			this.numEl.update(num + '%');
		}
	}
})

Ext.reg('appercentbar', Artery.plugin.PercentBar);