// example-list-可编辑列表-联动

/**
 * 值改变时脚本(colNumber)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function colNumber_onChangeClient (rc, oldValue, newValue){
	var list = Artery.get("list");
	var sum = parseInt(newValue) * parseInt(list.getValue("colPrice"));
	Artery.get("list").setValue("colsum",sum);
}
  	
/**
 * 值改变时脚本(colPrice)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function colPrice_onChangeClient (rc, oldValue, newValue){
	var list = Artery.get("list");
	var sum = parseInt(newValue) * parseInt(list.getValue("colNumber"));
	Artery.get("list").setValue("colsum",sum);
}
  	