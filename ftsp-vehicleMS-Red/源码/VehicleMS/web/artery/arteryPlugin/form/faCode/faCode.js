// ***************************************************************************************//
// Select
// ***************************************************************************************//
/**
 * Artery Select component
 * 
 * @author baon
 * @date 27/02/2009
 * 
 * @class Artery.plugin.Select
 * @extends Ext.ux.Andrie.Select
 */
Artery.plugin.Select = Ext.extend(Ext.ux.Andrie.Select, {

	queryField : "dmjp",

	valueField : "codeValue",

	displayField : "codeName",

	ajaxLoad : true,

	codeType : null,

	valueText : '',
	
	editReload: false,//是否输入重新加载

	dmjp : true,

	store : null,

	storeData : null,
	
	mode : 'local',

	triggerAction : 'all',
	
	forceSelection: false,

	multiSelect : false,
	
	shadow: false,
	
	getTrigger : Artery.plugin.TwinTriggerField.prototype.getTrigger,

	initTrigger : Artery.plugin.TwinTriggerField.prototype.initTrigger,
	
	initHTMLTrigger : Artery.plugin.TwinTriggerField.prototype.initHTMLTrigger,
	
	initComponentTigger: Artery.plugin.TwinTriggerField.prototype.initComponentTigger,
	
	hideTrg : Artery.plugin.TwinTriggerField.prototype.hideTrg,

	showTrg : Artery.plugin.TwinTriggerField.prototype.showTrg,
	
	setFieldEditable : Artery.plugin.TwinTriggerField.prototype.setFieldEditable,
	
	getPositionEl : Artery.plugin.TwinTriggerField.prototype.getPositionEl,
	
	read : function(){
		Artery.plugin.TwinTriggerField.prototype.read.call(this);
		this.onBeforeRead();
	},
	
	edit : function(){
		Artery.plugin.TwinTriggerField.prototype.edit.call(this);
		this.onBeforeEdit();
	},
	
	setValueText : Artery.plugin.TwinTriggerField.prototype.setValueText,

	initComponent : function() {
		Artery.plugin.Select.superclass.initComponent.call(this);
		
		this.initStore();
		this.parseValueText();
		this.initComponentTigger();

		this.on("collapse", function() {
			this.focus();
			this.validate();
		}, this)
	},
	
	//初始化store
	initStore : function(){
		if (this.store == null) {
			if(this.ajaxLoad){
				var storeCfg = {
					proxy : new Ext.data.HttpProxy({
						url : sys.getContextPath() + '/artery/form/dealParse.do?action=runItemLogic'
					}),
					reader : new Ext.data.ArrayReader({}, this.getStoreFields())
				}
				if(this.storeData != null){
					storeCfg.data = this.storeData;
				}
				this.store = new Ext.data.Store(storeCfg);
				this.store.on("beforeload", this.onBeforeload, this);
			}else{
				this.store = new Ext.data.SimpleStore({
					fields:this.getStoreFields(),
					data:this.storeData
				})
			}
		}
	},
	
	// 加载前设置一些参数
	onBeforeload: function(store, options){
		if (options.params == null) {
			options.params = {};
		}
		options.params=Artery.getParams(options.params,this);
		Ext.apply(options.params, {
			codeType : this.codeType,
			value : this.value,
			valueText : this.getValueText(),
			method:'parseAjaxCode'
		});
		// 设置用户自定义参数
		options.params.custParams = Ext.encode(this.custParams);
		if(!Artery.params){
			options.params.itemType = 'faCode';
			options.params.moreProp = this.multiSelect ? 'MSelect' : 'SSelect';
		}
	},
	
	getStoreFields: function(){
		if(Ext.isTrue(this.dmjp)){
			return ['codeName','codeValue','dmjp'];
		}else{
			return ['codeName','codeValue'];
		}
	},
	
	onTriggerClick : function(){
		if(this.isDisplayType() || this.disabled || this.readOnly){
            return;
        }
        this.initList();
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    },
    
    onTrigger1Click : function() {
	    // 当disabled时，不能清空值
		if(this.disabled){
			return;
		}
		var ov = this.getValue();
		this.clearValue(true);
		// 如果值改变了，则触发change事件
		if (!Ext.isEmpty(ov)) {
			//防止onblur的时候再次触发onChange事件
			this.startValue = this.getValue();
			this.fireEvent('change', this, null, ov);
		}
	},
    
	clearValue : function(fireChangeEvent) {
		this.setValue(null, false);
		Ext.ux.Andrie.Select.superclass.clearValue.call(this, fireChangeEvent);
		this.clearAllSelect.call(this);
	},

	// 解析valueText
	// 如果参数v不为空，则根据v去解析valueText
	// 如果参数v为空，    则按照this.value去解析valueText
	parseValueText : function(v) {
		if(Ext.isEmpty(v)){
			v = this.value;
		}
		if (!Ext.isEmpty(v) && Ext.isEmpty(this.valueText)) {
			var paramObj = Artery.getParams({
				codeType : this.codeType,
				codeValue : v,
				method : 'getCodeValueText'
			}, this);
			if(!Artery.params){
				paramObj.itemType = 'faCode';
				paramObj.moreProp = this.multiSelect ? 'MSelect' : 'SSelect';
			}
			if(this.lastReloadParams){
				Ext.apply(paramObj, this.lastReloadParams);
			}
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
				scope : this,
				syn : false,
				params : paramObj,
				success : function(response, options) {
					//this.valueText = response.responseText;
					this.setValueText(response.responseText);
				}
			})
		}

	},
	
	//根据值获得文本
	getValueTextByValue : function(v){
		var vt;
		if (v == null) {
			v = "";
		} else {
			v = v + "";
		}
		v = Artery.getCommaSplitValue(v);
		if (!(v instanceof Array)) {
			if(this.multiSelect){
				var separator = Artery.getMultiSelectSeparator();
				v = v.split(separator);
			}else{
				v = [v];
			}
		}
		if(Ext.isEmpty(v))
			return vt;
		if (this.store.getCount() <= 0) {
			var paramObj = Artery.getParams({
				codeType : this.codeType,
				codeValue : v,
				method : 'getCodeValueText'
			}, this);
			if(!Artery.params){
				paramObj.itemType = 'faCode';
				paramObj.moreProp = this.multiSelect ? 'MSelect' : 'SSelect';
			}
			Artery.request({
				url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
				scope : this,
				syn : false,
				params : paramObj,
				success : function(response, options) {
					vt = response.responseText;
				}
			});
		}else{
			vt = this.findValueText(v);
		}
		return vt;
	},

	beforeBlur : function(){
        // ComboBox的beforeBlur在多选时有问题
    },

    // 显示值的设置由本控件负责更新
	setValue : function(v, fireChangeEvent) {
		if(Ext.isEmpty(fireChangeEvent)){
			var faCodeSetValueFireChangeEvent = Artery.config.faCodeSetValueFireChangeEvent == "true" ? true : false;
			fireChangeEvent = faCodeSetValueFireChangeEvent;
		}
		var oldValue = this.value;
		var newValue = v;
		if (v == null) {
			v = "";
		} else {
			v = v + "";
		}
		v = Artery.getCommaSplitValue(v);
		if (!(v instanceof Array)) {
			if(this.multiSelect){
				var separator = Artery.getMultiSelectSeparator();
				v = v.split(separator);
			}else{
				v = [v];
			}
		}
		// 更新显示值
		if (this.store.getCount() <= 0) {
			this.valueText = null;
			this.parseValueText(v);
		}else{
			var vt = this.findValueText(v);
			this.setValueText(vt);
		}
		Artery.plugin.Select.superclass.setValue.call(this, v, fireChangeEvent);
		Artery.plugin.TwinTriggerField.prototype.setTriggerState.call(this, v);
	},
	
	// 查找显示值
	findValueText: function(valueArray){
		var result = [];
		var isFiltered = this.store.isFiltered();
		var tmp;
		if(isFiltered){
			tmp = this.store.data;
			this.store.data = this.store.snapshot;
		}
		for (var i = 0, len = valueArray.length; i < len; i++) {
			var text = valueArray[i];
			if (this.valueField) {
				var r = this.findRecord(this.valueField, text);
				if (r) {
					text = r.data[this.displayField];
				} else if (this.valueNotFoundText !== undefined) {
					text = this.valueNotFoundText;
				}
			}
			result.push(text);
		}
		var separator = Artery.getMultiSelectSeparator();
		vt = result.join(separator);
		if(isFiltered){
			this.store.data = tmp;
			delete tmp;
		}
		return vt;
	},
	
	/**
	 * 获得显示值
	 */
	/*
	weijx 2010-5-11
	代码输入控件不需要重写getValueText方法，onBeforeload方法中会回传valueText参数，后台可根据此参数重新生成数据
	getValueText: function(){
		var v = this.valueArray;
		var textArray = [];
		for (var i = 0, len = v.length; i < len; i++) {
			var text = v[i];
			if (this.valueField) {
				var r = this.findRecord(this.valueField, v[i]);
				if (r) {
					text = r.data[this.displayField];
				} else if (this.valueNotFoundText !== undefined) {
					text = this.valueNotFoundText;
				}
			}
			textArray.push(text);
		}
		return textArray.join(',');
	},*/
	
	reset : function() {
		if(!this.rendered){
			return;
		}
		if(this.view != null){
			var nodes = Ext.apply([], this.view.getSelectedNodes());
			for (var i = 0, len = nodes.length; i < len; i++) {
				this.view.deselect(nodes[i], true);
			}
		}
		Ext.ux.Andrie.Select.superclass.reset.call(this);
	},
	onRender : function(ct, position) {
		Artery.plugin.TwinTriggerField.prototype.onRender.call(this, ct, position);
        if(!this.lazyInit){
            this.initList();
        }else{
            this.on('focus', this.initList, this, {single: true});
        }

        if(this.displayType=="editable"){
        	this.onBeforeEdit();
        }
	},
	
	// 如果控件是可输入的，则应调用此方法
	onBeforeEdit : function(){
		if (this.editReload) {
			this.onEditReloadHandler = function(e){
				var key = e.getKey();
				if(key!=37 && key!=38 && key!=39 && key!=40 && key!=16 && key!=17 && key!=18 && key!=13 && key!=27 ){
					this.reload();
				}
			};
			this.el.on("keyup", this.onEditReloadHandler, this);
		}
	},
	
	onDisable : function() {
		Ext.form.ComboBox.superclass.onDisable.apply(this, arguments);
		if(!Ext.isTrue(this.submitDisabled) && this.hiddenField){
			this.hiddenField.disabled = true;
		}
	},
	
	// 如果控件变为不可输入，应该调用此方法
	onBeforeRead : function(){
		if (this.editReload) {
			this.el.un("keyup", this.onEditReloadHandler, this);
		}
	},

	// 重新加载
	// {multiSelect:true,params:{},callback:function}
	reload : function(userParams) {
		if(!this.ajaxLoad){
			alert("单值代码控件非异步加载时不能调用reload方法");
			return ;
		}
		this.clearLastVRV();
		var o = {};
		if (userParams) {
			o = Ext.decode(Ext.encode(userParams));
			if (userParams.callback) {
				o.callback = userParams.callback;
			}
		}
		if(o.params == null){
			o.params = {};
		}
		this.lastReloadParams = {}
		Ext.apply(this.lastReloadParams,o.params);
		if(!Ext.isEmpty(o.codeType)){
			o.codeType = o.codeType + "";
			this.codeType = o.codeType;
			this.clearValue(false);
		}
		this.store.reload({
			params : o.params,
			callback : function(r, options, success) {
				if (o.multiSelect && o.multiSelect != this.multiSelect) {
					this.multiSelect = o.multiSelect;
				}
				this.loaded = true;
				this.store.loaded = true;
				if(this.view){
					this.view.refresh();
				}
				if (o.callback) {
					o.callback.call(this, r, options, success);
				}
			},
			scope : this
		})
	},

	selectMulti : function(multi) {
		if (multi != this.multiSelect) {
			this.multiSelect = multi;
			this.list = null;
			this.initList();
		}
	},

	// private
	doQuery : function(q, forceAll) {
		if (q === undefined || q === null) {
			q = '';
		}
		var qe = {
			query : q,
			forceAll : forceAll,
			combo : this,
			cancel : false
		};
		if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
			return false;
		}

		// modify
		if (this.ajaxLoad) {
			if (this.loaded == null) {
				this.store.on('load', function(store) {
							store.loaded = true;
						}, this)
				this.store.load();
				this.loaded = true;
			}
			if (this.store.loaded == null) {
				this.doQuery.defer(200, this, [q, forceAll]);
				return false;
			}
		}

		q = qe.query;
		forceAll = qe.forceAll;
		if (forceAll === true || (q.length >= this.minChars)) {
			if (this.lastQuery !== q) {
				this.lastQuery = q;
				if (this.mode == 'local') {
					this.selectedIndex = -1;
					if (forceAll) {
						this.store.clearFilter();
					} else {
						var reg = "";
						var index = 0;//q.lastIndexOf(";");
						if(q){
							reg = new RegExp("；","g");
							q = q.replace(reg,";");
							index = q.lastIndexOf(";");
						}
						if(q.length>index+1)
							q = q.substring(index+1);
						try{
							reg = new  RegExp("("+q+")");
						}catch(e){
							reg = q;
						}
						
						// judge queryField
						if (this.dmjp && this.queryField != null) {
							this.store.filter(this.queryField,reg);
							// window.status = this.store.getCount()
							if (this.store.getCount() == 0) {
								this.store.filter(this.displayField, reg);
							}
						} else {
							this.store.filter(this.displayField, reg);
						}

					}
					this.onLoad();
				} else {
					this.store.baseParams[this.queryParam] = q;
					this.store.load({
								params : this.getParams(q)
							});
					this.expand();
				}
			} else {
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
		// modify
		this.reSelectValue();
	},
	onLoad : function() {
		Artery.plugin.PopupLayerMgr.hideAll();

		if (!this.hasFocus) {
			return;
		}
		if (this.store.getCount() > 0) {
			this.expand();
			this.restrictHeight();
			if (this.lastQuery == this.allQuery) {
				if (this.editable) {
					this.el.dom.focus();
				}
				// ANDRIE
				this.selectByValue(this.value, true);
				/*
				 * if(!this.selectByValue(this.value, true)){ this.select(0,
				 * true); }
				 */
				// END
			} else {
				this.selectNext();
				// if(this.typeAhead && this.lastKey !=
				// Ext.EventObject.BACKSPACE && this.lastKey !=
				// Ext.EventObject.DELETE){
				// this.taTask.delay(this.typeAheadDelay);
				// }
			}
		} else {
			this.onEmptyResults();
		}
		// this.el.focus();
	},

	onKeyUp : function(e) {
		//modify by wj 当按下回车键时，也开始搜索；兼容用中文输入法按回车输入英文字母的情况
		if (this.readOnly !== true && this.editable !== false && (!e.isSpecialKey() || e.getKey() == 8 || e.getKey() == 13) && this.editReload == false) {
			if (e.getKey() == 13 && this.selectByEnter) {
				delete this.selectByEnter;
				return;
			}
			// modify
			if(!this.multiSelect)
				this.valueArray = [];
			this.lastKey = e.getKey();
			this.dqTask.delay(this.queryDelay);
		}
	},

	/**
	 * 数据更新方法
	 */
	setCodeType : function(codeType) {
		this.codeType = codeType;
		this.clearValue(false);
		this.store.reload();
	}
})

