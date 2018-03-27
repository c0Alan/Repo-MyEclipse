/**
 * 支持用html片段生成
 * 
 * @author weijx
 * @date 2009-02-19
 */
Artery.plugin.TbText = function(config){
	Artery.plugin.TbText.superclass.constructor.call(this, config);
	// 直接查找html片段
	this.el = Ext.get(config.id);
}

Ext.extend(Artery.plugin.TbText,Ext.Toolbar.Item,{

	onRender : function(td){
        this.td = td;
        this.td.appendChild(this.el.dom);
        if(this.hidden){
        	this.hide();
        }
    },
    
    /**
     * 更新显示内容
     */
    updateText : function(text) {
		this.el.dom.innerHTML = text;
	},
	setValue: function(text){
		this.updateText(text);
	},
	
	setText: function(text){
		this.updateText(text);
	},
	
	setHtml: function(text){
		this.updateText(text);
	}
});

Ext.reg('apTbText', Artery.plugin.TbText);