// example-frame-tabArea
    
/**
 * 客户端(tbButton_addTab)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_addTab_onClickClient (rc){
	var ta = Artery.get("tabArea1");
	ta.addLinkto({
		closable: true,
		title: "脚本添加",
		url: "http://www.baidu.com",
		onActive: function(){
			alert("abc");
		}
	},true);
}