// register xtype
Ext.reg('apselect', Artery.plugin.Select);

// ***************************************************************************************//
// FaCodeSRadio
// ***************************************************************************************//
/**
 * Artery FaCodeSRadio component
 * 
 * @author baon
 * @date 27/02/2009
 * 
 * @class Artery.plugin.FaCodeSRadio
 * @extends Ext.form.Field
 */
Artery.plugin.FaCodeSRadio = Ext.extend(Ext.form.Field, {
	
	// 隐藏使用的css
	hideClass: "x-hide-display",
	
	actionMode:'wrap',
	
	// 重新加载，支持自定义参数和回调函数
	// {params:{},callback:function}
	reload: function(userParams){
		var o = {};
		if (userParams) {
			o = Ext.decode(Ext.encode(userParams));
			if (userParams.callback) {
				o.callback = userParams.callback;
			}
		}
		if(o.params == null){
			o.params = {};
		}
		Ext.apply(o.params, Artery.getParams({
			codeType : this.codeType,
			value : this.value,
			valueText : this.getValueText(),
			method:'parseAjaxCode'
		}, this));
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			success : function(response, options) {
				if (Ext.isEmpty(response.responseText)) {
					Artery.alertMsg("错误提示", "加载代码错误");
					return;
				}
				this.wrap.dom.innerHTML = response.responseText;
				if (o.callback) {
					o.callback.call(this);
				}
			},
			params : o.params,
			scope : this
		});
	},

	// private
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		if(!this.isDisplayType()){
			this.readDom = Ext.getDom(this.id+"_read");
			this.textDom = Ext.getDom(this.id+"Text");
			this.wrap = Ext.get(this.id+"_wrap");
			if(this.wrap){
				this.wrap.on("click", this.onWrapClick, this);
			}
		}
	},
	
	// 数据区单击事件
	onWrapClick: function(e,t,o){
		var tn = t.tagName.toLowerCase();
		if(tn=="input"){
			var oldValue = this.el.dom.value;
			var newValue = t.value;
			var field = this;
			this.el.dom.value = newValue;
			this.validate();
			this.initDefaultOnChange(this, newValue, oldValue);
			this.valueText = this.textDom.value = this.getRadioText(t);
			// onChange事件
			if (!Ext.isEmpty(this.onChangeEvent) && !this.disabled) {
				Artery.regItemEvent(this,'onChangeEvent','onChangeServer',{
					'newValue':newValue,
					'oldValue':oldValue
				});
			}
		}
	},

	// 使组件只读
	read : function() {
		if (!this.rendered) {
			return;
		}
		this.readDom.innerHTML = this.getValueText();
		Ext.fly(this.readDom).removeClass(this.hideClass);
		this.wrap.addClass(this.hideClass);
		// 应用只读样式
		if(!Ext.isEmpty(this.valueStyleRead)){
			this.getActionEl().parent("td").applyStyles(this.valueStyleRead);
		}
	},

	// 使组件可编辑
	edit : function() {
		if (!this.rendered) {
			return;
		}
		Ext.fly(this.readDom).addClass(this.hideClass);
		this.wrap.removeClass(this.hideClass);
		// 应用编辑样式
		if(!Ext.isEmpty(this.valueStyle)){
			this.getActionEl().parent("td").applyStyles(this.valueStyle);
		}
	},
	
	// 无效组件
	disable : function() {
		Artery.plugin.FaCodeSRadio.superclass.disable.call(this);
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			item.disabled = true;
		});
	},
	
	// 有效组件
	enable : function() {
		Artery.plugin.FaCodeSRadio.superclass.enable.call(this);
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			item.disabled = false;
		});
	},
	
	// 设置值
	setValue : function(v) {
		if(this.isDisplayType()){
			var vt = this.getValueTextByValue(v);
			Artery.plugin.FaCodeSRadio.superclass.setValue.call(this, vt);
			return;
		}

		Artery.plugin.FaCodeSRadio.superclass.setValue.call(this, v);
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			if (item.value == v) {
				item.checked = true;
				this.valueText = this.textDom.value = this.getRadioText(item);
			}else{
				item.checked = false;
			}
		}, this);
	},
	
	// 初始化原始值，Ext.form.Field中会调用
	initValue: function(){
		this.originalValue = this.getValue();
		this.previousValue=this.originalValue;
	},
	
	// 获得显示值
	getValueText: function(){
		return this.textDom.value;
	},
	
	// 获得radio的显示值
	getRadioText: function(radioInput){
		var label = Ext.fly(radioInput.parentNode).child("span",true);
		return label.innerHTML;
	},
	
	//把指定值的组件设置无效
	disableItem: function(value){
		if(Ext.isEmpty(value)){
			return;
		}
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray,function(item,idx){
			if(item.value == value){
				item.disabled = true;
			}
		});
	},
	//把指定值的组件设置有效
	enableItem: function(value){
		if(Ext.isEmpty(value)){
			return;
		}
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray,function(item,idx){
			if(item.value == value){
				item.disabled = false;
			}
		});
	},
	
	/**
	 * 数据更新方法
	 */
	setCodeType : function(codeType) {
		this.codeType = codeType;
		this.setValue(null);
		this.reload();
	},
	
	// private
	validateValue : function(value){
		if(Ext.isFunction(this.validator)){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
		if(this.allowBlank == false){
         	if(Ext.isEmpty(value)){
              this.markInvalid(this.blankText);
              return false;
         	}
	         this.clearInvalid();
         }
         return true;
    },
    
    //得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.wrap;
	},
	
	//根据值获得文本
	getValueTextByValue : function(v){
		var vt;
		var paramObj = Artery.getParams({
			codeType : this.codeType,
			codeValue : v,
			method : 'getCodeValueText'
		}, this);
		if(!Artery.params){
			paramObj.itemType = 'faCode';
			paramObj.moreProp = 'SRadio';
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			scope : this,
			syn : false,
			params : paramObj,
			success : function(response, options) {
				vt = response.responseText;
			}
		});
		return vt;
	}

})

