/**
 * 子系统切换select
 */
Artery.plugin.sysChange = function(itemid){
	var val = Ext.getDom(itemid).value;
	if(val!="-1"){
		var url = sys.getContextPath() + "/artery/subsys.do?action=enterSystem&sysID=" + val;
		window.location = url;
	}
}

/**
 * 子系统切换button
 */
Artery.plugin.TbSysChangeButton = Ext.extend(Artery.plugin.BaseButton,{
	
	/**
	 * 发布的子系统列表
	 */
	sysArray : null,
	
	sysStore : null,
	
	myDataView : null,
	
	/**
	 * 选择子系统窗口
	 */
	selectWindow : null,
	
	/**
	 * 显示方式是否为window
	 */
	isWindow : false,
	
	/**
	 * 当类型为combobox时，生成的select对象
	 */
	selectEl : null,
	
	onRender : function(ct, position){
        this.selectEl = Ext.get(this.id);
        if(this.isWindow){
        	Artery.plugin.TbSysChangeButton.superclass.onRender.call(this,ct, position);
        }
    },
	
	onDestroy : function() {
		Ext.Button.superclass.onDestroy.call(this);
		if (this.container) {
			this.container.remove();
		}
	},

	openWindow : function() {
		this.selectWindow.show();
	},
	
    hide : function(){
    	if(this.isWindow){
    		Ext.BoxComponent.superclass.hide.call(this);
    	}else{
    		this.hideSelect();
    	}
    },
    
    hideSelect : function(){
    	var tdEl = this.selectEl.findParent("td", 3, true);
    	if(tdEl && tdEl != null){
    		tdEl.addClass('x-hide-' + this.hideMode);
    	}
    },
    
    show : function(){
    	if(this.isWindow){
    		Ext.BoxComponent.superclass.hide.call(this);
    	}else{
    		this.showSelect();
    	}
    },
    
    showSelect : function(){
    	var tdEl = this.selectEl.findParent("td", 3, true);
    	if(tdEl && tdEl != null){
    		tdEl.removeClass('x-hide-' + this.hideMode);
    	}
    },
    
    disable : function(){
    	if(this.isWindow){
    		Ext.BoxComponent.superclass.disable.call(this);
    	}else{
    		this.disableSelect();
    	}
    },
    
    disableSelect : function(){
    	var tdEl = this.selectEl.findParent("td", 3, true);
    	tdEl.addClass(this.disabledClass);
        this.selectEl.dom.disabled = true;
    },
    
    enable : function(){
    	if(this.isWindow){
    		Ext.BoxComponent.superclass.enable.call(this);
    	}else{
    		this.enableSelect();
    	}
    },
    
    enableSelect : function(){
    	var tdEl = this.selectEl.findParent("td", 3, true);
    	tdEl.removeClass(this.disabledClass);
        this.selectEl.dom.disabled = false;
    },

	initComponent : function() {
		if(!this.isWindow){
			return ;
		}
		if (this.sysArray === null) {
			alert("必须设置子系统数组：sysArray");
			return;
		}
		this.sysStore = new Ext.data.SimpleStore({
			fields : ['name', 'url', 'id'],
			data : this.sysArray
		});

		var tpl = new Ext.XTemplate(
				'<tpl for=".">',
				'<div class="thumb-wrap" sysID="{id}" style="width:80;height:40;">',
				'  <div class="thumb">',
				'    <table width=100% height=100%><tr><td align="center" vertical-align="middle">',
				'      <img src="{url}" title="{name}">',
				'    </td></tr></table>',
				'  </div>',
				'  <span style="font: 11px Arial, Helvetica, sans-serif;">{shortName}</span>',
				'</div>', '</tpl>', '<div class="x-clear"></div>');
		
		this.myDataView = new Ext.DataView({
			store : this.sysStore,
			tpl : tpl,
			autoHeight : true,
			autoWidth : true,
			overClass : 'x-view-over',
			itemSelector : 'div.thumb-wrap',
			emptyText : 'No images to display',
			prepareData : function(data) {
				data.shortName = Ext.util.Format.ellipsis(data.name, 15);
				return data;
			},
			listeners : {
				click : function(dataview, index, node, e) {
					if (node.sysID) {
						var url = sys.getContextPath()
								+ "/artery/subsys.do?action=enterSystem&sysID="
								+ node.sysID;
						window.location = url;
					}
				}
			}
		});

		this.selectWindow = new Ext.Window({
			title : '子系统切换',
			width : 445,
			resizable : false,
			bodyStyle : "background-color: #aabbdd;",
			closeAction : 'hide',
			closable : true,
			border : false,
			layout : 'fit',
			items : [this.myDataView]
		});
		this.mon(this, this.clickEvent, this.openWindow, this);
		Artery.plugin.TbSysChangeButton.superclass.initComponent.call(this);
	}
})

Ext.reg('apTbSysChangeButton', Artery.plugin.TbSysChangeButton);