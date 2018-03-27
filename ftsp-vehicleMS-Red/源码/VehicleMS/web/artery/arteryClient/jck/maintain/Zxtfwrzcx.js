// **********************************************//
// 子系统访问日志查询 客户端脚本
// 
// @author Artery
// @date 2010-10-26
// @id 269bcbb33025fc897fff6e8193300648
// **********************************************//
/**
 * onClickClient(tbButton69765)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton69765_onClickClient (rc){
    Artery.get("listArea").reload({
        params:{
            startDate:Artery.get("faStartDate").getValue(),
            endDate:Artery.get("faEndDate").getValue()
        }
    });		
}