/**
 * 標題不滚动
 */
Artery.initListScroll = function(id,ct){
	var cn = Ext.getDom(id + '-atslheader').childNodes;
	for(var i=0;i< cn.length;i++){
		Ext.fly(cn[i]).addClass('sl-header-scroll');
	}
	ct.onscroll = null;
}

/**
 * 用于简单列表的store类
 */
Artery.plugin.SampleListStore = function(config){
	this.addEvents("beforeload", "load", "loadexception");
	Ext.apply(this, config);
};

Ext.extend(Artery.plugin.SampleListStore, Ext.util.Observable, {
	
	/**
	 * 列表对象
	 */
	list: null,
	
	// private
    paramNames : {
        "start" : "start",
        "limit" : "limit",
        "sort" : "sort",
        "dir" : "dir"
    },
    
    // 基本参数列表
    baseParams: {},
	
	/**
	 * 加载数据
	 */
	load : function(options){
        options = options || {}; 
        if(this.fireEvent("beforeload", this, options) === false){
        	return false;
        }
        if(options.params==null){
        	options.params = {};
        }
       	var p = Ext.apply(options.params, this.baseParams);
       	if(options.highlightValue){
       		p.highlightValue = options.highlightValue;
       	}
        if(this.sortInfo){
            var pn = this.paramNames;
            p[pn["sort"]] = this.sortInfo.field;
            p[pn["dir"]] = this.sortInfo.direction;
        }
        this.storeOptions(options);
        this.loadFromServer(p, options);
        return true;
    },
    
    /**
     * 重载数据
     */
    reload : function(options){
    	this.load(Artery.applyIf(options||{}, this.lastOptions));
    },
    
    // private 服务器加载完成后的回调函数
    loadRecords : function(response, options, success){
    	// 加载失败
        if(!response || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            return;
        }
		if (response != null) {
			response = Ext.decode(response);
		}
       	// 解析html等内容
        this.list.renderHtml(response);
        var r = [];
        this.fireEvent("load", this, r, options);
    },
    
    /**
     * 从服务器加载html
     */
    loadFromServer: function(p,o){
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			success : function(response, options) {
				//将后台返回的用户自定义数据加入到options.params中，方便回调函数中使用
				var responseText=response.responseText;
				if(responseText){
					var responseTextObj=Ext.decode(responseText);
					if(responseTextObj.customData){
						options.params.customData=Ext.decode(responseTextObj.customData);
					}
				}
				if(o.callback){
					options.callback = o.callback;
				}
				this.loadRecords(responseText,options,true);
				if(o.highlightValue){
					var el = this.list.el.child('.x-list-highlight-row');
					if(el){
						el.scrollIntoView(this.list.body);
						el.dom.click();
					}
				}
			},
			params : o.params,
			scope : this
		});
    },
    
    // private
    storeOptions : function(o){
        o = Ext.decode(Ext.encode(o))
        delete o.callback;
        delete o.scope;
        delete o.highlightValue;
        this.lastOptions = o;
    },
    
    applyLastOptionsParams: function(params){
    	if(!this.lastOptions){
    		this.lastOptions = {};
    	}
    	if(!this.lastOptions.params){
    		this.lastOptions.params = {};
    	}
    	if(params.itemid){
    		delete params.itemid;
    	}
    	Ext.apply(this.lastOptions.params,params);
    },
    
    /**
     * 获得记录总数
     */
    getTotalCount : function(){
        return this.totalLength || 0;
    },
    
    /**
     * 获得加载记录数
     */
    getCount : function(){
        return this.dataLength || 0;
    },
    /**
     * 获得当前页数
     */
    getCurrPageNo : function(){
        return this.currPageNo || 1;
    },
    
    /**
     * 获得每页个数
     */
    getRowsPerPage : function(){
        return this.rowsPerPage;
    },
    
    getSortState : function(){
        return this.sortInfo;
    }
});

/**
 * 简单列表
 */
