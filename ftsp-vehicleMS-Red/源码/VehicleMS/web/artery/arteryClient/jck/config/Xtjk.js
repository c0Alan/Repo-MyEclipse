// **********************************************//
// 系统监控 客户端脚本
// 
// @author Artery
// @date 2011-01-14
// @id bce9c516221612736a17de83fbfecc34
// **********************************************//
/**
 * 加载时脚本(listAreadfa1f)
 * 
 * @param  store 数据存储对象
 * @param  records 加载回来的数据
 * @param  options 加载参数配置
 */
function listAreadfa1f_onLoad(store, records, options) {
	initDataStore();
}
// 初始化数据源
function initDataStore() {
	dataStore = new Ext.data.JsonStore(
			{
				url : sys.getContextPath() + '/artery/monitor.do?action=loadRecordList',
				root : 'rows',
				totalProperty : "totalCount",
				fields : [ {
					name : 'id',
					mapping : 'id'
				}, {
					name : 'formName',
					mapping : 'formName'
				}, {
					name : 'start',
					mapping : 'start'
				}, {
					name : 'end',
					mapping : 'end'
				}, {
					name : 'cost',
					mapping : 'cost'
				}, {
					name : 'detailNumber',
					mapping : 'detailNumber'
				} ]
			});
	dataStore.on("load", afterRecordLoad);
}

/**
 * 列表加载完后执行一些操作
 */
function afterRecordLoad(st, res) {
	var avgTime = st.reader.jsonData.avgTime;
	document.getElementById("avgTime").innerHTML = avgTime + "ms";
}


/**
 * onClickDoubleClient(listAreadfa1f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listAreadfa1f_onClickDoubleClient (rc){
		var json=Artery.get("listAreadfa1f").getSelectedRowValue();
	var record=eval("(" + json + ")"); 
	Artery.openForm({
		"formId" : "2f4771cd032b2f267c95f51fb4c64649",
		"formName" : "监控详情",
		"formType" : "1",//1表单，2报表，3文书
		"title" : "监控详情",
		"params" : {
			"recordID" : record.id
		},
		"runTimeType" : "display",
		"target" : "_self"
		
	});
}