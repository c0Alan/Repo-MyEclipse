/**
文件名:
sanlib/js/util.js

用途:
此js中定义了一些通用的函数和类

用法：
TODO:
*/
/*此js中定义了一些通用的函数和类*/

/*检查浏览器类型*/
var userAgent = window.navigator.userAgent;
/*是ie*/
var isMSIE = /(MSIE)/g.test(userAgent);
var isie = isMSIE;
/*是firefox*/
var isFirefox = /(Firefox)/g.test(userAgent);
var isff = isFirefox;

var System = {
    /*IE浏览器的内存释放*/
    gc : function(){
        if (window.navigator.userAgent.indexOf("MSIE") != -1) {
            CollectGarbage();
            setTimeout("CollectGarbage();", 1);
        }
    }
};

var _biInPrototype = false;
/*设置子类fConstr从父类fSuperConstr继承，sname是子类的名字，可以不传递，
  */
function _extendClass(fConstr, fSuperConstr, sName){
    _biInPrototype = true;
    var p = fConstr.prototype = new fSuperConstr;
    if (sName) {
        p._className = sName;
    }
    p.constructor = fConstr;
    _biInPrototype = false;
    return p;
}

/*定义一个事件类，比如一个回调函数如果是某个类的成员函数，则在其他类调用回调函数时，函数中的this不是函数所属的类的示例
  通过这个类包装可以做到,
  此类构造时接收一个或两个参数，如果是一个参数那么可以是一个全局函数，也可以是一个字符串
  如果是两个则第一个是类的实例，第二个是类的成员函数*/
function CallBackFunc(clsinstance, method){
    if (typeof(clsinstance) == "object" && typeof(method) == "function") {
        this.clsinstance = clsinstance;
        this.method = method;
    } else if (typeof(clsinstance) == "string") {
        this.exestr = clsinstance;
    } else if (typeof(clsinstance) == "function") {
        this.method = method;
    } else {
        throwError("传递给函数CallBackFunc的参数不正确");
    }
}

/*可能回掉有返回值的函数*/
CallBackFunc.prototype.invoke = function(){
    if (this.clsinstance) {
        return this.method.apply(this.clsinstance, arguments);
    } else if (this.method) {
        return this.method.apply(null, arguments);
    } else {
        return eval(this.exestr);
    }
}

/*该函数的参数个数必须大于1*/
function doCallBack(cb){
    if (!cb) {
        return;
    }

    var args = null;
    if (arguments.length > 1) {
        args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
    }
    try {
        if (typeof(cb.invoke) == "function") {
            if (args)
                cb.invoke.apply(cb, args);
            else
                cb.invoke.call(cb);
        } else if (typeof(cb) == "function") {
            if (args)
                cb.apply(null, args);
            else
                cb();
        } else {
            eval(cb);
        }
    } catch (e) { // 此段代码造成脚本错误无法抛出，所以重新try...catch将错误抛出
        throwError(e.description || e.message);
    }
}

/*执行一个回调函数，参数可以传递CallBackFunc的实例，也可以传递字符串或函数，
  其他参数都在调用cb时被传递给cb*/
CallBackFunc.doCallBack = doCallBack;

/*用于实现listener功能,*/
function CallBackFuncs(){
    this.listeners = new Array();
}

/*注册一个监听器*/
CallBackFuncs.prototype.add = function(cb){
    this.listeners.push(cb);
}

/*删除一个注册的监听器*/
CallBackFuncs.prototype.remove = function(cb){
    this.listeners.remove(cb);
}

/*回调所有添加的函数*/
CallBackFuncs.prototype.invoke = function(){
    if (this.listeners.length == 0) {
        return;
    }

    var args = new Array();
    args.push(null);
    for (var i = 0; (arguments) && (i < arguments.length); i++) {
        args.push(arguments[i]);
    }

    for (var i = 0; i < this.listeners.length; i++) {
        args[0] = this.listeners[i];
        doCallBack.apply(null, args);
    }
}

CallBackFuncs.prototype.size = function(){
    return this.listeners.length;
}

CallBackFuncs.prototype.dispose = function(){
    this.listeners = null;
}

/*获取当前mouse所在位置的元素*/
function getTarget(wnd, e){
    e = e ? e : wnd.event;
    return e.srcElement ? e.srcElement : e.target;
}

var HEXCHAR = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C',
    'D', 'E', 'F'];

function myValue(s){
    var i = -1;
    s = s.toUpperCase();
    for (var j = 0; j < HEXCHAR.length; j++) {
        if (HEXCHAR[j] == s) {
            i = j;
            break;
        }
    }
    return i;
}

function myDiv(s){
    var v = new String(s / 16);
    return v.charAt(0);
}

/**
 * 将带有星号和问号的字符串转换成转换正则表达式
 * "*"匹配0或多个任意字符，"?"匹配单个任意字符。而","号相当于或运算，
 * 例如：w*d.do?   可以匹配word.doc, world.dot等等。
 *      *.jsp;*.java   可以匹配以jsp或java为扩展名的文件。
 */
function convert2Regex(str){
    if (typeof(str) != "string" || str == null || str.length == 0) {
        return null;
    }

    var arr = new Array();
    var temp = str.split(";");
    for (var x = 0; x < temp.length; x++) {
        var w = temp[x];
        if (x > 0)
            arr.push("|");
        arr.push('^');
        for (var i = 0, is = w.length; i < is; i++) {
            var c = w.charAt(i);
            switch (c) {
                case '*' :
                    arr.push(".*");
                    break;
                case '?' :
                    arr.push(".");
                    break;
                case '(' :
                case ')' :
                case '[' :
                case ']' :
                case '$' :
                case '^' :
                case '.' :
                case '{' :
                case '}' :
                case '|' :
                case '\\' :
                    arr.push("\\");
                    arr.push(c);
                    break;
                default :
                    arr.push(c);
                    break;
            }
        }
        arr.push('$');
    }
    return arr.join("");
}

/*和java中StrFunc类中的函数str2Text具有一致的功能*/
function str2Text(s){
    var result = new String("");
    if (s == null || s.length == 0) {
        return s;
    }
    var i,
        k = 0;
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        var cd = s.charCodeAt(i);
        switch (c) {
            case '\t' :
                result = result + '\\';
                result = result + 't';
                break;
            case '\r' :
                result = result + '\\';
                result = result + 'r';
                break;
            case '\n' :
                result = result + '\\';
                result = result + 'n';
                break;
            case '\\' :
                result = result + '\\';
                result = result + '\\';
                break;
            default :

                if ((cd >= 1 && cd <= 8) || (cd >= 14 && cd <= 32)
                        || (cd == 11) || (c == 12)) {
                    result = result + '\\';
                    result = result + 'u';
                    result = result + myDiv(cd);
                    result = result + HEXCHAR[cd % 16];
                } else {
                    result = result + c;
                }
        }
    }
    return result;
}

/*和java中StrFunc类中的函数text2Str具有一致的功能*/
function text2Str(txt){
    if ((txt == null) || (txt.indexOf("\\") == -1)) {
        return txt;
    }
    var result = new String("");
    for (var i = 0; i < txt.length;) {
        if (i == txt.length) {
            break;
        }
        var c = txt.charAt(i);
        if (c == '\\') {
            if (i + 1 == txt.length)
                return result;// 单独出现的 '\\'不合法
            var c2 = txt.charAt(i + 1);
            switch (c2) {
                case '\\' :
                    result = result + '\\';
                    break;
                case 'r' :
                    result = result + '\r';
                    break;
                case 'n' :
                    result = result + '\n';
                    break;
                case 't' :
                    result = result + '\t';
                    break;
                case 'u' : // 不合法的数字也过滤,主要是长度
                    if (i + 3 < txt.length) {// 满足\\u1F的结构

                        var c3 = txt.charAt(i + 2);
                        var c4 = txt.charAt(i + 3);
                        var n3 = myValue(c3);
                        var n4 = myValue(c4);
                        if ((n4 != -1) && (n3 != -1)) {
                            result += String.fromCharCode(n3 * 16 + n4);
                        }
                        i += 2;
                    }
            }
            i += 2;
        } else {
            result = result + c;
            i += 1;
        }
    }
    return result;
}

/*和java中StrFunc类中的函数quotedStr具有一致的功能
  将s用quote括起来，如果s中含有quote字符则将s中的quote字符变长两个
  quote如果没有传递则使用"替代*/
function quotedStr(s, quote){
    if (s == null) {
        return null
    }

    if (quote == null) {
        quote = "\"";
    }

    var i = s.indexOf(quote);
    if (i == -1) {
        return quote + s + quote;
    }

    var i1 = 0;
    var value = quote;
    while (i != -1) {
        value = value + s.substring(i1, i) + quote + quote;
        i1 = i + 1;
        i = s.indexOf(quote, i1);
    }
    value = value + s.substring(i1) + quote;
    return value;
}

