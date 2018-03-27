// **********************************************//
// 导入权限 客户端脚本
// 
// @author Artery.hanf
// @date 2010-08-26
// @id bda4ff88cfbfe3ebe25ce4540bc2bf63
// **********************************************//

/**
 * 客户端(importRightBtn, 导入权限按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function importRightBtn_onClickClient (rc){
	Artery.get("formArea1ddde").submit(function(result){
		if(result == "ok"){
			Artery.getWin().showTip("导入成功！", "formbd24a");
			Artery.getWin().get("rightList").reload();
			Artery.getWin().close();
		}else{
			if(result == "null"){
				Artery.showTipError("导入失败！上传文件为空！", "form5e500");
			}else {
				Artery.showTipError("导入失败！" + result, "form5e500");
			}
		}
	});
}

/**
 * 客户端(closeBtn, 关闭按钮)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function closeBtn_onClickClient (rc){
	Artery.getWin().close();
}
/**
 * 验证脚本(faBinary8e690)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  value 控件的值
 */
function faBinary8e690_onValidClient (rc, value){
	var strRegex = "(.zip)$"; //用于验证图片扩展名的正则表达式
    var re=new RegExp(strRegex);
	if (re.test(value.toLowerCase())){
    	return true;
    }
    else{
        return "上传的文件必须为zip格式！";
    }
}
  	