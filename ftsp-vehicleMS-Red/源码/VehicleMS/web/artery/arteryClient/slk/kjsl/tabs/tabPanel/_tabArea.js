// **********************************************//
// _tabArea 客户端脚本
// 
// @author Artery
// @date 2011-09-21
// @id 93b6a28fcaedb39ef0a01a452d161fd9
// **********************************************//
/**
 * onClickClient(tbAddNew)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbAddNew_onClickClient (rc){
	Artery.get("tabArea8cde5").addLinkto({
	  formId : "b45a1943d2dee7a1c3b09e4c45e56933",//链接到的表单的id
	  target: "_blank",
	  formType : "1",
	  runTimeType : "insert",
	  title : "测试title",
	  titleEscape : true,//设置true时会对title进行html转码，即“”转   为“>”，默认为false
	  params:{
	    p1 : "corp",
	    p2 : "2009"
	  },
	  tabWidth:100,//设置页签的宽度
	  onActive: function(){
	    // 在页签激活时，刷新本页面的列表控件
	  	var message = "这个页签激活了....";
	    Artery.showMessage(message);
	  }
	}, true);
}
/**
 * onClickClient(tbRemoveActiveTab)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbRemoveActiveTab_onClickClient (rc){
	var activeTab = Artery.get("tabArea8cde5").getActiveTab();
	Artery.get("tabArea8cde5").remove(activeTab.id);	
}