/*和java中StrFunc类中的函数extractQuotedStr具有类似的功能，
  如对于:"ab""c"
  a=1;b="1;2""3";c="567"
  1;2"3*/
function extractQuotedStr(s, quote, startIndex){
    this.s = s;
    this.quote = quote;
    this.startIndex = startIndex;
    this.value = "";
    this.endIndex = -1;

    /*返回提取的值*/
    this.getValue = function(){
        if ((this.s == null) || (this.s.length <= this.startIndex)
                || this.s.charAt(this.startIndex) != this.quote) {
            this.endIndex = -1;
            this.value = this.s;
            return this.value;
        }

        var i1 = this.startIndex + 1;
        var i = this.s.indexOf(this.quote, i1);
        while (i != -1) {
            if ((this.s.length > i + 1) && (this.s.charAt(i + 1) == this.quote)) {
                i++;
                this.value = this.value + this.s.substring(i1, i);
            } else {
                this.value = this.value + this.s.substring(i1, i);
                break;
            }
            i1 = i + 1;
            i = this.s.indexOf(this.quote, i1);
        }
        i = i == -1 ? this.startIndex + 1 : i;
        this.endIndex = (i1 == -1) ? -1 : i + 1;
        return this.value;
    }

    /*返回提取完值后的字符指针index*/
    this.getEndIndex = function(){
        return this.endIndex;
    }

    this.toString = function(){
        return this.getValue();
    }
    return this;
}

/*类型判断函数*/
function isAlien(a){
    return !isFunction(a) && /\{\s*\[native code\]\s*\}/.test(String(a));
}

/*是数组*/
function isArray(a){
    return (a instanceof Array || typeof(a) == "array");
}

function isArrayLike(a){
    if (isString(a)) {
        return false;
    }
    if (isArray(a)) {
        return true;
    }
    if (typeof(a) != "undefined" && a && isNumber(a.length)
            && isFinite(a.length)) {
        return true;
    }
    return false;
}

function isEmpty(o){
    var i, v;
    if (isObject(o)) {
        for (i in o) {
            v = o[i];
            if (isUndefined(v) && isFunction(v)) {
                return false;
            }
        }
    }
    return true;
}

function isNull(a){
    return typeof(a) == "object" && !a;
}

/*是方法*/
function isFunction(a){
    return (a instanceof Function || typeof(a) == "function");
}

/*是布尔*/
function isBoolean(a){
    return (a instanceof Boolean || typeof(a) == "boolean");
}

/*是数值*/
function isNumber(a){
    return (a instanceof Number || typeof(a) == "number");
}

/*是对象*/
function isObject(a){
    return (a instanceof Object || typeof(a) == "object");
}

/*是字符串*/
function isString(a){
    return (a instanceof String || typeof(a) == "string");
}

/*是未定义的*/
function isUndefined(a){
    return ((a == undefined) && (typeof(a) == "undefined"));
}

/*类似java中的hashmap的类，key必须为字符串，如果是数字，key中的 1和"1"被认为是相等的
  引用该类的时候，不能同时引用自定义创建的Object原形方法。这样会导致for(var key in object)
  这样遍历的时候将会把自定义的Object的原型方法加入。
*/
function Map(){
    if (_biInPrototype)
        return;
    this.elements = new Object();
    this.len = 0;
}

/*向map中加入一个key与value的对应，如果value = undefined 则value=null;
  key和value都允许为空，如果map中已经存在了key对应的value则替换原来的value
  并返回旧的value*/
Map.prototype.put = function(key, value){
    if (isUndefined(value))
        value = null;
    var v = this.elements[key];
    this.elements[key] = value;
    if (isUndefined(v)) { // 是undefined,说明map里面不存在key
        this.len++;
        return value;
    } else {
        return v;
    }
}

/*将map中的key与value复制到自己中*/
Map.prototype.putMap = function(map){
    var value = "";
    for (var key in map.elements) {
        this.put(key, map.elements[key]);
    }
}

/*删除一个元素，并且返回这个元素的值*/
Map.prototype.remove = function(_key){
    var value = this.elements[_key];
    if (isUndefined(value))
        return null;
    delete this.elements[_key];
    this.len--;
    return value;
}

/*返回map中的元素个数*/
Map.prototype.size = function(){
    return this.len;
}

/*获得一个key对应的值，并返回，如果key不存在，返回null*/
Map.prototype.get = function(_key){
    var i = 0;
    var value = null;
    if (isNumber(_key)) {
        for (var key in this.elements) {
            if (i++ == _key) {
                value = this.elements[key];
                break;
            }
        }
    } else
        value = this.elements[_key];
    return isUndefined(value) ? null : value;
}

/*判断key是否在map中存在*/
Map.prototype.contains = function(_key){
    var value = this.elements[_key];
    return !isUndefined(value);
}

/*清除map中的所有类容*/
Map.prototype.clear = function(){
    for (var key in this.elements) {
        delete this.elements[key];
    }
    this.len = 0;
}

/*清除map中的所有的key的数组*/
Map.prototype.keySet = function(){
    var keys = new Array();
    for (var key in this.elements) {
        if (!isUndefined(key))
            keys.push(key);
    }
    return keys;
}

Map.prototype.export2str2 = function(isKey, sep){
    var arr = new Array();
    for (var key in this.elements) {
        if (isUndefined(key))
            continue;
        if (isKey) {
            arr.push(key);
        } else {
            arr.push(this.elements[key]);
        }
    }
    return arr.join(sep);
}

/*将所有的key和其对应的value导出到返回的字符串中
  key1=value1+separator+key2=value2.....*/
Map.prototype.export2str = function(separator){
    var arr = new Array();
    var value = "";
    var equal = "=";
    for (var key in this.elements) {
        value = key;
        value += equal;
        var s = this.elements[key];
        if (s == null) {
            s = "";
        }
        if (isString(s)
                && ((s.indexOf(separator) != -1) || (s.indexOf(equal) != -1) || (s
                        .indexOf("\"") != -1))) {
            s = quotedStr(s, "\"");
        }
        value += s;
        arr.push(value);
    }
    return arr.join(separator);
}

/*将自己的类容变成一个uri的参数串，用utf-8编码*/
Map.prototype.export2uri = function(){
    var arr = new Array();
    var value = "";
    var equal = "=";
    var length = this.size();
    for (var key in this.elements) {
        value = key;
        value += "=";
        var s = this.elements[key];
        if (s == null) {
            s = "";
        } else {
            s = encodeURIComponent(s);
        }
        value += s;
        arr.push(value);
    }
    return arr.join("&");
}

/*返回elements*/
Map.prototype.listEntry = function(){
    return this.elements;
}

/*该类提供了按序号遍历的方法，但是不支持删除，删除以后就不能按序号遍历了
只是提供通过序号遍历的
*/
function OrderMap(){
    if (_biInPrototype)
        return;
    Map.call(this);
    this.arr = new Array();
}

_extendClass(OrderMap, Map, "OrderMap");

/*OrderMap 继承Map类*/

/*往OrderMap里面添加一个元素，如果value为undefine那么会自动给value=null*/
OrderMap.prototype.put = function(key, value){
    var oldlen = this.size();
    Map.prototype.put.call(this, key, value);
    var newlen = this.size();
    if (oldlen != newlen)
        this.arr[oldlen] = key;
}

/*按序号遍历OrderMap*/
OrderMap.prototype.getByIndex = function(i){
    return Map.prototype.get.call(this, this.arr[i]);
}

/*i为数字也可以为字符*/
OrderMap.prototype.get = function(i){
    if (isNumber(i)) {
        return this.getByIndex(i);
    } else if (isString(i)) {
        return Map.prototype.get.call(this, i);
    } else {
        return null;
    }
}

OrderMap.prototype.remove = function(i){
    if (isNumber(i)) {
        if (i > this.arr.length) {
            throwError("Map中的数组越界");
        }
        var key = this.arr[i];
        Map.prototype.remove.call(this, key);
        this.arr.splice(i, 1);
    } else if (isString(i)) {
        if (this.contains(i)) {
            Map.prototype.remove.call(this, i);
            var idx = this.getKeyIndex(i);
            if (idx == -1) {
                throwError("map中存在，记录关键字的数组中不存在！");
            }
            this.arr.splice(idx, 1);
        }
    }
    return true;
}

OrderMap.prototype.getKey = function(idx){
    return this.arr[idx];
}

OrderMap.prototype.clear = function(){
    Map.prototype.clear.call(this);
    this.arr.splice(0, this.arr.length);
}

