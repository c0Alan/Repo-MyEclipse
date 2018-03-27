
// ***************************************************************************************//
// 连接地址 //
// ***************************************************************************************//
// 表单
Artery.FORM_URL = sys.getContextPath() + "/artery/form/dealParse.do?action=parseForm&formid=";

// 报表
Artery.REPORT_URL = sys.getContextPath() + "/artery/report/dealParse.do?action=parseForm&formid=";

// 文书
Artery.WRIT_URL = sys.getContextPath() + "/artery/writparse.do?action=parse&writtplid=";

// 子系统
Artery.SYS_URL = sys.getContextPath() + "/artery/subsys.do?action=enterSystem&sysID=";

// 外挂表单解析URL
Artery.PLUGIN_URL = sys.getContextPath() + "/artery/pluginmake.do?action=run";

// 执行beanshell脚本的地址
Artery.SCRIPT_URL = sys.getContextPath() + "/artery/script.do?action=run";

// 消息区链接地址
Artery.MSG_URL = sys.getContextPath() + "/artery/message/dealMessage.do?action=listMessage";

var EXPORT_HTML = 1;
var EXPORT_PDF = 2;
var EXPORT_EXCEL = 3;
var EXPORT_CSV=4;
var EXPORT_XLS=5;

// ***************************************************************************************//
// 组件方法 //
// ***************************************************************************************//
// 初始化指定的组件
Artery.initItem = function(cfg){
	if(cfg == null){
		return null;
	}
	var item = Ext.getCmp(cfg.id);
	if(item == null){
		item = Ext.create(cfg);
		//alert(item.id + ":" + Ext.get(item.id) + ":" + document.getElementById(item.id));
		item.el = Ext.get(item.id);
		item.render();
	}else if(!item.rendered){
		//alert(this.id + ":warnCreate!")
		item.render();
	}
	return item;
}

// 添加需要初始化的子组件
Artery.addInitSub = function(obj, sub){
	//对于Ajax请求重新解析控件需要立即初始化
	if(document.body != null){
		Artery.initItem(sub);
	}else{
		if (obj.initSubs == null) {
			obj.initSubs = [];
		}
		obj.initSubs.push(sub);
	}
}

// 初始化组件的子组件
Artery.initSubItems = function(comp){
	var items = comp.initSubs;
	if(items && items.length>0){
		delete comp.initSubs;
		for(var i=0;i<items.length;i++){
				Artery.initItem(items[i]);
		}
	}
}

// 获得对象方法
Artery.get = function(id) {
	if(Ext.isEmpty(id) || id.indexOf('-')!= -1){
		return;
	}
	var cmp = Ext.getCmp(id);
	if(cmp == null || !cmp.rendered){
		cmp = eval("Artery.initItem(Artery.cfg_"+id+")");
	}
	
	return cmp;
}

Artery.getCmp = function(id) {
	return Artery.get(id);
}

// 得到参数
Artery.getParams = function(cfg, item) {
	cfg = cfg || {};
	cfg = Ext.decode(Ext.encode(cfg));
	var params = Ext.apply({}, Artery.params);
	if(item && item.linktoId) {Ext.apply(params, Artery.linktoParams[item.linktoId]);}

	cfg.formid = cfg.formid || cfg.formId || Artery.getFormId(item) || params.formid || params.formId;
	delete cfg.formId;
	delete params.formId;

	cfg.itemid = cfg.itemid || cfg.itemId || (item && item.getItemId ? item.getItemId() : Artery.getEventId(item)) || params.itemid || params.itemId;
	delete cfg.itemId;
	delete params.itemId;

	Ext.apply(params, cfg);
	return params;
}

// 增加组件方法
Artery.addItem = function(obj, item) {
	if(obj == null){
		return;
	}
	if (obj.items == null) {
		obj.items = [];
	}

	obj.items[obj.items.length] = item;
	item.pid = obj.id;
}

// 增加组件方法
Artery.addButton = function(obj, button) {
	if(obj == null){
		return;
	}
	if (obj.buttons == null) {
		obj.buttons = [];
	}
	obj.buttons[obj.buttons.length] = button;
}

// 添加子节点（树）
Artery.addChildNode = function(obj, treeNode) {
	if(obj == null){
		return;
	}
	if (obj.children == null) {
		obj.children = [];
	}
	obj.children[obj.children.length] = treeNode;
}

//得到window对象
Artery.getWindow = function(){
	return window;
}

// ***************************************************************************************//
// 脚本方法 //
// ***************************************************************************************//
// 创建远程调用对象
Artery.createCaller = function(item, eventName,formId) {
	var itemId = "";
	if (Ext.isString(item)) {
		itemId = item;
	} else {
		itemId = Artery.getEventId(item)
	}
	
	var runner = new Artery.script.ScriptRunner();
	if (item) {
		runner.item = item;
		runner.put("itemid", itemId);
	} else {
		return null;
	}
	if(formId){
		runner.put("formid", formId);
	}else if(Artery.params != null ){
		if (Artery.params.formid) {
			runner.put("formid", Artery.params.formid);
		} else if (Artery.params.frameid) {
			runner.put("formid", Artery.params.frameid);
		} else if (Artery.params.writtplid) {
			runner.put("formid", Artery.params.writtplid);
		} 
	}else {
		return null;
	}

	if (eventName) {
		runner.put("eventName", eventName);
	} else {
		return null;
	}
	
	// 动态创建的控件直接调用服务器端方法
	if(item.dynamicItem){
		runner.put("dynamicItem", "true");
		var eventMethod = item.dynamicEvent[eventName];
		if(!Ext.isEmpty(eventMethod)){
			runner.put("dynamicMethod", eventMethod);
		}
	}
	
	return runner;
}

Artery.getEventId = function(item){
	if (Ext.isEmpty(item)) {
		return null;
	}
	if(Ext.isString(item)){
		var idx = item.indexOf('_AcloneA_');
		if(idx != -1){
			return item.substring(0,idx);
		}
		return item;
	}
	if(item.eventId){
		return item.eventId;
	}
	return item.id;
}

Artery.getFormId = function(item){
	return Ext.isEmpty(item) ? null : item.formId;
}

// ***************************************************************************************//
// Chcekbox参数对象 //
// ***************************************************************************************//
/**
 * Artery Data component
 * 
 * @author baon
 * @date 19/06/2008
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.CParam = function(cfg) {
	this.id = null;
	this.value = '';
	this.params = [];
	
	this.removeParams = [];

	Ext.apply(this, cfg);
}

Artery.CParam.prototype = {
	toValue : function() {
		this.value = this.params.join(',');
		return this.value;
	},

	addParam : function(param) {
		if (!this.containParam(param)) {
			this.params.push(param);
			this.toValue();
		}
					
		for (var i = 0; i < this.removeParams.length; i++) {
			if (this.removeParams[i] == param) {
				this.removeParams.remove(this.removeParams[i]);
			}
		}
	},

	removeParam : function(param) {
		this.removeParams.push(param);
		for (var i = 0; i < this.params.length; i++) {
			if (this.params[i] == param) {
				this.params.remove(this.params[i]);
				this.toValue();
				return;
			}
		}
		
	},

	containParam : function(param) {
		for (var i = 0; i < this.params.length; i++) {
			if (this.params[i] == param) {
				return true;
			}
		}
		return false;
	},

	cleanParams : function() {
		this.params = [];
		this.removeParams = [];
		this.value = '';
	},

	getParams : function() {
		var p = "{" + this.id + ":'" + String.escape(this.value) + "'}";
		return Ext.decode(p);
	},
	
	getRemoveParams: function(){
		var p = "{" + this.id + ":'" + String.escape(this.removeParams.join(',')) + "'}";
		return Ext.decode(p);
	}
}

// ***************************************************************************************//
// 父窗口window对象 //
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

