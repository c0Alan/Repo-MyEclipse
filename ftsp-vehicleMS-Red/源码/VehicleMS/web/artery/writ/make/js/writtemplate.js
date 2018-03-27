/*
 * 文书表单界面js类
 */
WritTemplate = function() {
	var mainView;
	var mainPanel;
	var ntko;

	/*
	 * 从文档text中提取标签.
	 */
	function parseMarks(source) {
		var marks = new Array();
		var i = 0;
		var re = /\{(img|ccode|ncode|ocode|cfg|exp|decode|nf|df|req|ses|rs|list|isnull|var|calendar).+?\}/gi;
		var markValue;

		while ((markValue = re.exec(source)) !== null)
			marks[i++] = markValue[0];
		return marks;
	}

	/*
	 * 从文档中提取书签
	 */
	function genBookMarks() {
		var cfgXml = loadXMLString("<?xml version='1.0' encoding='gbk'?><BookMarks/>");
		var root = cfgXml.documentElement;
		while (root.hasChildNodes())
			root.removeChild(root.firstChild);

		var source = getDocumentText();
		var marks = parseMarks(source);

		for (var i = 0; i < marks.length; i++) {
			var nodeMark = cfgXml.createElement("Mark");
			root.appendChild(nodeMark);
			var nodeMarkName = cfgXml.createElement("name");
			var nodeMarkValue = cfgXml.createElement("value");
			nodeMark.appendChild(nodeMarkName);
			nodeMark.appendChild(nodeMarkValue);
			nodeMarkName.text = marks[i];
		}
		return cfgXml.xml;
	}

	/*
	 * 创建主界面
	 */
	function createMainView() {
		mainPanel = new Ext.Panel({
					layout : 'fit',
					items : [{
								id : 'ntkoeditor',
								region : 'center',
								xtype : 'apNTKOpanel',
								Caption : "",
								BorderStyle : 0,
								Menubar : true,
								IsStrictNoCopy : false,
								ToolBars : true,
								Statusbar : true,
								FilePrint : true,
								FileNew : true,
								FileOpen : true,
								FileSave : false,
								FileSaveAs : true,
								FileClose : false,
								FileProperties : true,
								FilePageSetup : true,
								FilePrintPreview : true,
								anchor : "100% 100%",
								border : false
							}],
					tbar : [{
								id : "button_save",
								cls : 'x-btn-text-icon save',
								text : '保存',
								tooltip : '保存',
								handler : saveWritTpl
							}, '->', {
								tooltip : '预览编辑文书，必需有参数：writid',
								cls : 'x-btn-text-icon preview-u',
								handler : function() {
									previewWrit("update");
								}
							}, {
								tooltip : '预览文书效果',              
								cls : 'x-btn-text-icon preview-i',
								handler : function() {
									previewWrit("insert");
								}
							}]
				});

		mainView = new Ext.Viewport({
					layout : 'fit',
					border : false,
					hideBorders : true,
					items : [mainPanel]
				});
	}

	function saveWritTpl() {
		// 提取bookmarks
		var xml = genBookMarks();
		document.all('xml').value = xml;

		var reInfo = saveDocument('writmake.do?action=uploadFile', 'template',
				writTpl.id + ".doc", 'tplID=' + writTpl.id + '&complibId=' + writTpl.complibId, "uploadForm");
		var obj = Ext.decode(reInfo);
		if (obj.success)
			showTips('文书模板文件保存成功！！！', 2);
		else
			showTips('文书模板文件保存失败！！！', 4);
	}

	// 预览表单
	function previewWrit(runTimeType) {
		var url = sys.getContextPath()
				+ '/artery/writparse.do?action=previewWrit&runtype=insert&writtplid='
				+ writTpl.id;
		if (runTimeType) {
			url += "&runTimeType=" + runTimeType;
		}
		var winObj = window.open(url, "previewWin");
		winObj.focus();
	}

	function InitDocument() {
		ntko = Artery.getCmp("ntkoeditor").ntko;
		var url;
		if (writTpl.tplSize != 0)
			url = "writmake.do?action=loadDocTpl&id=" + writTpl.id + "&complibId=" + writTpl.complibId;
		Artery.getCmp("ntkoeditor").loadDoc(url);
	}

	function getDocumentText() {
		return ntko.ActiveDocument.Range().Text;
	}

	function saveDocument(action, fileID, filename, params, formID) {
		var reInfo = ntko.SaveToURL(action, fileID, params, filename, formID);
		if (reInfo.length > 100) {
			var newwin = window
					.open(
							"",
							"_blank",
							"left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=1",
							false);
			newdoc = newwin.document;
			newdoc.open();
			newdoc
					.write("<html><head><title>返回的数据</title></head><body><center><hr>")
			newdoc.write(reInfo + "<hr>");
			newdoc
					.write("<input type=button VALUE='关闭窗口' onclick='window.close()'>");
			newdoc.write('</center></body></html>');
			return '{success:false}';
		} else
			return '{success:true}';
	}

	return {
		init : function() {
			createMainView();
			InitDocument();
		}
	};
};
