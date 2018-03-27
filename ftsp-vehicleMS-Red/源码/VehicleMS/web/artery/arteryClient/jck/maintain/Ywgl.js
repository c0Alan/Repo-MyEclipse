// **********************************************//
// 运维管理 客户端脚本
// 
// @author Artery
// @date 2010-10-26
// @id 7c0a7c5c70724b6d3863125d3352eeb5
// **********************************************//
/**
 * onClickClient(listItemd372e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemd372e_onClickClient (rc){
	//展示登录日志查询表单
    Artery.get("operArea").showForm({
	    formId : "4b85a9ede4fd7e4ac566cdba05d4be16",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{
	        color:"blue"
	    }
	});	    	
}
/**
 * onClickClient(listItemfa8be)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemfa8be_onClickClient (rc){
	//展示子系统访问日志查询表单
    Artery.get("operArea").showForm({
	    formId : "269bcbb33025fc897fff6e8193300648",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}
/**
 * onClickClient(listItemaea99)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemaea99_onClickClient (rc){
	//展示表单页面访问日志查询表单
    Artery.get("operArea").showForm({
	    formId : "bd3b24be7f37e697219c4a65506c5bd1",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}
/**
 * onClickClient(listItem08416)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem08416_onClickClient (rc){
	//展示后台维护操作日志查询表单
    Artery.get("operArea").showForm({
	    formId : "f4aabf56ab636d8710a0865c0d3ef66e",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}
/**
 * onClickClient(listItemba09e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemba09e_onClickClient (rc){
	//展示业务操作日志查询表单
    Artery.get("operArea").showForm({
	    formId : "167046baf5422a143a19191fffb690b5",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}
/**
 * onClickClient(listItem83100)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem83100_onClickClient (rc){
	//展示平台访问量统计报表
    Artery.get("operArea").showForm({
	    formId : "f3e687db730ecaeaf7afce723a67f101",
	    formType : Artery.REPORT,
	    runTimeType : "update",
	    params:{
	        statTitle:"平台访问量",
	        statType:"SysLoginLogStat",
	        xaxis:"year",
	        yaxis:"user"
	    }
	});	    
}
/**
 * onClickClient(listItemd38c3)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemd38c3_onClickClient (rc){
	//展示子系统访问量统计报表
    Artery.get("operArea").showForm({
	    formId : "f3e687db730ecaeaf7afce723a67f101",
	    formType : Artery.REPORT,
	    runTimeType : "insert",
	    params:{
	        statTitle:"子系统访问量",
	        statType:"SubsysLoginLogStat",
	        xaxis:"year",
	        yaxis:"user"
	    }
	});	    
}
/**
 * onClickClient(listItem70433)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem70433_onClickClient (rc){
	//展示表单页面访问量统计报表
    Artery.get("operArea").showForm({
	    formId : "f3e687db730ecaeaf7afce723a67f101",
	    formType : Artery.REPORT,
	    runTimeType : "insert",
	    params:{
	        statTitle:"表单页面访问量",
	        statType:"FormLoginLogStat",
	        xaxis:"year",
	        yaxis:"user"
	    }
	});	    
}
/**
 * onClickClient(listItemb0203)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemb0203_onClickClient (rc){
	//展示后台维护访问量统计报表
    Artery.get("operArea").showForm({
	    formId : "f3e687db730ecaeaf7afce723a67f101",
	    formType : Artery.REPORT,
	    runTimeType : "insert",
	    params:{
	        statTitle:"后台维护访问量",
	        statType:"MaintainLogStat",
	        xaxis:"year",
	        yaxis:"user"
	    }
	});	    
}
/**
 * onClickClient(listItem28568)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem28568_onClickClient (rc){
	//展示业务操作访问量统计报表
    Artery.get("operArea").showForm({
	    formId : "f3e687db730ecaeaf7afce723a67f101",
	    formType : Artery.REPORT,
	    runTimeType : "insert",
	    params:{
	        statTitle:"业务操作访问量",
	        statType:"BusinessLogStat",
	        xaxis:"year",
	        yaxis:"user"
	    }
	});	    
}
/**
 * onClickClient(listItem89550)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItem89550_onClickClient (rc){	
    //展示JVM使用情况展示表单
    Artery.get("operArea").showForm({
	    formId : "457b9d064eae00cf00807cfc6f717324",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}
/**
 * onClickClient(listItema25d1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItema25d1_onClickClient (rc){
    //展示JVM配置表单
    Artery.get("operArea").showForm({
	    formId : "adc3b73b212129d0aba40cadfef65990",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{}
	});	    
}