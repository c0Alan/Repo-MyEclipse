// **********************************************//
// 编辑字段 客户端脚本
// 
// @author Artery
// @date 2010-10-14
// @id 78b9c29f89be46de74019ebc74af188c
// **********************************************//

/**
 * onClickClient(button_save)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_save_onClickClient (rc){
	Artery.get("formArea_field").submit(function(res){
		if(res=="ok"){
			Artery.showMessage("保存成功");
		}
	});
}