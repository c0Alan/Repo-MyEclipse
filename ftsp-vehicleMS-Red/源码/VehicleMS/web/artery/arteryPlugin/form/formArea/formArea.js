// ***************************************************************************************//
// FormArea
// ***************************************************************************************//
Artery.initEnterEvent=function(id,onEnter){
	try {
		var map = new Ext.KeyMap(id, {
			key : 13, // or Ext.EventObject.ENTER
			fn : onEnter
		});
	} catch(e) {}
}
//初始化更多按钮
Artery.initMoreButton = function(buttonId){
	var moreButton = Ext.get(buttonId+ "_moreButton");
	if(moreButton && !moreButton.rendered){
		var moreContainer = Ext.get(buttonId + "_moreContainer");
        var moreDiv = Ext.get(buttonId+"_moreDiv");
        function moreAndCollapse(){
          if(moreContainer.isDisplayed()){
	        moreContainer.setDisplayed(false);
	        moreButton.update(moreButton.text?moreButton.text:'>>填写更多信息')
	        moreButton.dom.title = "点击查看";
	      }else{
	        moreContainer.setDisplayed(true);
	        moreButton.text = moreButton.dom.innerHTML;
	        moreButton.expandText = moreButton.dom.expandText;
	        moreButton.update(moreButton.expandText?moreButton.expandText:'>>收起更多信息')
	        moreButton.dom.title = "点击收起";
	      }
        }
        moreButton.on('keydown',function(event){
          if(event.getKey()==32){
            //当按下空格键的时候处理事件
            moreAndCollapse();
          }
        });
        moreButton.on('click',function(){
          moreAndCollapse();
        });
		moreButton.rendered = true;
	}	
}

/**
 * Artery.plugin.FormArea
 * 
 * @author baon
 * @date 12/02/2009
 * 
 * @class Artery.plugin.FormArea
 * @extends Ext.form.FormPanel
 */
