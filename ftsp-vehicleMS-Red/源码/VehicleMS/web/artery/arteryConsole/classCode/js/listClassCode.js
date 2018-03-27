
//
function initTabs() {

	tabs = new Ext.TabPanel({
				resizeTabs : true,
				minTabWidth : 100,
				tabWidth : 100,
				enableTabScroll : true,
				deferredRender : false,
				defaults : {
					autoScroll : true
				},
				activeTab : 0
			});

	var panels = new Array();
	for (var i = 0; i < iCcNum; i++) {
		panels[i] = new Ext.Panel({
					title : '<span>' + arrayCcNames[i] + '&nbsp;</span>',
					id : '' + i,
					html : {
						id : 'iframeCC' + i,
						name : 'iframeCC' + i,
						tag : 'iframe',
						frameborder : 0,
						style : 'width:100%;height:100%',
						src : ''
					}
				});
		// ***
		panels[i].on("activate", function(panel) {
			Ext.get("iframeCC" + panel.getId()).dom.src = sys.getContextPath()
					+ '/artery/classCode/dealClassCode.do?action=showClassCodeTree&indexCC='
					+ panel.getId();
		}, this, {
			single : true
		});

		tabs.add(panels[i]);
	}

}
