/**
 * 异步请求服务器类
 * 
 * @author wangxl, xiegq, yangkai
 * @version 2.0
 * 20111019： [+] 当页面关闭的时候将没有完成的ajax请求取消
 * 20131105:  [+] 修改xmlhttp.js，在请求头文件中加入X-Requested-With/XMLHttpRequest参数,用于标识请求时否是Ajax请求。
 */
 
/**
 * 获取XMLHttpRequest对象实例
 */

function getXMLHttpInstance() {
  if (typeof(XMLHttpRequest) != "undefined") return new XMLHttpRequest();

  var axO = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Msxml.XMLHTTP", "Microsoft.XMLHTTP"], i;
  for (i = 0; i < axO.length; i++) {
    try {
      return new ActiveXObject(axO[i]);
    } catch(e) {
    }
  }
  throwError("创建 XMLHttpRequest 失败！\n\n·如果您使用的是IE浏览器，请检查IE安全选项里是否禁用了插件。\n·如果您使用的是其它浏览器（如Mozilla、Firefox），请确定该\n　浏览器是否支持XMLHttpRequest功能。");
}

/**
 * 创建一个新的xmlhttp对象
 */
function xmlhttp() {
  return getXMLHttpInstance();
}


/**
 * 向服务器请求下载某一对象，阻塞式的请求
 * 2008-05-28 Modified By Jiangzhq
 * @return string
 *             返回服务器返回的字符串信息
 */
function queryObj(params, onFinish, excepArea, userData, actionUrl){
  var q = new QueryObj(params, onFinish, excepArea, userData, actionUrl);
  q.send();
  q.checkResult();
  var result = q.getDetail();
  delete q;
  return result;
}

QueryObj.RESULT_STAT_OK = "ok";
QueryObj.RESULT_STAT_EXCEPTION = "exception";

QueryObj.RESULT_TYPE_STRING = "str";
QueryObj.RESULT_TYPE_XML = "xml";
QueryObj.RESULT_TYPE_XML_NODE = "xmlnode";

QueryObj.EXCEPTION_TYPE_APP = "app";
QueryObj.EXCEPTION_TYPE_SYS = "sys";

QueryObj.DEFAULT_URL = "/ajaxServlet";
// 将所有请求的连接保存下来
QueryObj.conns = [];
// 用于释放缓存链接的函数
QueryObj.clearFn = function(){
    if (QueryObj.conns) {
    	try {
            for (var i = 0; i < QueryObj.conns.length; i++) {
                var conn = QueryObj.conns[i];
                if (conn && {0:true,4:true}[conn.xmlhttp.readyState]){
                    QueryObj.conns[i] = null;
                }
            } 
    	}catch(e){}
    }
};
// 定时器，每10秒运行一次
QueryObj.clearTimer = setInterval("QueryObj.clearFn()",10000);
/**
 * 调用xmlHttp请求服务器的类对象
 * 构造方法，实例化之后直接发出请求。
 *
 * @param params string | Map
 *                     请求的参数
 *                     可以为一个串如：user=dfdf&pw=sdfsdf&dg=234234的形式
 *                     也可以是一个util.js中定义的Map或StringMap
 * @param onfinish function | string
 *                     如果参数onfinish存在，则请求方式是异步的，在请求完毕后会调用onfinish
 *                     在onfinish函数中使用者应先调用QueryObj.checkResult方法
 * @param userdata (任何类型)
 *                     传给回调函数使用的参数，该参数在QueryObj内部不起任何作用，会原样传回到onfinish中                    
 * @param actionurl string
 *                     要请求的url
 * 
 */
function QueryObj(params, onFinish, excepArea, userData, actionUrl){
  this.xmlhttp = xmlhttp();
  this._onFinish = onFinish;
  this._async = onFinish!=null;
  this._userData = userData;
  this._result;                   //服务器返回的结果状态
  this._detail;                   //服务器响应正常时返回的结果，String | XML节点对象
  this._exepType;                 //服务器返回的异常类型
  this._exception = new Array();                //服务器返回的异常信息
  this._excepStack;                //服务器返回的异常堆栈
  
  if (excepArea) {
      this.setExcepArea(excepArea);
  }
  
  this._url = this._formatUrl(actionUrl ? actionUrl : QueryObj.DEFAULT_URL);
  this._params = params;
//  this._resultType = resultType ? resultType : QueryObj.RESULT_TYPE_STRING;
}