/*返回指定key的index，如果不存在返回－1*/
OrderMap.prototype.getKeyIndex = function(key){
    for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i] == key) {
            return i;
        }
    }
    return -1;
}

/*类似java中StringMap类，利用上面的Map类实现其功能,
  参数content和separator都可以不传递，
  content表示给StringMap中初始化的内容。
  separator表示内容中的分割串是什么
  如传递：new StringMap("a=1;b=2",";")*/
function StringMap(content, separator){
    this.content = content;
    this.separator = separator;
    this.map = new Map();
    this.equal = "=";
    this.init(this.content);
    return this;
}

StringMap.prototype.init = function(str){
    var s = str;
    if (s == null || s.length == 0) {
        return;
    }

    if (this.separator == null || this.separator.length == 0) {
        this.separator = ";";
    }

    var i1 = 0;
    var i2 = s.indexOf(this.equal, i1);
    while (i2 != -1) {
        var key = s.substring(i1, i2);
        var value;
        i1 = i2 + this.equal.length;
        if (i1 < s.length && s.charAt(i1) == '"') {
            var func = new extractQuotedStr(s, "\"", i1);
            value = func.getValue();
            i1 = func.getEndIndex() + this.separator.length;
        } else {
            i2 = s.indexOf(this.separator, i1);
            if (i2 == -1) {
                i2 = s.length;
            }
            value = s.substring(i1, i2);
            i1 = i2 + this.separator.length;
        }
        i2 = s.indexOf(this.equal, i1);
        this.setValue(key, value);
    }
}

StringMap.prototype.merge = function(content){
    this.init(content);
}

/*返回串key在此对象中对应的值，如果不存在返回def*/
StringMap.prototype.getValue = function(key, def){
    var v = this.map.get(key);
    if (v == null) {
        return def;
    } else {
        return v;
    }
}

/*获取一个整形值。*/
StringMap.prototype.getInt = function(key, def){
    var s = this.getValue(key);
    return s ? parseInt(s) : (def != null ? def : 0);
}

/*获得布尔值*/
StringMap.prototype.getBool = function(key, def){
    var s = this.getValue(key);
    return parseBool(s, def);
}

function parseBool(s, def){
    if (typeof(s) == "boolean") {
        return s;
    }
    if (typeof(s) != "string") {
        return (def != null && def != undefined) ? def : false;
    }
    s = s.toUpperCase();
    if (s == "TRUE" || s == "T" || s == "1") {
        return true;
    } else if (s == "FALSE" || s == "F" || s == "0") {
        return false;
    } else {
        return (def != null && def != undefined) ? def : false;
    }
}

/*设置此串在此对象中对应的值*/
StringMap.prototype.setValue = function(key, value){
    this.map.put(key, value);
}

/*删除此对象中的key和其对应的值，并返回对应的值，如果没有则返回def*/
StringMap.prototype.removeValue = function(key, def){
    var v = this.map.remove(key);
    if (v == null) {
        return def;
    } else {
        return v;
    }
}

/*清除此对象中的类容*/
StringMap.prototype.clear = function(){
    this.map.clear();
}

/*返回key的数组*/
StringMap.prototype.keySet = function(){
    return this.map.keySet();
}

/*将此类中的key与value组合成一个串并返回，组合的规则和java中StringMap类一样
  key中的特殊字符可以不考虑，value中的特殊字符要用str2Text处理*/
StringMap.prototype.toString = function(){
    return this.map.export2str(this.separator);
}

StringMap.prototype.export2uri = function(){
    return this.map.export2uri();
}

/*
将字符串转化为Map对象
*/
function strToMap(content, separator){
    var m = new StringMap(content, separator);
    return m.map;
}

/*检测id是string还是object,并返回id的object*/
function checkElement(id){
    var obj = null;
    if (isString(id)) {
        obj = document.getElementById(id);
    } else if (isObject(id)) {
        obj = id;
    }
    return obj;
}

/*
获取dom对象在parentNode对象上的坐标,如果parentNode对象没有指定,则为body上,win为dom所在的window对象
创建方法:var p = new getAbsPosition(window, dom);
var x = p.x;//获得x坐标;
var y = p.y;//获得y坐标;
*/
function getAbsPosition(win, dom, parentNode){
    var _win = win && typeof(win) == "object" ? win : window;
    var _parentNode = typeof(parentNode) == "object"
            ? parentNode
            : _win.document.body;
    var _baseDom = dom;
    if (!_baseDom)
        return null;
    this.x = _baseDom.offsetLeft - _baseDom.scrollLeft;
    this.y = _baseDom.offsetTop - _baseDom.scrollTop;
    var _pNode = _baseDom.offsetParent;
    while (_pNode != _parentNode && _pNode) {
        this.x += (_pNode.offsetLeft - _pNode.scrollLeft);
        this.y += (_pNode.offsetTop - _pNode.scrollTop);
        _pNode = _pNode.offsetParent;
    }
}

/**
 * 获取左坐标
 */
function getLeft(o){
    var l = o.offsetLeft;
    while (o = o.offsetParent) {
        l += o.offsetLeft;
    }
    return l;
}

/**
 * 获取上坐标
 */
function getTop(o){
    var t = o.offsetTop;
    while (o = o.offsetParent) {
        t += o.offsetTop;
    }
    return t;
}

/*
  获取元素o的真实左坐标
  modify by wangtt: add clientLeft value
*/
function getRealLeft(e){
    var l = e.clientLeft + e.offsetLeft;
    while (e = e.offsetParent) {
        l = l + e.clientLeft + e.offsetLeft;
        if (e.tagName !== 'BODY' && e.tagName !== 'body')
            l = l - e.scrollLeft;
    }
    return l;
}

/*
  获取元素o的真实上坐标
  modify by wangtt: add clientTop value
*/
function getRealTop(e){
    var t = e.clientTop + e.offsetTop;
    var i = 0;
    while (e = e.offsetParent) {
        t = t + e.clientTop + e.offsetTop;
        if (e.tagName !== 'BODY' && e.tagName !== 'body')
            t = t - e.scrollTop;
    }
    return t;
}

/*
  获取元素o在浏览器上显示的偏移左坐标
  add by wangtt
*/
function getClientOffsetLeft(o){
    var l = o.offsetLeft - o.scrollLeft;
    while (o = o.offsetParent) {
        l += o.offsetLeft - o.scrollLeft;
    }
    return l;
}

/*
  获取元素o在浏览器上显示的偏移上坐标
  add by wangtt
 */
function getClientOffsetTop(o){
    var t = o.offsetTop - o.scrollTop;
    while (o = o.offsetParent) {
        t += o.offsetTop - o.scrollTop;
    }
    return t;
}

/*获取dom所在parentNode上的上坐标*/
function getDomTop(dom, parentNode){
    var _baseDom = dom;
    if (!parentNode) {
        return getDomOffsetTop(_baseDom);
    }
    var _pNode = _baseDom.offsetParent;
    var r = getDomOffsetTop(_baseDom, true);
    while (_pNode != null && _pNode != parentNode) {
        r += getDomOffsetTop(_pNode, true);
        _pNode = _pNode.offsetParent;
    }
    return r;
}

/*获取dom所在的无素上的偏移上坐标*/
function getDomOffsetTop(dom, ignoreScroll){
    return dom.offsetTop - (ignoreScroll ? dom.scrollTop : 0);
}

/*获取dom所在parentNode上的左坐标*/
function getDomLeft(dom, parentNode){
    var _baseDom = dom;
    if (!parentNode) {
        return getDomOffsetLeft(_baseDom);
    }
    var _pNode = _baseDom.offsetParent;
    var r = getDomOffsetLeft(_baseDom, true);
    while (_pNode != null && _pNode != parentNode) {
        r += getDomOffsetLeft(_pNode, true);
        _pNode = _pNode.offsetParent;
    }
    return r;
}

/*获取dom所在的无素上的偏移左坐标*/
function getDomOffsetLeft(dom, ignoreScroll){
    return dom.offsetLeft - (ignoreScroll ? dom.scrollLeft : 0);
}

/*产生一个大的随机数*/
bigRandom = function(n){
    return Math.floor(Math.random() * (n ? n : 9999999999));
}

/*返回一个随机的以id为前缀的字符串*/
function idRandom(id){
    return id + "$" + bigRandom();
}

/*获取mouse的坐标, 方法.x()获得x坐标,方法.y()获得y坐标*/
function getCursorPosition(e, wnd){
    wnd = wnd && typeof(wnd) == "object" ? wnd : window;
    if (!e)
        e = wnd.event;
    this.x = e.clientX; // e.pageX?e.pageX:e.x;
    this.y = e.clientY; // e.pageY?e.pageY:e.y;
}

