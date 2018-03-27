// example-list-可编辑列表-验证

/**
 * 客户端(lstCNAME)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function lstCNAME_onValidClient (rc){
	//此脚本如果返回字符串，则验证不会通过，字符串会做为错误信息提示出来，否则验证通过
	//value变量代表本组件的值
	//此脚本中得到list组件值的方法与list示例－可编辑列表－得到数据表单中的方法一致
	var list = Artery.get("bookList");//得到列表
	var value = this.getValue();
	if(value ==list.getValue("lstCAUTH")){//list.getValue("lstCAUTH")为得到本行的其它列的值
		return "图书名称不能等于作者名称";
	}
	//服务器验证
	rc.put("author", list.getValue("lstCAUTH"));
	rc.sync = false;
	rc.send();
	if(rc.result.errorText){
		return rc.result.errorText;
	}
}