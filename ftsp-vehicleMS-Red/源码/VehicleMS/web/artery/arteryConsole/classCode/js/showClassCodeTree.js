var classCodeTreeLoader;
var selectedNode; // 单击选中的节点
var parentNode;
var export_window = null; // 导出窗口
var import_window = null; // 导入窗口

// 单击classcode tree节点事件函数
function editClassCode(node, e) {

	// 当单击树上节点时，才激活新建按钮
	var toolbar_addCC = Ext.getCmp("toolbar_addCC");
	var toolbar_deleteCC = Ext.getCmp("toolbar_deleteCC");
	toolbar_addCC.enable();
	toolbar_deleteCC.enable();
	selectedNode = node;
	var nodeCode = node.attributes.code;
	// 当单击的节点为根节点时，清空编辑区域
	if (nodeCode == rootCode) {
		toolbar_deleteCC.disable(); // 不允许删除根节点
		Ext.get('inner_iframe').dom.src = '';
		return;
	} else {
		parentNode = selectedNode.parentNode;
	}
	Ext.get('inner_iframe').dom.src = sys.getContextPath()
			+ '/artery/classCode/dealClassCode.do?action=editClassCode' + '&indexCC='
			+ indexCC + '&nodeCode=' + nodeCode;
}

function makeClassCodeTree() {
	classCodeTree = new Ext.tree.TreePanel({
		autoScroll : true,
		animate : false,
		enableDD : false,
		border : false,
		rootVisible : true,
		loader : classCodeTreeLoader = new Ext.tree.TreeLoader({
					dataUrl : sys.getContextPath()
							+ '/artery/classCode/dealClassCode.do?action=loadClassCodeTree'
				})
	});

	// 加载节点时,传输其他参数
	classCodeTreeLoader.on("beforeload", function(treeLoader, node) {
				// this.baseParams.id = node.attributes.id;
				this.baseParams.code = node.attributes.code;
				this.baseParams.indexCC = indexCC;
			});

	// 单击事件
	classCodeTree.on('click', editClassCode);

	// 设置根节点
	var root = new Ext.tree.AsyncTreeNode({
				id : rootCode,
				text : rootName,
				code : rootCode,
				draggable : false,
				leaf : false
			});

	classCodeTree.setRootNode(root);
	root.expand();
}

// 刷新这颗树，同时选中刷新前已选中的节点
function freshClassCodeTree() {
	classCodeTree.getRootNode().reload(function() {
				classCodeTree.fireEvent('click', selectedNode);
			});
}

function freshClassCodeTree2() {
	classCodeTree.getRootNode().reload(function() {
				classCodeTree.fireEvent('click', parentNode);
			});
}

function initToolbar() {
	toolbar = new Ext.Toolbar();
	toolbar.add({
				id : 'toolbar_addCC',
				text : '新建',
				cls : 'x-btn-text-icon add',
				disabled : true,
				handler : newClassCode
			});
	toolbar.add('-');
	toolbar.add({
				id : 'toolbar_importCC',
				text : '导入',
				cls : 'x-btn-text-icon import',
				handler : importClassCode
			});
	toolbar.add('-');
	toolbar.add({
				id : 'toolbar_exportCC',
				text : '导出',
				cls : 'x-btn-text-icon export',
				handler : exportSubmit
			});
	toolbar.add('-');
	toolbar.add({
				id : 'toolbar_deleteCC',
				text : '删除',
				cls : 'x-btn-text-icon delete',
				handler : deleteClassCode
			});
	toolbar.add('-');
	toolbar.add({
				id : 'toolbar_refreshCacheCC',
				text : '更新缓存',
				cls : 'x-btn-text-icon refresh',
				handler : reloadClassCode
			});
}

// 新建classcode
function newClassCode() {
	// 选中的节点是新建节点的父节点
	var parentNode = selectedNode;
	var parentNodeCode = parentNode.attributes.code;
	var parentNodeName = parentNode.attributes.text;

	Ext.get('inner_iframe').dom.src = sys.getContextPath()
			+ '/artery/classCode/dealClassCode.do?action=addClassCode' + '&indexCC='
			+ indexCC + '&parentNodeCode=' + parentNodeCode
			+ '&parentNodeName=' + encodeURIComponent(parentNodeName);

}

