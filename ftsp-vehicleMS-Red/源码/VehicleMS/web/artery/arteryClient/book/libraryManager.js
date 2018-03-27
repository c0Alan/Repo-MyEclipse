/**
 * 客户端(oper_delete)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function oper_delete_onClickClient (rc, libid){
	Artery.confirmMsg('删除',"此操作不可恢复，确定要删除吗？",function(btn){ 
 		if(btn == 'yes'){
   			rc.put("cid",libid);
   			rc.send(function(result){ 
     			Artery.get("libraryList").reload(); 
   			});
 		}
	});
}

/**
 * 客户端(invalidOper)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function invalidOper_onClickClient (rc, libid){
	rc.put("cid",libid); 
	rc.send(function(result){
  		Artery.get("libraryList").reload(); 
	});
}

/**
 * 客户端(validOper)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function validOper_onClickClient (rc, libid){
	rc.put("cid",libid); 
	rc.send(function(result){ 
 		Artery.get("libraryList").reload(); 
	});
}