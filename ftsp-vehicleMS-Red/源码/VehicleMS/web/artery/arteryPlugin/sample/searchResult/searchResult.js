/**
 * 示例
 * @author baon
 * @date 2009-06-01
 */
 
Artery.plugin.SearchResult = Ext.extend(Artery.plugin.BaseContainer,{
	
	//数据集
	data:null,
	
	//模板
	tpl:null,
	
	extParams:null,
	
	initComponent : function() {
		Artery.plugin.SearchResult.superclass.initComponent.call(this);

		this.tpl = new Ext.XTemplate(
			'<div>',
				'<tpl for="rows">',
					'<div style="padding:10px;">',
						'<div class="x-searchresult-title"><a href="{url}" target="_blank">{title}</a></div>',
						'<div class="x-searchresult-content">{content}</div>',
						'<div class="x-searchresult-footer">{footer}</div>',
					'</div>',
				'</tpl>',
			'</div>'
		);
		this.tpl.compile();
	},

	//页面渲染方法
	onRender : function(ct, position){
		Artery.plugin.SearchResult.superclass.onRender.call(this,ct, position);
		this.contentEl = this.el.down(".searchResult-content-div");
		this.pageEl = this.el.down(".searchResult-page-div");
		this.update(this.data);
	},
	
	update: function(data){
		var sr = this;
		this.pageEl.update("");
		
		//内容
		this.tpl.overwrite(this.contentEl,data);
		//分页
		var c = Math.ceil(data.totalCount / this.pageCount);
		if(data.page == null){
			data.page = 1;
		}
		var tempEl;
		var remainder = data.page % 10;
		var p = data.page/10;
		p = Math.floor(remainder ==0?p-1:p)*10;
		//上一页（每页10个）
		if(data.page != 1 && data.page >10){
			tempEl = this.pageEl.createChild({
				tag:'a',
				cls:'searchResult-prev-page',
				href:'javascript:void(0)',
				html:'上一页'
			})
			tempEl.on('click',function(){
				this.search({page:p-9});
			},this)
		}
		
		//（每页10个）
		var min = p+1;
		var max = p
		if(max+10 >c){
			max += c%10;
		}else{
			max += 10;
		}
		
		//alert(c + ":" + min + ":" + max);
		for(var i=min;i<=max;i++){
			if(data.page == i){
				tempEl = this.pageEl.createChild({
					tag:'span',
					cls:'searchResult-page-span',
					html:i
				})
			}else{
				tempEl = this.pageEl.createChild({
					tag:'a',
					cls:'searchResult-page-span',
					href:'javascript:void(0)',
					html:"[" + i + "]"
				})
				tempEl.page = i;
				tempEl.on('click',function(){
					sr.search({page:this.page})
				})
			}
		}
		
		//下一页（每页10个）
		if(p+10<c){
			tempEl = this.pageEl.createChild({
				tag:'a',
				cls:'searchResult-next-page',
				href:'javascript:void(0)',
				html:'下一页'
			})
			tempEl.on('click',function(){
				this.search({page:p+11})
			},this)
		}
	},
	search:function(params){
		var p = {
			itemid:this.id,
			method:'search',
			formid:Artery.getFormId(this)
		};
		if(this.extParams){
			Ext.apply(p,Ext.decode(this.extParams));
		}
		Ext.apply(p,params);
		//alert(Ext.encode(p))
		Artery.runLogic({
			params:p,
			scope:this,
			callback: function(result){
				if(result.success){
					this.update(Ext.decode(result.data))
				}
			}
		});

	}
})

//注册组件
Ext.reg('apSearchResult', Artery.plugin.SearchResult);