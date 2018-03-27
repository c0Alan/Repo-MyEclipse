// **********************************************//
// 添加修改子系统 客户端脚本
// 
// @author Artery
// @date 2010-10-13
// @id e1213e9ce3f7c057a8810436279396ee
// **********************************************//

/**
 * 点击时脚本(faTrigger)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function faTrigger_onTriggerClickClient (rc){
	var obj = Artery.get("faTrigger");
	Artery.openForm({
	    formId: "e25e63aaa43279995f898d93fdab2695",
	    formType : Artery.FORM,
	    runTimeType : Artery.params.runTimeType,
       	target: "_window",
       	targetHeight: 500,
       	targetWidth: 600,
       	title: "设置首页面",
       	params: {
       	    triggerName: "faTrigger",
       	    showValue: obj.getShowValue(),
			linkTo: obj.getValue()
       	}
	});
}
  	
/**
 * onClickClient(addSysBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addSysBtn_onClickClient (rc){
	var firstFrameName = Artery.get("faTrigger").getShowValue();
	var publish = Artery.get("sysPublish").getValue();
	if(publish == 'true'&&Ext.isEmpty(firstFrameName)){
	    Artery.showTipError("子系统更新失败！\n首页面为空，不能发布系统！", 'blankPanel4dc35');
	}else{
	    var nav = Artery.getWin().get("dynamicNav");
	    Artery.get("formArea").submit(function(result){
	        if(result == 'ok'){
	            nav.root.reload(function(){
	                nav.doExpandTree();
	            });
	            Artery.showTip("子系统创建成功！", 'blankPanel4dc35');
	        }else{
	        	Artery.showTipError("子系统创建失败！", 'blankPanel4dc35');
	        }    
	    });	
	}
}
/**
 * onClickClient(updSysBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function updSysBtn_onClickClient (rc){
	var firstFrameName = Artery.get("faTrigger").getShowValue();
	var publish = Artery.get("sysPublish").getValue();
	if(publish == 'true'&&Ext.isEmpty(firstFrameName)){
	    Artery.showTipError("子系统更新失败！\n首页面为空，不能发布系统！", 'blankPanel4dc35');
	}else{
		Artery.get("formArea").submit(function(result){
	        if(result == 'ok'){
	            Artery.showTip("子系统更新成功！", 'blankPanel4dc35');
	        }else{
	        	Artery.showTipError("子系统更新失败！", 'blankPanel4dc35');
	        }    
	    });	
	}
}