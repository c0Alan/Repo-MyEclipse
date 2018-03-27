/**
 * activex控件显示panel
 * 
 * @author weijx
 * @date 29/07/2008
 */
Artery.plugin.ActiveX = Ext.extend(Ext.Component, {

	active : null, // 控件对象

	onRender : function(ct, position) {
		this.active = Ext.getDom(this.id);
	},

	// 显示组件
	show : function() {
		Ext.fly(this.active).removeClass("x-hide-display");
	},

	// 隐藏组件
	hide : function() {
		Ext.fly(this.active).addClass("x-hide-display");
	}
});

Ext.reg('apActiveX', Artery.plugin.ActiveX);