Ext.reg('apfacodesradio', Artery.plugin.FaCodeSRadio);

// ***************************************************************************************//
// FaCodeMCheckbox //
// ***************************************************************************************//
/**
 * Artery FaCodeMCheckbox component
 * 
 * @author baon
 * @date 27/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaCodeMCheckbox = Ext.extend(Ext.form.Field, {

	// 隐藏使用的css
	hideClass: "x-hide-display",
	
	checked:false,//是否全部选中
	
	actionMode:'wrap',
	
	// 重新加载，支持自定义参数和回调函数
	// {params:{},callback:function}
	reload: function(userParams){
		var o = {};
		if (userParams) {
			o = Ext.decode(Ext.encode(userParams));
			if (userParams.callback) {
				o.callback = userParams.callback;
			}
		}
		if(o.params == null){
			o.params = {};
		}
		Ext.apply(o.params, Artery.getParams({
			codeType : this.codeType,
			value : this.value,
			method:'parseAjaxCode'
		}, this));
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			success : function(response, options) {
				if (Ext.isEmpty(response.responseText)) {
					Artery.alertMsg("错误提示", "加载代码错误");
					return;
				}
				this.wrap.dom.innerHTML = response.responseText;
				Artery.plugin.FaCodeSRadio.superclass.setValue.call(this, this.getCheckedValue());
				if (o.callback) {
					o.callback.call(this);
				}
			},
			params : o.params,
			scope : this
		});
	},

	// private
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		if(!this.isDisplayType()){
			this.readDom = Ext.getDom(this.id+"_read");
			this.textDom = Ext.getDom(this.id+"Text");
			this.wrap = Ext.get(this.id+"_wrap");
			if(this.wrap){
				this.wrap.on("click", this.onWrapClick, this);
			}
		}
	},
	
	// 数据区单击事件
	onWrapClick: function(e,t,o){
		var tn = t.tagName.toLowerCase();
		if(tn=="input"){
			var oldValue = this.el.dom.value;
			var newValue = this.getCheckedValue();
			var checked = t.checked;
			var value = t.value;
			var field = this;
			this.el.dom.value = newValue;
			this.validate();
			this.initDefaultOnChange(this, newValue, oldValue);
			this.valueText = this.textDom.value = this.getCheckedText(t);
			// onChange事件
			if (!Ext.isEmpty(this.onChangeEvent) && !this.disabled) {
				Artery.regItemEvent(this,'onChangeEvent','onChangeServer',{
					'newValue':newValue,
					'oldValue':oldValue
				});
			}
		}
	},
	
	// private
	getCheckedValue : function() {
		var v = [];
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			if(item.checked){
				v.push(item.value);
			}
		});
		var separator = Artery.getMultiSelectSeparator();
		return v.join(separator);
	},

	// 只读组件
	read : Artery.plugin.FaCodeSRadio.prototype.read,

	// 使组件可编辑
	edit : Artery.plugin.FaCodeSRadio.prototype.edit,
	
	// 无效组件
	disable : Artery.plugin.FaCodeSRadio.prototype.disable,
	
	// 有效组件
	enable : Artery.plugin.FaCodeSRadio.prototype.enable,
		
	//把指定值的组件设置无效
	disableItem: Artery.plugin.FaCodeSRadio.prototype.disableItem,
	
	//把指定值的组件设置有效
	enableItem: Artery.plugin.FaCodeSRadio.prototype.enableItem,
	
	// 设置值
	setValue : function(v) {
		v = Artery.getCommaSplitValue(v);
		if(this.isDisplayType()){
			var vt = this.getValueTextByValue(v);
			Artery.plugin.FaCodeSRadio.superclass.setValue.call(this, vt);
			return;
		}

		Artery.plugin.FaCodeSRadio.superclass.setValue.call(this, v);
		var va;
		if(v != null&& v!= ""){
			var separator = Artery.getMultiSelectSeparator();
			va = v.split(separator);
		}else{
			va = [];
		}
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			if (va.indexOf(item.value) != -1) {
				item.checked = true;
			}else{
				item.checked = false;
			}
		});
		this.valueText = this.textDom.value = this.getCheckedText();
	},
	
	initValue: Artery.plugin.FaCodeSRadio.prototype.initValue,
	
	// 获得所有代码值
	getValues: function(){
		var v = [];
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			v.push(item.value);
		});
		var separator = Artery.getMultiSelectSeparator();
		return v.join(separator);
	},
	
	// 获得显示值
	getValueText: function(){
		return this.textDom.value;
	},
	
	// 获得选中checkbox的显示值
	getCheckedText: function(){
		var vt = [];
		var inputArray = Ext.query("input",this.wrap.dom);
		Ext.each(inputArray, function(item, idx) {
			if (item.checked) {
				var label = Ext.fly(item.parentNode).child("span",true);
				vt.push(label.innerHTML);
			}
		}, this);
		var separator = Artery.getMultiSelectSeparator();
		return vt.join(separator);
	},
	
	// 选中所有checkbox
	checkAll: function(){
		this.setValue(this.getValues());
	},
	
	/**
	 * 数据更新方法(公共)
	 */
	setCodeType : function(codeType) {
		this.codeType = codeType;
		this.setValue(null);
		this.reload();
	},
	
	// private
	validateValue : function(value){
		if(Ext.isFunction(this.validator)){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
		if(this.allowBlank == false){
         	if(Ext.isEmpty(value)){
              this.markInvalid(this.blankText);
              return false;
         	}
	         this.clearInvalid();
         }
         return true;
    },
    
    //得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.wrap;
	},
	
	//根据值获得文本
	getValueTextByValue : function(v){
		var vt;
		var paramObj = Artery.getParams({
			codeType : this.codeType,
			codeValue : v,
			method : 'getCodeValueText'
		}, this);
		if(!Artery.params){
			paramObj.itemType = 'faCode';
			paramObj.moreProp = 'MCheckbox';
		}
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			scope : this,
			syn : false,
			params : paramObj,
			success : function(response, options) {
				vt = response.responseText;
			}
		});
		return vt;
	}
    
})