QueryObj.prototype.send = function() {
    var self = this;
    this.xmlhttp.open((this._params)?"POST":"GET", this._url, this._async);
    if (this._async) {
        this.xmlhttp.onreadystatechange = function() {
            if(self.xmlhttp.readyState == 4) {
                self.checkResult();
                if(typeof(self._onFinish) == "function") {
                    self._onFinish(self, self._userData);
                } else {
                    eval(self._onFinish);
                }
            }
        }
    }
  this.xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
  if (this._params){
      this.xmlhttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded;charset=utf-8");
      this.xmlhttp.send(this._makeParams());
    }else{
        this.xmlhttp.send(null);
    }
    
    if (!this._async){
        this.checkResult();
    }    
    // 只有异步请求才需要缓存，同步请求不需要
    if (this._async){
        QueryObj.conns.push(this);
    }    
}

/**
 * 取消当前的请求
 */
QueryObj.prototype.abort=function(){
  this.xmlhttp.abort();
}

/**
 * 给请求的URL前加上环境参数
 * @return string
 */
QueryObj.prototype._formatUrl=function(url){
  return sys.getContextPath()+url;
}

/**
 * 判断此次http请求在http状态上是否有异常
 */
QueryObj.prototype.checkHttpResult=function(){
    var xmlhttp = this.xmlhttp;
    if (xmlhttp.status !=0 && xmlhttp.status != 200){
            throwError("当请求url:"+this.url+" 时服务器返回错误状态:"+xmlhttp.status+" "+xmlhttp.statusText, xmlhttp.responseText);
    }
}

/**
 * 检查服务器返回的结果
 * 如果结果不是ok的话，则触发异常
 */
QueryObj.prototype.checkResult=function(){
  if (!this.resultparsed){
    this._parseResult();
  }
  if(!this.isResultOK()){
      // 将异常显示到指定对象上
      if (this._excepArea) {
          var excepMessage = "";
          for (var i = 0; i < this._exepItems.length; i++) {
              excepMessage += this._exception[i] + "<br>";
          }
          this._excepArea.innerHTML = excepMessage;
      }
  }
}

/**
 * 分析服务器返回的结果
 */
QueryObj.prototype._parseResult=function(){
  this.resultparsed = true;
  this.checkHttpResult();
  
  var res = this.xmlhttp.responseText;
  if(this._url.indexOf(QueryObj.DEFAULT_URL) < 0){
    // 如果url不是默认的，则认为用户自己处理返回结果，此处不做进一步处理
    this._detail = res;
    return;
  }
  
  if("gologin"==res){
    // 上一次sessin失效，需要进入登录页面，使用刷新本窗口的方式实现
    this._result = QueryObj.RESULT_STAT_OK;
    this._onFinish = "top.location.reload()";
    return;
  }
  
  this.responseXML = this.xmlhttp.responseXML;
  if(this.responseXML != null){
      var result = this.responseXML.getElementsByTagName("result")[0];
      
    //返回结果如果是用户自定义的形式，则判断其是否产生异常，并解析异常信息
    if (!result) {//this._resultType == QueryObj.RESULT_TYPE_XML) {
        this._result = QueryObj.RESULT_STAT_OK;
        this._resultType = QueryObj.RESULT_TYPE_XML;
        
        this._detail = this.xmlhttp.responseXML;
        return;
    }
      
      this._result = result.getAttribute("type");
      if (this._result == QueryObj.RESULT_STAT_OK) {
          //解析响应正常时返回的结果
          var detail = result.getElementsByTagName("detail")[0];
          this._resultType = detail.getAttribute("type");
          if (this._resultType == QueryObj.RESULT_TYPE_XML_NODE) {
              this._detail = detail;
          }
          else {
              this._detail = detail.firstChild.nodeValue;
          }
      }
      else if (this._result == QueryObj.RESULT_STAT_EXCEPTION) {
          //解析发生异常返回的信息
          var exception = result.getElementsByTagName("exception")[0];
          this._exepType = exception.getAttribute("type");
          //this._exception = exception.getElementsByTagName("message")[0].text;
          this._exepItems = exception.getElementsByTagName("item");
          for (var i = 0; i < this._exepItems.length; i++) {
              this._exception[i] = this._exepItems[i].text;
          }
          if (this._exepType == QueryObj.EXCEPTION_TYPE_SYS) {
              this._excepStack = exception.getElementsByTagName("stack")[0].text;    
          }
      }
  }
}

