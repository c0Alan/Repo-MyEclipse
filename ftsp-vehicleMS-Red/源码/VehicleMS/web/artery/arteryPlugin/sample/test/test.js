/**
 * 示例
 * @author baon
 * @date 2009-06-01
 */
 
Artery.plugin.Test = Ext.extend(Ext.Component,{
	
	//测试名称属性
	name:null,
	
	initComponent : function() {
		Artery.plugin.Test.superclass.initComponent.call(this);
		
		//当名称为“king”时隐藏控件
		if(this.name && this.name == "king"){
			this.hidden = true;
		}
	},

	//页面渲染方法
	onRender : function(ct, position){
	    this.el = Ext.get(this.id);
		Artery.plugin.Test.superclass.onRender.call(this,ct, position);
		this.slider = new Ext.Slider({
	        renderTo: this.el.dom,
	        width: 314,
	        minValue: 0,
	        maxValue: 100
	    });
	}
})

//注册组件
Ext.reg('aptest', Artery.plugin.Test);