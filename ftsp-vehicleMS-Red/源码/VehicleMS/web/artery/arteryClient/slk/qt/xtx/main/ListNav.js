// **********************************************//
// listNav 客户端脚本
// 
// @author Artery
// @date 2010-06-09
// @id 3805114bcb51bed89dcda361242760ae
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
 * 客户端(tbButtone5098)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtone5098_onClickClient (rc){
	Artery.showMessage("aaaaaaaaa");	
}

var showTipId;
/**
 * 客户端(blankPanel6d2f1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {item(blankPanel91265).id}
 */
function blankPanel6d2f1_onMouseOverClient (rc,infoId){
	showTipId = infoId;
	var currentEl = this.el;
	(function(){
		if(showTipId == infoId){
			Artery.get(infoId).alignTo(currentEl,'tr?',[-6,-10]);
		}
	}).defer(20);
}
/**
 * 客户端(blankPanel6d2f1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {item(blankPanel91265).id}
 */
function blankPanel6d2f1_onMouseOutClient (rc,infoId){
	(function(){
		if(showTipId == infoId || Artery.get(infoId).isVisible()){
			if(!Artery.get(infoId).mouseOver){
				Artery.get(infoId).hide();
			}
		}
	}).defer(10);
}
/**
 * 客户端(blankPanel91265)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function blankPanel91265_onMouseOverClient (rc){
	this.mouseOver = true;		
}
/**
 * 客户端(blankPanel91265)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function blankPanel91265_onMouseOutClient (rc){
	this.mouseOver = false;
	this.hide();	
}
/**
 * 客户端(button18075)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button18075_onClickClient (rc){
	Artery.get('listNav53add').select('listCatalogceaf7');	
}
/**
 * 客户端(button78d4c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button78d4c_onClickClient (rc){
	Artery.get('listNav53add').select('listCatalogca4bb');	
	var treePanel = Artery.get('dynamicNavb6617');
	treePanel.selectPath(treePanel.root.findChild('cid','writ2').getPath());
}