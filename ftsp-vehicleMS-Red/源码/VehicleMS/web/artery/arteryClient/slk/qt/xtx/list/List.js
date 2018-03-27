// **********************************************//
// List 客户端脚本
// 
// @author Artery
// @date 2010-04-27
// @id f3159855135d5c21f0553e0d69f96d15
// **********************************************//

/**
 * 分页查询脚本(pagingbar19dbdc)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar19dbdc_onSearch (params){
	Artery.get('listArea89fa0').reload({params:params})
}

		

/**
 * 分页查询脚本(pagingbar149bfd)
 * 
 * @param  params 分页传递的参数，如:{start:2,limit:20}
 */
function pagingbar149bfd_onSearch (params){
	Artery.get('listArea89fa0').reload({params:params})
}

		
/**
 * 客户端(button9c54c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button9c54c_onClickClient (rc){
	Artery.get("listArea89fa0").exportExcel();	
}
/**
 * 客户端(blankPanel01638)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(blankPanel4028d).id}
 */
function blankPanel01638_onMouseOverClient (rc,cooltip){
	Artery.get(cooltip).alignTo(this.el,'tr?',[-6,-10]);
}
/**
 * 客户端(blankPanel01638)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(blankPanel4028d).id}
 */
function blankPanel01638_onMouseOutClient (rc,cooltip){
	(function(){
		if(!Artery.get(cooltip).mouseOver){
			Artery.get(cooltip).hide();
		}
	}).defer(100);
}
/**
 * 客户端(blankPanel4028d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function blankPanel4028d_onMouseOverClient (rc){
	this.mouseOver = true;	
}
/**
 * 客户端(blankPanel4028d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function blankPanel4028d_onMouseOutClient (rc){
	this.mouseOver = false;
	this.hide();
}