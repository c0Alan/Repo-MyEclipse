/*
 * 脚本执行对象
 */
Artery.script.ScriptRunner = function() {
	this.map = {};
};

Artery.script.ScriptRunner.prototype = {
	// 参数列表
	map : null,

	// 执行结果
	result : null,

	// true -- 异步执行 false -- 同步执行
	sync : true,
	
	asyn : true,
	
	// "POST","GET"
	method: "POST",

	// 控件对象
	item : null,

	// 添加参数
	putParam : function(key, value) {
		this.map[key] = value;
		//eval('this.map.' + key + '=\'' + String.escape(value) + '\'');
	},
	// 添加参数
	put: function(key,value){
		this.putParam(key,value);
	},
	
	getParams: function(key){
		return this.map[key];
	},
	
	// 添加json串参数
	putJson: function(params){
		if(!Ext.isObject(params)){
			return;
		}
		Ext.apply(this.map,params);
	},

	get : function(callback) {
		this.method = "GET";
		this.send(callback);
	},

	post : function(callback) {
		this.method = "POST";
		this.send(callback);
	},

	// 发送请求，执行脚本
	send : function(callback) {
		if(this.sync == false){
			this.asyn = false;
		}
		this.map = Artery.getParams(this.map, this.item);
		Artery.request({
			url : sys.getContextPath() + "/artery/script.do?action=run",
			success : function(response, options) {
				var text = response.responseText;
				if(text == null || text == "null"){
					this.result = null;
				} else if(text.indexOf("0") == 0) {
					// 0开始的字符串不自动转换成数值，否则将自动去掉数字前面的0
					this.result = text;
				}else {
					try{
						this.result = Ext.decode(text);
					}catch(e){
						this.result = text;
					}
				}
				if(callback && Ext.isFunction(callback)){
					callback(this.result);
				}
			},
			scope : this,
			syn : this.asyn,
			method : this.method,
			params : this.map
		})
	},

	// 获得执行结果
	getResult : function() {
		return this.result;
	}
};