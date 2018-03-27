// example-chart-自动更新
/**
 * 客户端(button_stop)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_stop_onClickClient (rc){
	Artery.get("chart_autoUpdate").stopAutoUpdate();
	Artery.showInfo("停止自动更新");
}

/**
 * 客户端(button_start)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_start_onClickClient (rc){
	Artery.get("chart_autoUpdate").initAutoUpdate();
	Artery.showInfo("启动自动更新");
}

/**
 * 客户端(button_load)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_load_onClickClient (rc){
	Artery.get("chart_autoUpdate").reload({
    	myParam1 : "myParam1",
    	myParam2 : "myParam2"
	});
	Artery.showInfo("手动更新");
}