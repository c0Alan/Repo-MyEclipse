// **********************************************//
// 子系统维护 客户端脚本
// 
// @author Artery
// @date 2010-10-13
// @id 512a4417950d4b3c0263e60d0d7a3855
// **********************************************//
/**
 * 点击节点脚本(dynamicNav)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function dynamicNav_onNodeClickClient (rc, node){
	var type = node.attributes.type;
	if(type == 'sysRoot'){
        Artery.get("delSubsysBtn").disable();
        Artery.get("operArea").showForm({
	        formId : "1f833bae08f9d211f4809d604beb8fd1",
	        formType : Artery.FORM,
	        runTimeType : "display",
	        params:{
	        }
	    });	
	}else{
		Artery.get("delSubsysBtn").enable();
	    Artery.get("operArea").showForm({
	        formId : "e1213e9ce3f7c057a8810436279396ee",
	        formType : Artery.FORM,
	        runTimeType : "update",
	        params:{
	  	        sysId     : node.attributes.cid,
	            headString : "编辑子系统"
	        }
	    });	
	 }
}
    
/**
 * onClickClient(addSubsysBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function addSubsysBtn_onClickClient (rc){
	Artery.get("operArea").showForm({
	    formId : "e1213e9ce3f7c057a8810436279396ee",
	    formType : Artery.FORM,
	    runTimeType : "insert",
	    params:{
	        headString : "新建子系统"
	    }
	});	 	
}
/**
 * onClickClient(delSubsysBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function delSubsysBtn_onClickClient (rc){
	var nav = Artery.get("dynamicNav");
    var node = nav.getClickNode();	
    Artery.confirmMsg("确认删除","警告：确认删除子系统“"+node.text+"“？",function(btn){
        if(btn == 'yes'){
        	Artery.get("delSubsysBtn").disable();
            rc.put("sysId",node.attributes.cid);
            rc.send(function(result){
                if(result == 'ok'){
             	    nav.root.reload(function(){
             	        nav.doExpandTree();
             	    });
             	    Artery.get("operArea").showForm({
			            formId : "1f833bae08f9d211f4809d604beb8fd1",
			            formType : Artery.FORM,
			            runTimeType : "insert",
			            params:{
			            }
			        });	
			        Artery.showTip("删除子系统成功！", 'operArea');
                }else
                	Artery.showTipError("删除子系统失败！\n子系统不存在", 'operArea');
            });
       
        }
    });
}
/**
 * onClickClient(refCacheBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function refCacheBtn_onClickClient (rc){
    rc.send(function(result){
		if(result == 'ok'){
			Artery.showTip("更新缓存成功！", 'operArea');
			var nav = Artery.get("dynamicNav"); 
			nav.root.reload(function(){
				nav.doExpandTree();
			});
			Artery.get("operArea").showForm({
				"formId" : "1f833bae08f9d211f4809d604beb8fd1",
				"formType" :  Artery.FORM,
				"runTimeType" : "insert"
			});
		}else{
			Artery.showTipError("更新缓存失败！", 'operArea');
		}
	});	
}