/*获取键盘按键*/
function getKeyCode(e, wnd){
    wnd = wnd && typeof(wnd) == "object" ? wnd : window;
    if (!e)
        e = wnd.event;
    return e.keyCode;
}

/*获取mouse下的目标对象的id, 如果此对象没有id,则会返回一个空*/
function getTargetId(e, wnd){
    wnd = wnd && typeof(wnd) == "object" ? wnd : window;
    if (!e)
        e = wnd.event;
    return e.target ? e.target.id : e.srcElement.id;
}

/*创建一个对象,doc, parentid, tag必须指定.id可以不指定,不指定则不为创建的对象设置id,否则生成一个随机的id*/
function CreateElement(doc, parentid, tag, id){
    var el = parentid.appendChild(doc.createElement(tag));
    if (id) {
        el.id = idRandom(id);
    }
    return el;
}

// String

String.prototype.equalsIgnoreCase = function(str){
    return this.toUpperCase() === str.toUpperCase();
}

String.prototype.compareTo = function(str){
    var s1 = this.toString();
    var s2 = str.toString();
    if (s1 === s2)
        return 0;
    else if (s1 > s2)
        return 1;
    else
        return -1;
}

String.prototype.compareToIgnoreCase = function(str){
    var s1 = this.toUpperCase();
    var s2 = str.toUpperCase();
    if (s1 === s2)
        return 0;
    else if (s1 > s2)
        return 1;
    else
        return -1;
}

String.prototype.startsWith = function(prefix){
    return this.substring(0, prefix.length) == prefix;
}

String.prototype.endsWith = function(suffix){
    return this.substring(this.length - suffix.length) == suffix;
}

String.prototype.concat = function(str){
    return new String(this.toString() + str);
}

String.prototype.toCharArray = function(){
    var charArr = new Array();
    for (var i = 0; i < this.length; i++)
        charArr[i] = this.charAt(i);
    return charArr;
}

String.prototype.trim = function(wh){
    if (!this.length) {
        return this;
    }
    if (wh > 0) {
        return this.replace(/^\s+/, "");
    } else if (wh < 0) {
        return this.replace(/\s+$/, "");
    } else {
        return this.replace(/^\s+|\s+$/g, "");
    }
}

String.prototype.ensureNotStartWith = function(sep){
    var len;
    if (!this || (len = this.length) == 0) {
        return this;
    }
    var start = 0;
    if (sep.length == 0) {
        return this;
    } else {
        while (start != len && sep.indexOf(this.charAt(start)) != -1) {
            start++;
        }
    }
    return this.substring(start);
}

String.prototype.ensureNotEndWith = function(sep){
    var end;
    if (!this || (end = this.length) == 0) {
        return this;
    }

    if (sep.length == 0) {
        return this;
    } else {
        while ((end != 0) && (sep.indexOf(this.charAt(end - 1)) != -1)) {
            end--;
        }
    }
    return this.substring(0, end);
}

String.prototype.trimStart = function(){
    return this.trim(1);
}

String.prototype.trimEnd = function(){
    return this.trim(-1);
}

String.prototype.toArray = function(sept){
    var s = this.trim();
    if (!sept)
        sept = ',';
    if (s < ' ')
        return new Array();
    else
        return s.split(sept);
}

String.prototype.toHTML = function(){
    this.replace("/\>/g", "&gt;");
    this.replace("/\</g", "&lt;");
    this.replace("/\"/g", "&quot;");
    this.replace("/\&/g", "&amp;");
    return this;
}

// Array
Array.prototype.indexOf = function(element){
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element)
            return i;
    }
    return -1;
}

/*把数组里面的元素加入到当前数组*/
Array.prototype.putAll = function(arr){
    if (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            this.push(arr[i]);
        }
    }
}

Array.prototype.insertAt = function(obj, i){
    this.splice(i, 0, obj);
}

Array.prototype.removeAt = function(i){
    this.splice(i, 1);
}

Array.prototype.clear = function(){
    this.splice(0, this.length);
}

/*判断两个个数组里面的元素是否相等*/
Array.prototype.compareToStr = function(arr){
    if (this.length == arr.length) {
        for (var i = 0; i < this.length; i++) {
            var tmp = arr[i];
            if (this.indexOfIgnoreCase(tmp) == -1) {
                return false;
            }
        }
        return true;
    }
    return false;
}

//
Array.prototype.indexOfIgnoreCase = function(str){
    var s = str.toUpperCase();
    for (var i = 0; i < this.length; i++) {
        if (this[i].toUpperCase() == s)
            return i;
    }
    return -1;
}

// 删除数组中的某个元素
Array.prototype.remove = function(element){
    var i = this.indexOf(element);
    if (i >= 0) {
        this.splice(i, 1);
        return true;
    }
    return false;
}

// Number

Number.prototype.equals = function(obj){
    return this.toString() == obj.toString();
}

Number.prototype.compareTo = function(obj){
    return this - obj;
}

Number.toHexString = function(i){
    return i.toString(16);
}

Number.toBinaryString = function(i){
    return i.toString(2);
}

// Date

Date.prototype.hashCode = function(){
    var l = this.getTime();
    var s = Number.toHexString(l);

    var high = 0;
    if (s.length > 8)
        high = parseInt(s.substring(0, s.length - 8), 16);

    var low = l & 0xffffffff;
    return low ^ high;
}

Date.prototype.compareTo = function(obj){
    return (this.getTime() - obj.getTime()) & 0xffffffff;
}

/*获得跟窗体的window对象，如果forceInThisBrowseWindow为真则之返回调用页面所在的浏览器窗口的跟页面的window对象
  否则返回多个窗体的跟页面对象。*/
function getRootWindow(forceInThisBrowseWindow){
    /*if (forceInThisBrowseWindow){
      return top;
    }else{
      return opener ? opener.top : top;
    }*/
    if (top.window.document.getElementsByTagName("frameset").length > 0) {
        // 当检测到frameset框架时将返回window对象
        return window;
    }
    return top;
}

// by yk.
// 以ie的rootwindow的javascript上下文空间创建一个类对象，参数cls表示要创建的类的类名，如果有saveid则表示将创建的对象
// 寄存到rootwindow上，下次不再创建而直接获取，如果saveid且disposeit则此函数在创建对象时为对象添加dispose的事件。
function getObjectFromRoot(cls, saveid, disposeit, jssrc){
    var root = getRootWindow();
    if (jssrc && typeof(jssrc) == "string" && jssrc.lastIndexOf(".js") != -1)
        sys.lib.include(jssrc, root);
    var obj = null;
    if (saveid && typeof(saveid) == "string") {
        obj = root.eval("window." + saveid);
        if (obj) {
            return obj;
        } else {
            obj = root.eval("window." + saveid + "= new " + cls + "()");
            if (typeof(disposeit) == "boolean") {
                root.eval("addDispose('window." + saveid + ".dispose();window."
                        + saveid + "=null')");
            }
        }
    } else {
        obj = root.eval("new " + cls + "()");
    }
    return obj;
}

/*获取最顶层的对象
  如何调用顶层的javascript: new TopDocument().topObject.XXX(); */
function TopDocument(forceInThisBrowseWindow){
    this.topObject = getRootWindow(forceInThisBrowseWindow);

    this._window = this.topObject;
    this._document = this._window.document;
    this._body = this._document.body;
    this._location = this._window.location;
    this._head = this._document.getElementsByTagName("head");
    this.hasHead = this._head;
}

TopDocument.prototype.dispose = function(){
    this.topObject = null;
    this._window = null;
    this._document = null;
    this._body = null;
    this._location = null;
    this._head = null;
    this.hasHead = null;
}

/*在顶部页面添加外部脚本*/
TopDocument.prototype.addScript = function(src){
    if (this.hasHead) {
        if (this.findScript(src) != -1)
            return;
        var _head = this._head[0];
        var _script = _head.appendChild(this._document.createElement("script"));
        _script.src = src;
    }
}

/*在顶部页面添加外部样式*/
TopDocument.prototype.addStyle = function(name){
    if (this.hasHead) {
        if (this.findStyle(name) != -1)
            return;
        var _head = this._head[0];
        var _link = _head.appendChild(this._document.createElement("link"));
        _link.href = name;
        _link.rel = "stylesheet";
        _link.type = "text/css";
    }
}

/*查找指定的外部脚本是否存在，不存在则返回-1*/
TopDocument.prototype.findScript = function(src){
    var _script = this._document.getElementsByTagName("script");
    if (!_script)
        return;
    var count = _script.length;
    for (var i = 0; i < count; i++) {
        if (_script[i].src.indexOf(src) != -1)
            return i;
    }
    return -1;
}

