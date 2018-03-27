/**
 * linkto设置窗口
 */

FormEditor = function() {
	/* ----------------------- private变量 ----------------------- */
	var init = false;
	var formProp; 				// form属性编辑器
	var formTree; 				// 构建库Tree
	var selectedFormNode; 		// 选中的表单节点
	var formWindow; 			// 表单编辑窗口
	var startInfo; 				// 开始时的表单信息
	var saveCallback; 			// 保存时需要调用的callback
	var search_box; 		 	// 表单搜索框

	var targetField; 			// 打开位置
	var runTimeTypeField; 		// 运行时类型 display update insert
	var targetWidthField; 		// 宽度
	var targetHeightField; 		// 高度
	var targetLeftField; 		// 距离左边的距离
	var targetTopField; 		// 距离顶部的距离
	var targetRightField;		// 距离右边的距离
	var targetBottomField;		// 距离底部的距离
	var modalField;				// 模态设置
	//var locationField; 			// 是否显示地址栏
	//var menubarField; 			// 是否显示菜单栏
	//var statusField; 				// 是否显示状态栏
	//var titlebarField; 			// 是否显示标题栏
	//var toolbarField; 			// 是否显示工具栏
	var resizableField; 		// 是否可以调整大小
	var urlField; 				// 连接地址
	var paramsRequestField;		// 参数从request获取
	var titleField; 			// 标题信息
	var cfgField;				// 配置项信息
	var fullScreenField;        //是否全屏
	var forceContextPathField;  //是否强制ContextPath

	var path_organArray;
	var path_i;
	
	var treeFormType = null;           //显示表单类型
	
	var printRecord = new Ext.data.Record({name:'打印',value: 'print'});

	/* ----------------------- private方法 ----------------------- */

	function clickNodeHandler(node, e) {
		// 停止编辑状态
		formProp.stopEditing();
		if (node.attributes.type != 'form' && node.attributes.type != 'frame') {
			selectedFormNode = null;
			formProp.setSource({});
			return;
		}
		selectedFormNode = node;
		formWindow.body.mask("正在加载参数,请稍候...");
		// 从服务器获得电子表单（优先级最高的构件库中）的参数
		var map = new Map();
		var formType = node.attributes.formtype;
		map.put("key", "formmake.getFormParam");
		map.put("formId", node.attributes.cid); // 电子表单编号
		map.put("complibId", node.attributes.complibId); // 构件库ID
		map.put("formType", formType); // 电子表单类型
		
		var store = runTimeTypeField.getStore();
		if(formType == '1' && store.getCount() == 4){
			store.insert(3, [printRecord]);
		}else if(formType != '1' && store.getCount() == 5){
			store.removeAt(3);
		}
		
		var query = new QueryObj(map, function(query) {
			formWindow.body.unmask();
			var paramArray = Ext.decode(query.getDetail());
			clickNodeCallback(paramArray);
		});
		query.send();
	}

	// 单击节点回调函数（ajax请求后）
	function clickNodeCallback(paramArray) {
		var pMap = {};
		// 如果电子表单节点编号相同，则加载信息到参数Map中
		if (startInfo && startInfo.formId == selectedFormNode.attributes.cid) {
			var par = startInfo.params;
			if (par) {
				for (var i = 0; i < paramArray.length; i++) {
					var name = paramArray[i].name;
					var sna = paramArray[i].showName;
					var tmp = name + "<font color=red>&nbsp;&nbsp;" + sna
							+ "</font>";
					if (par[name]) {
						pMap[tmp] = par[name];
					} else {
						pMap[tmp] = "";
					}
				}
			} else {
				for (var i = 0; i < paramArray.length; i++) {
					var name = paramArray[i].name;
					var sna = paramArray[i].showName;
					var tmp = name + "<font color=red>&nbsp;&nbsp;" + sna
							+ "</font>";
					pMap[tmp] = "";
				}
			}
		} else {
			for (var i = 0; i < paramArray.length; i++) {
				var name = paramArray[i].name;
				var sna = paramArray[i].showName;
				var tmp = name + "<font color=red>&nbsp;&nbsp;" + sna
						+ "</font>";
				pMap[tmp] = "";
			}
		}
		formProp.setSource(pMap);
	}

	// 清除表单
	function clearFormInfo() {
		// 停止编辑状态
		formProp.stopEditing();
		if (saveCallback) {
			saveCallback(null);
		}
		formWindow.setVisible(false);
	}

	// 保存电子表单信息到编辑器中
	function saveFormInfoToEditor() {
		// 停止编辑状态
		formProp.stopEditing();

		var jsonObj = {};
		// 没有选电子表单，如果输入了url，则可以保存
		if (selectedFormNode) {
			jsonObj.formId = selectedFormNode.attributes.cid;
			jsonObj.formName = selectedFormNode.text;
			jsonObj.formType = selectedFormNode.attributes.formtype;
			var pMap = {};
			var sour = formProp.getSource();
			for (var p in sour) {
				var pos = p.indexOf("<font color=red>");
				var paramName = p.substring(0, pos);
				pMap[paramName] = sour[p];
			}
			jsonObj.params = pMap;
		} else {
			var urlStr = urlField.getValue();
			if (urlStr != null && urlStr.trim() != "") {
				jsonObj.url = urlStr;
				jsonObj.params = {};
			} else {
				formWindow.setVisible(false);
				return;
			}
		}
		// 保存表单信息
		jsonObj.target = targetField.el.dom.value;
		jsonObj.targetWidth = targetWidthField.getValue();
		jsonObj.targetHeight = targetHeightField.getValue();
		jsonObj.runTimeType = runTimeTypeField.getValue();
		jsonObj.targetLeft = targetLeftField.getValue();
		jsonObj.targetTop = targetTopField.getValue();
		jsonObj.targetRight = targetRightField.getValue();
		jsonObj.targetBottom = targetBottomField.getValue();
		jsonObj.modal = modalField.getValue();
		jsonObj.resizable = resizableField.getValue();
		jsonObj.title = titleField.getValue();
		jsonObj.wincfg = cfgField.getValue();
		jsonObj.fullScreen = fullScreenField.getValue();
		jsonObj.forceContextPath = forceContextPathField.getValue();
		if(paramsRequestField.getValue()=="true"){
			jsonObj.paramsRequest = "true";
		}
		if (saveCallback) {
			saveCallback(jsonObj);
		}
		formWindow.setVisible(false);
	}

	// 根据表名，快速定位表节点
	function findFormById(formid, showNoMsg, complibId) {
		if (formid != null && formid != "") {
			if(formid == search_box.searchFormId && complibId == search_box.searchComplibId){
				if(++search_box.searchAccount >= search_box.searchPathList.length){
					search_box.searchAccount = 0; //循环
				}
				var path = "/root/" + search_box.searchPathList[search_box.searchAccount].replace(/,/g, "/");
				formTree.expandPath(path, "cid", function(bSuccess, oLastNode){
					if(bSuccess){
						formTree.fireEvent('click', oLastNode);
					}
				});
			}else{
				var map = new Map();
				map.put("key", "complib.findFormPath");
				map.put("formid", formid);
				map.put("complibId", complibId);
				var query = new QueryObj(map, function() {
					result = Ext.decode(query.getDetail());
					if (result.rs == "ok") {
						var path = result.path;
						search_box.searchFormId = formid;
						search_box.searchComplibId = complibId;
						search_box.searchAccount = 0;
						search_box.searchPathList = path;;
						formTree.expandPath("/root/" + path[0].replace(/,/g, "/"), "cid", function(bSuccess, oLastNode){
							if(bSuccess){
								formTree.fireEvent('click', oLastNode);
								markStartForm();
							}
						});
					} else {
						search_box.searchFormId = "";
						search_box.searchComplibId = "";
						search_box.searchAccount = 0;
						search_box.searchPathList = {};;
						if(result.rs == "no"){
							showTips("未找到符合条件的表单", 2)
						}else{
							showTips(result.rs, 2)
						}
					}
				});
				query.send();
			}
		}else{
			search_box.searchText = "";
            search_box.searchAccount = 0;
            search_box.searchPathList = {};
		}
	}

	// 标记初始选中的节点
	function markStartForm() {
		if (selectedFormNode && startInfo) {
			var selFormId = selectedFormNode.attributes.cid;
			var staFormId = startInfo.formId;
			if (selFormId == staFormId) {
				var formType = selectedFormNode.attributes.formtype;
				var title = null;
				if (formType == "5") {
					title = "框架页面 -- 初始选中( <font color=red>"
							+ selectedFormNode.text + "</font> )";
				} else {
					title = "电子表单 -- 初始选中( <font color=red>"
							+ selectedFormNode.text + "</font> )";
				}
				formWindow.setTitle(title);
			}
		}
	}

	// 初始化参数输入组件
	function initParamPanel() {
		var targetStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['_window', '_window'], ['_blank', '_blank'],
					['_self', '_self'], ['_parent', '_parent'],
					['_top', '_top']]
		});
		targetField = new Ext.form.ComboBox({
			fieldLabel : "打开位置",
			store : targetStore,
			valueField : 'value',
			displayField : 'name',
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '98%'
		});
		var runtimeStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['展示', 'display'], ['更新', 'update'],
					['插入', 'insert'],['打印', 'print'],['继承', 'parent']]
		});
		runTimeTypeField = new Ext.form.ComboBox({
			fieldLabel : "运行类型",
			store : runtimeStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		targetWidthField = new Ext.form.NumberField({
			fieldLabel : "宽度",
			anchor : '98%'
		});
		targetHeightField = new Ext.form.NumberField({
			fieldLabel : "高度",
			anchor : '100%'
		});
		targetLeftField = new Ext.form.NumberField({
			fieldLabel : "左边距",
			anchor : '98%'
		});
		targetTopField = new Ext.form.NumberField({
			fieldLabel : "顶边距",
			anchor : '100%'
		});
		targetRightField = new Ext.form.NumberField({
			fieldLabel : "右边距",
			anchor : '98%'
		});
		targetBottomField = new Ext.form.NumberField({
			fieldLabel : "底边距",
			anchor : '100%'
		});
		var modalStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['模态', '1'], ['非模态', '2']]
		});
		modalField = new Ext.form.ComboBox({
			fieldLabel : "模态设置",
			store : modalStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '98%'
		});
		var allowStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['允许', '1'], ['禁止', '0']]
		});
		resizableField = new Ext.form.ComboBox({
			fieldLabel : "调整大小",
			store : allowStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		urlField = new Ext.form.TextField({
			fieldLabel : "URL地址",
			anchor : '98%'
		});
		var paramsReqStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['true', 'true'], ['false', 'false']]
		});
		paramsRequestField = new Ext.form.ComboBox({
			fieldLabel : "请求传参",
			store : paramsReqStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		titleField = new Ext.form.TextField({
			fieldLabel: "窗口标题",
			anchor: "98%"
		});
		cfgField = new Ext.form.TriggerField({
			fieldLabel: "窗体配置",
			anchor: "100%",
			onTriggerClick: function(){
				var cv = cfgField.getValue();
				var conf = {
					language: "javascript",
					code: cv,
					name: "窗体配置",
					callback: function(codeValue){
						cfgField.setValue(codeValue);
					}
				};
				var url = sys.getContextPath()+"/artery/components/textEditor/editor.jsp";
				window.showModalDialog(url,conf,"dialogWidth:850px;dialogHeight:550px;resizable:on");
			}
		});
		var fullScreenStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['是', 'true'], ['否', 'false']]
		});
		fullScreenField = new Ext.form.ComboBox({
			fieldLabel : "是否全屏",
			store : fullScreenStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		var forceContextPathStore = new Ext.data.SimpleStore({
			fields : ['name', 'value'],
			data : [['true', 'true'], ['false', 'false']]
		});
		forceContextPathField = new Ext.form.ComboBox({
			fieldLabel : "强制ContextPath",
			store : forceContextPathStore,
			valueField : 'value',
			displayField : 'name',
			editable : false,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			anchor : '100%'
		});
		var pp = new Ext.Panel({
			region : 'south',
			layout : 'column',
			height : 220,
			bodyStyle : "padding:3px;",
			items : [{
				columnWidth : .5,
				baseCls : 'x-plain',
				layout : 'form',
				items : [targetField, targetWidthField,
						targetLeftField, targetRightField, modalField,
						titleField,urlField,fullScreenField],
				labelWidth : 55
			}, {
				columnWidth : .5,
				baseCls : 'x-plain',
				layout : 'form',
				items : [runTimeTypeField, targetHeightField,
						targetTopField, targetBottomField,
						resizableField,cfgField,paramsRequestField,forceContextPathField],
				labelWidth : 100
			}]
		});
		return pp;
	}

	function initFormTree() {
		var nloader = new Ext.tree.TreeLoader({
			dataUrl : sys.getContextPath() + '/artery/complib.do?action=loadForm'
		});
		formTree = new Ext.tree.TreePanel({
			region : 'west',
			animate : false,
			margins : '4 4 4 4',
			width : 200,
			autoScroll : true,
			enableDD : false,
			loader: nloader,
			containerScroll : true,
			rootVisible: false,
			tbar : [search_box]
		});
		// 加载节点时,传输其他参数
		nloader.on("beforeload", function(treeLoader, node) {
			this.baseParams.type = node.attributes.type;
			this.baseParams.cid = node.attributes.cid;
			this.baseParams.complibId = node.attributes.complibId;
			this.baseParams.formTypeShow = treeFormType;
		});
		
		var nroot = new Ext.tree.AsyncTreeNode({
			type : 'root',
			iconCls : 'root',
			text : 'root',
			cid : 'root',
			expanded: true,
			leaf : false
		});
		formTree.setRootNode(nroot);
		
		// 对树进行排序
        new Ext.tree.TreeSorter(formTree, {
        	folderSort: true,
       		dir: "asc",
            sortType : function(node){
            	if(0 == node.attributes.cid.indexOf("eform")){	//构件库按照优先级顺序排
            		return node.attributes.complibId;
            	}
            	return node.text;
            }
       	});
	}

	function initWindow() {
		if(init){
			return ;
		}
		
		search_box = new Ext.form.TriggerField({
            emptyText : '请输入表单id或名称',
            width : 195,
            selectOnFocus: true,
            triggerClass : "x-form-search-trigger",
            searchFormId : "",
            searchComplibId : "",
            searchAccount : 0,
            searchPathList : {},
            onTriggerClick: function(){
            	var formid = search_box.getValue();
            	findFormById(formid, true);
            }
        });
        

		var paramPanel = initParamPanel();
		initFormTree();

		formProp = new Ext.grid.PropertyGrid({
			region : 'center',
			margins : '0 0 4 0',
			source : {}
		});
		formWindow = new Ext.Window({
			title : '电子表单',
			width : 670,
			height : 425,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			closable : true,
			border : false,
			layout : 'border',
			items : [formTree, {
				region : 'center',
				layout : 'border',
				margins : '4 4 4 0',
				border : false,
				items : [formProp, paramPanel]
			}],
			buttons : [{
				text : '清除并关闭',
				handler : clearFormInfo
			}, {
				text : '刷新电子表单',
				handler : function() {
					formTree.root.reload();
				}
			}, {
				text : '确 定',
				handler : saveFormInfoToEditor
			}, {
				text : '取 消',
				handler : function() {
					formWindow.setVisible(false);
				}
			}]
		});

		// 注册单击事件
		formTree.on("click", clickNodeHandler);
		init = true;
	}

	// 清空参数
	function clearParams() {
		targetField.setValue();
		targetWidthField.setValue();
		targetHeightField.setValue();
		runTimeTypeField.setValue("insert");
		targetLeftField.setValue();
		targetTopField.setValue();
		targetRightField.setValue();
		targetBottomField.setValue();
		modalField.setValue("2");
		resizableField.setValue("0");
		urlField.setValue();
		titleField.setValue();
		cfgField.setValue();
		fullScreenField.setValue("false");
		forceContextPathField.setValue("true");
	}
	
	function isEqual(oldFormType, newFormType){
		if(oldFormType == null || newFormType == null){
			if(oldFormType != null || newFormType != null){
				return false;
			}
			return true;
		}
		if(oldFormType.indexOf(",") == -1 && newFormType.indexOf(",") == -1){
			return oldFormType == newFormType;
		}else{
			if(oldFormType.indexOf(",") != -1 || newFormType.indexOf(",") != -1){
				return false;
			}
			var oldTypes = oldFormType.split(",");
			var newTypes = newFormType.split(",");
			var tempTypes = {};
			for(var type in oldTypes){
				tempTypes[type] = type;
			}
			for(var tempType in newTypes){
				if(tempTypes[tempType] == null){
					return false;
				}
			}
			if(oldTypes.length == newTypes.length){
				return true;
			}
			return false;
		}
	}

	/* ----------------------- public方法 ----------------------- */
	return {
		// 初始化方法
		init : function() {
			initWindow();
		},

		/*
		 * 编辑属性 @callback 当保存时调用此方法
		 */
		edit : function(callback, formInfo, formTypeShow) {
			saveCallback = callback;
			startInfo = formInfo;
			// 清空选中节点，刷新根节点，清空表单属性
			selectedFormNode = null;
			formProp.setSource({});
			if(!isEqual(treeFormType, formTypeShow)){
				treeFormType = formTypeShow;
				formTree.root.reload();
			}
			formWindow.show();
			formWindow.setTitle("电子表单");
			clearParams();
			// 选中当前表单节点
			if(!startInfo){
				startInfo = {target:'_blank'};
			}
			if (startInfo) {
				if (startInfo.target) {
					targetField.el.dom.value = startInfo.target;
				}
				if (startInfo.targetWidth!=null) {
					targetWidthField.setValue(startInfo.targetWidth);
				}
				if (startInfo.targetHeight!=null) {
					targetHeightField.setValue(startInfo.targetHeight);
				}
				if (startInfo.runTimeType) {
					runTimeTypeField.setValue(startInfo.runTimeType);
				}
				if (startInfo.targetLeft!=null) {
					targetLeftField.setValue(startInfo.targetLeft);
				}
				if (startInfo.targetTop!=null) {
					targetTopField.setValue(startInfo.targetTop);
				}
				if(startInfo.targetRight!=null){
					targetRightField.setValue(startInfo.targetRight);
				}
				if(startInfo.targetBottom!=null){
					targetBottomField.setValue(startInfo.targetBottom);
				}
				if(startInfo.modal!=null){
					modalField.setValue(startInfo.modal);
				}
				if (startInfo.resizable != null) {
					resizableField.setValue(startInfo.resizable);
				}
				if (startInfo.url) {
					urlField.setValue(startInfo.url);
				}
				if (startInfo.fullScreen != null) {
					fullScreenField.setValue(startInfo.fullScreen);
				}
				if (startInfo.forceContextPath != null) {
					forceContextPathField.setValue(startInfo.forceContextPath);
				}
				if (startInfo.paramsRequest){
					paramsRequestField.setValue("true");
				} else {
					paramsRequestField.setValue("false");
				}
				if(startInfo.title){
					titleField.setValue(startInfo.title);
				}
				if(startInfo.wincfg){
					cfgField.setValue(startInfo.wincfg);
				}
				if(startInfo.formId!==undefined && startInfo.formType!==undefined){
					var formStr = startInfo.formId + "_" + startInfo.formType;
					findFormById(formStr, false);
				}
			}
		}
	};
}();