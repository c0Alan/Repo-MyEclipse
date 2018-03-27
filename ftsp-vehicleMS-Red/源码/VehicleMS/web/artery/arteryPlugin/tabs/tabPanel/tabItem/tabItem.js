/**
 * @author weijx
 * @date 17/02/2009
 */
Artery.plugin.TabItem = Ext.extend(Artery.plugin.BasePanel, {
	
	onRender : function(ct, position) {
		this.on("activate", this.onActivateHandler, this);
		if(Ext.get(this.id)){
			Artery.plugin.TabItem.superclass.onRender.call(this, ct, position);
			//this.el.removeClass("x-hide-display");
		}else{
			// 通过客户端脚本生成的Tab，需要手工insertBefore
			Ext.Panel.prototype.onRender.call(this,ct,position);
			if(!ct){
				ct = Ext.get(Ext.get(this.pid+"__"+this.id).dom.parentNode);
			}
			ct.dom.insertBefore(this.el.dom, position);
			this.el.setStyle({
				height: "100%"
			});
			this.bwrap.setStyle({
				height: "100%"
			});
			this.body.setStyle({
				height: "100%"
			});
		}
		if(this.formUrl){
			this.getFrame().style.height = this.body.getHeight();
			this.autoOpenLink(this.getFrame());
		}
//		else{
//			Artery.initSubItems(this);
//		}
		//同时初始化tabArea，如果tabArea没有初始化过
		if(!this.ownerCt && this.pid!==undefined){
			this.ownerCt = eval("Artery.get('"+this.pid+"');");
		}
	},
	changeHeightStyle : function(e,h){
		try{
			e.setStyle("height",h);
		}catch(e){}
	},
	// 执行activate事件
	onActivateHandler : function(){
		//针对前台动态添加tabItem的情况，注册事件
		if(document.getElementById(this.id + "_iframe")!=null){
			this.getFrame();
		}
		Ext.get(this.tabEl.id).removeClass("x-hide-display");
		Ext.get(this.id).removeClass("x-hide-display");
		//IE11不支持hidden属性，所以注释掉
		//this.tabEl.hidden = false;
		if(this.formUrl){
			this.getFrame().style.height = this.body.getHeight();
		}else if(!this.hasInitSubItems){
			Artery.initSubItems(this);
			this.hasInitSubItems = true;
		}

		if (Ext.isEmpty(this.onActivateEvent)) {
			return ;
		}
		Artery.regItemEvent(this,'onActivateEvent','onActivateServer');
		this.active(this.isReloadIframe);
	},
	
	setSize: function(w,h){
		
	},
	
	/**
	 * 激活本组件，reload为true时，刷新iframe
	 */
	active: function(reload){
		this.ownerCt.setActiveTab(this);
		var frame = window.frames[this.id+"_iframe"];
		if(frame){
			try{
				var src = frame.location.href;
				if(Ext.isEmpty(src) || src=="about:blank"){
					return ;
				}
				if(reload){
					frame.location.reload();
				}
			}catch(e){
				// 忽略异常
			};
		}
	},
	
	/**
	 * 打开表单
	 */
	openForm : function(linkto) {
		this.ownerCt.setActiveTab(this);
		this.getFrame().style.height = this.body.getHeight();
		this.getFrame().src = Ext.tusc.getLinkUrl(linkto);
	},
	
	// private
	autoOpenLink: function(f) {
	    if (this.formUrl.length > 1000) {
	        var htmlContent = "url=" + this.formUrl.replace("?","&")
	        var srcDom = Ext.urlDecode(htmlContent, true);
	        
	        if(!srcDom.formType || !srcDom.formid) {
	            f.src = this.formUrl;
	            return;
	        }
	        var cfg = {
	                id: this.id,
	                url: this.formUrl,
	                formType: srcDom.formType,
	                formId: srcDom.formid,
	                forceContextPath: false
	        };
	        
	        var win = f.contentWindow;
	        Artery.autoSubmitForm(win,cfg);
	    } else {
	        this.getFrame().src = this.formUrl;
	    }
	},
	
	// private
	getFrame : function() {
		var f = document.getElementById(this.id + "_iframe");
		if (f == null) {
			this.body
					.update("<iframe frameborder=0 id=\""
							+ this.id
							+ "_iframe\" style='width: 100%; height: 100%;' onload='this.style.height="
							+ this.body.getHeight() + ";'></iframe>");
			f = document.getElementById(this.id + "_iframe");
		}
		if(!f.isInitIframeResizeEvent){
			this.initIframeResizeEvent();
			f.isInitIframeResizeEvent = true;			
		}
		return f;
	},
	
	initIframeResizeEvent: function(){
		// 开始调整大小时将高度设为100%达到自动缩放的效果
		// 调整大小后，将高度设值为固定值
		var iframe = Ext.get(this.id + "_iframe");
		var e = this;
		if (iframe && e.ownerCt) {
			Artery.Event.onResizestart(function() {
						e.changeHeightStyle(iframe, "100%")
					});
			Artery.Event.onResizend(function() {
						if (e.ownerCt && e.ownerCt.activeTab) {
							e.changeHeightStyle(iframe,
									e.ownerCt.activeTab.body.getHeight())
						}
					});
		}
	},
	
	setTitle : function(titleName){
		this.superclass().setTitle.call(this,titleName); 
	},
	getTitle : function(){
		return this.title;
	},
	showItem : function() {
		if(this.tabEl) {
			Ext.get(this.tabEl.id).removeClass("x-hide-display");
			Ext.get(this.id).removeClass("x-hide-display");
			//IE11不支持hidden属性，所以注释掉
			//this.tabEl.hidden = false;
			Artery.get(this.pid).setActiveTab(this);
		}
	},
	hideItem : function() {
		if(this.tabEl) {
			Ext.get(this.tabEl.id).addClass("x-hide-display");
			Ext.get(this.id).addClass("x-hide-display");
			//IE11不支持hidden属性，所以注释掉
			//this.tabEl.hidden = true;
			Artery.get(this.pid).setActiveNext();
		}
	}
});
Ext.reg('apTabItem', Artery.plugin.TabItem);