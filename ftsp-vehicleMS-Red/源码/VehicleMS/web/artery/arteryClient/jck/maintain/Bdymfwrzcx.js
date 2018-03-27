// **********************************************//
// 表单页面访问日志 客户端脚本
// 
// @author Artery
// @date 2010-10-26
// @id bd3b24be7f37e697219c4a65506c5bd1
// **********************************************//
/**
 * onClickClient(tbButtoned05f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtoned05f_onClickClient (rc){
    Artery.get("listArea").reload({
        params:{
            startDate:Artery.get("faStartDate").getValue(),
            endDate:Artery.get("faEndDate").getValue()
        }
    });		
}