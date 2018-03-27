/**
 * Artery ButtonArea component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.ButtonArea = Ext.extend(Artery.plugin.BaseContainer, {
	
	border: false,
	
	//位置
	align:'left',
	
	//按钮布局方向，水平或垂直
	direction:'hor',
	
	//按钮间距
	spacing:5,
	
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		Ext.Container.superclass.onRender.call(this, ct, position);
	},
	//增加组件
	addItem: function(cfg){
		//html
		var table = this.el.child("table").dom;
		if(this.direction == 'hor'){
			//水平
			if(table.rows == null || table.rows.length == 0){
				table.insertRow();
			}
			var td = table.rows[0].insertCell();
			if(table.rows.length != 1){
				td.style.paddingLeft = this.spacing;
			}
			td.innerHTML = cfg.html;
		}else{
			//垂直
			var td = table.insertRow().insertCell();
			if(table.rows.length != 1){
				td.style.paddingTop = this.spacing;
			}
			td.innerHTML = cfg.html;
		}
		
		//js
		eval(cfg.script);
		var item = Artery.initItem(eval(cfg.initItemId));
		this.add(item);
		return item;
	},
	
	//移除组件
	removeItem: function(id){
		if(this.direction == 'hor'){
			Ext.get(id).parent('td').remove();
		}else{
			Ext.get(id).parent('tr').remove();
		}
		this.remove(id);
	},
	
	isHidden : function(){
    	return this.hidden;
    }
});

Ext.reg('apButtonArea', Artery.plugin.ButtonArea);