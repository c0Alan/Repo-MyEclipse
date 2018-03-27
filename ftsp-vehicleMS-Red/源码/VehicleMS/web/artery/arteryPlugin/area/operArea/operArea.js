/**
 * 操作区域类
 * 
 * @author weijx
 * @date 17/02/2009
 */
Artery.plugin.OperArea = Ext.extend(Artery.plugin.BaseContainer, {
	
	/**
	 * 为true,则加载时显示mask
	 * 默认为false
	 */
	loadMask: false,
	
	iframeEl:null,
	
	onRender : function(ct, position){
        Artery.plugin.OperArea.superclass.onRender.call(this, ct, position);
        this.iframeEl = document.getElementById(this.id + "_iframe");
        if(!Ext.isEmpty(this.formUrl)){
        	this.showLink(this.formUrl);
        }
    },
	
	// iframe加载完后回调
	afterLoad: function(){
		if(this.loadMask){
			if(this.el.parent()){
				this.el.parent().unmask();
			}else{
				this.el.unmask();
			}
		}
	},
	
	// 重新加载区域
	reloadArea : function() {
		this.showLink(this.iframeEl.src);
	},

	// 显示链接
	showLink : function(link) {
		if (link.trim() != '') {
			if(this.loadMask){
				if(this.el.parent()){
					this.el.parent().mask("加载中...");
				}else{
					this.el.mask("加载中...");
				}
			}
			this.iframeEl.src = link;
			return this.iframeEl;
		}
		return null;
	},

	// 显示表单
	showForm : function(linkto) {
		var url = Ext.tusc.getLinkUrl(linkto);
		this.showLink(url);
	},
	
	openForm: function(linkto){
		this.showForm(linkto);
	},

	// private 从linkto对象中获得URL
	getLinkUrl : function(linkto) {
		if (linkto) {
			var formId = linkto.formId;
			var formType = linkto.formType;
			var url = null;
			if (formType == 4) { // 外挂表单
				url = Artery.PLUGIN_URL + "&id=" + formId;
			} else {
				url = Artery.FORM_URL + formId;
			}
			// 添加其他参数
			for (var p in linkto.params) {
				var pv = linkto.params[p];
				url += "&" + p + "=" + pv;
			}
			return url;
		}
		return "";
	},
	
	clear:function(){
		this.iframeEl.src="about:blank";
		if (this.iframeEl.removeNode) {
			this.iframeEl.removeNode(true);
		}
		var cfg = {
			tag:'iframe',
			id:this.id + "_iframe",
			name:this.id + "_iframe",
			style:'width:100%;height:100%;',
			frameborder:0
		};
		if(this.loadMask){
			cfg.onload = "Artery.get('"+this.id +"').afterLoad();";
		}
		this.el.createChild(cfg);
		this.iframeEl = document.getElementById(this.id + "_iframe");
	}
});

Ext.reg('apOperArea', Artery.plugin.OperArea);