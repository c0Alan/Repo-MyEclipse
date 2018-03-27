// **********************************************//
// _faCode_onBeforeChangeEvent 客户端脚本
// 
// @author Artery
// @date 2011-09-29
// @id de518589b46fb6fb4601757571ce6926
// **********************************************//
/**
 * 值改变前脚本(faCode8598d) 如果返回false则不改变控件的值
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件要改变的新值
 * @param  newValueText 控件要改变的新值对应的文本
 */
function faCode8598d_onBeforeChangeClient (rc, oldValue, newValue, newValueText){
  var success;
  rc.sync = false;  // 同步执行调用
  rc.put("newValue", newValue);
  rc.send(function(result){
    success = result.success;
  });
  //如果服务器端方法result.success为true，则弹出提示；否则，不改变值
  if(success == true){
    //弹出确认对话框，用户选择“是”则改变值，否则，不做改变
    if(window.confirm("确定选择"+newValueText+"吗？")){
        return true;
    }else{
        return false;
    }
  }else{
    return false;
  }

}
  	