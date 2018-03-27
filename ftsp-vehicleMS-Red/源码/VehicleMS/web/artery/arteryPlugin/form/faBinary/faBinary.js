// ***************************************************************************************//
// FaBinaryImage
// ***************************************************************************************//
/**
 * Artery FaBinaryImage component
 * 
 * @author baon
 * @date 26/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaBinaryImage = Ext.extend(Ext.form.TextField, {

	allowDomMove:false,
	
	autoEl: null,
	
	validateOnBlur:true,
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		this.img = Ext.get("img" + this.id);
		this.wrap = Ext.get("wrap" + this.id);
		if(this.wrap == null){
			return;
		}
		this.imgWrap = this.wrap.child(".x-form-file-wrap-cust");
		this.tdWrap = Ext.get("tdWrap" + this.id);
		this.finput = Ext.get("finput" + this.id);
		this.fbutton = Ext.get("fbutton" + this.id);

		this.resizeEl = this.wrap;
		this.initChangeEvent();
		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}
	},
	
	initChangeEvent : function() {
		this.el.on('change', function() {
			var cfg = {
				form : arteryCommForm,
				url : sys.getContextPath()
						+ '/artery/form/dealParse.do?action=runItemLogic&method=parseUpImg',
				isUpload : true,
				method : 'post',
				scope : this,
				params : Artery.getParams({}, this),
				success : function(response) {
					//alert(sys.getContextPath()+ response.responseText);
					var oldValue = this.value;
					if(response.responseText==""){
						
					}
					else{
						this.img.dom.src = sys.getContextPath()
						+ response.responseText;
					}
					this.value = Artery.getFilePath(this.el.dom);
					var newValue = this.value;
					Artery.regItemEvent(this,'onChangeEvent','onChangeServer',{
						'newValue':newValue,
						'oldValue':oldValue
					});
					this.updateValueTip();
				}
			};
			this.finput.dom.innerHTML = Artery.getFilePath(this.el.dom);
			var isValidate = this.validate(this.finput.dom.innerHTML);
			if(isValidate){
				this.el.appendTo(Ext.get('arteryCommForm'));
				Artery.request(cfg);
				this.el.appendTo(this.tdWrap);
			}
		}, this);
	},
	
	updateValueTip: function(){
		if(!this.showValueTip){
    		return ;
    	}
    	var elVal = this.finput.dom.innerHTML;
    	if(!Ext.isEmpty(elVal)){
    		this.finput.dom.title = elVal;
    	}else{
    		this.finput.dom.title = "";
    	}
    },
	
	// private
    initEvents : function(){
    	Artery.plugin.FaBinaryImage.superclass.initEvents.call(this);
        this.mon(this.finput, Ext.EventManager.useKeydown ? "keydown" : "keypress", this.fireKey,  this);
        this.mon(this.finput, 'focus', this.onFocus, this);

        // fix weird FF/Win editor issue when changing OS window focus
        var o = this.inEditor && Ext.isWindows && Ext.isGecko ? {buffer:10} : null;
        this.mon(this.finput, 'blur', this.onBlur, this, o);
    },
    
    //得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.finput;
	},
	
	setValue : function(v) {
		this.value = v;
		if(Ext.isEmpty(v)){
			this.img.dom.src = sys.getContextPath()+ "/artery/arteryTheme/theme/default/images/previewimg.gif";
			return;
		}
		var url = v
		if(v.substring(0,1) == '{'){
			var jsonVal = Ext.decode(v);
			var url = jsonVal.url;
		}
		this.img.dom.src = url;
	},
	validateValue : function(value) {
		var elTemp = this.el;
		this.el = this.finput;
		
		if (value.length < 1 || value === this.emptyText) { // if it's blank
			if (this.allowBlank
					|| this.img.dom.src.indexOf('/artery/arteryTheme/theme/default/images/') == -1) {
				this.clearInvalid();
				this.el = elTemp;
			} else {
				this.markInvalid(this.blankText);
				this.el = elTemp;
				return false;
			}
		}
		if (value.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			this.el = elTemp;
			return false;
		}
		if (value.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			this.el = elTemp;
			return false;
		}
		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
				this.el = elTemp;
				return false;
			}
		}
		if (typeof this.validator == "function") {
			var msg = this.validator(value);
			if (msg !== true) {
				this.markInvalid(msg);
				this.el = elTemp;
				return false;
			}
		}
		if (this.regex && !this.regex.test(value)) {
			this.markInvalid(this.regexText);
			this.el = elTemp;
			return false;
		}
		this.clearInvalid();
		this.el = elTemp;
		return true;
	},
	    // private
    onDisable : function(){
        Artery.plugin.FaBinaryImage.superclass.onDisable.call(this);
        this.finput.dom.disabled = true;
        this.fbutton.addClass('x-item-disabled');
    },

    // private
    onEnable : function(){
         Artery.plugin.FaBinaryImage.superclass.onEnable.call(this);
         this.finput.dom.disabled = false;
         this.fbutton.removeClass('x-item-disabled');
    },

	clear : function() {
		this.setValue("");
		if (this.finput && this.finput.dom) {
			this.finput.dom.innerHTML = "";
		}
		if (Ext.isIE) {
			this.el = this.el.replaceWith(this.el.dom.cloneNode());
			this.initChangeEvent();
		} else {
			this.el.dom.value = "";
		}
	}
})

// register xtype
Ext.reg('apfabinaryimage', Artery.plugin.FaBinaryImage);

// ***************************************************************************************//
// FaBinaryFile
// ***************************************************************************************//

