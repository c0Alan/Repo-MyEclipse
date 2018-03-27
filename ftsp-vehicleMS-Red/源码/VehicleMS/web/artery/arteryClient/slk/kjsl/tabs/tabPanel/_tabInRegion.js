// **********************************************//
// _tabInRegion 客户端脚本
// 
// @author Artery
// @date 2011-09-27
// @id 1dcda79544f6bcf84a86d539b2638a43
// **********************************************//

/**
 * onClickClient(tbAddItem)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbAddItem_onClickClient(rc) {
  var ta = Artery.get("tabArea1")  
  ta.addLinkto({closable: true, title: "脚本添加", url: "http://www.baidu.com", iconId: "C9EEC094B7874F1198AA98599269010F"});
}
