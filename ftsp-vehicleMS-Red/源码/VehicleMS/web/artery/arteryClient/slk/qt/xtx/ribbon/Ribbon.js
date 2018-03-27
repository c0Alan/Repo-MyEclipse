// **********************************************//
// ribbon 客户端脚本
// 
// @author Artery
// @date 2010-05-12
// @id b3920e1a9f7c47c7e76b0039edc79cbe
// **********************************************//
/**
 * 客户端(ribbonCell8de7c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell8de7c_onClickClient (rc){
	alert(this.title);	
}
/**
 * 客户端(buttond3c33)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttond3c33_onClickClient (rc){
	Artery.get('ribbonCell878f0').setTip('ok');	
	Artery.get('ribbonCell878f0').setTipInfo("保存完毕！");	
}
/**
 * 客户端(buttonead82)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonead82_onClickClient (rc){
	Artery.get('ribbonCell878f0').setTip('100',false);
	Artery.get('ribbonCell878f0').setTipInfo("测试测试测试");	
}
/**
 * 客户端(buttone53b9)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttone53b9_onClickClient (rc){
	Artery.get('ribbonCell53e04').reload();
}
/**
 * 客户端(ribbonCell53e04)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell53e04_onReloadClient (rc){
	this.setTip("ok");
	this.setTipInfo("已审结！");	
}
/**
 * 客户端(buttonf38ee)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf38ee_onClickClient (rc){
	Artery.get('ribbonCell878f0').setTip('23');
}
/**
 * onClickClient(ribbonCell96f8f)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCell96f8f_onClickClient (rc){
	rc.send(function(result){
		if(result.phaseValid){
			top.Artery.valid.showPhaseValid(result.phaseValid);	
		}
	});	
}

/**
 * onClickClient(ribbonCelld3cf2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function ribbonCelld3cf2_onClickClient (rc){
	rc.send(function(result){
		Artery.showMessage('缓存刷新成功！');
	});	
}
