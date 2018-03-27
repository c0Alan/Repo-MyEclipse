﻿/**
 * Artery NTKOPanel component
 * 
 * @author sunmd
 * @date 10/07/2008
 * 
 * @class Ext.tusc.NTKOPanel
 * @extends Ext.Panel
 */
Artery.plugin.NTKOPanel = Ext.extend(Ext.BoxComponent, {
	Caption : "",
	Menubar : true,
	ToolBars : true,
	Statusbar : true,
	BorderStyle : 0,
	FileNew : true,
	FileOpen : true,
	FileClose : false,
	FileSave : false,
	FileSaveAs : true,
	FilePrint : true,
	FilePrintPreview : true,
	FilePageSetup : true,
	FileProperties : true,
	IsStrictNoCopy : false,
	IsUseUTF8Data : true,

	loadDoc : function(url) {
		if (url){
			this.ntko.BeginOpenFromURL(url, true);
		}else{
			this.ntko.BeginOpenFromURL(sys.getContextPath() + "/artery/pub/_blank.doc");
		}
	},
	openDoc : function() {
		this.ntko.ShowDialog(1);
	},
	saveAs : function() {
		this.ntko.ShowDialog(3);
	},
	printSetup : function() {
		this.ntko.ShowDialog(5);
	},
	preview : function() {
		this.ntko.PrintPreview();
	},
	print : function(setupPrinter) {
		this.ntko.PrintOut(setupPrinter);
	},
	save : function() {
		var action = sys.getContextPath()+"/artery/writparse.do?action=uploadFile";
		action += "&runTimeType=" + Artery.params.runTimeType+"&writtplid="+Artery.params.writtplid;
		action += "&writid=" + Artery.params.writid;
		var fileID = "doc";
		var filename = Artery.params.writid + ".doc";
		
		var reInfo = this.ntko.SaveToURL(action, fileID, "", filename, "");
		if (reInfo.length > 100) {
			var newwin = window.open(
				"",
				"_blank",
				"left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=1",
				false
			);
			newdoc = newwin.document;
			newdoc.open();
			newdoc.write("<html><head><title>返回的数据</title></head><body><center><hr>")
			newdoc.write(reInfo + "<hr>");
			newdoc.write("<input type=button VALUE='关闭窗口' onclick='window.close()'>");
			newdoc.write('</center></body></html>');
			return '{success:false}';
		} else {
			Artery.params.runTimeType = "update";
			return '{success:true}';
		}
	},
	showHistory : function() {
		var url = sys.getContextPath() + "/artery/writparse.do?action=showHis";
		url += "&writid=" + Artery.params.writid;
		url += "&writtplid=" + Artery.params.writtplid;
		window.open(url, "_blank");
	},

	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		if(this.el==null){
			Artery.plugin.NTKOPanel.superclass.onRender.call(this, ct, position);
		}
		var height = ct.getHeight()? ct.getHeight()-3:"100%";
		this.ntko = this.el.createChild({
			tag : 'object',
			classid : 'clsid:6AA93B0B-D450-4a80-876E-3909055B0640',
			codebase : sys.getContextPath()
					+ '/artery/arteryConsole/ocx/OfficeControl.cab#version=5,0,2,1',
			width : ct.getWidth()-5,
			height : height,
			id : 'NTKO_OCX',
			cn : [{
				tag : 'param',
				name : 'MakerCaption',
				 value : '北京紫光华宇软件股份有限公司'
			}, {
				tag : 'param',
				name : 'MakerKey',
				value : '29159DF3EEF0FB2ED177390A6BC536A584A541F2'
			}, {
				tag : 'param',
				name : 'ProductCaption',
				value : '通用MIS系统构建平台'
			}, {
				tag : 'param',
				name : 'ProductKey',
				value : '3F34B9CBD465FFF26C0A74ED2DB3435331AE5D88'
			}, {
				tag : 'SPAN',
				STYLE : 'color:red',
				html : '不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。'
			}]
		}, null, true);

		if (Ext.isEmpty(this.Caption)){
			this.ntko.Titlebar = false;
		}else {
			this.ntko.Titlebar = true;
			this.ntko.Caption = this.Caption;
		}
		this.ntko.Menubar = this.Menubar;
		this.ntko.ToolBars = this.ToolBars;
		this.ntko.Statusbar = this.Statusbar;
		this.ntko.BorderStyle = this.BorderStyle;
		this.ntko.FileNew = this.FileNew;
		this.ntko.FileOpen = this.FileOpen;
		this.ntko.FileClose = this.FileClose;
		this.ntko.FileSave = this.FileSave;
		this.ntko.FileSaveAs = this.FileSaveAs;
		this.ntko.FilePrint = this.FilePrint;
		this.ntko.FilePrintPreview = this.FilePrintPreview;
		this.ntko.FilePageSetup = this.FilePageSetup;
		this.ntko.FileProperties = this.FileProperties;
		this.ntko.IsStrictNoCopy = this.IsStrictNoCopy;
		this.ntko.IsUseUTF8Data = this.IsUseUTF8Data;
	}
})

Ext.reg('apNTKOpanel', Artery.plugin.NTKOPanel);