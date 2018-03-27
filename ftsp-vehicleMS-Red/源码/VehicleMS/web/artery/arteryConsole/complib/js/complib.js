Ext.ns("AtyCon");

/**
 * 构件库管理对象
 */
AtyCon.CompManager = (function(){
	
	var selectedNode;		// 当前选中的节点
	var copyNode;			// copy的节点
	var complibTree;		// 构件库树
	var centerPanel;		// 中心panel，用于用于放置各种编辑窗口
	
	var createMenuWindow;	// 创建类别窗口
	var cm_parentname;		// 父目录名称
	var cm_name;			// 目录名称
	
	var editMenuWindow;		// 修改类别窗口
	var em_name;			// 目录名称
	
	var editFormWindow;		// 修改表单窗口
	var editform_id;
	var editForm_Name;
	var editForm_needlogin;
	var editForm_Type;
	var editForm_visitRight;
	var editForm_logicClass;
	var editForm_Descript;
	var editForm_btn_submit;
	
	var selectHelpWindow;	// 选择帮助条目窗口
	var window_helpTree;
	
	// 构件树工具栏上的按钮
	var tb_addMenu;
	var tb_addForm;
	var tb_delete;
//	var tb_copy;
//	var tb_paste;
	var search_box;
	
	// 右键快捷菜单
	var leibieMenu;			// 类别快捷菜单
	var formMenu;			// 表单快捷菜单
	
	/**
	 * 创建构件树
	 */
	function makeComplibTree(){
		tb_addMenu = new Ext.Toolbar.Button({
        	cls : 'x-btn-icon addcomp',
        	tooltip : '新建类别',
        	handler : createMenuHandler
		});
		tb_addForm = new Ext.Toolbar.Button({
            cls : 'x-btn-icon addform',
            tooltip : '新建表单',
            handler : createFormHandler
		});
		tb_delete = new Ext.Toolbar.Button({
            cls : 'x-btn-icon delete',
            tooltip : '删除对象',
            handler : deleteHandler
		});
//		tb_copy = new Ext.Toolbar.Button({
//            cls : 'x-btn-icon copy',
//            tooltip : '复制',
//            handler : copyHandler
//        });
//        tb_paste = new Ext.Toolbar.Button({
//            cls : 'x-btn-icon paste',
//            tooltip : '粘贴',
//            handler : pasteHandler
//        });
        search_box = new Ext.form.TriggerField({
            emptyText : '请输入表单id或名称',
            width : 215,
            selectOnFocus: true,
            triggerClass : "x-form-search-trigger",
            searchFormId : "",
            searchComplibId : "",
            searchAccount : 0,
            searchPathList : {},
            onTriggerClick: function(){
            	var formid = search_box.getValue();
            	findFormById(formid);
            }
        });
		complibTree = new Ext.tree.TreePanel({
			animate : false,
			autoScroll : true,
			enableDD: true,
			ddGroup: "complib_TreeDD",
			border: true,
			rootVisible: false,
			containerScroll: true,
			loader: new Ext.tree.TreeLoader({
				dataUrl:"complib.do?action=loadTree"
			}),
			region : 'west',
			margins : '4 0 4 4',
			width : 220,
			split : true,
			minSize : 175,
			maxSize : 400,
			title : '构件库',
			header : true,
			collapsible : true,
			hideCollapseTool : true,
			collapseMode : 'mini',
			tools : [{
            	id : 'refresh',
            	qtip : '刷新缓存<br>刷新所有类型的表单模板',
            	handler : refreshHandler
       		}, {
            	id : 'search',
            	qtip : '查找Id相同的表单<br>查找与当前所选表单Id相同的表单',
            	handler : searchHandler
       		}, {
            	id : 'left',
            	qtip : '关闭导航树',
            	handler : function(event, toolEl, panel) {
              		panel.collapse(true);
            	}
        	}],
      		tbar : [
      			tb_addMenu,
      			tb_addForm,
      			tb_delete, '-'
//      			tb_copy,
//      			tb_paste
      		],
            bbar : [search_box]
        });
          
        // 加载节点时,传输其他参数
        complibTree.getLoader().on("beforeload", function(treeLoader, node) {
        	this.baseParams.type = node.attributes.type;
            this.baseParams.cid = node.attributes.cid;
            this.baseParams.complibId = node.attributes.complibId;
       	});  
        // 单击事件
        complibTree.on('click',switchButton);
        
        // 设置根节点
        var root = new Ext.tree.AsyncTreeNode({
        	text: 'root',
            draggable:false,
            cid:'root',
            type: 'root',	
            iconCls:'root',
            formtype:'root'
        });
          
        // 对树进行排序
        new Ext.tree.TreeSorter(complibTree, {
            folderSort: true,
            dir: "asc",
            sortType : function(node){
            	if(0 == node.attributes.cid.indexOf("eform")){	//构件库按照优先级顺序排
            		return node.attributes.complibId;
            	}
            	return node.text;
            }
        });
          
        // 注册拖拽事件
        complibTree.on("beforemovenode",dragNodeHander);
        // 注册右键单击事件
        complibTree.on("contextmenu",showContextMenu,complibTree);
        complibTree.setRootNode(root);
        root.expand();
        //complibTree.getRootNode().expand();
    }
	
	/**
	 * 改变主页面显示的内容
	 */
	function changePage(node){
		selectedNode = node;
		var link;
		if (node.attributes.type == 'form') {
//			tb_paste.setDisabled(true);
//			tb_copy.setDisabled(false);
			tb_delete.setDisabled(false);
			tb_addForm.setDisabled(true);
			tb_addMenu.setDisabled(true);
			if(node.attributes.formtype==1){
				var formid = node.attributes.cid;
				var complibId = node.attributes.complibId;
				AtyCon.FormManager.showForm(complibId, formid, centerPanel);
				return ;
			}
			link = "complib.do?action=editForm&formtype="+ node.attributes.formtype + "&id=" + node.attributes.cid 
						+ "&complibId=" + node.attributes.complibId;
		} else {
//			if (copyNode){
//				tb_paste.setDisabled(false);
//			}else{
//				tb_paste.setDisabled(true);
//			}
			tb_delete.setDisabled(node == complibTree.root);
//			tb_copy.setDisabled(node == complibTree.root);
			tb_addForm.setDisabled(false);
			tb_addMenu.setDisabled(false);
			link = "complib.do?action=welcome&id=" + node.attributes.cid + "&complibId=" + node.attributes.complibId;
		}
		
		centerPanel.getLayout().setActiveItem("card_frame");                                 
		Ext.get("iframeCnt").dom.src = link;
	}
	
	// 树上节点单击事件函数
	function switchButton(node) {
		//alert(node.attributes.complibId);
		if(selectedNode==node){
			return ;
		}
		var ai = centerPanel.getLayout().activeItem;
		if(ai==null){
			changePage(node);
		}else if(ai.showType=="eform"){
			var cm = AtyCon.FormManager.isModify();
			if(cm!=null){
				Ext.Msg.confirm('信息', cm, function(btn){
           			if (btn == 'yes') {
               			changePage(node);
           			}
       			});
			}else{
				changePage(node);
			}
		}else{
			changePage(node);
		}
	}

	/*
	 * 创建类别事件函数
	 */
	function createMenuHandler() {
		// 如果选中节点不是目录，则什么也不做
		if (!selectedNode || selectedNode.attributes.type != 'menu') {
			return;
		}
		if (!createMenuWindow.isVisible()) {
			createMenuWindow.setTitle('新建类别');
			cm_parentname.setValue(selectedNode.text);
			cm_name.setValue(''); // 清空已填值
			createMenuWindow.show();
		}
	}
	
	/**
	 * 插入类别事件函数
	 */
	function insertMenuHandler(){
		if (!cm_name.validate()) {
			return;
		}
		var map = new Map();
		map.put("key", "complib.insertMenu");
		map.put("name", cm_name.getValue()); // 类型名称
		map.put("pid", selectedNode.attributes.cid); // 父类别编号
		map.put("complibId", selectedNode.attributes.complibId); // 构件库编号
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				createMenuWindow.hide();
				showTips("新建类别成功", 2);
				selectedNode.reload();
			} else {
				showTips(msg, 4);
			}
		});
		query.send();
	}
	
	/**
	 * 初始化创建类别窗口
	 */
	function initCreateMenuWindow(){
		cm_parentname = new Ext.form.TextField({
			fieldLabel : '父类别',
			disabled : true,
			allowBlank : false,
			anchor : '100%'
		});
		cm_name = new Ext.form.TextField({
			fieldLabel : '名称',
			allowBlank : false,
			validator : function(val) {
				//if (/[\\/:*?"<>|]/.test(val)) {
				//	return "不能包含以下字符：\\/:*?\"<>|";
				//}
				return true;
			},
			anchor : '100%'
		});
		var form = new Ext.form.FormPanel({
			baseCls : 'x-plain',
			labelWidth : 55,
			labelAlign : 'right',
			defaultType : 'textfield',
			items : [cm_parentname, cm_name]
		});
		
		form.on('render',function(){
			new Ext.KeyMap(form.getForm().getEl().dom.id, {
				key : 13, // or Ext.EventObject.ENTER
				fn : function() {
					insertMenuHandler.call(this)
				},
				scope : this
			});
		},this)
		
		
		createMenuWindow = new Ext.Window({
			title : '新建类别',
			width : 260,
			height : 140,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			modal: true,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			items : form,
			buttons : [{
				text : '创建',
				handler : insertMenuHandler
			}, {
				text : '取消',
				handler : function() {
					createMenuWindow.setVisible(false);
				}
			}]
		});
	}

	// 修改类别名称
	function editMenuHandler() {
		if (selectedNode == complibTree.root){
			return;
		}
		
		if (!editMenuWindow.isVisible()) {
			editMenuWindow.setTitle('重命名');
			em_name.setValue(selectedNode.text);
			editMenuWindow.show();
		}
	}

	/**
	 * 更新类别
	 */
	function updateMenuHandler(){
		if (!em_name.validate()) {
			return;
		}
		// 如果名称一样，就什么也不做
		if (em_name.getValue() == selectedNode.text) {
			return;
		}
		var map = new Map();
		map.put("key", "complib.updateMenu");
		map.put("name", em_name.getValue()); // 类型名称
		map.put("id", selectedNode.attributes.cid); // 父类别编号
		map.put("complibId", selectedNode.attributes.complibId); // 构件库编号
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				editMenuWindow.hide();
				showTips("重命名成功", 2);
				selectedNode.setText(em_name.getValue());
			} else {
				editMenuWindow.hide();
				showTips(msg, 4);
			}
		});
		query.send();
	}

	/**
	 * 初始化类别编辑窗口
	 */
	function initEditMenuWindow(){
		em_name = new Ext.form.TextField({
			fieldLabel : '名称',
			allowBlank : false,
			validator : function(val) {
				//if (/[\\/:*?"<>|]/.test(val)) {
				//	return "不能包含以下字符：\\/:*?\"<>|";
				//}
				return true;
			},
			anchor : '100%'
		});
	
		var form = new Ext.form.FormPanel({
			baseCls : 'x-plain',
			labelWidth : 55,
			labelAlign : 'right',
			defaultType : 'textfield',
			items : [em_name]
		});
		
		form.on('render',function(){
			new Ext.KeyMap(form.getForm().getEl().dom.id, {
				key : 13, // or Ext.EventObject.ENTER
				fn : function() {
					updateMenuHandler.call(this)
				},
				scope : this
			});
		},this)
		
		editMenuWindow = new Ext.Window({
			title : '重命名',
			width : 260,
			height : 110,
			resizable : false,
			closeAction : 'hide',
			modal: true,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			items : form,
			buttons : [{
				text : '修改',
				handler : updateMenuHandler
			}, {
				text : '取消',
				handler : function() {
					editMenuWindow.setVisible(false);
				}
			}]
		});
	}

	// copy node
	function copyHandler() {
		if (!selectedNode){
			return;
		}
		copyNode = selectedNode;
		showTips("复制成功", 2);
	}

	// paste node
	function pasteHandler() {
		var node = selectedNode;
		var map = new Map();
		map.put("key", "complib.paste");
		map.put("parentid", node.attributes.cid); // 接收复制对象的目录id
		map.put("parentComplibId", node.attributes.complibId); // 接收复制对象的目录id
		map.put("copynodeid", copyNode.attributes.cid); // 被复制的对象id
		map.put("copynodeComplibId", copyNode.attributes.complibId); // 被复制的对象id
		map.put("copynodeformtype", copyNode.attributes.formtype); // 被复制的对象formtype
		var query = new QueryObj(map, function(query) {	
			var msg = query.getDetail();
			if (msg == "-1") {
				showTips("粘贴操作失败－－目标和源不能相同", 1);
			} else if (msg == "-2") {
				showTips("粘贴操作失败－－被复制的对象不能粘贴到其子节点下", 1);
			} else if (msg == "ok") {
				showTips("粘贴成功", 2);
				selectedNode.reload();
			}
		});
		query.send();
	}

	/**
	 * 删除按钮事件函数
	 */
	function deleteHandler() {
		if (!selectedNode || selectedNode == complibTree.root){
			return;
		}
		var selectedName = selectedNode.text;
		var type = selectedNode.attributes.type;
		var typeName;
		if (type == 'menu') {
			typeName = '类别';
		} else if (type == 'form') {
			typeName = '表单';
		}
		Ext.Msg.show({
			title : '确认删除',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			msg : '确定要删除' + typeName + '："' + selectedName + '"？',
			fn : function(btn) {
				if (btn == 'yes') {
					doDelete();
				}
			}
		});
	}
	function copyidHandler() {
		if (!selectedNode || selectedNode == complibTree.root){
			return;
		}
		var type = selectedNode.attributes.type;
		if(type == 'form'){
			window.clipboardData.setData('text',selectedNode.attributes.cid);
		}
	}
	
	/**
	 * 进行删除操作
	 */
	function doDelete(){
		var map = new Map();
		map.put("key", "complib.deleteMenuOrForm");
		map.put("type", selectedNode.attributes.type); 			// 对象类型
		map.put("formtype", selectedNode.attributes.formtype); 	// 对象类型
		map.put("id", selectedNode.attributes.cid); 			// 对象编号
		map.put("complibId", selectedNode.attributes.complibId); 			// 对象编号
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				showTips("删除成功", 2);
				if (selectedNode == copyNode) {
					copyNode = null;
				}
				var objparent = selectedNode.parentNode;	// 重新加载父节点
				if (objparent) {
					objparent.reload();
					complibTree.fireEvent('click',objparent);
				}
			} else {
				showTips(msg, 1);
			}
		});
		query.send();
	}

	/**
	 * 创建表单按钮事件函数
	 */
	function createFormHandler(){
		// 如果选中节点不是目录，则什么也不做
		if (!selectedNode || selectedNode.attributes.type != 'menu') {
			return;
		}
		var title = "新建表单，父目录为：" + "<font color=red>" + selectedNode.text + "</font>";
		editFormWindow.setTitle(title);
		// 清空已填值
		editform_id.setValue('');
		editForm_Name.setValue('');
		editForm_Type.enable();
		editForm_Type.setValue('1');
		editForm_visitRight.setValue();
		editForm_logicClass.setValue('');
		editForm_Descript.setValue();
		editForm_btn_submit.setHandler(insertFormHandler);
		editForm_btn_submit.setText("创 建");
		editFormWindow.show();
		//editForm_needlogin.setValue(2);
		editForm_needlogin.setValue(1);
	}

	/**
	 * 插入表单事件函数
	 */
	function insertFormHandler(){
		if (!editForm_Name.validate()) {
			return;
		}
		if (!editForm_Type.validate()) {
			return;
		}
		var desc = editForm_Descript;
		var visitRight = editForm_visitRight.getValue();
		var needlogin = editForm_needlogin.getValue();
		var map = new Map();
		map.put("key", "complib.insertForm");
		map.put("formname", editForm_Name.getValue()); 	// formname
		map.put("formtype", editForm_Type.getValue()); 	// formtype
		map.put("logicClass",editForm_logicClass.getValue()) //逻辑类
		map.put("descript", desc.getValue()); 			// 描述
		map.put("visitRight", visitRight); 				// 访问权限
		map.put("menuid", selectedNode.attributes.cid); // 所属目录
		map.put("complibId", selectedNode.attributes.complibId); // 所属目录
		map.put("needlogin", needlogin); 				// 是否需要登录
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				editFormWindow.hide();
				showTips("新建表单成功", 2);
				selectedNode.reload();	// 重新加载选中节点
			} else {
				editFormWindow.hide();
				showTips(msg, 4);
			}
		});
		query.send();
	}

	// 初始化编辑表窗口
	function initEditFormWindow() {
		// 表单类型store
		var formtypeStore = new Ext.data.SimpleStore({
			fields : ['formtypeId', 'formtypeName'],
			data : [['1', 'form表单'], ['2', '报表'], ['3', '文书']]
		});
		
		editform_id = new Ext.form.TextField({
			fieldLabel : '表单id',
			anchor : '100%'
		});
		editForm_Name = new Ext.form.TextField({
			fieldLabel : '表单名称',
			allowBlank : false,
			validator : function(val) {
				//if (/[\\/:*?"<>|]/.test(val)) {
				//	return "不能包含以下字符：\\/:*?\"<>|";
				//}
				return true;
			},
			anchor : '98%'
		});
		editForm_needlogin = new Ext.form.Checkbox({
			boxLabel : '是否需要登录后才能运行本表单？',
			checked : true,
			hideLabel : true,
			value : 1
		});
		editForm_Type = new Ext.form.ComboBox({
			fieldLabel : '表单类别',
			allowBlank : false,
			disabled : true,
			anchor : '100%',
			store : formtypeStore,
			valueField : 'formtypeId',
			displayField : 'formtypeName',
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			selectOnFocus : true,
			editable : false
		});
		editForm_visitRight = new Ext.form.TriggerField({
			fieldLabel : '访问权限',
			anchor : '100%',
			onTriggerClick: editVisitRight
		});
		editForm_logicClass = new Ext.form.TextField({
			fieldLabel : '逻辑类',
			anchor : '100%'
		});
		editForm_Descript = new Ext.form.HtmlEditor({
			fieldLabel : '描述',
			height : 145,
			width : 523,
			anchor : '99.5%'
		});
		
		var form = new Ext.FormPanel({
			labelWidth: 55,
			frame : true,
			items : [editform_id,{
				layout : 'column',
				items : [{
					columnWidth : 0.5,
					layout : 'form',
					items : [
						editForm_Name,
						editForm_needlogin
					]
				}, {
					columnWidth : .5,
					layout : 'form',
					items : [
						editForm_Type,
						editForm_visitRight
					]
				}]
			}, editForm_logicClass,editForm_Descript]
		});
		
		form.on('render',function(){
			new Ext.KeyMap(form.getForm().getEl().dom.id, {
				key : 13, // or Ext.EventObject.ENTER
				fn : function() {
					editForm_btn_submit.handler.call(this);
				},
				scope : this
			});
		},this)
		
		editForm_btn_submit = new Ext.Button({
			text : '修改',
			minWidth: 80
		});
		editFormWindow = new Ext.Window({
			title : '修改表单',
			width : 600,
			height : 360,
			resizable : false,
			closeAction : 'hide',
			closable : false,
			layout : 'fit',
			plain : true,
			buttonAlign : 'center',
			items : form,
			border : false,
			buttons : [editForm_btn_submit, {
				text : '取 消',
				handler : function() {
					editFormWindow.setVisible(false);
				}
			}]
		});
		var comNeedLogin = editForm_needlogin;
		var comVisitRight = editForm_visitRight;
		comNeedLogin.on("check", function(obj, checked) {
			comVisitRight.setDisabled(!checked);
		});
	}

	// 更新表单事件函数
	function updateFormHandler(){
		if (!editForm_Name.validate()) {
			return;
		}
		var formType = editForm_Type;
		var desc = editForm_Descript;
		var visitRight = editForm_visitRight.getValue();
		var needlogin = editForm_needlogin.getValue();
		var map = new Map();
		map.put("key", "complib.updateForm");
		map.put("formname", editForm_Name.getValue());
		map.put("formtype", formType.getValue());
		map.put("logicClass",editForm_logicClass.getValue()) //逻辑类
		map.put("desc", desc.getValue());
		map.put("visitRight", visitRight);
		map.put("id", selectedNode.attributes.cid);
		map.put("complibId", selectedNode.attributes.complibId);
		map.put("needlogin", needlogin);
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				editFormWindow.hide();
				showTips("修改表单成功", 2);
				// 重新加载选中节点
				selectedNode.parentNode.reload();
				if (selectedNode){
					complibTree.fireEvent('click',selectedNode);
				}
			} else {
				showTips(msg, 4);
			}
		});
		query.send();
	}

	// 编辑访问权限
	function editVisitRight(){
		var rightStr = editForm_visitRight.getValue();
		RightEditor.edit(rightStr,function(rs){
			editForm_visitRight.setValue(rs);
		});
	}

	// 修改表单的属性
	function editFormHandler() {
		// 如果窗口可见，则什么也不做
		if (editFormWindow.isVisible()) {
			return;
		}
		Ext.getBody().mask("正在发送请求,请稍候...");
		// 从服务器获得表的属性
		var map = new Map();
		map.put("key", "complib.getFormInfo");
		map.put("id", selectedNode.attributes.cid);
		map.put("complibId", selectedNode.attributes.complibId);
		map.put("formtype", selectedNode.attributes.formtype);
		var query = new QueryObj(map, function(query) {
			Ext.getBody().unmask();
			var formInfo = Ext.decode(query.getDetail());
			editform_id.setValue(formInfo.id);
			editForm_Name.setValue(formInfo.Name);
			editForm_Type.setValue(formInfo.Type);
			editForm_Descript.setValue(formInfo.Descript);
			editForm_logicClass.setValue(formInfo.LogicClass);
			var title = "修改表单 " + "<font color=red>"+ selectedNode.parentNode.attributes.text + "</font>";
			editFormWindow.setTitle(title);
			if (formInfo.visitRight) {
				editForm_visitRight.setValue(formInfo.visitRight);
			} else {
				editForm_visitRight.setValue();
			}
			// 设置提交按钮事件
			editForm_btn_submit.setHandler(updateFormHandler);
			editForm_btn_submit.setText("修 改");
			editFormWindow.show();
			editForm_needlogin.setValue(formInfo.needlogin);
		});
		query.send();
	}
	
	// 刷新表单缓存
	function refreshHandler() {
		Artery.loading();
		var map = new Map();
		map.put("key", "complib.refresh");
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			if (msg == "ok") {
				complibTree.root.reload();
				AtyCon.Form_Layout.clearMenuCache();
				Artery.loadTrue("刷新所有表单缓存成功");
			} else {
				Artery.loadFalse("未知错误：刷新所有表单缓存失败");
			}
		});
		query.send();
	}
	
	// 查找id相同的表单
	function searchHandler() {
		if (!selectedNode || selectedNode == complibTree.root){
			return;
		}
		findFormById(selectedNode.attributes.cid);
	}

	// 初始化布局
	function initLayout() {
		centerPanel = new Ext.Panel({
			region : 'center',
			margins : '4 4 4 0',
			layout: "card",
			items:[{
				id: "card_frame",
				xtype:"panel",
				showType: "iframe",
				html : {
					id : 'iframeCnt',
					name : 'iframeCnt',
					tag : 'iframe',
					frameborder : 0,
					style : 'width:100%;height:100%'
				}
			}]
		});
		
		new Ext.Viewport({
			layout : 'border',
			border : false,
			hideBorders : true,
			items : [centerPanel, complibTree]
		});
	}

	// 初始化帮助窗口
	function initHelpWindow() {
		window_helpTree = new Ext.tree.TreePanel({
			autoScroll : true,
			animate : false,
			border : false,
			containerScroll : true,
			root : new Ext.tree.AsyncTreeNode({
				id : '0',
				text : '在线帮助',
				iconCls : 'helpRoot',
				draggable : false
			}),
			loader : new Ext.tree.TreeLoader({
				dataUrl : sys.getContextPath() + '/artery/businesshelp/dealBusinesshelp.do?action=loadhelpTree'
			})
		});
	
		window_helpTree.getLoader().on("beforeload", function(treeLoader, node) {
			if (node.attributes.id) {
				this.baseParams.id = node.attributes.id;
			}
		});
		// 记住选中的页节点
		window_helpTree.on('click', function(node) {
			if (node.isLeaf()) {
				selectHelpWindow.selectedNode = node;
			} else {
				selectHelpWindow.selectedNode = null;
			}
		});
		
		selectHelpWindow = new Ext.Window({
			title : '选择帮助手册',
			width : 300,
			height : 435,
			modal : true,
			resizable : false,
			closeAction : 'hide',
			layout : 'fit',
			buttonAlign : 'center',
			items : window_helpTree,
			buttons : [{
				text : '确 定',
				handler : function() {
					if (selectHelpWindow.saveHandler) {
						if (selectHelpWindow.selectedNode) {
							var helpId = selectHelpWindow.selectedNode.attributes.id;
							selectHelpWindow.saveHandler(helpId);
						} else {
							selectHelpWindow.saveHandler("");
						}
					}
					selectHelpWindow.setVisible(false);
				}
			}, {
				text : '取 消',
				handler : function() {
					selectHelpWindow.setVisible(false);
				}
			}]
		});
	}

	/**
	 * 拖拽节点事件函数
	 */
	function dragNodeHander(tree, node, oldP, newP, index) {
		complibTree.body.mask("正在发送请求,请稍候...");
		var map = new Map();
		map.put("key", "complib.dragNode");
		map.put("nodeID", node.attributes.cid); 			// 节点编号
		map.put("nodeType", node.attributes.type); 			// 节点类型，menu或form
		map.put("oldParentID", oldP.attributes.cid); 		// 原来父节点编号
		map.put("oldComplibId", oldP.attributes.complibId); // 原来构件库id
		map.put("newParentID", newP.attributes.cid); 		// 新父节点编号
		map.put("newComplibId", newP.attributes.complibId); // 新构件库id
		map.put("index", index); 							// 节点所在位置编号
		var query = new QueryObj(map, function(query) {
			var msg = query.getDetail();
			var msgTips = "";
			if (msg == '-2') {
				msgTips = "移动操作失败，未知错误";
				// showTips(msgTips,1);
			} else {
				//changeComplibId(node, newP.attributes.complibId);
				node.attributes.complibId = newP.attributes.complibId;
				msgTips = "移动操作成功";
				// showTips(msgTips,2);
				newP.reload();
			}
			complibTree.body.unmask();
		});
		query.send();
		return true;
	}
	
