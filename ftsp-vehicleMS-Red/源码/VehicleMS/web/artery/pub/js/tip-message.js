﻿Ext.tusc.TIP_OK = '2';
Ext.tusc.TIP_INFO = '3';
Ext.tusc.TIP_WARN = '1';
Ext.tusc.TIP_ERROR = '4';
Ext.tusc.TIP_LOADDING = 'loading';

Ext.tusc.TipMessage = Ext.extend(Ext.Component, {

			msgEl : null,

			messageAlign : 'bl-bl',

			alignEl : null,

			tipMessageCls : 'x-tip-message',

			defaultType : 'tips_ok',

			deferTime : 4000,

			isError : false,
			
			active:false,

			initComponent : function() {
				Ext.tusc.TipMessage.superclass.initComponent.call(this);
				this.initDeferTime();
			},

			initDeferTime : function() {
				if (!Ext.isEmpty(Ext.tusc.TIP_DEFERTIME)
						&& Ext.tusc.TIP_DEFERTIME != 'null') {
					this.deferTime = parseInt(Ext.tusc.TIP_DEFERTIME) * 1000;
				}
			},

			// private
			getMsgEl : function() {
				if (!this.msgEl) {
					this.msgEl = Ext.DomHelper.append(Ext.getBody(), {
								cls : this.tipMessageCls + ' x-hide-offsets'
							}, true);

					this.msgElBody = this.msgEl.createChild({
								cls : 'tips_body'
							})

					this.msgIframe = this.msgEl.createChild({
								tag : 'iframe',
								frameborder : 0,
								style : 'overflow:hidden'
							})

					this.msgElCenter = this.msgElBody.insertFirst({
								cls : 'x-message-center',
								html : 'aa'
							})

					this.msgElTop = this.msgElBody.insertFirst({
								cls : 'x-message-top'
							})
					this.msgElTopClose = this.msgElTop.insertFirst({
								cls : 'x-message-top-close'
							})

					this.msgElTop.on('click', function(e) {
								this.hideMessage();
							}, this, {
								stopEvent : true
							}); // prevent anchor click navigation

					this.smallMsgEl = this.msgEl.createChild({
								cls : 'x-tip-message-small'
							});
					this.smallMsgEl.on('click', function(e) {
								this.showMsgEl();
								this.clearTimeout();
							}, this, {
								stopEvent : true
							})
				}
				return this.msgEl;
			},

			synWidth : function() {
				this.msgIframe.setHeight(this.msgElBody.getHeight());
				this.msgIframe.setWidth(this.msgElBody.getWidth());
			},

			setWidth : function(width) {
				this.getMsgEl().dom.style.width = width;
			},

			clearWidth : function(width) {
				this.getMsgEl().dom.style.width = '';
			},

			getMessageCenter : function() {
				if (this.msgElCenter == null) {
					this.getMsgEl();
				}
				return this.msgElCenter;
			},

			getAlignEl : function() {
				if (this.alignEl != null) {
					return this.alignEl;
				} else {
					return Ext.getBody();
				}
			},

			clearTimeout : function() {
				if (this.cleartimeid) {
					window.clearTimeout(this.cleartimeid);
					this.cleartimeid = null;
				}
			},

			loading : function() {
				this.setWidth(200)
				this.animating = true;
				this.clearTimeout();

				this.updateMessage(Artery.LODDING, Ext.tusc.TIP_LOADDING);
				if(!this.active){
					this.getMsgEl().alignTo(this.getAlignEl(), this.messageAlign,
							[0, 0]).slideIn('b', {
								duration : .3,
								easing : 'easeOut',
								callback : function() {
									this.animating = false;
									this.getMsgEl().setTop("auto");
									this.getMsgEl().setBottom("0px");
								},
								scope : this
							});
				}
				this.active = true;
			},

			loadTrue : function(message) {
				this.showMessage(message, Ext.tusc.TIP_OK);
			},

			loadFalse : function(message) {
				this.showMessage(message, Ext.tusc.TIP_ERROR);
			},

			showMessage : function(message, type) {
				if (Ext.isEmpty(message)) {
					return;
				}

				this.showMsgEl(message, type);
			},

			// 显示消息el，不做空数据判断
			showMsgEl : function(message, type) {
				this.clearWidth();
				this.clearTimeout();

				this.updateMessage(message, type);

				this.synWidth();
				if(!this.active){
					this.getMsgEl().alignTo(this.getAlignEl(), this.messageAlign,
							[0, 0]).slideIn('b', {
								duration : .3,
								easing : 'easeOut',
								callback : function() {
									this.getMsgEl().setTop("auto");
									this.getMsgEl().setBottom("0px");
								},
								scope : this
							});
				}
				this.active = true;
				this.cleartimeid = this.hideMessage.defer(this.deferTime, this);
			},

			// private
			hideMessage : function() {
				this.msgElBody.setDisplayed(false);
				this.msgIframe.setDisplayed(false);
				this.active = false;
				this.smallMsgEl.setStyle("display", "block");
				this.getMsgEl().alignTo(this.getAlignEl(), this.messageAlign,
						[0, 0]).slideIn('b', {
							duration : .3,
							easing : 'easeOut',
							callback : function() {
								this.getMsgEl().setTop("auto");
								this.getMsgEl().setBottom("0px");
							},
							scope : this
						});
			},
			
			hideSmallMessageBtn : function() {
				this.smallMsgEl.setStyle("display", "none");
			},

			updateMessage : function(message, type) {
				this.msgElBody.setDisplayed(true);
				this.msgIframe.setDisplayed(true);
				this.smallMsgEl.setStyle("display", "none");
				if (!Ext.isEmpty(message)) {
					var msg = String.format('<div class="x-tip-text {0}">{1}</div>', this
									.getTypeIcon(type), message);
					this.getMessageCenter().update(msg);
					this.synWidth();
				}
			},

			getTypeIcon : function(type) {
				this.isError = false;
				if (type == null) {
					return this.defaultType;
				} else if (type == Ext.tusc.TIP_OK) {
					return 'tips_ok';
				} else if (type == Ext.tusc.TIP_INFO) {
					return 'tips_info';
				} else if (type == Ext.tusc.TIP_WARN) {
					return 'tips_warning';
				} else if (type == Ext.tusc.TIP_ERROR) {
					this.isError = true;
					return 'tips_error';
				} else if (type == Ext.tusc.TIP_LOADDING) {
					return 'tips_loading';
				} else {
					return this.defaultType;
				}
			}
		});

