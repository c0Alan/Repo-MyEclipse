// **********************************************//
// 业务操作日志查询 客户端脚本
// 
// @author Artery
// @date 2010-10-28
// @id 167046baf5422a143a19191fffb690b5
// **********************************************//
/**
 * onClickClient(tbButton36672)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton36672_onClickClient (rc){
    Artery.get("listArea").reload({
        params:{
            startDate:Artery.get("faStartDate").getValue(),
            endDate:Artery.get("faEndDate").getValue()
        }
    });	
}