// **********************************************//
// 设置子系统首页面 客户端脚本
// 
// @author Artery
// @date 2010-10-18
// @id e25e63aaa43279995f898d93fdab2695
// **********************************************//
/**
 * 点击节点脚本(dynamicNav)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  node 导航树节点
 */
function dynamicNav_onNodeClickClient (rc, node){
	var type = node.attributes.type;
	if(type != "menu"){
	    var listArea = Artery.get("listArea");
	    listArea.reload({params:{
            fId:node.attributes.cid//表单id
        }});
        Artery.get("faRuntimeType").reload({
        	params:{
        		selectedFormType:type
        	}
        });
	}
}
    
/**
 * onClickClient(refEformBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function refEformBtn_onClickClient (rc){
	var nav = Artery.get("dynamicNav");
	//将表单树展开到目录一级
	nav.root.reload(function(){
		nav.doExpandTree();
	});
	//将参数列表情空
	var listArea = Artery.get("listArea");
	listArea.reload({
		params:{
	        fId:null
	    }
	});
}

/**
 * onLoadClient(formea2cf)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function formea2cf_onLoadClient (rc){
	var linkTo = Artery.params.linkTo;
	if(Ext.isEmpty(linkTo))
	    return ;
	//根据打开的子系统的首页面，展开左侧的表单树并定位
	var id = getPropertyFromFirstForm("formId",linkTo);
	if(!Ext.isEmpty(id)){
	    var nav = Artery.get("dynamicNav");
	    nav.search(id);
	}
	//设置运行类型
	var runtimeType = getPropertyFromFirstForm("runTimeType",linkTo);
	if(!Ext.isEmpty(runtimeType))
	    Artery.get("faRuntimeType").setValue(runtimeType);
	//设置URL
	var url = getPropertyFromFirstForm("url",linkTo);
	if(!Ext.isEmpty(url))
	    Artery.get("faURL").setValue(url);
	//设置是否请求传参
	var paramsRequest = getPropertyFromFirstForm("paramsRequest",linkTo);
	if(!Ext.isEmpty(paramsRequest))
	    Artery.get("faParamsRequest").setValue(paramsRequest);
}

/**
 * 从首页面配置信息中获取相关属性(一级属性)
 * @param {} propertyName 属性名
 * @param {} firstForm 首页面配置信息
 * @return {String} 属性值
 */
function getPropertyFromFirstForm(propertyName,firstForm){
	if(firstForm.substring(0,1) !="{"){
		firstForm = "{\"formId\":\"" + firstForm + "\"}";
	}
	var map = Ext.decode(firstForm);
	var pro = map[propertyName];
	if(Ext.isEmpty(pro))
	    return null;
	return pro;
}
  	
/**
 * onClickClient(cancelBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function cancelBtn_onClickClient (rc){
    Artery.getWin().close();	
}
/**
 * onClickClient(clearAndCloseBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function clearAndCloseBtn_onClickClient (rc){
    var faTrigger = Artery.getWin().get(Artery.params.triggerName);	
    faTrigger.setValue('','');
    Artery.getWin().close();
}
/**
 * onClickClient(confirmBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function confirmBtn_onClickClient (rc){
	var faTrigger = Artery.getWin().get(Artery.params.triggerName);	
	var selectedNode = Artery.get("dynamicNav").getClickNode();
	var jsonObj = {};
	var firstUrl = Artery.get("faURL").getValue();
	if(Ext.isEmpty(firstUrl)&&selectedNode!=null){
	    jsonObj.formId = selectedNode.attributes.cid;
	    jsonObj.formName = selectedNode.attributes.text;
	    jsonObj.formType = selectedNode.attributes.type=='form'?"1":(selectedNode.attributes.type=='reprot'?"2":"3");
	    var paramMap = {};
	    var listArea = Artery.get("listArea");
	    var colVal1 = null;
	    var col1 = listArea.getValues("colName");
	    var col2 = listArea.getValues("colValue");
	    var colArray1 = col1.split(",");
	    var colArray2 = col2.split(",");
	    var colLength2 = colArray2.length;
	    for(var i=0;i<colArray1.length;i++){
	        colVal1 = colArray1[i];
	        if(Ext.isEmpty(colVal1))
	            continue;
	        if(i<colLength2)
	            paramMap[colVal1] = colArray2[i].length==0?'':colArray2[i];
	    }
	    jsonObj.params = paramMap;
	    jsonObj.runTimeType = Artery.get("faRuntimeType").getValue();
	    if(Artery.get("faParamsRequest").getValue() != 'false')
	    	jsonObj.paramsRequest = Artery.get("faParamsRequest").getValue();
	    faTrigger.setValue(Ext.encode(jsonObj),selectedNode.attributes.text);
	}else if(!Ext.isEmpty(firstUrl)){
		jsonObj.url = firstUrl;
		jsonObj.runTimeType = Artery.get("faRuntimeType").getValue();
		if(Artery.get("faParamsRequest").getValue() != 'false')
	    	jsonObj.paramsRequest = Artery.get("faParamsRequest").getValue();
		faTrigger.setValue(Ext.encode(jsonObj),firstUrl);
	}else{
		faTrigger.setValue("","");
	}
    Artery.getWin().close();
}
/**
 * 加载前脚本(dynamicNav)
 * 
 * @param  loader 加载器
 * @param  node 导航树节点
 */
function dynamicNav_onBeforeLoad (loader, node){
	loader.baseParams.node_complibId = node.attributes.complibId;
}
    