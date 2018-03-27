Artery.plugin.FaKindEditor = Ext.extend(Ext.form.TextField,{
	
	initComponent : function() {
		Artery.plugin.FaKindEditor.superclass.initComponent.call(this);
	},
	
	onRender : function(ct, position) {
		Artery.plugin.FaKindEditor.superclass.onRender.call(this);
		if(this.items.length ==0 ){
			if(this.editorStyle=="default"){
				this.items = getItems().split(",");
			}else{
				this.allowUpload = false;
				if(this.items.length<2){
					this.items = getSimpleItems().split(",");
				}
			}
		}else
		{
			this.items = this.items.split(",");
		}
		if(this.imageUploadJson.length <2){
			this.imageUploadJson = sys.getContextPath()
							+"/artery/form/dealParse.do?action=runItemLogic&method=uploadImg"
							+"&formid="+this.formId
							+"&itemid="+this.id
							+"&itemType=apkindeditor";
		}
		if(this.fileManagerJson.length < 2){
			this.fileManagerJson = sys.getContextPath()
							+"/artery/form/dealParse.do?action=runItemLogic&method=getImgList"
							+"&formid="+this.formId
							+"&itemid="+this.id
							+"&itemType=apkindeditor"
		}

		this.htmlTags = getHtmlTags();
		KE.show({
			comp:this,
			oldHtml:this.oldHtml,
			required:this.required,
			
			id : this.id,
			skinsPath: this.scriptPath+'skins/',
			pluginsPath: this.scriptPath+'plugins/',
			items : this.items,
			minWidth : this.minWidth,
			minHeight : this.minHeight,
			filterMode : this.filterMode,
			htmlTags : this.htmlTags,
			resizeMode : this.resizeMode,
			skinType : this.skinType,
			wyswygMode : this.wyswygMode,
			cssPath : this.cssPath.split(","),
			minChangeSize : this.minChangeSize,
			loadStyleMode : this.loadStyleMode,
			allowFileManager : this.allowFileManager,
			imageUploadJson : this.imageUploadJson,
			fileManagerJson : this.fileManagerJson,
			referMethod : this.referMethod,
			newlineTag : this.newlineTag,
			allowUpload : this.allowUpload,
			dialogAlignType : this.dialogAlignType,
			shadowMode : this.shadowMode,
			allowPreviewEmoticons : this.allowPreviewEmoticons,
			useContextmenu : this.useContextmenu,
			syncType : this.syncType,
			tabIndex : this.tabIndex,
			
			afterCreate : function(){
				if(Ext.get(this.id).prev()){
					Ext.get(this.id).prev().child("td.ke-textarea-outer").setStyle("height","100%");
					Ext.get(this.id).prev().child("table.ke-textarea-table").setStyle("height","100%");
					Ext.get(this.id).prev().child("iframe.ke-iframe").setStyle("height","100%");
					Ext.get(this.id).prev().child("textarea.ke-textarea").setStyle("height","100%");
				}
				Artery.regItemEvent(this.comp,'afterCreate','afterCreateServer');
				KE.scriptPath = this.skinsPath;
				this.comp.isCreateKE = true;
			},
			afterChange : function(){
				Artery.regItemEvent(this.comp, 'onKeyupEvent','onKeyupServer');
			},
			afterFocus : function(){
				this.comp.oldHtml = KE.html(this.comp.id);
			},
			afterBlur : function(){
				this.comp.validate();
				Artery.regItemEvent(this.comp, 'onChangeEvent','onChangeServer',{
						'oldValue' : this.comp.oldHtml,
						'newValue' : KE.html(this.comp.id)
						});
			}
		});
	},
	onlyValidEvent : function(){
		return Artery.regItemEvent(this, 'onValidEvent','onValidServer', {
					'value':KE.html(this.id)
				});
	},
	validate : function(){
		if (!this.isCreateKE) {
			return true; // 编辑器未创建完成
		}
		return this.validateValue();
	},	
	// 表单自动验证调用的方法
	validateValue : function() {
		// 处理验证时脚本
		if(this.onValidEvent){
			//throw e;
			var msg = this.onlyValidEvent();
			if (msg !== true) {
				this.markInvalid(msg);
				return false;
			}
		}
		//处理属性验证
		if(this.allowBlankWhenRequired){
			if(KE.html(this.id).length==0){
				this.markInvalid(this.blankText);
				return false;
			}
		}else{
			if(this.required && KE.isEmpty(this.id)){
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if(this.maxLength && KE.count(this.id,'html') > this.maxLength){
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		if(this.minLength && KE.count(this.id,'html') < this.minLength){
			 this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		this.clearInvalid();
		return true;
	},
	markInvalid : function(msg){
		if(Ext.get(this.id).prev()){
			this.fireEvent('invalid', this.getActionEl(), msg);
		}
	},
	getActionEl : function(){
		if(Ext.get(this.id).prev()){
			return Ext.get(this.id).prev();
		}
		return;
	},
	
	getErrorTipEl: function(){
		return Ext.get(this.id).prev();
	},
	
	//返回编辑器HTML
	getHtml : function(){
		return KE.html(this.id);
	},
	//设置编辑器HTML
	setHtml : function(val){
		KE.html(this.id, val);
	},
	setValue:function(val){
		Artery.plugin.FaKindEditor.superclass.setValue.call(this,val);
		this.setHtml(val);
	},
	//获取编辑器纯文本
	getText : function(){
		return KE.text(this.id);
	},
	//设置编辑器纯文本
	setText : function(val){
		KE.text(this.id,val);
	},
	//获得当前被选中的内容
	getSelectHtml : function(){
		return KE.selectedHtml(this.id);
	},
	//获得编辑器内容文字数量
	//(mode可选，默认值也"html"，mode为"html"时取得字数包含HTML代码，mode为"text"时只包含纯文本、IMG、EMBED)
	getCount : function(mode){
		return KE.count(this.id, mode);
	},
	//判断编辑器是否有可见内容，比如文本、图片、视频
	isEmpty : function(){
		return KE.isEmpty(this.id);
	},
	//在光标处插入HTML
	insertHtml : function(val){
		KE.insertHtml(this.id, val);
	},
	//在最后追加HTML
	appendHtml : function(val){
		KE.appendHtml(this.id, val);
	},
	//获得焦点
	focus : function(){
		KE.focus(this.id);
	},
	//失去焦点
	blur:function(){
		KE.blur(this.id);
	},
	//同步数据
	sync:function(){
		KE.sync(this.id);
	},
	//浏览器类型和版本，分别为KE.browser.IE、KE.browser.WEBKIT、KE.browser.GECKO、KE.browser.OPERA、KE.browser.VERSION
	getBrowser : function(){
		return KE.browser;
	},
	//编辑区域的iframe对象
	getIframeDoc : function(){
		return KE.g[this.id].iframeDoc;
	},
	//当前选中信息的KE.selection对象
	getKeSel : function(){
		return KE.g[this.id].keSel;
	},
	//前选中信息的浏览器原生selection对象
	getSel : function(){
		return KE.g[this.id].sel;
	},
	//当前选中信息的KE.range对象
	getKeRange: function(){
		return KE.g[this.id].keRange;
	},
	//当前选中信息的浏览器原生range对象
	getRange: function(){
		return KE.g[this.id].range;
	}	
})

//注册组件
Ext.reg('apkindeditor', Artery.plugin.FaKindEditor);

function getItems(){
	var res;
	res="source,|,fullscreen,undo,redo,print,cut,copy,paste,";
	res+="plainpaste,wordpaste,|,justifyleft,justifycenter,justifyright,";
	res+="justifyfull,insertorderedlist,insertunorderedlist,indent,outdent,subscript,";
	res+="superscript,|,selectall,-,";
	res+="title,fontname,fontsize,|,textcolor,bgcolor,bold,";
	res+="italic,underline,strikethrough,removeformat,|,image,";
	res+="flash,media,advtable,hr,emoticons,link,unlink,|,about";
	return res;
}
function getSimpleItems(){
	var res;
	res="fontname,fontsize,|,textcolor,bgcolor,bold,italic,underline,";
	res+="removeformat,|,justifyleft,justifycenter,justifyright,insertorderedlist,";
	res+="insertunorderedlist,|,emoticons,image,link";
	return res;
}
function getHtmlTags(){
	res = "{";
	res += "font : ['color', 'size', 'face', '.background-color'],";
	res += "span : ['style'],";
	res += "div : ['class', 'align', 'style'],";
	res += "table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],";
	res += "'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style'],";
	res += "a : ['class', 'href', 'target', 'name', 'style'],";
	res += "embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality',";
	res += "'style', 'align', 'allowscriptaccess', '/'],";
	res += "img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],";
	res += "hr : ['class', '/'],";
	res += "br : ['/'],";
	res += "'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : ['align', 'style'],";
	res += "'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []";
	res += "}";
	return res;
}

Artery.plugin.FaKindEditorDisplay = Ext.extend(Artery.plugin.BaseContainer, {
	
	initComponent : function() {
		Artery.plugin.FaKindEditorDisplay.superclass.initComponent.call(this);
	},

	onRender : function(ct, position) {
		Artery.plugin.FaKindEditorDisplay.superclass.onRender.call(this, ct, position);
		this.iframeEl = Ext.get(this.id + "_iframe");
		var doc = this.getIframeDoc();
		doc.open();
		doc.write("<html>");
		doc.write("<head>");
		doc.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>");
		doc.write("<link href=\""+sys.getContextPath()+"/artery/components/kindeditor-3.5.5/skins/common/editor.css\" rel=\"stylesheet\" type=\"text/css\"/>");
		doc.write("</head>");
		doc.write("<body class='ke-content'>");
		doc.write(this.value);
		doc.write("</body>");
		doc.write("</html>");
		doc.close();
		
		Ext.EventManager.on(window, 'load', function(){
			var doc = this.getIframeDoc();
			if (doc.body.scrollHeight > doc.body.offsetHeight) {
				this.el.setHeight(doc.body.scrollHeight);
			}
		}, this);
	},
	getIframeDoc : function() {
		return this.iframeEl.dom.contentDocument || this.iframeEl.dom.contentWindow.document;
	}
})

Ext.reg('apkindeditordisplay', Artery.plugin.FaKindEditorDisplay);