Artery.Win = {
	
	close : function() {
		if (opener != null || window.dialogArguments) {
			window.close();
		} else if (window.winObj != null) {
			window.winObj.close();
		}
	},

	getCmp : function(id) {
		return this.getWindow().Artery.getCmp(id);
	},
	
	get : function(id) {
		return this.getWindow().Artery.get(id);
	},
	
	getWindow: function(){
		try {
			if (opener && Artery.isSameContext(opener)) {
				return opener;
			} else if (window.winObj && window.winObj.opener && Artery.isSameContext(window.winObj.opener)) {
				return window.winObj.opener;
			}else if( window.dialogArguments && Artery.isSameContext(window.dialogArguments)){
				return window.dialogArguments;
			}else if(parent && Artery.isSameContext(parent)){
				return parent;
			}else{
				return window;
			}
		} catch (e) {}
		return null;
	},
	
	getWin: function(){
		return this.getWindow().Artery.getWin();
	},
	
	showTip: function(message,alignEl){
		this.getWindow().Artery.showTip(message,alignEl);
	},
	
	showTipError: function(message,alignEl){
		this.getWindow().Artery.showTipError(message,alignEl);
	},

	callback: function(funcName){
		var subWin = this.getWindow();
		(subWin[funcName])(window,Artery);
	}
};

/**
 * 查找指定的子表单
 * @param iframeId 子表单id，可以是操作区域id(OperArea)或tab面板id(tabItem)
 */
Artery.getWin = function(iframeId) {

	var ds = function(searchWin,iframeId,path){
		var win = searchWin.frames[iframeId + "_iframe"];
		if (win != null && win.Artery) {
			path.push(iframeId + "_iframe");
			return win.Artery;
		}
		
		for(var i=0;i<searchWin.frames.length;i++){
			var sw = searchWin.frames[i];
			var wa = ds(sw.window,iframeId,path);
			if(wa!=null){
				path.push(i);
				return wa;
			}
		}
		return null;
	}

	if (iframeId == null) {
		return Artery.Win;
	} else {
		var path = [];
		var win = ds(Artery.TopWinManager.getTopWin(),iframeId,path);
		if(win!=null){
			//alert(path.join(" <- "));
			return win;
		}
		if(opener && opener.Artery){
			win = ds(opener.Artery.TopWinManager.getTopWin(),iframeId,path);
			if(win!=null){
				//alert(path.join(" <- "));
				return win;
			}
		}
	}
}

// ***************************************************************************************//
// MixedCollection //
// ***************************************************************************************//
/**
 * Artery MixedCollection component
 * 
 * @author baon
 * @date 19/06/2008
 * 
 */
Artery.objMap = new Ext.util.MixedCollection();

Artery.addObjToMap = function(key, obj) {
	if (arguments.length == 1) {
		var id = Ext.id();
		Artery.objMap.add(id, key);
		return id;
	} else {
		Artery.objMap.add(key, obj);
		return key;
	}
}
Artery.getObjFromMap = function(id) {
	return Artery.objMap.get(id);
}
// ***************************************************************************************//
// 提示Panel //
// ***************************************************************************************//
/**
 * Artery.TipPanel
 * 
 * @author baon
 * @date 11/09/2008
 * 
 */
Artery.TipPanel = function(cfg) {
	Ext.apply(this, cfg);
	this.initComponent();
}

Artery.TipPanel.prototype = {
	defaultAutoCreate : {
		tag : "div",
		id : "tipPanel-aty",
		cls:'x-aty-tipPanel x-hidden-display',
		
		cn:[{
			tag:'div',
			cls:'x-aty-tipPanel-header',
			cn:[{
				tag:'span',
				cls:'x-aty-tipPanel-header-close'
			}]
		},{
			tag:'div',
			cls:'x-aty-tipPanel-body'
		}]
	},

	initComponent : function() {
		Ext.DomHelper.append(document.body, this.defaultAutoCreate);
		this.el = Ext.get("tipPanel-aty");
		this.header = this.el.child('.x-aty-tipPanel-header');
		this.headerClose = this.el.child('.x-aty-tipPanel-header-close');
		this.body = this.el.child('.x-aty-tipPanel-body');
		
		this.headerClose.on('click',function(e){
			this.hide();
		},this);

		this.el.on("click", function(e) {
					e.stopEvent();
				}, this)

		this.el.on("mousedown", function(e) {
					e.stopEvent();
					this.x = e.getPageX();
					this.y = e.getPageY();
					this.ex = this.el.getX();
					this.ey = this.el.getY();
				}, this)

		this.el.on("mousemove", function(e) {
					if (e.button == 0) {
						var x = this.ex + (e.getPageX() - this.x);
						var y = this.ey + (e.getPageY() - this.y);
						this.el.setXY([x, y]);
					}
				}, this)
	},

	showAt : function(xy) {
		this.adjustForConstraints(xy);
		this.el.setXY(xy);
		this.el.show();
		this.hidden = false;
	},
	
	alignTo: function(otherEl,position,relative){
		this.el.show();
		this.el.alignTo(otherEl,position,relative);
	},

	adjustForConstraints : function(xy) {
		xy[0] = xy[0] + 10;
		xy[1] = xy[1] + 10;
	},

	hide : function() {
		this.el.hide();
	},

	update : function(tip) {
		this.body.update(tip);
	}

}

Artery.tipp=[];
Artery.getTipPanel = function(cfg) {
	if (Artery.tipp[cfg.key] == null) {
		Artery.tipp[cfg.key] = new Artery.TipPanel(cfg);
	}
	return Artery.tipp[cfg.key];
}
// ***************************************************************************************//
// 提示Win //
// ***************************************************************************************//
/**
 * Artery.CoolTip
 * 
 * @author baon
 * @date 11/09/2008
 * 
 */
