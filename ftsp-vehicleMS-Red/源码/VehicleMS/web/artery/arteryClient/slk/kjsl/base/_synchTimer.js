// **********************************************//
// _synchTimer 客户端脚本
// 
// @author Artery
// @date 2011-09-29
// @id 11806a7ce31dfa22ece3c1c172155a01
// **********************************************//

/**
 * onRunClient(autoStar_true)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function autoStar_true_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("autoStarHA_true").setHtml("【自动启动（isStar）】属性为true，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}

/**
 * onRunClient(autoStar_false)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function autoStar_false_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("autoStarHA_false").setHtml("【自动启动（isStar）】属性为false，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}

/**
 * onRunClient(runOnStart_true)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function runOnStart_true_onRunClient (rc){
	
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("runOnStartHA_true").setHtml("【启动时执行（runOnStart）】属性为true，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");;
}
/**
 * onRunClient(runOnStart_false)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function runOnStart_false_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("runOnStartHA_false").setHtml("【启动时执行（runOnStart）】属性为false，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}
/**
 * onRunClient(runOnStop_true)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function runOnStop_true_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("runOnStopHA_true").setHtml("【关闭时执行（runOnStop）】属性为true，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}

/**
 * onRunClient(runOnStop_true)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function runOnStop_false_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("runOnStopHA_false").setHtml("【关闭时执行（runOnStop）】属性为false，定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}
/**
 * onClickClient(runOnStopBtn_stop)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function runOnStopBtn_stop_onClickClient (rc){
	Artery.get("runOnStop_true").stop();
	Artery.get("runOnStop_false").stop();
}

/**
 * onRunClient(method)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function method_onRunClient (rc){
	if (Ext.isEmpty(this.times)) {
		this.times = 0;
	}
	this.times = this.times + 1;
	Artery.get("metherHA").setHtml("定时器执行次数：<span style='color: red;font-size :16px;'>"+this.times+"</span>");
}

/**
 * onClickClient(methodBtn_star)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function methodBtn_star_onClickClient (rc){
	Artery.get("method").start();
}
/**
 * onClickClient(methodBtn_stop)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function methodBtn_stop_onClickClient (rc){
	Artery.get("method").stop();
}
/**
 * onClickClient(methodBtn_doWork)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function methodBtn_doWork_onClickClient (rc){
	Artery.get("method").doWork();
}
