/**
 * 示例
 * @author baon
 * @date 2009-06-01
 */
 
Artery.plugin.News = Ext.extend(Ext.Component,{
	
	//测试名称属性
	title:"",
	
	//是否显示标题栏上的“更多”按钮
	isShowMore:true,
	
	initComponent : function() {
		Artery.plugin.News.superclass.initComponent.call(this);
	},

	//页面渲染方法
	onRender : function(ct, position){
		this.el = Ext.get(this.id);
		ct.appendChild(this.el);
		Artery.plugin.News.superclass.onRender.call(this,ct, position);
		
		//初始化Title
		this.titleTextEl = this.el.child(".title_text");
		this.titleTextEl.update(this.title);
		
		//初始化“更多”
		this.titleMoreEl = this.el.child(".title_more");
		if(!this.isShowMore){
			this.titleMoreEl.setDisplayed(false);
		}else{
			if (!Ext.isEmpty(this.onClickMore)) {
				this.titleMoreEl.on("click",function(item,e){
					Artery.regItemEvent(this,"onClickMore","onClickServer")
				},this)
			}
			
			if (!Ext.isEmpty(this.linktoMore)) {
				this.titleMoreEl.on("click",function(item,e){
					Artery.regLinktoEvent(this,"linktoMore",e)
				},this)
			}
		}
		
	}
})

//注册组件
Ext.reg('apnews', Artery.plugin.News);