/*查找指定的外部样式是否存在，不存在则返回-1*/
TopDocument.prototype.findStyle = function(name){
    var _link = this._document.getElementsByTagName("link");
    if (!_link)
        return;
    var count = _link.length;
    for (var i = 0; i < count; i++) {
        if (_link[i].href.indexOf(name) != -1)
            return i;
    }
    return -1;
}

/*获取顶层的window*/
TopDocument.prototype.getWindow = function(){
    return this._window;
}

/*获取顶层的document*/
TopDocument.prototype.getDocument = function(){
    return this._document;
}

/*获取顶层的body*/
TopDocument.prototype.getBody = function(){
    return this._body;
}

/*获取顶层的url*/
TopDocument.prototype.getUrl = function(){
    return this._location;
}

/*设置顶层的url*/
TopDocument.prototype.setUrl = function(url){
    this.getUrl().href = url;
}

/*重新装入顶层页面*/
TopDocument.prototype.reload = function(){
    this.getUrl().reload();
}

// 输出信息
function out(){
    this.args = arguments;
    this.argc = this.args.length;
    this.id = this.argc > 0 ? document.getElementById(this.args[0]) : "";
    this.hasID = this.id ? true : false;
}

/*不换行的输出信息*/
out.prototype.print = function(str){
    if (this.hasID) {
        this.id.innerHTML += str;
    } else {
        document.open();
        document.write(str);
        document.close();
    }
}

/*输出一行信息*/
out.prototype.println = function(str){
    if (this.hasID) {
        this.id.innerHTML += str + "<br>";
    } else {
        document.open();
        document.write(str + "<br>");
        document.close();
    }
}

function getPercent(n, total){
    return ((n / total) * 100);
}

function getPixel(total, percent){
    return (total * (percent / 100));
}

function getPercent2(n, total){
    return (100 - ((n / total) * 100)) + "%";
}

/*获取parameter的数值,如index.jsp?action=10&type=0,
要获取action的传值,可以写成getParameter("action")*/
function getParameter(parameter){
    var arySearch = window.location.search.split("&");
    try {
        for (var i = 0; i < arySearch.length; i++) {
            var lenPar = parameter.length;
            var index = arySearch[i].indexOf(parameter + "=");
            if (index != -1) {
                return (arySearch[i].substring(index + lenPar + 1));
            }
        }
        return "";
    } catch (e) {
        return "";
    }
}

/*
设置url里指定参数里的传值
返回结果为以?开头的参数串
例如:index.jsp?action=20&type=0,现在要改变type的伟传值1,则setParameter("type", "1");返回结果为"?action=20&type=1"的参数串
*/
function setParameter(parameter, value){
    var p = window.location.search;
    if (p && typeof(p) == "string" && p.length > 0 && p.charAt(0) == "?") {
        var ary2 = [];
        var ary = p.substring(1).split("&");
        if (ary == null || ary.length == 0)
            return "";
        var tmp, tmpp;
        for (var i = 0; i < ary.length; i++) {
            tmp = ary[i];
            tmpp = tmp.split("=");
            if (tmpp != null && tmpp.length == 2 && tmpp[0] == parameter) {
                tmpp[1] = value;
                tmp = tmpp.join("=");
            }
            ary2.push(tmp);
        }
        return ("?" + ary2.join("&"));
    }
    return "";
}

/*获取一组parameter的数值如index.jsp?userid=154&userid=20&userid=10&type=0,
要获取userid的所有传值,可以写成getParameterValues("userid")*/
function getParameterValues(parameter){
    var arySearch = window.location.search.split("&");
    var resultArray = new Array();
    try {
        for (var i = 0, j = 0; i < arySearch.length; i++) {
            var lenPar = parameter.length;
            var index = arySearch[i].indexOf(parameter + "=");
            if (index != -1) {
                resultArray[j] = arySearch[i].substring(index + lenPar + 1);
                j++;
            }
        }
        return resultArray;
    } catch (e) {
        return "";
    }
}

/*替换str里的所有空格*/
function replaceAllSpaces(str){
    try {
        if (str != "") {
            return (str.replace(/ /g, ""));
        }
        return "";
    } catch (e) {
        return "";
    }
}

function toPerNumber(p){
    p = typeof(p) == "string"
            ? (p.lastIndexOf("%") != -1 ? p : p + "px")
            : (typeof(p) == "number" ? p + "px" : "100%");
    return p.charAt(0) == "-" ? 0 : p;
}

/*当id里按下回车时,focusid将获得焦点*/
function setFocus(focusid){
    if (typeof(focusid) == "string")
        focusid = document.getElementById(focusid);
    if (typeof(focusid) == "object")
        focusid.focus();
}

/*当id里按下回车时,focusid将获得焦点*/
function onFocus(id, focusid){
    var _id;
    var _focusid;
    if (id && typeof(id) == "string")
        _id = document.getElementById(id);
    if (_focusid && typeof(_focusid) == "string")
        _focusid = document.getElementById(focusid);
    if (typeof(_id) == "object" && typeof(_focusid) == "object") {
        _id.onkeydown = function(e){
            if (!e)
                e = window.event;
            switch (e.keyCode) {
                case 13 :
                    _focusid.focus();
                    break;
                default :
                    break;
            }
        }
    }
}

/*当id里按下回车时,将要执行的功能func*/
function onEnter(id, func){
    var _id;
    if (id && typeof(id) == "string")
        _id = document.getElementById(id);
    if (typeof(_id) == "object") {
        _id.onkeydown = function(e){
            if (!e)
                e = window.event;
            switch (e.keyCode) {
                case 13 :
                    if (typeof(func) == "function") {
                        func();
                    }
                    if (typeof(func) == "string") {
                        eval(func);
                    }
                    break;
                default :
                    break;
            }
        }
    }
}

function getHost(){
    var url = window.location.href;
    var index = url.lastIndexOf("/");
    return index != -1 ? url.substring(0, index + 1) : "";
}

/*一行一行的读取某串的类*/
function LineReader(s){
    this.s = s;
    this.index = 0;
}

/*读入一行，并返回*/
LineReader.prototype.readLine = function(){
    var oldi = this.index;
    if (oldi == -1) {
        return null;
    }
    var s = this.s;
    var i = s.indexOf("\n", oldi);
    if (i == -1) {
        this.index = i;
        return s.substring(oldi);
    } else {
        this.index = i + 1;
        if (s.charAt(i - 1) == '\r')
            i--;
        return s.substring(oldi, i);
    }
}

LineReader.prototype.eof = function(){
    return this.index == -1;
}

/*从当前处开始读行，直到读入aline为止，返回之间的类容*/
LineReader.prototype.readLineUtil = function(aline){
    var ln = this.readLine();
    var r = "";
    while (ln != aline && !this.eof()) {
        r += ln + "\r\n";
        ln = this.readLine();
    }
    return r.trim();
}

/*从当前处开始读行，直到读入aline为止，忽略之间的类容*/
LineReader.prototype.skipLineUtil = function(){
    this.readLineUtil();
}

/*获取剩下的类容*/
LineReader.prototype.getRemain = function(){
    return this.s.substring(this.index);
}

/*建立一个读取报表文件或任务文件的类,
  参数content表示类容*/
function TxtLoader(content){
    this.sectionArray = new Array();
    this.content = content;
    this.sectionCount = 0;

    this.arglen = arguments.length;
    this.args = arguments;
    this.init();
    return this;
}

/*
    <head>
    </head>
    filterName body,cl..
    include true表示是否包含 false表示排除
    <item .../>
    <item z="asdsad"></item>
  */

/*fnMap保存的是过滤字段的集合*/
TxtLoader.prototype._canAdd = function(sectionName, fnMap, include){
    if (fnMap == null) {
        return true;
    }
    return (fnMap.contains(sectionName) == include);
}

