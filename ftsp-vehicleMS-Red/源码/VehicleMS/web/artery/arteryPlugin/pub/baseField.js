// ***************************************************************************************//
// Field //
// ***************************************************************************************//
/**
 * Override Field, override hide component method
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
Ext.override(Ext.form.Field, {
	
	autoEl: null,
	
	
	//是否唯一
	unique: false,
	
	readOnlyClass : 'x-item-readonly',
	
	// 错误提示采用title的方式
	msgTarget: "cooltip",
	
	validArray:null,
	
	//可编辑列表中的验证脚本
	onListValidEvent:null,
	
	//可编辑列表中的值改变脚本
	onListChangeEvent:null,
	
	//控件的验证脚本
	onValidEvent:null,
	
	labelSeparator:':',
	
	showValueTip:false,

	initComponent : function() {
		// Form组件默认的onchage事件
		this.on('change', function(field, newValue, oldValue) {
			//alert(field.id + ":" + newValue + ":" + oldValue + "dataValue:" + this.value);
			// 如果是display，则不调用isValid方法，调用isValid会显示验证失败的红框
			if(this.isDisplayType()){
				this.initDefaultOnChange(field, newValue,oldValue);
			}else if (this.isValid() && this.initDefaultOnChange) {
				this.initDefaultOnChange(field, newValue,oldValue);
			}
		}, this)
		
		Ext.form.Field.superclass.initComponent.call(this);
		this.addEvents('focus', 'blur', 'specialkey', 'change','invalid', 'valid');
		
		//可编辑列表中的值改变脚本
		if(this.onListChangeEvent){
			this.on("change",function(field,newValue,oldValue){
				if(this.validate()){//add by zhangchw 在判断之前增加校验，如果没通过则不再执行值改变脚本
					if(this.rowIdx){
						Artery.listRowIdx = this.rowIdx;
					}
					var rc = Artery.createCaller(this.colitemid == null?this.id:this.colitemid, 'onChangeServer',Artery.getFormId(this));
					rc.sync = true;
					eval("var fn = function(field,newValue,oldValue){" + this.onListChangeEvent + "\n}");
					fn.call(this,field,newValue,oldValue);
				}
			})
		}
		
		//清空验证数组
		this.validArray = [];
		
		//验证唯一（form和list共用）
		if(this.unique){
			var fn = function(val){
				//判断list时是否等于初始数据，只有在列表中才有initColVal属性和colitemid属性
				if(this.initColVal&& val == this.initColVal){
					return true;
				}
				
				//判断form时是否等于初始值
				if(this.originalValue === undefined || val + "" == this.originalValue){
					return true;
				}
				
				var returnVal = true;
				var itemid = this.colitemid == null?Artery.getEventId(this):this.colitemid;
				var p = {
					itemid:itemid,
					formid:Artery.getFormId(this)
				};
				p[itemid] = val;
				Artery.request({
					url : sys.getContextPath()
							+ "/artery/form/dealParse.do?action=validateUnique",
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if(result.success){
							if(result.unique){
								returnVal = true;
							}else{
								returnVal = "此输入项必须唯一！";
							}
						}else if(result.errorText){
							Artery.showError(result.errorText);
							returnVal= "验证失败，请检查！";
						}
					},
					scope : this,
					syn : false,
					params : Artery.getParams(p, this)
				});
				return returnVal;
			}
			this.validArray.push(fn);
		}
		//处理可编辑列表中的验证脚本
		if(this.onListValidEvent){
			var f = function(value){
				if(this.rowIdx){
					Artery.listRowIdx = this.rowIdx;
				}
				var rc = Artery.createCaller(this.colitemid == null?this.id:this.colitemid, 'onValidServer',Artery.getFormId(this));
				rc.sync = true;
				// onListValidEvent可能是方法调用，此时需要返回调用结果 weijx 2010-5-18
				if(this.onListValidEvent.indexOf("return")==-1){
					eval("var fn = function(value){return " + this.onListValidEvent + "\n}");
				}else{
					eval("var fn = function(value){" + this.onListValidEvent + "\n}");
				}
				var returnValue = fn.call(this,value);
				if(returnValue == null){
					return true;
				}
				return returnValue;
			}
			this.validArray.push(f);
		}
		
		if(this.onValidEvent){
			var f = function(value){
				if(this.hasFocus != false){
					return true;
				}
				var returnValue = Artery.regItemEvent(this,'onValidEvent','onValidServer',{
					'value':value
				});
				if(returnValue == null || returnValue == true){
					return true;
				}
				return returnValue;
			}
			this.validArray.push(f);
		}
		
		//验证
		if(this.validArray.length != 0 && !this.isDisplayType()){
			this.validator = function(val){
				for(var i = 0; i<this.validArray.length;i++){
					var returnVal = this.validArray[i].call(this,val);
					if(returnVal !== true){
						return returnVal;
					}
				}
				
				return true;
			}
		}
		
		if(this.msgTarget == 'cooltip'){
			this.on("invalid",function(field,msg){
				this.isInvalid = true;
				var tip = Artery.getFieldErrorCollTip();
				this.initErrorTip(tip);
				var cf = tip.currentField;
				if(tip.isVisible() && cf && cf.field.id == this.id && cf.msg == msg){
					//Artery.showMessage(msg)
					return;
				}
				tip.pushField(this,msg);
				tip.showErrorTip(this);
			},this);
			
			this.on("valid",function(field){
				this.isInvalid = false;
				var tip = Artery.getFieldErrorCollTip();
				this.initErrorTip(tip);
				if(tip.isVisible()){
					tip.hideErrorTip(field);
				}
			},this);
			
			this.on("focus",function(field){
				if(this.isInvalid){
					var tip = Artery.getFieldErrorCollTip();
					var cf = tip.currentField;
					if(tip.isVisible() && cf && cf.field.id == this.id){
						return;
					}
					tip.currentField = tip.findField(this);
					tip.showErrorTip(field);
				}
			},this);
		}
	},
	
	//得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.el;
	},
	
    /**
     * Mark this field as invalid, using {@link #msgTarget} to determine how to display the error and
     * applying {@link #invalidClass} to the field's element.
     * @param {String} msg (optional) The validation message (defaults to {@link #invalidText})
     */
    markInvalid : function(msg){
    	var errorTipEl = this.getErrorTipEl();
    	if (!errorTipEl) {
    		return;
    	}
    	
        if(!this.rendered || this.preventMark || this.isHidden()){ // not rendered
            return;
        }
        msg = msg || this.invalidText;

        var mt = this.getMessageHandler();
        if(mt){
            mt.mark({
            	el:errorTipEl,
            	invalidClass:this.invalidClass
            }, msg);
        }else if(this.msgTarget){
            errorTipEl.addClass(this.invalidClass);
            var t = Ext.getDom(this.msgTarget);
            if(t){
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
            }
        }
        this.fireEvent('invalid', this, msg);
    },

    /**
     * Clear any invalid styles/messages for this field
     */
    clearInvalid : function(){
    	var errorTipEl = this.getErrorTipEl();
    	if (!errorTipEl) {
    		return;
    	}
    	
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        errorTipEl.removeClass(this.invalidClass);
        var mt = this.getMessageHandler();
        if(mt){
        	if(typeof(msg) != "undefined" && msg != null){
	            mt.clear({
	            	el : errorTipEl,
	            	invalidClass : this.invalidClass
	            }, msg);
        	}
        }else if(this.msgTarget){
            errorTipEl.removeClass(this.invalidClass);
            var t = Ext.getDom(this.msgTarget);
            if(t){
                t.innerHTML = '';
                t.style.display = 'none';
            }
        }
        this.fireEvent('valid', this);
    },
    
	initErrorTip: function(tip){
		var field = this;
		if(tip.initErrorTip){
			return;
		}
		tip.initErrorTip = true;
		tip.messageFields = [];
		tip.currentField = null;
		tip.pushField = function(field,msg){
			var o = tip.findField(field);
			if(!o){
				tip.messageFields.push({field:field,msg:msg});
			}else{
				o.msg = msg;
			}
		}
		tip.findField = function(field){
			var length = tip.messageFields.length;
			for(var i=0;i<length;i++){
				if(tip.messageFields[i]!= null && tip.messageFields[i].field == field){
					return tip.messageFields[i];
				}
			}
			return null;
		}
		
		tip.deleteField = function(field){
			var length = tip.messageFields.length;
			for(var i=0;i<length;i++){
				if(tip.messageFields[i]!= null && tip.messageFields[i].field == field){
					tip.messageFields[i] = null;
				}
			}
		}
		tip.showErrorTip = function(field){
			if(tip.currentField == null ||(field != null && field.hasFocus)){
				tip.currentField = tip.findField(field)
			}
			if(tip.currentField && (field == null || tip.currentField.field == field)) {
				if(!tip.isVisible()){
					tip.show();
		        	//tip.currentField.field.getErrorTipEl().focus();
				}
				//Artery.showMessage(tip.currentField.msg)
	        	tip.update(tip.currentField.msg);
	        	tip.correctPosition();
			}
		}
		tip.hideErrorTip = function(field){
			if(tip.currentField && tip.currentField.field == field ){
				tip.hide();
				tip.deleteField(field);
				//tip.currentField = null;
				tip.currentField = tip.findFirstField();
				if(tip.currentField){
					tip.showErrorTip();
				}
			}else{
				tip.deleteField(field)
			}
		}
		tip.correctPosition = function(){
			tip.alignTo(tip.currentField.field.getErrorTipEl(),'tl-bl',[0,0]);
			tip.changeTipPosition('top')
			var field = tip.currentField.field;
			var ha = field.getErrorTipEl().getY()-Ext.getBody().getScroll().top;
        	var hb = Ext.lib.Dom.getViewHeight()-ha-field.getErrorTipEl().getSize().height;
			if(hb < tip.getHeight()){
				if(ha >tip.getHeight()){
					tip.changeTipPosition('bottom');
					tip.alignTo(tip.currentField.field.getErrorTipEl(),'bl-tl',[0,0]);
				}
			}
		}
		tip.findFirstField = function(){
			var length = tip.messageFields.length;
			for(var i=0;i<length;i++){
				if(tip.messageFields[i]!= null){
					return tip.messageFields[i];
				}
			}
			return null;
		}
		tip.clear = function(){
			tip.messageFields = [];
			tip.currentField = null;
			tip.hide();
		}
		tip.reset = function(){
			var errorsEl = [];
			Ext.each(tip.messageFields,function(item,idx){
				if(item && item.field && item.field.el && item.field.el.dom){
					errorsEl.push(item);
				}
			});
			tip.messageFields = errorsEl;
			if(!tip.currentField || !tip.currentField.field  || !tip.currentField.field.el|| !tip.currentField.field.el.dom){
				tip.currentField = null;
			} 
		}
	},
	
	validate : function(v){
		if(this.isDisplayType()){
			return true;
		}
		
		if(Ext.isTrue(this.readOnly) && !Ext.isTrue(this.validOnReadOnly)){
			this.clearInvalid();
            return true;
		}
		var v = v || this.processValue(this.getRawValue());
        if(this.disabled){
            this.clearInvalid();
            return true;
        }
        var isValid = false;
        if (Ext.isTrue(this.freeData) && Ext.isFunction(this.validateRightValue)) {
            isValid = this.validateValue(v) && this.validateRightValue(v);
        } else {
            isValid = this.validateValue(v);
        }
        if(isValid){
            this.clearInvalid();
            return true;
        }
        return false;
    },
	
	afterRender: function(){
		Ext.form.Field.superclass.afterRender.call(this);
		this.initSte = true;//设置初始状态参数
		if(!this.isDisplayType()){
	        this.initEvents();
		}
	    this.initValue();
        this.initSte = false;
        // 业务提示信息
		if(!Ext.isEmpty(this.comment)){
			this.tipEl = Ext.get("comment_"+this.id);
			if(this.tipEl){
				this.tipEl.on("click", Artery.showComment, this);
			}
		}
	},
	
	initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(!Ext.isEmpty(this.el.dom.value) && this.el.dom.value != this.emptyText){
            this.setValue(this.el.dom.value);
        }
        /**
         * The original value of the field as configured in the {@link #value} configuration, or
         * as loaded by the last form load operation if the form's {@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
         * setting is <code>true</code>.
         * @type mixed
         * @property originalValue
         */
        this.originalValue = this.getValue();
        //modify 上一次的值，调用表单的submit方法改变
        this.previousValue = this.originalValue;
    },

	initEvents : function(){
		// 对于input输入框，当是回车键时，避免表单误提交
		if(this.el.dom.tagName.toLowerCase()=="input"){
			this.el.on("keypress",function(e){
				if(e.getKey()==Ext.EventObject.ENTER){
					e.preventDefault();
				}
			});
		}
        this.mon(this.el, Ext.EventManager.useKeydown ? "keydown" : "keypress", this.fireKey,  this);
        this.mon(this.el, 'focus', this.onFocus, this);

        // fix weird FF/Win editor issue when changing OS window focus
        var o = this.inEditor && Ext.isWindows && Ext.isGecko ? {buffer:10} : null;
        this.mon(this.el, 'blur', this.dealBlur, this, o);
    },
    
    dealBlur: function(){
    	this.onBlur();
    	this.updateValueTip();
    },
    
    updateValueTip: function(){
    	if(!this.showValueTip){
    		return ;
    	}
    	var elVal = this.el.dom.value;
    	if(!Ext.isEmpty(elVal)){
    		this.el.dom.title = elVal;
    	}else{
    		this.el.dom.title = "";
    	}
    },
    
    // 获得控件的配置id
    getItemId: function(){
		if(this.geditor && this.geditor.colitemid){
			return this.geditor.colitemid;
		}
		return Artery.getEventId(this);
	},
    	
	isDisplayType: function(){
		return this.displayType == "display";
	},
	
	isReadOnlyType: function(){
		return this.displayType == "readOnly";
	},
	
	isHidden : function() {
		return this.hidden==true||(this.getActionEl().dom.offsetWidth == 0 && this.getActionEl().dom.offsetHeight == 0);
	},

	initDefaultOnChange: function(field, newValue, oldValue){
		// 只应该设置值，不能影响显示值
		this.value = newValue;
		//this.setValue(newValue);
	},

	setValueNoValid: function(v){
		var temp = this.disabled;
		this.disabled = true;
		this.setValue(v);
		this.disabled = temp;
	},

	setValue : function(v) {
		this.value = v;
		if(this.isDisplayType()){
			if(this.el && !(this.el.dom.tagName.toLowerCase() =='input' && this.el.dom.type.toLowerCase()=='hidden')){
				this.el.dom.innerHTML = Ext.HtmlEncode(v);
			}
			return;
		}
		if (this.rendered) {
			if (this.el.dom.value != ("" + v)) {
				this.el.dom.value = (v === null || v === undefined ? '' : ("" + v));
			}
			// modify
			// this.validate();
		}
		this.updateValueTip();
		this.afterSetValue();
	},
		
	afterSetValue : function() {
		//判断是否初始设置值，初始设置值时不进行验证
		if(!Ext.isTrue(this.initSte)){
			this.validate();
		}
	},
	
	getValue : function(){
		if(this.isDisplayType()){
			return this.el.dom.innerHTML;
		}
		
        if(!this.rendered) {
            return this.value;
        }
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },
	
	// 获得显示值
	getValueText: function(){
		var vt = this.el.dom.value;
		// 当显示值和输入提示相等时，返回空值  weijx 2010-5-11
		if(!Ext.isEmpty(this.emptyText) && this.emptyText==vt){
			vt = "";
		}
		return vt;
	},
	
	changePrevious: function(){
		if(!this.rendered){
			return;
		}
		this.previousValue = this.getValue();
	},
		
	reset : function(){
		if(!this.rendered){
			return;
		}
		if(this.originalValue + "" == this.getValue() + ""){
			return;
		}
	    this.clearInvalid();
        this.setValueNoValid(this.originalValue);
    },
	
	//改变最初的值，reset时会根据此值判断是否dirty
	setOriginalValue: function(v){
		this.originalValue = v;
	},

	onHide : function() {
		var conEl = this.getContanerEl();
		this.clearInvalid();
		if (conEl) {
			conEl.addClass('x-hide-' + this.hideMode);
			// visibility时，显示子组件有问题，需再设style
			if(this.hideMode=="visibility"){
				conEl.dom.style.visibility = "hidden";
			}
		} else {
			this.getActionEl().addClass('x-hide-' + this.hideMode);
		}
	},

	onShow : function() {
		var conEl = this.getContanerEl();
		if (conEl) {
			conEl.removeClass('x-hide-' + this.hideMode);
			// visibility时，显示子组件有问题，需再设style
			if(this.hideMode=="visibility"){
				conEl.dom.style.visibility = "";
			}
		} else {
			this.getActionEl().removeClass('x-hide-' + this.hideMode);
		}
	},

	getContanerEl : function() {
		return this.el.findParentNode('td.x-form-td-cust', 50, true);
	},
	
	// private
	getLabelEl : function() {
		if(this.labelEl == null){
			this.labelEl = Ext.get("label_" + this.id);
		}
		return this.labelEl;
	},
	
	/**
	 * 数据更新方法(公共)
	 */
	
	setLabel: function(label){
		this.fieldLabel = label;
		var labelTpl = this.getLabelTpl();
		if (this.getLabelEl() != null) {
			this.getLabelEl().update(labelTpl.replace("{label}",this.fieldLabel+this.labelSeparator));
		}
	},
	
	setLabelColor: function(labelColor){
		if (this.getLabelEl() != null) {
			this.getLabelEl().setStyle("color", labelColor);
		}
	},
	
	setLabelStyle: function(labelStyle){
		if (this.getLabelEl() != null) {
			this.getLabelEl().applyStyles(labelStyle);
		}
	},
	
	setValueStyle: function(valueStyle){
		this.el.applyStyles(valueStyle);
	},
	
	setLabelCntStyle: function(labelStyle){
		if (this.getLabelEl() != null) {
			this.getLabelEl().parent().applyStyles(labelStyle);
		}
	},	
	
	//是否必填
	setRequired: function(required){
		this.allowBlank = !required;
		var labelTpl = this.getLabelTpl();
		if (this.getLabelEl() != null) {
			this.getLabelEl().update(labelTpl.replace("{label}",this.fieldLabel+this.labelSeparator));
		}
		
		if(this.allowBlank){
			this.clearInvalid();
		}else{
			this.setLabelStyle(this.labelStyle);
		}
	},
	
	getLabelTpl: function(){
		if(this.allowBlank)
		    return Artery.config.inputLabelNotRequired;
		else
			return Artery.config.inputLabelRequired;
	},
	//**************************************//
	read : function() {
		if(this.isDisplayType()){
			return;
		}
		this.readOnly = true;
		this.el.dom.readOnly = true;
		//this.getActionEl().addClass(this.readOnlyClass);
		if(!Ext.isEmpty(this.valueStyleRead)){
			this.getActionEl().applyStyles(this.valueStyleRead);
		}
	},

	edit : function() {
		if(this.isDisplayType()){
			return;
		}
		this.readOnly = false;
		// 当editable不存在或为true时,应设置readOnly属性
		if(this.editable===false){
			// faString的editable不存在,faCode的editable可能为true
		}else{
			this.el.dom.readOnly = false;
		}
		//this.getActionEl().removeClass(this.readOnlyClass);
		if(!Ext.isEmpty(this.valueStyle)){
			this.getActionEl().applyStyles(this.valueStyle);
		}
	},
	
	/**
	 * override
	 * 
     * Disable this component and fire the 'disable' event.
     * @return {Ext.Component} this
     */
	disable : function(/* private */silent) {
		//Clear any invalid styles/messages for this field
		this.clearInvalid();
		
		return Ext.form.Field.superclass.disable.call(this);
	},
	
	/**
	 * 覆盖父类的onDisable方法，disable时为label添加x-form-label-disabled样式
	 */
	onDisable: function(){
		if(this.isDisplayType()){
			return;
		}
		this.getActionEl().addClass(this.disabledClass);
		if(!Ext.isTrue(this.submitDisabled)) {
			this.el.dom.disabled = true;
			
			if(this.hiddenField) {
				this.hiddenField.disabled = true;
			}
		}
		
		if(this.getLabelEl() != null) {
			this.getLabelEl().addClass("x-form-label-disabled");
		}
    },
    
    /**
     * 覆盖父类的onEnable方法，enable时为label去除x-form-label-disabled样式
     */
    onEnable: function(){
    	if(this.isDisplayType()){
			return;
		}
        Ext.form.Field.superclass.onEnable.call(this);
        if(this.hiddenField) {
			this.hiddenField.disabled = false;
		}
        if(this.getLabelEl() != null) {
         	this.getLabelEl().removeClass("x-form-label-disabled");
        }
    }, 
	
	update: function(){
		Artery.showSysError({
			itemid:this.id,
			error:'控件被以update()的方式调用，此方式可能会引起问题，请检查！'
		})
	},
	
	showInvalid: function(validMessage){
		this.focus();
		this.markInvalid(validMessage);
	},
	
	beforeDestroy:function(){
		this.clearInvalid();
		Ext.form.Field.superclass.beforeDestroy.call(this);
	}
})

