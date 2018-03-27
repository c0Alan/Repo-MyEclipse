// **********************************************//
// 表个性化维护 客户端脚本
// 
// @author Artery
// @date 2010-10-08
// @id 3841caaebeabf9c8b87f91c4a3e3770b
// **********************************************//

/**
 * 清空字段的个性化配置
 * onClickClient(oper_clear)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.fieldName}
 */
function oper_clear_onClickClient (rc, fieldName){
	var msg = "您确认清除"+fieldName+"上的配置吗？"
	Artery.confirmMsg("确认窗口",msg,function(btn){
		if(btn=="yes"){
			rc.put("groupId",Artery.params.groupId);
			rc.put("tableId",Artery.params.tableId);
			rc.put("fieldName",fieldName);
			rc.send(function(res){
				if(res=="ok"){
					Artery.get("listArea_field").reload();
				}
			});
		}
	});
}