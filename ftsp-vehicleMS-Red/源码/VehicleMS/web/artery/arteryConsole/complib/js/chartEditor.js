/**
 * chart编辑器
 */
AtyCon.ChartEditor = function(){
};

Ext.apply(AtyCon.ChartEditor.prototype,{
	
	init: false,		// 是否初始化
	window: null,		// 配置窗口
	chartPanel: null,	// chart预览面板
	chartTree: null,	// chart类型树
	propPanel: null,	// 属性编辑区
	propTree: null,		// 属性列表
	chartConf: null,	// chart配置信息
	saveCB: null,		// 保存回调函数
	
	initData1:"<set name='一月' value='110' />"+
			  "<set name='二月' value='143' />"+
			  "<set name='三月' value='179' />"+
			  "<set name='四月' value='150' />"+
			  "<set name='五月' value='89' />"+
			  "<set name='六月' value='200' />"+
			  "<set name='七月' value='105' />"+
			  "<set name='八月' value='140' />"+
			  "<set name='九月' value='50' />"+
			  "<set name='十月' value='30' />"+
			  "</chart>",
	
	initData2: "<categories>"+
			   "<category name='一月' />"+
			   "<category name='二月' />"+
			   "<category name='三月' />"+
			   "<category name='四月' />"+
			   "<category name='五月' />"+
			   "<category name='六月' />"+
			   "<category name='七月' />"+
			   "<category name='八月' />"+
			   "<category name='九月' />"+
			   "<category name='十月' />"+
			   "</categories>"+
			   "<dataset seriesName='2007'>"+
			   "<set name='一月' value='110' />"+
			   "<set name='二月' value='143' />"+
			   "<set name='三月' value='179' />"+
			   "<set name='四月' value='150' />"+
			   "<set name='五月' value='89' />"+
			   "<set name='六月' value='200' />"+
			   "<set name='七月' value='105' />"+
			   "<set name='八月' value='140' />"+
			   "<set name='九月' value='50' />"+
			   "<set name='十月' value='30' />"+
			   "</dataset>"+
			   "<dataset seriesName='2008'>"+
			   "<set name='一月' value='30' />"+
			   "<set name='二月' value='60' />"+
			   "<set name='三月' value='40' />"+
			   "<set name='四月' value='70' />"+
			   "<set name='五月' value='80' />"+
			   "<set name='六月' value='65' />"+
			   "<set name='七月' value='90' />"+
			   "<set name='八月' value='25' />"+
			   "<set name='九月' value='35' />"+
			   "<set name='十月' value='30' />"+
			   "</dataset>"+
			   "</chart>",
	
	initData3: "<colorRange>"+
      		   "<color minValue='0' maxValue='75' code='FF654F'/>"+
      		   "<color minValue='75' maxValue='90' code='F6BD0F'/>"+
      		   "<color minValue='90' maxValue='100' code='8BBA00'/>"+
   			   "</colorRange>"+
   			   "<dials>"+
      		   "<dial value='92' rearExtension='10'/>"+
   			   "</dials>"+
			   "</chart>",

	/**
	 * 编辑chart属性
	 * @param v 配置信息
	 * @param cb 回调函数
	 */
	edit: function(v, cb){
		if(!this.init){
			this.initComp();
		}
		this.window.show();
		this.saveCB = cb;
		if(typeof v == 'object'){
			this.chartConf = v;
		}else{
			this.chartConf = {};
		}
		if(Ext.isEmpty(this.chartConf.chartType)){
			this.chartConf.chartType = "Column2D";
		}
		
		var typeNode = this.chartTree.root.findChild("typeStr", this.chartConf.chartType);
		if(typeNode){
			typeNode.select();
		}
		
		this.showChart();
	},
	
	/**
	 * 执行初始化
	 */
	initComp: function(){
		var me = this;
		this.initChartType();
		this.initPropTree();
		this.initChartPanel();
		this.initPropPanel();
		this.window = new Ext.Window({
			width: 720,
			height: 480,
			closeAction: "hide",
			modal: true,
			resizable: false,
			layout: "border",
			items: [this.chartTree,{
				region: "center",
				border: false,
				layout: "border",
				margins: "4 0 4 0",
				items: [this.chartPanel,this.propPanel]
			},this.propTree],
			buttons: [{
				text: "确定",
				handler: function(){
					if(me.saveCB){
						me.saveCB(Ext.encode(me.chartConf));
					}
					me.window.hide();
				}
			},{
				text: "取消",
				handler: function(){
					me.window.hide();
				}
			}]
		});
	},
	
	// 初始化chart预览区
	initChartPanel: function(){
		this.chartid = Ext.id();
		this.chartPanel = new Ext.Panel({
			region: "center",
			autoScroll: true,
			html: "<table width='100%' height='100%' border=0><tr><td align='center' valign='middle'>"+
			        "<div id='"+this.chartid+"'></div>"+
			      "</td></tr></table>"
		});
	},
	
	// 编辑 showBorder
	initShowBorderPanel: function(){
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["default", "默认"],["1", "显示边框"],["0", "隐藏边框"]]
		});
		var c = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			fieldLabel: "显示边框",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true
		});
		var me = this;
		c.on("select", function(combo, rec, idx){
			var val = rec.get("value");
			if(val=="default"){
				delete (me.chartConf.showBorder);
			}else{
				me.chartConf.showBorder = val;
			}
			me.confChart();
		});
		var p = new Ext.Panel({
			border: false,
			items: [{
				border: false,
				layout: "form",
				labelWidth: 60,
				items:c
			},{
				border: false,
				html: "设置是否显示边框，默认情况下，对于2D图表，显示边框，对于3D图表，不显示边框"
			}],
			dealNode: function(node){
				if(me.chartConf.showBorder===undefined){
					c.setValue("default");
				}else{
					c.setValue(me.chartConf.showBorder);
				}
			}
		});
		return p;
	},
	
	// 颜色编辑器
	initColorPanel: function(){
		var titlePanel = new Ext.Panel({
			border: false,
			bodyStyle: "font-size:12px;",
			colspan: 3
		});
		var errorPanel = new Ext.Panel({
			border: false
		});
		var colorPalette = new Ext.ColorPalette({
			rowspan: 3,colspan: 1
		});
		colorPalette.on("select", function(cp, color){
			colorField.setValue(color);
			colorPanel.getColorEl().setStyle("background-color","#"+color);
			errorPanel.body.update("");
		});
		var colorField = new Ext.form.TextField({
			width: 200,
			colspan: 2,
			enableKeyEvents: true
		});
		var textRegExp = new RegExp("^[\\da-fA-F]{6}$");
		colorField.on("keyup", function(){
			var cv = colorField.getValue();
			if(textRegExp.test(cv)){
				try{
					colorPanel.getColorEl().setStyle("background-color","#"+cv);
				}catch(e){}
			}
		});
		var colorPanel = new Ext.Panel({
			border: false,
			colspan: 2,
			bodyStyle: "font-size:12px;",
			html: "颜色效果：<span class='color-tag' style='height:10px;width:60px;'></span>",
			getColorEl: function(){
				if(this.colorEl){
					return this.colorEl;
				}else{
					this.colorEl = this.body.child(".color-tag");
					return this.colorEl;
				}
			}
		});
		
		var applyButton = new Ext.Button({
			text: "应用颜色",
			handler: function(){
				var cv = colorField.getValue();
				if(Ext.isEmpty(cv)){
					delete me.chartConf[titlePanel.propNode.attributes.propStr];
					errorPanel.body.update("");
					me.confChart();
				}else if(textRegExp.test(cv)){
					me.chartConf[titlePanel.propNode.attributes.propStr] = cv;
					errorPanel.body.update("");
					me.confChart();
				}else{
					errorPanel.body.update("<span style='font-size:12px;color:red;'>颜色格式非法</span>");
				}
			}
		});
		var me = this;
		var p = new Ext.Panel({
			border: false,
			layout:'table',
			layoutConfig: {
				columns: 3
			},
			items: [
				titlePanel,
				colorPalette,
				colorField,
				colorPanel,
				applyButton,
				errorPanel
			]
		});
		p.dealNode = function(node){
			me.setPropTitle(titlePanel,node);
			var color = me.chartConf[node.attributes.propStr];
			if(color===undefined || color==null){
				try{ colorPalette.select();} catch(e){}
				colorField.setValue();
				colorPanel.getColorEl().setStyle("background-color","");
			}else{
				try{
					colorPalette.select(color);
				} catch(e){}
				colorField.setValue(color);
				try{
					colorPanel.getColorEl().setStyle("background-color","#"+color);
				}catch(e){}
			}
		};
		return p;
	},
	
	// 数字编辑器
	initNumberPanel: function(){
		var me = this;
		var titlePanel = new Ext.Panel({
			border: false,
			bodyStyle: "font-size:12px;",
			colspan: 2
		});
		var numberField = new Ext.form.NumberField({
			width: 200
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var nv = numberField.getValue();
				if(Ext.isEmpty(nv) && nv!==0){
					delete me.chartConf[titlePanel.propNode.attributes.propStr];
					me.confChart();
				}else{
					me.chartConf[titlePanel.propNode.attributes.propStr] = nv;
					me.confChart();
				}
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'table',
			layoutConfig: {
				columns: 2
			},
			items: [
				titlePanel,
				numberField,{
					border: false,
					bodyStyle: "padding-left: 4px;",
					items: applyButton
				}
			]
		});
		p.dealNode = function(node){
			me.setPropTitle(titlePanel,node);
			var propVal = me.chartConf[node.attributes.propStr];
			if(propVal===undefined || propVal==null){
				numberField.setValue();
			}else{
				numberField.setValue(propVal);
			}
		}
		return p;
	},
	
	// 字符串编辑器
	initStringPanel: function(){
		var me = this;
		var titlePanel = new Ext.Panel({
			border: false,
			bodyStyle: "font-size:12px;",
			colspan: 2
		});
		var textField = new Ext.form.TextField({
			width: 200
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var nv = textField.getValue();
				if(nv==undefined || nv==null || nv===""){
					delete me.chartConf[titlePanel.propNode.attributes.propStr];
					me.confChart();
				}else{
					me.chartConf[titlePanel.propNode.attributes.propStr] = nv;
					me.confChart();
				}
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'table',
			layoutConfig: {
				columns: 2
			},
			items: [
				titlePanel,
				textField,{
					border: false,
					bodyStyle: "padding-left: 4px;",
					items: applyButton
				}
			]
		});
		p.dealNode = function(node){
			me.setPropTitle(titlePanel,node);
			var propVal = me.chartConf[node.attributes.propStr];
			if(propVal===undefined || propVal==null){
				textField.setValue();
			}else{
				textField.setValue(propVal);
			}
		}
		return p;
	},
	
	// y坐标文字方向
	initYDirectionPanel: function(){
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["v", "垂直显示"],["h", "水平显示"]]
		});
		var c = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			fieldLabel: "y轴方向",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true
		});
		var me = this;
		c.on("select", function(combo, rec, idx){
			var val = rec.get("value");
			if(val=="v"){
				delete (me.chartConf.rotateYAxisName);
			}else{
				me.chartConf.rotateYAxisName = "0";
			}
			me.confChart();
		});
		var p = new Ext.Panel({
			border: false,
			items: [{
				border: false,
				layout: "form",
				labelWidth: 60,
				items:c
			},{
				border: false,
				html: "设置y轴文字方法，水平显示文字时，可以写中文，垂直显示时，不能显示中文"
			}],
			dealNode: function(node){
				if(me.chartConf.rotateYAxisName===undefined){
					c.setValue("v");
				}else{
					c.setValue("h");
				}
			}
		});
		return p;
	},
	
	// 字体编辑器
	initFontPanel: function(){
		var me = this;
		var titlePanel = new Ext.Panel({
			border: false,
			bodyStyle: "font-size:12px;",
			colspan: 2
		});
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["default", "默认字体"],
					["Times", "Times"],
					["Helvetica","Helvetica"],
					["Western","Western"],
					["Courier","Courier"],
					["serif","serif"],
					["sans-serif","sans-serif"],
					["cursive","cursive"],
					["monospace","monospace"]]
		});
		var c = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true
		});
		c.on("select", function(combo, rec, idx){
			var val = rec.get("value");
			if(val=="default"){
				delete (me.chartConf[titlePanel.propNode.attributes.propStr]);
			}else{
				me.chartConf[titlePanel.propNode.attributes.propStr] = val;
			}
			fontPanel.setFont(val);
			me.confChart();
		});
		var fontPanel = new Ext.Panel({
			bodyStyle: "padding-left: 30px;",
			border: false,
			html: "<span>字体效果 abc</span>",
			setFont: function(ft){
				if(!this.fontEl){
					this.fontEl = this.body.child("span");
				}
				this.fontEl.setStyle("font-family",ft);
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'table',
			layoutConfig: {
				columns: 2
			},
			items: [
				titlePanel,
				c,
				fontPanel
			]
		});
		p.dealNode = function(node){
			me.setPropTitle(titlePanel,node);
			var propVal = me.chartConf[node.attributes.propStr];
			if(propVal===undefined || propVal==null){
				c.setValue("default");
			}else{
				c.setValue(propVal);
			}
			fontPanel.setFont(propVal);
		}
		return p;
	},
	
	// 数据颜色渐变
	initDataGradient: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["default", "默认设置"],["same", "相同颜色"],["gradient","渐变颜色"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "设置方式",
			width: 182
		});
		var textField = new Ext.form.TextField({
			fieldLabel: "具体颜色",
			width: 200
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var val = textField.getValue();
				if(!Ext.isEmpty(val)){
					me.chartConf.plotGradientColor = val;
					me.confChart();
				}
			}
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="default"){
				delete (me.chartConf.plotGradientColor);
				me.confChart();
			}else if(val=="same"){
				me.chartConf.plotGradientColor = "";
				me.confChart();
			}else if(val=="gradient"){
				textField.enable();
				applyButton.enable();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,textField,applyButton],
			dealNode: function(node){
				var val = me.chartConf.plotGradientColor;
				if(val===undefined){
					combo.setValue("default");
					textField.setValue("");
					textField.disable();
					applyButton.disable();
				}else if(val===""){
					combo.setValue("same");
					textField.setValue("");
					textField.disable();
					applyButton.disable();
				}else{
					combo.setValue("gradient");
					textField.setValue(val);
					textField.enable();
					applyButton.enable();
				}
			}
		});
		return p;
	},
	
	// 显示数据边框
	initDataBorder: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["show", "显示边框（默认）"],["hide", "隐藏边框"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "边框",
			width: 182
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="show"){
				delete (me.chartConf.showPlotBorder);
				me.confChart();
			}else if(val=="hide"){
				me.chartConf.showPlotBorder = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo],
			dealNode: function(node){
				var val = me.chartConf.showPlotBorder;
				if(val===undefined){
					combo.setValue("show");
				}else if(val==="0"){
					combo.setValue("hide");
				}
			}
		});
		return p;
	},
	
	// 虚线边框设置
	initDataDashed: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["solid", "实线（默认）"],["dashed", "虚线"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "边框类型",
			width: 182
		});
		var dashLen = new Ext.form.NumberField({
			width: 200,
			fieldLabel: "实线长度"
		});
		var dashGap = new Ext.form.NumberField({
			width: 200,
			fieldLabel: "间隙距离"
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				me.chartConf.plotBorderDashed = "1";
				var len = dashLen.getValue();
				if(!Ext.isEmpty(len)){
					me.chartConf.plotBorderDashLen = len;
				}else{
					delete (me.chartConf.plotBorderDashLen);
				}
				var gap = dashGap.getValue();
				if(!Ext.isEmpty(gap)){
					me.chartConf.plotBorderDashGap = gap;
				}else{
					delete (me.chartConf.plotBorderDashGap);
				}
				me.confChart();
			}
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="solid"){
				delete (me.chartConf.plotBorderDashed);
				delete (me.chartConf.plotBorderDashLen);
				delete (me.chartConf.plotBorderDashGap);
				dashLen.disable();
				dashGap.disable();
				applyButton.disable();
				me.confChart();
			}else if(val=="dashed"){
				me.chartConf.plotBorderDashed = "1";
				dashLen.enable();
				dashGap.enable();
				applyButton.enable();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,dashLen,dashGap,applyButton],
			dealNode: function(node){
				if(me.chartConf.plotBorderDashed){
					combo.setValue("dashed");
					dashLen.enable();
					dashLen.setValue(me.chartConf.plotBorderDashLen);
					dashGap.enable();
					dashGap.setValue(me.chartConf.plotBorderDashGap);
					applyButton.enable();
				}else{
					combo.setValue("solid");
					dashLen.disable();
					dashGap.disable();
					applyButton.disable();
				}
			}
		});
		return p;
	},
	
	// 圆角框样式
	initRoundEdges: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["common", "普通风格（默认）"],["roundEdge", "圆角风格"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "展示风格",
			width: 182
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="common"){
				delete (me.chartConf.useRoundEdges);
				me.confChart();
			}else if(val=="roundEdge"){
				me.chartConf.useRoundEdges = "1";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,{
				border: false,
				html: "圆角风格只对2D柱状图、2D棒图起作用，设置圆角风格后，将使部分属性失效"
			}],
			dealNode: function(node){
				if(me.chartConf.useRoundEdges){
					combo.setValue("roundEdge");
				}else{
					combo.setValue("common");
				}
			}
		});
		return p;
	},
	
	// 是否显示标签
	initLabelShowBorder: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["showLabel", "显示标签（默认）"],["hideLabel", "隐藏标签"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示标签",
			width: 182
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="showLabel"){
				delete (me.chartConf.showLabels);
				me.confChart();
			}else if(val=="hideLabel"){
				me.chartConf.showLabels = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,{
				border: false,
				html: "隐藏标签后，可以通过编程来控制每个数据项是否显示标签"
			}],
			dealNode: function(node){
				if(me.chartConf.showLabels==="0"){
					combo.setValue("hideLabel");
				}else{
					combo.setValue("showLabel");
				}
			}
		});
		return p;
	},
	
	// 标签显示模式
	initLabelDisplay: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["wrap", "自动换行（默认）"],["rotate_90", "垂直显示"],["rotate_45", "倾斜显示"],["stagger", "交错显示"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示模式",
			width: 182
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="wrap"){
				delete (me.chartConf.labelDisplay);
				me.confChart();
			}else if(val=="rotate_90"){
				me.chartConf.labelDisplay = "rotate";
				me.confChart();
			}else if(val=="rotate_45"){
				me.chartConf.labelDisplay = "rotate";
				me.chartConf.slantLabels = "1";
				me.confChart();
			}else if(val=="stagger"){
				me.chartConf.labelDisplay = "stagger";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,{
				border: false,
				html: "倾斜或垂直显示时，不能够写中文"
			}],
			dealNode: function(node){
				if(me.chartConf.labelDisplay==undefined){
					combo.setValue("wrap");
				}else if(me.chartConf.labelDisplay=="rotate"){
					if(me.chartConf.slantLabels=="1"){
						combo.setValue("rotate_45");
					}else{
						combo.setValue("rotate_90");
					}
				}else if(me.chartConf.labelDisplay=="stagger"){
					combo.setValue("stagger");
				}
			}
		});
		return p;
	},
	
	// 值显示格式
	initValueShow: function(){
		var me = this;
		var store1 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["showValue", "显示文字（默认）"],["hideValue", "隐藏文字"]]
		});
		var combo = new Ext.form.ComboBox({
			store: store1,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示文字值",
			width: 182
		});
		combo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="showValue"){
				delete (me.chartConf.showValues);
				me.confChart();
			}else if(val=="hideValue"){
				me.chartConf.showValues = "0";
				me.confChart();
			}
		});
		var store2 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["h", "水平显示（默认）"],["v", "竖直显示"]]
		});
		var rotateCombo = new Ext.form.ComboBox({
			store: store2,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示方向",
			width: 182
		});
		rotateCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="h"){
				delete (me.chartConf.rotateValues);
				me.confChart();
			}else if(val=="v"){
				me.chartConf.rotateValues = "1";
				me.confChart();
			}
		});
		var store3 = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["out", "外部显示（默认）"],["in", "内部显示"]]
		});
		var insideCombo = new Ext.form.ComboBox({
			store: store3,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示位置",
			width: 182
		});
		insideCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="out"){
				delete (me.chartConf.placeValuesInside);
				me.confChart();
			}else if(val=="in"){
				me.chartConf.placeValuesInside = "1";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			items: [combo,rotateCombo,insideCombo],
			dealNode: function(node){
				if(me.chartConf.showValues==="0"){
					combo.setValue("hideValue");
				}else{
					combo.setValue("showValue");
				}
				if(me.chartConf.rotateValues==="1"){
					rotateCombo.setValue("v");
				}else{
					rotateCombo.setValue("h");
				}
				if(me.chartConf.placeValuesInside==="1"){
					insideCombo.setValue("in");
				}else{
					insideCombo.setValue("out");
				}
			}
		});
		return p;
	},
	
	// 仪表盘 显示边框
	initGaugeShowBorder: function(){
		var me = this;
		var borderStore = new Ext.data.SimpleStore({
			fields: ['value','text'],
			data: [["show", "显示边框（默认）"],["hide", "隐藏边框"]]
		});
		var showCombo = new Ext.form.ComboBox({
			store: borderStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示边框"
		});
		showCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="show"){
				delete (me.chartConf.showGaugeBorder);
				me.confChart();
			}else if(val=="hide"){
				me.chartConf.showGaugeBorder = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 60,
			items: [showCombo,{
				border: false,
				html: "用于设置是否显示仪表盘的边框"
			}],
			dealNode: function(node){
				if(me.chartConf.showGaugeBorder==="0"){
					showCombo.setValue("hide");
				}else{
					showCombo.setValue("show");
				}
			}
		});
		return p;
	},
	
	// 仪表盘半径
	initGaugeRadius: function(){
		var me = this;
		var outerField = new Ext.form.NumberField({
			fieldLabel: "外半径",
			width: 200
		});
		var innerField = new Ext.form.TextField({
			fieldLabel: "内半径",
			width: 200
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var ov = outerField.getValue();
				if(ov==null || ov===0){
					delete (me.chartConf.gaugeOuterRadius);
				}else{
					me.chartConf.gaugeOuterRadius = ov;
				}
				var iv = innerField.getValue();
				if(Ext.isEmpty(iv)){
					delete (me.chartConf.gaugeInnerRadius);
				}else{
					me.chartConf.gaugeInnerRadius = iv;
				}
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 60,
			items: [outerField,innerField,applyButton,{
				border: false,
				bodyStyle: "padding-top:5px;",
				html: "外半径是数字，单位是像素，内半径可以是数字或百分比，内半径长度应小于外半径"
			}],
			dealNode: function(node){
				outerField.setValue(me.chartConf.gaugeOuterRadius);
				innerField.setValue(me.chartConf.gaugeInnerRadius);
			}
		});
		return p;
	},
	
	// 仪表盘显示刻度
	initGaugeShowMarks: function(){
		var me = this;
		var marksStore = new Ext.data.SimpleStore({
			fields: ["value", "text"],
			data: [["show", "显示刻度（默认）"],["hide", "隐藏刻度"]]
		});
		var showMarks = new Ext.form.ComboBox({
			store: marksStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示刻度"
		});
		var valuesStore = new Ext.data.SimpleStore({
			fields: ["value", "text"],
			data: [["empty", "空值（默认）"],["show", "显示数值"],["hide", "隐藏数值"]]
		});
		var showValues = new Ext.form.ComboBox({
			store: valuesStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "显示数值"
		});
		showMarks.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="show"){
				delete (me.chartConf.showTickMarks);
				me.confChart();
			}else if(val=="hide"){
				me.chartConf.showTickMarks = "0";
				me.confChart();
			}
		});
		showValues.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="empty"){
				delete (me.chartConf.showTickValues);
				me.confChart();
			}else if(val=="show"){
				me.chartConf.showTickValues = "1";
				me.confChart();
			}else if(val=="hide"){
				me.chartConf.showTickValues = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 60,
			items: [showMarks,showValues,{
				border: false,
				html: "用于设置是否显示仪表盘的刻度"
			}],
			dealNode: function(node){
				if(me.chartConf.showTickMarks==="0"){
					showMarks.setValue("hide");
				}else{
					showMarks.setValue("show");
				}
				if(me.chartConf.showTickValues===undefined){
					showValues.setValue("empty");
				}else if(me.chartConf.showTickValues==="0"){
					showValues.setValue("hide");
				}else{
					showValues.setValue("show");
				}
			}
		});
		return p;
	},
	
	// 仪表盘数值设置
	initGaugeValueConf: function(){
		var me = this;
		var lowerField = new Ext.form.NumberField({
			fieldLabel: "数值下限",
			width: 90
		});
		var upperField = new Ext.form.NumberField({
			fieldLabel: "数值上限",
			width: 90
		});
		var decimalShow = new Ext.form.Checkbox({
			fieldLabel: "小数显示"
		});
		var decimalNum = new Ext.form.NumberField({
			fieldLabel: "小数位数",
			width: 90
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var ds = decimalShow.getValue();
				if(ds){
					me.chartConf.forceTickValueDecimals = "1";
					me.chartConf.tickValueDecimals = decimalNum.getValue();
				}else{
					delete (me.chartConf.forceTickValueDecimals);
					delete (me.chartConf.tickValueDecimals);
				}
				var lower = lowerField.getValue();
				if(lower===undefined || lower===""){
					delete (me.chartConf.lowerLimit);
				}else{
					me.chartConf.lowerLimit = lower;
				}
				var upper = upperField.getValue();
				if(upper===undefined || upper===""){
					delete (me.chartConf.upperLimit);
				}else{
					me.chartConf.upperLimit = upper;
				}
				me.confChart();
			}
		});
		decimalShow.on("check", function(ch, val){
			if(val){
				decimalNum.enable();
			}else{
				decimalNum.disable();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'column',
    		items:[{
    			columnWidth: .5,
    			layout: "form",
    			labelWidth: 60,
    			border: false,
    			items: [lowerField, upperField,applyButton]
    		},{
    			columnWidth: .5,
    			layout: "form",
    			labelWidth: 60,
    			border: false,
    			items: [decimalShow, decimalNum]
    		}],
			dealNode: function(node){
				if(me.chartConf.forceTickValueDecimals){
					decimalShow.setValue(true);
					decimalNum.enable();
					decimalNum.setValue(me.chartConf.tickValueDecimals);
				}else{
					decimalShow.setValue(false);
					decimalNum.setValue();
					decimalNum.disable();
				}
				lowerField.setValue(me.chartConf.lowerLimit);
				upperField.setValue(me.chartConf.upperLimit);
			}
		});
		return p;
	},
	
	// 仪表盘角度
	initGaugeAngle: function(){
		var me = this;
		var startAngle = new Ext.form.NumberField({
			fieldLabel: "开始角度"
		});
		var endAngle = new Ext.form.NumberField({
			fieldLabel: "结束角度"
		});
		var autoScale = new Ext.form.Checkbox({
			fieldLabel: "自动缩放"
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var sa = startAngle.getValue();
				if(sa===undefined || sa===""){
					delete (me.chartConf.gaugeStartAngle);
				}else{
					me.chartConf.gaugeStartAngle = sa;
				}
				var ea = endAngle.getValue();
				if(ea===undefined || ea===""){
					delete (me.chartConf.gaugeEndAngle);
				}else{
					me.chartConf.gaugeEndAngle = ea;
				}
				if(autoScale.getValue()){
					me.chartConf.autoScale = "1";
				}else{
					delete (me.chartConf.autoScale);
				}
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 60,
			items: [startAngle,endAngle,autoScale,applyButton],
			dealNode: function(node){
				startAngle.setValue(me.chartConf.gaugeStartAngle);
				endAngle.setValue(me.chartConf.gaugeEndAngle);
				autoScale.setValue(me.chartConf.autoScale);
			}
		});
		return p;
	},
	
	// 动画效果
	initAnimation: function(){
		var me = this;
		var showStore = new Ext.data.SimpleStore({
			fields: ["value", "text"],
			data: [["true", "动画渲染（默认）"],["false", "快速渲染"]]
		});
		var showCombo = new Ext.form.ComboBox({
			store: showStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			colspan: 2,
			fieldLabel: "动画效果"
		});
		showCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="true"){
				delete (me.chartConf.animation);
				me.confChart();
			}else if(val=="false"){
				me.chartConf.animation = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 60,
			items: [showCombo],
			dealNode: function(node){
				if(me.chartConf.animation==="0"){
					showCombo.setValue("false");
				}else{
					showCombo.setValue("true");
				}
			}
		});
		return p;
	},
	
	// Y坐标最小值，最大值
	initYAxisValue: function(){
		var me = this;
		var yMinValue = new Ext.form.NumberField({
			fieldLabel: "Y轴最小值"
		});
		var yMaxValue = new Ext.form.NumberField({
			fieldLabel: "Y轴最大值"
		});
		var applyButton = new Ext.Button({
			text: "应用属性",
			handler: function(){
				var ymin = yMinValue.getValue();
				if(ymin===undefined || String(ymin)===""){
					delete (me.chartConf.yAxisMinValue);
				}else{
					me.chartConf.yAxisMinValue = String(ymin);
				}
				var ymax = yMaxValue.getValue();
				if(ymax===undefined || ymax===""){
					delete (me.chartConf.yAxisMaxValue);
				}else{
					me.chartConf.yAxisMaxValue = String(ymax);
				}
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 80,
			items: [yMinValue,yMaxValue,applyButton],
			dealNode: function(node){
				yMinValue.setValue(me.chartConf.yAxisMinValue);
				yMaxValue.setValue(me.chartConf.yAxisMaxValue);
			}
		});
		return p;
	},
	
	// 数据标签的格式化配置
	initValueShowFormat: function(){
		var me = this;
		var scaleStore = new Ext.data.SimpleStore({
			fields: ["value", "text"],
			data: [["true", "缩略显示（默认）"],["false", "全部显示"]]
		});
		var scaleCombo = new Ext.form.ComboBox({
			store: scaleStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			fieldLabel: "缩略显示"
		});
		scaleCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="true"){
				delete (me.chartConf.formatNumberScale);
				me.confChart();
			}else if(val=="false"){
				me.chartConf.formatNumberScale = "0";
				me.confChart();
			}
		});
		var formatStore = new Ext.data.SimpleStore({
			fields: ["value", "text"],
			data: [["true", "千分位分隔（默认）"],["false", "不格式化"]]
		});
		var formatCombo = new Ext.form.ComboBox({
			store: formatStore,
			mode: "local",
			displayField: "text",
			valueField: "value",
			editable: false,
			triggerAction: "all",
			typeAhead: true,
			selectOnFocus: true,
			fieldLabel: "格式化"
		});
		formatCombo.on("select",function(cb, rec, idx){
			var val = rec.get("value");
			if(val=="true"){
				delete (me.chartConf.formatNumber);
				me.confChart();
			}else if(val=="false"){
				me.chartConf.formatNumber = "0";
				me.confChart();
			}
		});
		var p = new Ext.Panel({
			border: false,
			layout:'form',
			labelWidth: 80,
			items: [scaleCombo,formatCombo],
			dealNode: function(node){
				if(me.chartConf.formatNumberScale==="0"){
					scaleCombo.setValue("false");
				}else{
					scaleCombo.setValue("true");
				}
				if(me.chartConf.formatNumber==="0"){
					formatCombo.setValue("fale");
				}else{
					formatCombo.setValue("true");
				}
			}
		});
		return p;
	},
	
	// 初始化属性编辑区
	initPropPanel: function(){
		var emptyPanel = new Ext.Panel({
			border: false
		});
		var comps = [emptyPanel];
		comps.push(this.initShowBorderPanel());
		comps.push(this.initColorPanel());
		comps.push(this.initNumberPanel());
		comps.push(this.initStringPanel());
		comps.push(this.initYDirectionPanel());
		comps.push(this.initFontPanel());
		comps.push(this.initDataGradient());
		comps.push(this.initDataBorder());
		comps.push(this.initDataDashed());
		comps.push(this.initRoundEdges());	// 10
		comps.push(this.initLabelShowBorder());
		comps.push(this.initLabelDisplay());
		comps.push(this.initValueShow());
		comps.push(this.initGaugeShowBorder());	// 14
		comps.push(this.initGaugeRadius());
		comps.push(this.initGaugeShowMarks());
		comps.push(this.initGaugeValueConf());
		comps.push(this.initGaugeAngle());		// 18
		comps.push(this.initAnimation());
		comps.push(this.initYAxisValue());		// 20 Y坐标最小值，最大值
		comps.push(this.initValueShowFormat());	// 21 数据标签--显示格式
		
		this.propPanel = new Ext.Panel({
			region: "north",
			margins: "0 0 4 0",
			height: 140,
			activeItem: 0,
			layout: "card",
			bodyStyle: "padding:4px;",
			items: comps
		});
	},
	
	// 设置属性标题
	setPropTitle: function(p, node){
		var title = node.attributes.propTitle;
		if(Ext.isEmpty(title)){
			title = node.text;
		}
		p.body.update(title);
		p.propNode = node;
	},
	
	// 初始化类型树
	initChartType: function(){
		var chartTypes = [{
			leaf: true,
			text: "柱状图_2D",
			typeStr: "Column2D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "柱状图_3D",
			typeStr: "Column3D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "柱状图_2D复合",
			typeStr: "MSColumn2D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "柱状图_3D复合",
			typeStr: "MSColumn3D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "柱状图_2D栈图",
			typeStr: "StackedColumn2D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "柱状图_3D栈图",
			typeStr: "StackedColumn3D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "折线图",
			typeStr: "Line",
			dataType: "initData1"
		},{
			leaf: true,
			text: "折线图_复合",
			typeStr: "MSLine",
			dataType: "initData2"
		},{
			leaf: true,
			text: "饼图_2D",
			typeStr: "Pie2D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "饼图_3D",
			typeStr: "Pie3D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "环状图_2D",
			typeStr: "Doughnut2D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "环状图_3D",
			typeStr: "Doughnut3D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "条形图_2D",
			typeStr: "Bar2D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "条形图_2D复合",
			typeStr: "MSBar2D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "条形图_3D复合",
			typeStr: "MsBar3D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "条形图_2D栈图",
			typeStr: "StackedBar2D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "条形图_3D栈图",
			typeStr: "StackedBar3D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "区域图_2D",
			typeStr: "Area2D",
			dataType: "initData1"
		},{
			leaf: true,
			text: "区域图_2D复合",
			typeStr: "MSArea",
			dataType: "initData2"
		},{
			leaf: true,
			text: "区域图_2D栈图",
			typeStr: "StackedArea2D",
			dataType: "initData2"
		},{
			leaf: true,
			text: "仪表盘",
			typeStr: "AngularGauge",
			dataType: "initData3"
		}];
		
		this.chartTree = new Ext.tree.TreePanel({
			width: 140,
			title: "chart类型",
			region: "west",
			margins: "4 4 4 4",
			//split: true,
			autoScroll: true,
			rootVisible: false,
			root: new Ext.tree.AsyncTreeNode({
				text: "根节点",
				children: chartTypes
			}),
			loader: new Ext.tree.TreeLoader()
		});
		this.chartTree.on("click", this.onTypeClick,this);
	},
	
	// 类型节点单击事件
	onTypeClick: function(node){
		this.chartConf.chartType = node.attributes.typeStr;
		this.showChart();
	},
	
	/**
	 * 初始化属性列表
	 */
	initPropTree: function(){
		var propTypes = [{
			text: "动画效果",
			leaf: true,
			panelIndex: 19
		},{
			text: "边框",
			children: [{
				text: "显示边框",
				propStr: "showBorder",
				leaf: true,
				panelIndex: 1
			},{
				text: "边框颜色",
				propStr: "borderColor",
				leaf: true,
				panelIndex: 2,
				propTitle: "边框颜色"
			},{
				text: "边框宽度",
				propStr: "borderThickness",
				leaf: true,
				panelIndex: 3,
				propTitle: "边框宽度"
			},{
				text: "透明度",
				propStr: "borderAlpha",
				leaf: true,
				panelIndex: 3,
				propTitle: "边框透明度"
			}]
		},{
			text: "背景",
			children: [{
				text: "背景色",
				propStr: "bgColor",
				leaf: true,
				panelIndex: 2,
				propTitle: "背景颜色"
			},{
				text: "透明度",
				propStr: "bgAlpha",
				leaf: true,
				panelIndex: 3,
				propTitle: "背景透明度"
			}]
		},{
			text: "画布边框",
			children: [{
				text: "边框颜色",
				propStr: "canvasBorderColor",
				leaf: true,
				panelIndex: 2,
				propTitle: "画布边框颜色"
			},{
				text: "边框宽度",
				propStr: "canvasBorderThickness",
				leaf: true,
				panelIndex: 3,
				propTitle: "画布边框宽度"
			},{
				text: "透明度",
				propStr: "canvasBorderAlpha",
				leaf: true,
				panelIndex: 3,
				propTitle: "画布边框透明度"
			}]
		},{
			text: "画布背景",
			children: [{
				text: "背景色",
				propStr: "canvasBgColor",
				leaf: true,
				panelIndex: 2,
				propTitle: "画布背景颜色"
			},{
				text: "透明度",
				propStr: "canvasBgAlpha",
				leaf: true,
				panelIndex: 3,
				propTitle: "画布背景透明度"
			}]
		},{
			text: "标题",
			children: [{
				text: "主标题",
				propStr: "caption",
				leaf: true,
				panelIndex: 4
			},{
				text: "子标题",
				propStr: "subCaption",
				leaf: true,
				panelIndex: 4
			},{
				text: "x坐标名",
				propStr: "xAxisName",
				leaf: true,
				panelIndex: 4
			},{
				text: "y坐标名",
				propStr: "yAxisName",
				leaf: true,
				panelIndex: 4
			},{
				text: "y坐标文字方向",
				propStr: "rotateYAxisName",
				leaf: true,
				panelIndex: 5
			},{
				text: "y坐标文字宽度",
				propStr: "yAxisNameWidth",
				leaf: true,
				panelIndex: 3
			},{
				text: "y坐标值",
				leaf: true,
				panelIndex: 20
			}]
		},{
			text: "字体",
			children: [{
				text: "字体",
				propStr: "baseFont",
				leaf: true,
				panelIndex: "6"
			},{
				text: "字体大小",
				propStr: "baseFontSize",
				leaf: true,
				panelIndex: "3"
			},{
				text: "字体颜色",
				propStr: "baseFontColor",
				leaf: true,
				panelIndex: "2"
			},{
				text: "画布外字体",
				propStr: "outCnvbaseFont",
				leaf: true,
				panelIndex: 6
			},{
				text: "画布外字体大小",
				propStr: "outCnvbaseFontSize",
				leaf: true,
				panelIndex: 3
			},{
				text: "画布外字体颜色",
				propStr: "outCnvbaseFontColor",
				leaf: true,
				panelIndex: 2
			}]
		},{
			text: "数据图形",
			children: [{
				text: "颜色渐变",
				propStr: "plotGradientColor",
				leaf: true,
				panelIndex: 7
			},{
				text: "显示边框",
				propStr: "showPlotBorder",
				leaf: true,
				panelIndex: 8
			},{
				text: "边框样式",
				propStr: "plotBorderDashed",
				leaf: true,
				panelIndex: 9
			},{
				text: "圆角样式",
				propStr: "useRoundEdges",
				leaf: true,
				panelIndex: 10
			}]
		},{
			text: "数据标签",
			children: [{
				text: "显示标签",
				propStr: "showLabels",
				leaf: true,
				panelIndex: 11
			},{
				text: "显示模式",
				propStr: "labelDisplay",
				leaf: true,
				panelIndex: 12
			},{
				text: "显示格式",
				leaf: true,
				panelIndex: 21
			},{
				text: "间隔显示",
				propStr: "labelStep",
				leaf: true,
				panelIndex: 3,
				propTitle: "间隔步长"
			},{
				text: "数据值",
				propStr: "showValues",
				leaf: true,
				panelIndex: 13
			}/*,{
				text: "旋转显示",
				propStr: "rotateValues",
				leaf: true
			},{
				text: "图形内部显示",
				propStr: "placeValuesInside",
				leaf: true
			}*/]
		},{
			text: "仪表盘",
			children: [{
				text: "仪表盘边框",		// showGaugeBorder,gaugeBorderColor,gaugeBorderThickness,gaugeBorderAlpha
				children: [{
					text: "显示边框",
					leaf: true,
					propStr: "showGaugeBorder",
					panelIndex: 14
				},{
					text: "边框颜色",
					leaf: true,
					propStr: "gaugeBorderColor",
					propTitle: "仪表盘边框颜色",
					panelIndex: 2
				},{
					text: "边框宽度",
					leaf: true,
					propStr: "gaugeBorderThickness",
					propTitle: "仪表盘边框宽度",
					panelIndex: 3
				},{
					text: "透明度",
					leaf: true,
					propStr: "gaugeBorderAlpha",
					propTitle: "仪表盘边框透明度",
					panelIndex: 3
				}]
			},{
				text: "表盘范围",
				leaf: true,
				panelIndex: 15		// gaugeOuterRadius,gaugeInnerRadius
			},{
				text: "显示刻度",
				leaf: true,
				propStr: "showTickMarks",
				panelIndex: 16
			},{
				text: "数值设置",	// forceTickValueDecimals,tickValueDecimals,upperLimit,lowerLimit
				leaf: true,
				panelIndex: 17
			},{
				text: "角度设置",
				leaf: true,
				panelIndex: 18		// gaugeStartAngle,gaugeEndAngle,autoScale(自动缩放)
			}]
		}];
		
		this.propTree = new Ext.tree.TreePanel({
			region: "east",
			title: "属性列表",
			margins: "4 4 4 4",
			//split: true,
			width: 180,
			animate: false,
			autoScroll: true,
			rootVisible: false,
			root: new Ext.tree.AsyncTreeNode({
				text: "根节点",
				children: propTypes
			}),
			loader: new Ext.tree.TreeLoader()
		});
		this.propTree.on("click", this.onPropClick, this);
	},
	
	// 属性节点单击事件
	onPropClick: function(node){
		if(!node.isLeaf()){
			return ;
		}
		var pi = node.attributes.panelIndex;
		if(pi){
			this.propPanel.getLayout().setActiveItem(pi);
			var comp = this.propPanel.getComponent(pi);
			if(comp.dealNode){
				comp.dealNode(node);
			}
		}else{
			this.propPanel.getLayout().setActiveItem(0);
		}
	},
	
	// 显示chart
	showChart: function(){
		var fsrc = this.getChartSrc();
		var id = "chartid";
		var w = 320;
		var h = 240;
		var dm = 0;				// debugMode
		var rw = 1;				// registerWithJS
		var bgc = '#ffffff';	// backgroundColor
		var sm = "noScale";		// scaleMode
		var la = "CH";			// language
		var chartObj = new FusionCharts(fsrc,id,w,h,dm,rw,bgc,sm,la);
		var data = this.getChartData();
		chartObj.setDataXML(chartObj.encodeDataXML(data));
  		chartObj.setTransparent(true);
		chartObj.render(this.chartid);
	},
	
	// chart重新加载配置
	confChart: function(){
		this.showChart();
	},
	
	// 获得chart对应的swf文件地址
	getChartSrc: function(){
    	var src = sys.getContextPath()+"/artery/arteryPlugin/image/chartArea/Charts/";
    	src += this.chartConf.chartType;
    	return src + ".swf";
    },
    
    // 获得数据
    getChartData: function(){
    	var typeNode = this.chartTree.root.findChild("typeStr", this.chartConf.chartType);
    	var data = this[typeNode.attributes.dataType];
    	var head = "<chart";
    	// 动画效果
    	if(this.chartConf.animation!==undefined){
    		head += " animation='"+this.chartConf.animation+"' ";
    	}
    	// 边框设置
    	if(this.chartConf.showBorder!==undefined){
    		head += " showBorder='"+this.chartConf.showBorder+"' ";
    	}
    	if(this.chartConf.borderColor!==undefined){
    		head += " borderColor='"+this.chartConf.borderColor+"' ";
    	}
    	if(this.chartConf.borderThickness!==undefined){
    		head += " borderThickness='"+this.chartConf.borderThickness+"' ";
    	}
    	if(this.chartConf.borderAlpha!==undefined){
    		head += " borderAlpha='"+this.chartConf.borderAlpha+"' ";
    	}
    	// 背景设置
    	if(this.chartConf.bgColor!==undefined){
    		head += " bgColor='"+this.chartConf.bgColor+"' ";
    	}
    	if(this.chartConf.bgAlpha!==undefined){
    		head += " bgAlpha='"+this.chartConf.bgAlpha+"' ";
    	}
    	// 画布边框
    	if(this.chartConf.canvasBorderColor!==undefined){
    		head += " canvasBorderColor='"+this.chartConf.canvasBorderColor+"' ";
    	}
    	if(this.chartConf.canvasBorderThickness!==undefined){
    		head += " canvasBorderThickness='"+this.chartConf.canvasBorderThickness+"' ";
    	}
    	if(this.chartConf.canvasBorderAlpha!==undefined){
    		head += " canvasBorderAlpha='"+this.chartConf.canvasBorderAlpha+"' ";
    	}
    	// 画布背景
    	if(this.chartConf.canvasBgColor!==undefined){
    		head += " canvasBgColor='"+this.chartConf.canvasBgColor+"' ";
    	}
    	if(this.chartConf.canvasbgAlpha!==undefined){
    		head += " canvasbgAlpha='"+this.chartConf.canvasbgAlpha+"' ";
    	}
    	// 标题
    	if(this.chartConf.caption!==undefined){
    		head += " caption='"+this.chartConf.caption+"' ";
    	}
    	if(this.chartConf.subCaption!==undefined){
    		head += " subCaption='"+this.chartConf.subCaption+"' ";
    	}
    	if(this.chartConf.xAxisName!==undefined){
    		head += " xAxisName='"+this.chartConf.xAxisName+"' ";
    	}
    	if(this.chartConf.yAxisName!==undefined){
    		head += " yAxisName='"+this.chartConf.yAxisName+"' ";
    	}
    	if(this.chartConf.rotateYAxisName!==undefined){
    		head += " rotateYAxisName='"+this.chartConf.rotateYAxisName+"' ";
    	}
    	if(this.chartConf.yAxisNameWidth!==undefined){
    		head += " yAxisNameWidth='"+this.chartConf.yAxisNameWidth+"' ";
    	}
    	if(this.chartConf.yAxisMinValue!==undefined){
    		head += " yAxisMinValue='"+this.chartConf.yAxisMinValue+"' ";
    	}
    	if(this.chartConf.yAxisMaxValue!==undefined){
    		head += " yAxisMaxValue='"+this.chartConf.yAxisMaxValue+"' ";
    	}
    	if(this.chartConf.outCnvbaseFont!==undefined){
    		head += " outCnvbaseFont='"+this.chartConf.outCnvbaseFont+"' ";
    	}
    	if(this.chartConf.outCnvbaseFontSize!==undefined){
    		head += " outCnvbaseFontSize='"+this.chartConf.outCnvbaseFontSize+"' ";
    	}
    	if(this.chartConf.outCnvbaseFontColor!==undefined){
    		head += " outCnvbaseFontColor='"+this.chartConf.outCnvbaseFontColor+"' ";
    	}
    	// 数据图形
    	if(this.chartConf.plotGradientColor!==undefined){
    		head += " plotGradientColor='"+this.chartConf.plotGradientColor+"' ";
    	}
    	if(this.chartConf.showPlotBorder!==undefined){
    		head += " showPlotBorder='"+this.chartConf.showPlotBorder+"' ";
    	}
    	if(this.chartConf.plotBorderDashed!==undefined){
    		head += " plotBorderDashed='"+this.chartConf.plotBorderDashed+"' ";
    	}
    	if(this.chartConf.plotBorderDashLen!==undefined){
    		head += " plotBorderDashLen='"+this.chartConf.plotBorderDashLen+"' ";
    	}
    	if(this.chartConf.plotBorderDashGap!==undefined){
    		head += " plotBorderDashGap='"+this.chartConf.plotBorderDashGap+"' ";
    	}
    	if(this.chartConf.useRoundEdges!==undefined){
    		head += " useRoundEdges='"+this.chartConf.useRoundEdges+"' ";
    	}
    	// 数据标签
    	if(this.chartConf.showLabels!==undefined){
    		head += " showLabels='"+this.chartConf.showLabels+"' ";
    	}
    	if(this.chartConf.labelDisplay!==undefined){
    		head += " labelDisplay='"+this.chartConf.labelDisplay+"' ";
    	}
    	if(this.chartConf.slantLabels!==undefined){
    		head += " slantLabels='"+this.chartConf.slantLabels+"' ";
    	}
    	if(this.chartConf.labelStep!==undefined){
    		head += " labelStep='"+this.chartConf.labelStep+"' ";
    	}
    	// 数据值
    	if(this.chartConf.showValues!==undefined){
    		head += " showValues='"+this.chartConf.showValues+"' ";
    	}
    	if(this.chartConf.rotateValues!==undefined){
    		head += " rotateValues='"+this.chartConf.rotateValues+"' ";
    	}
    	if(this.chartConf.placeValuesInside!==undefined){
    		head += " placeValuesInside='"+this.chartConf.placeValuesInside+"' ";
    	}
    	if(this.chartConf.formatNumberScale!==undefined){
    		head += " formatNumberScale='"+this.chartConf.formatNumberScale+"' ";
    	}
    	if(this.chartConf.formatNumber!==undefined){
    		head += " formatNumber='"+this.chartConf.formatNumber+"' ";
    	}
    	if(this.chartConf.baseFont!==undefined){
    		head += " baseFont='"+this.chartConf.baseFont+"' ";
    	}
    	if(this.chartConf.baseFontSize!==undefined){
    		head += " baseFontSize='"+this.chartConf.baseFontSize+"' ";
    	}
    	if(this.chartConf.baseFontColor!==undefined){
    		head += " baseFontColor='"+this.chartConf.baseFontColor+"' ";
    	}
    	// 仪表盘相关设置
    	if(this.chartConf.chartType=="AngularGauge"){
    		if(this.chartConf.showGaugeBorder!==undefined){
    			head += " showGaugeBorder='"+this.chartConf.showGaugeBorder+"' ";
    		}
    		if(this.chartConf.gaugeBorderColor!==undefined){
    			head += " gaugeBorderColor='"+this.chartConf.gaugeBorderColor+"' ";
    		}
    		if(this.chartConf.gaugeBorderThickness!==undefined){
    			head += " gaugeBorderThickness='"+this.chartConf.gaugeBorderThickness+"' ";
    		}
    		if(this.chartConf.gaugeBorderAlpha!==undefined){
    			head += " gaugeBorderAlpha='"+this.chartConf.gaugeBorderAlpha+"' ";
    		}
    		if(this.chartConf.gaugeOuterRadius!==undefined){
    			head += " gaugeOuterRadius='"+this.chartConf.gaugeOuterRadius+"' ";
    		}
    		if(this.chartConf.gaugeInnerRadius!==undefined){
    			head += " gaugeInnerRadius='"+this.chartConf.gaugeInnerRadius+"' ";
    		}
    		if(this.chartConf.showTickMarks!==undefined){
    			head += " showTickMarks='"+this.chartConf.showTickMarks+"' ";
    		}
    		if(this.chartConf.showTickValues!==undefined){
    			head += " showTickValues='"+this.chartConf.showTickValues+"' ";
    		}
    		if(this.chartConf.lowerLimit!==undefined){
    			head += " lowerLimit='"+this.chartConf.lowerLimit+"' ";
    		}
    		if(this.chartConf.upperLimit!==undefined){
    			head += " upperLimit='"+this.chartConf.upperLimit+"' ";
    		}
    		if(this.chartConf.forceTickValueDecimals!==undefined){
    			head += " forceTickValueDecimals='"+this.chartConf.forceTickValueDecimals+"' ";
    		}
    		if(this.chartConf.tickValueDecimals!==undefined){
    			head += " tickValueDecimals='"+this.chartConf.tickValueDecimals+"' ";
    		}
    		if(this.chartConf.gaugeStartAngle!==undefined){
    			head += " gaugeStartAngle='"+this.chartConf.gaugeStartAngle+"' ";
    		}
    		if(this.chartConf.gaugeEndAngle!==undefined){
    			head += " gaugeEndAngle='"+this.chartConf.gaugeEndAngle+"' ";
    		}
    		if(this.chartConf.autoScale!==undefined){
    			head += " autoScale='"+this.chartConf.autoScale+"' ";
    		}
    	}
    	data = head+">"+data;
    	//alert(data);
    	return data;
    }
});