//	function changeComplibId(node, complibId){
//		node.attributes.complibId = complibId;
//		if(node.hasChildNodes()){
//			var cns = this.childNodes;
//			if(cns){
//				for(var i = 0, len = cns.length; i < len; i++){
//					alert(node.text + "___" + cns[i].attributes.complibId);
//					cns[i].attributes.complibId = complibId;
//					alert(node.text + "___" + cns[i].attributes.complibId);
//				}
//			}
//		}
//	}
	
	/**
	 * 初始化快捷菜单
	 */
	function initMenu(){
		var addcomp = new Ext.menu.Item({
			text : '新建类别',
			iconCls : 'menu-addcomp',
			handler : createMenuHandler
		});
		var addform = new Ext.menu.Item({
			text : '新建表单',
			iconCls : 'menu-addform',
			handler : createFormHandler
		});
		var rename = new Ext.menu.Item({
			text : '重命名',
			handler : editMenuHandler
		});
		var mdelete = new Ext.menu.Item({
			text : '删除',
			iconCls : 'menu-delete',
			handler : deleteHandler
		});
//		var copy = new Ext.menu.Item({
//			text : '复制',
//			iconCls : 'menu-copy',
//			handler : copyHandler
//		});
//		var paste = new Ext.menu.Item({
//			text : '粘贴',
//			iconCls : 'menu-paste',
//			handler : pasteHandler
//		});
		leibieMenu = new Ext.menu.Menu({
			items : [
				addcomp,
				addform,
				rename,
				mdelete, '-'
//				copy,
//				paste
			]
		});
		leibieMenu.mi = {
			"addcomp":addcomp,
			"addform":addform,
			"rename":rename,
			"delete":mdelete
//			"copy":copy,
//			"paste":paste
		};
		
		var edit = new Ext.menu.Item({
			text : '修改表单',
			handler : editFormHandler
		});
		var fdelete = new Ext.menu.Item({
			text : '删除',
			iconCls : 'menu-delete',
			handler : deleteHandler
		});
		var copyid = new Ext.menu.Item({
			text : '复制id',
			handler : copyidHandler
		});
		formMenu = new Ext.menu.Menu({
			items : [edit, fdelete, '-',copyid]
//			items : [edit, fdelete, '-', {
//				text : '复制',
//				iconCls : 'menu-copy',
//				handler : copyHandler
//			},copyid]
		});
		formMenu.mi = {
			"edit":edit,
			"delete":fdelete
		};
	}
		
	/**
	 * 在指定节点上显示快捷菜单
	 */
	function showContextMenu(node, e){
		if (node.attributes.type == 'menu') {
			leibieMenu.showAt(e.getXY());
			leibieMenu.mi["rename"].setDisabled(node == complibTree.root);
			leibieMenu.mi["delete"].setDisabled(node == complibTree.root);
//			leibieMenu.mi["copy"].setDisabled(node == complibTree.root);
//			if (copyNode){
//				leibieMenu.mi["paste"].setDisabled(false);
//			}else{
//				leibieMenu.mi["paste"].setDisabled(true);
//			}
		} else if (node.attributes.type == 'form') {
			// 处理只读属性
			if (node.attributes.readOnly == '1') {
				formMenu.mi["edit"].setDisabled(true);
				formMenu.mi["delete"].setDisabled(true);
			} else {
				formMenu.mi["edit"].setDisabled(false);
				formMenu.mi["delete"].setDisabled(false);
			}
			formMenu.showAt(e.getXY());
		}
		if (selectedNode != node) {
			selectedNode = node;
			selectedNode.select();
			switchButton(node);
		}
	}

	// ***************** 根据combobox快速定位表 ******************
	// 根据表单id，快速定位表节点
	function findFormById(formid, complibId) {
		if (formid != null && formid != "") {
			if(formid == search_box.searchFormId && complibId == search_box.searchComplibId){
				if(++search_box.searchAccount >= search_box.searchPathList.length){
					search_box.searchAccount = 0; //循环
				}
				var path = "/root/" + search_box.searchPathList[search_box.searchAccount].replace(/,/g, "/");
				complibTree.expandPath(path, "cid", function(bSuccess, oLastNode){
					if(bSuccess){
						complibTree.fireEvent('click', oLastNode);
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
						complibTree.expandPath("/root/" + path[0].replace(/,/g, "/"), "cid", function(bSuccess, oLastNode){
							if(bSuccess){
								complibTree.fireEvent('click', oLastNode);
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

	var path_organArray;
	var path_i;

	// 根据组织路径字符串，选中用户所在节点
	function clickFormByPath(msg) {
		path_organArray = msg.split(",");
		if (path_organArray[path_organArray.length - 1] == "") {
			path_organArray = path_organArray.slice(0, -1);
		}
		path_i = 0;
		var oprNode = complibTree.root;
		oprNode.expand(false, false, path_expand_callback);
	}
	
	// 递归选中树 add by zhyx
	function expendNode() {
		path_organArray = complib.selectStr.split(",");
		path_i = 0;
		var oprNode = complibTree.root;
		oprNode.expand(false, false, path_expand_callback);
	}
	
	// 递归的展开树节点，走后选中用户
	function path_expand_callback(innerNode) {
		path_i = path_i + 1;
		var nextNode = innerNode.findChild('cid', path_organArray[path_i]);
		if (!nextNode) {
			showTips("error", 4);
			return;
		}
		if ((path_i + 1) >= path_organArray.length) {
			complibTree.fireEvent('click', nextNode);
			return;
		}
		nextNode.expand(false, false, path_expand_callback);
	}
	
	/**
	 * 初始化布局
	 */
	function init(){
		makeComplibTree();
		initMenu();
		initCreateMenuWindow();
		initEditMenuWindow();
		initEditFormWindow();
		initLayout();
		initHelpWindow();
        RightEditor.init();
        complibTree.fireEvent("click",complibTree.root);
        if(complib.selectid !=""){
            expendNode();
        }
	}
	
	return {
		init: init,
		findFormById: findFormById
	};
})();