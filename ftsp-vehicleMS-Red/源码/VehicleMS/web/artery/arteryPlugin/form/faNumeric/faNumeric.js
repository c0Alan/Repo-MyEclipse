// ***************************************************************************************//
// FaStringInput
// ***************************************************************************************//
/**
 * Artery FaNumericInput component
 * 
 * @author baon
 * @date 17/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaNumericInput = Ext.extend(Ext.form.NumberField, {

	allowDomMove:false,
	
	autoEl: null,
	
	// ext配置，最大精度显示位数，如果输入太多，会自动截断，设置为-1则不做此处理
	decimalPrecision: -1,
	
	// 最大精度
	maxPLength : 0,

	// 最大精度提示信息
	//maxPLengthText : '最大精度为{0}',
	
	//add by hanf
	// 缩写单位
	vu_wu : "无",
	vu_bai : "百",
	vu_qian : "千",
	vu_wan : "万",
	vu_shiwan : "十万",
	
	// 缩写单位对应的数值
	vu_i_wu : 1,
	vu_i_bai : 100,
	vu_i_qian : 1000,
	vu_i_wan : 10000,
	vu_i_shiwan : 100000,
	
	// 标志是否设置了缩写单位
	hasValueUnit : false,
	hiddenEl : null,

	onRender : function(ct, position) {
		Artery.plugin.FaStringInput.prototype.onRender.call(this, ct, position);
		
		//add by hanf
		this.hasValueUnit = (this.valueUnit=="无"||typeof(this.valueUnit)=="undefined")?false:true;
		if(this.hasValueUnit){
			this.el.on('keyup', this.onKeyUpSY, this);
			this.hiddenEl = this.el.next("input", true);
		}
	},
	
	_getNumberVal: function(val){
		if(val == null){
			return "";
		}else{
			if((val + "") == ""){
				return "";
			}
			return parseFloat(val);
		}
	},

	getValue: function(){
		//modify by hanf
		var num = this._getNumberVal(Artery.plugin.FaNumericInput.superclass.getValue.call(this));
		return this.getRealValue(num);
	},
	setValue : function(v, fireChangeEvent) {
		var realValue = v;
		var old = this.value;
		//add by hanf
		v = this.getShowValue(v);
		
		if(this.readOnly && this.showType){
			Ext.form.NumberField.superclass.setValue.call(this, v);
		}else{
			v = this._getNumberVal(v);
			if(this.hasValueUnit && this.maxPLength != 0 && Ext.isNumber(v)){ //处理精度
				v = v.toFixed(this.maxPLength);
			}
			Ext.form.NumberField.superclass.setValue.call(this, v);
		}
		
		//将控件的value属性设置为真实值
		this.value = realValue;
		// 设置控件的提交时隐藏输入框的值
		Artery.setSubmitHiddenValue(this.id, this.getValue());
		if(fireChangeEvent){
			this.fireEvent('change', this, this.value,old == null?"":old);
		}
	},

    beforeBlur : function(){
//        var v = this.getRawValue();
//        if(v){
//            this.setValue(v);
//        }
    },
    
    onBlur : function(){
        if(this.readOnly){  //展现时不验证
        	return ;
        }
        Artery.plugin.FaNumericInput.superclass.onBlur.call(this);
    },
    
    onKeyUpSY : function(){
		this.hiddenEl.value = this.getValue();  //修改隐藏域的值为真实值
    	this.value = this.hiddenEl.value;  //将this.value设置成真实值
    },
    
    getRealValue: function(value){
    	//未设置单位的直接返回原值
    	if(!this.hasValueUnit || Ext.isEmpty(value)){
    		return value;
    	}
    	//设置了值单位时，根据单位计算真实值
    	var realValue = value;
    	switch(this.valueUnit)
		{
			case this.vu_wu     : realValue = value*this.vu_i_wu; break;
			case this.vu_bai    : realValue = this.accMul(value,100); break;
			case this.vu_qian   : realValue = this.accMul(value,1000); break;
			case this.vu_wan    : realValue = this.accMul(value,10000); break;
			case this.vu_shiwan : realValue = this.accMul(value,100000); break;
			default : break;
		}
		return realValue;
    },
    
    accMul:function(arg1,arg2){
	    var m=0,s1=arg1.toString(),s2=arg2.toString();
	    try{m+=s1.split(".")[1].length}catch(e){}
	    try{m+=s2.split(".")[1].length}catch(e){}
	    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
	},
    
    getShowValue: function(value){
    	//未设置单位的直接返回原值
    	if(!this.hasValueUnit || Ext.isEmpty(value)){
    		return value;
    	}
    	//设置了值单位时，根据单位计算显示值
    	var showValue = value;
    	switch(this.valueUnit)
		{
			case this.vu_wu     : showValue = value/this.vu_i_wu; break;
			case this.vu_bai    : showValue = value/this.vu_i_bai; break;
			case this.vu_qian   : showValue = value/this.vu_i_qian; break;
			case this.vu_wan    : showValue = value/this.vu_i_wan; break;
			case this.vu_shiwan : showValue = value/this.vu_i_shiwan; break;
			default : break;
		}
		return showValue;
    },

	validateValue : function(value) {
		if (typeof this.validator == "function") {
			var msg = this.validator(value);
			if (msg !== true) {
				this.markInvalid(msg);
				return false;
			}
		}
		if (value.length < 1 || value === this.emptyText) { // if it's blank
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			} else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if (value.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		var ilen = value.length;
		var plen = 0;
		var idx = value.indexOf('.');
		if (idx != -1) {
			var o = value.split('.');
			ilen = o[0].length;
			plen = o[1].length;
		}

		if (ilen > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		if (plen > this.maxPLength) {
			if(this.maxPLength == 0){
				this.markInvalid(String.format(this.zeroPLengthText));
			}else{
				this.markInvalid(String
					.format(this.maxPLengthText, this.maxPLength));
			}
			return false;
		}
		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
				return false;
			}
		}
		if (this.regex && !this.regex.test(value)) {
			this.markInvalid(this.regexText);
			return false;
		}

		if (value.length < 1) { // if it's blank and textfield didn't flag it
			// then it's valid
			return true;
		}
		value = String(value).replace(this.decimalSeparator, ".");
		if (isNaN(value)) {
			this.markInvalid(String.format(this.nanText, value));
			return false;
		}
		var num = this.parseValue(value);
		if (num < this.minValue) {
			this.markInvalid(String.format(this.minText, this.minValue));
			return false;
		}
		if (num > this.maxValue) {
			this.markInvalid(String.format(this.maxText, this.maxValue));
			return false;
		}
		
		if(!Ext.isEmpty(value) && (value.charAt(0) == "." || value.charAt(value.length-1) == "." )){
			this.markInvalid(this.startEndText);
			return false;
		}
		return true;
	},
	
	onDisable : function (){
		this.getActionEl().addClass(this.disabledClass);
		this.el.dom.disabled = true;
		if(this.getLabelEl() != null) {
			this.getLabelEl().addClass("x-form-label-disabled");
		}
		if(Ext.isIE){
			this.el.dom.unselectable = 'on';
		}
		
		//为了disable之后能够提交到服务器，创建隐藏域
		if (Ext.isTrue(this.submitDisabled)) {
			if (!this.hiddenEl) {
				if (!document.getElementById(this.id + "_hidden")) {
					var name = this.el.dom.name;
					var hiddenEl = Artery.createHiddenInput(this.id, name, this.getValue());
					this.el.dom.parentNode.appendChild(hiddenEl);
				}
			}
		} else {
			if (this.hiddenEl){
				this.hiddenEl.disabled = true;
			}
		}
	},
	
	onEnable : function (){
		Artery.plugin.FaStringInput.superclass.onEnable.call(this);
		
		//删除隐藏域
		if(Ext.isTrue(this.submitDisabled) ) {
			if (!this.hiddenEl) {
				var hiddenEl = document.getElementById(this.id + "_hidden");
				if(hiddenEl) {
					this.el.dom.parentNode.removeChild(hiddenEl);
				}
			}
		} else {
			if (this.hiddenEl){
				this.hiddenEl.disabled = false;
			}
		}
	}
})

// register xtype
Ext.reg('apfanumericinput', Artery.plugin.FaNumericInput);