Artery.plugin.SampleList = Ext.extend(Artery.plugin.BasePanel,{

	containerEl: null, 	// 列表容器对象
	colGroupEl:null,
	colGroup:null,
	headEl: null,		// 表头对象
	headComp: null,		// 表头标题对象（Ext复合元素）
	cm: null,			// 列配置信息
	filterCompEl: null,	// 过滤框对象（Ext复合元素）
	tbodyEl: null,		// 数据容器对象
	selectedRow: null,	// 选中的行（dom）
	selectedCell: null, // 选中的单元格（dom）
	domFindLevel: 5,	// 需要在多少级节点查找父节点
	exportType: "stream",	// 文件导出方式，stream或tempFile
	
	onLoadEvent:null,//加载时脚本
	
	pagingbars:null,//关联的分页栏
	rowClickSelect:true,//点击行时是否选中
	showTitle:true,//是否显示标题
	isShowRowNumber:true,//是否显示行号
	hiddenFilter:false,//是否隐藏过滤栏

	initComponent: function(){
		//Artery.debug('initComponentStart');
		this.store = new Artery.plugin.SampleListStore({
			list: this
		});
		this.store.on("beforeload", this.onBeforeLoad, this);
		if(this.pagingbars){
			this.store.on("load", this.refreshPagingbars, this);
		}
		this.store.on("load", this.onAfterLoad, this);
		if(this.bbar){
			this.bbar.store = this.store;
		}
		// autoRowHeight为false时，多一层table，需要查找的层更深
		if(!this.autoRowHeight){
			this.domFindLevel = 9;
		}
		//Artery.debug('initComponentSuperStart');
		Artery.plugin.SampleList.superclass.initComponent.call(this);
		//Artery.debug('initComponentSuperEnd');
	},
	/**
	 * 导出excel
	 * 
	 * @param total
	 *            是否导出全部，为false，则只导出本页
	 * @param name
	 *            导出文件名
	 */
	exportExcel : function(total,name) {
		var url = sys.getContextPath() + "/artery/form/dealParse.do";
					var p = Artery.getParams({}, this);
					if(this.store.lastOptions && this.store.lastOptions.params){
						Ext.apply(p,this.store.lastOptions.params);
					}else{
						Ext.apply(p,{
							"start":0,
							"limit":this.store.rowsPerPage
						});
					}
					
					// 编码参数
					Ext.tusc.encodeParam(p);
					Ext.apply(p,{
						itemid:Artery.getEventId(this),
						formid:Artery.getFormId(this),
						method: "exportExcel",
						action: "runItemLogic",
						exportType: this.exportType
					})
					
					if(total == true){
						p.exportAll = "true";
					}
					
					this.setColumnConf(p);
					if (!Ext.isEmpty(name)) {
						p.exportName = name;
					} else {
						p.exportName = this.exportName;
					}
					//设置这次请求不是ajax的操作
					p.isAjax = false;
					// 根据导出方式做不同处理
//					if(Ext.isEmpty(this.exportType) || this.exportType=="stream"){
			            p.exportName = Artery.escape(p.exportName);
			            url = url+"?"+Ext.urlEncode(p);
						if(url.length>1000){
							cfg={};
							delete p.action;
							cfg.params=p;
							cfg.url="/artery/form/dealParse.do?action=runItemLogic";
							if(this.exportNewPage){
								cfg.expName = "newWindow";
							}
							Artery.autoSubmitForm(window,cfg);
						}else{
							if(this.exportNewPage){
								window.open(url);
							}
							else{
								window.location = url;
							}
						}
//					}else{
//						this.container.mask("正在导出数据...");
//						Artery.request({
//							url : url,
//							success : function(response, options) {
//								this.container.unmask();
//								var res = Ext.decode(response.responseText);
//								if(res.tempFile){
//									var localUrl= url + "?action=download&nameencrypt=1&file="+res.tempFile+"&random="+Math.random();
//									if(res.tempFolder){
//										alert(res.tempFolder);
//										localUrl = localUrl+"&folder="+res.tempFolder;
//									}
//									window.location = localUrl;
//								}else{
//									alert("导出文件失败");
//								}
//							},
//							params : p,
//							scope: this
//						});
//					}
	},
	
	/**
	 * 导出pdf
	 * 
	 * @param total
	 *            是否导出全部，为false，则只导出本页
	 * @param name
	 *            导出文件名
	 */
	exportPdf : function(total,name) {
		var url = sys.getContextPath() + "/artery/form/dealParse.do";
		var p = Artery.getParams({}, this);
		if(this.store.lastOptions && this.store.lastOptions.params){
			Ext.apply(p,this.store.lastOptions.params);
		}else{
			Ext.apply(p,{
				"start":0,
				"limit":this.store.rowsPerPage
			});
		}
		// 编码参数
		Ext.tusc.encodeParam(p);
		Ext.apply(p,{
			itemid:Artery.getEventId(this),
			formid:Artery.getFormId(this),
			method: "exportPdf",
			action: "runItemLogic",
			exportType: this.exportType
		})
		
		if(total == true){
			p.exportAll = "true";
		}
		this.setColumnConf(p);
		if (!Ext.isEmpty(name)) {
			p.exportName = name;
		} else {
			p.exportName = this.exportName;
		}
		//设置这次请求不是ajax的操作
		p.isAjax = false;
		// 根据导出方式做不同处理
		if(Ext.isEmpty(this.exportType) || this.exportType=="stream"){
			p.exportName = Artery.escape(p.exportName);
			url = url+"?"+Ext.urlEncode(p);
			if(url.length>1000){
				cfg={};
				delete p.action;
				cfg.params=p;
				cfg.url="/artery/form/dealParse.do?action=runItemLogic";
				if(this.exportNewPage){
					cfg.expName = "newWindow";
				}
				Artery.autoSubmitForm(window,cfg);
			}else{
				if(this.exportNewPage){
					window.open(url);
				}
				else{
					window.location = url;
				}
			}
			
		}else{
			this.container.mask("正在导出数据...");
			Artery.request({
				url : url,
				success : function(response, options) {
					this.container.unmask();
					var res = Ext.decode(response.responseText);
					if(res.tempFile){
						window.location = url + "?action=download&nameencrypt=1&file="+res.tempFile+"&random="+Math.random();
					}else{
						alert("导出文件失败");
					}
				},
				params : p,
				scope: this
			});
		}
	},
	
	// private 加载前，加入其它参数
	onBeforeLoad: function(store, options){
		if(this.store.loadding){
			return false;
		}
		this.store.loadding = true;
		if(this.loadMask){
			this.bwrap.mask("正在加载数据...");
		}
		if (options.params == null) {
			options.params = {};
		}
		this.setFilterParams(options.params);
		this.setColumnConf(options.params);
		Artery.applyIf(options.params, Artery.getParams({
			method : 'parseListData',
			listAreaId:this.id
		}, this));
		
		//加入隐藏列参数
		var hiddenCols = [];
		var length = this.colGroup.length;
		for(var i=0;i<length;i++){
			if(this.colGroup[i].hidden){
				hiddenCols.push(this.colGroup[i].id);
			}
		}
		if(hiddenCols.length != 0){
			options.params.hiddenCols = hiddenCols.join(',');
		}else{
			options.params.hiddenCols = "";
		}
		
	},
	
	// 设置显示列信息
	setColumnConf : function(params){
		var ca = {};
		for(var i=0;i<this.columns.length;i++){
			var di = this.columns[i].dataIndex;
			ca[di] = this.columns[i].colHidden;
		}
		params.columnConf = Ext.encode(ca);
	},
	
	// 设置过滤参数
	setFilterParams : function(params) {
		if(this.filterCompEl == null || this.filterCompEl.elements.length<1){
			return ;
		}
		var p = "";
		var es = this.filterCompEl.elements;
		for(var i=0;i<es.length;i++){
			var value = es[i].value.trim();
			if(!Ext.isEmpty(value)){
				if(value == es[i].getAttribute("filterEmptyText"))
					continue;
				var colId = es[i].getAttribute("colId");
				value = value.replace(/;/g, "$sem").replace(/:/g, "$col");
				p += colId + ":" + value + ";";	
			}
		}
		if(Ext.isEmpty(p)){
			delete params.filter;
		}else{
			params.filter = p;
		}
	},
	
	//刷新所有关联的分页栏
	refreshPagingbars: function(store,recores,o){
		if(this.pagingbars == null || this.pagingbars.length == 0){
			return;
		}
		var p = this.store.paramNames;
		//var cursor = parseInt((o.params && o.params[p.start]) ? o.params[p.start] : 0);
		var limit = parseInt((o.params && o.params[p.limit]) ? o.params[p.limit] : 0);
		if(limit == 0){
		var pb =  Artery.get(this.pagingbars[0]);
			if(!pb){
				return;
			}
			limit = pb.pageCount;
		}
		if(limit == 0){
			return;
		}
		var total = this.store.getTotalCount();
		//var page=  Math.floor((cursor+limit)/limit)
		var page=  this.store.getCurrPageNo();
		for(var i=0; i< this.pagingbars.length;i++){
			var pgbar = Artery.get(this.pagingbars[i]);
			if(pgbar && pgbar.refresh){
				pgbar.refresh({rowCount:total,currPageNo:page,rowsPerPage:this.store.getRowsPerPage()});
			}
		}
	},
	
	// private，加载完毕，执行一些动作
	onAfterLoad: function(store,records,options){
		this.selectedRow = null;
		this.selectedCell = null;
		this.store.loadding = false;
		if(this.loadMask){
			this.bwrap.unmask();
		}
		if(this.isPageSplit && this.isOnePageHideBar){
			if(this.pageCount == 0  || this.store.getTotalCount()==0|| this.pageCount >=this.store.getTotalCount()){
				this.getBottomToolbar().hide();
			}else{
				this.getBottomToolbar().show();
			}
		}
		
		// 执行onLoadEvent
		if(this.onLoadEvent){
			Artery.regItemEvent(this,'onLoadEvent',null,{
				'store':store,
				'records':records,
				'options':options
			});
		}
	},

	onRender : function(ct, position) {
		//Artery.debug('onRenderStart');
		Artery.plugin.SampleList.superclass.onRender.call(this, ct, position);
		//Artery.debug('onRenderEnd');
		//this.containerEl = this.body.child(".sl-container");
		//this.headEl = this.containerEl.child(".sl-header");
		this.containerEl = Ext.get(this.id + '-atslcontainer');
		this.colGroupEl = Ext.get(this.id + "_colgroup"); 
		this.initColGroup();
		if(this.showTitle){
			this.headEl = Ext.get(this.id + '-atslheader');
			this.headerFilterRowEl = this.headEl.child('.sl-header-filter-row');
			this.filterCompEl = this.headEl.select(".sl-header-finput");
			this.initHeadEvent();
		}
		
		//this.tbodyEl = this.containerEl.child(".sl-body");
		this.tbodyEl = Ext.get(this.id + '-atslbody');
		//Artery.debug('initEventEnd');
	},
	
	collapseFilter: function(){
		if(this.headerFilterRowEl){
			this.headerFilterRowEl.setDisplayed(false);
			this.hiddenFilter = true;
		}
	},
	
	expandFilter: function(){
		if(this.headerFilterRowEl){
			this.headerFilterRowEl.setDisplayed(true);
			this.hiddenFilter = false;
		}
	},
	
	toggleFilter: function(){
		if(this.hiddenFilter){
			this.expandFilter();
		}else{
			this.collapseFilter();
		}
		return this.hiddenFilter;
	},
	
	initColGroup:function(){
		this.colGroup = Ext.query('col',this.colGroupEl.dom)
	},
	
	afterRender: function(){
		//Artery.debug('afterRenderStart');
		Artery.plugin.SampleList.superclass.afterRender.call(this);
		if(!this.isInitData){
			this.store.load({
				params : {
					start : 0,
					limit : this.pageCount
				}
			});
		}else{
			this.doMoreWork();
			this.store.fireEvent("load", this.store, [], {});
		}
		//Artery.debug('afterRenderEnd');
	},
	
	/**
	 * 渲染列表，从html中提取信息，存储到store中
	 */
	renderHtml: function(response){
		if(!this.tempTableEl){
			this.tempTableEl = document.createElement('div')
			this.tempTableEl.style.display='none';
			Ext.getBody().appendChild(this.tempTableEl);
		}
		this.tempTableEl.innerHTML = response.html ;
		this.containerEl.dom.replaceChild(this.tempTableEl.firstChild.firstChild,this.tbodyEl.dom);
		Ext.destroy(this.tbodyEl);
		this.tbodyEl = this.containerEl.child(".sl-body");
		this.doMoreWork();
		if(!Ext.isEmpty(response.script)){
			eval(response.script);
		}
	},
	
	// 初始化表头事件
	initHeadEvent: function(){
		// 表头事件
		this.headComp = this.headEl.select(".sl-header-title");
		//this.headComp.on("mouseover",this.handleHeadOver,this);
		//this.headComp.on("mouseout",this.handleHeadOut,this);
		this.headComp.on("click", this.handleHeadClick,this);
		// 过滤框事件
		if(this.filterCompEl.elements.length>0){
			var es = this.filterCompEl.elements;
			for(var i=0;i<es.length;i++){
				var tn = es[i].tagName.toLowerCase();
				if(tn=="input"){
					Ext.fly(es[i]).on("keypress",this.handleFilterInput,this);
					Ext.fly(es[i]).on("focus",this.focusFilterInput,this);
					Ext.fly(es[i]).on("blur",this.blurFilterInput,this);
				}else if(tn=="select"){
					Ext.fly(es[i]).on("change",this.handleFilterSelect,this);
				}
			}
		}
	},
	
	// focus表头过滤 input
	focusFilterInput: function(e){
		var tar = e.getTarget();
		if(!tar){
			return;
		}
		var filterEmptyText = tar.getAttribute("filterEmptyText");
		if(!Ext.isEmpty(filterEmptyText) && tar.value == filterEmptyText){
			Ext.fly(tar).removeClass('sl-header-empty-finput');
			tar.value = '';
		}
	},
	
	// blur表头过滤 input
	blurFilterInput: function(e){
		var tar = e.getTarget();
		var filterEmptyText = tar.getAttribute("filterEmptyText");
		if(!Ext.isEmpty(filterEmptyText)){
			if(Ext.isEmpty(tar.value)){
				tar.value = filterEmptyText;
				Ext.fly(tar).addClass('sl-header-empty-finput');
			}else if(tar.value == filterEmptyText)
				Ext.fly(tar).addClass('sl-header-empty-finput');
		}
	},
	
	// 表头鼠标移入
	handleHeadOver: function(e){
		var tar = e.getTarget();
		var titleDom = this.findParentDom(tar,"td");
		Ext.fly(titleDom).addClass("sl-header-over");
	},
	
	// 表头鼠标移出
	handleHeadOut: function(e){
		var tar = e.getTarget();
		var titleDom = this.findParentDom(tar,"td");
		Ext.fly(titleDom).removeClass("sl-header-over");
	},
	
	// 表头鼠标单击，排序
	handleHeadClick: function(e){
		var d = e.getTarget();
		var tn = d.tagName;
		var type = d.getAttribute("type");
		if(tn.toLowerCase()=="input" && type=="checkbox"){
			this.handleHeadSelect(e);
			return ;
		}
		var tdom = this.findParentDom(d,".sl-header-title");
		var orat = tdom.getAttribute("isOrderBy");
		if(orat=="true"){
			this.handleOrder(tdom);
		}
	},
	
	// 处理表头全选
	handleHeadSelect: function(e){
		var d = e.getTarget();
		var tdom = this.findParentDom(d,".sl-header-title");
		var colId = tdom.getAttribute("colId");
		var cf = this.getColConf(colId);
		if(cf.coltype=="checkbox"){
			if(d.checked){
				this.selectAllCheckbox(colId, false);
			}else{
				this.deselectAllCheckbox(colId, false);
			}
			if(cf.onHeadSelectEvent){
				var rc = Artery.createCaller(cf.dataIndex, "onHeadSelectServer",Artery.getFormId(this));
				rc.sync = true;
				eval("var fn = function(checked){" + cf.onHeadSelectEvent + "\n}");
				fn.call(this,d.checked);
			}
		}
	},
	
	// 处理排序
	handleOrder: function(headDom){
		var colId = headDom.getAttribute("colId");
		// 清空其他列的排序状态
		this.headComp.each(function(el){
			var cid = el.dom.getAttribute("colId");
			if(colId!=cid){
				var os = el.dom.getAttribute("orderStatus");
				if(os=="ASC" || os=="DESC"){
					el.dom.innerHTML = el.dom.getAttribute("colTitle");
				}
			}
		});
		
		// 设置本列的排序状态
		var sd = headDom.getAttribute("sortDir");
		var orderIcon = headDom.getAttribute("showOrderIcon");
		if(orderIcon=="true"){
			sd = (sd=="ASC")?"DESC":"ASC";
			headDom.setAttribute("showOrderIcon", "false");
		}
		if(this.store.sortInfo){
			var sort = this.store.sortInfo.field;
			var dir = this.store.sortInfo.direction;
			if(sort==colId){
				if(dir=="ASC"){
					this.setHeadDir(headDom,"DESC");
				}else{
					this.setHeadDir(headDom,"ASC");
				}
			}else{
				this.setHeadDir(headDom, sd);
			}
		}else{
			this.setHeadDir(headDom, sd);
		}
		var o = this.getLoadParams();
		this.store.load({params:o});
	},
	
	// 设置指定列的dir信息
	setHeadDir: function(headDom, dir){
		if(dir==null){
			headDom.innerHTML = headDom.getAttribute("colTitle");
			this.store.sortInfo = null;
		}else{
			var newText = headDom.getAttribute("colTitle");
			if(dir=="ASC"){
				newText = newText+"<img src='" + sys.getContextPath() + "/artery/arteryTheme/theme/default/images/sampleList/sort_asc.gif'>";
			}else{
				newText = newText+"<img src='" + sys.getContextPath() + "/artery/arteryTheme/theme/default/images/sampleList/sort_desc.gif'>";
			}
			headDom.innerHTML = newText;
			var colId = headDom.getAttribute("colId");
			this.store.sortInfo = {
				field: colId,
				direction: dir
			};
			headDom.setAttribute("orderStatus", dir);
		}
	},
	
	//设置排序的字段及方向
	setSortInfo:function(cfg){
		this.store.sortInfo = cfg;
	},
	
	// 表头过滤 input
	handleFilterInput: function(e){
		var dk = e.getKey();
		if(dk==Ext.EventObject.ENTER || dk==Ext.EventObject.ESC){
			var o = this.getLoadParams();
			this.store.load({params:o});
		}
	},
	
	// 表头过滤 select
	handleFilterSelect: function(e){
		var o = this.getLoadParams();
		this.store.load({params:o});
	},
	
	// 获得加载时参数
	getLoadParams: function(){
		var o = {};
		if(this.store.lastOptions && this.store.lastOptions.params){
			Ext.apply(o,this.store.lastOptions.params);
		}
		if (this.pageCount != 0) {
			o.start = 0;
			o.limit = this.pageCount;
		}
		return o;
	},
	
	// 寻找指定的父节点
	findParentDom: function(dom, selector, level){
		if(level===undefined){
			level = 5;
		}
		return Ext.fly(dom).findParent(selector, level, false);
	},
	
	// 切换选中的行
	changeSelectedRow: function(rowDom){
		if(rowDom==this.selectedRow){
			return ;
		}
		if(!rowDom){
			return ;
		}
		if(this.rowClickSelect){
			Ext.fly(rowDom).addClass("sl-data-row-select");
			if(this.selectedRow){
				Ext.fly(this.selectedRow).removeClass("sl-data-row-select");
			}
		}
		this.selectedRow = rowDom;
	},
	
	// 做一些后续处理
	doMoreWork: function(){
		this.store.totalLength = parseInt(this.tbodyEl.dom.getAttribute("totalCount"));
		this.store.dataLength = parseInt(this.tbodyEl.dom.getAttribute("dataCount"));
		this.store.currPageNo = parseInt(this.tbodyEl.dom.getAttribute("currPageNo"));
		this.store.rowsPerPage = parseInt(this.tbodyEl.dom.getAttribute("rowsPerPage"));
		this.scanData();
		//翻页或者过滤时是否清空之前的状态，即checkbox列的状态
		if(this.clearStatus){
			this.clearDataStatus(false);
		}
		if(Ext.isTrue(this.tbodyEl.dom.empty)){
			this.containerEl.addClass('sl-container-empty-data');
		}else{
			this.containerEl.removeClass('sl-container-empty-data');
		}
	},
	
	// 处理checkbox单击
	dealCheckbox: function(cf,td,dealType){
		var cd = Ext.fly(td).child("input", true);
		var fd = Ext.fly(td).child(".f_value", true);
		if(!cd || !fd){
			return ;
		}
		var val = fd.innerHTML;
		if(cd.checked){
			if(cf.select.containsKey(val)){
			}else{
				if(dealType=="scan"){
					if(cf.sersel.containsKey(val)){
						cd.checked = false;
					}else{
						cf.select.add(val, "selected");
						cf.sersel.add(val, "selected");
					}
				}else if(dealType=="click"){
					cf.select.add(val, "selected");
				}
			}
		}else{
			if(cf.select.containsKey(val)){
				if(dealType=="scan"){
					//当“清空选中状态”选中时不做处理
					if(this.clearStatus){
						
					}else{
						cd.checked = true;
					}
				}else if(dealType=="click"){
					cf.select.removeKey(val);
				}
			}else{
			}
		}
	},
	
	/**
	 * 重载列表
	 * @param params 参数Map，json对象
	 * @param clearParam 为true，则清空上次查询参数，默认为false
	 * @param clearStatus 为true，则清空列表选中状态，默认为true
	 * @param clearFilter 为true，则清空列表表头过滤值，默认为false
	 */
	reload : function(options) {
		// 如果没有渲染,则什么也不做
		if(!this.rendered){
			return ;
		}
		var o = {};
		if(options){
		   o = Ext.decode(Ext.encode(options));
		   if(options.callback){
		   	o.callback = options.callback
		   }
		}
		// 清除所有参数,以当前传递参数为准，如果没有，则取属性值
		if(o.clearStatus == undefined){
			if(this.clearStatus){
				this.clearDataStatus(false);
			}
		}else if(o.clearStatus){
			this.clearDataStatus(false);
		}
		// 清除表头过滤值
		if(o.clearFilter){
			this.clearHeadFilter();
		}
		if (Ext.isTrue(this.isPageSplit) && o != null) {
			if (o.params == null) {
				o.params = {};
			}
			// 保证start,limit参数是数字
			if(o.params.start!==undefined){
				o.params.start = parseInt(o.params.start);
			}
			if(o.params.limit!==undefined){
				o.params.limit = parseInt(o.params.limit);
				//如何参数中设了limit，则应该更新分分页栏的pageSize
				this.getBottomToolbar().pageSize=o.params.limit;
			}
			Artery.applyIf(o.params, {
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			});
		}
		// 如果不清空参数，则增加上次查询的参数
		if(!o.clearParam && this.store.lastOptions){
			Artery.applyIf(o.params,this.store.lastOptions.params);
		}
		this.store.reload(o);
	},
	
	/**
	 * 清除所有checkBox选中的数据
	 * @param clearInput 如果为false，则不扫描数据中的input
	 */
	clearDataStatus: function(clearInput){
		for(var i=0;i<this.columns.length;i++){
			var cf = this.columns[i];
			if(cf.select && (cf.coltype == "checkbox" || cf.coltype == "radio")){		
				if(cf.select.clear){
					cf.select.clear();
                    cf.sersel.clear();
				}else {
					delete cf.select;
				}
				if(clearInput!==false){
					this.deselectAllCheckbox(cf.dataIndex, true);
				}
			}
		}
	},
	
	// 清除表头过滤值
	clearHeadFilter: function(){
		if(this.filterCompEl == null || this.filterCompEl.elements.length<1){
			return ;
		}
		var es = this.filterCompEl.elements;
		for(var i=0;i<es.length;i++){
			var value = es[i].value;
			var emptyText = es[i].getAttribute("filterEmptyText");
			if(Ext.isEmpty(value)){
				if(!Ext.isEmpty(emptyText)){
					es[i].value = emptyText;
					Ext.fly(es[i]).addClass('sl-header-empty-finput');
				}
			}else{
				if(Ext.isEmpty(emptyText)){
					es[i].value = "";
				}else{
					es[i].value = emptyText;
					Ext.fly(es[i]).addClass('sl-header-empty-finput');
				}
			}
		}
	},
	
	// 处理表头checkbox的状态
	sureHeadCheckboxStatus: function(cf){
		if(cf.coltype!="checkbox"){
			return ;
		}
		// 查找表头的checkbox
		var headInput = null;
		if(this.showTitle){
			this.headComp.each(function(el){
				var ci = el.dom.getAttribute("colId");
				if(ci==cf.dataIndex){
					var input = el.child("input", true);
					if(input){
						headInput = input;
					}
				}
			});
		}
		if(!headInput){
			return ;
		}
		var trArray = this.getDataRows();
		var inputCount = 0;
		var checkCount = 0;
		for(var i=0;i<trArray.length;i++){
			var td = trArray[i].children[cf.index];
			if(!td){
				continue;
			}
			var input = Ext.fly(td).child("input", true);
			if(!input){
				continue;
			}
			inputCount++;
			if(input.checked){
				checkCount++;
			}
		}
		if(inputCount!=0){
			headInput.checked = (checkCount==inputCount);
		}
	},
	
	// 处理radio单击
	dealRadio: function(cf,td){
		var cd = Ext.fly(td).child("input", true);
		var fd = Ext.fly(td).child(".f_value", true);
		if(!cd || !fd){
			return ;
		}
		var val = fd.innerHTML;
		if(cd.checked){
			cf.select = val;
		}else if(cf.select==val){
			cd.checked = true;
		}
	},
	
	/**
	 * 扫描数据集
	 */
	scanData: function(){
		var cm = [];
		for(var i=0;i<this.columns.length;i++){
			var cf = this.columns[i];
			if(cf.coltype=="checkbox" || cf.coltype=="radio"){
				cm.push(cf);
			}
		}
		if(cm.length==0){
			return ;
		}
		
		// 取消表头全选checkbox的选中状态
		if(this.showTitle){
			this.headComp.each(function(el){
				var input = el.child("input", true);
				if(input){
					input.checked = false;
				}
			});
		}
		
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			var tr = trArray[i];
			for(var j=0;j<cm.length;j++){
				var cf = cm[j];
				var td = tr.children[cf.index];
				if(!td){
					continue;
				}
				if(cf.coltype=="checkbox"){
					this.dealCheckbox(cf,td,"scan");
				}else if(cf.coltype=="radio"){
					this.dealRadio(cf,td);
				}
			}
		}
	},
	
	/**
	 * 得到指定列的值，不带引号
	 */
	getValues: function(colName){
		var va = this.getValuesArray(colName);
		return va.join(",");
	},
    
    getValue:function(colName){      
        var vj = this.getSelectedRowJson();
        if(vj==null){
            return null;
        }
        return Ext.encode(vj[colName]);       
    },
    getRowValue:function(){
        var vj = this.getSelectedRowJson();
        if(vj==null){
            return null;
        }
        return Ext.encode(vj);       
    },
	/**
	 *判断是否存在指定列
	 */
	hasColumn: function(colName){
		var cf = this.getColConf(colName);
		return cf ? true : false;
	},
	/**
	 * 得到指定列的值数组
	 */
	getValuesArray: function(colName){
		var cf = this.getColConf(colName);
		if(!cf){
			Artery.showError("找不到指定的列名称：" + colName);
			return [];
		}
		colName = cf.dataIndex;
		//colName = cf.id;
		if(cf.coltype=="data"){
			return this.getPageValues(colName, "array");
		}else if(cf.coltype=="checkbox"){
			return cf.select.keys.concat();
		}else if(cf.coltype=="radio"){
			return cf.select?[cf.select]:[];
		}else if(cf.coltype=="onlydata"){
			return this.getPageValues(colName, "array");
		}
	},
	
	/**
	 * 得到指定列的值，带引号
	 */
	getValuesQuote: function(colName){
		var va = this.getValuesArray(colName);
		var sb = [];
		for (var i = 0; i < va.length; i++) {
			sb.push("'" + va[i] + "'");
		}
		return sb.join(',');
	},
	
	getCellByValue: function(colName,value){
		var cells = this.getCells(colName);
		for(var i=0;i< cells.length;i++){
			if(this.isValidCell(cells[i],value)){
				return cells[i];
			}
		}
	},
	
	isValidCell : function(cell,value){
		var fd = Ext.fly(cell).child(".f_value", true);
		if(fd && fd.innerHTML){
			if(fd.innerHTML == value){
				return true;
			}
		}
		
		var cell = Ext.fly(cell).child(".sl-data-cell", true);
		if(!cell){
			return false;
		}
		var firstNode = cell.childNodes[0];
		if(firstNode.nodeType==3){ // TextNode节点
			if(firstNode.data == value){
				return true;
			}
		}else if(firstNode.nodeType==1){
			if(firstNode.innerHTML == value){
				return true;
			}
		}
		return false;
	},
	
	getCells: function(colName){
		var cf = this.getColConf(colName);
		if(!cf){
			return null;
		}
		colName = cf.id;
		var trArray = this.getDataRows();
		var va = [];
		for(var i=0;i<trArray.length;i++){
			var td = trArray[i].children[cf.index];
			va.push(td);
		}
		return va;
	},
	
	getTrByColValue: function(colName,value){
		var cf = this.getColConf(colName);
		if(!cf){
			return null;
		}
		colName = cf.id;
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			if(cf.coltype == 'onlydata'){
				var cell = Ext.fly(trArray[i]).child('span[colId='+colName+']',true);
				if(cell && cell.innerHTML == value){
					return trArray[i];
				}
			}else{
				var cell = trArray[i].children[cf.index];
				if(this.isValidCell(cell,value)){
					return trArray[i];
				}
			}
		}
	},
	
	getFirstTr: function(){
		var rows = this.getDataRows();
		if(rows == null || rows.length == 0){
			return null;
		}
		return rows[0];
	},
	
	getLastTr: function(){
		var rows = this.getDataRows();
		if(rows == null || rows.length == 0){
			return null;
		}
		return rows[rows.length-1];
	},
	
	/**
	 * 获得本页的值，只能应用于数据列
	 * @param returnType 返回类型，为array，则返回数据，为string，则返回字符串
	 */
	getPageValues: function(colName, returnType){
		var cf = this.getColConf(colName);
		if(!cf){
			Artery.showError("找不到指定的列名称：" + colName);
			if(returnType==="array"){
				return [];
			}else{
				return "";
			}
		}
		colName = cf.dataIndex;
//		colName = cf.id;
		var trArray = this.getDataRows();
		var va = [];
		for(var i=0;i<trArray.length;i++){
			if(cf.coltype=="onlydata"){
				var otd = Ext.fly(trArray[i]).child(".sl-data-onlydata", true);
				if(otd){
					for(var ti=0;ti<otd.children.length;ti++){
						var colId = otd.children[ti].getAttribute("colId");
						if(colId==colName){
							va.push(otd.children[ti].innerHTML);
						}
					}
				}
			}else{
				var td = trArray[i].children[cf.index];
				if (td != undefined) {
					var fd = Ext.fly(td).child(".f_value", true);
					if(fd && fd.innerHTML){
						va.push(fd.innerHTML);
					}else{
						var cell = Ext.fly(td).child(".sl-data-cell", true);
						if(!cell){
							continue;
						}
						var firstNode = cell.childNodes[0];
						if(firstNode.nodeType==3){ // TextNode节点
							if(firstNode.data==String.fromCharCode(160))
								va.push("");
							else
								va.push(firstNode.data);
						}else if(firstNode.nodeType==1){
							va.push(firstNode.innerHTML);
						}
					}
				}
				
			}
		}
		if(returnType==="array"){
			return va;
		}else{
			return va.join(",");
		}
	},
	/**
	 * 设置列表的列标题
	 * @param colName 列名称
	 * @param title 标题
	 */
	setTitle: function(colName,title){
		var colEl = this.headEl.child('[colId='+colName+']');
		if(colEl){
			colEl.update(title);
		}
	},
	/**
	 * 本方法只适用于checkbox和radio列
	 * @param colName 列名称
	 * @param values 要设置单元格对应的值，可为单独一个值或一个数组
	 * @param check 当为true时为选中，否则为取消选中
	 */
	changeCheck: function(colName,values,check){
		var cf = this.getColConf(colName);
		if(cf.coltype!="checkbox" && cf.coltype!="radio"){
			return;
		}
		var o = [];
		if(!Ext.isArray(values)){
			o[values] = 'true';
		}else{
			for(var i in values){
				o[values[i]]='true';
			}
		}
		Ext.select("span[colId="+colName+"]",true,this.el.dom).each(function(item){
			var el = item.child('.f_value');
			var input = item.child('input');
			if(el && o[el.dom.innerHTML]=='true'){
				if((check && !input.dom.checked) || (!check && input.dom.checked)){
					item.child('input').dom.click();
				}
			}
		},this);
	},
	
	/**
	 * 设置本行指定列的值(用于onClick，onChange事件中设置值）
	 * @param colName 列名称
	 * @param value 值
	 * @param valueText 显示值
	 */
	setValue: function(colName, value, valueText){
		if(this.selectedRow){
			var cf = this.getColConf(colName);
			if(!cf){
				Artery.showError("找不到指定的列名称：" + colName);
				return ;
			}
			colName = cf.id;
			var td = this.selectedRow.children[cf.index];
			var cell = Ext.fly(td).child(".sl-data-cell", true);
			var vdiv = Ext.fly(td).child(".f_value", true);
			if(cf.coltype=="checkbox"){
				if(vdiv){
					vdiv.innerHTML = value;
				}
			}else if(cf.coltype=="radio"){
				if(vdiv){
					vdiv.innerHTML = value;
				}
			}else{
				if(vdiv){
					vdiv.innerHTML = value;
					if(valueText!==undefined){
						var firstNode = cell.childNodes[0];
						if(firstNode.nodeType==3){
							firstNode.data = valueText;
						}else{
							firstNode.innerHTML = valueText;
						}
					}
				}else{
					var firstNode = cell.childNodes[0];
					if(firstNode.nodeType==3){
						firstNode.data = value;
					}else{
						firstNode.innerHTML = value;
					}
				}
			}
		}
	},
	
	/**
	 * 获得取消选中的值，只能应用于checkbox列
	 */
	getDeselectValues: function(colName){
		var va = this.getDeselectValuesArray(colName);
		return va.join(",");
	},
	
	/**
	 * 获得取消选中的值，只能应用于checkbox列
	 */
	getDeselectValuesQuote: function(colName){
		var va = this.getDeselectValuesArray(colName);
		var sb = [];
		for (var i = 0; i < va.length; i++) {
			sb.push("'" + va[i] + "'");
		}
		return sb.join(',');
	},
	
	/**
	 * 获得取消选中的数组，只能应用于checkbox列
	 */
	getDeselectValuesArray: function(colName){		
		
		var p = this.getColConf(colName);
		if(p == null){
			//Artery.showError("找不到指定的列名称：" + colName);
			return undefined;
		}
		if(p.coltype!="checkbox" && p.coltype!="radio"){
			//Artery.showError("指定的列："+ colName + "不是checkbox列!");
			return undefined;
		}
		var valarray = [];
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			var tr = trArray[i];
			var td = tr.children[p.index];
			var val = Ext.fly(td).child(".f_value", true).innerHTML;
			if(p.coltype=="checkbox"){
				if(!p.select.containsKey(val)){
					valarray.push(val);
				}
			}else if(p.coltype=="radio"){
				if(!p.select==val){
					valarray.push(val);
				}
			}
		}
		return valarray;
	},
	
	/**
	 * 获得列配置信息
	 */
	getColConf: function(colName){
		for(var i=0;i<this.columns.length;i++){
			if(this.columns[i].dataIndex==colName || Artery.getEventId(this.columns[i].dataIndex) == colName){
				return this.columns[i];
			}
		}
		return null;
	},
	
	/**
	 * 获得列序号，包括序号列的位置
	 */
	getColIndex: function(colName){
		var cf = this.getColConf(colName);
		if(cf){
			return cf.index;
		}else{
			return -1;
		}
	},
	
	/**
	 * 选中指定列的所有checkbox
	 * @param colName 列名称
	 * @param head 为false时，不处理表头的checkbox
	 */
	selectAllCheckbox: function(colName, head){
		var cf = this.getColConf(colName);
		if(cf.coltype!="checkbox"){
			return ;
		}
		colName = cf.id;
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			var td = trArray[i].children[cf.index];
			if(!td){
				continue;
			}
			var input = Ext.fly(td).child("input", true);
			if(!input){
				continue;
			}
			if(!input.checked && !input.disabled){
				input.checked = true;
				this.dealCheckbox(cf,td,"click");
			}
		}
		// 选中表头的checkbox
		if(head!==false && this.showTitle){
			this.headComp.each(function(el){
				var ci = el.dom.getAttribute("colId");
				if(ci==cf.dataIndex){
					var input = el.child("input", true);
					if(input){
						input.checked = true;
					}
				}
			});
		}
	},
	
	/**
	 * 取消指定列的所有checkbox
	 * @param colName 列名称
	 * @param head 为false时，不处理表头的checkbox
	 */
	deselectAllCheckbox: function(colName, head){
		var cf = this.getColConf(colName);
		if(cf.coltype!="checkbox" && cf.coltype!="radio"){
			return ;
		}
		colName = cf.id;
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			var td = trArray[i].children[cf.index];
			if(!td){
				continue;
			}
			var input = Ext.fly(td).child("input", true);
			if(!input){
				continue;
			}
			if(input.checked){
				input.checked = false;
				this.dealCheckbox(cf,td,"click");
			}
		}
		// 取消表头的checkbox
		if(head!==false && this.showTitle){
			this.headComp.each(function(el){
				var ci = el.dom.getAttribute("colId");
				if(ci==cf.dataIndex){
					var input = el.child("input", true);
					if(input){
						input.checked = false;
					}
				}
			});
		}
	},
	
	/**
	 * 得到选择单元格的值
	 */
	getSelectedCellValue: function(){
		if(!this.selectedCell){
			return null;
		}
		var fd = Ext.fly(this.selectedCell).child(".f_value", true);
		if(fd){
			return fd.innerHTML;
		}else{
			var cell = Ext.fly(this.selectedCell).child(".sl-data-cell", true);
			if(cell){
				var firstNode = cell.childNodes[0];
				if(!firstNode){
					return null;
				}else if(firstNode.nodeType==3){ // TextNode节点
					return firstNode.data;
				}else if(firstNode.nodeType==1 ){
					return firstNode.innerHTML;
				}
			}
		}
		return null;
	},
	
	/**
	 * 得到选择的行的单元格的值
	 */
	getSelectedRowValue: function(){
		var vj = this.getSelectedRowJson();
		if(vj==null){
			return null;
		}
		return Ext.encode(vj);
	},
	
	/**
	 * 得到选中行的值对象
	 */
	getSelectedRowJson: function(){
		if(!this.selectedRow){
			return null;
		}
		return this.getRowValueInner(this.selectedRow);
	},
	
	// private 从tr中提取一行中的数据
	getRowValueInner: function(rowTr){
		var o = {};
		var ca = Ext.query(".sl-data-cell", rowTr);
		for(var i=0;i<ca.length;i++){
			var colId = ca[i].getAttribute("colId");
			var val = Ext.fly(ca[i]).child(".f_value", true);
            var firstNode = ca[i].childNodes[0];
			if(val){         
                if(firstNode.nodeType==3){
                	var innerHtml=this.trimNBSP(val.innerHTML);
                	var data=this.trimNBSP(firstNode.data);
                    o[colId] = {"value":innerHtml,"valueText":data};
                }else{
                    o[colId]=this.trimNBSP(val.innerHTML);
                }
				
			}else{
				if (this.hasOnClickSubNode(ca[i])) {
					var cn = ca[i].children;
					var sb = "";
					for (var j = 0; j < cn.length; j++) {
						sb += this.trimNBSP(this.getNodeValue(cn[j]));
					}
					o[colId] = sb;

				}else{
					o[colId] = this.trimNBSP(ca[i].innerText);
				}
			}
		}
		// 获得数据项列
		var otd = Ext.fly(rowTr).child(".sl-data-onlydata", true);
		if(otd){
			for(var ti=0;ti<otd.children.length;ti++){
				var colId = otd.children[ti].getAttribute("colId");
				o[colId] = this.trimNBSP(otd.children[ti].innerHTML);
			}
		}
		return o;
	},
	//判断该列有没有点击时脚本
	hasOnClickSubNode : function(node) {
		var nodeInnerHTML=node.innerHTML;
		var index=nodeInnerHTML.indexOf('sl-onclick')
		if (index != -1) {
			return true;
		}
		return false;
	},
	getNodeValue : function(node) {
		if (!node) {
			return "";
		} else if (node.nodeType == 3) { // TextNode节点
			return node.data;
		} else if (node.nodeType == 1) {
			if (Ext.fly(node).hasClass('sl-onclick')) {
				return "";
			}
			return node.innerText;
		}
	},
	/**
	 * 如果值为 "&nbsp"，则将其转换为“”
	 */
	trimNBSP : function (str){
		if(str==" "){
			str="";
		}
		return str;
	},
	/**
	 * 得到checkbox选定的行数据
	 */
	getCheckedRowValue: function(colName){
		var val = this.getCheckedRowJson(colName);
		if(Ext.isEmpty(val)){
			return val;
		}
		return Ext.encode(val)
	},
	
	/**
	 * 得到checkbox选定的行数据，json形式
	 */
	getCheckedRowJson: function(colName){
		var p = this.getColConf(colName);
		if(p == null){
			//Artery.showError("找不到指定的列名称：" + colName);
			return undefined;
		}
		if(p.coltype!="checkbox" && p.coltype!="radio"){
			//Artery.showError("指定的列："+ colName + "不是checkbox列!");
			return undefined;
		}
		var valarray = [];
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			var tr = trArray[i];
			var td = tr.children[p.index];
			var input = Ext.fly(td).child("input", true);
			if(p.coltype=="checkbox" || p.coltype=="radio"){
				if(input.checked){
					valarray.push(this.getRowValueInner(tr));
				}
			}
		}
		return valarray;
	},
	
	getDataRows: function(){
		var trArray = this.tbodyEl.dom.rows;
		if(trArray == null || trArray.length == 0){
			return [];
		}
		var arr = [];
		var length = trArray.length;
		for(var i=0;i<length;i++){
			if(Ext.fly(trArray[i]).hasClass('sl-data-row')){
				arr.push(trArray[i]);
			}
		}
		return arr;
	},
	
	/**
	 * 得到所有的数据
	 */
	getAllValues: function(){
		return Ext.encode(this.getAllValuesJson());
	},
	
	/**
	 * 得到所有的数据
	 */
	getAllValuesJson: function(){
		var valarray = [];
		var trArray = this.getDataRows();
		for(var i=0;i<trArray.length;i++){
			valarray.push(this.getRowValueInner(trArray[i]));
		}
		return valarray;
	},
	
	//得到添加的行模板
	getRowTpl: function(o){
		if(this.rowTpl == null){
			this.createRowTpl(o);	
		}
		return this.rowTpl;
	},
	
	//创建行模板
	createRowTpl: function(o){
		Artery.runLogic({
			params:{
				itemid:Artery.getEventId(this),
				method:'parseRowTpl',
				listId:this.id,
				formid:Artery.getFormId(this)
			},
			callback:function(result){
				this.rowTpl = result;
			},
			syn:false,
			scope:this
		});
	},
	
	insertRecord: function(o){
		var tds=Ext.select(".sl-container-empty-data-text",this.el);
		if(tds.first() != null){
	        tds.first().parent('.sl-container').removeClass('sl-container-empty-data');
	        tds.first().parent().remove();
		}
        var listAreaId = this.id;       
		var table = this.tbodyEl.dom;
		var rowTpl = this.getRowTpl(o);
		Ext.DomHelper.insertHtml('beforeEnd',table,rowTpl);
		var row = table.rows[table.rows.length-1];
		Ext.select('.sl-data-cell',false,row).each(function(el,comp,idx){
			var colId = el.getAttribute("colId");
			if(colId && o[colId]){
				var span = el.dom;
				var value = o[colId];
				if(Ext.isObject(value)){
					var text = document.createTextNode(value.valueText)
					span.appendChild(text);
					var hiddenText = document.createElement('div');
					hiddenText.className = 'f_value';
					hiddenText.innerHTML = value.value;
					span.appendChild(hiddenText);
				}else{
					span.innerHTML = value;
				}
			}
		},this)
		this.refreshNumber();
		this.refreshStripeColor();
		var pagingbar = Artery.get(this.id+"_pagingBar"); 
    	if(pagingbar && pagingbar.updatePageNumber){
    		pagingbar.updatePageNumber(1);
    	}
	},
	deleteRecord: function(colName,value){
		if(colName == null){
			if(!this.selectedRow){
				return;
			}
			var table = this.containerEl.dom;
			var rows = table.rows;
			var len = rows.length;
			for(var i=0;i<len;i++){
				if(rows[i] == this.selectedRow){
					table.deleteRow(i);
					this.selectedRow == null;
					this.refreshNumber();
					this.refreshStripeColor();
					var pagingbar = Artery.get(this.id+"_pagingBar");
			    	if(pagingbar && pagingbar.updatePageNumber){
			    		pagingbar.updatePageNumber(-1);
			    	}
			    	this.checkEmptyTip();
					return;
				}
			}
		}else{
			var values = this.getValuesArray(colName);
			var len = values.length;
			var idx = -1;
			for(var i=0;i<len;i++){
				if(values[i] == value){
					idx = i;
				}
			}
			if(idx != -1){
				var table = this.containerEl.dom;
				table.deleteRow(idx);
				this.refreshNumber();
				this.refreshStripeColor();
		    	if(Artery.get(this.id+"_pagingBar")){
		    		Artery.get(this.id+"_pagingBar").updatePageNumber(-1);
		    	}
			}
		}
	},	
	refreshNumber: function(){
		if(!this.isShowRowNumber){
			return;
		}
		var nums = this.getDataRows();
		var length = nums.length;
		for(var i=0;i< length;i++){
			nums[i].cells[0].innerText = i+1;
		}
	},
	refreshStripeColor : function() {
		if (!this.stripeRows) {
			return;
		}
		var rows = this.getDataRows();
		var length = rows.length;
		for (var i = 0; i < length; i++) {
			var className = "sl-data-row";
			if (i == 0) {
				className += " sl-data-row-first";
			} else if (i == length - 1) {
				className += " sl-data-row-last";
			}
			if (i % 2 == 1) {
				className += " sl-data-row-stripe";
			}
			rows[i].className=className;
		}
	},
	checkEmptyTip:function(){
		var table = this.tbodyEl.dom;
		var len = table.rows.length;
		if(len==0){
			this.containerEl.addClass('sl-container-empty-data');
			var Tip={
				tag: "tr",
				children:{
						tag:"td",
						cls:"sl-container-empty-data-text",
						colSpan:100,
						html:this.emptyDataTip
					}
			}
			Ext.DomHelper.createDom(Tip,table);
		}
	},
	clear: function(){
		var table = this.tbodyEl.dom;
		var len = table.rows.length;
		for(var i=0;i<len;i++){
			table.deleteRow();
		}
		this.checkEmptyTip();
	},
	setColHidden: function(colName,hidden){
		var length = this.colGroup.length;
		var i=0;
		while(i<length){
			if(this.colGroup[i].id == colName){
				break;
			}
			i++
		}
		if(this.colGroup[i].id == colName){
			this.hiddenColByIdx(i,Ext.isTrue(hidden)?'none':'');
			this.colGroup[i].hidden = Ext.isTrue(hidden);
			this.refreshColGroup();
		}
	},
	hiddenColByIdx:function(idx,hidden){
		this.headEl.dom.rows[0].cells[idx].style.display=hidden;
		
		var rows = this.getDataRows();
		var rowLength = rows.length;
		for(var i=0;i<rowLength;i++){
			var cells = rows[i].cells;
			cells[idx].style.display = hidden;
		}
	},
		
	refreshColGroup: function(){
		var length = this.colGroup.length;
		for(var i=0;i<length;i++){
			Ext.fly(this.colGroup[i]).remove();
			if(!this.colGroup[i].hidden){
				this.colGroupEl.appendChild(this.colGroup[i]);
			}
		}
	},
	
	hideCol:function(colId,repaint){
		Ext.get(colId).setStyle("display","none");
		Ext.get("td_header_"+colId).setStyle("z-index","-1");
		if(repaint==undefined || repaint){
			this.repaint();
		}	
	},
	
	showCol:function(colId,repaint){
		Ext.get(colId).setStyle("display","block");
		Ext.get("td_header_"+colId).setStyle("z-index","0");
		if(repaint==undefined || repaint){
			this.repaint();
		}	
	},
	
	repaint:function(){
		if(this.tbodyEl){
			var tbodyid = this.tbodyEl;
			var tbody = Ext.get(tbodyid);
			var tmpDom = tbody.dom;
			tbody.clean(true);
			tbody.appendChild(tmpDom);
		}
	}
});
Ext.reg('apSampleList', Artery.plugin.SampleList);



