/**
 * Artery Pagingbar2 component
 * 
 * @author wj
 * @date 2/12/2010
 * 
 */
Artery.plugin.Pagingbar2 = Ext.extend(Artery.plugin.BasePagingbar, {
	
	rowCount:null,//总记录数
	
	rowsPerPage:null,//每页个数
	
	currPageNo:null,//当前页数
	
	totalPageNo:null,//总页数
	
	pagePerNext:5,//默认5页
	
	onSearchEvent:null,//查询脚本
	
	splitPage:true,//是否分页
	
	isShowPageInfo: false,//是否显示分页信息
	
	pageInfoAlign:'right',//分页信息位置
	
	initComponent: function(){
		Artery.plugin.Pagingbar2.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position){
    	Artery.plugin.Pagingbar2.superclass.onRender.call(this,ct, position);
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
		this.el.update("");

		var c =(this.isPageSplit == false || this.rowCount == 0 || this.rowsPerPage == 0)? 1 : Math.ceil(this.rowCount / this.rowsPerPage);
		this.totalPageNo = c;
		if(this.isOnePageHideBar && this.totalPageNo == 1){
			this.el.addClass("x-hide-display");
		}else{
			if(this.el.hasClass("x-hide-display")){
				this.el.removeClass("x-hide-display");
			}
		}
		if(this.isPageSplit == false || this.currPageNo == null){
			this.currPageNo  = 1;
		}
		this.pagePerNext = parseInt(this.pagePerNext);
		if(typeof(this.currPageNo) == 'string'){
			this.currPageNo = parseInt(this.currPageNo);
		}
		var tempEl;
		
		
		//分页信息
		if(this.isShowPageInfo && this.pageInfoAlign == 'left'){
			this.renderPageInfo();
		}
		
		//上一页
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar2-btn',
			html:'<上一页'
		});
		if(this.currPageNo != 1 && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:parseInt(this.currPageNo)-1});
			},this)
		}else{
			tempEl.addClass('x-pagingbar2-btnDisabled');
		}

		//添加页码 当设置的每页显示页码数为偶数时 
		if(this.pagePerNext % 2 != 0){
			if(c <= this.pagePerNext+1){
				this.addPageNumbers(1,c);
			}else{
				if(this.currPageNo <= (this.pagePerNext-1)/2+1){
					this.addPageNumbers(1,this.pagePerNext);
					this.addEllipsis();
					this.addPageNumbers(c,c);
				}else if(this.currPageNo >= c-(this.pagePerNext-1)/2){
					this.addPageNumbers(1,1);
					this.addEllipsis();
					this.addPageNumbers(c-this.pagePerNext+1,c);
				}else{
					var min = this.currPageNo-(this.pagePerNext-1)/2;
					var max = this.currPageNo+(this.pagePerNext-1)/2;
					this.addPageNumbers(1,1);
					if(min > 2)
						this.addEllipsis();
					this.addPageNumbers(min,max);
					if(max < c-1)
						this.addEllipsis();
					this.addPageNumbers(c,c);	
				}
			}
		}else{//添加页码 当设置的每页显示页码数为奇数时 
			if(c <= this.pagePerNext+1){
				this.addPageNumbers(1,c);
			}else{
				if(this.currPageNo <= this.pagePerNext/2){
					this.addPageNumbers(1,this.pagePerNext);
					this.addEllipsis();
					this.addPageNumbers(c,c);
				}else if(this.currPageNo >= c-this.pagePerNext/2){
					this.addPageNumbers(1,1);
					this.addEllipsis();
					this.addPageNumbers(c-this.pagePerNext+1,c);
				}else{
					var min = this.currPageNo-this.pagePerNext/2+1;
					var max = this.currPageNo+this.pagePerNext/2;
					this.addPageNumbers(1,1);
					if(min > 2)
						this.addEllipsis();
					this.addPageNumbers(min,max);
					if(max < c-1)
						this.addEllipsis();
					this.addPageNumbers(c,c);	
				}
			}
		}
		
		
		//下一页（每页this.pagePerNext个）
		tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar2-btn',
			html:'下一页>'
		})
		if(this.currPageNo < c && this.splitPage){
			tempEl.on('click',function(){
				this.search({currPageNo:parseInt(this.currPageNo) + 1})
			},this)
		}else{
			tempEl.addClass('x-pagingbar2-btnDisabled');
		}
		
		//分页信息
		if(this.isShowPageInfo && this.pageInfoAlign == 'right'){
			this.renderPageInfo();
		}
    },
    //添加连续的页码 从min开始到max结束
    addPageNumbers:function(min,max){
    	var pagingbar = this;
    	var tempEl = null;
    	for(var i=min;i<=max;i++){
			if(this.currPageNo == i){
				tempEl = this.el.createChild({
					tag:'span',
					cls:'x-pagingbar2-num x-pagingbar2-num-current',
					html:i
				})
			}else{
				tempEl = this.el.createChild({
					tag:'span',
					cls:'x-pagingbar2-num',
					html:i
				})
				tempEl.page = i;
				tempEl.on('click',function(){
					pagingbar.search({currPageNo:this.page})
				})
			}
		}
    },
    //添加省略号
    addEllipsis:function(){
    	var tempEl = this.el.createChild({
			tag:'span',
			cls:'x-pagingbar2-ellipsis',
			html:'...'
		})
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
		data.pageInfoClass = 'x-pagingbar2-pageInfo';
		data.pageInfoTextClass = 'x-pagingbar2-pageInfo-text';
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

Ext.reg('apPagingbar2', Artery.plugin.Pagingbar2);