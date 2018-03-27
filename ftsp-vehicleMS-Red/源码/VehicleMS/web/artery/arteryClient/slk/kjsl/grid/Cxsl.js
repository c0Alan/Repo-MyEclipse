// example-list-查询-查询示例

/**
 * 客户端(tbButton_search)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_search_onClickClient (rc){
	Artery.get("bookList").reload({
		params:{
			name:Artery.get("name").getValue(),
			author:Artery.get("author").getValue(),
			isbn:Artery.get("isbn").getValue(),
			publisher:Artery.get("publisher").getValue(),
			booktype:Artery.get("booktype").getValue(),
			library:Artery.get("library").getValue()
		}
	});
}
/**
 * 客户端(tbButton_name)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_name_onClickClient (rc){
	Artery.get("bookList").reload({
		params:{
			name:Artery.get("name").getValue()
  		},
		clearParam: true
	});
}
/**
 * 客户端(tbButton_auth)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_auth_onClickClient (rc){
	Artery.get("bookList").reload({
		params:{
			author:Artery.get("author").getValue()
		},
		clearParam: true
	});
}
/**
 * 客户端(tbButton_name1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_name1_onClickClient (rc){
	Artery.get("bookList").reload({
		params:{
			name:Artery.get("name").getValue()
		}
	});
}
/**
 * 客户端(tbButton_auth1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_auth1_onClickClient (rc){
	Artery.get("bookList").reload({
		params:{
			author:Artery.get("author").getValue()
		}
	});
}
/**
 * 回车时脚本(condForm)
 * 
 */
function condForm_onEnter (){
	Artery.get("tbButton_search").click();
}