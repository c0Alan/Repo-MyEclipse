/**
 * Artery chartArea component
 * 
 * @author weijx
 * @date 2009-7-2
 * 
 */

    	
Artery.plugin.ChartArea = Ext.extend(Ext.BoxComponent, {
	
	// 初始化数据，once加载方式会生成
	initData: null,
	

	/**
	 * 语言
	 */
	language : "CH",
	
	/**
	 * 图表id
	 */
	chartId: undefined,
	
	/**
	 * 图表类型
	 */
	chartType: undefined,
	
	// 调试模式
	debugMode: 0,
	
	// 干什么的？
	registerWithJS: 1,
	
	// 背景颜色
	backgroundColor: '#ffffff',
	
	// 缩放模式
	scaleMode: "noScale",
	
	// true，则透明
	transparent: true,
	
	// 加载方式，可以为 once、ajax
	loadType: "once",
	
	
	/**
	 * 获得图表id，如果不存在，则生成一个
	 */
	getChartId : function(){
        return this.chartId || (this.chartId = "extswf" + (++Ext.Component.AUTO_ID));
    },
    
    /**
     * 获得图表类型，默认为Column3D
     */
    getChartType: function(){
    	return this.chartType || "Column3D";
    },
    
    getChartSrc: function(){
    	var src = sys.getContextPath()+"/artery/arteryPlugin/image/chartArea/Charts/";
    	src += this.getChartType() + ".swf";
    	var cfgJson = Ext.util.JSON.decode(this.chartCfg);
    	if(cfgJson) {
    		src += "?";
    	}
		for (var obj in cfgJson) {
			src += obj + "=" + cfgJson[obj] + "&";
		}
		if(src.indexOf("&") > -1) {
			src = src.substring(0, src.length - 1);
		}
    	return encodeURI(src);
    },
    
    getConfWidth: function(){
    	return this.width || "400px";
    },
    
    getConfHeight: function(){
    	return this.height || "300px";
    },
    
    onRender : function(ct, position){
        this.el = Ext.get(this.id);
        //位置已经输出，不应该在移动
        //ct.appendChild(this.el);
        var fsrc = this.getChartSrc();
        var cid = this.getChartId();  
  		var AChart = new FusionCharts(
  				fsrc,
  				cid,
  				this.getConfWidth(),
  				this.getConfHeight(),
  				this.debugMode,
  				this.registerWithJS);
  		AChart.params.bgColor = this.backgroundColor;
  		AChart.params.debugMode = this.debugMode;
  		AChart.params.lang = this.language;
  		
  		AChart.setTransparent(this.transparent);
  		if((this.loadType==="once") || (this.loadType==="")){
	  		this.onDataReady(AChart, this.initData);
  		}else if(this.loadType==="ajax"){
	  		var me = this;
		  	me.reload({},function(response){
		  		me.onDataReady(AChart, response.responseText);
		  	});
  		}
    },
    
    afterRender : function() {
    	// 解决Chart可能缩成一团的问题
    	var ch = Ext.fly(this.getChartId());
    	if (!ch) {
    		return ;
    	}
    	ch.setWidth(this.el.getComputedWidth());
    	ch.setHeight(this.el.getComputedHeight());
    	ch.setWidth(this.getConfWidth());
    	ch.setHeight(this.getConfHeight());
    },
    
    // 数据准备好后，执行此方法
    onDataReady: function(ch, data){
    	if(data.length == 0 && this.noDataImg) {
        	this.el.dom.innerHTML =
        		"<img src='" + sys.getContextPath() + this.noDataImg + "' " +
        		"width="+this.getConfWidth()+" height="+this.getConfHeight()+"></img>";
        	return;
        }
    	ch.setDataXML(data);
	  	ch.render(this.el.dom);
	  	this.chart = ch;
	  	this.initAutoUpdate();
    },
    
    /**
     * 初始化自动更新
     */
    initAutoUpdate: function(){
    	if(this.updateTime && this.updateTime>0 && this.autoUpdater==null){
    		var me = this;
    		this.autoUpdater = setInterval(function(){
    			me.reload();
    		},this.updateTime*1000);
    	}
    },
    

    /**
     * 重载chart显示的xml数据
     * @param params 需要传输的参数,json对象
     */
    reload: function(params, cb){
    	var url = sys.getContextPath() + "/artery/form/dealParse.do?action=runItemLogic&method=loadData";
  		var params = Artery.getParams(params || {}, this);
  		var me = this;
		Artery.request({
   			url: url,
   			success: function(response){
   				if(cb){
   					cb(response);
   				}else{
   					var ch = me.chart;
   					ch.setDataXML(response.responseText);
   				}
   			},
   			failure: function(){
   			},
   			params: params
		});
    },

    exportChart : function(){
    	var chart = document.getElementById(this.chartId);
    	if (chart.hasRendered()){
    		chart.exportChart(); 
    	 }
    	else{
    		alert("flash尚未生成完毕，请稍后导出");
    	}

    },
    
    /**
     * 停止自动更新
     */
    stopAutoUpdate: function(){
    	if(this.autoUpdater){
    		clearInterval(this.autoUpdater);
    		this.autoUpdater = null;
    	}
    },
    
    setSize : function(w, h){
    }
});

Ext.reg('apChartArea', Artery.plugin.ChartArea);