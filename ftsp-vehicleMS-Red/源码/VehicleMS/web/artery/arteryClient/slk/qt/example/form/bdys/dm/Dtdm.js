// 表单元素-代码-动态代码

/**
 * 值改变时脚本(corpFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function corpFld_onChangeClient (rc, oldValue, newValue){
	var deptFld = Artery.get("deptFld");
	deptFld.setValue(null);
	deptFld.reload({
		params: {
			corpid: newValue
		}
	});
}
  	
/**
 * 值改变时脚本(deptFld)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function deptFld_onChangeClient (rc, oldValue, newValue){
	var userFld = Artery.get("userFld");
	userFld.setValue(null);
	userFld.reload({
		params: {
			deptid: newValue
		}
	});
}
  	