if(Ext.Tip){
Artery.CoolTip = Ext.extend(Ext.Tip,{
	
	arrowDirection:'left',
	
	initComponent: function(){
		this.width = 150;
		this.cls = 'x-aty-tipWin-' + this.arrowDirection;
		this.draggable = true;
		Artery.CoolTip.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
		Artery.CoolTip.superclass.onRender.call(this,ct,position);
		Ext.DomHelper.overwrite(this.body,{
			tag : "div",
			cn:[{
				tag:'div',
				cls:'x-aty-tipPanel-header',
				cn:[{
					tag:'span',
					cls:'x-aty-tipPanel-header-close'
				}]
			},{
				tag:'div',
				cls:'x-aty-tipPanel-body'
			}]
		})
		this.header = this.el.child('.x-aty-tipPanel-header');
		this.headerClose = this.el.child('.x-aty-tipPanel-header-close');
		this.headerClose.on('click',function(e){
			this.hide();
		},this);
		this.bodyCt = this.el.child('.x-aty-tipPanel-body');
		this.onRenderBody(this.bodyCt);
	},
	
	onRenderBody: function(body){
		
	},
	
	afterRender : function(){
		Artery.CoolTip.superclass.afterRender.call(this);
		this.dd.setHandleElId(this.el.id);
	},
	alignTo: function(otherEl,position,relative){
		this.show();
		this.el.alignTo(otherEl,position,relative);
	},
	update : function(tip) {
		this.bodyCt.update(tip);
	},
	changeTipPosition:function(pos){
		this.el.replaceClass('x-aty-tipWin-' + this.arrowDirection,'x-aty-tipWin-' + pos);
		this.arrowDirection = pos;
	}
})
Artery.coolTip=[];
Artery.getCoolTip = function(cfg) {
	if (Artery.coolTip[cfg.key] == null) {
		Artery.coolTip[cfg.key] = new Artery.CoolTip(cfg);
	}
	return Artery.coolTip[cfg.key];
}

Artery.getFieldErrorCollTip = function(){
	return Artery.getCoolTip({
		key:'fieldValidTip',
		arrowDirection:'top',
		bodyStyle:'padding-bottom:15px;',
		style:'z-index:19999;'
	});
}
}

Artery.correctTipPosition = function(){
	if(Ext.Tip){
		var tip = Artery.getFieldErrorCollTip();
		if(tip.isVisible()){
			tip.correctPosition();
		}
	}
}
// ***************************************************************************************//
// 公共方法 //
// ***************************************************************************************//

/**
 * 得到日期菜单的显示坐标
 * 
 * @author baon
 * @date 19/06/2008
 * 
 */
Artery.getXY = function(e, menuEl) {
	var fn = function(win){
		var point = {};
		var x = 0;
		var y = 0;
		while(Artery.pwin != win ){
			var iframeEl = win.parent.Ext.get(win.frameElement);
			x +=  iframeEl.getLeft();
			y += iframeEl.getTop();
			win = win.parent;
		}
		point.x = x;
		point.y = y;
		return point;
	}
	
	var x =0, y=0;
	var el = Ext.get(e.srcElement ? e.srcElement : e.target).parent(".x-form-field-wrap");
	if (Artery.pwin == window) {
		x = el.getLeft() + (el.getWidth() - menuEl.getWidth());
		y = el.getTop() + el.getHeight();
		// alert(el.getHeight() + ":" + (Ext.getBody().getHeight() - y))
		if ((Ext.getBody().getHeight() + Ext.getBody().getScroll().top - y) < 202) {
			y = Ext.getBody().getHeight() + Ext.getBody().getScroll().top - 202
					- el.getHeight();
		}
	} else {
		var point = fn(window);
		x = point.x;
		y = point.y;
		var iframeEl = parent.Ext.get(window.frameElement);
		x += el.getLeft() + (el.getWidth() - menuEl.getWidth());
		y += el.getTop() + el.getHeight();
		var parentPoint = fn(parent);
		var parentHeight = parentPoint.y + parent.Ext.getBody().getHeight();
		if ((parentHeight + parent.Ext.getBody().getScroll().top - y) < 202) {
			y = parentHeight + parent.Ext.getBody().getScroll().top - 202
					- el.getHeight();
		}

	}
	if(x < 0){
		x = 0;
	}
	return [x, y];
}

/**
 * 退出登录
 * 
 * @author baon
 * @date 15/08/2008
 * 
 */

Artery.logout = function(callbak) {
	// 得到初始化数据
	Artery.request({
		url : sys.getContextPath()
				+ "/artery/form/dealParse.do?action=parseLogout",
		success : function(response, options) {
			var resObj = response.responseText;
			if (resObj != null) {
				resObj = Ext.decode(resObj);
			}
			if (resObj != null && resObj.success == false) {
				Artery.showError("出错啦，请检查！" + "<br>" + resObj.error)
			} else if (callbak != null && typeof callbak == "function") {
				callbak.call(this, resObj);
			}
		},
		params : Artery.getParams(),
		scope : this
	})
}

/**
 * 打开表单
 * 
 * @author weijx
 * @date 22/10/2008
 */
Artery.openForm = function(cfg) {
	if (cfg) {
		if (!cfg.runTimeType) {
			cfg.runTimeType = "update";
		}
		if (!cfg.target) {
			cfg.target = "_self";
		}
		if (!cfg.params) {
			cfg.params = {};
		}
	
		if(cfg.paramsRequest){
			for(var p in Artery.params){
				// 参数在排除集合，则忽略
				if(p=="action"||p=="formid"||p=="runTimeType"||p=="formType"||p=="itemid"||p=="itemType"||p=="moreProp"||p=="buttonItemid"){
					continue;
				}
				// 参数在linkto中已设置，则忽略
				if(cfg.params[p]===undefined){
					cfg.params[p] = Artery.params[p];
				}
			}
		}
		Artery.parseWinCfg(cfg,Artery.awinid);
		//判断system是否为空，不为空则添加到参数中
		var config = Artery.getParams();
		if(config.system){
			cfg.system=config.system;
		}
		var win = null;
		var url = null;
		var isFormPost = false;
		//throw e;
		url = Ext.tusc.getLinkUrl(cfg);
		if(!(url && cfg))
			return;
		if((cfg.urlmethod && cfg.urlmethod.replace(/^\s+|\s+$/g,"").toLowerCase()=='post') ||
		(url.length > 1000  &&(!cfg.urlmethod || cfg.urlmethod.replace(/^\s+|\s+$/g,"").toLowerCase()!='get'))){
			//_self比较特殊，直接在当前document创建form并提交
			if(cfg.target == '_self'){
				Artery.autoSubmitForm(window,cfg);
				return;
			}
			if(cfg.url)
				cfg.urlbak = cfg.url;
			else
				cfg.urlbak = "";
			cfg.url ='about:blank'
			cfg.urlmethod = 'post'
			isFormPost = true;
		}
		if (cfg.formId || cfg.url) {
			if (cfg.target == '_window') {
				win = Ext.getWindow(cfg);
			} else {
				win = Ext.getBlankWindow(cfg);
			}
		}
		if(win && isFormPost){
			cfg.url = cfg.urlbak;
			Artery.autoSubmitForm(win,cfg);
		}
		if(win && cfg.target!='_window'&& cfg.forceFocus){
			win.focus();
		}
		return win;
	}
}
//通过创建Form,利用post方式提交
Artery.autoSubmitForm = function(win,cfg){
	var doc = null;
	var url = "";
	//获取打开页的document
	var tagName = "_self";
	try{
		if(cfg.target == '_window'){
			doc = win.getIframe().contentWindow.document;//window.frames(win.getId()+"iframe").document;
			tagName = win.getIframe().name;
		}else{
			tagName = win.name;
			try{
				doc = window.frames(win.name).document
			}catch(e){
				doc = win.document;
			}
		}
	}catch(e){}
	//提交表单
	if(doc){
		url = Ext.tusc.getBaseUrl(cfg);
 		try{
 			var submitForm = doc.createElement("FORM");
    		doc.appendChild(submitForm);
    		submitForm.method = "POST";
    		submitForm.action = url;
    		if(tagName && tagName!=""){
    			submitForm.target = tagName;
    		}
    		if(cfg.expName){
    			submitForm.onclick="window.open('about:blank',"+cfg.expName+")"; 
    			submitForm.target=cfg.expName;
    		}
    		var newElement ;
    		for(var key in cfg.params){
    			//alert(cfg.params[key]);
	    		newElement= doc.createElement("input");
			    newElement.setAttribute("name",key);
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",cfg.params[key]);
			    submitForm.appendChild(newElement);
    		}
    		submitForm.submit();
 		}catch(e){}
	}
}

