// ***************************************************************************************//
// timespinner //
// ***************************************************************************************//
Ext.ux.form.TimeSpinner = Ext.extend(Ext.ux.form.Spinner, {
	
	allowDomMove: false,
	
	onRender : function(ct, position){
		this.wrap = Ext.get(this.renderTo).first();
        this.el = this.wrap.child("input");
        this.trigger = this.wrap.child("img");

		if(!this.el){
			var cfg = this.getAutoCreate();
			if (!cfg.name) {
				cfg.name = this.name || this.id;
			}
			if (this.inputType) {
				cfg.type = this.inputType;
			}
			this.el = ct.createChild(cfg, position);
		}
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if (this.readOnly) {
			this.el.dom.readOnly = true;
		}
		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}

        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.initTrigger();
        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
		this.initSpinner();
	},
	
	initSpinner : function(){
		this.keyNav = new Ext.KeyNav(this.el, {
			"up" : function(e){
				//modify 为支持时间控件的"展现类型(displayType)"属性
				if(this.disabled || this.readOnly){
					return;
				}
				e.preventDefault();
				this.onSpinUp();
				this.setValueOfTimePlugin();
			},

			"down" : function(e){
				//modify 为支持时间控件的"展现类型(displayType)"属性
				if(this.disabled || this.readOnly){
					return;
				}
				e.preventDefault();
				this.onSpinDown();
				this.setValueOfTimePlugin();
			},

			"pageUp" : function(e){
				e.preventDefault();
				this.onSpinUpAlternate();
			},

			"pageDown" : function(e){
				e.preventDefault();
				this.onSpinDownAlternate();
			},

			scope : this
		});

		this.trigger.un("click", this.onTriggerClick);
		this.repeater = new Ext.util.ClickRepeater(this.trigger);
		this.repeater.on("click", this.onTriggerClick, this, {preventDefault:true});
		this.trigger.on("mouseover", this.onMouseOver, this, {preventDefault:true});
		this.trigger.on("mouseout",  this.onMouseOut,  this, {preventDefault:true});
		this.trigger.on("mousemove", this.onMouseMove, this, {preventDefault:true});
		this.trigger.on("mousedown", this.onMouseDown, this, {preventDefault:true});
		this.trigger.on("mouseup",   this.onMouseUp,   this, {preventDefault:true});
		this.wrap.on("mousewheel",   this.handleMouseWheel, this);

//		this.dd.setXConstraint(0, 0, 10)
//		this.dd.setYConstraint(1500, 1500, 10);
//		this.dd.endDrag = this.endDrag.createDelegate(this);
//		this.dd.startDrag = this.startDrag.createDelegate(this);
//		this.dd.onDrag = this.onDrag.createDelegate(this);

        /*
        jsakalos suggestion
        http://extjs.com/forum/showthread.php?p=121850#post121850 */
        if('object' == typeof this.strategy && this.strategy.xtype) {
            switch(this.strategy.xtype) {
                case 'number':
                    this.strategy = new Ext.ux.form.Spinner.NumberStrategy(this.strategy);
	                break;

                case 'date':
                    this.strategy = new Ext.ux.form.Spinner.DateStrategy(this.strategy);
	                break;

                case 'time':
                    this.strategy = new Ext.ux.form.Spinner.TimeStrategy(this.strategy);
                	break;

                default:
                    delete(this.strategy);
                	break;
            }
            delete(this.strategy.xtype);
        }

		if(this.strategy == undefined){
			this.strategy = new Ext.ux.form.Spinner.NumberStrategy();
		}
	},
	
	onMouseUp : function(){
		Ext.ux.form.TimeSpinner.superclass.onMouseUp.call(this);
		//modify 解决alert时，onMouseUp不触发
		this.setValueOfTimePlugin();
	},
	
	onTriggerClick : function(){
		//modify 为支持时间控件的"展现类型(displayType)"属性
		if(this.disabled || this.readOnly){
			return;
		}
		var middle = this.getMiddle();
		var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
		this['onSpin'+ud]();
	},
	
	//同步时间控件的值
	setValueOfTimePlugin : function(){
		if(this.onMouseUpAction){
			this.onMouseUpAction.handler.call(this.onMouseUpAction.scope);
		}
	},
	
	onMouseUpAction : null
})

// ***************************************************************************************//
// timefield //
// ***************************************************************************************//
/**
 * Artery Timefield component
 * 
 * @author hanf
 * @date 04/08/2010
 * 
 * @class Artery.plugin.FaTime
 * @extends Ext.form.TextField
 */
