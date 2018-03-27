// ***************************************************************************************//
// FaStringInput
// ***************************************************************************************//
/**
 * Artery textfield component
 * 
 * @author baon
 * @date 17/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaStringInput = Ext.extend(Ext.form.TextField, {
	allowBlankWhenRequired:false,

	allowDomMove:false,
	
	enableKeyEvents : true,
	
	onRender : function(ct, position) {
		var isIE = !!window.ActiveXObject;  
		var isIE6 = isIE && !window.XMLHttpRequest;  
		var isIE8 = isIE && !!document.documentMode;  
		if(!isIE8){
			this.emptyText = this.emptyText.replace(new RegExp("\r\n","gm"),"\n")  ;
		}
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if(Ext.get(this.id)){
			this.el = Ext.get(this.id);
			
		}else if(!this.el){
			var cfg = this.getAutoCreate();
			if (!cfg.name) {
				cfg.name = this.name || this.id;
			}
			if (this.inputType) {
				cfg.type = this.inputType;
			}
			this.el = ct.createChild(cfg, position);
		}
		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}
	},

	/** override */
	setValue : function(v,triggerChange) {
		var ov = this.getValue();
		Artery.plugin.FaStringInput.superclass.setValue.call(this, v);
		// 设置控件的提交时隐藏输入框的值
		Artery.setSubmitHiddenValue(this.id, this.getValue());
		var nv = this.getValue();
		if(triggerChange === true && nv!=ov){
			this.fireEvent('change', this, nv, ov);
		}
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
		if(Ext.isTrue(this.submitDisabled)) {
			if (!document.getElementById(this.id + "_hidden")) {
				var name = this.el.dom.name;
				var hiddenEl = Artery.createHiddenInput(this.id, name, this.getValue());
				this.el.dom.parentNode.appendChild(hiddenEl);
			}
		}
	},
	
	onEnable : function (){
		Artery.plugin.FaStringInput.superclass.onEnable.call(this);
		
		//删除隐藏域
		if(Ext.isTrue(this.submitDisabled)) {
			var hiddenEl = document.getElementById(this.id + "_hidden");
			if(hiddenEl) {
				this.el.dom.parentNode.removeChild(hiddenEl);
			}
		}
	}
	
})

// register xtype
Ext.reg('apfastringinput', Artery.plugin.FaStringInput);

// ***************************************************************************************//
// FaStringTextarea
// ***************************************************************************************//
/**
 * Artery Textarea component
 * 
 * @author baon
 * @date 25/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaStringTextarea = Ext.extend(Ext.form.TextArea, {
	allowBlankWhenRequired:false,
	
	enableKeyEvents : true,
	
	initComponent : function() {
		Artery.plugin.FaStringTextarea.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:100px;height:60px;",
                autocomplete: "off"
            };
        }
        if(Ext.get(this.id)){
	        Ext.get(this.id).removeClass('x-form-empty-field');
		}
        Artery.plugin.FaStringInput.prototype.onRender.call(this, ct, position);
        if(this.grow){
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
	},

	/** override */
	setValue : function(v,triggerChange) {
		var ov = this.getValue();
		Artery.plugin.FaStringTextarea.superclass.setValue.call(this, v);

		// 设置控件的提交时隐藏输入框的值
		Artery.setSubmitHiddenValue(this.id, this.getValue());
		var nv = this.getValue();
		if(triggerChange === true && nv!=ov){
			this.fireEvent('change', this, nv, ov);
		}
	},

	onDisable : function (){
		
		Artery.plugin.FaStringTextarea.superclass.onDisable.call(this);
		
		this.el.dom.disabled = true;
		
		if(Ext.isIE){
			this.el.dom.unselectable = 'on';
		}
		
		//为了disable之后能够提交到服务器，创建隐藏域
		if(Ext.isTrue(this.submitDisabled)) {
			if (!document.getElementById(this.id + "_hidden")) {
				var name = this.el.dom.name;
				var hiddenEl = Artery.createHiddenInput(this.id, name, this.getValue());
				this.el.dom.parentNode.appendChild(hiddenEl);
			}
		}
	},
	
	onEnable : function (){
		Artery.plugin.FaStringTextarea.superclass.onEnable.call(this);
		
		//删除隐藏域
		if(Ext.isTrue(this.submitDisabled)) {
			var hiddenEl = document.getElementById(this.id + "_hidden");
			if(hiddenEl) {
				this.el.dom.parentNode.removeChild(hiddenEl);
			}
		}
	}
})

// register xtype
Ext.reg('apfastringtextarea', Artery.plugin.FaStringTextarea);

// ***************************************************************************************//
// FaStringRichedit
// ***************************************************************************************//
/**
 * Artery Richedit component
 * 
 * @author baon
 * @date 25/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
if(Ext.form.HtmlEditor){
	Artery.plugin.FaStringRichedit = Ext.extend(Ext.form.HtmlEditor,{
		
		allowDomMove:true,
		
		onRender : function(ct, position){
			if(this.isDisplayType()){
				return;
			}
			ct = Ext.get(this.renderToId);
			Artery.plugin.FaStringRichedit.superclass.onRender.call(this, ct, position);
		}
	})
	
	// register xtype
	Ext.reg('apfastringrichedit', Artery.plugin.FaStringRichedit);
}

// ***************************************************************************************//
// TextAreaTrigger //
// ***************************************************************************************//
/**
 * Artery textfield component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.TriggerTextarea = Ext.extend(Artery.plugin.TwinTriggerField, {
	
	win:null,
	
	winBody:null,
	
	onRender : function(ct, position) {
		Artery.plugin.TwinTriggerField.superclass.onRender.call(this, ct, position);
		this.el.dom.readOnly  = true;
	},
	
	onTrigger2Click: function(){
		if(this.win == null){
			this.win = new Ext.Window({
				width:500,
				height:300,
				closable :true,
				plain:true,
				closeAction :'hide',
				modal:true,
				shadow:false,
				layout:'anchor',
				
				items:[this.winBody = new Ext.form.TextArea({
					anchor:'100% 100%',
					maxLength:this.maxLength,
					minLength:this.minLength,
					regex:this.regex,
					regexText:this.regexText
				})],
				
				buttons:[{
					text:'确定',
					handler: function(){
						if(this.winBody.isValid()){
							this.value = this.winBody.getValue();
							this.win.hide();
						}
					},
					scope:this
				},{
					text:'取消',
					handler: function(){
						this.winBody.clearInvalid();
						this.win.hide();
					},
					scope:this
				}]
			})
			this.win.on("hide",function(){
				this.focus();
				this.geditor.allowBlur = false;
				this.geditor.completeEdit();
			},this)
		}
		this.win.show();
		this.winBody.setValue(this.value);
		this.geditor.allowBlur = true;
	},
	
	setValue: function(v){
		if (Ext.isEmpty(v)) {
			v = "";
		}
		if (this.hiddenField) {
			this.hiddenField.value = Ext.isEmpty(v)?"":v;
		}
		Artery.plugin.TwinTriggerField.superclass.setValue.call(this, v);
		this.value = v;
		this.updateValueTip();
		this.setTriggerState(v);
		return true;
	},
	
	getValue: function(){
		return this.value;
	},
	
	getValueText: function(){
		return this.value;
	}
})

// register xtype
Ext.reg('aptriggertextarea', Artery.plugin.TriggerTextarea);