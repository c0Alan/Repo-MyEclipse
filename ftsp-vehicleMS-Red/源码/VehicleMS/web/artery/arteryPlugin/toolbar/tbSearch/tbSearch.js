/**
 * 高级查询按钮
 * 
 * @author weijx
 * @date 2009-03-27
 */
Artery.plugin.TbSearch = Ext.extend(Artery.plugin.BaseButton,{
	
	clickHandler: function(){
		var fc = {
			target: this.target
		};
		var url = "/artery/search.do?action=make";
		if(this.params){
			var params = null;
			if((typeof this.params)=="object"){
				params = this.params;
			}else{
				params = Ext.decode(this.params);
			}
			for(var p in params){
				url = url+"&"+p+"="+params[p];
			}
		}
		fc.url = url;
		Artery.openForm(fc);
	},
	
	initComponent: function(){
		Artery.plugin.BaseButton.superclass.initComponent.call(this);
		this.mon(this, this.clickEvent, this.clickHandler, this);
	}
});

Ext.reg('apTbSearch', Artery.plugin.TbSearch);