Ext.override(Ext.form.TextField,{
	
	parseValLength: function(val){
		if(Artery.config.fieldValidLength =='1'){
			return val.length;
		}
		var flen = parseInt(Artery.config.fieldValidLength);
		var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val.charAt(i).match(/[^\x00-\xff]/ig) != null) //全角
                len += flen;
            else
                len += 1;
        }
        return len;
	},
	
	 validateValue : function(value){
	 	if(Ext.isFunction(this.validator)){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(Ext.isEmpty(value) || (this.allowBlankWhenRequired == false && value.trim() == '') || value === this.emptyText){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        //valid minLength
        var len = this.parseValLength(value);
        if(len < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(len > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },
    setValue : function(v){
    	if(this.isDisplayType()){
    		Ext.form.TextField.superclass.setValue.apply(this, arguments);
    	}else{
	        if(this.emptyText && this.el && !Ext.isEmpty(v)){
	            this.el.removeClass(this.emptyClass);
	        }
	        Ext.form.TextField.superclass.setValue.apply(this, arguments);
	        this.applyEmptyText();
	        this.autoSize();
    	}
        return this;
    },
    
    applyEmptyText : function(){
    	//重写applyEmptyText方法，当this.el.hasClass(this.emptyClass)为true时，即当显示emptyText时，也可以设置的新emptyText
        if(this.rendered && this.emptyText && (this.getRawValue().length < 1 || (this.el && this.el.hasClass(this.emptyClass))) && !this.hasFocus){
            this.setRawValue(this.emptyText);
            this.el.addClass(this.emptyClass);
        }
    },
    
    /**
     * 设置输入提示(emptyText属性)
     * newEmptyText: 新的提示信息
     * isClearOldValue: 是否清空控件的值，true:清空控件的值，fasle:不清空
     */
    setEmptyText : function(newEmptyText, isClearOldValue){
    	if(Ext.isTrue(isClearOldValue) || this.getRawValue().length < 1 || (this.el && this.el.hasClass(this.emptyClass))){
    		this.emptyText = newEmptyText;
    		this.reset();
    	}else{
    		this.emptyText = newEmptyText;
    	}
        this.on('focus', this.preFocus, this);
        this.on('blur', this.postBlur, this);
    }
})


/**
 * 提供2个按钮，clear和trigger
 * 
 * @author baon
 * @date 23/12/2008
 */
Artery.plugin.TwinTriggerField = Ext.extend(Ext.form.TwinTriggerField, {
	
	allowDomMove:false,
	
	trigger1Class: 'x-form-clear-trigger',
	
	/**
	 * 显示值
	 */
	valueText:'',
	
	initComponent: function(){
		Artery.plugin.TwinTriggerField.superclass.initComponent.call(this);
		this.initComponentTigger();
	},
	
	/**
	 * 初始化trigger的显示情况
	 */
	initComponentTigger : function(){
		if (this.readOnly) {
			this.hideTrigger1 = true;
			this.hideTrigger2 = true;
		}

		if (Ext.isEmpty(this.getValue())) {
			this.hideTrigger1 = true;
		}
	},
	
	// override
	initEvents : function() {
		Artery.plugin.TwinTriggerField.superclass.initEvents.call(this);
		this.initClearValueTaskEvent();
	},
	
	//当可输入的时候，用户使用删除键后valueText为空时，清空控件的值
	initClearValueTaskEvent : function() {
		if (Ext.isTrue(this.editable)) {
			this.clearValueTask = new Ext.util.DelayedTask(function() {
				if (Ext.isEmpty(this.getValueText())) {
					this.setValue(null);
				}
			}, this);
			this.mon(this.el, 'keyup', function(e) {
				if (!e.isNavKeyPress()) {
					this.clearValueTask.delay(250);
				}
			}, this);
		}
	},
	
	/**
	 * 隐藏trigger
	 */
	hideTrg : function() {
		if(this.getTrigger(0) != null)
			this.getTrigger(0).hide();
		if(this.getTrigger(1) != null)
			this.getTrigger(1).hide();
	},

	/**
	 * 显示trigger
	 */
	showTrg : function() {
		if (this.triggers.length > 1) { //有清空和trigger两个按钮
			if (!Ext.isEmpty(this.getValue())&& this.getTrigger(0) != null)
				this.getTrigger(0).show();
			if(this.getTrigger(1) != null)
				this.getTrigger(1).show();
		}else { //仅有trigger按钮
			if(this.getTrigger(0) != null)
				this.getTrigger(0).show();
		}
	},
	
	/**
	 * 设置显示值
	 */
	setValueText : function(vt) {
		if (Ext.isEmpty(vt)) {
			vt = "";
		}
		this.valueText = vt;
		vt = this.value;
		Artery.plugin.TwinTriggerField.superclass.setValue.call(this, this.valueText);
		this.value = vt;
	},
	
	/**
	 * 设置值
	 * @param v 值
	 * @param sv 显示值
	 */
	setValue: function(v, sv){
		// 设置隐藏值
		if (this.hiddenField) {
			this.hiddenField.value = Ext.isEmpty(v)?"":v;
		}
		this.setTriggerState(v);
		
		if (Ext.isEmpty(v)) {
			this.valueText = "";
			Artery.plugin.TwinTriggerField.superclass.setValue.call(this, this.valueText);
			this.value = v;
		}else if(sv===undefined && this.upValueText){
			this.value = v;
			this.upValueText(v);
		}else{
			this.valueText = sv;
			Artery.plugin.TwinTriggerField.superclass.setValue.call(this, this.valueText);
			this.value = v;
		}
		//判断是否初始设置值，初始设置值时不进行验证
		if(!Ext.isTrue(this.initSte)){
			this.validate();
		}
	},
	
	/** override : 在调用父的setValue()时不进行验证，设值完成后再进行验证  */
	afterSetValue : function() {
	},
	
	/**
	 * 获得值
	 */
	getValue: function(){
		return Ext.isEmpty(this.value) ? "" : this.value + "";
	},
	
	// 解析显示值，子类在需要时应该覆盖此方法
	upValueText: function(v){
		this.setValueText(v);
	},
	
	/**
	 * 设置trigger状态
	 */
	setTriggerState: function(v){
		if(this.triggers && this.triggers.length > 1 && !this.readOnly){
			if (v!= null && v!= "") {
				this.getTrigger(0).show();
			}else {
				this.getTrigger(0).hide();
			}
		}
	},
	
	// clear按钮事件函数
	onTrigger1Click : function() {
		if(this.disabled){
			return;
		}
		var ov = this.getValue();
		this.setValue(null);
		this.getTrigger(0).hide();
		// 如果值改变了，则触发change事件
		if (!Ext.isEmpty(ov)) {
			//防止onblur的时候再次触发onChange事件
			this.startValue = this.getValue();
			this.fireEvent('change', this, null, ov);
		}
	},
	
	// private
	setFieldEditable : function() {
		// Ext.form.TriggerField中的动作
		if(!Ext.isTrue(this.readOnly) && this.editable!==undefined){
			if(!this.editable){
				this.editable = true;
				this.setEditable(false);
			}else{
				this.editable = false;
				this.setEditable(true);
			}
		}
	},
	
	// private
	onRender : function(ct, position) {
		if(!Ext.get(this.id)){
			Artery.plugin.TwinTriggerField.superclass.onRender.call(this,ct,position);
			this.hiddenField = this.el.insertSibling({
				tag:'input',
				type:'hidden',
				name: this.id
            }, 'after', true);
            this.el.dom.removeAttribute('name');
			return;
		}
		if(this.isDisplayType()){
			this.el = Ext.get(this.id);
			return ;
		}
		this.wrap = Ext.get(this.id+"_wrap");
		this.el = Ext.get(this.id);
		this.checkbox = Ext.get(this.id+"_checkbox");
		if (this.checkbox) {
			this.checkbox.on("click", function(){this.setCascade(this.checkbox.dom.checked);}, this);
		}
		this.initHTMLTrigger();
		//ct.appendChild(this.wrap);
		// 添加隐藏字段
		this.hiddenField = this.el.next("input").dom;
		
		// Ext.form.TriggerField中的动作
		this.setFieldEditable();
		
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }
        // Ext.form.TriggerField中的动作
        if(this.hideTrigger){
        	for(var i=0;i<this.triggers.length;i++){
        		this.triggers[i].setDisplayed(false);
        	}
        }
	},
	
	onTriggerClick: function(e){
		this.onTrigger2Click(e);
	},
    
	// 初始化值时，需要判断valueText
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value, this.valueText);
        }
        this.originalValue = this.getValue();
        //modify 上一次的值，调用表单的submit方法改变
        this.previousValue = this.originalValue;
    },
    
    // private
    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        //this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            var triggerIndex = 'Trigger'+(index+1);

            if(this['hide'+triggerIndex]){
                t.dom.style.display = 'none';
            }
            t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },
	
    // private
	initHTMLTrigger : function(){
		var ta = this.wrap.select(".x-form-trigger",true).elements;
        var triggerField = this;
        if(ta.length > 0){
	        var trigBtnIndex = 0; //trigger按钮的index
	    	if(ta.length == 2){
	    		trigBtnIndex = 1; //第二个为trigger按钮
	    		
	    		//clear按钮
	        	ta[0].hide = function(){
	        		if (this.dom.parentNode) {
	                	this.dom.parentNode.style.display = 'none';
	        		}
	            };
	            ta[0].show = function(){
	            	if (this.dom.parentNode) {
	                	this.dom.parentNode.style.display = '';
	            	}
	            };
	
	            if(triggerField['hideTrigger1']){
	            	if (ta[0].dom.parentNode) {
	                	ta[0].dom.parentNode.style.display = 'none';
	            	}
	            }
	            ta[0].on("click", triggerField['onTrigger1Click'], triggerField, {preventDefault:true});
	            ta[0].addClassOnOver('x-form-trigger-over');
	            ta[0].addClassOnClick('x-form-trigger-click');
	    	}
	    	
	    	//trigger按钮
	    	ta[trigBtnIndex].hide = function(){
                this.dom.parentNode.style.display = 'none';
            };
            ta[trigBtnIndex].show = function(){
                this.dom.parentNode.style.display = '';
            };

            if(triggerField['hideTrigger2']){
                ta[trigBtnIndex].dom.parentNode.style.display = 'none';
            }
            ta[trigBtnIndex].on("click", triggerField['onTrigger2Click'], triggerField, {preventDefault:true});
            ta[trigBtnIndex].addClassOnOver('x-form-trigger-over');
            ta[trigBtnIndex].addClassOnClick('x-form-trigger-click');
        }
        
        this.triggers = ta;
    },
	
    /**
     * 使控件只读
     */
	read : function() {
		Artery.plugin.TwinTriggerField.superclass.read.call(this);
		this.hideTrg();
		this.el.addClass('x-field-readonly');
		this.editable = false;
		this.setFieldEditable();
	},

	/**
	 * 使控件可输入
	 */
	edit : function() {
		Artery.plugin.TwinTriggerField.superclass.edit.call(this);
		this.showTrg();
		this.el.removeClass('x-field-readonly');
		this.editable = true;
		this.setFieldEditable();
	},
	getPositionEl : function(){
        return this.wrap||this.el;
    },
    	//是否必填
	setRequired: function(required){
		this.allowBlank = !required;
		var labelTpl = this.getLabelTpl();
		if (this.getLabelEl() != null) {
			this.getLabelEl().update(labelTpl.replace("{label}",this.fieldLabel+this.labelSeparator));
		}
		
		if(this.allowBlank){
			this.clearInvalid();
		}else{
			this.setLabelStyle(this.labelStyle);
		}
	}
})
Ext.reg('apTwinTrigger', Artery.plugin.TwinTriggerField);

