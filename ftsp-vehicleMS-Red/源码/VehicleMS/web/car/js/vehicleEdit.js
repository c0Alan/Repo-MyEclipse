// **********************************************//
// addCar 客户端脚本
// 
// @author KB
// @date 2017-06-07
// @id 363de39363962babb069072edd7f40a2
// **********************************************//

/**
 * 返回
 */
function backBtn_reback (rc){
	Artery.getWin().close();
}

/**
 * 保存
 * 
 * @param rc
 */
function saveBtn_save (rc){
	Artery.get('vehicleInfoForm').submit(function(result){
		if(result.code==='10000'){
			Artery.showMessage(result.msg);
			Artery.getWin().get("listQuery").reload(); 
	    	Artery.getWin().close(); 
		}else{
			Artery.showError(result.msg);
		}
	});

}
