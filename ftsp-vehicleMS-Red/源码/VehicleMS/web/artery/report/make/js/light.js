var lightData;
var lightGrid, lightWin;
var xmlform;
var codeClick = 0;
var selectId = "";
var lightForm;

function saveLight() {
	var templateId = reportParams.id;
	var map = new Map();
	map.put("key", "template.light.save");
	map.put("id", templateId);
	map.put("complibId", reportParams.complibId);
	map.put("lightData", lightData);
	var query = new QueryObj(map, lightCallback);
	query.send();
}

var light = function() {
	return {
		init : function() {
			// ******为grid做一些准备xml
			lightData = document.getElementById("lightStr").value;
			if (lightData == "" || lightData == " " || lightData == null) {
				lightData = "<?xml version=\"1.0\" encoding=\"GBK\"?>"
						+ "<highLights>" + "<id>111</id>"
						+ "<totalRecords>100</totalRecords>"
						+ "<success>true</success>" + "</highLights>";
			}
			var xdoc = loadXMLString(lightData);
			var proxy = new Ext.data.MemoryProxy(xdoc);
			store = new Ext.data.Store({
						proxy : proxy,
						reader : new Ext.data.XmlReader({
									record : 'alcon',
									id : 'id',
									success : 'success',
									totalRecords : 'totalRecords'
								}, ['lightColor', 'forecolor', 'backcolor',
										'colValue', 'rowValue', 'con',
										'orderValue'])
					});
			// 转换视图按钮
			var refreshButton = new Ext.Button({
						text : 'xml源码',
						tooltip : 'xml源码,您可以直接修改源码',
						handler : function(item) {
							openXml(lightData, 5);
						}
					});
			// 创建grid(后续grid)
			lightGrid = new Ext.grid.GridPanel({
				header : false,
				stripeRows : true,
				region : 'center',
				loadMask : true,
				border : false,
				store : store,
				viewConfig : {
					forceFit : true
				},
				title : '语法',
				height : 220,
				collapsible : true,
				tbar : [new Ext.Button({
									text : '亮显范围',
									cls : 'x-btn-text-icon add',
									tooltip : '新建亮显范围',
									handler : function(item) {
										newLight();
										Ext.getCmp('headColorValue').setValue('#000000');
										Ext.getCmp('afterColorValue')
												.setValue('#ffffff');
										Ext.getCmp('columnValue').setValue();
										Ext.getCmp('rowValue').setValue();
										Ext.getCmp('Expressions').setValue();
										Ext.getCmp('orderValue').setValue();
										selectId = "";// 标志新建
									}
								}), '-', new Ext.Button({
									id : "button_save",
									text : '保存',
									cls : 'x-btn-text-icon save',
									tooltip : '保存亮显信息',
									handler : saveLight
								}), {
							text : "预览",
							cls : 'x-btn-text-icon preview',
							handler : previewForm
						}, {
							xtype : 'tbfill'
						}, refreshButton],
				columns : [{
					header : "显示效果",
					width : 120,
					dataIndex : 'lightColor',
					renderer : function(value) {
						var lightColors = value.split("!");
						return "<span style='background: " + lightColors[1]
								+ ";color: " + lightColors[0]
								+ ";'>文字Abc</span>";
					}
				}, {
					header : "前景色",
					width : 80,
					dataIndex : 'forecolor'
				}, {
					header : "背景色",
					width : 80,
					dataIndex : 'backcolor'
				}, {
					header : "列值",
					width : 68,
					dataIndex : 'colValue'
				}, {
					header : "行值",
					width : 68,
					dataIndex : 'rowValue'
				}, {
					header : "条件表达式",
					width : 200,
					dataIndex : 'con',
					renderer : function(value) {
						var firstReplace;
						var re = /</g;
						firstReplace = value.replace(re, "&lt;"); // 转换<符号
						return firstReplace;
					}
				}, {
					header : "排序值",
					width : 60,
					dataIndex : 'orderValue'
				}, {
					header : "操作",
					sortable : false,
					dataIndex : 'CId',
					renderer : operRenderer
				}]

			});
			lightGrid.on('rowdblclick', function(g, rowIndex, e) {
						var cid = store.getAt(rowIndex).get('CId');
						editLight(cid, store.getAt(rowIndex).get('forecolor'),
								store.getAt(rowIndex).get('backcolor'), store
										.getAt(rowIndex).get('colValue'), store
										.getAt(rowIndex).get('rowValue'), store
										.getAt(rowIndex).get('con'), store
										.getAt(rowIndex).get('orderValue'),
								rowIndex);
					});
			// xml的formpanel
			xmlform = new Ext.form.FormPanel({
						defaultType : 'textfield',
						buttonAlign : 'right',
						labelAlign : 'left',
						region : 'south',
						anchor : '100%',
						style : 'overflow:auto',
						labelWidth : 40,
						height : 220,
						frame : false,
						border : false,
						collapsible : true,
						bodyStyle : 'background-color:#DFE8F6',
						hideLabels : true,
						tbar : [new Ext.Button({
									text : '刷新xml代码',
									tooltip : '刷新显示xml修改后的预览效果',
									cls : 'x-btn-text-icon refresh',
									handler : function() {
										var xmldata = lightData;
										lightData = xmlform.getForm()
												.findField("xmlString")
												.getValue();
										try {
											var xdoc = loadXMLString(lightData);
											var proxy = new Ext.data.MemoryProxy(xdoc);
											store.proxy = proxy;
											store.load();
										} catch (e) {
											lightData = xmldata;
											alert("请输入正确格式的xml");
										}
									}
								})],
						items : [{
									height : 195,
									anchor : '100%',
									border : false,
									frame : false,
									xtype : 'textarea',
									id : 'xmlString'
								}]
					});
			formatXml(lightData);
			var viewPort = new Ext.Viewport({
						layout : 'border',
						border : false,
						hideBorders : true,
						items : [lightGrid]
					});
			// 定义颜色选择框
			var headColor = new Ext.ColorPalette({
						border : false
					});
			var afterColor = new Ext.ColorPalette({
						border : false
					});
			// 弹出form定义
			lightForm = new Ext.FormPanel({
				labelAlign : 'right',
				frame : true,
				border : false,
				width : 400,
				labelWidth : 70,
				items : [{
							layout : 'column',
							items : [{
										columnWidth : .5,
										layout : 'form',
										items : [{
													fieldLabel : '前景色',
													name : 'headColorValue',
													xtype : 'textfield',
													id : 'headColorValue',
													border : false,
													anchor : '97%',
													maxLength : 10
												}, {
													bodyStyle : 'text-align:right;',
													items : [headColor]
												}, {
													xtype : 'textfield',
													fieldLabel : '列值',
													name : 'columnValue',
													id : 'columnValue',
													anchor : '97%',
													emptyText :'eg:A,B,D'
												}, {
													xtype : 'textfield',
													fieldLabel : '条件表达式',
													name : 'Expressions',
													id : 'Expressions',
													anchor : '97%',
													emptyText:'eg:{exp(([A4]+<rownum>)%2=0)}'
												}]
									}, {
										columnWidth : .5,
										layout : 'form',
										items : [{
													fieldLabel : '背景色',
													name : 'afterColorValue',
													xtype : 'textfield',
													id : 'afterColorValue',
													anchor : '97%',
													border : false,
													maxLength : 10
												}, {
													bodyStyle : 'text-align:right;',

													items : [afterColor]
												}, {
													xtype : 'textfield',
													fieldLabel : '行值',
													name : 'rowValue',
													id : 'rowValue',
													anchor : '97%',
													emptyText:'eg:5'
												}, {
													xtype : 'textfield',
													fieldLabel : '排序值',
													name : 'orderValue',
													id : 'orderValue',
													anchor : '97%',
													emptyText:'eg:1'
												}]
									}]
						}]

			});
			// 颜色空间选择之后的更新input
			headColor.on('select', function(palette, selColor) {
						Ext.getCmp("headColorValue").setValue("#" + selColor);
					});
			// 颜色空间选择之后的更新input
			afterColor.on('select', function(palette, selColor) {
						Ext.getCmp("afterColorValue").setValue("#" + selColor);
					});
		}
	}
}();
// 弹出亮显设置的窗口
function newLight() {
	if (!lightWin) {
		lightWin = new Ext.Window({
			width : 620,
			height : 260,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			border : false,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			title : '新建亮显',
			titleCollapse : true,
			items : lightForm,
			buttons : [{
				text : '确定',
				handler : function() {
					var rowValue = Ext.getCmp('rowValue');
					if (!rowValue.validate()) {
						showTips("请检查行值输入框", 4);
						return;
					}
					selectId += " ";
					// 新建时
					if (selectId.trim() == "") {
						// 取得一个主键
						var map = new Map();
						map.put("key", "template.grammar.getId");
						var query = new QueryObj(map, orderGetIdCallback);
						query.send();
					} else {// 编辑时的操作
						var xmlDoc = loadXMLString(lightData);
						var alcon = xmlDoc.getElementsByTagName("alcon")[selectId];
						var childList = alcon.childNodes;
						var headColorValue = childList.item(1);
						var afterColorValue = childList.item(2);
						var columnValue = childList.item(3);
						var rowValue = childList.item(4);
						var Expressions = childList.item(5);
						var orderValue = childList.item(6);
						var lightValue = childList.item(7);
						headColorValue.text = lightForm.getForm()
								.findField("headColorValue").getValue();
						afterColorValue.text = lightForm.getForm()
								.findField("afterColorValue").getValue();
						columnValue.text = lightForm.getForm()
								.findField("columnValue").getValue();
						rowValue.text = lightForm.getForm()
								.findField("rowValue").getValue();
						Expressions.text = lightForm.getForm()
								.findField("Expressions").getValue();
						orderValue.text = lightForm.getForm()
								.findField("orderValue").getValue();
						lightValue.text = (lightForm.getForm()
								.findField("headColorValue").getValue()
								+ "!" + lightForm.getForm()
								.findField("afterColorValue").getValue());
						lightData = xmlDoc.xml;
						lightWin.setVisible(false);
						formatXml(lightData);
					}
				}
			}, {
				text : '取 消',
				handler : function() {
					lightWin.setVisible(false);
				}
			}]
		});
	}
	lightWin.show();
	lightWin.focus();
}
// 取得主键之后的对表格的操作
function orderGetIdCallback(query) {
	var lightid = query.getDetail();// 返回的id
	var xmlDoc = loadXMLString(lightData);
	var alcon = xmlDoc.createElement("alcon");
	var CId = xmlDoc.createElement("CId");
	var forecolor = xmlDoc.createElement("forecolor");
	var backcolor = xmlDoc.createElement("backcolor");
	var colValue = xmlDoc.createElement("colValue");
	var rowValue = xmlDoc.createElement("rowValue");
	var con = xmlDoc.createElement("con");
	var orderValue = xmlDoc.createElement("orderValue");
	var lightColor = xmlDoc.createElement("lightColor");
	CId.text = lightid;
	forecolor.text = lightForm.getForm().findField("headColorValue").getValue();
	backcolor.text = lightForm.getForm().findField("afterColorValue")
			.getValue();
	colValue.text = lightForm.getForm().findField("columnValue").getValue();
	rowValue.text = lightForm.getForm().findField("rowValue").getValue();
	con.text = lightForm.getForm().findField("Expressions").getValue();
	orderValue.text = lightForm.getForm().findField("orderValue").getValue();
	lightColor.text = (lightForm.getForm().findField("headColorValue")
			.getValue()
			+ "!" + lightForm.getForm().findField("afterColorValue").getValue());
	alcon.appendChild(CId);
	alcon.appendChild(forecolor);
	alcon.appendChild(backcolor);
	alcon.appendChild(colValue);
	alcon.appendChild(rowValue);
	alcon.appendChild(con);
	alcon.appendChild(orderValue);
	alcon.appendChild(lightColor);
	alcon.setAttribute("id", lightid)
	var code = xmlDoc.getElementsByTagName("highLights")[0];
	code.appendChild(alcon);
	lightData = xmlDoc.xml;
	lightWin.setVisible(false);
	formatXml(lightData);
};
// 操作renderer
function operRenderer(value, cellmeta, record, rowIndex, columnIndex, store) {
	var re = "<a href='#' onclick='editLight(\"" + value + "\",\""
			+ record.data["forecolor"] + "\",\"" + record.data["backcolor"]
			+ "\",\"" + record.data["colValue"] + "\",\""
			+ record.data["rowValue"] + "\",\"" + record.data["con"] + "\",\""
			+ record.data["orderValue"] + "\",\"" + rowIndex + "\")'>"
			+ "<img src='"+sys.getContextPath()+"/artery/pub/images/icon/edit.gif'></a>";
	re = re + "&nbsp;<a href='#' onclick='delLight(\"" + rowIndex + "\")'>"
			+ "<img src='"+sys.getContextPath()+"/artery/pub/images/icon/del.gif'></a>"
	return re;
}
/**
 * grid点击编辑时的操作 编辑dom
 */