QueryObj.prototype.setOnfinish = function(onFinish) {
  this._onFinish = onFinish;
  this._async = onFinish!=null;
}

/**
 * 设置显示异常信息的区域
 */
QueryObj.prototype.setExcepArea = function(excepArea) {
  if (excepArea) {
      if (isString(excepArea)) {
          this._excepArea = document.getElementById(excepArea);
      }
      else {
          this._excepArea = excepArea;
      }
  }
}

/**
 * 取得用户数据
 */
QueryObj.prototype.getUserData = function() {
    return this._userData;
}


/**
 * 设置用户数据
 */
QueryObj.prototype.setUserData = function(userData) {
    this._userData = userData;
}

QueryObj.prototype.setActionUrl = function(actionUrl) {
    this._url = actionUrl;
}

/**
 * 服务器返回的结果状态是否是ok
 * @return boolean
 */
QueryObj.prototype.isResultOK=function(){
  return this._result==QueryObj.RESULT_STAT_OK;
}

/**
 * 服务器返回的结果状态是否是有异常
 * @return boolean
 */
QueryObj.prototype.isResultException=function(){
  return this._result==QueryObj.RESULT_STAT_EXCEPTION;
}

/**
 * 取得服务器返回的结果类型
 * @return string
 */
QueryObj.prototype.getResultType = function() {
    return this._result;
}
/**
 * 取得服务器返回的异常类型
 * @return string
 */
QueryObj.prototype.getExceptionType = function() {
    return this._exepType;
}

/**
 * 取得服务器返回的异常说明
 * @return String
 *            异常说明字符串
 */
QueryObj.prototype.getException = function() {
    var excepMessage = "";
  for (var i = 0; i < this._exepItems.length; i++) {
        excepMessage += this._exception[i] + "\n";
    }
    return excepMessage;
}

/**
 * 取得服务器返回的异常说明数组
 * @return Array
 *            异常数组
 */
QueryObj.prototype.getExceptionArray = function() {
    return this._exception;
}

/**
 * 取得服务器返回的异常堆栈
 * @return string
 */
QueryObj.prototype.getExceptionStack = function() {
    return this._excepStack;
}

/**
 * 服务器返回的详细信息，返回一个字符串
 * @return string | XML Node Object
 */
QueryObj.prototype.getDetail=function(){
  return this._detail;
}

/**
 * 返回服务器端返回的xml文档对象
 * 调用此方法时不要调用checkResult，可先调用checkHttpResult判断http通讯是否有异常
 */
QueryObj.prototype.getResponseXML=function(){
  return this.xmlhttp.responseXML;
}

/**
 * 返回服务端返回的文本对象
 */
QueryObj.prototype.getResponseText = function() {
    return this.xmlhttp.responseText;
}

/**
 * 将所要请求的参数整理成标准形式
 */
QueryObj.prototype._makeParams=function(){
    var params = this._params;
    if (!params){
        return null;
    }
  if (isString(params)){
      return encodeURI(params);
    }else if (params.export2uri){
        return params.export2uri();
    }else{
        throwError('queryObj方法的params只能为null，string，HashMap或StringMap');
    }
}
// 在界面关闭的时候，取消哪些还没有完成的ajax请求
// 先把已注册的函数保存下来
// 因为这个文件有可能在一个jsp页面被引入多次,造成死循环,所以先对注册事件做判断
if((typeof _onunload) == 'undefined'){
    var fn = window.onunload;
    window.onunload = function (){
        // 清除定时器
        if (QueryObj.clearTimer) {
            clearInterval(QueryObj.clearTimer);
            QueryObj.clearTimer = null;
        }   
        // 检查所有的ajax连接
        if (QueryObj.conns) {
            for (var i = 0; i < QueryObj.conns.length; i++) {
                var conn = QueryObj.conns[i];
                if (conn){
                    conn._onFinish = function(){};
                    conn.abort();
                }
            }        
        }
        if (fn) {
            fn();
        }
    };
    _onunload = true;
}
