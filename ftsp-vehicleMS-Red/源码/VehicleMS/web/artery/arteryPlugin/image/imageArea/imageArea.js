
/**
 * Artery ImageArea component
 * 
 * @author baon
 * @date 05/05/2009
 * 
 */
Artery.plugin.ImageArea = Ext.extend(Artery.plugin.BaseContainer, {
	
	value:null,//选中图片的值
	
	layout:'auto',
	
	icon:null,//初始图片路径
	
	iconOver:null,//鼠标移上时图片
	
	onClickEvent:null,
	
	initComponent : function() {
		Artery.plugin.ImageArea.superclass.initComponent.call(this);
		//设置是否选中
		if(this.items){
			this.items.each(function(it,idx,length){
				if(it.value == this.value){
					it.selected = true;
				}
			},this)
		}
	},
	
	onRender : function(ct, position){
		Artery.plugin.ImageArea.superclass.onRender.call(this,ct,position);
		//只要有设置客户端脚本或设置了连接到属性，便可触发点击事件
		if(this.onClickEvent || this.linktoEvent){
			this.el.on('click',function(e){
				this.fireEvent('click',this,e);
			},this);
			this.el.setStyle('cursor','pointer');
		}
		if(this.iconOver){
			this.el.on('mouseover',function(){
				this.el.child('img').dom.src = sys.getContextPath() + this.iconOver;
			},this);
			this.el.on('mouseout',function(){
				this.el.child('img').dom.src = sys.getContextPath() + this.icon;
			},this);
		}
	},
	
	click: function(){
		this.fireEvent('click')
	},
	
	update: function(item){
		this.items.each(function(it,idx,length){
			if(item.id == it.id){
				it.select();
				this.value = it.getValue();
			}else{
				it.unselect();
			}
		},this)
	},
	
	getValue: function(){
		return this.value == null?"":this.value;
	},
	
	setValue: function(value){
		this.value = value;
	},
	
	changeImage: function(url){
		this.icon=url;
		this.el.child('img').dom.src = sys.getContextPath() + url;
	},
	
	setTip: function(tip){
		this.el.child('img').dom.title = tip;
	},
	
	getImageEl: function(){
		return this.el.child('img');
	}
})

Ext.reg('apimagearea', Artery.plugin.ImageArea);