/**
 * 下载文件
 * 
 * @author baon
 * @date 20/11/2008
 */
Artery.download = function(params){
	var p = Artery.getParams(params);
	var formid = Artery.getFormId(Artery.get(p.itemid));
	if (formid) {
		p.formid = formid;
	}
	var url = sys.getContextPath()+ "/artery/form/dealParse.do?action=download&" + Ext.urlEncode(p);
	if(url.length>1000){
		cfg={};
		cfg.params=p;
		cfg.url="/artery/form/dealParse.do?action=download";
		Artery.autoSubmitForm(window,cfg);
	}else{
		// IE6下设置window.location.href可能无效，由于javascript:void(0)的原因
		if(Ext.isIE6){
			(function(){
				window.location.href=url;
			}).defer(10);
		}else{
			window.location.href=url;
		}
	}
//	var tempval = Ext.encode(p);
//	var tempobj =Ext.decode(tempval);
//	Ext.tusc.encodeParam(tempobj);
	
}

// ***************************************************************************************//
// 打开窗口方法 //
// ***************************************************************************************//
Artery.getFormUrl = function(formId){
	return Artery.getParseUrl(formId,Artery.FORM);
}
Artery.getReportUrl = function(formId){
	return Artery.getParseUrl(formId,Artery.REPORT);
}
Artery.getWritUrl = function(formId){
	return Artery.getParseUrl(formId,Artery.WRIT);
}
Artery.getPluginUrl = function(formId){
	return Artery.getParseUrl(formId,Artery.PLUGIN);
}

Artery.getParseUrl = function(formId,formType){
	var ctx = sys.getContextPath();
	var url;
	if(formType == null || formType == Artery.FORM){
		url = ctx	+ "/artery/form/dealParse.do?action=parseForm&formid={0}&formType=" + Artery.FORM;
	}else if(formType == Artery.REPORT){
		url = ctx	+ "/artery/report/dealParse.do?action=parseForm&formid={0}&formType=" + Artery.REPORT;
	}else if(formType == Artery.WRIT){
		url = ctx	+ "/artery/writparse.do?action=parse&writtplid={0}&formType=" + Artery.WRIT;
	}else if(formType == Artery.PLUGIN){
		url = ctx	+ "/artery/pluginmake.do?action=run&id={0}&formType=" + Artery.PLUGIN;
	}
	return String.format(url,formId);
}

/**
 * Takes an object and converts it to an encoded URL. e.g. Ext.urlEncode({foo:
 * 1, bar: 2}); would return "foo=1&bar=2". Optionally, property values can be
 * arrays, instead of keys and the resulting string that's returned will contain
 * a name/value pair for each array value.
 * 
 * @param {Object}
 *            o
 * @param {String}
 *            pre (optional) A prefix to add to the url encoded string
 * @return {String}
 */
Artery.urlEncode = function(o, pre) {
	var undef, buf = [], key, e = encodeURIComponent;

	for (key in o) {
		//undef = !Ext.isDefined(o[key]);
		//解决当参数值为null的时候，会出现参数未定义的现象
		undef = Ext.isEmpty(o[key]);
		
		Ext.each(undef ? key : o[key], function(val, i) {
			buf.push("&", e(key), "=", (val != key || !undef) ? e(val) : "");
		});
	}
	if (!pre) {
		buf.shift();
		pre = "";
	}
	return pre + buf.join('');
}

/**
 * 编码参数
 */
Ext.tusc.encodeParam = function(p){
	for(var i in p ){
		if(Ext.isEncode(p[i])){
			p[i] = Artery.escape(p[i]);
		}
	}
}
/**
 * 根据类型得到连接的基本URL
 * @param {} cfg
 * @return {}
 */
Ext.tusc.getBaseUrl = function(cfg){
	var url = null;
	if (cfg.url != null && cfg.url.trim() != "") {
		url = cfg.url;
		var sc = url.substring(0,1);
		if(cfg.forceContextPath != false && sc=="/"){
			url = sys.getContextPath()+url;
		}
	} else {
		if (cfg.formType == null || cfg.formType == Artery.FORM) {
			url = Artery.getFormUrl(cfg.formId);
		} else if (cfg.formType == Artery.REPORT) {
			url = Artery.getReportUrl(cfg.formId);
		} else if (cfg.formType == Artery.WRIT) {
			url = Artery.getWritUrl(cfg.formId);
		} else if (cfg.formType == Artery.PLUGIN) {
			url = Artery.getPluginUrl(cfg.formId);
		}
	}
	if(cfg.system){
		url = url + "&system="+cfg.system;
	}
	return url;
}
/**
 * 根据类型得到链接的Url
 * 
 * @author baon
 * @date 14/05/2008
 */
Ext.tusc.getLinkUrl = function(cfg) {
	if(cfg && cfg.url != null && cfg.url=='about:blank')
		return cfg.url;
		
	var url = null;
	url = Ext.tusc.getBaseUrl(cfg);
	
	//生成参数
	if(cfg.params==null){
		cfg.params = {};
	}
	
	if(url){
		if(url.charAt(0) == '/' && cfg.forceContextPath !== false){
		    //设置运行时类型到参数列表
			if (cfg.runTimeType) {
				cfg.params.runTimeType = cfg.runTimeType;
			}
			// 编码参数
			Ext.tusc.encodeParam(cfg.params);
			//判断是否继承父运行时类型
			if(cfg.params.runTimeType == "parent"){
				if(Artery.params && Artery.params.runTimeType){
					cfg.params.runTimeType = Artery.params.runTimeType;
				}
			}
		}
		var p = Ext.apply({},cfg.params);
		//加入阶段验证参数
		var phaseValidParams = Artery.getValidParams();
		if(phaseValidParams){
			//alert(Ext.encode(phaseValidParams))
			Ext.apply(p,phaseValidParams);
		}
		
		var para = Artery.urlEncode(p);
		if(!Ext.isEmpty(para)){
			if (url.lastIndexOf('?') == -1) {
				url += "?" + para;
			}else{
				url += "&" + para;
			}
		}
	}
	return url;
}

/**
 * 得到窗口(单例）
 * 
 * @author baon
 * @date 20/11/2008
 */
