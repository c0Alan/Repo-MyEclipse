﻿// 页面初始化
Ext.onReady(function() {
			Ext.QuickTips.init();
			Ext.apply(Ext.QuickTips.getQuickTip(), {
						showDelay : 0,
						hideDelay : 0
					});
			// 解析布局
			parseLayout();

			// 解析打印
			parsePrint();
		});
var toolbar;
// 解析布局
function parseLayout() {
	toolbar = new Ext.Toolbar({
				renderTo : 'toolbarDiv',

				items : [' ', {
							text : '页面设置',
							cls : 'x-btn-text-icon print',
							handler : function() {
								wb.execwb(8, 1);
							}
						}, ' ', {
							text : '打印预览',
							cls : 'x-btn-text-icon print',
							handler : function() {
								toolbar.hide();
								wb.execwb(7, 1);
								toolbar.show();
							}
						}, ' ', {
							text : '打印',
							cls : 'x-btn-text-icon print',
							handler : function() {
								toolbar.hide();
								window.print();
								toolbar.show();
							}
						}, '-', {
							text : '显示/隐藏分页栏',
							id : 'hidePageBtn',
							cls : 'x-btn-text-icon hidePage',
							handler : function() {
								Ext.select('.reportPageCls').each(function(el) {
											if (el.isDisplayed()) {
												el.setDisplayed(false);
											} else {
												el.setDisplayed(true);
											}
										})
							}
						}, '-', {
							text : '关闭',
							cls : 'x-btn-text-icon close',
							handler : function() {
								wb.ExecWB(45, 1)
							}
						}]
			})
}

// 解析打印
function parsePrint() {
	var resultArea = opener.Artery.get(opener.resultId);
	if (opener.printType == 'print') {
		if (resultArea.resultContainer) {
			updateReport(resultArea.resultContainer.dom.innerHTML);
		} else {
			updateReport(resultArea.el.dom.innerHTML);
		}
		if(opener.multi){
			var length = opener.multi.length;
			for(var i=0;i<length;i++){
				appendReport(opener.Artery.get(opener.multi[i]).resultContainer.dom.innerHTML);
			}
		}
	} else {
		run();
	}

	if (resultArea) {
		setPringCfg(resultArea);
	}
	
	Ext.select('.FusionCharts').each(function(el, cmp, idx) {
		var movie = el.dom;
		if(movie) {
			movie.Play();
		}
	})
}

// 打印设置
function setPringCfg(ra) {
	if(!factory.printing){
		return;
	}
	if (ra.portrait !== undefined) {
		if (ra.portrait == "纵向") {
			factory.printing.portrait = true;
		} else if (ra.portrait == "横向") {
			factory.printing.portrait = false;
		}
	}
	if (ra.printHeader !== undefined) {
		factory.printing.header = ra.printHeader;
	} else {
		factory.printing.header = "";
	}
	if (ra.printFooter !== undefined) {
		factory.printing.footer = ra.printFooter;
	} else {
		factory.printing.footer = "";
	}
	if (ra.printLeftMargin !== undefined) {
		factory.printing.leftMargin = ra.printLeftMargin;
	}
	if (ra.printTopMargin !== undefined) {
		factory.printing.topMargin = ra.printTopMargin;
	}
	if (ra.printRightMargin !== undefined) {
		factory.printing.rightMargin = ra.printRightMargin;
	}
	if (ra.printBottomMargin !== undefined) {
		factory.printing.bottomMargin = ra.printBottomMargin;
	}
}

// 查询
function run() {
	Ext.Ajax.request({
		url : sys.getContextPath() + "/artery/report/dealParse.do?action=parse",
		params : getParams(),

		success : function(response, options) {
			var reportData = response.responseText;
			if (reportData != null) {
				reportData = Ext.decode(reportData);
			}
			updateReport(reportData.tableHtml + reportData.pageHtml);
			Ext.select('.rpt-script').each(function(el, cmp, idx) {
				window.eval(el.dom.innerHTML);
			})
			// Artery.loadTrue("操作成功，请继续！")
		},
		failure : function(response, options) {
			Artery.loadFalse("操作失败，请检查！")
		}

	})
}
// 得到参数
function getParams() {
	var params = opener.Artery.getCmp(opener.resultId).getParams();
	Ext.apply(params,opener.Artery.getCmp(opener.resultId).param);
	return params;
}

// 更新内容
function updateReport(reportData) {
	Ext.get("resultDiv").update(reportData);
	processPrintInfo();
}
function appendReport(reportData) {
	Ext.get("resultDiv").insertHtml('beforeEnd',reportData);
	processPrintInfo();
}

// 后处理打印信息
function processPrintInfo() {
	Ext.select("span.report-order").remove();
	Ext.select('span.pageSpan').setDisplayed(false);

	var links = document.getElementsByTagName("a");
	while (links.length != 0) {
		links[0].outerHTML = links[0].innerHTML;
	}

	Ext.select('.crs_table_fixed').removeClass('crs_table_fixed');
	Ext.select('.crs_tr_fixed').removeClass('crs_tr_fixed');

	// onlyshow
	Ext.select('.x-crs-onlyshow-row').each(function(el, cmp, idx) {
				el.parent('tr').setDisplayed(false);
			})
	Ext.select('.x-crs-onlyshow-col').each(function(el, cmp, idx) {
				hiddenTd(el.parent('td'));
			})
}

/**
 * 隐藏单元格tdEl，并修改相应的单元格显示
 */