function ddd(){
	
}
// 操作单击事件
Artery.operClick = function(d, listId){
	d = d.parentNode;
	Artery.plugin.SampleList.setSelectObj(d, listId);
	var operId = d.getAttribute("operId");
	var colId = d.getAttribute("colId");
	var colConf = Artery.get(listId).getColConf(colId);
	var operConf = null;
	if(colConf.operMap){
		Ext.each(colConf.operMap,function(item){
			for(name in item){
				if(name == operId || Artery.getEventId(name)==operId){
					operConf = item[name];
					break;
				}
			}
		});
	}
	d.listId = listId;
	var evalEvent = Artery.plugin.SampleList.onDomClick(d, operConf, "onClickServer");
	if(evalEvent && event){
		Ext.lib.Event.stopPropagation(event);
	}
};

// cellTd的单击事件，operTextClick和cellClick事件会阻止本方法的调用
Artery.cellTdClick = function(d, listId){
	Artery.get(listId).selectedCell = d;
}

// 单元格单击事件
Artery.cellClick = function(cellData, listId){
	Artery.plugin.SampleList.setSelectObj(cellData, listId);
	var colId = cellData.getAttribute("colId");
	cellData.listId =  listId;
	var itemConf = Artery.get(listId).getColConf(colId);
	var evalEvent = Artery.plugin.SampleList.onDomClick(cellData, itemConf, "onClickServer");
	if(evalEvent && event){
		Ext.lib.Event.stopPropagation(event);
	}
}

