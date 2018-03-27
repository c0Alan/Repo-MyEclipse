// 表单监控
Ext.onReady(function() {
			for (var i = 0; i < 10; i++) {
				var parseCookieId = "ARTERY_MONITOR" + i;
				var parseData = Ext.util.Cookies.get(parseCookieId);
				if (parseData != undefined && parseData != "") {
					var subStrs = parseData.split("__");
					if (subStrs[0] == "PARSEID" + Artery.parseId) {
						var t = new Date().getTime() - aty_start_time;
						var screenwidth = window.screen.width + "";
						var screenheight = window.screen.height + "";
						var screen = screenwidth + "*" + screenheight;
						document.cookie = parseCookieId + "=" + parseData
								+ "__" + t + "__" + screen + ";path=/";
						if (Artery.config.debug == "true") {
							Ext.Ajax.request({
										url : 'postMonitorData',
										method : 'POST'
									});
						}
						break;
					}
				}
			}
		});