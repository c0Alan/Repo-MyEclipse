// example-other-activex示例

/**
 * 客户端(button_search)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button_search_onClickClient (rc){
	Artery.get("searchResult").search();
}