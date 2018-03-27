/**
 * Artery Star component
 * 
 * @author baon
 * @date 04/03/2011
 * 
 */
Artery.plugin.Star = Ext.extend(Artery.plugin.BaseContainer, {
	
	starAllNum:null,//星星总个数
	
	starSelNum:null,//星星选中个数
	
	starType:null,//星星类型
	
	canSel:null,//是否可选择
	
	currentRatingEl:null,
	
	extInfoEl:null,
	
	initComponent : function() {
		Artery.plugin.Star.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.Star.superclass.onRender.call(this, ct, position);
		this.extInfoEl = this.el.child('.star-extInfo');
		if(this.canSel){
			this.el.select('.star-item').each(function(item,el,idx){
				item.on('click',function(e,el,o){
					if(this.currentRatingEl == null){
						this.currentRatingEl = Ext.get(this.id).child(".current-rating");
					}
					if(this.currentRatingEl != null){
						this.currentRatingEl.removeClass('current-rating');
					}
					this.currentRatingEl = Ext.get(el).parent();
					this.currentRatingEl.addClass('current-rating');
					this.starSelNum = o.idx+1;
					this.currentRatingEl.setStyle('width',this.getStarWidth()*this.starSelNum)
				},this,{idx:idx})
			},this);
		}
	},
	getStarWidth: function(){
		return this.starType == "big"?32:18;
	},
	
	setStarSelNum: function(num){
		if(this.num <1 || this.num > this.starAllNum){
			return;
		}
		if(this.currentRatingEl == null){
			this.currentRatingEl = Ext.get(this.id).child(".current-rating");
		}
		if(this.currentRatingEl != null){
			this.currentRatingEl.removeClass('current-rating');
		}
		this.starSelNum = num
		this.currentRatingEl = this.el.select('.star-item').item(num-1).parent();
		this.currentRatingEl.addClass('current-rating');
		this.currentRatingEl.setStyle('width',this.getStarWidth()*this.starSelNum)
	},
	
	setExtInfo: function(value){
		this.extInfoEl.update(value);
	},
	
	getValue:function(){
		if(this.starSelNum == null){
			return 0;
		}
		return this.starSelNum;
	}
})

Ext.reg('apstar', Artery.plugin.Star);