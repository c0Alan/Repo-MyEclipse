// **********************************************//
// loop 客户端脚本
// 
// @author Artery
// @date 2010-04-15
// @id ad3413e0a45fc0e64df7874f12005277
// **********************************************//

/**
 * 分页查询脚本(pagingbar196360)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar196360_onSearch (params){
	params.itemid = 'blankPanel8ec96';
	Artery.parseItem({
		params:params,
		callback:function(result){
			Artery.get('blankPanelad267').removeAll();
			Artery.get('blankPanelad267').addItem(result);
		}
	})
}

		

/**
 * 客户端(imageArea7af3b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 * @param  {item(blankPanel75d97).id}
 * @param  {rs1.C_ID}
 */
function imageArea7af3b_onClickClient (rc,imgId,infoId,bookId){
	var imgArea = Artery.get(imgId);
	var infoArea = Artery.get(infoId);
	if(imgArea.getValue() == 1){
		imgArea.changeImage('/artery/arteryImage/arrow/up.gif');
		imgArea.setValue(2);
		Artery.parseItem({
			params:{itemid:'formArea50f57',bookId:bookId},
			callback:function(result){
				infoArea.removeAll();
				infoArea.addItem(result);
				infoArea.show();
			}
		})
	}else{
		imgArea.changeImage('/artery/arteryImage/arrow/down.gif');
		imgArea.setValue(1);
		infoArea.hide();
	}
}

/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onMouseOverClient (rc,imageId){
	if(!this.selected){
		this.el.applyStyles('background-color:#E3EDFB;')
		Artery.get(imageId).show();
	}
}

/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onMouseOutClient (rc,imageId){
	if(!this.selected){
		this.el.applyStyles('background-color:#fff;')
		if(Artery.get(imageId).getValue() == 1){
			Artery.get(imageId).hide();
		}
	}
}

/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onSelectClient (rc,imageId){
	this.el.applyStyles('background-color:#A3ECEC;')
	Artery.get(imageId).show();
}

/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onDeselectClient (rc,imageId){
	this.el.applyStyles('background-color:#fff;')
	if(Artery.get(imageId).getValue() == 1){
		Artery.get(imageId).hide();
	}
}
/**
 * 值改变时脚本(faCode5ca04)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 * @param  {rs1.C_ID}
 */
function faCode5ca04_onChangeClient (rc, oldValue, newValue,bookid){
	if(newValue == 1){
		Artery.get('loopArea1d24e').putData(bookid)
	}else{
		Artery.get('loopArea1d24e').removeData(bookid);
	}
}
  	

/**
 * 客户端(tbButton6fd17)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButton6fd17_onClickClient (rc){
	alert(Ext.encode(Artery.get('loopArea1d24e').getDataAsJson()));	
}