// checkbox或radio单击事件
Artery.checkClick = function(d, listId, type){
	var listComp = Artery.get(listId);
	var cf = listComp.getColConf(d.getAttribute("colId"));
	if(type=="checkbox"){
		listComp.sureHeadCheckboxStatus(cf);
		listComp.dealCheckbox(cf, d, "click");
	}else if(type=="radio"){
		listComp.dealRadio(cf, d);
	}
	// 执行cell单击事件
	Artery.cellClick(d, listId);
	Ext.lib.Event.stopPropagation(event);
}

// 行单击事件
Artery.rowClick = function(d, listId, haveEvent){
	var selectedRow = Artery.get(listId).selectedRow;
	Artery.get(listId).changeSelectedRow(d);
	if(haveEvent){
		var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
		if(tdDom){
			tdDom.listId = listId;
			Artery.plugin.SampleList.onDomClick(tdDom, Artery.get(listId), "onClickSingleServer");
		}
	}
	//onSelect
	Artery.rowSelect(d,listId,selectedRow);
}

//选中事件
Artery.rowSelect = function(d, listId,selectedRow){
	var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
	if(!tdDom){
		return ;
	}
	// 选中事件
	var clickDom = Ext.fly(tdDom).down(".sl-rowSelect",true);
	if(clickDom!=null){
		var listItem = Artery.get(listId);
		var rc = Artery.createCaller(listItem, "onSelectServer",Artery.getFormId(listItem));
		eval("var fn = function(){"
				+ clickDom.innerHTML + "\n}");
		fn.call(Artery.get(listId));
	}
	if(selectedRow){
		Artery.rowDeselect(selectedRow,listId);
	}
}

