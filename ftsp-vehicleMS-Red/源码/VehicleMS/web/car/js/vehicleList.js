// **********************************************//
// 车辆信息管理 客户端脚本
// 
// @author liuwang
// @date 2017-06-07
// @id a9e1f91b625280460f42c22db5e3398c
// **********************************************//
/**
 * 查询
 * 
 * @param  rc 系统提供的AJAX调用对象
 * 
 * 获取查询框的数据传给服务端
 */
function Query_onClickClient (rc){
	var cCarNumber = Artery.get("CCarNo").getValue();
	var cCarType = Artery.get("CCarType").getValue();
	 Artery.get('listQuery').reload({
		    'params' : {
		      'cCarNumber' : cCarNumber,
		      'cCarType' : cCarType
		    }
		  });
}