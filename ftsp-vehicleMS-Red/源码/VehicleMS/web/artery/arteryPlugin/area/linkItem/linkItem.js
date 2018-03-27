/**
 * 链接控件区域
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.LinkItem = Ext.extend(Artery.plugin.BaseComponent, {

	initComponent: function(){
		Artery.plugin.LinkItem.superclass.initComponent.call(this);
	},
	
	render : function(){
		
    }
})

Ext.reg('apLinkItem', Artery.plugin.LinkItem);