/*从index开始查找与<head 相匹配的</head> 是为支持这种形式 <g><r></r><gg ><r></r><g></g></gg></g>
  返回查找到的</head>位置
  判断方法，找到</head>的位置 i2,然后从i2往前找<head看在i2之前是否存在<head,并且该值要大于index
  如果有就说明有相同段名的嵌套。然后判断该段是否在单行段，如果不是stack++。就这样找出>index 和 <i2之间
  的有多少相同的段名相同的嵌套段,然后在根据stack的值去找相应的</head>
  index位置为<head 后的第一个">"号
*/
/*index为"<"所在的位置*/
function searchIndex(content, headStart, end, index){
    var firstEnd = content.indexOf(end, index);
    // 第一个结束符的匹配位置
    if (firstEnd == -1) {
        alert(headStart + "没有匹配");
        return firstEnd;
    }

    var i0 = content.lastIndexOf(headStart, firstEnd);
    if (i0 == index)
        return firstEnd; // 表明中间不存在嵌套段

    var b = false; // 判断是否遍历完成
    var stack = 0;
    i0 = index;
    var i1 = index;
    while (i0 > -1) { // 找出有多少个嵌套段，单行段不算
        i2 = content.indexOf(">", i0);
        var ch1 = content.charAt(i2 - 1);
        // 要注意某一个head包含headStart的情况，形如 <g ><gg ></gg></g>
        var ch = content.charAt(i0 + headStart.length);
        if (ch1 == "/" || (ch != '>' && ch != ' ')) {
            i0 = content.indexOf(headStart, i2);
            continue;
        }
        if (i0 < firstEnd) {
            stack++;
        } else {
            i2 = content.lastIndexOf(end, i0);
            firstEnd = i2;
            i1 = i0;
            while (i2 > index && i2 != -1) {
                stack--;
                if (stack == 0) {
                    b = true;
                    break;
                }
                i2 = content.lastIndexOf(end, i2 - 1);
            }
            index = i0;
            if (b) {
                break;
            } else {
                stack++;
            }
            firstEnd = content.indexOf(end, i0);
        }
        i0 = content.indexOf(headStart, i0 + 1);
    }
    // <g><g><g></g></g><g></g></g>
    if (i0 == -1) {
        i0 = i1;
        for (var i = 1; i <= stack; i++) {
            firstEnd = content.indexOf(end, i0);
            i0 = firstEnd + end.length;
        }
    }
    if (firstEnd == -1) {
        alert(headStart + "没有匹配，检查相同段名的嵌套情况!");
    }
    return firstEnd;
}

/*把过滤的参数放入到map*/
TxtLoader.prototype._initFilterMap = function(filterName){
    var arr = filterName.split(",");
    var map = new Map();
    for (var i = 0, len = arr.length; i < len; i++) {
        map.put(arr[i].toUpperCase(), arr[i]);
    }
    return map;
}

/*初始化参数content,该函数体太大，有待调整*/
TxtLoader.prototype.init = function(){
    if (this.content == null || this.content.length == 0)
        return;
    var filterName = '';
    var include = false;
    var fnMap = null;
    if (this.arglen == 3) {
        filterName = this.args[1];
        include = this.args[2];
        fnMap = this._initFilterMap(filterName);
    }

    var sectionStr;
    var head;
    // 段名
    var sp;
    // 段中第一个空格出现的位置
    var i1 = 0;
    var i2 = this.content.indexOf("<", i1);

    while (i2 != -1) {
        i1 = this.content.indexOf(">", i2);
        if (i1 == -1) {
            alert("位于第" + i2 + "个字符位置的\"<\"不匹配");
            break;
        }

        // 判断前面一个字符是否是/，如果是那么这个就是一个完整的section
        if (this.content.charAt(i1 - 1) == "/") {
            // 把段内容当作这样一个对象放入数组{name:head,value:sectionStr}
            sectionStr = this.content.substring(i2, i1 + 1);
            head = sectionStr.substring(i2 + 1, i1 - 1);
            sp = head.indexOf(" ");
            if (sp > -1) {
                head = head.substring(i2 + 1, sp);
            }
            // 判断该段是否应该加入
            if (!this._canAdd(head.toUpperCase(), fnMap, include)) {
                i2 = this.content.indexOf("<", i1);
                continue;
            }
            this.sectionArray.push({
                name : head.toUpperCase(),
                value : sectionStr
            });
            i2 = this.content.indexOf("<", i1);
            continue;
        }// 单行段判断完毕

        // 多行判断
        head = this.content.substring(i2 + 1, i1);
        // 如果head里面存在空格，那么第一个空格以前的字符串才是head
        sp = head.indexOf(" ");
        if (sp > -1) {
            head = head.substring(0, sp);
        }
        // 由于<col name >..</col>，那么headStart=<col
        var headStart = "<" + head;
        var headEnd = "</" + head + ">";

        /*
        首先以headEnd查找
        可能出现这样的情况<item>...</item> 和 <item />
        象这样的判断结束符的时候 首先查找</item>，如果没有就查找/>，如果存在在查找<item，比较两个的index
        index1 > index2 说明index1就是结束位置，否则在查找/>
        单行段已经在前面判断了
        */

        // var i = this.content.indexOf(headEnd, i1);
        var i = searchIndex(this.content, headStart, headEnd, i2);
        // 如果只找到开始<>，没有</>就报错
        if (i == -1) {
            // alert(headStart + "没有匹配");
            break;
        }

        // 判断当前查找的headEnd是否与要查找的相对应，支持这种形式 <g><r></r><g><r></r><g></g></g></g>

        // 判断该段是否应该加入
        if (!this._canAdd(head.toUpperCase(), fnMap, include)) {
            i2 = this.content.indexOf("<", i + headEnd.length);
            continue;
        }

        sectionStr = this.content.substring(i2, i) + headEnd;
        // 把段内容当作这样一个对象放入数组{name:head,value:sectionStr}
        this.sectionArray.push({
            name : head.toUpperCase(),
            value : sectionStr
        });
        i2 = this.content.indexOf("<", i + headEnd.length);
    }
}

/*获得section的数目*/
TxtLoader.prototype.getSectionCount = function(){
    return this.sectionArray.length;
}

/*如果i为整形表示获得第i个section的对象
  如果i为字符串则表示获得sectionname为i的section的对象，大小写不敏感,
*/
TxtLoader.prototype.getSection = function(i){
    // 返回的内容包括<..></..>
    if (isString(i)) {
        var upstr = i.toUpperCase();
        for (var j = 0, len = this.sectionArray.length; j < len; j++) {
            if (this.sectionArray[j].name == upstr) {
                return new TxtSection(this.sectionArray[j].value);
            }
        }
        return null;
    } else if (isNumber(i)) {
        return new TxtSection(this.sectionArray[i].value);
    } else {
        alert(i + "输入的参数错误!");
    }
}

TxtLoader.prototype.toString = function(){
    return "TxtLoader";
}

/*表示TxtLoader类中所读取的某端的对象。*/
function TxtSection(content){
    this.content = content;

    this.name = "";
    // 读取该段的属性
    this.attribsinit = false;
    this.attribs = "";
    this.attribsmap = new StringMap("", " ");

    // 读取该段的内容
    this.contentStr = "";
    this.strmap = new StringMap("", "\r\n");
    this.strmapinit = false;

    // 获取该段是否嵌套的属性
    this.recinit = false;

    this.txtLoad;

    this.init();
    return this;
}

TxtSection.prototype.init = function(){
    var i1 = 0;
    var i2 = this.content.indexOf("<", i1);
    var i1 = this.content.indexOf(">", i2);
    var attrline;
    // 属性行
    var tmpi;
    // 表示该段是一单行
    if (this.content.charAt(i1 - 1) == "/") {
        this.contentStr = "";
        attrline = this.content.substring(i2 + 1, i1 - 1);
        tmpi = attrline.indexOf(" ");
        if ((attrline.length > 0) && (tmpi > -1)) {
            this.name = attrline.substring(0, tmpi)
            this.attribs = attrline.substring(tmpi + 1);
        } else {
            this.name = attrline;
            this.attribs = "";
        }
        this.contentStr = "";
        return;
    }

    //
    var head = this.content.substring(i2 + 1, i1);
    var sp = head.indexOf(" ");
    if (sp > 0) {
        // 如果head里面有空格表示有属性,取出属性
        this.attribs = head.substring(sp + 1, i1);
        head = head.substring(0, sp);
    }
    this.name = head;

    // contentStr就是除去<></>之间的内容，还包括\r\n
    // i2 = this.content.indexOf("</" + head + ">");
    i2 = searchIndex(this.content, "<" + head, "</" + head + ">", 0);
    if (i2 != -1) {
        var ln = "\r\n";
        var tmpStr = this.content.substring(i1 + 1, i2);
        for (var c = 0; tmpStr.charCodeAt(c) < 33; c++)
            ;
        this.contentStr = tmpStr.slice(c);
    }
}

/*获得此section的name，返回字符串*/
TxtSection.prototype.getName = function(){
    return this.name;
}

/*获得sectionname后边跟着的属性所生成的StringMap对象，如果没有返回null*/
TxtSection.prototype.getAttribs = function(){
    if (!this.attribsinit) {
        this.attribsmap.merge(this.attribs);
    }
    this.attribsinit = true;
    return this.attribsmap;
}

/*获得section之间的内容所生成的StringMap对象，如果没有返回null*/
TxtSection.prototype.getContents = function(){
    if (!this.strmapinit) {
        this.strmap.merge(this.contentStr);
    }
    this.strmapinit = true;
    return this.strmap;
}

/*将section之间的东西当作字符串返回*/
TxtSection.prototype.getContentStr = function(){
    return this.contentStr;
}

