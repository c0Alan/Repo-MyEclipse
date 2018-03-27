﻿﻿// ***************************************************************************************//
// FaStringInput
// ***************************************************************************************//
/**
 * Artery textfield component
 * 
 * @author baon
 * @date 17/02/2009
 * 
 * @class Ext.tusc.TextField
 * @extends Ext.form.TextField
 */
Artery.plugin.FaBlankLayout = Ext.extend(Artery.plugin.BaseContainer, {
	
	layout:'atylayout',
	
//	hideParent : true,
	
	afterRender : function() {
		Artery.plugin.FaBlankLayout.superclass.afterRender.call(this);
		this.trimTable();
		// 业务提示信息
		if(!Ext.isEmpty(this.comment)){
			this.tipEl = Ext.get("comment_"+this.id);
			if(this.tipEl){
				this.tipEl.on("click", Artery.showComment, this);
			}
		}
	},

	// override
//	getVisibiltyEl : function() {
//		//return this.hideParent ? this.container : this.getActionEl();
//		if(this.hideParent) {
//			var ctn = this.el.findParentNode('td.x-form-td-cust', 5, true);
//			if (!Ext.isEmpty(ctn)) {
//				return ctn;
//			}
//		}
//		return this.getActionEl();
//	},

	trimTable: function(){
		var table = this.el.child("table.x-form-table-cust",true);
		var rows = table.rows;
		var td;
		for(var i=0; i<rows.length;i++){
			var cells = rows[i].cells;
			for(var j = 0;j< cells.length;j++){
				td = cells[j];
				if(i ==0){
					cells[j].style.borderTop = "0px";
					cells[j].style.paddingTop = "0px";
				}
				if(i ==rows.length-1){
					cells[j].style.borderBottom = "0px";
					cells[j].style.paddingBottom = "0px";
				}
				if(j == 0){
					cells[j].style.borderLeft = "0px";
					cells[j].style.paddingLeft = "0px";
				}
				if(j == cells.length-1 ){
					cells[j].style.borderRight = "0px";
					cells[j].style.paddingRight = "0px";
				}
			}
		}
	},
	
	/**
	 * 设置所有子控件为只读
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为只读
	 *                         false：所有子控件都设置为只读
	 */
	readAllSub : function(isDirect) {
		this.items.each(function() {
			if(!Ext.isTrue(isDirect) && this.readAllSub){
				this.readAllSub();
			}else if(this.read){
				this.read();
			}
		});
	},
	
	/**
	 * 设置所有子控件为可编辑
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为可编辑
	 *                         false：所有子控件都设置为可编辑
	 */
	editAllSub : function(isDirect) {
		this.items.each(function() {
			if(!Ext.isTrue(isDirect) && this.editAllSub){
				this.editAllSub();
			}else if(this.edit){
				this.edit();
			}
		});
	},
	
	/**
	 * 设置所有子控件为无效
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为只读
	 *                         false：所有子控件都设置为只读
	 */
	disableAllSub : function(isDirect) {
		this.items.each(function() {
			if(!Ext.isTrue(isDirect) && this.disableAllSub){
				this.disableAllSub();
			}else if(this.disable){
				this.disable();
			}
		});
	},
	
	/**
	 * 设置所有子控件为有效
	 * @param Boolean isDirect 是否只设置直接子控件
	 *                         true：仅将直接子控件设置为可有效
	 *                         false：所有子控件都设置为可有效
	 */
	enableAllSub : function(isDirect) {
		this.items.each(function() {
			if(!Ext.isTrue(isDirect) && this.enableAllSub){
				this.enableAllSub();
			}else if(this.enable){
				this.enable();
			}
		});
	}
})

// register xtype
Ext.reg('apfablanklayout', Artery.plugin.FaBlankLayout);