/**
 * 支持弹出层
 * 
 * @author weijx
 * @date 2009-11-28
 */
Artery.plugin.PopupTrigger = Ext.extend(Artery.plugin.TwinTriggerField, {
	
	// 弹出层对齐方式
	listAlign : 'tl-bl?',
	
	// 弹出层最小宽度
	minLayerWidth : 150,
	
	// 弹出层最大高度
	layerHeight : 300,
	
	// 弹出层最小高度
	minLayerHeight : 0,
	
	// 弹出层对象
	layerEl: null,
	
	// 延迟执行任务，避免restrictLayerDirect方法执行太多次
	restrictLayerTask : new Ext.util.DelayedTask(),
	
	// 显示弹出层并调整高度
	restrictLayer: function(layer, tree){
		this.restrictLayerTask.delay(10, this.restrictLayerDirect, this, [layer, tree]);
	},
	
	restrictLayerDirect: function(layer, tree){
		layer.show();
		tree.show();
		var layerWidth = Math.max(this.wrap.getWidth(), this.minLayerWidth);
		var pos = this.getPosInParent(this.wrap);
		//wa为浏览器右边可视宽度
		var wa = Artery.pwin.Ext.getBody().getRight() - pos[0];
		if (wa < layerWidth) {
			pos[0] = Math.max(pos[0] - (layerWidth - wa), 0)
		}
		// ha为浏览器上部可视高度
        var ha = pos[1]-Artery.pwin.Ext.getBody().getScroll().top;
        // hb为浏览器下部可视高度
        var hb = Artery.pwin.Ext.lib.Dom.getViewHeight()-ha-this.wrap.getHeight();
        var space = Math.max(ha, hb, this.minHeight || 0)-5;
        
        // 计算树本身高度
        var ul = tree.el.child("ul").dom;
        var ulHeight = Math.max(ul.clientHeight, ul.offsetHeight, ul.scrollHeight);
        // 出现横向滚动条时，加上滚动条的高度
        if (layerWidth < ul.scrollWidth) {
        	ulHeight = ulHeight + 20;
        }
        var bbar = tree.el.child(".x-panel-bbar").dom;
        var treeHeight = ulHeight + bbar.clientHeight + 2;
        
        var h = Math.min(space, this.layerHeight, treeHeight);
        
        h = Math.max(h, this.minLayerHeight);
        
        var layerPos = null;
        if((ha>hb) && (this.layerHeight>(hb-5))){
        	// 在上面显示layer
        	layerPos = [pos[0],(pos[1]-h)];
        }else{
        	// 在下面显示layer
        	layerPos = [pos[0],(pos[1]+this.wrap.getHeight())];
        }
        layer.beginUpdate();
        tree.setSize(layerWidth, h);
        layer.endUpdate();
        layer.setSize(layerWidth, 0);
        layer.setXY(layerPos);
	},
	
	// 获得一个el在父页面中的位置
	getPosInParent: function(el) {
		var x =0, y=0;
		var fn = function(win){
			while(Artery.pwin != win ){
				var iframeEl = win.parent.Ext.get(win.frameElement);
				x +=  iframeEl.getLeft();
				y += iframeEl.getTop();
				win = win.parent;
			}
		}
		if (Artery.pwin == window) {
			x = el.getLeft();
			y = el.getTop();
		} else {
			fn(window);
			x += el.getLeft();
			y += el.getTop();
		}
		return [x, y];
	},
    
	// 判断弹出层是否可见
	isExpanded : function(){
        return this.layerEl && this.layerEl.isVisible();
    },
    
    // 在事件发生在本组件以外时，关闭弹出层
    collapseIf : function(e){
    	if(!e){
    		this.collapse(true);
    		return ;
    	}
        if(!e.within(this.wrap) && !e.within(this.layerEl)){
            this.collapse(true);
        }
    },
    
	// 隐藏弹出层
    // clearTV: 为true，则清空临时值
	collapse : function(clearTV){
        if(!this.isExpanded()){
            return;
        }
		// 取消restrictLayerTask
		this.restrictLayerTask.cancel();
        if(clearTV===true && this.clearTempValue){
        	this.clearTempValue();
        }
        this.layerEl.hide();
        // 做验证
        this.focus();
		this.validate();
		if(this.geditor){
			this.geditor.allowBlur = false;
			this.geditor.completeEdit();
		}
    },
	
	// 加载子节点前调用
	onBeforeload: function(loader, node) {
		loader.baseParams.itemid = this.dynamicNodeId;
		loader.baseParams.formid = Artery.getFormId(this);
		loader.baseParams.node_type = node.attributes.type;
		loader.baseParams.node_cid = node.attributes.cid;
		loader.baseParams.node_name = node.text;
		loader.baseParams.node_leaf = node.isLeaf() + "";
		if (node.attributes.iconId) {
			loader.baseParams.node_iconId = node.attributes.iconId;
		}
		if(this.filterField){
			var fv = this.filterField.getValue();
			if(!Ext.isEmpty(fv)){
				loader.baseParams.filterValue = fv;
			}else{
				loader.baseParams.filterValue = "";
			}
		}else{
			loader.baseParams.filterValue = "";
		}
		//添加请求中的参数
		Ext.applyIf(loader.baseParams,Artery.getParams({}, this));
		// 执行onBeforeLoad事件
		if(this.onBeforeLoadEvent){
			Artery.regItemEvent(this,'onBeforeLoadEvent',null,{
				'loader':loader,
				'node':node
			});
		}
	}
});