Ext.reg('apfacodemcheckbox', Artery.plugin.FaCodeMCheckbox);

// ***************************************************************************************//
// FaCodeCheckbox //
// ***************************************************************************************//
/**
 * Artery FaCodeCheckbox component
 * 
 * @author baon
 * @date 27/02/2009
 * 
 * @class Artery.plugin.FaCodeCheckbox
 * @extends Ext.form.Field
 */
Artery.plugin.FaCodeCheckbox = Ext.extend(Ext.form.Field, {
	
	getActionEl: function(){
		return this.checkEl;
	},

	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		if(this.displayType == "display"){
			this.checkEl = Ext.get(this.id);
		}else{
			this.checkEl = Ext.get(this.id+"_checkbox");	
		}
		this.checkEl.on("click", function() {
			var oldValue = this.el.dom.value;
			var newValue;
			if (this.checkEl.dom.checked) {
				newValue = this.el.dom.value = "1";
			} else {
				newValue = this.el.dom.value = "0";
			}
			var field = this;
			this.validate();
			this.initDefaultOnChange(this, newValue, oldValue);
			// onChange事件
			if (!Ext.isEmpty(this.onChangeEvent) && !this.disabled) {
				Artery.regItemEvent(this,'onChangeEvent','onChangeServer',{
					'newValue':newValue,
					'oldValue':oldValue
				});
			}
		}, this);
	},
	
	//得到错误提示定位的对象
	getErrorTipEl: function(){
		var tdEl = this.checkEl.parent(".x-form-el-td-cust");
		return tdEl;
	},
	
	setValue : function(v) {
		Artery.plugin.FaCodeCheckbox.superclass.setValue.call(this, v);
		this.el.dom.value = v;
		if(v == "1" || v == "true"){
			this.checkEl.dom.checked = true;
		}else{
			this.checkEl.dom.checked = false;
		}
	},
	
	/**
	 * 判断check box是否选中
	 * @return {Boolean}
	 */
	isChecked : function(){
		if(this.value == "1" || this.value == "true"){
			return true;
		}
		return false
	},
	
	// private
	validateValue : function(value){
		if(Ext.isFunction(this.validator)){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        return true;
    },
	
	// 无效组件
	disable : function() {
		Artery.plugin.FaCodeCheckbox.superclass.disable.call(this);
		this.checkEl.dom.disabled = true;
	},
	
	// 有效组件
	enable : function() {
		Artery.plugin.FaCodeCheckbox.superclass.enable.call(this);
		this.checkEl.dom.disabled = false;
	}
})

Ext.reg('apfacodecheckbox', Artery.plugin.FaCodeCheckbox);
