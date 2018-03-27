// 判断字符串是否为空
String.prototype.isEmpty = function(){
    return ((this.replace(/ /g, "").length == 0) ? true : false);
};
// 判断是否是合法的浮点形
String.prototype.isFloat = function(){
    if (this.isEmpty()) {
        return true;
    }
    var arr = this.match(/^\d+(\.\d*)?$/);
    return arr != null;
};
// 判断是否是合法的整形数
String.prototype.isInt = function(){
    if (this.isEmpty()) {
        return true;
    }
    var arr = this.match(/^-?\d+$/);
    return arr != null;
};
// 用正则表达式将前空格用空字符串替代。
String.prototype.LTrim = function(){
    return this.replace(/(^\s*)/g, "");
};
// 用正则表达式将后空格用空字符串替代。
String.prototype.RTrim = function(){
    return this.replace(/(\s*$)/g, "");
};
// 用正则表达式将前后空格用空字符串替代。
String.prototype.LRTrim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
// 用正则表达式将所有空格用空字符串替代。
String.prototype.ALLTrim = function(){
    return this.replace(/ /g, "");
};
// 判断字符串对象是否是合法的email
String.prototype.isEmail = function(){
    if (this.isEmpty()) {
        return true;
    }
    var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+[a-zA-Z0-9]{2,}$";
    var re = new RegExp(regu);
    return ((this.search(re) != -1) ? true : false);
};
// 判断是否是合法的ip地址
String.prototype.isIP = function(){
    var arr;
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (arr = re.exec(this)) {
        for (var i = 1; i < arr.length; i = i + 1) {
            if (parseInt(arr[i]) > 255) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
// 判断是否是合法的Time
String.prototype.isTime = function(){
    var arr;
    var re = /^(\d+):(\d+):(\d+)$/;
    if (arr = re.exec(this)) {
        if (parseInt(arr[1]) > 23) {
            return false;
        }
        for (var i = 2; i < arr.length; i = i + 1) {
            if (parseInt(arr[i]) > 59) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
// 判断是否包含中文
String.prototype.inGBK = function(){
    return (/[\u4E00-\u9FA5]/.exec(this) ? true : false);
};
// 判断字符串对象是否是合法的用户登录标识，只包括0－9 a-z A-Z - . _
String.prototype.isBS = function(){
    var regu = "^[_.0-9a-zA-Z-]+$";
    var re = new RegExp(regu);
    return ((this.search(re) != -1) ? true : false);
};
// 判断字符串对象长度是否合适，目前只统计字符个数，不分中文英文
String.prototype.checkLength = function(min, max){
    return this.length >= min && this.length <= max;
};
function validateForm(){
    return t_validateForm();
}

/**
 * 将错误信息Div显示
 * 
 * @param t_err_div
 *            text 显示错误div的Id
 * @param t_errmess
 *            var 定义的js变量，其中涵盖了错误信息
 */
function t_displayError(t_err_div, t_errmess){
    var errDiv = document.getElementById(t_err_div);
    errDiv.innerHTML = t_errmess;
    errDiv.style.display = "";
}

function validateTime(sField){
    return (document.getElementById(sField)).value.isTime();
}

function validateIP(sField){
    return (document.getElementById(sField)).value.isIP();
}

/**
 * 检验是否含有GBK
 */
function validateInGBK(sField){
    return (document.getElementById(sField)).value.isIP();
}

function validateInteger(sField){
    return (document.getElementById(sField)).value.isInt();
}

function validateFloat(sField){
    return (document.getElementById(sField)).value.isFloat();
}

/**
 * 如果为空，验证不通过，返回false
 */
function require(sField){
    var fields = document.getElementsByName(sField);
    if (fields.length == 0) {
        // 兼容
        fields[0] = document.getElementById(sField);
    }
    var field = fields[0];
    if (!field) {
        return false;
    }
    if (field.tagName == "INPUT" || field.tagName == "SELECT") {
        if (field.type == "radio" || field.type == "checkbox") {
            for (var i = 0; i < fields.length; i = i + 1) {
                if (fields[i].checked) {
                    return true;
                }
            }
            return false;
        }
        return !(field.value.isEmpty());
    } else if (field.tagName == "TEXTAREA") {
        if (field.value) {
            return !(field.value.isEmpty());
        }
        return !(field.innerHTML.isEmpty());
    }
    // 异常
    return false;
}

/**
 * 如果为空，验证不通过，返回false
 */
function maxLength(sField, max){
    return validateLength(sField, 0, max);
}

/**
 * 检查字符串是否符合邮件地址格式
 * 
 * @param sValue
 *            String 邮件地址字符串
 * @return boolean true: 符合; false: 不符合
 */
function validateEmail(sField){
    return (document.getElementById(sField)).value.isEmail();
}

/**
 * 检查字符串长度是否符合
 * 
 * @param SField
 *            String 验证的field名
 * @min int 字符串最小长度
 * @max int 字符串最大长度
 * @return boolean true: 符合; false: 不符合
 */
function validateLength(sField, min, max){
    var fieldElement = document.getElementById(sField);
    if (fieldElement.tagName == "TEXTAREA") {
        return fieldElement.innerHTML.checkLength(min, max);
    }
    return fieldElement.value.checkLength(min, max);
}

/**
 * 检查域为整形，并且不为空
 * 
 * @param {Object}
 *            sField
 */
function validateIntegerAndRequire(sField){
    return require(sField) && validateInteger(sField);
}

/**
 * 检查域值小于指定长度，并且不为空
 * 
 * @param {Object}
 *            sField
 */
function lenAndRequire(sField, max){
    return require(sField) && maxLength(sField, max);
}

/**
 * 检查域为浮点型，并且不为空
 * 
 * @param {Object}
 *            sField
 */
function validateFloatAndRequire(sField){
    return require(sField) && validateFloat(sField);
}

function jumpUrl(page, maxPage, realUrl, message){
    if (!page.isInt()) {
        window.alert(message);
        return false;
    } else {
        if (page > maxPage) {
            page = maxPage;
        } else {
            if (page < 1) {
                page = 1;
            }
        }
    }
    window.location = realUrl + page;
    return true;
}