// 树控件公用方法
Artery.plugin.faTreeFunc = {
	// 设置是否级联
	setCascade : function(isCascade) {
		this.cascade = Ext.isTrue(isCascade);
	},
	// 在树上寻找应该选中的节点 用于Artery.plugin.STreePopup和Artery.plugin.STree
	skinSelectedNode: function(tree, val){
		var nf = function(node){
			var checked = false;
			if(node.attributes.cid==val){
				checked = true;
			}
			if(checked){
				node.select();
			}else{
				node.unselect();
			}
			if(node.ui.checkbox){
				node.ui.checkbox.checked = checked;
			}
			if(!node.isLeaf() && node.isLoaded && node.isLoaded()){
				node.eachChild(nf);
			}
		}
		nf(tree.root);
	},
	
	// 获得级联值
	getCascadeValue: function(){
		if(!this.cascade){
			throw "没有开启级联功能";
		}
		var casInput = document.getElementById(this.id+"Cascade");
		if(casInput){
			return casInput.value;
		}else{
			return "";
		}
	},
	
	// 确认节点的选中状态 用于Artery.plugin.MTreePopup和Artery.plugin.MTree
	sureSelectedNode: function(clearCas){
		if(!this.custTree){
			return ;
		}
		var me = this;
		var nf = function(node){
			me.sureNode(node, clearCas);
			if(!node.isLeaf() && (!node.isLoaded || node.isLoaded())){
				node.eachChild(nf);
			}
		}
		nf(this.custTree.root);
	},
	
	// 确认节点的选中状态
	// clearCas为true时，则清除级联状态
	sureNode: function(n, clearCas){
		if(this.custStore.getById(n.attributes.cid)!=null){
			if(n.ui.checkbox){
				n.ui.checkbox.checked = true;
			}
			if(this.cascade){
				n.attributes.cascadestatus = "2";
			}
		}else{
			if(n.ui.checkbox){
				n.ui.checkbox.checked = false;
			}
		}
		if(clearCas){
			delete n.attributes.cascadestatus;
		}
	},
	
	// 值写回faTree
	onSubmitValue: function(){
		var val = [], valText = [];
		this.custStore.each(function(record) {
			val[val.length] = record.get('id');
			valText[valText.length] = record.get('name');
		});
		var ov = this.getValue();
		var separator = Artery.getMultiSelectSeparator();
		this.value = val.join(separator);
		this.valueText = valText.join(separator);
		// 不清空级联状态
		this.setValue(this.value, this.valueText, false);
		//防止onblur的时候再次触发onChange事件
		this.startValue = this.getValue();
		this.fireEvent('change',this,this.value, ov);
	},
	
	// 节点展开时调用
	onExpandnode: function(node){
		
		var isParentClick = function(node){
			var pNode = node.parentNode;
			while(pNode != null){
				if(pNode.isClick === true){
					return true;
				}
				pNode = pNode.parentNode;
			}
			return false;
		}
		var isChildChecked =false;
		node.eachChild(function(n){
			if(this.cascade&&node.attributes.cascadestatus=="2"){
				if(n.ui.checkbox && n.attributes.disablecheck != true){
						if(n.ui.checkbox.checked){
							isChildChecked=true;
						}
					}
			}
		},this)
		
		node.eachChild(function(n){
			//throw e;
			if(this.cascade){
				if(node.attributes.cascadestatus=="0"){
					if(n.ui.checkbox){
						n.ui.checkbox.checked = false;
						this.delRecord(n);
					}
					n.attributes.cascadestatus = "0";
				}else if(node.attributes.cascadestatus=="1"){
					
				}else if(node.attributes.cascadestatus=="2" && isParentClick(n) &&!isChildChecked){
					if(n.ui.checkbox && n.attributes.disablecheck != true){
						n.ui.checkbox.checked = true;
						this.addRecord(n);
					}
					n.attributes.cascadestatus = "2";
				}else{
					this.sureNode(n);
				}
			}else{
				this.sureNode(n);
			}
		},this);
	},
	
	isParentClick: function(node){
		var pNode = node.parentNode;
		while(pNode != null){
			if(pNode.isClick === true){
				return true;
			}
			pNode = pNode.parentNode;
		}
		return false;
	},
	
	// 节点切换时调用
	onCheckchange: function(node, checked){
		//确定节点进行了点击
		node.isClick=true;
		if(this.cascade){
			this.onCascadeNode(node, checked);
		}
		if(checked){
			this.addRecord(node);
		}else{
			this.delRecord(node);
		}
	},
	
	// 级联处理上下级节点
	onCascadeNode: function(node, checked){
		// 处理子节点
		var me = this;
		var nf = function(n){
			if(me.cascade&&n.isLoaded && !n.isLoaded()){
				n.reload();
				if(n.isExpanded()){
					n.collapse(false,false);
				}
			}
			if(n.ui.checkbox){
				n.ui.checkbox.checked = checked;
			}
			if(checked){
				n.attributes.cascadestatus = "2";
				me.addRecord(n);
			}else{
				n.attributes.cascadestatus = "0";
				me.delRecord(n);
			}
			if(!n.isLeaf() && (!n.isLoaded || n.isLoaded())){
				n.eachChild(nf);
			}
			
		}
		nf(node);
		// 级联父节点为false时，不处理父节点状态
		if((me.cascadeParent=='allchild' || me.cascadeParent=='singlechild') && node.parentNode){
			// 处理父节点
			var np = function(n){
			if(n==me.root){
				return ;
			}
			//throw e;
			var casStatus = {"0":0,"1":0,"2":0};
			n.eachChild(function(inode){
				if(inode.attributes.cascadestatus!==undefined){
					casStatus[inode.attributes.cascadestatus]++;
				}else{
					// 根据节点的checkbox状态判断
					if(inode.ui.checkbox){
						if(inode.ui.checkbox.checked){
							casStatus["2"]++;
						}else{
							casStatus["0"]++;
						}
					}else{
						casStatus["2"]++;
					}
				}
			});
			if(casStatus["0"]==n.childNodes.length){
				n.attributes.cascadestatus = "0";
				me.delRecord(n);
			}else if(casStatus["2"]==n.childNodes.length){
				n.attributes.cascadestatus = "2";
				me.addRecord(n);
			}else{
				if(me.cascadeParent=='allchild'){
					n.attributes.cascadestatus = "1";
					me.delRecord(n);
				}
				if(me.cascadeParent=='singlechild'){
					n.attributes.cascadestatus = "2";
					me.addRecord(n);
				}
			}
			if(n.ui.checkbox){
				if(me.cascadeParent=='allchild')
					n.ui.checkbox.checked = casStatus["2"]==n.childNodes.length;
				if(me.cascadeParent=='singlechild')
					n.ui.checkbox.checked = casStatus["2"]>0;
			}
			
			np(n.parentNode);
		  }
		  np(node.parentNode);
		}
		
	},
	
	// 生成级联树状态
	genCascadeValue: function(){
		if(!this.custTree){
			return ;
		}
		var rnl = [];
		var sf = function(node, nl){
			var nc = {
				cid: node.attributes.cid,
				name: node.text,
				type: node.attributes.type,
				leaf: node.isLeaf()+""
			};
			if (node.attributes.iconId) {
				nc.iconId = node.attributes.iconId;
			}
			if(node.ui.checkbox){
				nc.checked = node.ui.checkbox.checked+"";
			}
			if(node.attributes.cascadestatus!==undefined){
				nc.cascadestatus = node.attributes.cascadestatus;
			}else if(node.checked!==undefined){
				if(node.checked=="true"){
					nc.cascadestatus = "2";
				}else{
					nc.cascadestatus = "0";
				}
			}
			nl.push(nc);
			if(!node.isLeaf() && (!node.isLoaded || node.isLoaded())){
				var cs = node.childNodes;
				nc.children = [];
				for(var i = 0, len = cs.length; i < len; i++) {
        			sf(cs[i],nc.children);
        		}
			}
		}
		var cs = this.root.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	sf(cs[i],rnl);
        }
        this.cascadeField.value = Ext.encode(rnl);
	},
	
	// 清除级联树状态
	clearCascadeValue: function(){
		if(!this.custTree){
			return ;
		}
		var sf = function(node){
			node.attributes.cascadestatus = "0";
			if(!node.isLeaf() && (!node.isLoaded || node.isLoaded())){
				var cs = node.childNodes;
				for(var i = 0, len = cs.length; i < len; i++) {
        			sf(cs[i]);
        		}
			}
		}
		var cs = this.root.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	sf(cs[i]);
        }
        this.cascadeField.value = "";
	},
	
	// 添加所选记录
	addRecord : function(node) {
		var a = node.attributes
		if (this.custStore.getById(a.cid) == null) {
			var data = [];
			data.push([a.cid, node.text, a.pinyin == null ? '' : a.pinyin]);
			this.custStore.loadData(data, true);
		}
	},
	
	// 删除记录
	delRecord : function(node) {
		var rec = this.custStore.getById(node.attributes.cid);
		if(rec){
			this.custStore.remove(rec);
		}
	},
	
	/** 单击树上节点时选中 */
	singleClickCheckHandler: function(node, e) {
		var nodeUI = node.getUI();

		if (nodeUI.disabled || nodeUI.node.disabled) {
			return;
		}
		if (nodeUI.checkbox && !nodeUI.checkbox.disabled) {
			nodeUI.toggleCheck();
		}

		// 直接调用onDblClick方法会导致节点展开
		// nodeUI.onDblClick(e);
	},
	
	/** 双击树上节点时确定 */
	dblClickReturnHandler : function(node, e) {
		if (this.okBtn) {
			this.okBtn.fireEvent('click',this.okBtn);
		} else if (Ext.isFunction(this.submitValue)) {
			this.submitValue();
		}
	}
};