Artery.TopWinManager = (function(){
	var topWin = (function() {
		try{
			if(top.Artery && top.Artery.plugin && top.location.host == location.host && top.sys.getContextPath() == sys.getContextPath()){
				return top;
			}
		}catch(e){}
		try{
			if(parent.Artery && parent.Artery.plugin && parent.location.host == location.host && parent.sys.getContextPath() == sys.getContextPath()){
				return parent;
			}
		}catch(e){}
		return window;
	})();
	if(topWin.winmap == null){
		topWin.winmap =[];
	}
	var lastZIndex = 12000;
	
	return {
		getZIndex: function() {
			lastZIndex++;
			return lastZIndex;
		},
		getTopWin: function(){
			//alert(topWin.winmap.length);
			return topWin;
		},
		getWinMap: function(){
			return topWin.winmap;
		},
		
		getShowWinMap: function(){
			var showmap = [];
			Ext.each(topWin.winmap,function(item,idx){
				if(!item.hidden){
					showmap.push(item);
				}
			})
			return showmap;
		},
		
		closeAll: function(){
			Ext.each(topWin.winmap,function(item,idx,allItem){
				item.tools['close'].dom.click();
			})
		}
	}
})();
Artery.getTopWin = function(cfg){
	var winmap = Artery.TopWinManager.getWinMap();
	var length = winmap.length;
	var win = null;
	var isSetTitle=false;
	//alert(cfg.winId + ":" + length);
	for(var i=0;i<length;i++){
		if(cfg.single && winmap[i].winId == cfg.winId){
			win = winmap[i];
		}
		
		if(win == null && winmap[i].winId == null){
			win = winmap[i];
		}
	}
	if(win && Ext.isEmpty(cfg.wincfg)){
		win.winId = cfg.winId;
		Artery.updateWin(win,cfg);
		return win;
	}
	if(cfg.title!=null&&cfg.title!="undefine"){
		isSetTitle=true;
	}
	var id = Ext.id();
	var wincfg = {
		id:id,
		layout:'fit',
		shadow :false,
		winId: cfg.winId,
		closeAction:'hide',
		height:500,
		width:500,
		// closable: (cfg.closable!==false),
		html : {
			tag : 'iframe',
			id : id + 'iframe',
			name : id + 'iframe',
			style : 'width:100%;height:100%;',
			frameborder : 0,
			allowTransparency:'true',
			onload:"Artery.onWindowLoaded(\""+id+"\","+isSetTitle+"\);"
		}
	};

	if(!Ext.isEmpty(cfg.wincfg)){
		if(typeof cfg.wincfg == 'string'){
			cfg.wincfg = Ext.decode(cfg.wincfg);
		}
		if(typeof cfg.wincfg == 'string'){
			cfg.wincfg = Ext.decode(cfg.wincfg);
		}
		Ext.apply(wincfg,cfg.wincfg);
		wincfg.closeAction = 'close';
	}
	win = new Ext.Window(wincfg)
	
	win.setSrc = function(url){
		document.getElementById(id + "iframe").src=url;
	}
	win.clearSrc = function(){
		document.getElementById(id + "iframe").src="about:blank";
	}
	win.getIframe = function(){
		return document.getElementById(id + "iframe");
	}
	
	// window关闭时执行清理动作
	var clearFunc = function(win){
		var subFrame = document.getElementById(id + "iframe");
		if(win.linktoCfg){
			if (win.linktoCfg.themeStyle) {
				win.removeClass("x-theme-win-" + win.linktoCfg.themeStyle);
			}
			if (win.linktoCfg.closeHandler){
				var subWin = subFrame.contentWindow;
				win.linktoCfg.closeHandler(subWin, subWin.Artery);
			}
		}
		win.linktoCfg = null;
		subFrame.src="about:blank";
		win.winId = null;
		win.opener = null;
	};
	
	win.on('close', function(win) {
		clearFunc(win);
	});
	win.on('hide', function(win) {
		clearFunc(win);
	});
	
	Artery.updateWin(win,cfg);
	if(Ext.isEmpty(cfg.wincfg)){
		winmap.push(win);
	}
	win.winId = cfg.winId;
	return win;
}

/**
 * 父页面是否可以解析对象
 * 
 * @author baon
 * @date 19/06/2008
 * 
 */
Artery.pwin = function() {
	return Artery.TopWinManager.getTopWin();
}();

Artery.onWindowLoaded = function(id,flag){
	var winIframe = window.frames[id+"iframe"];
	if( winIframe!= null){
		if(winIframe.Artery && winIframe.Artery.cfg_bodyPanel){
			winIframe.winObj =Ext.getCmp(id);
		
			if(!flag||flag=="false"){
				winIframe.winObj.setTitle(winIframe.document.title);
			}
			
			if(winIframe.Artery.cfg_bodyPanel.themeName){
				var themeStyle="x-window-iframe-" + winIframe.Artery.cfg_bodyPanel.themeName;
				winIframe.document.body.className += " " + themeStyle;
				winIframe.winObj.el.addClass(themeStyle);
			}
		}
	}
}