Ext.getTipMessage = function() {
	if (Ext.tipMessage == null) {
		Ext.tipMessage = new Ext.tusc.TipMessage();
	}
	return Ext.tipMessage;
}

// /////////////////////////////////////////////////
// showTip
// //////////////////////////////////////////////////
// show tip on all page
Artery.showLicenseMessage = function() {
	if (!Artery || !Artery.config || !Artery.config.loadType
			|| !Artery.config.license.lt) {
		return;
	}
	// debug
	var debug = Artery.config.debug;
	// loadType
	var loadType = Artery.config.loadType;
	// license
	var deadline = Artery.config.license.lt;

	var tip = new Artery.Tip();

	if (debug == "true" || loadType == "3" || loadType == "1") {
		tip.enable = true;
		tip.addMsg("正在运行在“开发模式”下，页面的打开速度会很慢！");
	}

	if (tip.enable && getCookie("tipShow") != "close") {
		tip.show();
	}

}
// show tip on all page
Ext.onReady(function() {
			if (Artery.pwin) {
				Artery.pwin.Artery.showLicenseMessage();
			}
		})
// tip
Artery.Tip = function() {
	this.tipDiv = document.createElement("div");
	this.tipDiv.id = "tipDiv";
	this.tipDiv.style.height = "20px";
	this.tipDiv.style.width = "360px";
	this.tipDiv.style.backgroundColor = "#ffffcc";
	this.tipDiv.style.padding = "10px";
	this.tipDiv.style.position = "absolute";
	this.tipDiv.style.top = "0px";
	this.tipDiv.style.left = "0px";
	this.tipDiv.style.padding = 3;
	this.tipDiv.style.borderWidth = 1;
	this.tipDiv.style.borderColor = "#804000";
	this.tipDiv.style.borderStyle = "solid";

	this.tipDiv.innerHTML = "<a href=\"javascript:Artery.Tip.closeTip();\" style=\"position:absolute;top:3px; right:3px;\" >不再提示</a>"

	this.enable = false;

	this.show = function() {
		if (this.enable) {
			if (document.getElementById("tipDiv") == null) {
				document.body.appendChild(this.tipDiv);
				this.enable = false;
			}

		}
	}

	this.addMsg = function(msg) {
		this.tipDiv.innerHTML = msg + "</br>" + this.tipDiv.innerHTML;

	}

}
Artery.Tip.closeTip = function() {
	document.getElementById('tipDiv').style.visibility = "hidden";
	setCookie("tipShow", "close");
}
function setCookie(name, value)// 两个参数，一个是cookie的名子，一个是值
{
	var Days = 10000;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
function getCookie(name)// 取cookies函数
{
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
}
