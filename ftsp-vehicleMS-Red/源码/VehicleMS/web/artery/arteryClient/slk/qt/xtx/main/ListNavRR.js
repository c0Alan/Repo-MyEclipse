// **********************************************//
// listNav 客户端脚本
// 
// @author Artery
// @date 2010-06-09
// @id 8d5174455d228b966410a95d75b6be2c
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
 * 客户端(button98425)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {item(blankPanel6ed38).id}
 */
function button98425_onClickClient (rc,infoid){
	if(Artery.get(infoid).isVisible()){
		Artery.get(infoid).hide();
	}else{
		Artery.get(infoid).show();
		if(Artery.get(infoid).el.dom.innerHTML == ''){
			Artery.parseItem({
				params:{itemid:'blankPanel9f51f'},
				callback:function(result){
					Artery.get(infoid).removeAll();
					Artery.get(infoid).addItem(result);
				},
				asyn:false
			},this)
		}
	}
}
/**
 * 客户端(column56051)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function column56051_onClickClient (rc){
	
}
/**
 * 客户端(button098fe)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {item(buttonArea5ab85).id}
 */
function button098fe_onClickClient (rc){
	
}
/**
 * onClickClient(button6a95a)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button6a95a_onClickClient (rc){
	var list = Artery.get('listAreab834c');
	var tr = list.getTrByColValue('columnXyrId','xyrid2');
	var btn = Artery.get(Ext.fly(tr).child('.x-btn-detail',true).id);
	btn.click();
	var qzcs = Artery.get(Ext.fly(tr).next().child('.x-btn-qzcs',true).id);
	qzcs.click();
}