/**
 * 更新窗口
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Artery.updateWin = function(win,cfg){
	
	// win保持linkto引用，以便执行closeHandler事件
	win.linktoCfg = cfg;
	
	//modal
	if(Ext.isTrue(cfg.modal)){
		win.modal = true;
	}else{
		win.modal = false;
	}		
	//是否第一次顯示
	var firstShow = !win.rendered;
	//width
	var width = Ext.getNumber(parseInt(cfg.targetWidth), 500);
	var height = Ext.getNumber(parseInt(cfg.targetHeight), 500);
	win.width=width;
	win.height=height;
	if (cfg.themeStyle) {
		win.addClass("x-theme-win-" + cfg.themeStyle);
	}
	win.show();
	//resize
	if(win.resizer){
		if(Ext.isTrue(cfg.resizable) || cfg.resizable == 1 || cfg.resizable == "1"){
			win.resizer.enabled = true;
			win.resizer.el.removeClass("x-window-noresize");
		}else{
			win.resizer.enabled = false;
			win.resizer.el.addClass("x-window-noresize");
		}
	}
	
	//width
	win.setWidth(width);
	win.setHeight(height);	

	// closable
	if(win.tools["close"]){
		win.tools["close"].setVisible(cfg.closable!==false);
	}
	
	// center
	//if(firstShow){
		//win.hide();
		//win.show();
	//}
	//win.center();

	//opener
	
	win.opener = cfg.window;
	//title
	
	win.setTitle(Ext.tusc.getWindowTitle(cfg));
	//position
	if(cfg.x || cfg.y){
		win.setPosition(cfg.x,cfg.y);
	}
	
	var x,y;
	if(!Ext.isEmpty(cfg.targetLeft)){
		x = parseInt(cfg.targetLeft);
	}
	if(!Ext.isEmpty(cfg.targetTop)){
		y = parseInt(cfg.targetTop);
	}
	
	if(!Ext.isEmpty(cfg.targetRight)){
		x = document.body.clientWidth - parseInt(width) - parseInt(cfg.targetRight);
	}
	if(!Ext.isEmpty(cfg.targetBottom)){
		y = document.body.clientHeight - parseInt(height) - parseInt(cfg.targetBottom);
	}
	
	if(x || y){
		win.setPosition(x,y);
	}

	//url
	win.setSrc(cfg.linkUrl);
	
	
	if(cfg.x == null && cfg.y == null && x == null && y == null){
		win.center();
	}
	
    //处理ext内部运算起始坐标时y为负数的情况，保证弹出的窗口的头部是在页面上能看到
    var pos = win.getPosition();
    pos[1]=pos[1]<0?0:pos[1];
    pos[0]=pos[0]<0?0:pos[0];
    win.setPosition(pos[0],pos[1]);
    
    // zIndex
    win.setZIndex(Artery.TopWinManager.getZIndex());
	win.winId = cfg.winId;
}

/**
 * 解析窗口配置
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Artery.parseWinCfg = function(cfg,id){
	if(!cfg){
		return;
	}
	//single
	if(cfg.single == null){
		cfg.single = true;
	}
	if(cfg.winId == null){
		if(id){
			cfg.winId = "win" + id;
		}else{
			cfg.winId = "win" + (Ext.id() + (new Date()).getTime());
		}
	}
}

/**
 * 以Ext的样式打开新窗口
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Ext.getWindow = function(cfg) {
	cfg.window = window;
	cfg.linkUrl = Ext.tusc.getLinkUrl(cfg)
	return Artery.TopWinManager.getTopWin().Artery.getTopWin(cfg);
}

/**
 * 以IE的样式打开新窗口，根据cfg.target，可能有多种行为
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Ext.getBlankWindow = function(cfg) {
	if (cfg.target && cfg.target != "_blank" && cfg.target != "_self"
			&& cfg.target != "_parent" && cfg.target != "_top") {
		// 使用Artery.get方法获得操作区域(可能还没有初始化)
		var operArea = Artery.get(cfg.target);
		if (!operArea && parent.Artery) { // 从父窗口中寻找操作区域
			operArea = parent.Artery.get(cfg.target);
		}
		if (operArea) {
			if(cfg.urlmethod && cfg.urlmethod=='post')
				return operArea.iframeEl;
			return operArea.showLink(Ext.tusc.getLinkUrl(cfg));
		} 
	}
	
	//判断是否模态打开窗口
	if(cfg.target && (cfg.target == "_blank" || cfg.target == "_window") && cfg.modal=="1"){
		Ext.getModalWindow(cfg);
		return;
	}
	
	var features = "";
	// 地址栏
	if (!Ext.isEmpty(cfg.location)) {
		features += ",location=" + cfg.location;
	}
	// 菜单栏
	if (!Ext.isEmpty(cfg.menubar)) {
		features += ",menubar=" + cfg.menubar;
	}
	// 状态栏
	if (!Ext.isEmpty(cfg.status)) {
		features += ",status=" + cfg.status;
	}
	// 标题栏
	if (!Ext.isEmpty(cfg.titlebar)) {
		features += ",titlebar=" + cfg.titlebar;
	}
	// 工具栏
	if (!Ext.isEmpty(cfg.toolbar)) {
		features += ",toolbar=" + cfg.toolbar;
	}
	// 滚动条
	if (!Ext.isEmpty(cfg.scrollbars)) {
		features += ",scrollbars=" + cfg.scrollbars;
	}
	// 调整大小 IE7下设置了宽度和高度，如果想调整大小，必须显示设置resizable参数
	if (Ext.isEmpty(cfg.resizable)) {
		features += ",resizable=1";
	}else{
		features += ",resizable=" + cfg.resizable;
	}
	if (!Ext.isEmpty(cfg.targetLeft)) {
		features += ",left=" + cfg.targetLeft;
	}
	if (!Ext.isEmpty(cfg.targetTop)) {
		features += ",top=" + cfg.targetTop;
	}
	if(!Ext.isEmpty(cfg.targetRight)){
		features += ",left=" + (document.body.clientWidth - Ext.getNumber(parseInt(cfg.targetWidth), 500) - parseInt(cfg.targetRight));
	}
	if(!Ext.isEmpty(cfg.targetBottom)){
		features += ",top=" + (document.body.clientHeight - Ext.getNumber(parseInt(cfg.targetHeight), 500) - parseInt(cfg.targetBottom));
	}
	if (!Ext.isEmpty(cfg.targetHeight)) {
		features += ",height=" + cfg.targetHeight;
	}
	if (!Ext.isEmpty(cfg.targetWidth)) {
		features += ",width=" + cfg.targetWidth;
	}
	if(!Ext.isEmpty(cfg.targetWidth) || !Ext.isEmpty(cfg.targetHeight)){
		// 当没有设置targetLeft,targetTop,targetRight,targetBottom时，才使窗口居中
		if(Ext.isEmpty(cfg.targetLeft) && Ext.isEmpty(cfg.targetTop) && Ext.isEmpty(cfg.targetRight) && Ext.isEmpty(cfg.targetBottom)){
			features += ",left=" + parseInt((screen.availWidth - parseInt(cfg.targetWidth))/2);
			features += ",top=" + parseInt((screen.availHeight - parseInt(cfg.targetHeight))/2);
		}
	}
	if(Ext.isTrue(cfg.fullScreen)){
		features += ",top=0,width=" + screen.availWidth;
		features += ",left=0,height=" + (screen.availHeight - 30);
	}
	//alert(Ext.tusc.getLinkUrl(cfg))
	var win = null;
	try {
		win = window.open(Ext.tusc.getLinkUrl(cfg), cfg.target, features);
	} catch(e) {}
	if (win && (cfg.title || cfg.formName)) {
		var scanFun = function() {
			if (win.document) {
				try{
					win.document.title = cfg.title || cfg.formName;
				}catch(e){
				}
				window.clearInterval(scanInterval);
			}
		}
		var scanInterval = window.setInterval(scanFun, 200);
	}
	if(win && cfg.closeHandler){
		var lis = new Artery.WindowCloseListener(win, cfg.closeHandler);
		lis.startListener();
	}
	if (win) {
		win.focus();
	}
	//修正部分页面在IE6下不能显示到前面的问题
	(function(){
		if (win) {
			win.focus();
		}
	}).defer(10);
	return win;
}

Ext.getWindow = function(cfg) {
	cfg.window = window;
	cfg.linkUrl = Ext.tusc.getLinkUrl(cfg)
	return Artery.TopWinManager.getTopWin().Artery.getTopWin(cfg);
}

// 用于监听openForm打开窗口的关闭事件
Artery.WindowCloseListener = Ext.extend(function(subWin, closeFunc){
	this.subWin = subWin;
	this.closeFunc = closeFunc;
}, {

	// 监听的window对象
	subWin: null,
	
	// 关闭函数
	closeFunc: null,
	
	// 为true，则需要重新监听
	needAttach: false,
	
	startListener: function(){
		var me = this;
		var i = 0;
		var task = function() {
			i++;
			if (me.subWin.document.readyState == "complete") {
				me.subWin.attachEvent("onbeforeunload", function() {
					me.beforeFunc();
				});
			} else if (i < 50){
				task.defer(100);
			}
		};
		task();
	},
	
	beforeFunc: function(){
		var win = this.subWin;
		this.closeFunc(win, win.Artery);
	}
});

/**
 * 得到模态窗口
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Ext.getModalWindow = function(cfg){
	var features = "";
	if (!Ext.isEmpty(cfg.status)) {
		features += "status:" + cfg.status + ";";
	}
	if (!Ext.isEmpty(cfg.resizable)) {
		features += "resizable:" + cfg.resizable + ";";
	}
	if (!Ext.isEmpty(cfg.targetLeft)&&cfg.fullScreen!=true) {
		features += "dialogLeft:" + cfg.targetLeft + ";";
	}
	if (!Ext.isEmpty(cfg.targetTop)&&cfg.fullScreen!=true) {
		features += "dialogTop:" + cfg.targetTop + ";";
	}
	if(!Ext.isEmpty(cfg.targetRight)&&cfg.fullScreen!=true){
		features += "dialogLeft:" + (document.body.clientWidth - Ext.getNumber(parseInt(cfg.targetWidth), 500) - parseInt(cfg.targetRight)) + ";";
	}
	if(!Ext.isEmpty(cfg.targetBottom)&&cfg.fullScreen!=true){
		features += "dialogTop:" + (document.body.clientHeight - Ext.getNumber(parseInt(cfg.targetHeight), 500) - parseInt(cfg.targetBottom)) + ";";
	}
	if (!Ext.isEmpty(cfg.targetHeight)&&cfg.fullScreen!=true) {
		features += "dialogHeight:" + cfg.targetHeight + "px;";
	}
	if (!Ext.isEmpty(cfg.targetWidth)&&cfg.fullScreen!=true) {
		features += "dialogWidth:" + cfg.targetWidth + "px;";
	}
	if(Ext.isTrue(cfg.fullScreen)){
		features += "dialogLeft:" + 0+"px"+ ";";
		features += "dialogTop:" + 0+"px"+ ";";
		features += "dialogHeight:" + (screen.availHeight - 30)+"px"+ ";";
		features += "dialogWidth:" + screen.availWidth+"px"+ ";";
	}
	cfg.url = cfg.urlbak
	window.showModalDialog(Ext.tusc.getLinkUrl(cfg), window, features);
}
/**
 * 得到窗口的标题
 * 
 * @author baon
 * @date 14/05/2008
 * 
 */
