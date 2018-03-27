//过滤html标签
function filterHtml(str){
	str = str.replace(new RegExp("&nbsp;","gm"), " ");  
	str = str.replace(new RegExp("&gt;","gm"), ">");  
	str = str.replace(new RegExp("&lt;","gm"), "<");  
	str = str.replace(new RegExp("&quot;","gm"), "\"");  
	str = str.replace(new RegExp("&amp;","gm"), "&");  
	str = str.replace(new RegExp("&copy;","gm"), "©");  
	str = str.replace(new RegExp("&reg;","gm"),"®");  
	str = str.replace(new RegExp("&trade;","gm"),"™");  
	str = str.replace(new RegExp("&yen;","gm"),"¥");
	
	//定义script的正则表达式{或<script[^>]*?>[\\s\\S]*?<\\/script> }
	var regEx_script = new RegExp("<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?script[\\s]*?>","gm");
	//定义style的正则表达式{或<style[^>]*?>[\\s\\S]*?<\\/style> }
	var regEx_style = new RegExp("<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>","gm");
	//定义HTML标签的正则表达式 
	var regEx_html = new RegExp("<[^>]+>","gm"); 
	str = str.replace(regEx_script,"");
	str = str.replace(regEx_style,"");
	str = str.replace(regEx_html,"");
	//inputString = inputString.substring(0,5)
	return str;
}


//分析nameprop属性配置的表达式，得到值,如果需要增加其他标签，则直接在上面添加即可
function ParsePropName(val,Proplist){
	var res = null;
	//复合属性，需要通过计算解析
	if(val.indexOf("(")!=-1){
		var plist = new Array();
		for(var i=0;i<Proplist.childNodes.length;i++){
			plist[i] = Proplist.childNodes[i];
		}
		//按照属性名长短排序（由长到短）
		for(var j=0; j<plist.length; j++){
			for(var k=j+1; k<plist.length; k++){
				if(plist[j].getAttribute("name").length<plist[k].getAttribute("name").length){
					var temp = plist[j];
					plist[j] = plist[k];
					plist[k] = temp;
				}
			}
		}
		
		for (var i = 0; i < plist.length; i++) {
			var element = plist[i];
			if (element.nodeType === 1) {
				var elementname = element.getAttribute("name");
				val = val.replace(new RegExp(elementname,"gm"),"'"+XmlUtil.getText(element, "Value")+"'");
			}
		}
		//val = val.replace(new RegExp("[//s]+$","gm"),"");
		val=val.replace(/\t\r\n/ig,"");

		//alert(val);
		try{
			res = eval(val);
		}catch(e){
			res = null;
		}
	}else{
		for (var i = 0; i < Proplist.childNodes.length; i++) {
			var element = Proplist.childNodes[i];
			if (element.nodeType === 1) {
				var elementname = element.getAttribute("name");
				if (elementname == val) {
					res = XmlUtil.getText(element, "Value");
				}
			}
		}
	}
	return res;
}