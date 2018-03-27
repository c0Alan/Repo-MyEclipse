// ***************************************************************************************//
// 命名空间 //
// ***************************************************************************************//
Ext.tusc={};
Ext.tusc.plugins={};
Ext.ux={};

if(!window['Artery']){
	Artery = {};
}
Artery.frame={}
Artery.script={}
Artery.plugin={}

Artery.FORM = "1"; //表单
Artery.REPORT = "2"; //报表
Artery.WRIT = "3"; //文书
Artery.PLUGIN = "4"; //外挂
Artery.FRAME = "5"; //

//参数中文前缀
Artery.PARAMCN = "Aty_cnp_";

//滚动条自身高度
Artery.SCROLLBAR_HEIGHT = 18;

//参数编码
Artery.escape = function(s){
	if(Ext.isEmpty(s)){
		return "";
	}
	return Artery.PARAMCN + escape(s);
}

// ***************************************************************************************//
// StringBuffer //
// ***************************************************************************************//
function StringBuffer() {
	this._strings = new Array();
}
StringBuffer.prototype.append = function(str) {
	this._strings.push(str);
	return this;
}
StringBuffer.prototype.toString = function() {
	return this._strings.join("");
}

// ***************************************************************************************//
// 弹出窗口方法 //
// ***************************************************************************************//
/**
 * Artery Win component
 * 
 * @author baon
 * @date 19/06/2008
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */

// 显示alert提示框
// callback参数:
// id: id of the button that was clicked
Artery.alertMsg = function(titles, text, callback) {
	Artery.pwin.Ext.Msg.show({
				title : titles,
				msg : text,
				buttons : {
					ok : '确定'
				},
				fn : callback
			});
}
// 显示Confirm提示框
Artery.confirmMsg = function(titles, text, callback) {
	Artery.pwin.Ext.Msg.show({
				title : titles,
				msg : text,
				buttons : {
					yes : '是',
					no : '否'
				},
				shadow:false,
				fn : callback
			});
}
// 显示Pormpt提示框
Artery.promptMsg = function(titles, text, callback, value) {
	Artery.pwin.Ext.Msg.show({
				title : titles,
				msg : text,
				prompt : true,
				buttons : {
					yes : '确定',
					cancel : '取消'
				},
				fn : callback,
				value : value
			});
}

Artery.waitMsg = function(msg, processText, icon) {
	if (icon == null) {
		icon = 'ext-mb-download';
	}
	return Artery.pwin.Ext.MessageBox.show({
				msg : msg,
				progressText : processText,
				width : 300,
				wait : true,
				waitConfig : {
					interval : 200
				},
				icon : icon
			});
}
// {url:'',name:'',feature:{}}
Artery.open = function(cfg) {
	if (cfg == null) {
		cfg = {};
	}
	var feature = {
		height : (screen.availHeight - 100),
		width : (screen.availWidth - 10),
		left : 0,
		top : 0,
		status : 'no',
		toolbar : 'no',
		menubar : 'no',
		location : 'no',
		resizable : 'yes',
		titlebar : 'no',
		scrollbars : 'yes'
	};
	if (cfg.feature != null) {
		Ext.apply(feature, cfg.feature);
	}
	if(cfg.center){
		feature.left = parseInt((screen.width - parseInt(feature.width))/2)
		feature.top = parseInt((screen.height - parseInt(feature.height))/2)
	}
	var fn = function(feature) {
		var f = [];
		for (var i in feature) {
			f.push(i + "=" + feature[i]);
		}
		return f.join(',');
	}

	cfg.feature = fn(feature);
	
	if (cfg.url == null) {
		cfg.url = '';
	}
	var win = window.open(cfg.url, cfg.name, cfg.feature);
	return win;
}

