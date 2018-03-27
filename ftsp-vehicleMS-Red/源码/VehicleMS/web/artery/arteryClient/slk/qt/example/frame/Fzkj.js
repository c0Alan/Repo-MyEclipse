// example-frame-复杂框架

/**
 * 点击节点脚本(dynamicNav)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function dynamicNav_onNodeClickClient (rc, node){
	alert(node.text);
}
    
/**
 * 客户端(snItem_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function snItem_1_onClickClient (rc){
	alert("您点击了节点："+this.text);
}
/**
 * 客户端(catalog_1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function catalog_1_onClickClient (rc){
	alert("您点击了目录："+this.text);
}