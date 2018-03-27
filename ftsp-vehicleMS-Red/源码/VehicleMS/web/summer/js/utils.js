/**
 * Title: 普通工具方法JS文件
 * Copyright: Copyright (c) 2005
 * Company: 紫光华宇软件股份有限公司
 *
 * Description:
 *     本JS文件中包含了普通工具方法，包括：
 *          字符串工具方法；
 *          系统工具方法；
 *          窗口工具方法；
 *          Form工具方法；
 *          提示方法；
 *          日期工具；
 *          日历控件；
 *
 *     本文件由梁冬整理，其中的部分方法来源于张云飞、窦燕燕编写的相关JS方法。
 *
 * @author 梁冬、张云飞、窦燕燕
 * @version 1.1
 */

/******************************************************************************
 *                                                                            *
 *                       字符串工具方法                                         *
 *                                                                            *
 ******************************************************************************/

/**
 * 检查去掉空格后的字符串是否为空
 *
 * @param sValue String 需要检测的字符串
 *
 * @return boolean true: 为空; false: 不为空
 */
function isEmptyStrAfterTrim(sValue){
  return isEmptyStr(trim(sValue));
}

/**
 * 检查字符串是否为空
 *
 * @param sValue String 需要检测的字符串
 *
 * @return boolean true: 为空; false: 不为空
 */
function isEmptyStr(sValue){
  if (sValue == '' || sValue == null)
    return true;
  else
    return false;
}

/**
 * 检查字符串是否等于“真”（true）
 *
 * @param sValue String 需要检测的字符串
 *
 * @return boolean true: 等于真; false: 不等于真
 */
function isStrEqualTrue(objValue){
  if (objValue) {
    var sValue = objValue.toString().toLowerCase();

    if ((sValue == "1") || (sValue == "true") || (sValue == "yes"))
      return true;
  }

  return false;
}

/**
 * 用特定符号连接两个字符串， 如：
 *     mergeStr('a', 'b', ',') => 'a,b'
 *     mergeStr('a', null, ',') => 'a'
 *     mergeStr(null, 'b', ',') => 'b'
 *
 * @param sValue1 String 字符串1
 * @param sValue2 String 字符串2
 * @param sSymbol String 连接符号
 *
 * @return boolean true: 等于真; false: 不等于真
 */
function mergeStr(sValue1, sValue2, sSymbol){
  if (isEmptyStr(sValue1)) {
    return sValue2;
  } else if (isEmptyStr(sValue2)) {
    return sValue1;
  } else {
    return sValue1 + sSymbol + sValue2;
  }
}

/**
 * 得到指定字符串的字节数，其中一个汉字为2字节
 *
 * @param sValue String 需要检测的字符串
 *
 * @return int 字符串的字节数
 */
function getStrByteLen(sValue){
  var i;
  var cLetter;
  var nLen = 0;

  for (i = 0; i < sValue.length; i++) {
    cLetter = sValue.charAt(i);

    if (cLetter.length == 1 && isUnicode(cLetter) == true)
      nLen = nLen + 2;
    else
      nLen++;
  }

  return nLen;
}

/**
 * 判断指定字符是否是Unicode字符
 *
 * @param cValue String 需要检测的字符
 *
 * @return boolean true：是；false：否
 */
function isUnicode(cValue){
  var cValue;
  cValue = escape(cValue);

  if (cValue.charAt(0) == '%' && cValue.charAt(1) == 'u')
    return true;
  else
    return false;
}

/**
 * 去掉字符串前后的空格
 *
 * @param sValue String 需要处理的字符串
 *
 * @return String 去掉空格的字符串
 */