// ***************************************************************************************//
// Message方法 //
// ***************************************************************************************//
/**
 * Artery Win component
 * 
 * @author baon
 * @date 19/06/2008
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
// 显示提示
Artery.showMessage = function(message, type) {
	Artery.getExt(top).getTipMessage().showMessage(message, type);
}
Artery.showInfo = function(message) {
	Artery.showMessage(message, Ext.tusc.TIP_INFO)
}
Artery.showWarning = function(message) {
	Artery.showMessage(message, Ext.tusc.TIP_WARN)
}
Artery.showError = function(message) {
	var msgEl = Artery.getExt(top).getTipMessage();
	msgEl.showMessage(message, Ext.tusc.TIP_ERROR);
	msgEl.clearTimeout();
}
Artery.isShowError = function() {
	var msgEl = Artery.getExt(top).getTipMessage();
	return msgEl.isError;
}
Artery.loading = function() {
	Artery.getExt(top).getTipMessage().loading();
}
Artery.loadTrue = function(message) {
	Artery.getExt(top).getTipMessage().loadTrue(message);
}
Artery.loadFalse = function(message) {
	Artery.getExt(top).getTipMessage().loadFalse(message);
}
Artery.hideMessage = function(){
	Artery.getExt(top).getTipMessage().hideMessage();
}
// ***************************************************************************************//
// tip方法 //
// ***************************************************************************************//
Artery.getTipEl = function(){
	if(Artery.tipEl == null){
		Artery.tipEl = Ext.get(Ext.DomHelper.insertHtml('beforeEnd',document.body,'<div class="artery-tip x-hidden-display"><div class="artery-tip-right"><div class="artery-tip-close"></div><div class="artery-tip-text"></div></div></div>'));	
	}
	return Artery.tipEl;
}
Artery.showTip = function(message,alignEl){
	if(Artery.tipTimeHolder){
		clearTimeout(Artery.tipTimeHolder)
	}
    var tpEl=Artery.getTipEl();
	tpEl.child('.artery-tip-text').update(message);
	tpEl.removeClass('artery-tip-error');
	tpEl.removeClass('artery-tip-warning');
	tpEl.alignTo(alignEl?alignEl:document.body,'t-t',[0,5]);	
	tpEl.child('.artery-tip-close').on('click',function(){
	tpEl.hide();
	},this,{delay:300});	
	tpEl.show();
	
	
	
	Artery.tipTimeHolder = (function(){
		Artery.getTipEl().hide();
	}).defer(parseInt(Ext.tusc.TIP_DEFERTIME)*1000);
}
Artery.showTipError = function(message,alignEl){
	if(Artery.tipTimeHolder){
		clearTimeout(Artery.tipTimeHolder)
	}
    var tpEl=Artery.getTipEl();
    tpEl.child('.artery-tip-text').update(message);
	tpEl.removeClass('artery-tip-warning');
	tpEl.addClass('artery-tip-error');
	tpEl.alignTo(alignEl?alignEl:document.body,'t-t',[0,5]);	
	tpEl.child('.artery-tip-close').on('click',function(){
	tpEl.hide();
	},this,{delay:200});
	tpEl.show();
}
Artery.showTipWarning = function(message,alignEl){
	if(Artery.tipTimeHolder){
		clearTimeout(Artery.tipTimeHolder)
	}
    var tpEl=Artery.getTipEl();
	tpEl.child('.artery-tip-text').update(message);
	tpEl.removeClass('artery-tip-error');
	tpEl.addClass('artery-tip-warning');
	tpEl.alignTo(alignEl?alignEl:document.body,'t-t',[0,5]);	
	tpEl.child('.artery-tip-close').on('click',function(){
	tpEl.hide();
	},this,{delay:200});
	tpEl.show();
}