Ext.tusc.getWindowTitle = function(cfg) {
	if(cfg.title){
		return cfg.title;
	}else if (cfg.runTimeType == "insert") {
		return "新建表单";
	} else if (cfg.runTimeType == "update") {
		return "修改表单";
	} else if (cfg.runTimeType == "display") {
		return "展现表单"
	} else {
		return "";
	}
}

// ***************************************************************************************//
// 执行item中的逻辑方法 //
// ***************************************************************************************//
/**
 * 执行组件中的逻辑
 * 
 * @param cfg {params:{itemid:'xxxxx',method:'xxxx'},callback:function(result){}}
 * 
 * @author baon
 * @date 20/11/2008
 */
Artery.runLogic = function(cfg){
	Artery.request({
		url : sys.getContextPath()
				+ "/artery/form/dealParse.do?action=runItemLogic",
		success : function(response, options) {
			var result = response.responseText;
			if (result != null) {
				try{
					result = Ext.decode(result);
				}catch(e){
					// 忽略异常
				}
			}
			if (result != null && result.success == false) {
				Artery.showError("出错啦，请检查！" + "<br>" + result.error)
			} else if (cfg.callback != null && typeof cfg.callback == "function") {
				cfg.callback.call(cfg.scope||this, result);
			}
		},
		scope : cfg.scope,
		syn : cfg.syn,
		params : Artery.getParams(cfg.params)
	})
	
		
}

//注册事件
Artery.regItemEvent = function(item,eventName,serverName,acparams){
	if(Ext.isEmpty(item[eventName])){
		return;
	}
	// 参数列表中首先加入点击的组件的id
	if(serverName != null){
		// 只有是onClick事件才更改itemid
		if(serverName=="onClickServer" || serverName=="onDownloadServer"){
			Artery.params.itemid = Artery.getEventId(item);
		}
		var rc = Artery.createCaller(item,serverName,Artery.getFormId(item));
	}
	
	if(acparams){
		for(var i in acparams){
			eval('var ' + i + '=acparams["' + i + '"];');
		}
	}
	var checked = true;
	if (item.checked) {
		checked = !item.checked;
	}
	eval("var fn = function(){"	+ item[eventName] + "\n}");
	return fn.call(item);
}

// 注册linkto事件
Artery.regLinktoEvent = function(item,linktoName){
	var l;
	if(item.onRender){
		// 参数列表中首先加入点击的组件的id
		Artery.params.itemid = Artery.getEventId(item);
		l = item[linktoName];
	}else{
		l = item;
	}
	
	Artery.openForm(l);
}

/**
 * 执行组件中的逻辑
 * 
 * @param cfg {params:{itemid:'xxxxx',method:'xxxx'},callback:function(result){},asyn:true,changeId:true}
 * 
 * @author baon
 * @date 20/11/2008
 */
Artery.parseItem = function(cfg,item){
	var p = Artery.getParams(cfg.params, item);
	if(cfg.changeId === false){
		p.changeId = false;
	}
	
//	//默认同步
//	if(cfg.asyn == null){
//		cfg.asyn = false;
//	}
	Artery.request({
		url : sys.getContextPath()
				+ "/artery/form/dealParse.do?action=parseItem",
		callback  : function(options, success, response) {
			var result = response.responseText;
			if (result != null) {
				result = Ext.decode(result);
			}
			if (result != null && result.success == false) {
				Artery.showError("出错啦，请检查！" + "<br>" + result.error)
			} else if (cfg.callback != null && typeof cfg.callback == "function") {
				cfg.callback.call(cfg.scope||this, result);
			}
		},
		scope : cfg.scope,
		syn : cfg.asyn,
		params : p
	})
}
/**
 * 得到指定组件id的指定属性名称
 * 
 * @author baon
 * @date 09/09/2010
 */
Artery.fetchItemPorp = function(itemId,propName){
	var p = {};
	p.formid = Artery.params.formid;
	p.itemid = itemId;
	p.propName = propName;
	var prop;
	Artery.request({
		url : sys.getContextPath()
				+ "/artery/form/dealParse.do?action=fetchItemPorp",
		success : function(response, options) {
			prop = response.responseText;
		},
		syn:false,
		params : p
	})
	return prop;
}

//得到当前页面的所有表单对象
Artery.getAllFormAreas = function(){
	var forms=[];
	Ext.select('form.a-formArea').each(function(item,idx){
		forms.push(Artery.get(item.dom.id.replace("-atbody",'')));
	})
	return forms;
}

//得到当前解析的表单id
Artery.getCurrentFormId = function(){
	return Artery.params.formid
}


/**
 * 恢复数据，调用组件的setValue方法
 * 
 * @author baon
 * @date 18/10/2010
 */	