function trim(sValue){
  if (isEmptyStr(sValue))
    return sValue;

  return sValue.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * 得到一串参数中，某个指定参数的值
 * 例如："par1=value1;par2=value2;par3=value3;"
 *
 * @param sValue String 参数串
 * @param sParName String 参数名
 * @param sSeperator String 分隔符
 *
 * @return String 参数值
 */
function parseParValue(sValue, sParName, sSeperator){
  if (isEmptyStrAfterTrim(sValue))
    return null;

  var sPattern = sParName + "=([\\w.]+)(" + sSeperator + "|$)";

  var rePattern = new RegExp(sPattern);

  var asMatched = rePattern.exec(sValue);

  if (asMatched != null)
    return asMatched[1];
  else
    return null;
}

/******************************************************************************
 *                                                                            *
 *                          系统工具方法                                        *
 *                                                                            *
 ******************************************************************************/

/**
 * 得到浏览器的版本
 *
 * @return float 浏览器的版本
 */
function getBrowserVersion(){
  var appVer = navigator.appVersion;
  var varMS = appVer.indexOf("MSIE");
  var varVerEnd = appVer.indexOf(";", varMS);
  var varMSVER = parseFloat(appVer.substring(varMS + 5, varVerEnd));

  return varMSVER;
}

/******************************************************************************
 *                                                                            *
 *                          窗口工具方法                                        *
 *                                                                            *
 ******************************************************************************/

/**
 * 设置当前窗口为Top窗口
 */
function setWindow2Top(){
  if (self != top) {
    window.top.location.href = window.location.href;
  }
}

var WIN_WIDTH = screen.availWidth - 200;

/**
 * 打开指定样式的新窗口
 *
 * @param sURL String 窗口地址
 * @param sWinName String 窗口名称
 * @param sStyle String 窗口样式
 */
function openWindow(sURL, sWinName, sStyle){
  window.open(sURL, sWinName, sStyle);
}

/**
 * 打开指定长度和宽度的新窗口
 *
 * @param sURL String 窗口地址
 * @param sWinName String 窗口名称
 * @param sStyle String 窗口样式
 */
function openSizedWindow(sURL, sWinName, sWidth, sHeight){
  if (!sWidth)
    sWidth = WIN_WIDTH;

  window.open(sUrl, sWinName,
    "scrollbars=yes,resizable=yes,status=no,titlebar=no,left=0,top=0,width="
        + sWidth + ",height=" + sHeight + ",toolbar=no");
}

/**
 * 按照指定属性，隐藏/显示一个对象
 *
 * @param objItem Object 需要处理的对象
 * @param bShown boolean 是否显示
 *
 * @return Field 需要查找的Field
 */
function display(objItem, bShown){
  if (bShown)
    objItem.style.display = "";
  else
    objItem.style.display = "none";
}

/**
 * 切换对象“隐藏/显示”属性
 *
 * @param objItem Object 需要处理的对象
 *
 * @return Field 需要查找的Field
 */
function toggleDisplayMode(objItem){
  if (objItem.style.display == "none") {
    objItem.style.display = "";
  } else {
    objItem.style.display = "none";
  }
}

/**
 * 切换记录“隐藏/显示”属性，通常用于子表记录的隐藏/显示
 *
 * @param sPreName String 记录对象前缀名
 * @param nShownRec Integer 显示记录数
 * @param nMaxRec Integer 记录总数（＝显示记录数＋隐藏纪录数）
 * @param bNext boolean 是否显示“更多”链接
 *
 * @return Field 需要查找的Field
 */
function toggleRecordDisplayMode(sPreName, nShownRec, nMaxRec, bNext){
  var objItem, objCurMaxNo;
  var bHide = false;

  objCurMaxNo = document.all(sPreName + "_CURMAXNO");

  if (bNext) {
    if (objCurMaxNo.value == -1) {
      if (nShownRec < nMaxRec) {
        objCurMaxNo.value = parseInt(nShownRec);
        bHide = true;
      }
    } else {
      if (parseInt(objCurMaxNo.value) + 1 < nMaxRec) {
        objCurMaxNo.value = parseInt(objCurMaxNo.value) + 1;
        bHide = true;
      }
    }
  } else // bPrev
  {
    if (objCurMaxNo.value >= nShownRec)
      bHide = true;
  }

  if (bHide) {
    objItem = document.all(sPreName + "_" + objCurMaxNo.value);

    if (objItem.style.display == "none") {
      objItem.style.display = "";
    } else {
      objItem.style.display = "none";
    }
  }

  if (!bNext && bHide)
    objCurMaxNo.value = parseInt(objCurMaxNo.value) - 1;
}

/******************************************************************************
 *                                                                            *
 *                          Form工具方法                                       *
 *                                                                            *
 ******************************************************************************/

/**
 * 得到某个Field的名字
 *
 * @param fieldItem Field 待处理Field
 *
 * @return String 字段名字
 */
function getFieldName(fieldItem){
  if (fieldItem.name != undefined)
    return fieldItem.name;
  else if (fieldItem.length != undefined) {
    if (fieldItem.length > 1)
      return fieldItem[0].name;
  }

  return null;
}

/**
 * 判断某个Field是否为空
 *
 * @param fieldItem Field 待判断Field
 *
 * @return boolean true：空；false：不空
 */
function isEmptyField(fieldItem){
  if (fieldItem == null)
    return true;

  if (fieldItem.value != undefined) {
    if (!isEmptyStrAfterTrim(fieldItem.value)) {
      if (fieldItem.type == "checkbox" || fieldItem.type == "radio") {
        if (fieldItem.checked)
          return false;
      } else
        return false;
    }
  } else {
    if (fieldItem.length != undefined) {
      if (fieldItem.length == 1) {
        if (fieldItem.type == "checkbox" || fieldItem.type == "radio") {
          if (fieldItem.checked)
            return false;
        }
      } else {
        for (i = 0; i < fieldItem.length; i++) {
          if (fieldItem[i].type != undefined) {
            if (fieldItem[i].type == "checkbox" || fieldItem[i].type == "radio") {
              if (fieldItem[i].checked)
                return false;
            } else {
              if (!isEmptyStrAfterTrim(fieldItem[i].value))
                return false;
            }
          }
        }
      }
    }
  }

  return true;
}

/**
 * 将焦点转移到某个Field
 *
 * @param fieldItem Field 焦点转移到的Field
 */
function focusField(fieldItem){
  if (fieldItem != null) {
    if (fieldItem.type != undefined) {
      if (fieldItem.type != "hidden" && fieldItem.style.display != "none") {
        fieldItem.focus();
      }
    } else if (fieldItem.length != undefined) {
      if (fieldItem.length > 1) {
        if (fieldItem[0].type != "hidden"
            && fieldItem[0].style.display != "none") {
          fieldItem[0].focus();
        }
      }
    }
  }
}

/**
 * 校验某个Field是否有值被选中
 *
 * @param formItem Form 需要校验Field所在的Form
 * @param sFieldName String 需要校验Field的名字
 *
 * @return boolean true：有值被选中；false：无值被选中
 */
function haveChecked(formItem, sFieldName){
  var afieldItem = formItem(sFieldName);

  if (afieldItem != null) {
    if (afieldItem.length > 1) {
      for (var i = 0; i < afieldItem.length; i++) {
        var fieldItem = afieldItem[i];

        if (fieldItem.checked)
          return true;
      }
    } else {
      return afieldItem.checked;
    }
  }

  return false;

  /*
     for( var i=0; i<formItem.elements.length; i++ )
     {
       var fieldItem = formItem.elements[i];

       if( fieldItem.name == sFieldName )
       {
         if( fieldItem.checked )
           return true;
       }
     }

     return false;
  */
}

/**
 * 参照某个Field的checked状态，设置指定名称的全部Field的checked属性
 *
 * @param formItem Form 需要设置的Field所在的Form
 * @param sFieldName String 需要设置的Field名字
 * @param fieldCheckAll Field 被参照的Field
 */
function checkAll(formItem, sFieldName, fieldCheckAll){
  var afieldItem = formItem(sFieldName);

  if (afieldItem != null) {
    if (afieldItem.length > 1) {
      for (var i = 0; i < afieldItem.length; i++) {
        var fieldItem = afieldItem[i];

        fieldItem.checked = fieldCheckAll.checked;
      }
    } else {
      afieldItem.checked = fieldCheckAll;
    }
  }

  return false;

  /*
     for( var i=0; i<formItem.elements.length; i++ )
     {
       var fieldItem = formItem.elements[i];

       if( fieldItem.name == sFieldName )
       {
         fieldItem.checked = fieldCheckAll.checked;
       }
     }
  */
}

/**
 * 将符合某个值的Radio设置成选中状态
 *
 * @param formItem Form 需要设置的Field所在的Form
 * @param sFieldName String 需要设置的Field名字
 * @param sValue String 选中值
 */
function checkRadio(formItem, sFieldName, sValue){
  var afieldItem = formItem(sFieldName);

  if (afieldItem != null) {
    if (afieldItem.length > 1) {
      for (var i = 0; i < afieldItem.length; i++) {
        var fieldItem = afieldItem[i];

        if (fieldItem.value == sValue)
          fieldItem.checked = true;
      }
    } else {
      if (afieldItem.value == sValue)
        afieldItem.checked = true;
    }
  }
}

/**
 * 预先装入图像
 *
 * @param sImgName String 图像Field名
 * @param sImgSrc String 图像路径
 */
function preloadImage(sImgName, sImgSrc){
  eval(sImgeName + '=new Image()');
  eval(sImgName + '.src="' + sImgSrc + '"');
}

/**
 * 将源选择框的选中选项转移到目标选择框
 *
 * @param cmbSrc Combox 源选择框
 * @param cmbDest Combox 目标选择框
 */
function moveOption(cmbSrc, cmbDest){
  var aiRemoveOpNo = new Array();
  var nOption = 0;

  for (i = 0; i < cmbSrc.length; i++) {
    option = cmbSrc.options(i);

    if (option.selected == true) {
      var optionNew = document.createElement("OPTION");

      optionNew.text = option.text;
      optionNew.value = option.value;
      cmbDest.options.add(optionNew);

      cmbSrc.options.remove(i);
      i = i - 1;

      /*
            aiRemoveOpNo[nOption] = i;
            nOption = nOption + 1;
      */
    }
  }
  /*
    var iDelta = 0;
    for( i = 0; i < nOption; i++ )
    {
      cmbSrc.options.remove(aiRemoveOpNo[i] - iDelta);

      iDelta = iDelta + 1;
    }
  */
}

/**
 * 刷新页面，并且修改名称为“refresh”的刷新标志，用于刷新字段
 *
 * @param formItem Form 刷新字段所在的Form名称
 * @param sFieldName String 刷新字段名称
 * @param bCanNull boolean 是否刷新字段可空
 */
function refreshPage4Field(formItem, sFieldName, bCanNull){
  if (!bCanNull) {
    var bIsNull = true;
    var fieldItem = formItem(sFieldName);

    if (isEmptyField(fieldItem)) {
      alert("请输入内容后再刷新！");
      return false;
    }
  }

  var fieldRefresh = document.all("refresh");

  if (fieldRefresh != null)
    fieldRefresh.value = "true";

  formItem.submit();

  return true;
}

/**
 * 提交Form，并且根据标记判断字段是否为空
 *
 * @param fieldItem Field 刷新字段
 * @param bCanNull boolean 是否刷新字段可空
 */
function submitForm(fieldItem, bCanNull){
  if (!bCanNull) {
    var bIsNull = true;

    if (fieldItem != null) {
      if (fieldItem.value != null)
        bIsNull = false;
    }

    if (bIsNull) {
      alert("请输入内容后再刷新！");
      return false;
    }
  }

  var fieldRefresh = document.all("refresh");

  if (fieldRefresh != null)
    fieldRefresh.value = "true";

  fieldItem.form.submit();

  return true;
}

/**
 * 检查多个Field是否具有相同的值，空值不比较
 *
 * @param formItem Form 被检查字段所在的Form名称
 * @param asFieldName Array 被检查字段名称的数组
 */
function haveSameValue(formItem, asFieldName){
  var fieldItem, fieldTmp;

  if (asFieldName == null)
    return false;

  for (i = 1; i < asFieldName.length; i++) {
    fieldItem = formItem(asFieldName[i]);

    if (isEmptyStrAfterTrim(fieldItem.value))
      continue;

    for (j = i + 1; j <= asFieldName.length; j++) {
      fieldTmp = formItem(asFieldName[j]);

      if (isEmptyStrAfterTrim(fieldTmp.value))
        continue;

      if (fieldTmp.value == fieldItem.value)
        return true;
    }
  }

  return false;
}

/******************************************************************************
 *                                                                            *
 *                            提示方法                                         *
 *                                                                            *
 ******************************************************************************/

/**
 * 删除确认方法
 *
 * @return boolean true：确认；false：取消
 */
function deleteConfirm(){
  return confirm('确实要删除本条信息吗？删除后不能恢复！');
}

/**
 * 删除确认方法，确认后自动将窗口转移到新的地址
 *
 * @param sURL String 确认后要转移的地址
 */
function deleteConfirm12URL(sURL){
  if (confirm('确实要删除本条信息吗？删除后不能恢复！')) {
    window.location = sUrl;
  }
}

/**
 * 确认方法，确认后自动将窗口转移到新的地址
 *
 * @param sWarn String 确认后要转移的地址
 * @param sURL String 确认后要转移的地址
 */
function doConfirm2URL(sWarn, sUrl){
  if (window.confirm(sWarn)) {
    window.location = sUrl;
  }
}

/**
 * 确认方法，确认后弹出新窗口进行相关操作
 *
 * @param sWarn String 确认后要转移的地址
 * @param sURL String 确认后要转移的地址
 */
function doConfirm2NewWin(sWarn, sUrl, sWinName, sWidth, sHeight){
  if (window.confirm(sWarn)) {
    openWindow(sURL, sWinName, sWidth, sHeight);
  }
}

/**
 * 在界面上显示当前时间
 */
function showCurDateTime(){
  if (!document.layers && !document.all)
    return;

  var Digital = new Date();
  var hours = Digital.getHours();
  var minutes = Digital.getMinutes();
  var seconds = Digital.getSeconds();
  var dn = "上午";

  if (hours > 12) {
    dn = "下午";
  }

  if (hours == 0)
    hours = 12;

  if (minutes <= 9)
    minutes = "0" + minutes;

  if (seconds <= 9)
    seconds = "0" + seconds;

  // change font size here to your desire
  myclock = " " + hours + ":" + minutes + ":" + seconds;

  if (document.layers) {
    document.layers.liveclock.document.write(myclock)
    document.layers.liveclock.document.close()
  } else if (document.all)
    liveclock.innerHTML = myclock;

  setTimeout("showCurDateTime()", 1000);
}

/******************************************************************************
 *                                                                            *
 *                            日期工具                                         *
 *                                                                            *
 ******************************************************************************/

/**
 * 生成日期字符串
 *
 * @param sYear String 年份
 * @param sMonth String 月份
 * @param sDay String 日期
 */
function makeDateString(sYear, sMonth, sDay){
  return sYear + "-" + sMonth + "-" + sDay;
}

/**
 * 得到日期时间字符串中的年份
 *
 * @param sDate 日期字符串[yyyy-mm-dd]或者[yyyy-mm-dd hh:MM]
 *
 * @return int 日子
 */
function getYear(sValue){
  var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2})$/;

  var asMatched = sRE.exec(sValue);

  if (asMatched != null) {
    return parseInt(asMatched[1], 10);
  } else
    return -1;
}

/**
 * 得到日期时间字符串中的月份
 *
 * @param sDate 日期字符串[yyyy-mm-dd]或者[yyyy-mm-dd hh:MM]
 *
 * @return int 日子
 */
function getMonth(sValue){
  var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2})/;

  var asMatched = sRE.exec(sValue);

  if (asMatched != null) {
    return parseInt(asMatched[3], 10);
  } else
    return -1;
}

/**
 * 得到日期时间字符串中的日子
 *
 * @param sDate 日期字符串[yyyy-mm-dd]或者[yyyy-mm-dd hh:MM]
 *
 * @return int 日子
 */
function getDay(sValue){
  var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2})/;

  var asMatched = sRE.exec(sValue);

  if (asMatched != null) {
    return parseInt(asMatched[4], 10);
  } else
    return -1;
}
