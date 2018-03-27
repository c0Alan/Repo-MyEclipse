// **********************************************//
// blankPanel 客户端脚本
// 
// @author Artery
// @date 2010-04-18
// @id f3ee3926347e6281cf09bd05a025464e
// **********************************************//

/**
 * 客户端(blankPanel290ac)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(buttonArea92822).id}
 */
function blankPanel290ac_onMouseOverClient (rc,hid){
	if(!this.selected){
		this.el.addClass('x-theme-blankPanel-appleSelect');	
		Artery.get(hid).show();
	}
}

/**
 * 客户端(blankPanel290ac)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(buttonArea92822).id}
 */
function blankPanel290ac_onMouseOutClient (rc,hid){
	if(!this.selected){
		this.el.removeClass('x-theme-blankPanel-appleSelect');	
		Artery.get(hid).hide();
	}
}

/**
 * 客户端(blankPanel290ac)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(buttonArea92822).id}
 */
function blankPanel290ac_onSelectClient (rc,hid){
	this.el.addClass('x-theme-blankPanel-appleSelect');	
	Artery.get(hid).show();
}

/**
 * 客户端(blankPanel290ac)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(buttonArea92822).id}
 */
function blankPanel290ac_onDeselectClient (rc,hid){
	this.el.removeClass('x-theme-blankPanel-appleSelect');	
	Artery.get(hid).hide();
}

/**
 * 客户端(simpleButtonae24b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.C_ID}
 * @param  {item(blankPanel7f212).id}
 */
function simpleButtonae24b_onClickClient (rc,bookId,describeWrap){
	var wrap = Artery.get(describeWrap);
	if(wrap.isVisible() && wrap.type == 'describe'){
		wrap.hide();
	}else{
		Artery.parseItem({params:{itemid:'htmlAreac2812',bookId:bookId},callback:function(result){
			wrap.removeAll();
			wrap.addItem(result);
			wrap.show();
		}})
		wrap.type = 'describe'
	}
}

/**
 * 客户端(simpleButton3553f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.C_ID}
 * @param  {item(blankPanel7f212).id}
 */
function simpleButton3553f_onClickClient (rc,bookId,infoWrap){
	var wrap = Artery.get(infoWrap);
	if(wrap.isVisible() && wrap.type == 'info'){
		wrap.hide();
	}else{
		Artery.parseItem({params:{itemid:'formArea48459',bookId:bookId},callback:function(result){
			wrap.removeAll();
			wrap.addItem(result);
			wrap.show();
		}})
		wrap.type = 'info'
	}
}

/**
 * 分页查询脚本(pagingbar14f922)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar14f922_onSearch (params){
	params.itemid = 'blankPaneldee33';
	params.bookName = Artery.get('faStringf9265').getValue();
	Artery.parseItem({params:params,callback:function(result){
		Artery.get('blankPanel236a4').removeAll();
		Artery.get('blankPanel236a4').addItem(result);
	}})
}

		
/**
 * 值改变时脚本(faCode35bf0)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function faCode35bf0_onChangeClient (rc, oldValue, newValue){
	var params = {limit:newValue};
	Artery.get('pagingbar14f922').search(params);
}
  	
/**
 * 客户端(button3ade1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button3ade1_onClickClient (rc){
	Artery.get('pagingbar14f922').search();
}
/**
 * 回车时脚本(formArea54c5e)
 * 
 */
function formArea54c5e_onEnter (){
	Artery.get('pagingbar14f922').search();
}
  	