// **********************************************//
// 后台维护操作日志查询 客户端脚本
// 
// @author Artery
// @date 2010-10-28
// @id f4aabf56ab636d8710a0865c0d3ef66e
// **********************************************//
/**
 * onClickClient(tbButtonef8b7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonef8b7_onClickClient (rc){
    Artery.get("listArea").reload({
        params:{
            startDate:Artery.get("faStartDate").getValue(),
            endDate:Artery.get("faEndDate").getValue()
        }
    });	
}