Artery.recoverFormData = function(values){
	if(values == null || Ext.isEmpty(values)){
		return;
	}
	if(Ext.isString(values)){
		values = Ext.decode(values);
	}
	for(var i in values){
		if(Artery.get(i)!= null && Artery.get(i).setValue){
			Artery.get(i).setValue(values[i]);
		}
	}
}
/**
 * 得到表单中的数据，调用组件的getValue方法
 * 
 * @author baon
 * @date 18/10/2010
 */	
Artery.getFormData = function(){
	var data = {};
	var fn = function(item){
		if(item.xtype =='apformarea'){
			var formArea = Artery.get(item.id);
			Ext.apply(data,formArea.getFormData());
		}else if(item.items){
			var length = item.items.length;
			for(var i=0;i<length;i++){
				fn(item.items[i]);
			}
		}
	}
	fn(Artery.cfg_bodyPanel);
	return Ext.encode(data);
	
}


Artery.getFormDataId = function(){
	var np = Artery.cfg_bodyPanel.namedParams;
	if(Ext.isEmpty(np)){
		var identityItem;
		var fn = function(item){
			if(item.xtype =='apFaIdentity'){
				identityItem = item;
				return;
			}else if(item.items){
				var length = item.items.length;
				for(var i=0;i<length;i++){
					fn(item.items[i]);
				}
			}
		}
		fn(Artery.cfg_bodyPanel);
		if(identityItem){
			return Artery.get(identityItem.id).getValue();
		}
		return "";
	}
	var fn = function(param){
		var v = Artery.params[param];
		if(v){
			return v;
		}
		v = Artery.get(param).getValue();
		return v;
	}
	var p = {};
	var anp = np.split(',');
	var length = anp.length;
	for(var i=0;i<length;i++){
		p[anp[i]] = fn(anp[i]);
	}
	return Ext.decode(p);
}

/**
 * 封装请求调用，处理异常提示
 * 
 * @author baon
 * @date 18/10/2010
 */	
Artery.request = function(cfg){
	if(cfg.success){
		cfg.success = cfg.success.createInterceptor(function(response, options){
			var text = response.responseText;
			if(!Ext.isEmpty(text)){
				if(text.indexOf('arterySysError')!=-1){
					try{
						text = Ext.decode(text);
						if(!Ext.isEmpty(text["arterySysError"])){
							if(Artery.config.exceptionTip){
								if(Artery.config.exceptionTip == '2'){
									Artery.showTipError(text["arterySysError"]);
								}else if(Artery.config.exceptionTip == '1'){
									Artery.showError("出错啦，请检查！<br>" + text["arterySysError"]);
								}else{
									var fn = eval(Artery.config.exceptionTip);
									fn.call(this,text["arterySysError"]);
								}
							}else{
								Artery.showError("出错啦，请检查！<br>" + text["arterySysError"]);
							}
							return false;
						}
					}catch(e){
					}
				}
			}
		},cfg.scope);
	}
	if (cfg.params && cfg.scope && cfg.scope.custParams) {
		// 设置用户自定义参数
		cfg.params.custParams = Ext.encode(cfg.scope.custParams);
	}
	Ext.Ajax.request(cfg);
}

Artery.swapStyleSheet = function(id,url){
	Ext.util.CSS.swapStyleSheet(id,url);
	for(var i=0;i<window.frames.length;i++){
		var frame = window.frames[i];
		if(frame.Artery){
			//alert(frame.Artery.params.formid);
			frame.Artery.swapStyleSheet(id,url);
		}
	}
}

Artery.findWindowByFormId = function(formId){
	if(window.Artery && Artery.params && Artery.params.formid && Artery.params.formid == formId){
		return window;
	}
	for(var i=0;i<window.frames.length;i++){
		var frame = window.frames[i];
		if(frame.Artery){
			var win = frame.Artery.findWindowByFormId(formId);
			if(win != null){
				return win;
			}
		}
	}
}

Artery.addImports = function(imports, callback) {
	var findScripts = function() {
		var arr=[];
		var scripts =Ext.query('script',
				document.getElementsByTagName("head")[0])
		if (scripts&& scripts.length!= 0) {
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src) {
					arr[scripts[i].src] = true;
				}
			}
		}
		return arr;
	}
	var findCss = function() {
		var arr = [];
		var scripts = Ext.query('link',
				document.getElementsByTagName("head")[0])
		if (scripts && scripts.length != 0) {
			for (var i=0; i <scripts.length;i++) {
				if (scripts[i].href) {
					arr[scripts[i].href]=true;
				}
			}
		}
		return arr;
	}

	var addScript = function(imports, scriptVal, head, callback, extScripts) {
		while (extScripts[scriptVal]) {
			scriptVal = imports.script.shift();
		}
		if (scriptVal) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scriptVal;
			head.appendChild(script);
			script.onload = script.onreadystatechange = function(_, isAbort) {
				if (isAbort || !script.readyState
						|| /loaded|complete/.test(script.readyState)) {
					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;
					scriptVal = imports.script.shift();
					if (scriptVal) {
						addScript(imports, scriptVal, head, callback,
								extScripts);
					} else {
						callback();
					}
				}
			}
		}else{
			callback();
		}
	}

	if (imports.script) {
		var length = imports.script.length;
		if (length != 0) {
			var extScripts = findScripts();
			var head = document.getElementsByTagName("head")[0];
			var scriptVal = imports.script.shift();
			if (scriptVal) {
				addScript(imports, scriptVal, head, callback, extScripts);
			}else{
				callback();
			}
		}else{
			callback();
		}
	}else{
		callback();
	}

	if (imports.css) {
		var length = imports.css.length;
		if (length != 0) {
			var extCss = findCss();
			var head = document.getElementsByTagName("head")[0];
			for (var i = 0; i < length; i++) {
				if (extCss[imports.css[i]]) {
					continue;
				}
				var css = document.createElement('link');
				css.type = 'text/css';
				css.rel = 'stylesheet';
				css.href = imports.css[i];
				head.appendChild(css);
			}
		}
	}
}
Artery.cascadeDestroy = function(el){
	var childEl = el.first();
	while(childEl){
		var del = childEl;
		childEl = childEl.next();
		Artery.cascadeDestroy(del);
	}
	var comp = Ext.getCmp(el.id);
	if(comp){
		try{
			comp.destroy();
			Ext.ComponentMgr.unregister(comp);
		}catch(e){}
	}
}
// ***************************************************************************************//
// Artery调试小程序
// ***************************************************************************************//
Artery.debugTimeArray=[];
Artery.debug = function(info){
	Artery.debugTimeArray.push([info,(new Date()).getTime()])
}
Artery.showDebug = function(){
	var len = Artery.debugTimeArray.length;
	var s = [];
	var preTime;
	var newTime;
	for(var i=0;i<len;i++){
		var info = Artery.debugTimeArray[i][0] + ":";
		newTime = Artery.debugTimeArray[i][1];
		if(preTime){
			info += newTime - preTime;
		}else{
			info += "0";
		}
		s.push(info);
		preTime = newTime;
	}
	alert(s.join('\n'))
}
Artery.getFilePath = function(dom){
	if (Ext.isIE) {
		try{
			dom.select();
			return document.selection.createRange().text;
		}catch(e){
			return dom.value;
		}
	}else{
		return dom.value;
	}
}
