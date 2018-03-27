// **********************************************//
// 登录日志查询 客户端脚本
// 
// @author Artery
// @date 2010-10-26
// @id 4b85a9ede4fd7e4ac566cdba05d4be16
// **********************************************//
/**
 * onClickClient(searchBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function searchBtn_onClickClient (rc){
    Artery.get("listArea").reload({
        params:{
            startDate:Artery.get("faStartDate").getValue(),
            endDate:Artery.get("faEndDate").getValue()
        }
    });	
}
