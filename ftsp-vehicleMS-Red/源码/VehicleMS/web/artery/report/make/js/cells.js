var CONST_CELL_NAME = "myCells";
// 得到数据对象
function getData() {
	var data = new Object();
	// 初始化键
	data.initTemplateKey = "templateContent";
	// 初始化值
	data.initTemplate = document.getElementById("templateContent").value;
	return data;
}

// 保存模板节点时的回调函数
function processUpdateBack() {
	var jTip = this.jTip;
	var infoBak = this.req.responseText.replace(/\s/g, "");
	if (infoBak.length > 10) {
		jTip
				.setCaption("<font color='red'>\u5bf9\u4e0d\u8d77\uff0c\u4fdd\u5b58\u5931\u8d25\uff01</font>");
		setTimeout(jTip.hidden, 3000);
	} else {
		jTip.setCellImg(true);
		jTip.setCaption("<font color='green'>" + feedbackInfoOK + "</font>");
		setTimeout(jTip.hidden, 3000);
		setClickTag(labelObj.name, infoBak);
	}
}

// 转到只读页面
function gotoMRTableDisplay(sAction) {
	window.location.href = ctx + "/thunisoft/crs/artery/report/dealReport.do?action="
			+ sAction + "&template.ID=" + getValById("template.ID");
}
// myCells只有两个属性：
// (1)IsDesigner，可读可写，是否显示设计界面；
// （2）XmlData，可读可写，导入和导出xml数据
function resetCells(myCells, design) {
	try {
		myCells.readonly = !design;
		// ShowToolbar:可读写，设置是否显示工具栏
		myCells.ShowToolbar = true;
		// ShowGrid:可读写，设置是否显示表格线
		myCells.ShowGrid = design;
		// ShowRowTitle:可读写，设置是否显示行标题
		myCells.ShowRowTitle = design;
		// ShowColTitle:可读写，设置是否显示列标题
		myCells.ShowColTitle = design;
		// Color:可读写，设置表格的背景色，用long型表示。
		myCells.Color = 16777215;
		// ShowScrollbar:可读写，设置控件是否显示滚动条
		myCells.ShowScrollbar = true;
	} catch (e) {
	}
}
// 根据模板属性，初始化Cell控件
function initCells(xml, design) {
	var myCells = document.getElementById(CONST_CELL_NAME);
	try {
		if (null == xml || "" == xml || "null" == xml)
			myCells.xmldata = '<?xml version="1.0" encoding="gb2312"?>'
					+ '<Template ver="1.0">'
					+ '<Table DefaultColWidth="84" DefaultRowHeight="20"/>'
					+ '<ImgList/>'
					+ '<Cells>'
					+ '<Cell Col="1" Row="1" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1" />'
					+ '<Cell Col="1" Row="2" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="1" Row="3" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="2" Row="1" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="2" Row="2" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="2" Row="3" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="3" Row="1" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="3" Row="2" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '<Cell Col="3" Row="3" DrawTop="0" DrawLeft="0" DrawBottom="0" DrawRight="0" TrailingZero="1" ThousandSep="1"/>'
					+ '</Cells>' + '</Template>';

		else {
			if (design)
				myCells.xmldata = xml;
			else
				myCells.ZipData = xml;
		}
		resetCells(myCells, design);

	} catch (e) {
	}
}
// 根据模板属性，在页面输出Cell控件
// param id 所在层（div）的id
// param style 控件显示属性
function loadCell(id, style, design, version) {
	var cellid = document.getElementById(id);
	if (version == "" || version == null)
		version = "1,0,2,226";
	var str = '<object classid="clsid:D4068D8A-6FD8-434D-9266-8D63EFE1F28A" '
			+ 'id="' + CONST_CELL_NAME + '" codebase="' + sys.getContextPath()
			+ '/artery/arteryConsole/ocx/MyCells.cab#version=' + version
			+ '" style="visibility:hidden;' + style + '">'
			+ '<param name="Visible" value="0">'
			+ '<param name="Aut++oScroll" value="0">'
			+ '<param name="AutoSize" value="false">'
			+ '<param name="AxBorderStyle" value="0">'
			+ '<param name="ScreenSnap" value="0">'
			+ '<param name="SnapBuffer" value="10">'
			+ '<param name="DoubleBuffered" value="0">'
			+ '<param name="Enabled" value="-1"></object>';
	cellid.innerHTML = str;
	// 减少控件闪动
	if (design) {
		cellData = document.getElementById(CONST_CELL_NAME);
		var myCells = document.getElementById(CONST_CELL_NAME);
		myCells.style.visibility = "visible";
	}
}

// 初始化本页面
function initTable(readonly) {
	if (readonly == null) {
		readonly = false;
	}
	// 初始化标签对象
	// init("table", getData());
	// 写控件
	loadCell("CellBody", "width:100%;height:100%;", true, "2,5,3,350");
	// 初始化控件
	document.getElementById("templateContent").value = document
			.getElementById("templateContent").value;
	var xml = document.getElementById("templateContent").value;
	initCells(xml, true);
}

/**
 * 保存按钮的事件
 */
function saveTemplate(cid, complibId) {
	saveTemplate1(table.id, table.complibId);
}
function saveTemplate1(cid, complibId) {
	var myCells1 = document.getElementById("myCells");
	var templateContent = myCells1.xmldata;
	var map = new Map();
	map.put("key", "report.table.save");
	map.put("templateContent", templateContent);
	map.put("id", cid);
	map.put("complibId", complibId);
	var query = new QueryObj(map, templateCallback);
	query.send();
}
/**
 * 表样的回调函数
 */
function templateCallback(query) {
	if (!query.isResultOK()) {
		showTips("未知系统错误,请检查格式", 4);
		return;
	}
	showTips("表单模板保存成功", 2);
}
