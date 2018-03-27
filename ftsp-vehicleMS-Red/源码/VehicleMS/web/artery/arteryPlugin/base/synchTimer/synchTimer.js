/**
 * 同步定时器
 * 
 * @author weijx
 * @date 2009-06-29
 * 
 */

Artery.plugin.Timer = Ext.extend(Ext.Component,{
	
	onRender : function(ct, position){
    },
	
	/**
	 * 开启定时器
	 */
	start: function(){
		if(this.isStart && this.timeRel){
			return;	//定时器已经启动，直接返回
		}
		var me = this;
		this.timeRel = setInterval(function(){
			me.doWork();
		},this.interval*1000);
		if(this.runOnStart){
			this.doWork();
		}
		this.isStart = true;
	},
	
	/**
	 * 关闭定时器
	 */
	stop: function(){
		if(this.timeRel){
			clearInterval(this.timeRel);
			delete this.timeRel;
		}
		if(this.runOnStop){
			this.doWork();
		}
		this.isStart = false;
	},
	
	/**
	 * 执行定时通讯
	 */
	doWork: function(){
		//触发onRunEvent事件
		Artery.regItemEvent(this,'onRunEvent','onRunServer');
		Artery.request({
			url: sys.getContextPath()+"/artery/form/dealParse.do?action=synch",
			success: function(){
				
			},
			failure: function(){
				Artery.showError("同步服务器失败");
			}
		});
	}
	
})

Ext.reg('synchTimer', Artery.plugin.Timer);