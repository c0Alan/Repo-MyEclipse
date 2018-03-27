// 页面初始化
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.apply(Ext.QuickTips.getQuickTip(), {
				showDelay : 0,
				hideDelay : 0
			});
	Artery.initSubItems(Artery.cfg_bodyPanel);
//	new Ext.Viewport({
//		border : false,
//		hideBorders : true,
//
//		items : [Artery.cfg_bodyPanel]
//	});
});