Artery.plugin.FaTime = Ext.extend(Ext.form.TextField, {
	
	allowDomMove:false,
	
	// 1-时分秒 2-时分 3-时
	timeType : 1,
	
	margin: true,
	
	fieldClass: null,

	format : "h:i:s",

	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "24",
		autocomplete : "off"
	},
	editable:true,
	
	hiddenField : null, //隐藏域,dom对象
	
	//验证提示信息
	minText    : "该输入项的时间必须在 {0}（包含） 之后",
    maxText    : "该输入项的时间必须在 {0}（包含）之前",
    hourText   : "\"小时\"的输入范围是：0-23",
    minuteText : "\"分钟\"的输入范围是：0-59",
    secondText : "\"秒\"的输入范围是：0-59",

	initComponent : function() {
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		Artery.plugin.FaTime.superclass.initComponent.call(this);
	},
	
    validateValue : function(value){
    	if(value == "" || value == "::"){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
    	
        var hms = value.toString().split(":", 3)
    	var iH = hms[0]; //hour
		if(isNaN(iH)||iH<0||iH>23){
			this.markInvalid(this.hourText);
			return false;
		}
		var iM = hms[1]; //minute
		if(isNaN(iM)||iM<0||iM>59){
			this.markInvalid(this.minuteText);
			return false;
		}
		var iS = hms[2]; //second
		if(isNaN(iS)||iS<0||iS>59){
			this.markInvalid(this.secondText);
			return false;
		}

		if(!Artery.plugin.FaTime.superclass.validateValue.call(this,value)){ //super validate
			return false;
		}
		
		//minValue and maxValue
		var time = new Date("1970/1/1 " + value).getTime();
		if (!Ext.isEmpty(this.minValue)) {
			var minTS = this.dealTimeValue(this.minValue);
			var minTime = new Date("1970/1/1 " + minTS).getTime();
			if (time < minTime) {
				this.markInvalid(String.format(this.minText, minTS));
				return false;
			}
		}
		if (!Ext.isEmpty(this.maxValue)) {
			var maxTS = this.dealTimeValue(this.maxValue);
			var maxTime = new Date("1970/1/1 " + maxTS).getTime();
			if (time > maxTime) {
				this.markInvalid(String.format(this.maxText, maxTS));
				return false;
			}
		}
		return true;
    },

	//得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.el.child("table");
	},
	
	onRender : function(ct, position) {
		this.el = Ext.get(this.id + "_wrap");
		this.hiddenField = Ext.get(this.id).dom;
		
		Artery.plugin.FaTime.superclass.onRender.call(this, ct, position);		

		this.hourSpiner = new Ext.ux.form.TimeSpinner({
			renderTo : this.el.child("td.x-time-hourtd", true),
			disabled : this.disabled,
			readOnly : this.readOnly,
			strategy: new Ext.ux.form.Spinner.TimeStrategy({
				format: 'H',
				incrementConstant: Date.HOUR,
				alternateIncrementValue: 3,
				alternateIncrementConstant: Date.HOUR
			}),
			onMouseUpAction:{
				handler: this.syncValueText, 
				scope: this
			}
		});

		this.minuteSpiner = new Ext.ux.form.TimeSpinner({
			renderTo : this.el.child("td.x-time-minutetd", true),
			disabled : this.disabled,
			readOnly : this.readOnly,
			strategy: new Ext.ux.form.Spinner.TimeStrategy({
				format: 'i',
				incrementConstant: Date.MINUTE,
				alternateIncrementValue: 5,
				alternateIncrementConstant: Date.MINUTE
			}),
			onMouseUpAction:{
				handler: this.syncValueText, 
				scope: this
			}
		});
		
		this.secondSpiner = new Ext.ux.form.TimeSpinner({
			renderTo : this.el.child("td.x-time-secondtd", true),
			disabled : this.disabled,
			readOnly : this.readOnly,
			strategy: new Ext.ux.form.Spinner.TimeStrategy({
				format: 's',
				incrementConstant: Date.SECOND,
				alternateIncrementValue: 5,
				alternateIncrementConstant: Date.SECOND
			}),
			onMouseUpAction:{
				handler: this.syncValueText, 
				scope: this
			}
		})

		//绑定事件
		this.hourSpiner.el.on('keyup', this.syncValueText, this);
		this.hourSpiner.on('change', this.syncValueText, this);
		this.minuteSpiner.el.on('keyup', this.syncValueText, this);
		this.minuteSpiner.on('change', this.syncValueText, this);
		this.secondSpiner.el.on('keyup', this.syncValueText, this);
		this.secondSpiner.on('change', this.syncValueText, this);
	},
	
	//add by hanf 同步隐藏域的值
	syncValueText: function(){
		if(this.validate()){ //验证
			var oldV = this.hiddenField.value;
			var newV = this.getRawValue();
			this.hiddenField.value = newV; //修改隐藏域的值
			this.value = this.hiddenField.value;
			this.fireEvent('change', this, newV, oldV); //触发onChange事件
		}
	},
	
	/**
	 * 设置日期值
	 * @param date 字符串或日期对象
	 */
	setValue : function(value) {
		var sValue = this.dealTimeValue(value); //处理数据
		if(sValue == null){//值非法
			return;
		}
		
		var vs = ["00","00","00"];
		if(sValue != ""){
			vs = sValue.split(":");
		}
		this.hourSpiner.setValue(vs[0]); //设置显示值	
		this.minuteSpiner.setValue(vs[1]);
		this.secondSpiner.setValue(vs[2]);
		this.hiddenField.value = sValue==""?"":vs.join(":"); //设置隐藏值
		this.value = this.hiddenField.value; //设置this.value
		//判断是否初始设置值，初始设置值时不进行验证
		if(!Ext.isTrue(this.initSte)){
			this.validate();
		}
	},

	//value处理为"00:00:00"形式
	dealTimeValue : function(value){
		var sValue = "";
		if (!Ext.isEmpty(value)) {
			sValue = value.toString();
		}
		var patrn = /[^0-9:]/; //只能包含0-9和:
		if(patrn.exec(sValue)){
			return null;
		}
		if(sValue == "" || sValue == "::"){
			return "";
		}

		var vs = sValue.split(":", 3);//处理"00::"和"00:1:"等类似的情况
		for(var i = 0; i < vs.length; i++){
			vs[i] = Ext.isEmpty(vs[i])?"00":(vs[i].length==1?("0"+vs[i]):vs[i]);
		}
		for(var j = vs.length; j < 3; j++){//处理00,00:00等情况
			vs[j]="00";
		}
		return vs.join(":");
	},
	
	getValue : function(){
        return this.value || "";
    },
    
	getRawValue:function(){
		var v = "";
		if(this.rendered){
			var hms = [this.hourSpiner.getValue(), this.minuteSpiner.getValue(), this.secondSpiner.getValue()];
			v = hms.join(":");
			if(v == "::"){
				v = "";
			}
		}
		return v;
	},
	
	reset : function(){
		if(!this.rendered){
			return;
		}
	    this.clearInvalid();
        this.setValueNoValid(this.originalValue);
    },
    
	setValueStyle: function(valueStyle){
		this.hourSpiner.el.applyStyles(valueStyle);
		this.minuteSpiner.el.applyStyles(valueStyle);
		this.secondSpiner.el.applyStyles(valueStyle);
	},
	
    read : function() {
		if(!this.rendered || this.isDisplayType()){
			return;
		}

		this.readOnly = true;
		this.hourSpiner.readOnly = true;
		this.minuteSpiner.readOnly = true;
		this.secondSpiner.readOnly = true;

		this.hourSpiner.el.dom.readOnly = true; //input
		this.minuteSpiner.el.dom.readOnly = true; //input
		this.secondSpiner.el.dom.readOnly = true; //input

		if(!Ext.isEmpty(this.valueStyleRead)){
			this.getActionEl().applyStyles(this.valueStyleRead);
		}
	},
	
	edit : function() {
		if(!this.rendered || this.isDisplayType()){
			return;
		}
		this.readOnly = false;

		// 当editable不存在或为true时,应设置readOnly属性
		if(this.editable===false){
			// faString的editable不存在,faCode的editable可能为true
		}else{
			this.hourSpiner.readOnly = false;
			this.minuteSpiner.readOnly = false;
			this.secondSpiner.readOnly = false;

			this.hourSpiner.el.dom.readOnly = false; //input
			this.minuteSpiner.el.dom.readOnly = false; //input
			this.secondSpiner.el.dom.readOnly = false; //input
		}

		if(!Ext.isEmpty(this.valueStyle)){
			this.getActionEl().applyStyles(this.valueStyle);
		}
	},
	
    onDisable: function(){
        Ext.form.TextField.superclass.onDisable.call(this);
        this.disabled = true;
        
        this.hourSpiner.wrap.addClass(this.disabledClass);
        this.minuteSpiner.wrap.addClass(this.disabledClass);
        this.secondSpiner.wrap.addClass(this.disabledClass);
        
        this.hourSpiner.disabled  = true;
        this.minuteSpiner.disabled  = true;
        this.secondSpiner.disabled  = true;
        
        this.hourSpiner.el.dom.readOnly = true;
		this.minuteSpiner.el.dom.readOnly = true;
		this.secondSpiner.el.dom.readOnly = true;

		if(Ext.isIE){
            this.hourSpiner.el.dom.unselectable = 'on';
			this.minuteSpiner.el.dom.unselectable = 'on';
			this.secondSpiner.el.dom.unselectable = 'on';
        }
    },
    
    onEnable: function(){
        Ext.form.TextField.superclass.onEnable.call(this);
        
        this.disabled = false;
        
        this.hourSpiner.wrap.removeClass(this.disabledClass);
        this.minuteSpiner.wrap.removeClass(this.disabledClass);
        this.secondSpiner.wrap.removeClass(this.disabledClass);
        
        this.hourSpiner.disabled  = false;
        this.minuteSpiner.disabled  = false;
        this.secondSpiner.disabled  = false;
        
        this.hourSpiner.el.dom.readOnly = false;
		this.minuteSpiner.el.dom.readOnly = false;
		this.secondSpiner.el.dom.readOnly = false;
        
        if(Ext.isIE){
            //this.el.dom.unselectable = '';
            this.hourSpiner.el.dom.unselectable = '';
			this.minuteSpiner.el.dom.unselectable = '';
			this.secondSpiner.el.dom.unselectable = '';
        }
    }
})

// register xtype
Ext.reg('apfatime', Artery.plugin.FaTime);