function editLight(cid, forecolor, backcolor, colValue, rowValue, con,
		orderValue, rowIndex) {
	selectId = rowIndex;
	newLight();
	lightWin.setTitle("编辑亮显");
	var xmlDoc = loadXMLString(lightData);
	var alcon = xmlDoc.getElementsByTagName("alcon")[rowIndex];
	Ext.getCmp('headColorValue').setValue(forecolor);
	Ext.getCmp('afterColorValue').setValue(backcolor);
	Ext.getCmp('columnValue').setValue(colValue);
	Ext.getCmp('rowValue').setValue(rowValue);
	Ext.getCmp('Expressions').setValue(con);
	Ext.getCmp('orderValue').setValue(orderValue);
}
/**
 * 删除排序
 */
function delLight(rowIndex) {
	Ext.MessageBox.minWidth = 200;
	Ext.MessageBox.confirm('提示', '确认删除?', delConfirm);
	selectId = rowIndex;
}
/**
 * 删除操作 删除dom
 */
function delConfirm(btn) {
	if (btn == "yes") {
		var xmlDoc = loadXMLString(lightData);
		var alcon = xmlDoc.getElementsByTagName("alcon")[selectId];
		alcon.parentNode.removeChild(alcon);
		lightData = xmlDoc.xml;
		formatXml(lightData);
	} else {
		selectId = "";
	}
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
/**
 * 格式化之后的回调函数
 */
function formatCallback(query) {
	var retXml = query.getDetail();
	var xdoc = loadXMLString(retXml);
	lightData = retXml;
	// xmlform.getForm().findField("xmlString").setValue(retXml);
	var proxy = new Ext.data.MemoryProxy(xdoc);
	store.proxy = proxy;
	store.load();
}
// 根据xml创建dom对象
function loadXMLString(xmlString) {
	var xmlDoc = null;
	try {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlString, "text/xml");
	} catch (e) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.loadXML(xmlString);
	}
	return xmlDoc;
}
/**
 * 亮显的回调函数
 */
function lightCallback(query) {
	if (!query.isResultOK()) {
		showTips("未知系统错误,请检查格式", 4);
		return;
	}
	showTips("保存亮显信息成功", 2);
}
function previewForm() {
	saveLight();
	winObj = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
	winObj.location.href=sys.getContextPath()+'/artery/report/dealParse.do?action=previewForm&formid=' + reportParams.id;
	winObj.focus();
}