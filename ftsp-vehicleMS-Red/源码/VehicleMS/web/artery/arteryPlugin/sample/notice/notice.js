/**
 * 示例
 * @author baon
 * @date 2009-06-01
 */
 
Artery.plugin.Notice = Ext.extend(Ext.Component,{
	
	//测试名称属性
	title:"",
	
	//是否显示标题栏上的“更多”按钮
	isShowMore:true,
	
	initComponent : function() {
		Artery.plugin.Notice.superclass.initComponent.call(this);
	},

	//页面渲染方法
	onRender : function(ct, position){
		this.el = Ext.get(this.id);
		ct.appendChild(this.el);
		Artery.plugin.Notice.superclass.onRender.call(this,ct, position);
		
	}
})

//注册组件
Ext.reg('apnotice', Artery.plugin.Notice);