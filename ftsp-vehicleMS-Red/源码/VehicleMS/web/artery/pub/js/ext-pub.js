﻿/**
 * Add encrypt String method to Ext object
 * 
 * @author baon
 * @date 21/05/2008
 */
Ext.encrypt = function(val) {
	var i;
	var monyer = new Array();
	for (i = 0; i < val.length; i++) {
		monyer.push(val.charCodeAt(i));
	}
	return monyer.join("");
}

Ext.isTrue = function(val) {
	if (val == true || val == "true") {
		return true;
	}

	return false;
}

Ext.isNum = function(val) {
	if (Ext.isEmpty(val)) {
		return false;
	}
	if (/^[0-9.]+$/.test(val)) {
		return true;
	}
	return false;
}

Ext.getNumber = function(num, defaultValue) {
	var n = parseInt(num);
	if (Ext.isNum(n)) {
		return n
	} else {
		return defaultValue;
	}
}

Ext.isEncode = function(val){
	var reg = /^[\w`~!@#$%^&*()-=_+{}|;':",./<>? ]*$/;
	if(reg.test(val)){
		return false
	}else{
		return true;
	}
}

Ext.apply(String, {
	escapeQuote : function(string) {
		if (string == null) {
			return "";
		}
		return string.replace(/(')/g, "\\$1");
	}
})

Ext.HtmlEncode = function(val){
	if(typeof val != 'string'){
		val = val + "";
	}
	val = val.replace(/&/g,"&amp;");
	val = val.replace(/</g,"&lt;");
	val = val.replace(/>/g,"&gt;");
	return val;
}

// 验证上传Zip文件
Ext.validUpZipFile = function(val) {
	var reg = /.+\.zip$/i;
	if (!reg.test(val)) {
		return "请选择Zip文件！";
	}
	return true;
}

ajaxCallback = function(responseObject,o){
	var text = responseObject.responseText;
	if(!Ext.isEmpty(text)&& text.indexOf('name="j_username"') != -1 && text.indexOf('name="j_password"') != -1){
    	alert(Artery.ajaxLoginTip)			
		top.window.location.href=sys.getContextPath() + Artery.config.ajaxLoginPage;
    	if(o){
    		releaseObject(o);
    	}
		responseObject = null;
		return true;
    }
    return false;
}

if(Ext.data.Store){
	Ext.data.Store.prototype.applySort = function() {
		if (this.sortInfo && !this.remoteSort) {
			var s = this.sortInfo, f = s.field;
			var st = this.fields.get(f).sortType;
			var fn = function(r1, r2) {
				var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
				if (typeof(v1) == "string") {
					return v1.localeCompare(v2);
				}
				return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
			};
			this.data.sort(s.direction, fn);
			if (this.snapshot && this.snapshot != this.data) {
				this.snapshot.sort(s.direction, fn);
			}
		}
	};
}
(function(){
	Ext.reqInterceptors=[];
	Ext.regReqInterceptor = function(interceptor){
		Ext.reqInterceptors.push(interceptor);
	}
})()

//Ext.regReqInterceptor(function(text){
//	alert(text);
//});


/**
 * 1 增加同步调用参数
 * 2 去掉超时判断
 * 
 * @author baon
 * @date 13/05/2008
 * 
 */
Ext.lib.Ajax = function() {
    var activeX = ['MSXML2.XMLHTTP.3.0',
			           'MSXML2.XMLHTTP',
			           'Microsoft.XMLHTTP'],
    CONTENTTYPE = 'Content-Type';
    
	function setHeader(o) {
	    var conn = o.conn,
	        prop;
	        
	    function setTheHeaders(conn, headers){
		    for (prop in headers) {
                if (headers.hasOwnProperty(prop)) {
                    conn.setRequestHeader(prop, headers[prop]);
                }
            }   
	    }
	        
        if (pub.defaultHeaders) {
	        setTheHeaders(conn, pub.defaultHeaders);
        }

        if (pub.headers) {
			setTheHeaders(conn, pub.headers);
            pub.headers = null;                
        }
    }    

    function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {
        return {
            tId : tId,
            status : isAbort ? -1 : 0,
            statusText : isAbort ? 'transaction aborted' : 'communication failure',
            isAbort: true,
            isTimeout: true,
            argument : callbackArg
        };
    }

    function initHeader(label, value) {
		(pub.headers = pub.headers || {})[label] = value;			            
    }

    function createResponseObject(o, callbackArg) {
        var headerObj = {},
            headerStr,              
            conn = o.conn,
            t,
            s;

        try {
            headerStr = o.conn.getAllResponseHeaders();   
            Ext.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function(v){
                t = v.indexOf(':');
                if(t >= 0){
                    s = v.substr(0, t).toLowerCase();
                    if(v.charAt(t + 1) == ' '){
                        ++t;
                    }
                    headerObj[s] = v.substr(t + 1);
                }
            });
        } catch(e) {}
                    
        return {
            tId : o.tId,
            status : conn.status,
            statusText : conn.statusText,
            getResponseHeader : function(header){return headerObj[header.toLowerCase()];},
            getAllResponseHeaders : function(){return headerStr},
            responseText : conn.responseText,
            responseXML : conn.responseXML,
            argument : callbackArg
        };
    }

    function releaseObject(o) {
        o.conn = null;
        o = null;
    }

    function handleTransactionResponse(o, callback, isAbort, isTimeout) {
        if (!callback) {
            releaseObject(o);
            return;
        }

        var httpStatus, responseObject;

        try {
            if (o.conn.status !== undefined && o.conn.status != 0) {
                httpStatus = o.conn.status;
            }
            else {
                httpStatus = 13030;
            }
        }
        catch(e) {
            httpStatus = 13030;
        }

        if ((httpStatus >= 200 && httpStatus < 300) || (Ext.isIE && httpStatus == 1223)) {
            responseObject = createResponseObject(o, callback.argument);
            var text = responseObject.responseText;
            var length = Ext.reqInterceptors.length;
			for(var i=0;i<length;i++){
				if(Ext.reqInterceptors[i].call(this,text) === false){
					return;
				}
			}
			if(ajaxCallback(responseObject,o)){
				return ;
			}
            if (callback.success) {
                if (!callback.scope) {
                    callback.success(responseObject);
                }
                else {
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }
        }
        else {
            switch (httpStatus) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false), isTimeout);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                    break;
                default:
                    responseObject = createResponseObject(o, callback.argument);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
            }
        }

        releaseObject(o);
        responseObject = null;
    }  

    function handleReadyState(o, callback) {
		o.conn.onreadystatechange = function() {
			if (o.conn && o.conn.readyState == 4) {
				handleTransactionResponse(o, callback);
			}
		}
	}
	
	// 用于判断字符串是否是artery的命令
	var cmdReg = new RegExp("^arterycmd:.*$");
    
	// 创建callback对象代理
	function createCallbackProxy(callback){
		var proxy = {};
		Ext.apply(proxy, callback);
		proxy.success = function(responseObject){
			// 执行代理方法
			var resText = responseObject.responseText;
			if(cmdReg.test(resText)){
				var addr = resText.substr(10);
				window.open(addr, "_top");
				return;
			}
			// 执行原success函数
			if (callback.success) {
                if (!callback.scope) {
                    callback.success(responseObject);
                }
                else {
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }
		}
		return proxy;
	}
	
    function asyncRequest(method, uri, callback, postData, syn) {
    	if (syn == null) {
			syn = true;
		}
        var o = getConnectionObject() || null;

        if (o) {
            o.conn.open(method, uri, syn);

            if (pub.useDefaultXhrHeader) {                    
            	initHeader('X-Requested-With', pub.defaultXhrHeader);
            }

            if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers[CONTENTTYPE])){
                initHeader(CONTENTTYPE, pub.defaultPostHeader);
            }

            if (pub.defaultHeaders || pub.headers) {
                setHeader(o);
            }

            var proxy = createCallbackProxy(callback);
            handleReadyState(o, proxy);
            o.conn.send(postData || null);
        }
        return o;
    }

    function getConnectionObject() {
        var o;      	

        try {
            if (o = createXhrObject(pub.transactionId)) {
                pub.transactionId++;
            }
        } catch(e) {
        } finally {
            return o;
        }
    }

    function createXhrObject(transactionId) {
        var http;
        	
        try {
            http = new XMLHttpRequest();                
        } catch(e) {
            for (var i = 0; i < activeX.length; ++i) {	            
                try {
                    http = new ActiveXObject(activeX[i]);                        
                    break;
                } catch(e) {}
            }
        } finally {
            return {conn : http, tId : transactionId};
        }
    }
	         
    var pub = {
        request : function(method, uri, cb, data, options) {
        	var syn = true;
		    if(options){
		        var me = this,		        
		        	xmlData = options.xmlData,
		        	jsonData = options.jsonData,
                    hs;
		        	
		        Ext.applyIf(me, options);	        
	            
	            if(xmlData || jsonData){
                    hs = me.headers;
                    if(!hs || !hs[CONTENTTYPE]){
		                initHeader(CONTENTTYPE, xmlData ? 'text/xml' : 'application/json');
                    }
		            data = xmlData || (Ext.isObject(jsonData) ? Ext.encode(jsonData) : jsonData);
		        }
		        if (options.syn != null) {
					syn = options.syn;
				}
		    }	    		    
		    return asyncRequest(method || options.method || "POST", uri, cb, data, syn);
        },

        serializeForm : function(form) {
	        var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
            	hasSubmit = false,
            	encoder = encodeURIComponent,
	        	element,
            	options, 
            	name, 
            	val,             	
            	data = '',
            	type;
            	
	        Ext.each(fElements, function(element) {		            
                name = element.name;	             
				type = element.type;
				
                if (!element.disabled && name){
	                if(/select-(one|multiple)/i.test(type)){			                
			            Ext.each(element.options, function(opt) {
				            if (opt.selected) {
					            data += String.format("{0}={1}&", 						            					  
					            					 encoder(name),						            					 
					            					  (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified) ? opt.value : opt.text);
                            }								
                        });
	                } else if(!/file|undefined|reset|button/i.test(type)) {
		                if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                
                            data += encoder(name) + '=' + encoder(element.value) + '&';                     
                            hasSubmit = /submit/i.test(type);    
                        } 		                
	                } 
                }
            });            
            return data.substr(0, data.length - 1);
        },
        
        useDefaultHeader : true,
        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader : true,
        defaultXhrHeader : 'XMLHttpRequest',        
        poll : {},
        timeout : {},
        pollInterval : 50,
        transactionId : 0,

        abort : function(o, callback, isTimeout) {
	        var me = this,
	        	tId = o.tId,
	        	isAbort = false;
	        
            if (me.isCallInProgress(o)) {
                o.conn.abort();
                clearInterval(me.poll[tId]);
               	me.poll[tId] = null;
                if (isTimeout) {
                    me.timeout[tId] = null;
                }
				
                handleTransactionResponse(o, callback, (isAbort = true), isTimeout);                
            }
            return isAbort;
        },

        isCallInProgress : function(o) {
            // if there is a connection and readyState is not 0 or 4
            return o.conn && !{0:true,4:true}[o.conn.readyState];	        
        }
    };
    return pub;
}();