//取消选中事件
Artery.rowDeselect = function(d, listId){
	var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
	if(!tdDom){
		return ;
	}
	// 取消选中事件
	var clickDom = Ext.fly(tdDom).down(".sl-rowDeselect",true);
	if(clickDom!=null){
		var listItem = Artery.get(listId);
		var rc = Artery.createCaller(listItem, "onDeselectServer",Artery.getFormId(listItem));
		eval("var fn = function(){"
				+ clickDom.innerHTML + "\n}");
		fn.call(Artery.get(listId));
	}
}

// 行双击事件
Artery.rowDblClick = function(d, listId){
	var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
	if(!tdDom){
		return ;
	}
	// 链接到事件
	var linktoDom = Ext.fly(tdDom).down(".sl-dblinkto",true);
	if(linktoDom!=null){
		var linktoObj = Ext.decode(linktoDom.innerHTML);
		Artery.openForm(linktoObj);
	}
	// 单击事件
	var clickDom = Ext.fly(tdDom).down(".sl-dbclick",true);
	if(clickDom!=null){
		var listItem = Artery.get(listId);
		var rc = Artery.createCaller(listItem, "onClickDoubleServer",Artery.getFormId(listItem));
		eval("var fn = function(){"
				+ clickDom.innerHTML + "\n}");
		fn.call(Artery.get(listId));
	}
}
// 鼠标移上时脚本
Artery.rowMouseOver = function(d, listId){
	var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
	if(!tdDom){
		return ;
	}
	// 链接到事件
	var mouseOverDom = Ext.fly(tdDom).down(".sl-mouseOver",true);
	if(mouseOverDom!=null){
		var listItem = Artery.get(listId);
		var rc = Artery.createCaller(listItem, "onMouseOverServer",Artery.getFormId(listItem));
		eval("var fn = function(){"
				+ mouseOverDom.innerHTML + "\n}");
		fn.call(Artery.get(listId));
	}
}
// 鼠标移出时脚本
Artery.rowMouseOut = function(d, listId){
	var tdDom = Ext.fly(d).down(".sl-data-rowEvent",true);
	if(!tdDom){
		return ;
	}
	// 链接到事件
	var mouseOutDom = Ext.fly(tdDom).down(".sl-mouseOut",true);
	if(mouseOutDom!=null){
		var listItem = Artery.get(listId);
		var rc = Artery.createCaller(listItem, "onMouseOutServer",Artery.getFormId(listItem));
		eval("var fn = function(){"
				+ mouseOutDom.innerHTML + "\n}");
		fn.call(Artery.get(listId));
	}
}

