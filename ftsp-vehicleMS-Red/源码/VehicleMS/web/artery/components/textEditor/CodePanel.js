// 代码编辑器
CodePanel = function(config) {
	config.layout = "fit";
	config.items = null;

	if (!config.language) {
		config.language = "java";
	}

	config.listeners = {
		resize : this.resizeHandler
	};

	this.editorId = Ext.id();
	CodePanel.superclass.constructor.call(this, config);
};

Ext.extend(CodePanel, Ext.Panel, {

	editorObj : null, 		// 编辑器对象
	editorId : null, 		// 编辑器id
	editorTips : null, 		// 编辑器上下文提示信息
	code : null, 			// 代码
	language : null, 		// 语言类型
	firstResize : true, 	// 是否第一次调整大小

	// 在Panel render后，调用此方法，用于显示当前编辑器内容
	afterRender : function() {
		var rootUrl = sys.getContextPath() + "/artery/components/textEditor/";
		var confObj = new SWFObject(rootUrl + "editor.swf", this.editorId, "100%", "100%", "9", "#FFFFFF");
		confObj.addVariable("Fonts", "宋体");
		confObj.setAttribute("codebase", sys.getContextPath()+ "/artery/ocx/swflash.cab");
		confObj.addVariable("fontsSize", "14");
		confObj.addVariable("cHelpPath", sys.getContextPath()+ "/artery/components/textEditor/config/help.txt");
		
		// 添加wmode参数，防止flash挡住其他dom
		confObj.addParam("wmode","transparent");
		
		if (this.editorTips) {
			confObj.addVariable("cTips", this.editorTips);
		}
		
		if (this.language == "java") {
			confObj.addVariable("cType", "JAVA");
			confObj.addVariable("cPath", rootUrl + "config/java.xml");
		} else if (this.language == "javascript") {
			confObj.addVariable("cType", "JAVA");
			confObj.addVariable("cPath", rootUrl + "config/js.xml");
		} else if (this.language == "sql") {
			confObj.addVariable("cType", "SQL");
			confObj.addVariable("cPath", rootUrl + "config/sql.xml");
		} else if (this.language == "html") {
			confObj.addVariable("cType", "JSP");
			confObj.addVariable("cPath", rootUrl + "config/jsp.xml");
		} else if (this.language == "css") {
			confObj.addVariable("cType", "CSS");
			confObj.addVariable("cPath", rootUrl + "config/css.xml");
		} else if (this.language == "xml") {
			confObj.addVariable("cType", "XML");
			confObj.addVariable("cPath", rootUrl + "config/xml.xml");
		}

		// 设置代码参数
		if (this.code) {
			var c = this.code.replace(/%/g, "%25");
			c = c.replace(/\"/g, "%22");
			c = c.replace(/&/g, "%26");
			c = c.replace(/\+/g, "%2B");
			c = String.escape(c);
			confObj.addVariable("cCode", c);
		}

		var o = {};
		confObj.write(o);
		this.html = o.innerHTML;
		CodePanel.superclass.afterRender.call(this);
		this.editorObj = document.getElementById(this.editorId);
				
		// 是指属性独有的上下文提示
		if(this.tips){
			var tmp = this;
			(function(){
				try {
					tmp.editorObj.clearNSetTips(tmp.tips);
				} catch (e) {}
			}).defer(300);
		}
	},

	// 设置编辑器内容
	setCode : function(code) {
		if (this.rendered && this.editorObj) {
			code = String.escape(code);
			this.editorObj.setCode(code);
		} else {
			this.code = code;
		}
	},

	// 获得编辑器内容
	getCode : function() {
		if (this.rendered && this.editorObj) {
			return this.editorObj.getCode();
		} else {
			return this.code;
		}
	},

	// 在窗口改变大小时，调整flash的大小
	resizeHandler : function() {
		if (this.firstResize) {
			this.firstResize = false;
		} else {
			var tmp = this;
			(function() {
				try {
					tmp.editorObj.reSize();
				} catch (e) {
				}
			}).defer(300);
		}
	},

	// 设置输入提示
	setTips : function(t) {
		if (this.editorObj) {
			this.editorObj.clearNSetTips(t);
			// this.editorObj.setTips(t);
		} else {
			this.tips = t;
		}
	}
});