Artery.plugin.FormArea = Ext.extend(Ext.form.FormPanel, {

	onEnter : null,
	
	errors:null,
	
	errorsTip:null,
	
	layout:'atylayout',
	
	allowDomMove:false,
	
	submitAutoValid:true,
	
	onResize:Artery.plugin.BasePanel.prototype.onResize,
	
	tableEl : null,

	initComponent : function() {
		Artery.plugin.FormArea.superclass.initComponent.call(this);
		this.errors = [];
		this.errorsTip = new Ext.XTemplate(
			'<table cellpadding=5 cellspacing=5>',
				'<tpl for="errors">',
					'<tr><td style="color:red;">{name}</td><td>:</td><td>{error}</td></tr>',
				'</tpl>',
			'</table>');
		this.errorsTip.compile();

	},
	
	createForm : function(){
        var config = Ext.applyIf({listeners: {}}, this.initialConfig);
        return new Ext.form.BasicForm(Ext.get(this.id + '-atbody'), config);
    },
	
	lookupComponent: Artery.plugin.BaseContainer.prototype.lookupComponent,
    
    //初始化验证事件
    initValidEvent: function(){
    	var fp = this;
    	this.form.items.each(function(item,index,length){
    		item.on("invalid",function(it,msg){
    			//只记录调用isValid方法时的错误信息
    			if(fp.beginValid != true){
                	return;
                }
            	var find = false;
            	var l = fp.errors.length;
            	for (var index = 0; index < l; index++) {
            		if(fp.errors[index].name == it.fieldLabel){
            			find = true;
            		}
            	}
            	if(!find){
            		fp.errors.push({name:it.fieldLabel,error:msg});
            	}
            })
    	},this)
    },

	// 初始化显示隐藏事件
	initShowHideEvent : function() {
		this.form.items.each(function(item, index, length) {
					item.on("show", this.dealTrHidden, this);
					item.on("hide", this.dealTrHidden, this);
				}, this)
	},

	onRender : function(ct, position) {
		this.initFields();
		//modify
		this.initValidEvent();
		if (Ext.isTrue(this.autoHideTr)) {
			this.initShowHideEvent();
		}
        Artery.plugin.BasePanel.prototype.onRender.call(this,ct,position);
        //modify
        this.form.initEl(this.id + '-atbody');
        this.tableEl = Ext.get((this.id + 'Table'));
	},
    
    afterRender:function(){
        Artery.plugin.FormArea.superclass.afterRender.call(this);
        if(this.onLoadEvent){
            Artery.regItemEvent(this,'onLoadEvent',null,{});
        }
    },
	    // private
    initFields : function(){
        var f = this.form;
        f.items.clear();
        var inputs = Ext.getDom(this.id + '-atbody').elements;
        if(typeof inputs == "undefined"){
        	return;
        }
        var length = inputs.length;
        var tip = Artery.getFieldErrorCollTip()
        if(tip.initErrorTip){
        	tip.reset();
        }
		var inputids = new Array();
		for (var i = 0; i < length; i++) {
			inputids[i] = inputs[i].id;
		}
        for(var i=0;i<length;i++){
        	var field = Artery.get(inputids[i]);
        	if(field){
        		f.add(field);
        	}
        }
    },
	
	// 得到字段参数对象
	getValues : function(asString) {
		this.removeEmptyText();
		var v =  this.form.getValues(asString);
		this.recoverEmptyText();
		return v;
	},

	// 提交事件,要求返回一个json
	submit : function(callbak,params) {
		var p = Artery.getParams({
			buttonItemid:Artery.params.itemid,
			method:'parseFormSubmit'
		}, this);
		if (this.submitAutoValid && !this.isValid()) {
			return;
		}
		if(!this.submitAutoValid){
			var required = this.form.validRequired();
			if(!required){
				return;
			}
		}
		
		
		if(Ext.isObject(params)){
			Ext.apply(p,params);
		}
		this.removeEmptyText();
		
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic",
			scope : this,
			params : p,
			form : this.getForm().getEl().dom.id,
			isUpload : true,

			success : function(response, options) {
				var text = response.responseText;
				if(!Ext.isEmpty(text)){
					if(/^arterycmd:.*\.jsp$/.test(text)){
						var loginUrl = text.replace(/arterycmd:/,"");
						alert(Artery.ajaxLoginTip)
						top.window.location.href=loginUrl;
						return;
					}
					try{
						text = Ext.decode(text);
						text = text['return'];
					}catch(e){
						Artery.showError("出错啦，请检查！")
						return;
					}
				}
				this.changePrevious();
				if (callbak != null && typeof callbak == "function") {
					callbak.call(this, text);
				}
			}
		})
		this.recoverEmptyText();
	},

	login : function(callbak,params) {
		var p = Artery.getParams({
			buttonItemid:Artery.params.itemid,
			method:'parseFormLogin'
		}, this)
		if (this.submitAutoValid && !this.isValid()) {
			return;
		}
		if(Ext.isObject(params)){
			Ext.apply(p,params);
		}
		this.removeEmptyText();
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic",
			scope : this,
			params : p,
			form : this.getForm().getEl().dom.id,
			success : function(response, options) {
				var text = response.responseText;
				if(!Ext.isEmpty(text)){
					try{
						text = Ext.decode(text);
						text = text['return'];
					}catch(e){
						Artery.showError("出错啦，请检查！")
					}
				}
				if (callbak != null && typeof callbak == "function") {
					callbak.call(this, text);
				}
			}

		})
		this.recoverEmptyText();
	},
	
	removeEmptyText: function(){
		this.form.items.each(function(f){
			if(f.el && f.el.dom){
				if(f.emptyText == f.el.dom.value){
					f.el.dom.value = "";
					f.ret = true;
				}
			}
		
		});
	},
	
	recoverEmptyText: function(){
		this.form.items.each(function(f){
			if(f.el && f.el.dom){
				if(f.ret){
					if(!Ext.isEmpty(f.emptyText) && Ext.isEmpty(f.el.dom.value)){
						f.el.dom.value = f.emptyText;
					}
					f.ret = false;
				}
			}
		
		});
	},
	
	clearInValid : function(){
		this.form.items.each(function(f){
			if(f.el && f.el.dom){
				f.clearInvalid();
			}
		});
	},
	
	// 表单关联验证, isValidHidden:true控件隐藏时也进行验证
	isValid : function(isValidHidden) {
		this.beginValid = true;
		var v = true;
		if (!this.form.isValid(isValidHidden)) {
			v = false;
		}

		// 客户端验证
		if (!Ext.isEmpty(this.onValidEvent)) {
			var result = this.validClient(this.onValidEvent);
			if (result != null) {
				if (result.errorText) {
					var cmp = Ext.getCmp(result.errorId);
					if (cmp != null) {
						cmp.markInvalid(result.errorText);
					}
					v = false;
				}
			}
		}
		if(!v){
			//Artery.showError(this.showValidErrors());
		}
		this.beginValid = false;
		return v;
	},
	//options是json串 {params:{},callback :new function(){}  }
	reload: function(o){
		if(o == null){
			o = {params:{}};
		}else if (o.params == null) {
			o.params = {};
		}
		Ext.applyIf(o.params, Artery.getParams({
			method : 'reload'
		}, this));
		
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			success : function(response, options) {
				var values = Ext.decode(response.responseText).values;
				Artery.recoverFormData(values);
				this.changePrevious();
				if (o.callback!= null && typeof o.callback == "function") {
					o.callback.call(this);
				}
				this.clearInValid();
                
                if(this.onLoadEvent){
                    Artery.regItemEvent(this,'onLoadEvent',null,{});
                }   
			},
			params : o.params,
			scope : this
		});
	},
	
	getFormData: function(){
		var data={};
		this.form.items.each(function(item){
			data[item.id] = Artery.get(item.id).getValue();
		});
		return data;
	},
	
	showValidErrors: function(){
		var errors = this.errorsTip.apply({errors:this.errors});
		this.errors = [];
		return errors;
	},

	// 验证客户端脚本
	validClient : function(clientScript) {
		var rc = Artery.createCaller(Artery.getEventId(this), 'onValidServer',Artery.getFormId(this));
		rc.sync = true;
		// clientScript可能是方法调用，此时需要返回调用结果 weijx 2010-5-18
		if(clientScript.indexOf("return")==-1){
			eval("var script = function(){return " + clientScript + "};");
		}else{
			eval("var script = function(){" + clientScript + "};");
		}
		return script();
	},

	//设置所有控件为只读
	//此方法可被readAllSub()方法代替，为兼容旧版本而保留
	read : function() {
		this.readAllSub(false);
	},

	//设置所有控件为可编辑
	//此方法可被editAllSub()方法代替，为兼容旧版本而保留
	edit : function() {
		this.editAllSub(false);
	},
	
	//重置所有控件为初始值
	reset : function() {
		this.form.items.each(function() {
			this.reset();
			this.changePrevious();
		});
	},
	
	changePrevious:function(){
		this.form.items.each(function() {
			this.changePrevious();
		});
	},

	//判断控件的值是否改变
	isChange : function() {
		var change = false;
		this.form.items.each(function() {
			if (this.getValue() != this.previousValue) {
				change = true;
			}
		});
		return change;
	},
	
	/**
	 * 设置所有子控件为只读
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为只读
	 *                         false：所有子控件都设置为只读
	 */
	readAllSub : function(isDirect) {
		var parentId = this.id;
		this.form.items.each(function() {
			if(Ext.isTrue(isDirect) && this.pid != parentId){
				return;
			}
			this.read();
		});
	},
	
	/**
	 * 设置所有子控件为可编辑
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为可编辑
	 *                         false：所有子控件都设置为可编辑
	 */
	editAllSub : function(isDirect) {
		var parentId = this.id;
		this.form.items.each(function() {
			if(Ext.isTrue(isDirect) && this.pid != parentId){
				return;
			}
			this.edit();
		});
	},
	
	/**
	 * 设置所有子控件为无效
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为只读
	 *                         false：所有子控件都设置为只读
	 */
	disableAllSub : function(isDirect) {
		var parentId = this.id;
		this.form.items.each(function() {
			if(Ext.isTrue(isDirect) && this.pid != parentId){
				return;
			}
			this.disable();
		});
	},
	
	/**
	 * 设置所有子控件为有效
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为可有效
	 *                         false：所有子控件都设置为可有效
	 */
	enableAllSub : function(isDirect) {
		var parentId = this.id;
		this.form.items.each(function() {
			if(Ext.isTrue(isDirect) && this.pid != parentId){
				return;
			}
			this.enable();
		});
	},
	
	/**
	 * 清空所有子控件的值
	 */
	clearAllSub : function(){
		this.form.items.each(function() {
			this.setValue("");
		});
	},
	
	// 当TR中的TD都使用display方式隐藏的时候，自动隐藏TR
	dealTrHidden : function() {
		// 遍历TR
		var tbodyEl = this.tableEl.child("tbody");
		var trEl = tbodyEl.first();
		while (trEl) {
			if (trEl.dom.tagName.toLowerCase() == "tr") {
				var isHidden = true;
				// 遍历ID
				var tdEl = trEl.first();
				while (tdEl) {
					if (tdEl.dom.tagName.toLowerCase() == "td") {
						if (!tdEl.hasClass("x-hide-display") && !tdEl.hasClass("x-form-blank-td-cust")) {
							isHidden = false;
							break;
						}
					}
					tdEl = tdEl.next();
				}
				if (isHidden) {
					trEl.addClass("x-hide-display");
				} else {
					trEl.removeClass("x-hide-display");
				}
			}
			trEl = trEl.next();
		}
	}
})

// register xtype
Ext.reg('apformarea', Artery.plugin.FormArea);