Artery.showListHeaderMenu = function(dom,colName,listId){
	var cf = Artery.get(listId).getColConf(colName);
	if(cf.menuCfg && !cf.menu){
		cf.menuCfg.minWidth=10;
		var menu = new Ext.menu.Menu(cf.menuCfg);
		cf.menu = menu;
		
	}
	cf.menu.show(Ext.get(dom),'tl-bl?');
}

// 单击事件函数
Artery.plugin.SampleList.onDomClick = function(dom, itemConf, eventName){
	var existEvent = false;
	// 链接到事件
	var linktoDom = Ext.fly(dom).down(".sl-linkto",true);
	if(linktoDom!=null){
		existEvent = true;
		var linktoObj = Ext.decode(linktoDom.innerHTML);
		Artery.openForm(linktoObj);
	}
	// 单击事件
	var clickDom = Ext.fly(dom).down(".sl-onclick",true);
	if(clickDom!=null){
		existEvent = true;
		var formId = Artery.getFormId(Artery.get(dom.listId));
		var rc = Artery.createCaller(itemConf, eventName, formId);
		// 参数列表中首先加入点击的组件的id和表单ID
		Artery.params.itemid = Artery.getEventId(itemConf);
		var tmpId = Artery.params.formid;
		Artery.params.formid = formId;
		eval("var fn = function(){"
				+ clickDom.innerHTML + "\n}");
		fn.call(Artery.get(dom.listId));
		Artery.params.formid = tmpId;
	}
	return existEvent;
}