// ***************************************************************************************//
// 业务提示
// 显示控件的业务提示信息
// ***************************************************************************************//
Artery.showComment = function(){
	//保存业务提示
	var saveComment = function(){
		var p = Artery.getParams({
			comment:this.comment
		}, this);
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=updateDictFieldComment",
			success : function(response, options) {
				var result = response.responseText;
				if(result != 'ok'){
					Artery.showError("出错啦，请检查！")
				}
			},
			scope : this,
			params : p
		})
	}
	
	//初始化编辑时的窗口
	var initTipWin = function(tp){
		var field = this;
		if(tp.initFileldTip){
			return;
		}
		tp.initFileldTip = true;
		tp.onRenderBody = function(body){
			if (Ext.isTrue(field.showCmtEditBtn)) {
				body.update('<textarea class="x-aty-tipPanel-body-container"></textarea><div class="x-aty-tipPanel-footer">修改</div>');
			} else {
				body.update('<textarea class="x-aty-tipPanel-body-container">');
			}
			tp.bodyContainer = tp.el.child('.x-aty-tipPanel-body-container');
			tp.bodyContainer.dom.readOnly = true;
			tp.editBtn = tp.el.child('.x-aty-tipPanel-footer');
			if (tp.editBtn) {
				tp.editBtn.on('click',function(e){
					if(tp.bodyContainer.dom.readOnly){
						tp.dd.lock();
						tp.syncSize();
						tp.editBtn.update('保存');
						tp.bodyContainer.dom.readOnly = false;
						tp.bodyContainer.setStyle('border','1px solid #FF9000');
						tp.bodyContainer.setStyle('background-color','#FFFFC6');
					}else{
						tp.dd.unlock();
						tp.syncSize();
						tp.editBtn.update('修改');
						tp.bodyContainer.dom.readOnly = true;
						tp.bodyContainer.setStyle('border','0');
						tp.bodyContainer.setStyle('background-color','transparent');
						tp.saveComment();
					}
				},tp);
			}
			
			tp.bodyContainer.on('keyup',function(){
				tp.refreshSize();
			});
		}
		
		tp.saveComment = function(){
			var field = Artery.get(tp.fieldId);
			field.comment = tp.bodyContainer.dom.value
			saveComment.call(field);
		}
		
		tp.update = function(text){
			this.bodyContainer.dom.value = text;
		}
		
		tp.refreshSize = function(){
			tp.bodyContainer.dom.style.height='auto';
			var width = parseInt((tp.bodyContainer.dom.value.length/10)/5)*20;
			if(150 + width>250){
				tp.setWidth(250);
			}else{
				tp.setWidth(150 + width);
			}
			
			if(tp.bodyContainer.getHeight() > 300){
				tp.bodyContainer.dom.style.height='300px';
			}
			var bodyHeight = Ext.getBody().getHeight();
			var field = Artery.get(tp.fieldId);
			var bottomHeight = bodyHeight - field.el.getY();
			if(bottomHeight < tp.getHeight()){
				if(bottomHeight <100){
					if(field.el.getY()>tp.getHeight()){
						tp.el.setY(field.el.getY()-tp.getHeight() + 20);
					}else{
						tp.el.setY(10);
						tp.bodyContainer.dom.style.height=bottomHeight-50 + 'px';
					}
				}else{
					tp.bodyContainer.dom.style.height=bottomHeight-50 + 'px';
				}
			}
			
			tp.syncSize();
		}
	}
	
	//显示业务提示
	var tp = Artery.getCoolTip({key:'fieldCommentTip'});
	tp.fieldId = this.id;
	initTipWin.call(this, tp);
	tp.alignTo(this.tipEl,'tr?',[0,-12]);
	if (tp.editBtn) {
		tp.editBtn.update('修改');
	}
	tp.bodyContainer.dom.readOnly = true;
	tp.bodyContainer.setStyle('border','0');
	tp.bodyContainer.setStyle('background-color','transparent');
	tp.update(this.comment);
	tp.dd.unlock();
	tp.refreshSize();
}

// ***************************************************************************************//
// loading方法 //
// ***************************************************************************************//
Artery.getLoadingEl = function(){
	if(Artery.loadingEl == null){
		Artery.loadingEl = Ext.get(Ext.DomHelper.insertHtml('beforeEnd',document.body,'<div class="artery-loading x-hidden-display"></div>'));	
	}
	return Artery.loadingEl;
}

Artery.removeLoadingEl = function(){
	if(Artery.loadingEl != null){
		Artery.loadingEl.remove();	
		Artery.loadingEl = null;
	}
}

Artery.showLoading = function(alignEl,position,offset){
	Artery.getLoadingEl().alignTo(alignEl,position,offset);
	Artery.getLoadingEl().show();
}

Artery.hideLoading = function(){
	Artery.removeLoadingEl();
}

