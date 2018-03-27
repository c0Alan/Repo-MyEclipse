﻿﻿﻿// ***************************************************************************************//
// RptArea
// ***************************************************************************************//
/**
 * Artery.plugin.RptArea
 * 
 * @author baon
 * @date 02/03/2009
 * 
 */
Artery.plugin.RptArea = Ext.extend(Artery.plugin.BasePanel, {

	reportId:null,//关联的报表表单id

	extParams : null,// 额外的参数，每次清空
	
	exportExcelTypte : null,
	
	outerParams:null,//调用search方法传递的参数
	
	conditionContainer:null,
	
	resultContainer:null,
	
	pagingbarMaxPage:3000,//分页栏可输入最大记录数

	initComponent : function() {
		Artery.plugin.RptArea.superclass.initComponent.call(this);
		this.extParams = {};
		this.outerParams = {};

	},
	onRender : function(ct, position) {
		Artery.plugin.RptArea.superclass.onRender.call(this, ct, position);
		this.conditionContainer = Ext.get(this.id + "_condition_area");
		this.resultContainer = Ext.get(this.id + "_result_area");
		this.updateReport(this.reportData);

		// 定时刷新
		if (this.reportData.timeRefresh != 0) {
			this.runner = new Ext.util.TaskRunner();
			this.runner.start({
				run : this.run,
				interval : parseInt(this.reportData.timeRefresh + "000"),
				scope : this
			});
		}
	},

	// 显示隐藏条件
	toggleCondition : function() {
		
		if (this.conditionContainer.isDisplayed()) {
			this.conditionContainer.setDisplayed(false);
		} else {
			this.conditionContainer.setDisplayed(true);
		}
	},

	// 更新报表
	updateReport : function(reportData) {
		if(reportData.css){
			try{
				var css = document.getElementById("reportStyle");
				css.innerHTML=reportData.css;
			}catch(e){}
		}
		// 更新参数
		this.cacheFileId = reportData.cacheFileId;
		if(reportData.tableHtml != null){
			// 更新报表
			this.resultContainer.update(this.getBodyContent(reportData));
			Ext.select('.rpt-script').each(function(el, cmp, idx) {
				eval(el.dom.text);
			});

		}
	},

	// 得到要更新的html
	getBodyContent : function(reportData) {
		// 判断参数是否完备
		if (reportData.paramReady) {
			return reportData.tableHtml + reportData.pageHtml;
		} else {
			return "";
		}
	},

	run : function(cfg) {
		if(cfg == null || cfg.showTip !== false){
			Artery.loading();
		}
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/report/dealParse.do?action=parse",
			scope : this,
			params : this.getParams(),

			success : function(response, options) {
				var reportData = response.responseText;
				if (reportData != null) {
					reportData = Ext.decode(reportData);
				}
				if(reportData.params){
//					Artery.params.exportType=reportData.params.exportType;
					this.exportExcelTypte = reportData.params.exportType;
					Artery.params.totalCount=reportData.params.totalCount;
				}
				this.updateReport(reportData);
				if(cfg == null || cfg.showTip !== false){
					Artery.loadTrue("操作成功，请继续！");
					Ext.select('.rpt-script').each(function(el, cmp, idx) {
						window.eval(el.dom.innerHTML);
					});
				}
				if(cfg != null && cfg.callback){
					cfg.callback.call(cfg.scope?cfg.scope:this);
				}
			},
			failure : function(response, options) {
				Artery.loadFalse("操作失败，请检查！")
			}

		})
	},

	// 得到查询参数
	getParams : function() {
		var p = {};
		if(this.page){
			p.page = this.page;
		}
		if(this.pageCount){
			p.pageCount = this.pageCount;
		}
		if(this.orderName){
			p.orderName = this.orderName;
		}
		if(this.orderSort){
			p.orderSort = this.orderSort;
		}
		if(this.autoJust){
			p.autoJust = this.autoJust;
		}
		
		
		var conArea = this.conditionArea;
		Ext.apply(p,conArea != null ? conArea.getForm()
				.getValues() : {});
		
		Ext.apply(p,this.outerParams);
		
		var params = Artery.getParams(p, this);
		params.resultFormId = params.formid;
		params.formid = this.reportId;
		params.resultId = this.id;
		Ext.apply(params, this.extParams);
		this.extParams = {};
		return params;
	},

	// 设置额外的参数
	setExtParams : function(cfg) {
		Ext.apply(this.extParams, cfg);
	},

	// 查询
	search : function(cfg) {
		if(cfg){
			this.outerParams = cfg;
		}
		this.page = 1;
		this.run(cfg);
	},

	// 分页
	searchPage : function(page, pageCount, totalRecord, maxPage) {
		if(!this.isValidData(page)||!this.isValidData(pageCount)){
	        return;
	    }
		if(parseInt(page) > parseInt(maxPage)){
			alert('最大可输入的页数为' + maxPage + '页，请重新输入！');
			return;
		}
		if(parseInt(pageCount)>this.pagingbarMaxPage){
			alert('最大可输入的记录数为' + this.pagingbarMaxPage + '，请重新输入！');
			return;
		}
		this.page = page;
		this.pageCount = parseInt(pageCount);

		this.run();
	},

	// 排序
	searchOrder : function(order) {
		this.orderName = order;
		if (this.orderSort == null) {
			this.orderSort = 'desc';
		} else {
			this.orderSort = this.orderSort.toggle('asc',
					'desc');
		}

		this.run()
	},

	// 链接
	linkto : function(cfg) {
		Artery.parseWinCfg(cfg);
		// 判断打开方式
//		if (cfg.target == '_window') {
//			Artery.openForm(cfg);
//		} else {
//			Artery.getBlankWindow(cfg);
//		}
		if(!cfg.target){
			cfg.target = '_blank';
		}
		Artery.openForm(cfg);
	},

	// 重新查询
	reload : function() {
		this.run();
	},

	/***************************************************************************
	 * 自动调整 *
	 **************************************************************************/
	// 自动行高
	autoRow : function(cfg) {
		this.autoJust = "row";
		this.setExtParams({
			loadFromCache : true
		})
		this.run(cfg);
	},

	// 自动列宽
	autoCol : function(cfg) {
		this.autoJust = "col";
		this.setExtParams({
			loadFromCache : true
		})
		this.run(cfg);
	},

	// 不调整状态
	autoRecover : function(cfg) {
		this.autoJust = "no";
		this.setExtParams({
			loadFromCache : true
		})
		this.run(cfg);
	},

	/***************************************************************************
	 * 导出Excel,pdf *
	 **************************************************************************/
	// 在新窗口用控件打开Excel
	exportExcelWin : function() {
		this.exportExcel({
			exportExcelOcx : true
		})
	},
	// 在新窗口用控件打开Excel
	exportAllExcelWin : function() {
		this.exportAllExcel({
			exportExcelOcx : true
		})
	},

	// 导出本页excel
	prepareExportExcelParams : function(cfg) {
		var params = this.getTableScales();
		params.exportType = EXPORT_EXCEL;
		params.exportAction = "exportExcel";
		params.loadFromCache = true;
		if(cfg&&cfg.exportName!=null){
		    params.exportName = cfg.exportName;
		}else{
			params.exportName = this.exportName;
		}
		if (Ext.isTrue(Artery.params.exportExcelOcx)) {
			params.exportExcelOcx = true;
		}
		if (cfg) {
			Ext.apply(params, cfg);
		}
		this.setExtParams(params);
	},
	// 导出本页excel{exportName:'xxx',multi:['rptid','rptid']}
	exportExcel : function(cfg) {
		this.prepareExportExcelParams(cfg);
		var exp=[];
		if(cfg && cfg.multi){
			var length = cfg.multi.length;
			for(var i=0;i<length;i++){
				Artery.get(cfg.multi[i]).prepareExportExcelParams();
				var params = Artery.get(cfg.multi[i]).getParams();
				exp.push(params);
			}
			this.extParams.multiExport=Artery.escape(Ext.encode(exp));
		}
		this._export(cfg);
	},

	// 导出全部excel
	exportAllExcel : function(cfg) {
		var params = this.getTableScales();
		params.page = 1;
		params.pageCount = 0;
		params.exportAll = true;
		params.exportAction = "exportExcel";
		if(cfg&&cfg.exportName!=null){
		    params.exportName = cfg.exportName;
		}else{
			params.exportName = this.exportName;
		}
		if (Ext.isTrue(Artery.params.exportExcelOcx)) {
			params.exportExcelOcx = true;
		}
		if (cfg) {
			Ext.apply(params, cfg);
		}
		this.setExtParams(params)

		this._export(cfg);
	},

	// 导出本页pdf
	exportPdf : function(cfg) {
		var params = this.getTableScales();
		params.exportType = EXPORT_PDF;
		params.exportAction = "exportPdf";
		params.loadFromCache = true;
		if(cfg&&cfg.exportName!=null){
		    params.exportName = cfg.exportName;
		}else{
			params.exportName = this.exportName;
		}
		this.setExtParams(params)

		this._export(cfg);
	},

	// 导出全部pdf
	exportAllPdf : function(cfg) {
		var params = this.getTableScales();
		params.exportType = EXPORT_PDF;
		params.page = 1;
		params.pageCount = 0;
		params.exportAll = true;
		params.exportAction = "exportPdf";
		if(cfg&&cfg.exportName!=null){
		    params.exportName = cfg.exportName;
		}else{
			params.exportName = this.exportName;
		}
		this.setExtParams(params)

		this._export(cfg);
	},
	exportFusImg : function(cfg) {
		
		Ext.select('.FusionCharts',false,this.el.dom).each(function(el, cmp, idx) {
			var movie = document.getElementById(el.dom.id);
			if(movie) {
				if (movie.hasRendered()) {
					movie.exportChart();
				}
			}
		});
		if(cfg&&cfg.multi){
			var length = cfg.multi.length;
			for(var i=0;i<length;i++){
				var fusimg =Artery.get(cfg.multi[i]);
				Ext.select('.FusionCharts',false,fusimg.el.dom).each(function(el, cmp, idx) {
					var movie1 = document.getElementById(el.dom.id);
//					window.location.hash="#"+el.dom.id;
					if(movie1) {
						if (movie1.hasRendered()) {
							movie1.exportChart();
						}
					}
				});
				
			}
		}
	},
	_export : function(cfg) {
		this.exportFusImg();
		if (!this.isConditionValid()) {
			return;
		}
		var params = this.getParams();
		Ext.apply(params,this.param);
		if(Ext.isEmpty(params.tdScales)){
			return;
		}
		Artery.loading();
		var form = Ext.getDom("arteryCommForm");
		form.innerHTML = "";
//		var html = '<input type=hidden name="{0}" value="{1}">';
//		var tpl = new Ext.DomHelper.createTemplate(html);
//		tpl.compile();
//		for(var i in params){
//			tpl.append("arteryCommForm",[i,params[i]]);
//		}
//		form.method = 'post';
//		form.submit();
		
		form.action = sys.getContextPath() + "/artery/report/dealParse.do?action="+params.exportAction;
		if(params.exportNormal){
			form.action =form.action+"&"+"dataType="+params.exportNormal;
		}
//		this.container.mask("正在导出数据...");
		var guid = function() {
		    function S4() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    }
		    return (S4()+S4()+"_"+S4()+"_"+S4()+"_"+S4()+"_"+S4()+S4()+S4());
		} 
		params.taskid=guid();
		
		var iCount=0;
		if(this.exportExcelTypte){
			params.exportType = this.exportExcelTypte;
		}
		Artery.request({
				url : form.action,
				params : params,
				scope : this,
				form : form,
				success : function(response, options) {
	//				this.container.unmask();
					Artery.loadTrue("生成导出文件完毕，准备下载");
					var res = Ext.decode(response.responseText);
					if(res.tempFile){
						window.location =  sys.getContextPath() + "/artery/form/dealParse.do" + "?action=download&nameencrypt=1&file="+res.tempFile+"&folder="+res.folder+"&random="+Math.random();
						clearInterval(iCount);
					}else{
						alert("导出文件失败");
					}
				}
			});
		if(params.exportType == EXPORT_CSV||params.exportType == EXPORT_XLS){
				iCount = setInterval(function(){
				params.state = "downloadstate";
				Artery.request({
					url : form.action,
					params : params,
					scope : this,
					form : form,
					success : function(response, options) {
						var res = Ext.decode(response.responseText);
						if(res.taskid){
							Artery.loadTrue("正在生成导出文件，已完成"+res.per);
						}
					}
				});
			}, 2000);
			
		}
	},

	// 得到TableScales
	getTableScales : function() {
		var tr = Ext.select('.reportTabLastTr',true,this.body.dom).first().dom;
		if (tr == null) {
			return {};
		}
		// tdScales
		var tdScales = new StringBuffer();
		var cells = tr.cells;
		for (var i = 0; i < cells.length; i++) {
			if (i != 0) {
				tdScales.append(",");
			}
			tdScales.append(cells[i].clientWidth);
		}

		// trScales
		var table = Ext.select(".reportTable",true,this.body.dom).first().dom;
		var trScales = new StringBuffer();
		var trs = table.rows;
		for (var i = 0; i < trs.length - 1; i++) {
			if (i != 0) {
				trScales.append(",");
			}
			trScales.append(trs[i].clientHeight);
		}

		return {
			tdScales : tdScales.toString(),
			trScales : trScales.toString(),
			tableWidth : table.clientWidth,
			tableHeight : table.clientHeight
		};
	},

	/***************************************************************************
	 * 打印 *
	 **************************************************************************/
	_print : function() {
		window.resultId = this.id;
		var sUrl = sys.getContextPath() + "/artery/report/parse/print.jsp";
		var win = Artery.open({
			name : 'print'
		})
		win.location.href = sUrl;
		win.focus();
	},
	// 打印本页cfg:{multi:['rptid','rptid']}
	print : function(cfg) {
		window.printType = 'print';
		window.multi=null;
		if(cfg && cfg.multi){
			window.multi=cfg.multi;
		}
		this._print();
	},

	// 打印全部
	printAll : function() {
		window.printType = 'printAll';
		this.setExtParams({
			page : 1,
			pageCount : 0
		})
		this._print();
	},

	// 打印全部分页
	printAllPage : function() {
		window.printType = 'printAllPage';
		this.setExtParams({
			page : 1,
			printAllPage : true
		})
		this._print();
	},

	/***************************************************************************
	 * 其它方法 *
	 **************************************************************************/
	// 业务口径解释
	showComment : function() {
		var commentWin = Artery.open({
			name : 'commentWin',
			feature : {
				height : 400,
				width : 500
			}
		});
		var doc = commentWin.document;
		doc.open();
		doc.write(this.reportData.comment);
		commentWin.focus();
	},
	//验证输入是否有效
	isValidData:function(eValue) {
        if (isNaN(eValue)) {
	        alert('请输入数字！');
	        return false;
        }
        if (eValue % 1 != 0) {
	        alert('请输入整数！');
	        return false;
        }
        if (eValue < 1) {
	        alert('您输入的数字不能小于1，请重新输入！');
	        return false;
        }
        return true;
    }
})

// register xtype
Ext.reg('aprptarea', Artery.plugin.RptArea);