// 设置选中的单元格和行
Artery.plugin.SampleList.setSelectObj = function(d,listId){
	var cellTd = Ext.fly(d).findParent(".sl-data-row-td", 9, false);
	if(cellTd){
		Artery.get(listId).selectedCell = cellTd;
		var rowTr = Ext.fly(d).findParent(".sl-data-row",9, false);
		if(rowTr){
			Artery.get(listId).changeSelectedRow(rowTr);
		}
	}
}


//标题分隔条
Artery.colSplits=[];
Artery.initListDragSplit = function(split,colId){
	if(Artery.colSplits[colId] != null){
		return;
	}
	Artery.colSplits[colId] = new Artery.plugin.ListSplitBar({split:split,resizeId:colId});
}

Artery.plugin.ListSplitBar = function(cfg){
	Ext.apply(this,cfg);
	this.initComponent();
}

Ext.override(Artery.plugin.ListSplitBar,{
	
	split:null,
	
	resizeId:null,
	
	initComponent:function(){
		this.splitEl = Ext.get(this.split);
		this.regionEl = Ext.get(this.resizeId);
		if(this.splitEl){
			this.splitBar = new Ext.SplitBar(this.splitEl.dom, this.regionEl, Ext.SplitBar.HORIZONTAL);
			this.splitBar.on('beforeapply',function(splitBar,newSize){
				var preEl = Ext.fly(this.getPrevCol(splitBar.resizingEl));
				var oldWidth = splitBar.resizingEl.getWidth();
				//alert(preEl.getWidth() + splitBar.resizingEl.getWidth())
				splitBar.resizingEl.setWidth(newSize);
				preEl.setWidth(preEl.getWidth() - (newSize-oldWidth));
				//alert(preEl.getWidth() + splitBar.resizingEl.getWidth())
				//this.resetColWidth();
				return false;
			},this);
		}
		
		this.containerEl = this.splitEl.parent('.sl-container');
		this.cols = this.containerEl.query('col');
	},
	getPrevCol: function(col){
		for(var i=0;i<this.cols.length;i++){
			if(this.cols[i].id == col.id){
			 	return this.cols[i-1];
			 }
		}
	},
	resetColWidth:function(){
		for(var i=0;i<this.cols.length;i++){
			this.cols[i].width=this.convertColWidth(Ext.fly(this.cols[i]).getWidth());
		}
	},
	convertColWidth:function(width){
		return parseInt((width/this.containerEl.getWidth() *100)) + '%';
	}
	
});

/**
 * 根据关键字得到列表行的tr
 * 
 * @author baon
 * @date 09/09/2010
 */
Artery.getListTrByKeyWord = function(keyWord){
	var lists = Ext.query('.sl-container');
	if(lists == null || lists.length==0){
		return null;
	}
	for(var i=0;i<lists.length;i++){
		var rows = lists[i].rows;
		var length = rows.length;
		for(var j=0;j<length;j++){
			if(rows[j].innerHTML.indexOf(keyWord) != -1){
				return rows[j];
			}
		}
	}
	return null;
}