// ***************************************************************************************//
// 公共方法 //
// ***************************************************************************************//
Artery.showSysError = function(cfg){
	if (Artery.isShowError()) {
		return;
	}
	var error = "<span style='height:20px;color:red;'>出错啦，请检查！</span>";
	if(cfg.itemid){
		error += "<br><span style='width:60px;'>组件id:</span>" + cfg.itemid;
	}
//	if (cfg.fieldLabel != null) {
//		error += "<br><span style='width:60px;'>组件名称:</span>" + cfg.fieldLabel;
//	} else if (cfg.text != null) {
//		error += "<br><span style='width:60px;'>组件名称:</span>" + cfg.text;
//	}
	if (cfg.prop) {
		error += "<br><span style='width:60px;'>属性名称:</span>" + cfg.prop;
	}
	error += "<br><span style='width:60px;'>错误信息:</span>" + cfg.error;
	Artery.showError(error);
	if(cfg.event){
		throw cfg.event;
	}
}

// Ext2.2中applyIf的实现
Artery.applyIf = function(o, c){
    if(o && c){
        for(var p in c){
            if(typeof o[p] == "undefined"){ o[p] = c[p]; }
        }
    }
    return o;
}

var timer1;

// 根据xml创建dom对象
function loadXMLString(xmlString) {
	var xmlDoc = null;
	try {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlString, "text/xml");
	} catch (e) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.loadXML(xmlString);
	}
	return xmlDoc;
}

// 判断字符串是否为空
String.prototype.isEmpty = function() {
	return ((this.replace(/ /g, "").length == 0) ? true : false);
};
//格式化字符串
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/*
 * type: 1:warning; 2:ok; 3:info; 4:error
 */
function showTips(msg, type) {
	Artery.getExt(top).getTipMessage().showMessage(msg, type);
}
/*
 * 显示进度条 param title 进度条窗口的标题 param msg 进度条提示信息
 */
function showProcess() {
	var argv = showProcess.arguments;
	var argc = showProcess.arguments.length;
	var title = (argc > 0) ? argv[0] : "\u8fdb\u5ea6\u663e\u793a";// 进度显示
	var msg = (argc > 1) ? argv[1] : "\u6b63\u5728\u5904\u7406\u8bf7\u6c42...";// 正在处理请求...
	Ext.Msg.show({
				title : title,
				msg : msg,
				width : 240,
				progress : true,
				closable : false
			});
	v = 0;
	var f = function() {
		v = v + 1;
		Ext.Msg.updateProgress((v % 20) / 20, msg);
	};
	timer1 = setInterval(f, 50);
}
/*
 * 隐藏进度条
 */
function hideProcess() {
	clearInterval(timer1);
	Ext.Msg.hide();
}

//Ext.Shadow.prototype.show = function(target){}

/**
 * 获得根据artery.multiSelectSeparator配置项分割的值
 * 若没有配置，则以“;”分号分割
 * 保留此方法是为了兼容以前版本
 */
Artery.getCommaSplitValue = function(v){
	return Artery.getSplitValue(v);
}

/**
 * 获得根据artery.multiSelectSeparator配置项分割的值
 * 若没有配置，则以“;”分号分割
 */
Artery.getSplitValue = function(v) {
	if(!Ext.isEmpty(v)) {
		var separator = Artery.getMultiSelectSeparator();
		if(v.indexOf(",")!=-1 && "," != (separator)) {
			return v.replace(/,/g, separator);
		}
		if(v.indexOf(";")!=-1 && ";" != (separator)) {
			return v.replace(/;/g, separator);
		}
	}
	return v;
}

Artery.getMultiSelectSeparator = function() {
	var separator = Artery.config.multiSelectSeparator;
	if(Ext.isEmpty(separator))
		return ";";
	else 
		return separator;
}

/**
 * 创建隐藏输入框，id="控件id_hidden"，name="控件name";
 * 控件disable时，能够提交到服务器
 * @param string id      控件id
 * @param string name    控件name
 * @param string value   控件值
 * @return 
 */
Artery.createHiddenInput = function(id, name, value) {
	var hiddenEl = document.createElement("input");
	hiddenEl.type = "hidden";
	hiddenEl.id = id + "_hidden";
	hiddenEl.name = name;
	hiddenEl.value = value;
	return hiddenEl;
}

/**
 * 设置控件的提交时隐藏输入框的值
 * @param {} item
 */