// 分级代码导入函数
function importClassCode() {

	if (!import_window) {

		// 初始化弹出框
		import_window = new Ext.Window({
			title : '导入分级代码',
			width : 300,
			height : 140,
			resizable : false,
			bodyStyle : 'padding:5px',
			closeAction : 'hide',
			// plain: true,
			items : [{
				xtype : 'form',
				id : 'importFormPanel',
				defaultType : 'textfield',
				baseCls : 'x-plain',
				labelWidth : 70,
				frame : true,
				method : 'post',
				labelAlign : 'top',
				enctype : 'multipart/form-data',
				fileUpload : true,
				buttonAlign : 'center',
				items : [{
							fieldLabel : '请选择要导入的文件',
							name : 'classCode_zip',
							id : 'classCode_zip',
							anchor : '100%',
							inputType : 'file',
							focusClass : 'null',
							blankText : '请选择zip文件',
							validator : Ext.validUpZipFile
						}, new Ext.Panel({
							baseCls : 'x-plain',
							html : '<font color="red" id="import_valid_text"></font>'
						})],
				buttons : [{
					text : '导 入',
					handler : function() {
						// if(Ext.getCmp('importFormPanel').getForm().isValid()){
						// 空输入值的校验
						if (Ext.isEmpty(Ext.getCmp('classCode_zip').getValue())) {
							document.getElementById('import_valid_text').innerHTML = "请选择文件再导入!";
							return;
						}
						// zip文件校验
						if (Ext.validUpZipFile(Ext.getCmp('classCode_zip')
								.getValue()) != true) {
							Ext.getCmp('classCode_zip').reset();
							document.getElementById('import_valid_text').innerHTML = "请输入有效的zip文件!";
							return;
						}
						import_window.hide();
						Ext.getBody().mask('正在处理中,请稍候...');
						Ext.getCmp('importFormPanel').getForm().submit({
							url : 'dealClassCode.do?action=importClassCode&indexCC='
									+ indexCC,
							success : function(form, action) {
								var msgTips = "文件导入成功！";
								window.parent.showTips(msgTips, 2);
								classCodeTree.getRootNode().reload();
								Ext.getBody().unmask();
							},
							failure : function(form, action) {
								var msgTips = "文件导入失败!";
								window.parent.showTips(msgTips, 1);
								Ext.getBody().unmask();
							}
						});
						// }
					}
				}, {
					text : '关 闭',
					handler : function() {
						import_window.hide();
					}
				}]
			}],
			modal : true
		});

		// classCode_zip输入框的失去焦点事件函数（校验是否为.zip文件）
		Ext.getCmp('classCode_zip').on("blur", function() {
			// 验证传入的文件名是否为.zip
			var fileName = Ext.getCmp('classCode_zip').getValue();
			var validResult = Ext.validUpZipFile(fileName);
			if (validResult != true) {
				document.getElementById('import_valid_text').innerHTML = validResult;
			} else {
				document.getElementById('import_valid_text').innerHTML = '';
			}
		});
	}
	import_window.show();

}

// 分级代码导出函数（当需要弹出对话框时）
function exportClassCode() {

	// if(!export_window){
	// var exportForm = new Ext.form.FormPanel({
	// baseCls: 'x-plain',
	// labelWidth: 70,
	// defaultType: 'textfield',
	// monitorValid: true,
	// items: [
	// new Ext.form.Radio({
	// id: 'export_mode_1',
	// hideLabel: true,
	// boxLabel: '全 部',
	// name: 'exportMode',
	// value: '1',
	// checked: true
	// }),
	// new Ext.form.Radio({
	// id: 'export_mode_2',
	// hideLabel: true,
	// boxLabel: '指定权限',
	// name: 'exportMode',
	// value: '2'
	// }),
	// new Ext.form.TextField({
	// fieldLabel: '导出表达式',
	// inputType:'text',
	// id:'export_regex',
	// name: 'export_regex',
	// anchor: '100%',
	// allowBlank: false,
	// disabled: true
	// })]
	// });

	// // radio export_mode_2的check事件函数
	// Ext.getCmp('export_mode_2').on("check",function(checkBox,checked){
	// if(checked){
	// Ext.getCmp('export_regex').enable();
	// export_window.export_model = 2;
	// }else{
	// Ext.getCmp('export_regex').disable();
	// export_window.export_model = 1;
	// }
	// });

	// // 初始化弹出框
	// export_window = new Ext.Window({
	// title: '导出分级代码',
	// width:400,
	// height:173,
	// resizable: false,
	// bodyStyle:'padding:5px',
	// closeAction:'hide',
	// plain: true,
	// items: [
	// exportForm,
	// new Ext.Toolbar.TextItem('<font
	// color="red">指定导出权限，如“artery.organ,artery.right.*”'+
	// '<br>表示导出权限字为artery.organ的和权限字前缀为artery.right.的</font>')
	// ],
	// modal : true,
	// buttons: [{
	// text: '导 出',
	// handler: exportSubmit
	// },{
	// text: '关 闭',
	// handler: function(){
	// export_window.hide();
	// }
	// }]
	// });
	// }

	// export_window.export_model = 1; // 初始选择方式为全部
	// export_window.show();

}

// 分级代码导出提交函数
function exportSubmit() {

	var export_frame = document.getElementById('exportClassCode_frame');
	export_frame.src = 'dealClassCode.do?action=exportClassCode&indexCC='
			+ indexCC;
}

// 删除分级代码
function deleteClassCode() {
	var node = selectedNode;
	var parentNode = node.parentNode;
	if (!node) {
		Ext.Msg.alert('警告', '请选择待删除代码!');
		return;
	}
	Ext.Msg.show({
				animEl : 'toolbar_deleteCC',
				title : '确认删除',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				msg : '确定要删除该代码（及其所有子代码）?',
				width : 250,
				fn : function(btn) {
					if (btn == 'yes') {
						var map = new Map();
						map.put("key", "classCode.deleteClassCodeAndChildren");
						map.put("nodeCode", node.attributes.code);
						map.put("parentNodeCode", parentNode.attributes.code);
						map.put("indexCC", indexCC);

						var query = new QueryObj(map, function(query) {
									var msg = query.getDetail();
									var msgTips = "";

									if (msg == "1") {
										msgTips = "删除分级代码成功";
										window.parent.showTips(msgTips, 2);
										freshClassCodeTree2();
									} else {
										msgTips = msg;
										window.parent.showTips(msgTips, 1);
									}
								});
						query.send();
					}
				}
			});
}

// 更新分级代码缓存
function reloadClassCode() {
	var map = new Map();
	map.put("key", "classCode.reloadClassCodeCache");

	var query = new QueryObj(map, function(query) {
				var msg = query.getDetail();
				var msgTips = "";
				if (msg == "ok") {
					msgTips = "更新缓存成功";
					window.parent.showTips(msgTips, 2);
				} else {
					msgTips = msg;
					window.parent.showTips(msgTips, 1);
				}
			});
	query.send();
}
