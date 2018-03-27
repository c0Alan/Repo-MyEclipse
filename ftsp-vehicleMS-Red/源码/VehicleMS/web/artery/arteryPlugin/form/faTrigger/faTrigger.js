﻿﻿/**
 * @author weijx
 * @date 22/10/2008
 */
Artery.plugin.FaTrigger = Ext.extend(Artery.plugin.TwinTriggerField, {

	/**
	 * 设置值
	 */
	setValue: function(v, vt){
		var ov = this.getValue();
		Artery.plugin.FaTrigger.superclass.setValue.call(this, v, vt);
		this.validate();
		// 触发change事件，以后可能去掉
		if(this.value+"" != ov+""){
			this.fireEvent("change",this,this.value,ov);
		}
	},
	
	// 备份值和显示值，在reset时会用到
	initValue : function(){
        this.originalValue = this.getValue();
        this.previousValue=this.originalValue;
        this.originalValueText = this.getValueText();
    },
    
	reset : function(){
		if(!this.rendered){
			return;
		}
		if(this.originalValue + "" == this.value + ""){
			return;
		}
        this.setValueNoValid(this.originalValue);
        this.setValueText(this.originalValueText);
	    this.clearInvalid();
    },
	
	//改变最初的值，reset时会根据此值判断是否dirty
	setOriginalValue: function(v, vt){
		this.originalValue = v;
		if (Ext.isEmpty(vt)) {
			this.originalValueText = v;
		} else {
			this.originalValueText = vt;
		}
		
	},
	
	//改变最初的显示值，reset时会根据此值判断是否dirty
	setOriginalValueText: function(vt){
		this.originalValueText = vt;
	},
	
	// 设置值时不更新显示值
	upValueText: function(v){
	},

	/**
	 * 设置显示值(兼容以前)
	 */
	setShowValue : function(v) {
		this.setValueText(v);
		this.validate();
	},

	/**
	 * 获得显示值(兼容以前)
	 */
	getShowValue : function() {
		return this.getValueText();
	},
	
	/**
	 * trigger点击时，将调用此方法
	 */
	onTrigger2Click: function(){
		if(this.disabled||this.readOnly){
			return ;
		}
		if(Ext.isEmpty(this.onTriggerClickEvent)){
			return ;
		}
		Artery.regItemEvent(this,'onTriggerClickEvent','onTriggerClickServer');
	}
});

Ext.reg('apFaTrigger', Artery.plugin.FaTrigger);