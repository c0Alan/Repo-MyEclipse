/**
 * Artery BlankPanel component
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.Paingbar1 = Ext.extend(Artery.plugin.BasePagingbar, {
	
	rowCount:null,//总记录数
	
	rowsPerPage:null,//每页个数
	
	currPageNo:null,//当前页数
	
	totalPageNo:null,//总页数
	
	pagePerNext:10,//默认10页
	
	onSearchEvent:null,//查询脚本
	
	splitPage:true,//是否分页
	
	isShowPageInfo: false,//是否显示分页信息
	
	isShowFirstLast: false, // 是否显示首尾页
	
	pageInfoAlign:'right',//分页信息位置
	
	initComponent: function(){
		Artery.plugin.Paingbar1.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	Artery.plugin.Paingbar1.superclass.onRender.call(this,ct, position);
        this.renderPage();
    },
    
    //得到当前页数
    getCurrentPageNo: function(){
    	return this.currPageNo;
    },
    
    //得到每页个数
    getRowsPerPage: function(){
    	return this.rowsPerPage;
    },
    
    //得到总记录数
    getRowCount: function(){
    	return this.rowCount;
    },
    
    //是否分页
    isSplitPage: function(){
    	return this.splitPage;
    },
    
    //得到分页信息
    getPageInfo: function(){
    	return {
    		rowCount:this.rowCount,
    		rowsPerPage:this.rowsPerPage,
    		currPageNo:this.currPageNo,
    		pagePerNext:this.pagePerNext,
    		splitPage:this.splitPage
    	};
    },
    
    renderPage: function(){
    	var pagingbar = this;
		this.el.update("");
		var c = (this.isPageSplit == false || this.rowCount == 0 || this.rowsPerPage == 0)? 1 : Math.ceil(this.rowCount / this.rowsPerPage);
		this.totalPageNo = c;
		if(this.isOnePageHideBar && this.totalPageNo == 1){
			this.el.addClass("x-hide-display");
		}else{
			if(this.el.hasClass("x-hide-display")){
				this.el.removeClass("x-hide-display");
			}
		}
		if (this.isPageSplit == false || this.currPageNo == null){
			this.currPageNo  = 1;
		}
		this.pagePerNext = parseInt(this.pagePerNext);
		var tempEl;
		var remainder = this.currPageNo % this.pagePerNext;
		var p = this.currPageNo/this.pagePerNext;
		p = Math.floor(remainder ==0?p-1:p)*this.pagePerNext;
		
		//分页信息
		if(this.isShowPageInfo && this.pageInfoAlign == 'left'){
			this.renderPageInfo();
		}

		// 首页
		if (this.isShowFirstLast) {
			tempEl = this.el.createChild({
				tag:'span',
				cls:'x-pagingbar1-firstPage x-pagingbar-button x-theme-button-cookie',
				html:'<TABLE style="WIDTH: auto" class="x-btn" cellSpacing=0 cellPadding=0><TR><TD class=x-btn-left><I class="x-btn-left-text">&nbsp;</I></TD><TD class=x-btn-center><button class="x-btn-button x-btn-text" style="width:40px;PADDING-TOP: 2px">首页</button></TD><TD class=x-btn-right><I class="x-btn-right-text">&nbsp;</I></TD></TR></TABLE>'
			})
			tempEl.child('table').addClassOnOver('x-btn-over');
			if(this.currPageNo != 1 && this.splitPage){
				tempEl.on('click',function(){
					this.search({currPageNo:1});
				},this)
			}else{
				tempEl.addClass('x-pagingbar-disable');
				tempEl.child('table').dom.disabled = 'disabled';
			}
		}

		//上一页
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar1-prePage x-pagingbar-button x-theme-button-cookie',
			html:'<TABLE style="WIDTH: auto" class="x-btn" cellSpacing=0 cellPadding=0><TR><TD class=x-btn-left><I class="x-btn-left-text">&nbsp;</I></TD><TD class=x-btn-center><button class="x-btn-button x-btn-text" style="width:40px;PADDING-TOP: 2px">前一页</button></TD><TD class=x-btn-right><I class="x-btn-right-text">&nbsp;</I></TD></TR></TABLE>'
		})
		tempEl.child('table').addClassOnOver('x-btn-over');
		if(this.currPageNo != 1 && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:parseInt(this.currPageNo)-1});
			},this)
		}else{
			tempEl.addClass('x-pagingbar-disable');
			tempEl.child('table').dom.disabled = 'disabled';
		}
		
		//上10页（每页this.pagePerNext个）
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar1-num',
			html:'<<'
		})
		if(this.currPageNo != 1 && this.currPageNo >this.pagePerNext && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:p-this.pagePerNext + 1});
			},this)
		}else{
			tempEl.addClass('x-hidden');
		}
		
		//（每页this.pagePerNext个）
		var min = p+1;
		var max = p
		if(max+this.pagePerNext >c){
			max += c%this.pagePerNext;
		}else{
			max += this.pagePerNext;
		}
		if(!this.splitPage){
			min = 1;
			max = 1;
			this.currPageNo = 1;
		}
		
		//alert(c + ":" + min + ":" + max);
		for(var i=min;i<=max;i++){
			if(this.currPageNo == i){
				tempEl = this.el.createChild({
					tag:'span',
					cls:'x-pagingbar1-num x-pagingbar1-num-current',
					html:i
				})
			}else{
				tempEl = this.el.createChild({
					tag:'span',
					cls:'x-pagingbar1-num',
					html:i
				})
				tempEl.page = i;
				tempEl.on('click',function(){
					pagingbar.search({currPageNo:this.page})
				})
			}
		}
		
		//下10页（每页this.pagePerNext个）
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar1-num',
			html:'>>'
		})
		if(p+this.pagePerNext<c && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:p+parseInt(this.pagePerNext) + 1})
			},this)
		}else{
			tempEl.addClass('x-hidden');
		}
		
		//下一页（每页this.pagePerNext个）
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar1-nextPage x-pagingbar-button x-theme-button-cookie',
			html:'<TABLE style="WIDTH: auto" class="x-btn" cellSpacing=0 cellPadding=0><TR><TD class=x-btn-left><I class="x-btn-left-text">&nbsp;</I></TD><TD class=x-btn-center><button class="x-btn-button x-btn-text" style="width:40px;PADDING-TOP: 2px">后一页</button></TD><TD class=x-btn-right><I class="x-btn-right-text">&nbsp;</I></TD></TR></TABLE>'
		})
		tempEl.child('table').addClassOnOver('x-btn-over');
		if(this.currPageNo < c && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:parseInt(this.currPageNo) + 1})
			},this)
		}else{
			tempEl.addClass('x-pagingbar-disable');
			tempEl.child('table').dom.disabled = 'disabled';
		}

		// 尾页
		if (this.isShowFirstLast) {
			tempEl = this.el.createChild({
				tag:'span',
				cls:'x-pagingbar1-lastPage x-pagingbar-button x-theme-button-cookie',
				html:'<TABLE style="WIDTH: auto" class="x-btn" cellSpacing=0 cellPadding=0><TR><TD class=x-btn-left><I class="x-btn-left-text">&nbsp;</I></TD><TD class=x-btn-center><button class="x-btn-button x-btn-text" style="width:40px;PADDING-TOP: 2px">尾页</button></TD><TD class=x-btn-right><I class="x-btn-right-text">&nbsp;</I></TD></TR></TABLE>'
			})
			tempEl.child('table').addClassOnOver('x-btn-over');
			if(this.currPageNo < this.totalPageNo && this.splitPage){
				tempEl.on('click',function(){
					this.search({currPageNo:parseInt(this.totalPageNo)})
				},this)
			}else{
				tempEl.addClass('x-pagingbar-disable');
				tempEl.child('table').dom.disabled = 'disabled';
			}
		}

		//分页信息
		if(this.isShowPageInfo && this.pageInfoAlign == 'right'){
			this.renderPageInfo();
		}
    },
    
    renderPageInfo: function(){
    	var data={};
		if(Ext.isEmpty(this.rowCount) || this.rowCount == 0){
			data.rowCount = 0;
			data.currentRowCount = 0;
			data.totalPageNo = 0;
		}else{
			data.rowCount = this.rowCount;
			var startData = (this.currPageNo-1)*this.rowsPerPage + 1;
			var endData = this.currPageNo * this.rowsPerPage;
			if(endData > this.rowCount){
				endData = this.rowCount;
			}
			data.currentRowCount = startData + "-" + endData;
			data.totalPageNo = this.totalPageNo;
		}
		this.pageInfoTpl.append(this.el,data);
    },
    
    search: function(cfg){
    	this.refresh(cfg)
    	this.doSearch(cfg);
    },
    doSearch: function(cfg){
    	if(cfg == null){
    		cfg = {};
    	}
    	var params = {};
    	var cpn = cfg.currPageNo;
    	if(cpn == null){
    		cpn = this.currPageNo;
    	}
    	params.start = (cpn-1)*this.rowsPerPage;
    	params.limit = this.rowsPerPage;
    	params.isPageSplit= this.isPageSplit;
    	Ext.apply(params,cfg);
    	Artery.regItemEvent(this,'onSearchEvent',null,{'params':params});
    },
    refresh: function(cfg){
    	if(cfg){
    		Ext.apply(this,cfg);
    	}
    	this.renderPage();
    }
})

Ext.reg('apPagingbar1', Artery.plugin.Paingbar1);