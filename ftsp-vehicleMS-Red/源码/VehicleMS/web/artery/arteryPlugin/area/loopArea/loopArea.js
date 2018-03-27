/**
 * 循环区域控件
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.LoopArea = Ext.extend(Artery.plugin.BaseComponent, {
	
	allowDomMove:false,
	
	initComponent: function(){
		Artery.plugin.LoopArea.superclass.initComponent.call(this);
	},
	
	render : function(){
		
    }
})

Ext.reg('apLoopArea', Artery.plugin.LoopArea);