Artery.setSubmitHiddenValue = function(id, value) {
	var hiddenEl = document.getElementById(id + "_hidden");
	if (hiddenEl) {
		hiddenEl.value = value;
	}
}

Artery.getStateTagName = function(state) {
	var tagName = null;
	if(state == "insert"){
		tagName = "InsertItems";
	}else if(state == "update"){
		tagName = "UpdateItems";
	}else if(state == "display"){
		tagName = "DisplayItems";
	}else if(state == "print"){
		tagName = "PrintItems";
	}
	return tagName;
}

/**
 * 获得Ext对象
 * @author lisy
 * */
Artery.getExt = function(top) {
	if (Artery.isSameContext(top)) {
		return top.Ext;
	}
	var p = window;
	while (p.parent && p != p.parent && p != top) {
		if (!Artery.isSameContext(p.parent, p)) {
			return p.Ext;
		}
		p = p.parent;
	}
	var o = window;
	while (o.opener && o != o.opener && o != top) {
		if (!Artery.isSameContext(o.opener, o)) {
			return o.Ext;
		}
		o = o.opener;
	}
	var d = window;
	while (d.dialogArguments && d != d.dialogArguments && d != top) {
		if (!Artery.isSameContext(d.dialogArguments, d)) {
			return d.Ext;
		}
		d = d.dialogArguments;
	}
	return Ext;
}

/** 判断两个window是都上下文相同 */
Artery.isSameContext = function(pwin, win) {
	try {
		win = win || window;
		return win.Artery && win.sys && pwin.Artery && pwin.sys && pwin.sys.getContextPath() == win.sys.getContextPath();
	} catch(e) {}
	return false;
}

/**
 * 自定义事件
 * 例：Artery.Event.onResizestart(function(){})
 * @type 
 */
Artery.Event = {
		/**
     * 为元素绑定事件.
     * @param {Object} elem		:	元素DOM对象.
     * @param {String} type		:	事件类型,不加'on'.
     * @param {Function} func	:	事件逻辑.
     */
    addEvent : function(elem, type, func){
        if (document.addEventListener) {
            elem.addEventListener(type, func, false);
        }
        else {
            elem.attachEvent('on' + type, func);
        }
    },
	
	/**
	 * 注册调整窗口结束后事件.
	 * @param {Function} onResizend	:	无参回调函数.
	 */
	onResizend : function(onResizend){
		/**
		 * <<<算法说明>>>
		 * --------------------------------------------------------------------------------- 
		 * 1. 默认窗口状态 normal.
		 * 2. 调整窗口大小时状态 resizing.
		 * 3. 调整窗口大小时设置动作状态为 resizing, 并设置延时任务. 若已存在延时任务,则重新设置.
		 * 4. 若500毫秒后没有断续调整大小,则认为调整结束,执行resizend事件.
		 */
		var actionState = 'normal',
			taskPtr = null,
			timeOutTask = function(){
				taskPtr && clearTimeout(taskPtr);
				taskPtr = setTimeout(function(){
					onResizend && onResizend();
					actionState = 'normal';
				},100)
			};	
							
		this.addEvent(
			window, 
			'resize', 
			function(){
				actionState = 'resizing';			
				timeOutTask();
			}
		);
	},
	
	/**
	 * 注册开始调整窗口时事件.
	 * @param {Function} onResizestart	:	无参回调函数.
	 */
	onResizestart : function(onResizestart){		
		var isExecuted = false;	
		this.onResizend(function(){isExecuted = false;});				
		this.addEvent(
			window, 
			'resize', 
			function(){				
				if(!isExecuted){
					onResizestart && onResizestart();
					isExecuted = true;
				}
			}
		);
	}
}

/**
 * 解决BACKSPACE导致页面回退的问题
 * 
 * */
Ext.EventManager.on(Ext.isIE ? document : window, "keydown", function(e, t) {
	var tagName = t.tagName.toLowerCase();
	var isInput = tagName == "textarea"
	                      || tagName == "input"
	                      || t.contentEditable == "true"
	if (e.getKey() == e.BACKSPACE &&
			(!isInput || t.disabled || t.readOnly)) {
		e.stopEvent();
	}
}); 
