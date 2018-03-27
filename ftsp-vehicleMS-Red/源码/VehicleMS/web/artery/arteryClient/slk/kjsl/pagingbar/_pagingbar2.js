// **********************************************//
// _pagingbar1 客户端脚本
// 
// @author Artery
// @date 2011-10-08
// @id 1792864cbdf74fc95b55e468b20821cd
// **********************************************//



		



		

/**
 * 分页查询脚本(pagingbar10f699)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar10f699_onSearch (params){
	Artery.get('listArea3').reload({params:params});
}

		

/**
 * 分页查询脚本(pagingbar10eff4)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar10eff4_onSearch (params){
	Artery.get('listArea4').reload({params:params});
}

		

/**
 * 分页查询脚本(pagingbar1caa94)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar1caa94_onSearch (params){
	Artery.get('listArea1').reload({params:params});
}

		

/**
 * 分页查询脚本(pagingbar136629)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar136629_onSearch (params){
	Artery.get('listArea2').reload({params:params});
}

		

/**
 * 分页查询脚本(pagingbar116ab8)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar116ab8_onSearch (params){
	// clearStatusclearStatus为true，则清空列表选中状态（checkbox列的状态），否则，不清空选中状态，默认为true
	Artery.get('listArea5').reload({params:params, "clearStatus":false});
}

		