// 分级代码控件公用方法
Artery.plugin.faClassCodeFunc = {
	
	// 查询输入框
	searchField: null,
	
	// 查询到的nodePath集合
	searchNodePaths: null,
	
	// 查询字符串
	searchText: null,
	
	// 展开节点index
	searchNodeIndex: 0,
	
	// 创建查询工具栏，如果submitButton为true，则同时创建提交按钮
	createBottombar: function(submitButton){
		var barConf = [];
		this.searchField = new Artery.pwin.Ext.form.TextField({
			emptyText : '请输入名称',
			width : 230,
			enableKeyEvents : true,
			listeners : {
				"keydown" : {
					fn : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							this.searchCode();
						} else {
						}
					},
					scope : this
				}
			}
		});
		barConf.push(this.searchField);
		barConf.push("-");
		barConf.push({
			text : '查找',
			handler : this.searchCode,
			scope : this
		});
		if(submitButton){
			barConf.push("->");
			barConf.push({
				text : '确定',
				handler : this.submitValue,
				scope: this
			});
		}
		return barConf;
	},
	
	// 查询代码
	searchCode: function(){
		if(this.searchField == null){
			return;
		}
		var searchText = this.searchField.getValue();
		if (Ext.isEmpty(searchText)) {
			return;
		}
		if(searchText==this.searchText){
			this.expandSearchNode(this.searchNodeIndex+1);
			return ;
		}
		var paramObj = Artery.getParams({
			searchText : searchText,
			codeType: this.codeType
		}, this);
		if(!Artery.params){
			paramObj.itemType = this.itemType;
			paramObj.moreProp = this.moreProp;
		}
		// 发送ajax请求
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=searchClassCode",
			success : function(response, options) {
				// 清空状态
				this.searchNodePaths = null;
				this.searchText = null,
				this.searchNodeIndex = 0;
				// 展开节点
				var resObj = Ext.decode(response.responseText);
				if(resObj.nodeList && resObj.nodeList.length>0){
					this.searchNodePaths = resObj.nodeList;
					this.searchText = searchText;
					this.expandSearchNode(0);
				}
			},
			scope : this,
			params : paramObj
		})
	},
	
	// 展开查询到的节点
	expandSearchNode: function(idx){
		var size = this.searchNodePaths.length;
		this.searchNodeIndex = idx%size;
		var path = this.searchNodePaths[this.searchNodeIndex];
		this.expandNode(path, false);
	},
	
	// 根据路径展开节点
	expandNode : function(path, checked) {
		var organ = this;
		// 内部函数
		var pathFn = function(path) {
			var idarray = path.split(",");
			while (idarray.length > 0) {
				var id = idarray.shift();
				if (id == organ.rootId) {
					break;
				}
			}
			return idarray;
		}
		var expandFn = function(node) {
			if (idarray.length == 1) {
				var tnode = node.findChild('cid', idarray.shift());
				if(tnode){
					tnode.select();
					Ext.fly(tnode.ui.elNode).scrollIntoView();
					if (checked == true && tnode.ui.checkbox) {
						tnode.ui.checkbox.checked = true;
					}
				}
				return;
			}
			var subNode = node.findChild('cid', idarray.shift());
			if (subNode == null) {
				return;
			}

			subNode.expand(false, false, expandFn);
		}

		// 展开定位节点
		var idarray = pathFn(path);
		this.root.expand(false, false, expandFn);
	}
}