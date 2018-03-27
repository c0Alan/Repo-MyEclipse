// **********************************************//
// listNav 客户端脚本
// 
// @author Artery
// @date 2010-06-09
// @id 7be8ad0e6b3f4e64b09576401c1c5769
// **********************************************//
/**
 * 客户端(listItemc689a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemc689a_onClickClient (rc){
	alert(2);	
}
/**
 * 客户端(listItemd4f70)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemd4f70_onClickClient (rc){
	alert(2);	
}

/**
 * 客户端(formB36DC)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
//function formB36DC_onLoadClient (rc){
//	var dyPanel = Artery.get('dynamicNav7aa5d');
//	if(!dyPanel.initResize){
//		dyPanel.body.on('resize',function(){
//			var listNav = Artery.get('listNav53add');
//			//Artery.showMessage(listNav.body.dom.scrollHeight +":" + listNav.body.getHeight())
//			var min = listNav.body.dom.scrollHeight - listNav.body.getHeight();
//			if(min>0){
//				dyPanel.body.setStyle('overflow','auto');
//				dyPanel.body.setHeight(dyPanel.body.getHeight() - min-3);
//			}
//			
//		},this);
//		dyPanel.initResize = true;
//	}	
//}
/**
 * 客户端(tbButtone5098)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtone5098_onClickClient (rc){
	Artery.showMessage("aaaaaaaaa");	
}
/**
 * 客户端(column56051)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function column56051_onClickClient (rc){
	alert(2);	
}
/**
 * 客户端(listItemf8893)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemf8893_onClickClient (rc){
	Artery.get('windowc580d').show();
	Artery.get('windowc580d').alignTo(this.el,'tl-tr?');
}

/**
 * 客户端(listItemf8893)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemf8893_onDeselectClient (rc){
	Artery.get('windowc580d').hide();
}
/**
 * 客户端(listItemb2ed4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemb2ed4_onClickClient (rc){
	Artery.get('windowd57a0').show();
	Artery.get('windowd57a0').alignTo(this.el,'tl-tr?')
}
/**
 * 客户端(listItemb2ed4)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function listItemb2ed4_onDeselectClient (rc){
	Artery.get('windowd57a0').hide();
}

/**
 * 客户端(windowd57a0)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function windowd57a0_onCloseClient (rc){
	Artery.get('listNav53add').deselect();	
}
/**
 * 客户端(windowc580d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function windowc580d_onCloseClient (rc){
	Artery.get('listNav53add').deselect();
}