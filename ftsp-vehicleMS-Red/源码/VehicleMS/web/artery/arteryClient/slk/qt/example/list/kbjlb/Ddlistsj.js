// example-list-可编辑列表-editlist
/**
 * 客户端(tbButton_save)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_save_onClickClient (rc){
	Artery.get("bookList").submit(function(result){
		if(result.success){
			Artery.showMessage("保存成功，请继续");
		}
	});
}

/**
 * 客户端(tbButton_insert)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_insert_onClickClient (rc){
	//默认参数
	//Artery.get("bookList").insertRecord();
	//数组参数
	//Artery.get("bookList").insertRecord([{
	//	lstCNAME:"新建数据",
	//	booktype:{
	//		value:"1",
	//		valueText:"科技"
	//	}
	//},{
	//	lstCNAME:"新建数据1"
	//}]);
	Artery.get("bookList").insertRecord({
		lstCNAME:"新建数据",
		booktype:{
			value:"1",
			valueText:"科技"
		}
	});
}

/**
 * 客户端(tbButton_delete)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_delete_onClickClient (rc){
	Artery.get("bookList").deleteRecord();
}

/**
 * 客户端(tbButton_getValues)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_getValues_onClickClient (rc){
	var values = Artery.get("bookList").getValues("lstCNAME");
	var valuesQuote = Artery.get("bookList").getValuesQuote("lstCNAME");
	Artery.showMessage("getValues方法：<br>" + values + "<br><br>" + "getValuesQuote方法：<br>" +valuesQuote);
}

/**
 * 客户端(tbButton_getKey)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_getKey_onClickClient (rc){
	var values = Artery.get("bookList").getValues("lstCID");
	var valuesQuote = Artery.get("bookList").getValuesQuote("lstCID");
	Artery.showMessage("getValues方法：<br>" + values + "<br><br>" + "getValuesQuote方法：<br>" +valuesQuote);
}

/**
 * 客户端(tbButton_cellValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_cellValue_onClickClient (rc){
	var value = Artery.get("bookList").getSelectedCellValue();
	Artery.showMessage(value);
}

/**
 * 客户端(tbButton_rowValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_rowValue_onClickClient (rc){
	//得到json对象
	//var json = Artery.get("bookList").getSelectedRowJson();
	//得到字符串
	var value = Artery.get("bookList").getSelectedRowValue();
	Artery.showMessage(value);
}

/**
 * 客户端(tbButton_checkbox)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_checkbox_onClickClient (rc){
	var values = Artery.get("bookList").getValues("checkboxCol");
	var valuesQuote = Artery.get("bookList").getValuesQuote("checkboxCol");
	Artery.showMessage("getValues方法：<br>" + values + "<br><br>" + "getValuesQuote方法：<br>" +valuesQuote);
}

/**
 * 客户端(tbButton_checkRowValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_checkRowValue_onClickClient (rc){
	//得到json对象:[{key1:value1},{key1:value2}]
	//var json = Artery.get("bookList").getCheckedRowJson("checkboxCol");
	// 当column的"内容是否编码"为true时,此方法不能正确获得值 weijx 2010-5-18
	var values = Artery.get("bookList").getCheckedRowValue("checkboxCol");
	Artery.showMessage(values);
}

/**
 * 客户端(tbButton_allValues)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton_allValues_onClickClient (rc){
	//得到json对象:[{key1:value1},{key1:value2}]
	//var json = Artery.get("bookList").getAllValuesJson();
	var values = Artery.get("bookList").getAllValues();
	Artery.showMessage(values);
}

/**
 * 客户端(checkboxCol)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function checkboxCol_onClickClient (rc){
	var bookName = Artery.get("bookList").getValue("lstCNAME");
	var bookId = Artery.get("bookList").getValue("checkboxCol");
	Artery.showMessage("本单元格的值：<br>" + bookId + "<br><br>图书名称：<br>"+bookName);
}

/**
 * 客户端(colOperText_name)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function colOperText_name_onClickClient (rc){
	var bookName = Artery.get("bookList").getValue("lstCNAME");
	Artery.showMessage(bookName);
}

/**
 * 客户端(colOperText_rowValue)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function colOperText_rowValue_onClickClient (rc){
	//var rowJson = Artery.get("bookList").getRowJson();
	var rowValues = Artery.get("bookList").getRowValue();
	Artery.showMessage(rowValues);
}