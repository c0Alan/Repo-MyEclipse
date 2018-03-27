// **********************************************//
// _button 客户端脚本
// 
// @author Artery
// @date 2011-09-21
// @id dc36d6dde1aef88e0115cdb2f2950412
// **********************************************//
/**
 * onClickClient(button7f43c)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button7f43c_onClickClient (rc){
	rc.send(function(result) {
		alert(result);
	});
}
/**
 * onClickClient(button75300)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button75300_onClickClient (rc){
	var btnText = Artery.get("buttond6f07").getText();	
	alert("按钮上的文本是：" + btnText);
}
/**
 * onClickClient(buttondc2d6)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttondc2d6_onClickClient (rc){
	Artery.get("buttond6f07").setText("新文本");	
}

/**
 * onClickClient(buttonef230)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonef230_onClickClient (rc){
	Artery.get("buttond6f07").setIcon("/artery/arteryImage/other/tbrightagent.gif");	
}
/**
 * onClickClient(buttonff0ce)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonff0ce_onClickClient (rc){
	Artery.get("buttond6f07").hideIcon();
}
/**
 * onClickClient(buttonc7930)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonc7930_onClickClient (rc){
	Artery.get("buttond6f07").showIcon();	
}
/**
 * onClickClient(buttond6f07)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttond6f07_onClickClient (rc){
	alert("触发按钮点击事件");	
}
/**
 * onClickClient(button0ec48)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button0ec48_onClickClient (rc){
	Artery.get("buttond6f07").click();	
}
/**
 * onClickClient(buttonacfc7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonacfc7_onClickClient (rc){
	Artery.get("buttond6f07").hide();		
}
/**
 * onClickClient(button50f02)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button50f02_onClickClient (rc){
	Artery.get("buttond6f07").show();	
}
/**
 * onClickClient(button5e21d)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button5e21d_onClickClient (rc){
	Artery.get("buttond6f07").disable();	
}
/**
 * onClickClient(button5c345)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button5c345_onClickClient (rc){
	Artery.get("buttond6f07").enable();	
}
/**
 * onClickClient(buttonc6563)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonc6563_onClickClient (rc){
  var btn = Artery.get("buttonc6563");
  rc.send(function(result){
    if(result == "ok"){
      Artery.showTip('操作成功!');  
      btn.hideLoading();
    }
  });
}
/**
 * onClickClient(buttond56cb)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttond56cb_onClickClient (rc){
	Artery.get("buttond6f07").setTooltip("请点击");	
}