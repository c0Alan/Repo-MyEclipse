Ext.ns("AtyCon");

/**
 * form表单制作页面
 */
AtyCon.FormManager = function(){
	
	var init = false;		// 是否初始化
	var cardIndex;			// 卡片位置
	
	var tabpanel;			// tabpanel,包括三个页面
	var layoutManager;		// 界面设计
	var paramsPanel;
	var dsPanel;
	
	var currComplibId;		// 当前构件库编号
	var currFormid;			// 当前表单编号
	var loadParams;			// 是否加载params
	var loadDS;				// 是否加载datasource
	
	/**
	 * 初始化表单制作页面
	 */
	function initTabLayout(){
		layoutManager = AtyCon.Form_Layout;
		var lp = layoutManager.initLayout();
		
		paramsPanel = new AtyCon.Form_Params({
			title: "入口参数"
		});
        dsPanel = new AtyCon.Form_DS({
        	title: "数据源配置"
        });
		
		tabpanel=new Ext.TabPanel({
			activeTab: 0,
            plain:false,
            showType: "eform",
            tabPosition:'bottom',
            defaults:{autoScroll: true},
            items:[
            	lp,
            	paramsPanel,
            	dsPanel
            ]
        });
        
        tabpanel.on("tabchange",function(tp,tab){
        	if(tab instanceof AtyCon.Form_Params){
        		if(!loadParams){
        			loadParams = true;
        			paramsPanel.showParams({
        				formid: currFormid,
        				complibId: currComplibId,
        				formtype: "1"
        			});
        		}
        	}else if(tab instanceof AtyCon.Form_DS){
        		if(!loadDS){
        			loadDS = true;
        			dsPanel.showDS({
        				formid: currFormid,
        				complibId: currComplibId,
        				formtype: "1"
        			});
        		}
        	}
        });
	}
	
	/**
	 * 执行初始化
	 */
	function doInit(){
		initTabLayout();
		init = true;
	}
	
	/**
	 * 显示指定的form制作窗口
	 */
	function showForm(complibId, formid,panel){
		if(!init){
			doInit();
			cardIndex = panel.items.length;
			panel.add(tabpanel);
		}
		currFormid = formid;
		currComplibId = complibId;
		loadParams = false;
		loadDS = false;
		panel.getLayout().setActiveItem(cardIndex);
		tabpanel.activate(0);
		layoutManager.showLayout(complibId, formid);
	}
	
	/**
	 * 检查表单是否有修改
	 */
	function checkModify(){
		var msg = [];
		if(layoutManager.isModify()){
			msg.push("\"<font color=red>表单模板</font>\"");
		}
		if(loadParams && paramsPanel.isModify()){
			msg.push("\"<font color=red>入口参数</font>\"");
		}
		if(loadDS && dsPanel.isModify()){
			msg.push("\"<font color=red>数据源配置</font>\"");
		}
		if(msg.length==0){
			return null;
		}else{
			var msg = msg.join("，");
			msg += "  没有保存，确定要切换节点？";
			return msg;
		}
	}

	return {
		showForm: showForm,
		isModify: checkModify
	};
}();