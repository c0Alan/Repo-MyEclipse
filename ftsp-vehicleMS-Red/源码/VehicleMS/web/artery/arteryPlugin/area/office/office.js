/**
 * office控件显示panel
 * 
 * @author artery
 * @date 13/07/2011
 */
Artery.plugin.Office = Ext.extend(Ext.Component, {

	active : null, // 控件对象
	
	initComponent : function() {
		Artery.plugin.Office.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position) {
		Artery.plugin.Office.superclass.onRender.call(this);
		this.active = Ext.getDom(this.id);
		this.showTitleBar(this.titlebar);
		this.showMenuBar(this.menubar);
		this.showStatusBar(this.statusbar);
		this.showToolBar(this.toolbar);
		this.enableFileNew(this.filenew);
		this.enableFileOpen(this.fileopen);
		this.enableFileClose(this.fileclose);
		this.enableFileSave(this.filesave);
		this.enableFileSaveAs(this.filesaveas);
		this.enableFilePrint(this.fileprint);
		this.enableFilePrintPreview(this.fileprintpreview);
		
		this.reload();
	},

	// 显示组件
	show : function() {
		Ext.fly(this.active).removeClass("x-hide-display");
	},

	// 隐藏组件
	hide : function() {
		Ext.fly(this.active).addClass("x-hide-display");
	},
	
	//显示标题栏
	showTitleBar : function(bShow){
		try{
			this.active.Titlebar = bShow;
		}catch(e){
		}
	},
	//显示菜单栏
	showMenuBar : function(bShow){
		try{
			this.active.Menubar = bShow;
		}catch(e){
		}
	},
	//显示状态栏
	showStatusBar : function(bShow){
		try{
			this.active.Statusbar = bShow;
		}catch(e){
		}
	},
	//显示工具栏
	showToolBar : function(bShow){
		try{
			this.active.Toolbars = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->新建菜单
	enableFileNew : function(bShow){
		try{
			this.active.FileNew = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->打开菜单
	enableFileOpen : function(bShow){
		try{
			this.active.FileOpen = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->关闭菜单
	enableFileClose : function(bShow){
		try{
			this.active.FileClose = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->保存菜单
	enableFileSave : function(bShow){
		try{
			this.active.FileSave = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->另存为菜单
	enableFileSaveAs : function(bShow){
		try{
			this.active.FileSaveAs = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->打印菜单
	enableFilePrint : function(bShow){
		try{
			this.active.FilePrint = bShow;
		}catch(e){
		}
	},
	//允许或禁止文件->打印预览菜单
	enableFilePrintPreview : function(bShow){
		try{
			this.active.FilePrintPreview = bShow;
		}catch(e){
		}
	},
	//创建新文档
	//"Word.Document":Word文档
	//"Excel.Sheet":Excel工作表
	//"Excel.Chart":Excel图表
	//"PowerPoint.Show":PowerPoint幻灯片
	//"Visio.Drawing":Visio画图
	//"MSProject.Project":MS Project项目
	//"WPSFile.4.8001":WPS2003文档
	//"WPS.Document":WPS2005文档
	//"ET.Sheet.1.80.01.2001":金山电子表
	createDocument : function(type){
		try{
			this.active.CreateNew(type);
		}catch(e){
		}
	},

	//显示提示信息
	showDialog : function(style){
		try{
			this.active.ShowDialog(style);
		}catch(e){
		}
	},
	//不提示用户，直接打开指定的本地文件
	openLocalFile : function(file){
		try{
			this.localfile = file;
			this.active.OpenLocalFile(file);
		}catch(e){
		}
	},
	//不提示用户，直接保存为指定的本地文件
	saveToLocal : function(file,cover){
		try{
			this.active.SaveToLocal(file,cover);
		}catch(e){
		}
	},
	//重新加载文档
	reload : function(){
		try{
			if(this.localfile && this.localfile.length >1){
				this.openLocalFile(this.localfile);
			}else if(this.urlfile && this.urlfile.length >1){
				this.openFromUrl(this.urlfile);
			}else if(this.getData && this.getData.length >1){
//				var url = sys.getContextPath()
//					+"/artery/form/dealParse.do?action=runItemLogic&method=getData"
//					+"&formid="+this.formId
//					+"&itemid="+this.id
//					+"&itemType=apOffice";
				var params = Artery.getParams({
					"method":"getData",
					"itemType":"apOffice"
				},this);
				
				var url = sys.getContextPath()+"/artery/form/dealParse.do?action=runItemLogic"+"&"+Artery.urlEncode(params);;
				this.openFromUrl(url);
	
			}
		}catch(e){
			//Artery.showMessage("加载失败...");
		}
	},
	//从URL打开指定的文件
	openFromUrl : function(file){
		try{
			this.urlfile = file;
			this.active.OpenFromURL(file);
		}catch(e){
			//Artery.showMessage("加载失败...");
		}
	},
	//关闭文档
	close : function(){
		try{
			this.active.Close();
		}catch(e){
			//Artery.showMessage("加载失败...");
		}
	}
	
});

Ext.reg('apOffice', Artery.plugin.Office);