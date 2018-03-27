/**
 * 退出按钮
 * 
 * @author weijx
 * @date 2009-01-14
 */
Artery.plugin.TbLogout = Ext.extend(Artery.plugin.BaseButton,{
	
	clickHandler: function(){
		Artery.runLogic({
			params:{
				itemid:this.id,
				method:'logout',
				formid:Artery.getFormId(this)
			},
			scope:this,
			callback: function(result){
				if(result.success){
					window.location.href= sys.getContextPath();
				}
			}
		});
	},
	
	initComponent: function(){
		Artery.plugin.BaseButton.superclass.initComponent.call(this);
		this.mon(this, this.clickEvent, this.clickHandler, this);
	}
});

Ext.reg('apTblogout', Artery.plugin.TbLogout);