function hiddenTd(tdEl) {
	if (tdEl.parent('table')===undefined||tdEl.parent('table')==null)
		return;
	var tableEl = tdEl.parent('table').dom;
	var realPos = getTdRealPostion(tableEl);
	var tdSpaceInfo = getTdPosition(tdEl);
	if (tdSpaceInfo == null)
		return null;
	var trEls = tableEl.rows;
	var tdEls = null;
	var start = null;
	var space = 0;
	var tr = null;
	var td = null;
	var realTrPos = null;
	var realTdPos = null;
	for (var i = 0; i < trEls.length; i++) {
		tr = trEls[i];
		tdEls = tr.cells;
		realTrPos = realPos[i];
		for (var j = 0; j < tdEls.length; j++) {
			td = tdEls[j];
			realTdPos = realTrPos[j];
			if (!(realTdPos.xStart > tdSpaceInfo.xEnd || realTdPos.xEnd < tdSpaceInfo.xStart)) {
				if (realTdPos.xStart < tdSpaceInfo.xStart
						&& realTdPos.xEnd > tdSpaceInfo.xEnd) {
					space = tdSpaceInfo.xEnd - tdSpaceInfo.xStart + 1;
				} else if (realTdPos.xStart >= tdSpaceInfo.xStart
						&& realTdPos.xEnd <= tdSpaceInfo.xEnd) {
					space = realTdPos.xEnd - realTdPos.xStart + 1;
				} else if (tdSpaceInfo.xEnd < realTdPos.xEnd) {
					space = tdSpaceInfo.xEnd - realTdPos.xStart + 1;
				} else {
					space = realTdPos.xEnd - tdSpaceInfo.xStart + 1;
				}
				updateTdSpace(tr,td, space);
			}
		}
	}

}

/**
 * 获得table中cell的实际位置信息
 */
function getTdRealPostion(tableEl) {
	var realPos = {};
	var trEls = tableEl.rows;
	var tdEls = null;
	var td = null;
	var tmpPos = null;
	var specialTdInfos = [];;
	var tdInfo = null;
	for (var i = 0; i < trEls.length; i++) {
		tdEls = trEls[i].cells;
		tmpPos = {};
		for (var j = 0; j < tdEls.length; j++) {
			td = tdEls[j];
			tdInfo = {};
			tdInfo.xStart = td.cellIndex + 1;
			tdInfo.yStart = i + 1;
			tdInfo.yEnd = tdInfo.yStart + (td.rowSpan == null ? 1 : td.rowSpan)
					- 1;
			tdInfo.xEnd = tdInfo.xStart + (td.colSpan == null ? 1 : td.colSpan)
					- 1;
			setRealXPostion(tdInfo, specialTdInfos);
			tmpPos[j] = tdInfo;
			if (tdInfo.xEnt > tdInfo.xStart || tdInfo.yEnd > tdInfo.yStart)
				specialTdInfos.push(tdInfo);
		}
		realPos[i] = tmpPos;
	}
	return realPos;
}

/**
 * 根据表中占多行多列的单元格，在td的位置信息tdInfo中设置在tr中的实际位置
 */
function setRealXPostion(tdInfo, specialTdInfos) {
	var tmpInfo = null;
	var offset = 0;
	for (var i = 0; i < specialTdInfos.length; i++) {
		offset = 0;
		tmpInfo = specialTdInfos[i];
		if (tdInfo.yStart >= tmpInfo.yStart && tdInfo.yEnd <= tmpInfo.yEnd
				&& tdInfo.xStart >= tmpInfo.xStart) {
			if (tmpInfo.yEnd > tmpInfo.yStart) {
				if (tmpInfo.yStart == tdInfo.yStart)
					offset = tmpInfo.xEnd - tmpInfo.xStart;
				else
					offset = tmpInfo.xEnd - tmpInfo.xStart + 1;
			} else {
				offset = tmpInfo.xEnd - tmpInfo.xStart;
			}
			tdInfo.xStart = tdInfo.xStart + offset;
			tdInfo.xEnd=tdInfo.xEnd + offset;
		}
	}
}

/**
 * 获得单元格tdEl在table中实际的位置信息
 */
function getTdPosition(tdEl) {
	var tableEl = tdEl.parent('table').dom;
	var trEls = tableEl.rows;
	var tdEls = null;
	var td = null;
	var tmpPos = null;
	var specialTdInfos = [];;
	var tdInfo = null;
	for (var i = 0; i < trEls.length; i++) {
		tdEls = trEls[i].cells;
		tmpPos = {};
		for (var j = 0; j < tdEls.length; j++) {
			td = tdEls[j];
			tdInfo = {};
			tdInfo.xStart = td.cellIndex + 1;
			tdInfo.yStart = i + 1;
			tdInfo.yEnd = tdInfo.yStart + (td.rowSpan == null ? 1 : td.rowSpan)
					- 1;
			tdInfo.xEnd = tdInfo.xStart + (td.colSpan == null ? 1 : td.colSpan)
					- 1;
			setRealXPostion(tdInfo, specialTdInfos);
			if (td == tdEl.dom)
				return tdInfo;
			if (tdInfo.xEnd > tdInfo.xStart || tdInfo.yEnd > tdInfo.yStart)
				specialTdInfos.push(tdInfo);
		}
	}
	return null;
}

/**
 * 更新单元格td的显示，减少spaceSize行的占用
 */
function updateTdSpace(tr , td, spaceSize) {
	if (td.colSpan == null || td.colSpan == spaceSize){
		tr.removeChild(td);
	}
	else
		td.colSpan = td.colSpan - spaceSize;
}