Artery.plugin.FaBinaryFileData = function(cfg){
	Ext.apply(this,cfg);
	this.init();
}
Artery.plugin.FaBinaryFileData.prototype = {
	ct:null,
	
	index : 0,
	
	active: false,
	
	value:null,
	
	valid : true,
	
	init: function(){
		//alert(this.index + ":" + this.value);
		if(Ext.isEmpty(this.value)){
			this.value = {};
		}
		this.render();
		this.toggleFile();
		this.hide();
		
		this.initEvent();
		if(this.active){
			this.show();
		}
	},
	
	render: function(){
		if(Ext.get("item" + this.getDataId()) != null){
			this.itemEl = Ext.get("item" + this.getDataId());
			this.fileNameEl = this.itemEl.child("span.x-form-field-filename-cust");
			this.fileClearEl = this.itemEl.child("span.x-form-field-fileclear-cust")
		}else{
			
			this.itemEl = this.ct.itemWrap.createChild({
				id:'item' + this.getDataId()
			})
			//alert(this.getDataId() + ":" + this.itemEl);
			this.fileNameEl = this.itemEl.createChild({
				tag:'span',
				cls:'x-form-field-filename-cust'
			})
			this.fileClearEl = this.itemEl.createChild({
				tag:'span',
				cls:'x-form-field-fileclear-cust'
			})
		}
		this.el = Ext.get(this.getDataId());
		if(this.el == null){
			this.el = this.ct.fileWrap.createChild({
				tag:'input',
				type:'file',
				id:this.getDataId(),
				name:this.ct.el.dom.name,
				cls:'x-form-file-cust'
			})
		}
		this.itemEl.setStyle({'text-align':'left'})
		if(this.ct.multiple && "horizontal" === this.ct.filesAlign){
			this.itemEl.setStyle({'float':'left','white-space':'nowrap'})
		}
	},
	
	initEvent: function(){
		this.initChangeEvent();
		this.fileClearEl.on('click',function(){
			this.clear();
		},this)
	},
	
	initChangeEvent : function() {
		if(!this.ct.multiple){
			this.el.on('change',function(){
				var isValidate = this.ct.validate(this.el.getValue());
				if(isValidate){
	 				this.ct.finput.dom.value =Artery.getFilePath(this.el.dom);
					var oldValue = this.ct.finput.dom.value;
					this.parseFile();
					this.toggleFile();
					this.show();
					var newValue = this.ct.finput.dom.value;
					this.regOnChangeEvent(oldValue, newValue);
				}else{
					if (Ext.isIE) {
						this.el = this.el.replaceWith(this.el.dom.cloneNode());
						this.initChangeEvent();
					} else {
						this.ct.el.dom.value = "";
					}
				}
			},this)
		}else{
			this.el.on('change',function(){
				var isValidate = this.ct.validate(Artery.getFilePath(this.el.dom));
				if(isValidate){
					this.ct.finput.dom.value =Artery.getFilePath(this.el.dom);
//					this.ct.finput.dom.value = this.el.dom.value;
					var oldValue = this.ct.getValue();
					this.parseFile();
					this.toggleFile();
					this.add();
					var newValue = this.ct.getValue();
					this.regOnChangeEvent(oldValue, newValue);
					}else{
						if (Ext.isIE) {
							this.el = this.el.replaceWith(this.el.dom.cloneNode());
							this.initChangeEvent();
						} else {
							this.ct.el.dom.value = "";
						}
					}
			},this)
		}
	},
	
	getDataId: function(){
		if(!this.ct.multiple || (this.index == 0 && Ext.isEmpty(this.value))){
			return this.ct.id;
		}else{
			return this.ct.id + "_" + this.index
		}
	},
	getClearDataId: function(){
		if(!this.ct.multiple || this.index == 0){
			return this.ct.id + "Clear";
		}else{
			return this.ct.id + "Clear" + "_" + this.index
		}
	},
	
	hide: function(){
		if(Ext.isEmpty(this.value.name)){
			this.itemEl.setDisplayed(false);
		}
		this.el.setDisplayed(false);
	},
	
	show: function(){
		this.ct.el = Ext.get(this.getDataId());
		this.el.setDisplayed(true);
		if(!Ext.isEmpty(this.value.name)){
			this.itemEl.setDisplayed(true);
		}
	},
	
	remove: function(){
		if(Ext.isEmpty(Artery.getFilePath(this.el.dom))){
			var clearEl = this.ct.fileCleanHiddenEl.dom
			clearEl.value = clearEl.value + this.getClearValue() + ";";
		}
		this.itemEl.remove();
		if (Ext.isIE) {
			this.el = this.el.replaceWith(this.el.dom.cloneNode());
			this.initChangeEvent();
		} else {
			this.el.remove();
		}
		this.valid = false;
	},
	
	getClearValue: function(){
		if(!Ext.isEmpty(this.value.value)){
			return this.value.value;
		}
		return this.value.name
	},
	
	add: function(){
		this.hide();
		this.ct.addFileData({
			index:this.index +1,
			active:true
		})
	},
	
	clear: function(){
		var oldValue = this.ct.getValue();
		if(!this.ct.multiple){
			this.value.name = "";
			this.toggleFile();
			if(!Ext.isEmpty(this.value.value)){
				this.ct.fileCleanHiddenEl.dom.value = this.value.value;
			}else{
				this.ct.fileCleanHiddenEl.dom.value = "true";
			}
			if (Ext.isIE) {
				this.el = this.el.replaceWith(this.el.dom.cloneNode());
				this.initChangeEvent();
			} else {
				this.ct.el.dom.value = "";
			}
		}else{
			this.remove();
		}
		var newValue= this.ct.getValue();
		this.regOnChangeEvent(oldValue, newValue);
		this.ct.finput.dom.value = "";
		this.ct.validate();
	},

	parseFile : function() {
//		var path = this.el.dom.value;
		var path = Artery.getFilePath(this.el.dom);
		if (Ext.isEmpty(path)) {
			this.value.name = "";
		} else {
			var idx = path.lastIndexOf('\\');
			if (idx == -1) {
				this.value.name = path;
			} else {
				this.value.name = path.substring(idx + 1);
			}
		}
		this.value.url = "";
	},

	toggleFile : function() {
		if (!Ext.isEmpty(this.value.name)) {
			this.fileNameEl.update(this.getFileUrl());
			this.addDownloadEvent(); //添加点击时下载事件
			this.itemEl.setDisplayed(true);
		} else {
			this.fileNameEl.update("");
			this.itemEl.setDisplayed(false);
		}
	},
	
	getFileUrl: function(){
		if(this.value.url){
			return "<a href='" + this._getUrl() + "'>" + this.value.name + "</a>";
		}
		return this.value.name == null?"":this.value.name;
	},
	
	_getUrl: function(){
		if(this.value.url.indexOf(sys.getContextPath() + "/") == 0){
			return  this.value.url;
		}else{
			return sys.getContextPath() + this.value.url;
		}
	},
	
	// 添加点击时下载事件
	addDownloadEvent : function(){
		if(this.ct.onDownloadEvent && Ext.isEmpty(Artery.getFilePath(this.el.dom))){
			var fileName = this.value.name;
			var fileId = this.value.value;
			if(!this.flag){
				this.fileNameEl.on("click", function(){
					if(!this.multiple && this.files.length > 0 && !Ext.isEmpty(this.files[0].el.dom.value)){
						return;	//单个文件上传时，新添加的文件，不触发下载事件
					}
					Artery.regItemEvent(this,'onDownloadEvent','onDownloadServer',{
						'fileName' : fileName,
						'fileId' : fileId
					});
				}, this.ct);
				this.flag = true;
				this.fileNameEl.setStyle("cursor", "hand");
			}
			
		}
	},
	
	//注册onChange事件
	regOnChangeEvent : function(oldValue, newValue){
		Artery.regItemEvent(this.ct,'onChangeEvent','onChangeServer',{
			'newValue':newValue,
			'oldValue':oldValue
		});
	},
	
	read: function(){
		this.fileClearEl.setDisplayed(false);
	},
	edit: function(){
		this.fileClearEl.setDisplayed(true);
	},
	disable: function(){
		this.fileClearEl.setDisplayed(false);
	},
	enable: function(){
		this.fileClearEl.setDisplayed(true);
	},
	
	isValid:function(){
		return this.valid;
	}
}
/**
 * Artery FaBinaryFile component
 * 
 * @author baon
 * @date 26/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaBinaryFile = Ext.extend(Ext.form.TextField, {
	
	autoEl: null,
	
	multiple:false,
	
	files : null,
	
	allowDomMove:false,
	
	validateOnBlur:true,
	initComponent : function() {
		Artery.plugin.FaBinaryFile.superclass.initComponent.call(this);
		this.files = [];
		if(this.multiple){
			if(Ext.isEmpty(this.value)){
				this.value = [];
			}else if((typeof this.value) == 'string' && this.value.charAt(0) == '{'){
				this.value = Ext.decode("[" + this.value + "]");
			}else {
				this.value = Ext.decode(this.value);
			}
			
		}else{
			if(Ext.isEmpty(this.value)){
				this.value = {};
			}else if((typeof this.value) == 'string' && this.value.charAt(0) == '{'){
				this.value = Ext.decode(this.value);
			}
		}
	},
	
	// private
    initEvents : function(){
    	Artery.plugin.FaBinaryFile.superclass.initEvents.call(this);
        this.mon(this.finput, Ext.EventManager.useKeydown ? "keydown" : "keypress", this.fireKey,  this);
        this.mon(this.finput, 'focus', this.onFocus, this);

        // fix weird FF/Win editor issue when changing OS window focus
        var o = this.inEditor && Ext.isWindows && Ext.isGecko ? {buffer:10} : null;
        this.mon(this.finput, 'blur', this.onBlur, this, o);
    },
    
    //得到错误提示定位的对象
	getErrorTipEl: function(){
		return this.finput;
	},
	
	getRawValue : function(){
        return this.getValue();
    },
	
	validateValue : function(value) {
		var elTemp = this.el;
		this.el = this.finput;

		if (Ext.isEmpty(value)
				&& Ext.isEmpty(this.getFileName())) { // if it's blank
			if (this.allowBlank) {
				this.clearInvalid();
				this.el = elTemp;
			} else {
				this.markInvalid(this.blankText);
				this.el = elTemp;
				return false;
			}
		}
		if(this.maxLength!== undefined){
//			var path =this.processValue(this.getRawValue())||value;
			var path = this.el.getValue();
			var idx = path.lastIndexOf('\\');
			if (idx != -1) {
				path = value.substring(idx + 1);
			}
			if (path.length < this.minLength) {
				this.markInvalid(String.format(this.minLengthText, this.minLength));
				this.el = elTemp;
				return false;
			}
			if (path.length > this.maxLength) {
				this.markInvalid(String.format(this.maxLengthText, this.maxLength));
				this.el = elTemp;
				return false;
			}
		}
			
//		if (value.length < this.minLength) {
//			this.markInvalid(String.format(this.minLengthText, this.minLength));
//			this.el = elTemp;
//			return false;
//		}
//		if (value.length > this.maxLength) {
//			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
//			this.el = elTemp;
//			return false;
//		}
		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
				this.el = elTemp;
				return false;
			}
		}
		if (typeof this.validator == "function") {
			var msg = this.validator(value);
			if (msg !== true) {
				this.markInvalid(msg);
				this.el = elTemp;
				return false;
			}
		}
		if (this.regex && !this.regex.test(value)) {
			this.markInvalid(this.regexText);
			this.el = elTemp;
			return false;
		}
		this.clearInvalid();
		this.el = elTemp;
		return true;
	},
	
	updateValueTip: function(){
		if(!this.showValueTip){
    		return ;
    	}
    	var elVal = this.finput.dom.value;
    	if(!Ext.isEmpty(elVal)){
    		this.finput.dom.title = elVal;
    	}else{
    		this.finput.dom.title = "";
    	}
    },
	
	addFileData: function(cfg){
		var datacfg = {
			ct:this
		}
		if(cfg){
			Ext.apply(datacfg,cfg);
		}
		this.files.push(new Artery.plugin.FaBinaryFileData(datacfg))
	},
	
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		if((this.displayType=="display")&&this.displayAllowDownLoad){
			var array =[];
			var first =Ext.fly(this.id).child('div');
			var j=0;
			array[j++]=first;
			while(first!=null){
				sec=first.next("div");
				if(sec!=null){
					array[j++]=sec;
				}
				first =sec;
			} 
			var tmp =this;
			for(var i=0;i<array.length; i++){
				if(array[i]!=null){
					if(i<tmp.value.length){
						array[i].fileName =this.value[i].name;
						array[i].fileId= this.value[i].value;
						array[i].on("click", function(){
						Artery.regItemEvent(tmp,'onDownloadEvent','onDownloadServer',{
							'fileName' : this.fileName,
							'fileId' :  this.fileId
						});
					}, array[i]);
					}
				}
			}
		}
		this.wrap = Ext.get("wrap" + this.id);
		if(this.wrap == null){
			return;
		}
		this.itemWrap = this.wrap.child(".file-name-wrap");
		this.fileWrap = this.wrap.child(".x-form-file-wrap-cust");
		this.resizeEl = this.wrap;
		this.finput = Ext.get("finput" + this.id);
		this.fbutton = Ext.get("fbutton" + this.id);
		this.fileCleanHiddenEl = Ext.get(this.id + "Clear");
		//ct.appendChild(this.wrap);
		
		if(this.multiple){
			if(!this.value){
				this.value = [];
			}
			var l = this.value.length;
			for(var i=0; i<l; i++){
				this.addFileData({
					index:i,
					value:this.value[i]
				})
			}
		}
		
		this.el.on('change', function() {
				this.finput.dom.value = Artery.getFilePath(this.el.dom);
				this.updateValueTip();
		}, this);

		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}
	},
	
	setValue : function(v) {
		if(this.displayType=="display"){
			this.value = v;
			return ;
		}
		var temp=v;
		if(typeof(v)!="string"){
			 temp=Ext.encode(v);
		}
		var l = v.length;
		this.clear();
		while(this.itemWrap.dom.firstChild){
			this.itemWrap.dom.removeChild(this.itemWrap.dom.firstChild);
		}
		this.fileCleanHiddenEl.dom.value="";
		if(typeof(temp)=="string"){
			if(temp.length!=0){
				this.value= eval('('+temp+')');
			}else{
				this.value =temp;
			}
		}
		if(this.value!=null&&this.value.length){
			var l = this.value.length;
			for(var i=0; i<l; i++){
				this.addFileData({
					index:i,
					value:this.value[i]
				});
			}
			this.addFileData({
				index:l,
				active:true
			})
		}
		else{
			this.addFileData({index:0,value:this.value,active:true});
//			this.addFileData({index:1,active:true});
		}
		if(this.files && this.files.length>0){
			for(var j=0;j<this.files.length;j++){
				var file = this.files[j];
				if(file.value.name){
					file.toggleFile();
				}
				
			}	
		}
	},

	getValue : function(){
		if(this.multiple){	//多文件时，以分号分隔
			var l = this.files.length;
			var a = [];
			for(var i=0;i<l;i++){
				if(this.files[i].isValid() && !Ext.isEmpty(this.files[i].value.name)){
					a.push(this.files[i].el.dom.value);
				}
			}
			return a.join(",")
		}else{
			return Artery.plugin.FaBinaryFile.superclass.getValue.call(this);
		}
	},
	
	getFileName: function(){
		var l = this.files.length;
		var a = [];
		for(var i=0;i<l;i++){
			if(this.files[i].isValid() && !Ext.isEmpty(this.files[i].value.name)){
				a.push(this.files[i].value.name);
			}
		}
		return a.join(",")
	},
	
	getFileCount: function(){
		var l = this.files.length;
		var count = 0;
		for(var i = 0; i< l;i++){
			if(this.files[i].isValid() && !Ext.isEmpty(this.files[i].value.name)){
				count++;
			}
		}
		return count;
	},
	
	reset: function(){
		this.clear();	
		if(this.fileCleanHiddenEl&&this.fileCleanHiddenEl.dom){
			this.fileCleanHiddenEl.dom.value="";
		}
	},
	
	clear: function(){
		var l = this.files.length;
		for(var i = 0; i< l;i++){
			if(!Ext.isEmpty(this.files[i].value.name)){
				this.files[i].clear();
			}
		}
		if(this.finput && this.finput.dom){
			this.finput.dom.value="";
		}
	},

	// private
	read : function() {
		Artery.plugin.FaBinaryFile.superclass.read.call(this);
		var l = this.files.length;
		for(var i = 0; i< l;i++){
			this.files[i].read();
		}
	},

	edit : function() {
		Artery.plugin.FaBinaryFile.superclass.edit.call(this);
		var l = this.files.length;
		for(var i = 0; i< l;i++){
			this.files[i].edit();
		}
	},
	// private
	disable : function() {
		Artery.plugin.FaBinaryFile.superclass.disable.call(this);
		var l = this.files.length;
		for(var i = 0; i< l;i++){
			this.files[i].disable();
		}
	},

	enable : function() {
		Artery.plugin.FaBinaryFile.superclass.enable.call(this);
		var l = this.files.length;
		for(var i = 0; i< l;i++){
			this.files[i].enable();
		}
	},
	    // private
    onDisable : function(){
        Artery.plugin.FaBinaryFile.superclass.onDisable.call(this);
        this.finput.dom.disabled = true;
        this.fbutton.dom.disabled = true;
    },

    // private
    onEnable : function(){
         Artery.plugin.FaBinaryFile.superclass.onEnable.call(this);
         this.finput.dom.disabled = false;
         this.fbutton.dom.disabled = false;
    }
})

// register xtype
Ext.reg('apfabinaryfile', Artery.plugin.FaBinaryFile);
