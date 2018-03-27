// **********************************************//
// carapply 客户端脚本
// 
// @author huayu
// @date 2017-06-07
// @id 5e8c627d5f049ad158a4de088f48a061
// **********************************************//

/**
 * onClickClient(buttonfde75)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonfde75_onClickClient (rc){
	Artery.get("formAread46ab").submit(function(flag){
		if(flag){//申请成功
			Artery.showMessage('申请成功');
			Artery.getWin().get("listArea8d6ab").reload();
			Artery.getWin().close();
		}else{//申请失败
			var cid =Artery.get("sCl").getValue();
			var  st =Artery.get("faDate3b0a9").getValue();
			var  et =Artery.get("faDate5dde6").getValue();
			Artery.openForm({
				"formId" : "81dde32f9da7f8a68d4936000bdaea03",
				"formName" : "车辆已被申请时段",
				"formType" : "1",
				"params" : {
					"cid" : cid,
					"st" :st,
					"et" :et
				},
				"target" : "_window",
				"targetWidth" : 380,
				"targetHeight" : 350,
				"runTimeType" : "insert",
					"modal":true
			});
		}
	});


}
/**
 * onClickClient(button48977)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button48977_onClickClient (rc){
	 Artery.getWin().close();
}

/**
 * onClickClient(button482be)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button482be_onClickClient (rc){
		
		var cph = Artery.get("faString76027").getValue();
		var kssj = Artery.get("faDate0f89e").getValue();
		var jssj = Artery.get("faDatee139e").getValue();
		
		Artery.get("listArea8d6ab").reload({
			params : {  //重新加载时的参数
				cph: cph,
				kssj: kssj,
				jssj: jssj
			}
		});
		

}
/**
 * onClickClient(buttonf5f04)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonf5f04_onClickClient (rc){
	
}
/**
 * 值改变时脚本(faCodedb0f8)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function faCodedb0f8_onChangeClient (rc, oldValue, newValue){
	Artery.get("sCl").reload({ 
		params : {
			cllx: newValue
		}
	});
	Artery.get("sCl").setValue("");
	Artery.get("sPp").setValue("");
	Artery.get("nZcs").setValue("");

}

/**
 * 值改变时脚本(sCl)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  oldValue 控件改变前的旧值
 * @param  newValue 控件改变后的新值
 */
function sCl_onChangeClient (rc, oldValue, newValue){
	rc.put("cl",newValue);
	rc.send(function(result){
		Artery.get("sPp").setValue(result.CBrand);
		Artery.get("nZcs").setValue(result.NSeat);
	});
	
}


/**
 * 点击脚本是删除用车信息
 * onClickClient(colOperTexte7e7b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function colOperTexte7e7b_onClickClient (rc){
	Artery.confirmMsg('删除',"此操作不可恢复，确定要删除吗？",function(btn){ 
 		if(btn == 'yes'){
 			var row = Artery.get("listArea8d6ab").getSelectedRowJson();
 			var id =row.carid;
 			rc.put("cid",id);
 			rc.send(function(result){
 				Artery.showMessage("操作成功！");
 				Artery.get("listArea8d6ab").reload();
 			});
 		}
	});
}
			/**
			* 申请用车时间验证脚本(faDate3b0a9)
			*
			* @param rc
			系统提供的AJAX调用对象
			* @param value 控件的值
			*/
			function faDate3b0a9_onValidClient (rc, value){
				var etime = Artery.get("faDate5dde6").getValue();
				if(etime !=null && etime !=undefined){
					if(new Date(value)>new Date(etime)){
						return false;
					}
				}
				return true;
			}
  	
			
			/**
			* 值改变时脚本(faDate3b0a9)
			*
			* @param rc
			系统提供的AJAX调用对象
			* @param oldValue 控件改变前的旧值
			* @param newValue 控件改变后的新值
			*/
			function faDate3b0a9_onChangeClient (rc, oldValue, newValue){
				
			}
  	
			/**
			* 验证脚本(faDate5dde6)
			*
			* @param rc
			系统提供的AJAX调用对象
			* @param value 控件的值
			*/
			function faDate5dde6_onValidClient (rc, value){
				var stime = Artery.get("faDate3b0a9").getValue();
				if(stime !=null && stime !=undefined){
					if(new Date(value)<new Date(stime)){
						return false;
					}
				}
				return true;
			}
  	