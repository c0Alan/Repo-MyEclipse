// **********************************************//
// book 客户端脚本
// 
// @author Artery
// @date 2010-04-09
// @id 0a0afd2934ba674e60ad166dbedd3a32
// **********************************************//

/**
 * 删除(button5e151)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.C_ID}
 * @param  {item(blankPanelf549a).id}
 */
function button5e151_onClickClient (rc,id,formid){
	rc.put('id',id);
	rc.send(function(result){
		if(result == 'ok'){
			Artery.get('blankPanel2da6f').removeItem(formid)
		}else{
			Artery.showError("删除失败！");
		}
	});
}

/**
 * 新建(tbButtonbef75)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonbef75_onClickClient (rc){
	Artery.parseItem({params:{itemid:'formArea28f83',runTimeType:'insert'},callback:function(result){
		Artery.get('blankPanel400b4').addItem(result);
	}})	
}

/**
 * 取消(button9ff9f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(formArea28f83).id}
 */
function button9ff9f_onClickClient (rc,id){
	Artery.get('blankPanel400b4').removeItem(id);
}

/**
 * 保存(buttonf3546)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(formArea28f83).id}
 */
function buttonf3546_onClickClient (rc,form){
	Artery.get(form).submit(function(result){
		Artery.get('blankPanel400b4').removeItem(form);
		Artery.parseItem({params:{itemid:'blankPanelf549a',bookId:result},callback:function(result){
			Artery.get('blankPanel2da6f').addItem(result,'begin');
		}})
	});	
}


/**
 * 编辑(button881e4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {rs1.C_ID}
 * @param  {item(blankPanelf549a).id}
 * @param  {item(formAreacaeca).id}
 */
function button881e4_onClickClient (rc,bookId,wrapId,formId){
	//alert(bookId + ":" + wrapId + ":" + formId);
	Artery.get(wrapId).removeItem(formId);
	Artery.parseItem({
		params:{
			itemid:'formArea28f83',
			runTimeType:'update',
			bookId:bookId,
			wrapId:wrapId
		},
		callback:function(result){
			Artery.get(wrapId).addItem(result);
		}
	})	
}

/**
 * 编辑-保存(button8009b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(formArea28f83).id}
 * @param  {req.wrapId}
 */
function button8009b_onClickClient (rc,form,wrapId){
	Artery.get(form).submit(function(result){
		Artery.get(wrapId).removeItem(form);
		Artery.parseItem({
			params:{
				itemid:'blankPanelf549a',
				bookId:result,
				blankPanelf549a_id:wrapId
			},
			callback:function(result){
				Artery.get(wrapId).addItem(result,'begin');
			}
		})
	});	
}

/**
 * 编辑-取消(button7c99d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(formArea28f83).id}
 * @param  {rs1.C_ID}
 * @param  {req.wrapId}
 */
function button7c99d_onClickClient (rc,form,bookId,wrapId){
	Artery.get(wrapId).removeItem(form);
	Artery.parseItem({
		params:{
			itemid:'formAreacaeca',
			bookId:bookId,
			blankPanelf549a_id:wrapId
		},
		callback:function(result){
			Artery.get(wrapId).addItem(result,'begin');
		}
	})
}

/**
 * 客户端(tbButtonc57e7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonc57e7_onClickClient (rc){
	Artery.get("blankPanel2da6f").removeAll();	
}

/**
 * 分页查询脚本(pagingbar1d1646)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar1d1646_onSearch (params){
	params.itemid = 'blankPanel57fc7';
	Artery.parseItem({
		params:params,
		callback:function(result){
			Artery.get('blankPanel23176').removeAll();
			Artery.get('blankPanel23176').addItem(result);
		}
	})
	//同步更新其它分页栏
	Artery.get('pagingbar194738').refresh(Artery.get('pagingbar1d1646').getPageInfo());
}

		

/**
 * 分页查询脚本(pagingbar194738)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar194738_onSearch (params){
	Artery.get('blankPanel23176').el.mask('Loading...');
	params.itemid = 'blankPanel57fc7';
	Artery.parseItem({
		params:params,
		callback:function(result){
			Artery.get('blankPanel23176').removeAll();
			Artery.get('blankPanel23176').addItem(result);
			Artery.get('blankPanel23176').el.unmask();
		}
	})
	//同步更新其它分页栏
	Artery.get('pagingbar1d1646').refresh(Artery.get('pagingbar194738').getPageInfo());
}

		