/**
 * 条件编辑区域
 */
var condEditor = (function(){
	
	var editPanel;		// 编辑区域
	var currNode;		// 当前编辑的节点
	var in_initNode;	// 在初始化节点状态时为true
	var toolbar;		// 工具栏
	
	var equalRadio;		// 等于
	var bigRadio;		// 大于
	var smallRadio;		// 小于
	var containRadio;	// 包含
	var emptyRadio;		// 为空
	
	var reverseCheck;	// 条件取反
	var runCheck;		// 查询时指定
	
	var emptyPanel;		// 空panel，也是报错panel
	
	var numberPanel;	// 数字编辑panel
	var numberField;
	
	var textPanel;		// 文本编辑panel
	var textField;
	
	var datePanel;		// 日期编辑panel
	var dateField;
	
	var normalPanel;	// 普通代码panel
	var classPanel;		// 分级代码panel
	var organPanel;		// 组织机构panel
	
	/**
	 * 编辑条件
	 */
	function editCond(node){
		in_initNode = true;
		if(node.attributes.logicType!="cond"){
			showBlankPanel();
			return ;
		}
		
		currNode = node;
		var dt = node.attributes.dataType;
		if(dt=="number"){	// 数字
			editNumberCond();
		}else if(dt=="text"){	// 文本
			editTextCond();
		}else if(dt=="date"){	// 日期
			editDateCond();
		}else if(dt=="normalcode"){	// normalcode
			editNormalCodeCond();
		}else if(dt=="classcode"){	// classcode
			editClassCodeCond();
		}else if(dt=="organ"){	// organ
			editOrganCond();
		}else{
			editPanel.getLayout().setActiveItem(0);
		}
		setCondType(node);
		in_initNode = false;
	}
	
	/**
	 * 设置条件类型的enable
	 */
	function enableCondType(ca){
		equalRadio.setDisabled(ca[0]!=1);
		bigRadio.setDisabled(ca[1]!=1);
		smallRadio.setDisabled(ca[2]!=1);
		containRadio.setDisabled(ca[3]!=1);
	}
	
	/**
	 * 设置条件类型
	 */
	function setCondType(node){
		var ct = node.attributes.condType;
		var rev = node.attributes.condReverse;
		var run = node.attributes.condRun;
		equalRadio.setValue("equal"===ct);
		bigRadio.setValue("big"===ct);
		smallRadio.setValue("small"===ct);
		containRadio.setValue("contain"===ct);
		emptyRadio.setValue("empty"===ct);
		if(Ext.isEmpty(ct)){
			equalRadio.setValue(true);
			reverseCheck.setValue(false);
			runCheck.setValue(false);
		}else{
			reverseCheck.setValue("true"==rev);
			runCheck.setValue("true"==run);
		}
	}
	
	/**
	 * 获得条件类型
	 */
	function getCondType(){
		if(equalRadio.getValue()){
			return "equal";
		}else if(bigRadio.getValue()){
			return "big";
		}else if(smallRadio.getValue()){
			return "small";
		}else if(containRadio.getValue()){
			return "contain";
		}else if(emptyRadio.getValue()){
			return "empty";
		}
	}
	
	/**
	 * 编辑数字
	 */
	function editNumberCond(){
		editPanel.getLayout().setActiveItem(1);
		enableCondType([1,1,1,0]);
		numberField.setValue(currNode.attributes.condValue);
	}
	
	/**
	 * 编辑文本
	 */
	function editTextCond(){
		editPanel.getLayout().setActiveItem(2);
		enableCondType([1,0,0,1]);
		textField.setValue(currNode.attributes.condValue);
	}
	
	/**
	 * 编辑日期
	 */
	function editDateCond(){
		editPanel.getLayout().setActiveItem(3);
		enableCondType([1,1,1,0]);
		dateField.setValue(currNode.attributes.condValue);
	}
	
	/**
	 * 编辑普通代码
	 */
	function editNormalCodeCond(){
		enableCondType([1,0,0,0]);
		var codeType = currNode.attributes.prop_codeType;
		if(Ext.isEmpty(codeType)){
			document.getElementById("errorMsg_panel").innerHTML = "<font color=red>没有指定代码类型</font>";
			editPanel.getLayout().setActiveItem(0);
			return null;
		}
		
		normalPanel.getLoader().baseParams.codeType = codeType;
		normalPanel.root.reload(function(){
			var condValue = currNode.attributes.condValue;
			var ns = true;
			normalPanel.root.eachChild(function(innerNode){
				if(innerNode.attributes.codeValue==condValue){
					normalPanel.selectNode = innerNode;
					innerNode.setText("<font color=red>"+innerNode.attributes.codeName+"</font>");
					ns = false;
					return false;
				}
			});
			if(ns){
				normalPanel.selectNode = null;
			}
		});
		editPanel.getLayout().setActiveItem(4);
	}
	
	/**
	 * 编辑分级代码
	 */
	function editClassCodeCond(){
		enableCondType([1,0,0,0]);
		var codeType = currNode.attributes.prop_codeType;
		if(Ext.isEmpty(codeType)){
			document.getElementById("errorMsg_panel").innerHTML = "<font color=red>没有指定分级代码类型</font>";
			editPanel.getLayout().setActiveItem(0);
			return null;
		}
		
		classPanel.getLoader().baseParams.codeType = codeType;
		classPanel.root.reload(function(){
			
		});
		
		editPanel.getLayout().setActiveItem(5);
	}
	
	/**
	 * 编辑组织机构
	 */
	function editOrganCond(){
		enableCondType([1,0,0,0]);
		// 选择类型，user，dept，corp
		var organType = currNode.attributes.prop_organType;
		if(Ext.isEmpty(organType)){
			document.getElementById("errorMsg_panel").innerHTML = "<font color=red>没有指定组织选择类型</font>";
			editPanel.getLayout().setActiveItem(0);
			return null;
		}
		
		organPanel.getLoader().baseParams.organType = organType;
		organPanel.organType = organType;
		organPanel.root.reload(function(){
			
		});
		editPanel.getLayout().setActiveItem(6);
	}
	
	/**
	 * 保存条件到node
	 */
	function saveCondToNode(){
		if(in_initNode){
			return ;
		}
		if(!currNode){
			return ;
		}
		var dt = currNode.attributes.dataType;
		if(dt=="number"){
			numberField.saveCond();
		}else if(dt=="text"){
			textField.saveCond();
		}else if(dt=="date"){
			dateField.saveCond();
		}else if(dt=="normalcode"){
			normalPanel.saveCond();
		}else if(dt=="classcode"){
			classPanel.saveCond();
		}else if(dt=="organ"){
			organPanel.saveCond();
		}
	}
	
	/**
	 * 改变节点状态
	 */
	function changeCurrNode(showValue,condValue){
		if(!currNode){
			return ;
		}
		var fieldShow = currNode.attributes.fieldShowName;
		var ct = getCondType();
		if(ct=="equal"){
			if(runCheck.getValue()){
				currNode.attributes.condType="equal";
				currNode.attributes.condRun = "true";
				currNode.attributes.condValue = null;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 不等于 %查询时指定%");
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 等于 %查询时指定%");
				}
			}else if(!Ext.isEmpty(condValue)){
				currNode.attributes.condType="equal";
				currNode.attributes.condRun = "false";
				currNode.attributes.condValue = condValue;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 不等于 "+showValue);
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 等于 "+showValue);
				}
			}
		}else if(ct=="big"){
			if(runCheck.getValue()){
				currNode.attributes.condType="big";
				currNode.attributes.condRun = "true";
				currNode.attributes.condValue = null;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 小于等于 %查询时指定%");
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 大于 %查询时指定%");
				}
			}else if(!Ext.isEmpty(condValue)){
				currNode.attributes.condType="big";
				currNode.attributes.condRun = "false";
				currNode.attributes.condValue = condValue;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 小于等于 "+showValue);
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 大于 "+showValue);
				}
			}
		}else if(ct=="small"){
			if(runCheck.getValue()){
				currNode.attributes.condType="small";
				currNode.attributes.condRun = "true";
				currNode.attributes.condValue = null;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 大于等于 %查询时指定%");
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 小于 %查询时指定%");
				}
			}else if(!Ext.isEmpty(condValue)){
				currNode.attributes.condType="small";
				currNode.attributes.condRun = "false";
				currNode.attributes.condValue = condValue;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 大于等于 "+showValue);
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 小于 "+showValue);
				}
			}
		}else if(ct=="contain"){
			if(runCheck.getValue()){
				currNode.attributes.condType="contain";
				currNode.attributes.condRun = "true";
				currNode.attributes.condValue = null;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 不包含 %查询时指定%");
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 包含 %查询时指定%");
				}
			}else if(!Ext.isEmpty(condValue)){
				currNode.attributes.condType="contain";
				currNode.attributes.condRun = "false";
				currNode.attributes.condValue = condValue;
				if(reverseCheck.getValue()){
					currNode.attributes.condReverse = "true";
					currNode.setText(fieldShow+" 不包含 "+showValue);
				}else{
					currNode.attributes.condReverse = "false";
					currNode.setText(fieldShow+" 包含 "+showValue);
				}
			}
		}else if(ct=="empty"){
			currNode.attributes.condType="empty";
			currNode.attributes.condRun = "false";
			currNode.attributes.condValue = null;
			if(reverseCheck.getValue()){
				currNode.attributes.condReverse = "true";
				currNode.setText(fieldShow+" 不为空 ");
			}else{
				currNode.attributes.condReverse = "false";
				currNode.setText(fieldShow+" 为空 ");
			}
		}
	}
	
	/**
	 * 取消此条件配置，并显示空页面
	 */
	function cancelCondHandler(){
		if(!currNode){
			return ;
		}
		
		currNode.attributes.condType= null;
		currNode.attributes.condValue = null;
		currNode.setText(currNode.attributes.fieldShowName);
		var dt = currNode.attributes.dataType;
		if(dt=="1"){
			numberField.cancelCond();
		}else if(dt=="2"){
			textField.cancelCond();
		}else if(dt=="3"){
			dateField.cancelCond();
		}else if(dt=="5"){
			normalPanel.cancelCond();
		}else if(dt=="6"){
			classPanel.cancelCond();
		}else if(dt=="7"){
			organPanel.cancelCond();
		}
	}
	
	/**
	 * 初始化数字panel
	 */
	function initNumberPanel(){
		numberField = new Ext.form.NumberField({
			fieldLabel: "请输入数字",
			enableKeyEvents: true,
			width: 200
		});
		numberPanel = new Ext.form.FormPanel({
			border: false,
			bodyStyle: "padding: 5px;",
			items: [numberField]
		});
		numberField.saveCond = function(){
			var tv = numberField.getValue()+"";
			changeCurrNode(tv,tv);
		}
		numberField.cancelCond = function(){
			numberField.setValue();
		}
		numberField.on("keyup",function(){
			var tv = numberField.getValue()+"";
			if(Ext.isEmpty(tv)){
				cancelCondHandler();
			}else{
				changeCurrNode(tv,tv);
			}
		});
	}
	
	/**
	 * 初始化文本panel
	 */
	function initTextPanel(){
		textField = new Ext.form.TextField({
			fieldLabel: "请输入文本",
			enableKeyEvents: true,
			width: 200
		});
		textPanel = new Ext.form.FormPanel({
			border: false,
			bodyStyle: "padding: 5px;",
			items: [textField]
		});
		textField.saveCond = function(){
			var tv = textField.getValue();
			changeCurrNode(tv,tv);
		}
		textField.cancelCond = function(){
			textField.setValue();
		}
		textField.on("keyup",function(){
			var tv = textField.getValue();
			if(Ext.isEmpty(tv)){
				cancelCondHandler();
			}else{
				changeCurrNode(tv,tv);
			}
		});
	}
	
	/**
	 * 初始化日期panel
	 */
	function initDatePanel(){
		dateField = new Ext.form.DateField({
			fieldLabel: "请输入日期",
			format: "Y-m-d",
			readOnly: true,
			width: 200,
			onSelect: function(m, d){
        		this.setValue(d);
        		this.fireEvent('select', this, d);
        		this.menu.hide();
        		var d = this.getValue();
				if(Ext.isEmpty(d)){
					cancelCondHandler();
				}else{
					var dv = d.dateFormat("Y-m-d");
					changeCurrNode(dv,dv);
				}
    		}
		});
		dateField.saveCond = function(){
			var d = this.getValue();
			var dv = Ext.isEmpty(d) ? "" : d.dateFormat("Y-m-d");
			changeCurrNode(dv,dv);
		}
		dateField.cancelCond = function(){
			dateField.setValue();
		}
		datePanel = new Ext.form.FormPanel({
			border: false,
			bodyStyle: "padding: 5px;",
			items: [dateField]
		});
	}
	
	/**
	 * 初始化代码panel
	 */
	function initNormalPanel(){
		normalPanel = new Ext.tree.TreePanel({
			border: false,
			rootVisible: false,
			loader: new Ext.tree.TreeLoader({
				dataUrl: sys.getContextPath()+'/artery/search.do?action=loadNormalCode'
			}),
			root: new Ext.tree.AsyncTreeNode({
				text: "根"
			})
		});
		normalPanel.saveCond = function(){
			if(currNode){
				var codeType = currNode.attributes.prop_codeType;
				var sv,cv;
				if(!Ext.isEmpty(codeType) && normalPanel.selectNode){
					if(normalPanel.selectNode){
						sv = normalPanel.selectNode.attributes.codeName;
						cv = normalPanel.selectNode.attributes.codeValue;
						changeCurrNode(sv,cv);
					}else{
						changeCurrNode(null,null);
					}
				}
			}
		}
		normalPanel.cancelCond = function(){
			if(normalPanel.selectNode){
				var codeName = normalPanel.selectNode.attributes.codeName;
				normalPanel.selectNode.setText(codeName);
				normalPanel.selectNode = null;
			}
		}
		normalPanel.on("click", function(node){
			if(normalPanel.selectNode){
				var codeName = normalPanel.selectNode.attributes.codeName;
				normalPanel.selectNode.setText(codeName);
			}
			node.setText("<font color=red>"+node.attributes.codeName+"</font>");
			normalPanel.selectNode = node;
			this.saveCond();
		});
	}
	
	/**
	 * 初始化分级代码panel
	 */
	function initClassPanel(){
		classPanel = new Ext.tree.TreePanel({
			border: false,
			rootVisible: false,
			animate: false,
			autoScroll: true,
			loader: new Ext.tree.TreeLoader({
				dataUrl: sys.getContextPath()+'/artery/search.do?action=loadClassCode'
			}),
			root: new Ext.tree.AsyncTreeNode({
				text: "根"
			})
		});
		classPanel.getLoader().on("beforeLoad", function(loader,node){
			if(node==classPanel.root){
				this.baseParams.root = "true";
			}else{
				this.baseParams.root = "false";
				this.baseParams.code = node.attributes.codeValue;
			}
		});
		classPanel.saveCond = function(){
			if(currNode){
				var codeType = currNode.attributes.prop_codeType;
				var sv,cv;
				if(!Ext.isEmpty(codeType)){
					if(classPanel.selectNode){
						sv = classPanel.selectNode.attributes.codeName;
						cv = classPanel.selectNode.attributes.codeValue;
						changeCurrNode(sv,cv);
					}else{
						changeCurrNode(null,null);
					}
				}
			}
		}
		classPanel.cancelCond = function(){
			if(classPanel.selectNode){
				var codeName = classPanel.selectNode.attributes.codeName;
				classPanel.selectNode.setText(codeName);
				classPanel.selectNode = null;
			}
		}
		classPanel.on("click", function(node){
			if(classPanel.selectNode){
				var codeName = classPanel.selectNode.attributes.codeName;
				classPanel.selectNode.setText(codeName);
			}
			node.setText("<font color=red>"+node.attributes.codeName+"</font>");
			classPanel.selectNode = node;
			this.saveCond();
		});
	}
	
	/**
	 * 初始化人员选择panel
	 */
	function initOrganPanel(){
		organPanel = new Ext.tree.TreePanel({
			border: false,
			rootVisible: false,
			animate: false,
			autoScroll: true,
			loader: new Ext.tree.TreeLoader({
				dataUrl: sys.getContextPath()+'/artery/search.do?action=loadOrgan'
			}),
			root: new Ext.tree.AsyncTreeNode({
				text: "根"
			})
		});
		organPanel.getLoader().on("beforeLoad", function(loader,node){
			if(node==organPanel.root){
				this.baseParams.root = "true";
			}else{
				this.baseParams.root = "false";
				this.baseParams.cid = node.attributes.cid;
				this.baseParams.type = node.attributes.type;
			}
		});
		organPanel.saveCond = function(){
			if(currNode){
				var organType = currNode.attributes.prop_organType;
				if(!Ext.isEmpty(organType)){
					if(organPanel.selectNode){
						var sv = organPanel.selectNode.attributes.name;
						var cv = organPanel.selectNode.attributes.cid;
						changeCurrNode(sv,cv);
					}else{
						changeCurrNode(null,null);
					}
				}
			}
		}
		organPanel.cancelCond = function(){
			if(organPanel.selectNode){
				var name = organPanel.selectNode.attributes.name;
				organPanel.selectNode.setText(name);
				organPanel.selectNode = null;
			}
		}
		organPanel.on("click", function(node){
			if(organPanel.organType==node.attributes.type){
				if(organPanel.selectNode){
					var name = organPanel.selectNode.attributes.name;
					organPanel.selectNode.setText(name);
				}
				node.setText("<font color=red>"+node.attributes.name+"</font>");
				organPanel.selectNode = node;
				this.saveCond();
			}
		});
	}
	
	/**
	 * 初始化条件编辑panel
	 */
	function initPanel(){
		emptyPanel = new Ext.Panel({
			border: false,
			bodyStyle: "padding: 5px;",
			html: "<span id='errorMsg_panel'>aaa</span>"
		});
		
		initNumberPanel();
		initTextPanel();
		initDatePanel();
		initNormalPanel();
		initClassPanel();
		initOrganPanel();
	}
	
	/**
	 * 初始化tbar
	 */
	function initToolbar(){
		equalRadio = new Ext.form.Radio({
			boxLabel: "等于",
			name: "condType",
			checked: true
		});
		equalRadio.on("check",function(r,v){
			saveCondToNode();
		});
		bigRadio = new Ext.form.Radio({
			boxLabel: "大于",
			name: "condType"
		});
		bigRadio.on("check",function(r,v){
			saveCondToNode();
		});
		smallRadio = new Ext.form.Radio({
			boxLabel: "小于",
			name: "condType"
		});
		smallRadio.on("check",function(r,v){
			saveCondToNode();
		});
		containRadio = new Ext.form.Radio({
			boxLabel: "包含",
			name: "condType"
		});
		containRadio.on("check",function(r,v){
			saveCondToNode();
		});
		emptyRadio = new Ext.form.Radio({
			boxLabel: "为空",
			name: "condType"
		});
		emptyRadio.on("check",function(r,v){
			saveCondToNode();
		});
		reverseCheck = new Ext.form.Checkbox({
			boxLabel: "条件取反"
		});
		reverseCheck.on("check",function(r,v){
			saveCondToNode();
		});
		runCheck = new Ext.form.Checkbox({
			boxLabel: "查询时指定"
		});
		runCheck.on("check",function(r,v){
			saveCondToNode();
		});
		var clearCondButton = new Ext.Toolbar.Button({
			cls: "x-btn-icon",
			tooltip: "清空当前条件",
			icon: sys.getContextPath()+"/artery/pub/images/icon/delete_all.gif",
			handler: function(){
				cancelCondHandler()
			}
		});
		toolbar = new Ext.Toolbar([
			equalRadio," | ",
			bigRadio," | ",
			smallRadio," | ",
			containRadio," | ",
			emptyRadio," | ",
			reverseCheck," | ",
			runCheck, "->",
			clearCondButton
		]);
	}
	
	/**
	 * 初始化方法
	 */
	function init(){
		initToolbar();
		initPanel();
	
		editPanel = new Ext.Panel({
			region: 'center',
			margins: '4 4 0 0',
			layout: "card",
			activeItem: 0,
			tbar: toolbar,
			items: [
				emptyPanel,
				numberPanel,
				textPanel,
				datePanel,
				normalPanel,
				classPanel,
				organPanel
			]
		});
	}
	
	/**
	 * 显示默认面板，并清空警告信息
	 */
	function showBlankPanel(){
		enableCondType([1,1,1,1]);
		document.getElementById("errorMsg_panel").innerHTML = "";
		editPanel.getLayout().setActiveItem(0);
		currNode = null;
	}
	
	return {
		initEditor: init,
		getPanel: function(){
			return editPanel
		},
		editCond: editCond,
		showBlankPanel: showBlankPanel
	}
})();