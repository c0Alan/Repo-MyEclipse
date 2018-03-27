/**
 * 示例
 * @author baon
 * @date 2009-06-01
 */
 
Artery.plugin.Window = Ext.extend(Artery.plugin.BaseComponent,{
	
	title:null,
	
	layout:null,
	
	draggable:true,
	
	resizable:true,
	
	onCloseEvent:null,
	
	className:null,
	
	themeStyle:null,
	
	initComponent : function() {
		delete this.items;
		Artery.plugin.Window.superclass.initComponent.call(this);
	},

	//页面渲染方法
	onRender : function(ct, position){
		Artery.plugin.Window.superclass.onRender.call(this,ct, position);
	},
	
	getWin: function(){
		if(!this.win){
			var cls = "";
			if(!Ext.isEmpty(this.className)){
				cls += " " + this.className + " ";
			}
			if(!Ext.isEmpty(this.themeStyle)){
				cls += " x-theme-window-" + this.themeStyle + " ";
			}
			var cfg = {
				id:this.id + "window",
				width:Ext.isEmpty(this.width)?300:parseInt(this.width),
				height:Ext.isEmpty(this.height)?300:parseInt(this.height),
				title:this.title,
				closeAction :'hide',
				resizable:this.resizable,
				draggable:this.draggable,
				contentEl :this.id + '-atbwrap',
				cls:cls
			};
			this.win = new Ext.Window(cfg)
			this.win.on('render',function(win){
				//header
				var header = Ext.get(this.id + '-atheader');
				if(header){
					var custHeader = false;
					var cn = header.dom.children;
					for(var i=0;i<cn.length;i++){
						if(!Ext.fly(cn[i]).hasClass('x-panel-header-text')){
							win.header.appendChild(cn[i]);
							custHeader = true;
						}
					}
					if(custHeader){
						win.header.addClass('x-window-header-container');
						win.el.child('.x-window-mc').setStyle('border-top','0px')
					}
				}
				
				//footer
				var footer = Ext.get(this.id + '-atfooter');
				if(footer){
					win.el.child('.x-window-bc').appendChild(Ext.get(this.id + '-atfooter'));
				}
				
				//body
				Ext.get(this.id + '-atbody').setStyle('border','0px');
				Ext.get(this.id + '-atbody').addClass('x-window-atbody');
			},this)
			if(this.onCloseEvent){
				this.win.on('hide',function(win){
					Artery.regItemEvent(this,'onCloseEvent','onCloseServer');
				},this);
			}
		}
		return this.win;
	},
	
	showWindow:function(){
		this.getWin().show();
		//Ext.get(this.id).setDisplayed(true);
		this.getWin().center();
	},
	
	show: function(){
		if(!this.getWin().rendered){
			this.showWindow();
		}else{
			this.getWin().show();
		}
	},
	
	hideWindow: function(){
		this.getWin().hide();
	},
	
	hide: function(){
		this.hideWindow();
	},
	showAt:function(xy){
		this.getWin().show();
		//Ext.get(this.id).setDisplayed(true);
		this.getWin().setPagePosition(xy[0],xy[1]);
	},
	alignTo: function(otherEl,position,relative){
		this.getWin().show();
		//Ext.get(this.id).setDisplayed(true);
		this.getWin().el.alignTo(otherEl,position,relative);
	}
})

//注册组件
Ext.reg('apwindow', Artery.plugin.Window);