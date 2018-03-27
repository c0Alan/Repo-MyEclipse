var xmlWin, xmlformForPop, xmlCodePanel;
// 弹出修改xml源码
function openXml(xmlStr, reportType) {
	// xml的form
	if (!xmlCodePanel) {
		xmlCodePanel = new CodePanel({
					language : "xml",
					height : 320
				});
	}
	xmlCodePanel.setCode(xmlStr);
	if (!xmlWin) {
		xmlWin = new Ext.Window({
			width : 600,
			height : 400,
			resizable : false,
			closeAction : 'hide',
			border : false,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			title : 'xml源码',
			maximizable : true,
			items : xmlCodePanel,
			buttons : [{
				text : '确定',
				handler : function() {
					if (reportType == 1) {// 语法页签
						var xmldata = eformtpl.ds;
						eformtpl.ds = xmlCodePanel.getCode();
						try {
							var map = new Map();
							map.put("key", "report.loadDSXML.editXml");
							map.put("dsData", eformtpl.ds);
							map.put("formtype", 4);
							var query = new QueryObj(map);
							query.send();
							eformtpl.ds = query.getDetail();
							eformtpl.dom = loadXMLString(eformtpl.ds);
							xmlWin.setVisible(false);
							store.load();
							var rootEl = eformtpl.dom.documentElement;
							for (var i = 0; i < rootEl.childNodes.length; i++) {
								var subEl = rootEl.childNodes[i];
								var p = new Ext.data.Record({
									name : subEl.getAttribute("rsName"),
									pageSplit : subEl.getAttribute("splitpage"),
									pageNumber : subEl.getAttribute("record"),
									value : Ext.encode(subEl.text)
								});
								if (subEl.getAttribute("rsName") != null
										&& subEl.getAttribute("rsName").trim() != "") {
									store.addSorted(p);
								}

							}
						} catch (e) {
							eformtpl.ds = xmldata;
							alert("请输入正确格式的xml");
						}
					} else if (reportType == 2) {// 条件页签
						var xmldata = conditiondata;
						conditiondata = xmlCodePanel.getCode();
						try {
							var xdoc = loadXMLString(conditiondata);
							var proxy = new Ext.data.MemoryProxy(xdoc);
							conditionStore.proxy = proxy;
							conditionStore.load();
							var conditions = xdoc
									.getElementsByTagName("conditions")[0];
							if ((conditions.attributes.getNamedItem("showType").value) == '1')
								Ext.getCmp('list').checked = true;
							else if ((conditions.attributes
									.getNamedItem("showType").value) == '2')
								Ext.getCmp('pop').checked = true;
							else if ((conditions.attributes
									.getNamedItem("showType").value) == '3')
								Ext.getCmp('tagForRaido').checked = true;
							xmlWin.setVisible(false);

						} catch (e) {
							conditiondata = xmldata;
							alert("请输入正确格式的xml");
						}
					} else if (reportType == 3) {// 排序
						var xmldata = eformtpl.ds;
						eformtpl.ds = xmlCodePanel.getCode();
						try {
							var map = new Map();
							map.put("key", "report.loadOrderXML.editXml");
							map.put("dsData", eformtpl.ds);
							map.put("formtype", 4);
							var query = new QueryObj(map);
							query.send();
							eformtpl.ds = query.getDetail();
							eformtpl.dom = loadXMLString(eformtpl.ds);
							xmlWin.setVisible(false);
							store.load();
							var rootEl = eformtpl.dom.documentElement;
							for (var i = 0; i < rootEl.childNodes.length; i++) {
								var subEl = rootEl.childNodes[i];
								var p = new Ext.data.Record({
											name : subEl.getAttribute("name"),
											field : subEl.getAttribute("field"),
											yndefault : subEl
													.getAttribute("yndefault")
										});
								if (subEl.getAttribute("name") != null
										&& subEl.getAttribute("name").trim() != "") {
									store.addSorted(p);
								}

							}
						} catch (e) {
							eformtpl.ds = xmldata;
							alert("请输入正确格式的xml");
						}
					} else if (reportType == 4) {// 后处理
						try {
							var xmldata = xmlCodePanel.getCode();
							parseXmlToForm(xmldata);
							afterdealData = xmldata;
							xmlWin.setVisible(false);

						} catch (e) {
							mydata = xmldata;
							alert("请输入正确格式的xml");
						}
					} else if (reportType == 5) {// 亮显
						var xmldata = lightData;
						lightData = xmlCodePanel.getCode();
						try {
							var xdoc = loadXMLString(lightData);
							var proxy = new Ext.data.MemoryProxy(xdoc);
							store.proxy = proxy;
							store.load();
							xmlWin.setVisible(false);
						} catch (e) {
							lightData = xmldata;
							alert("请输入正确格式的xml");
						}
					} else if (reportType == 9) {// 关联
						var xmldata = relationData;
						relationData = xmlCodePanel.getCode();
						try {
							var storeData = eval(getStoreData(relationData));
							store.loadData(storeData);
							xmlWin.setVisible(false);
						} catch (e) {
							relationData = xmldata;
							alert("请输入正确格式的xml");
						}
					}
				}
			}, {
				text : '取 消',
				handler : function() {
					xmlWin.setVisible(false);
				}
			}]
		});
	}
	xmlWin.show();
	xmlWin.focus();
}

/**
 * 格式化xml
 */
function formatXml(xmlStr) {
	var map = new Map();
	map.put("key", "template.report.formatxml");
	map.put("xmlStr", xmlStr);
	var query = new QueryObj(map, formatCallback);
	query.send();
}