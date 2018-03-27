/*
 * 修改密码button
 * @author weijx
 * @date 2009-02-02
 */
Artery.plugin.TbChangePassword = Ext.extend(Artery.plugin.BaseButton,{
	
	oldPasswordField : null,
	newPassword1Field : null,
	newPassword2Field : null,
	spanId: null,
	
	/**
	 * 修改密码窗口
	 */
	changeWindow : null,
	
	initComponent: function(){		
		this.oldPasswordField = new Ext.form.TextField({
			fieldLabel : '旧密码',
			inputType : 'password',
			anchor : '98%'
		});
		this.newPassword1Field = new Ext.form.TextField({
			fieldLabel : '新密码',
			inputType : 'password',
			anchor : '98%'
		});
		this.newPassword2Field = new Ext.form.TextField({
			fieldLabel : '确认新密码',
			inputType : 'password',
			anchor : '98%'
		});
		var form = new Ext.form.FormPanel({
			baseCls : 'x-plain',
			labelWidth : 70,
			items : [
				this.oldPasswordField,
				this.newPassword1Field,
				this.newPassword2Field
			]
		});
		var myObj = this;
		this.spanId = Ext.id();
		this.changeWindow = new Ext.Window({
			layout:'anchor',
			title : '修改密码',
			width : 400,
			height : 190,
			plain : true,
			resizable : true,
			closeAction : "hide",
			bodyStyle : 'padding:5px;',
			buttonAlign : 'right',
			modal : true,
			items : [form,{
				baseCls : 'x-plain',
				html: "<span id='"+this.spanId+"' style=\"color:red;\"></span>"
			}],
			buttons : [{
				text : '确 定',
				handler : function() {
					myObj.changepw();
				}
			}, {
				text : "取消",
				handler : function() {
					myObj.changeWindow.setVisible(false);
				}
			}]
		});
		this.mon(this, this.clickEvent, this.clickHandler, this);
		Artery.plugin.TbChangePassword.superclass.initComponent.call(this);
	},
	
	clickHandler : function() {
		this.oldPasswordField.setValue();
		this.newPassword1Field.setValue();
		this.newPassword2Field.setValue();
		var msgTag = document.getElementById(this.spanId);
		if(msgTag){
			msgTag.innerHTML = "";
		}
		this.changeWindow.show();
	},
	
	/**
	 * 确定按钮事件函数
	 */
	changepw : function() {
		var oldP = this.oldPasswordField.getValue();
		var newP1 = this.newPassword1Field.getValue();
		var newP2 = this.newPassword2Field.getValue();
		if (newP1 != newP2) {
			document.getElementById(this.spanId).innerHTML = "‘新密码’与‘确认新密码’不一致";
			return;
		}
		if (oldP == newP1) {
			document.getElementById(this.spanId).innerHTML = "‘新密码’与‘旧密码’一样";
			return;
		}
		var paramObj = Artery.getParams({
			oldvalue: oldP,
			newvalue: newP1,
			method: "alterPassword"
		}, this);
		Artery.request({
			url : sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic",
			success : function(response, options) {
				var msg = response.responseText;
				if(msg.trim() == "ok"){
					this.changeWindow.setVisible(false);
					Ext.getBody().mask("<font color=red>修改密码成功</font>");
					(function(){
						Ext.getBody().unmask();
					}).defer(2000);
				}else{
					document.getElementById(this.spanId).innerHTML = msg;
				}
				Artery.regItemEvent(
								this,
								'onPassModiEvent', 'onPassModiServer', {
									'msg' : msg
								});
			},
			params : paramObj,
			scope : this
		});
	}
});

Ext.reg('apTbChangePassword', Artery.plugin.TbChangePassword);