/*获得section的数目*/
TxtSection.prototype.getSectionCount = function(){
    if (!this.recinit) {
        this.txtLoad = new TxtLoader(this.contentStr);
    }
    this.recinit = true;
    return this.txtLoad.getSectionCount();
}

/*如果i为整形表示获得第i个section的对象
如果i为字符串则表示获得sectionname为i的section的对象，大小写不敏感
字符串没有实现，如果输入的字符串匹配多个段，应该
*/
TxtSection.prototype.getSection = function(i){
    if (!this.recinit) {
        this.txtLoad = new TxtLoader(this.contentStr);
    }

    this.recinit = true;
    return this.txtLoad.getSection(i);
}

TxtSection.prototype.toString = function(){
    return "TxtSection";
}

/*抛出一个异常，msg指定异常的简短信息，detailmsg指定异常的详细信息，detailmsg可以不传递,
  如果不是ie浏览器，则用escape编码所有信息，因为其他浏览器的onerror事件接收到的中文信息是
  乱码*/
function throwError(msg, detailmsg, option){
    // var isie = window.navigator.userAgent.indexOf("MSIE") != -1;
    // 如果有上面那行代码,在mdq的ie上无法获得异常的详细信息
    var s = msg + (detailmsg ? "\r\n--detailmessage--\r\n" + detailmsg : "");
    // 为了兼容,isMesasge为true表明抛出的不是异常，而是message
    if (option)
        s += "\r\n--messageInfo--\r\n" + option;
    if (!isie) {
        s = escape(s);
    }
    throw new Error(s);
}

/*设置一个间隔调用的， func可以是一个函数（类的成员函数也可以），也可以是一个字符串，也可以是一个CallBackFunc类的实例
interval是间隔时间以毫秒为单位，userdata1,userdata2,userdata3是调用func时传递的参数。*/
function mySetInterval(wnd, func, interval, userdata1, userdata2, userdata3){
    var timmer = wnd.setInterval(function(){
            CallBackFunc.doCallBack(func, userdata1, userdata2, userdata3);
        }, interval);
    return timmer;
}

/*类似mySetInterval，只不过它设置的func只会被调用一次*/
function mySetTimeout(wnd, func, interval, userdata1, userdata2, userdata3){
    var timmer = wnd.setTimeout(function(){
            CallBackFunc.doCallBack(func, userdata1, userdata2, userdata3);
        }, interval);
    return timmer;
}

/*
当wnd的nunload时调用obj, wnd缺省为当前页面的window对象。
func可以是一个函数（类的成员函数也可以），也可以是一个字符串，也可以是一个CallBackFunc类的实例
也可以是含有dispose方法的一个类的实例
此方法已在ie6.0和ff1.5上测试通过，测试页面sanlib/js/test/unload-test.htm
*/
function addDispose(obj, wnd){
    if (!wnd) {
        wnd = window;
    }
    // alert('add dispose:'+wnd.location.href);
    var disposeList = wnd.__disposeObjList;
    if (!disposeList) {
        disposeList = new Array();
        wnd.__disposeObjList = disposeList;
        if (wnd.addEventListener) {
            wnd.addEventListener("unload", _onWindowUnLoad, false);
        } else {
            wnd.attachEvent("onunload", _onWindowUnLoad);
        }
    }
    disposeList.push(obj);
}

function _onWindowUnLoad(){
    disposeObjectInWnd(this);
    if (this.removeEventListener)
        this.removeEventListener("unload", _onWindowUnLoad, false);
    else if (this.detachEvent)
        this.detachEvent("onunload", _onWindowUnLoad);
}

function disposeObjectInWnd(wnd){
    // alert('start dispose:'+wnd.location.href);
    var disposeList = wnd.__disposeObjList;
    wnd.__disposeObjList = null;
    if (!disposeList) {
        return;
    }
    while (disposeList.length > 0) {
        obj = disposeList.pop();
        if (!obj)
            continue;
        try {
            if (typeof(obj.dispose) == "function") {
                obj.dispose();
            } else if (typeof(obj.invoke) == "function") {
                obj.invoke();
            } else if (typeof(obj) == "function") {
                obj();
            } else {
                wnd.eval(obj);
            }
        } catch (ex) {
        }
    }

    // alert('end dispose:'+wnd.location.href);

    System.gc();
}

// 释放注册在wnd上的所有需要释放的对象。
function disposeIframes(wnd){
    if (!wnd) {
        wnd = window;
    }
    for (var i = 0; i < wnd.document.frames.length; i++) {
        disposeObjectInWnd(wnd.document.frames[i]);
    }
}

/*在指定的wnd中创建一个隐藏的iframe，然后让iframe的src指向url
 wnd如果不传递则使用当前的window*/
function openIframeUrl(url, wnd){
    if (!wnd)
        wnd = window;
    var div = document.getElementById("_sanlink_divid_for_downloadiframe");
    if (!div) {
        div = document.createElement("div");
        div.style.display = "none";
        div.id = "_sanlink_divid_for_downloadiframe";
        document.appendChild(div);
    }
    div.innerHTML = '<iframe src="' + url + '"></iframe>';
}

/*检测数据的合法性
@param v 数据源
@param reg 表达式
@param n 替换为什么
*/
function validate(v, reg, n){
    if (!v)
        return "";
    if (typeof(reg) != "object" && typeof(reg) != "function")
        reg = /[^A-Z^a-z^0-9^\-^\_^\.]/g;
    if (!n)
        n = "";
    return v.replace(reg, n);
}

// (number).toString(n)
// 将number转换为n进制格式输出
// parseInt(number,n);
// 将n进制的number转换为10进制的整数,parseFloat()是小数型的
// (number).tofixed(n)
//
// 将number转换为保留n位小数的形式
// 获得颜色的反颜色，返回的形式是一个十六进制的表示串，如"FF0000"
// 传入的cl也是一个串，形如：FF0000,FFFF00或#FF0000
function invertColor(cl){
    if (typeof(cl) == "string" && cl.charAt(0) == '#') {
        cl = cl.substring(1);
    }
    var i = parseInt(cl, 16);
    i = 0xFFFFFF - i;
    var r = i.toString(16);
    if (r.length > 6) {
        return r.substring(r.length - 6);
    } else {
        for (var i = r.length; i < 6; i++) {
            r = "0" + r;
        }
    }
    return r;
}

// 返回一个合法的颜色串，如#FF0000
// firefox上颜色的形式是：rgb(0, 0, 0)
function formatColor(cl){
    if (typeof(cl) == "string") {
        if (cl.charAt(0) == '#') {
            cl = cl.substring(1);
            cl = parseInt(cl, 16);
        } else if (cl.indexOf('rgb(') == 0) {
            var rgb = cl.substring(4, cl.length - 1).split(',');
            cl = rgb[0] * 65536 + rgb[1] * 256 + parseInt(rgb[2]);
        } else {
            cl = parseInt(cl, 16);
        }
    }

    if (typeof(cl) == "number") {
        var r = cl.toString(16);
        if (r.length > 6) {
            return r.substring(r.length - 6);
        } else {
            for (var i = r.length; i < 6; i++) {
                r = "0" + r;
            }
        }
        return ("#" + r).toUpperCase();
    }
    throwError("formatColor 暂时不支持数值型以外的参数:" + cl);
}

function color2int(cl){
    if (typeof(cl) == "string") {
        if (cl.charAt(0) == '#') {
            cl = cl.substring(1);
            cl = parseInt(cl, 16);
        } else {
            cl = parseInt(cl, 16);
        }
    }
    return cl;
}

/*定时器,在一定时间time后执行callback*/
function Timer(time, callback){
    var self = this;
    self._count = time ? time : 10;
    self._callback = typeof(callback) == "function" ? callback : null;
    self._timerid = setInterval(function(){
            self._init();
        }, 1000);
}

Timer.prototype._init = function(){
    var self = this;
    self._count--;
    if (self._count == 0 && self._timerid) {
        clearInterval(self._timerid);
        if (self._callback) {
            self._callback(self);
        }
    }
}

/*获得缺省的等待对话框的对象,此等待对话框是一个没有进度条也没有任何按钮的等待框,
  此函数需要跟页面引用dialog.js*/
function getDefaultWaitDialog(){
    return getObjectFromRoot("WaitDialog", "sanlink_default_waitdialog", true,
        "sanlib/js/dialog.js");
}

/*显示缺省的等待对话框*/
function showWaitDialog(msg){
    var dlg = getDefaultWaitDialog();
    if (!dlg)
        return;
    msg = msg ? msg : "正在装入，请等待…";
    dlg.setMessage(msg);
    dlg.show();
}

