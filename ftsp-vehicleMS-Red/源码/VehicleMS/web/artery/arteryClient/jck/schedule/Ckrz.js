// **********************************************//
// 查看日志 客户端脚本
// 
// @author Artery
// @date 2010-10-09
// @id 03e6a6c5b7de2053dc5e4e72f80641aa
// **********************************************//

/**
 * 分页查询脚本(rightpagingbar)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function rightpagingbar_onSearch (params){
	Artery.get('logListArea').reload({params:params});
}

		
/**
 * onClickClient(cancel_simpleButton)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancel_simpleButton_onClickClient (rc){
	Artery.getWin().close();	
}
/**
 * onClickClient(refresh_button)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function refresh_button_onClickClient (rc){
	Artery.get('logListArea').reload({
		params: {start:0,limit:20}
	});
}
/**
 * onClickClient(clear_button)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {req.cid}
 */
function clear_button_onClickClient (rc, cid){
	Artery.confirmMsg("确定删除","确定要删除所有日志?" ,function(btn){
		if(btn=="yes"){
			rc.put("cid",cid);
			rc.send(function(result){
				if(result=="YES"){
					Artery.getWin().showTip("删除成功！");
					Artery.get('logListArea').reload();
				}else{
					Artery.showTipError("删除失败！");
				}
			});
		}
	});
}