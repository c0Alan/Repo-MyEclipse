/**
 * Artery 全局对象
 */
var Artery={};
/**
 * Artery.FORM = "1"; //表单
 */
Artery.FORM = '';
/**
 * Artery.REPORT = "2"; //报表
 */
Artery.REPORT = '';
/**
 * Artery.WRIT = "3"; //文书
 */
Artery.WRIT = '';

/**
 * 通过控件id得到控件对象，此方法相当于Ext.getCmp方法
 * @param id:String 控件的id
 * @return Object 返回控件对象
 */
Artery.get = function(id){};
/**
 * 当参数iframeId没有时，可得到父窗口的Artery对象，否则可得到指定iframeId的iframe的Artery对象
 * @param iframeId:String 可选的，iframe的id
 * @return Object 返回Artery对象
 */
Artery.getWin = function(iframeId){};
/**
 * 得到当前窗口的Window对象
 * @return Object 返回Window对象
 */
Artery.getWindow = function(){};
/**
 * 提示对象话框<br>
 * 示例：Artery.alertMsg('提示信息','测试内容');
 * @param titles:String 对话框的标题
 * @param text:String 对话框的内容
 * @param callback:Function 可选的，点击对话框的确定按钮后的回调函数
 */
Artery.alertMsg = function(titles, text, callback) {};
/**
 * 确认对象话框<br>
 * 示例：Artery.confirmMsg("删除","确定要删除吗？",function(btn){<br>		if(btn　==　"yes"){<br>　　　　//todo<br>　　}<br>})
 * @param titles:String 对话框的标题
 * @param text:String 对话框的内容
 * @param callback:Function 点击对话框的按钮后的回调函数
 */
Artery.confirmMsg = function(titles, text, callback) {};
/**
 * 提示对象话框<br>
 * 示例：Artery.promptMsg("输入","请输入名称：",function(btn){<br>		if(btn　==　"yes"){<br>　　　　//todo<br>　　}<br>},"测试")
 * @param titles:String 对话框的标题
 * @param text:String 对话框的提示内容
 * @param callback:Function 点击对话框的按钮后的回调函数
 * @param value:String 提示对话框的默认值
 */
Artery.promptMsg = function(titles, text, callback, value) {};
/**
 * 提示信息<br>
 * @param message:String 信息内容
 */
Artery.showMessage = function(message) {};
/**
 * 提示信息<br>
 * @param message:String 信息内容
 */
Artery.showInfo = function(message) {};
/**
 * 警告信息<br>
 * @param message:String 信息内容
 */
Artery.showWarning = function(message) {};
/**
 * 错误信息<br>注意，错误信息不会自动关闭
 * @param message:String 信息内容
 */
Artery.showError = function(message) {};
/**
 * 显示发送请求信息
 */
Artery.loading = function() {};
/**
 * 请求加载成功信息
 * @param message:String 信息内容
 */
Artery.loadTrue = function(message) {};
/**
 * 请求加载失败信息
 * @param message:String 信息内容
 */
Artery.loadFalse = function(message) {};
/**
 * 隐藏信息提示
 */
Artery.hideMessage = function() {};
/**
 * 打开表单方法，示例：<br>Artery.openForm({<br>  "formId" : "282CEC0CD8B",<br>  "formName" : "添加图书",<br>  "formType" : "1",<br>  "title" : "添加图书",<br>  "params" : {"bookId" : ""},<br>  "target" : "_window",<br>  "targetWidth" : 550,<br>  "targetHeight" : 450,<br>  "runTimeType" : "insert"<br>}); 
 * @param cfg:Json 配置信息
 */
Artery.openForm = function(cfg) {};
/**
 * 页面的公共参数对象，通过此对象可得到表单的id，运行时类型等信息
 */
Artery.params = {};
/**
 * 表单的id
 */
Artery.params.formid = {};
/**
 * 表单的运行时类型
 */
Artery.params.runTimeType = {};
/**
 * 解析指定的组件，返回组件的js和html，可在回调函数中处理
 * @param cfg:Object 包含参数列表和回调函数的json对象，如：{params:{itemid:'blank2344',bookId:'abc'},function(result){
 * Artery.get('blankPanel').addItem(result)}}
 */
Artery.parseItem = function(cfg){};


/**
 * Artery提示的Ajax远程调用对象
 */
var rc={};
/**
 * 增加参数
 * @param key:String 参数的键名称
 * @param value:String 参数的值
 */
rc.put = function(key,value){};
/**
 * 增加参数，示例：<br>rc.putJson({name:'zhang',id:'123'});
 * @param params:Json Json形式的参数
 */
rc.putJson = function(params){};
/**
 * 发送Ajax请求方法，执行回调函数，示例：<br>rc.send(function(result){<br>  //todo<br>});
 * @param callBack:Function 回调函数
 */
rc.send = function(callBack){};