/*隐藏缺省的等待对话框*/
function hideWaitDialog(){
    var dlg = getDefaultWaitDialog();
    if (!dlg)
        return;
    dlg.hide();
}

/*把表单数据转换成Map,然后在用queryObj请求服务器，不支持select的多选*/
function formToMap(formObj){
    var map = new Map();
    for (i = 0; i < formObj.length; i++) {
        var e = formObj[i];
        var value = "";
        if (e.name != '') {
            if (e.type == 'select-one') {
                value = e.options[e.selectedIndex].value;
            } else if (e.type == 'checkbox' || e.type == 'radio') {
                if (e.checked == false) {
                    continue;
                }
                value = e.value;
            } else {
                value = e.value;
            }
            map.put(e.name, value.trim());
        }
    }
    return map;
}

/**
 * 属性变化事件监听器
 */
function PropertyChangeListener(eventObj){
    this.eventObj = eventObj;
}

/*
 * 属性变化事件．当属性发生变化时衩调用．
 */
PropertyChangeListener.prototype.propertyChanged = function(newVal, oldVal){

}

/*用于给window.oerror赋值以截获javascript异常*/
function _onWindowError(msg, url, line){
    var isie = window.navigator.userAgent.indexOf("MSIE") != -1;
    try {
        sys.lib.include("sanlib/js/xmlhttp.js,sanlib/js/dialog.js");
        showError(msg, isie ? window.onerror.caller : null);
    } catch (e) {
        alert(e);
    }
    return isie;
    // 如果是firefox，则不拦截异常
}

/**
移动光标到指定的位置
@param object p 需要移动光标的对象,如textarea对象
@param function callback 回调事件,返回一个数值型, 回调事件将传入p的textRange对象
@return textRange
*/
function moveCursorTo(p, callback){
    if (typeof(p) != "object")
        return;
    var _pos = 0;
    var ctr = p.createTextRange();
    if (callback && typeof(callback) == "function")
        _pos = callback(ctr);
    ctr.moveStart("character", typeof(_pos) == "number" ? _pos : 0);
    ctr.collapse(true);
    ctr.select();
    return ctr;
}

/* 日期对象格式化函数。类似于java中的SimpleDateFormat.format().
 * 格式化字符所代表的意义参见下表:
 * 
 * 字段          | 完整格式　　         | 简短格式
 * -------------+--------------------+-----------------------
 * Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
 * Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
 *              | NNN (abbr.)        |
 * Day of Month | dd (2 digits)      | d (1 or 2 digits)
 * Day of Week  | EE (name)          | E (abbr)
 * Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
 * Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
 * Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
 * Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
 * Minute       | mm (2 digits)      | m (1 or 2 digits)
 * Second       | ss (2 digits)      | s (1 or 2 digits)
 * AM/PM        | a                  |
 *
 * 注意，MM与mm代表不同的意义! MM代表月, mm代表分钟
 * 示例:
 *  "MMM d, y" matches: 一月 01, 2000
 *                      十二月 1, 1900
 *                      十一月 20, 00
 *  "M/d/yy"   matches: 01/20/00
                      9/2/00
 *  "MMM dd, yyyy hh:mm:ssa" matches: "一月 01, 2000 12:30:45AM"
 */
var MONTH_NAMES = new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
    '九月', '十月', '十一月', '十二', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '日',
    '一', '二', '三', '四', '五', '六');
function formatDate(date, format){
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var y = date.getYear() + "";
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var E = date.getDay();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    var value = new Object();
    if (y.length < 4) {
        y = "" + (y - 0 + 1900);
    }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H == 0) {
        value["h"] = 12;
    } else if (H > 12) {
        value["h"] = H - 12;
    } else {
        value["h"] = H;
    }
    value["hh"] = LZ(value["h"]);
    if (H > 11) {
        value["K"] = H - 12;
    } else {
        value["K"] = H;
    }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) {
        value["a"] = "PM";
    } else {
        value["a"] = "AM";
    }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
            result = result + value[token];
        } else {
            result = result + token;
        }
    }
    return result;
}
function LZ(x){
    return (x < 0 || x > 9 ? "" : "0") + x
}

function getUniqueHtmlId(classnm, prefix){
    var idindex = top["getUniqueHtmlId_" + classnm];
    if (typeof(idindex) == "undefined") {
        idindex = 1;
    } else {
        idindex++;
    }
    top["getUniqueHtmlId_" + classnm] = idindex;
    if (prefix) {
        return prefix + idindex;
    } else {
        return idindex;
    }
}

/**
 * QueryString对象，将url中p1=v1&p2=v2格式的参数进行解析。
 * @param qs url中?号后面开始的p1=v1&p2=v2格式的查询字串。(可选，如果没有则自动取当前页面中的url).
 */
function QueryString(qs){
    this.params = {};

    if (qs == null)
        qs = location.search.substring(1, location.search.length)

    if (qs.length == 0)
        return;
    // 初始化，将参数解析后放入数组。
    qs = qs.replace(/\+/g, ' ');
    var args = qs.split('&');
    for (var i = 0; i < args.length; i++) {
        var value;
        var pair = args[i].split('=')
        var name = unescape(pair[0])

        if (pair.length == 2)
            value = unescape(pair[1])
        else
            value = name

        this.params[name] = value
    }
}

QueryString.prototype.get = function(key, default_){
    if (default_ == null)
        default_ = null;
    var value = this.params[key]
    if (value == null)
        value = default_;
    return value
}

function StringBuffer(value){
    this._buffer = [];
    this.append(value);
}
;

StringBuffer.prototype = {
    append : function(value){
        if (value)
            this._buffer.push(value);
    },
    toString : function(){
        return this._buffer.join("");
    },
    clear : function(){
        this._buffer.length = 0;
    },
    length : function(){
        return this._buffer.length;
    },
    insert : function(index, value){
        var len = this.length();
        if (index > len || len < index)
            return false;
        this._buffer = this._buffer.slice(0, index).concat([value])
                .concat(this._buffer.slice(index))
        return true;
    },
    reverse : function(){
        this._buffer.reverse();
    }
};

/*输入框验证*/
var InputValidate = {};
InputValidate._initObject = function(dom, func){
    if (typeof(dom) == "string" && dom.length > 0)
        dom = document.getElementById(dom);
    if (typeof(dom) == "object" && dom.tagName && dom.tagName == "INPUT") {
        dom.onkeydown = function(e){
            if (!e)
                e = window.event;
            if (typeof(func) == "function")
                return func(e);
        };
        dom.oncontextmenu = function(){
            return false;
        };
    }
};
/**只能输入数值的输入框
 * @param dom object or string 输入框对象
 */
InputValidate.Number = function(dom){
    InputValidate._initObject(dom, function(e){
            if ((e.ctrlKey && e.keyCode == 86)
                    || (e.keyCode > 57 && e.keyCode > 48))
                return false;
        });
};
/**只能输入英文的输入框
 * @param dom object or string 输入框对象
 */
InputValidate.English = function(dom){
    InputValidate._initObject(dom, function(e){
            if (e.keyCode > 128)
                return false;
        });
};
/**只能输入中文的输入框
 * @param dom object or string 输入框对象
 */
InputValidate.Chinese = function(dom){
    InputValidate._initObject(dom, function(e){
            if (e.keyCode > 32 && e.keyCode < 128)
                return false;
        });
};
InputValidate.Replace = function(dom, reg, s){
    if (typeof(dom) == "string" && dom.length > 0)
        dom = document.getElementById(dom);
    if (typeof(dom) == "object" && dom.tagName && dom.tagName == "INPUT") {
        if (typeof(reg) != "object" && typeof(reg) != "function")
            reg = /[^A-Z^a-z^0-9^\-^\_^\.]/g;
        if (dom.value != null && dom.value.length > 0)
            dom.value = dom.value.replace(reg, s ? s : "");
    }
};
InputValidate.test = function(dom, reg){
    if (typeof(dom) == "string" && dom.length > 0)
        dom = document.getElementById(dom);
    if (typeof(dom) == "object" && dom.tagName && dom.tagName == "INPUT") {
        if (typeof(reg) != "object" && typeof(reg) != "function")
            reg = /[^A-Z^a-z^0-9^\-^\_^\.]/g;
        return reg.test(dom.value);
    }
};

/*
将对象p里的innerHTML设为editdom的值
*/
function InnerHTML2Edit(p, editdom){
    if (typeof(p) == "string" && p.length > 0)
        p = document.getElementById(p);
    if (typeof(editdom) == "string" && editdom.length > 0)
        editdom = document.getElementById(editdom);
    if (typeof(editdom) == "object" && editdom.tagName
            && editdom.tagName == "INPUT" && typeof(p) == "object") {
        editdom.value = p.innerHTML;
    }
}