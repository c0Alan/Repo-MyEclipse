var xmlData = new ActiveXObject("Microsoft.XMLDOM");
var strLeafNode = "Leaf";
var UltraTree;
var selDataList = "";
var selNameList = "";
//get selected resultset
function getSelCodeList(){
	selDataList = "";
	for(var i=0;i<UltraTree.childNodes.length;i++){
		getSelectedCode(UltraTree.childNodes[i]);
	}
	return selDataList.substring(1,selDataList.length);
}
function getSelectedCode(treeNode){
	if(treeNode.isChecked)
		selDataList += ","+treeNode.data;
	if(treeNode.getFirst()){
		for(var i=0;i<treeNode.childNodes.length;i++){
			getSelectedCode(treeNode.childNodes[i]);
		}
	}
}

function getSelNameList(){
	selNameList = "";
	for(var i=0;i<UltraTree.childNodes.length;i++){
		getSelectedName(UltraTree.childNodes[i]);
	}
	return selNameList.substring(1,selNameList.length);
}
function getSelectedName(treeNode){
	if(treeNode.isChecked)
		selNameList += ","+treeNode.text;
	if(treeNode.getFirst()){
		for(var i=0;i<treeNode.childNodes.length;i++){
			getSelectedName(treeNode.childNodes[i]);
		}
	}
}

function saveChk(inputname,obj) {
	for(var i=0;i<obj.childNodes.length;i++){
		var subObj = obj.childNodes[i];
		var objself=document.getElementById(subObj.id+"-checked");
		if(objself!=null && objself.checked==true){
			//alert(subObj.text);
			objself.name=inputname;
			objself.id=inputname;
			objself.value=subObj.data;
			//alert(objself.name+"="+objself.value);
		}
		if(subObj.folder){
			this.saveChk(inputname,subObj);
		}
	}
};
//load from xml string
function loadItemFromXml(xmlNodeList,treeNode){
	for(var i=0;i<xmlNodeList.length;i++){
		var Item = new WebFXTreeItem(xmlNodeList[i].getAttribute('text'));
		if(xmlNodeList[i].getAttribute('checked')=="0")
			Item.isChecked=null;
		else
			Item.isChecked = (xmlNodeList[i].getAttribute('checked')=="1")?true:false;
    Item.CanEdited = (xmlNodeList[i].getAttribute('CanEdited')=="1")?true:false;
    Item.isLast=(i+1==xmlNodeList.length)?true:false;
		switch(xmlNodeList[i].nodeName){
			case strLeafNode:
  				Item.data = xmlNodeList[i].getAttribute('data');
  				Item.icon = "images/user.gif";
  				break;
  		default:
  				Item.data = xmlNodeList[i].getAttribute('data');
  				Item.icon = "images/group_close.gif";
  				Item.openIcon = "images/group.gif";
  				break;
		}
		treeNode.add(Item);
		if(xmlNodeList[i].nodeName!=strLeafNode)
			loadItemFromXml(xmlNodeList[i].childNodes,Item);
	}
}
function loadTreeFromXml(str,disabled){
	xmlData.loadXML(str);
	if (document.getElementById) {
		if( xmlData == null || xmlData.xml=="" || xmlData.documentElement == null
			|| xmlData.documentElement.xml=="") return false;
		UltraTree = new WebFXTree(xmlData.documentElement.getAttribute('name'));
		UltraTree.setBehavior('classic');
		UltraTree.icon = "images/home_close.gif";
		UltraTree.openIcon = "images/home_open.gif";
		UltraTree.setDisabled(xmlData.documentElement.getAttribute('disabled')=='1');
		UltraTree.setIsRadio(xmlData.documentElement.getAttribute('isRadio')=='1');
		UltraTree.setIsRelate(xmlData.documentElement.getAttribute('isRelate')=='1');
		UltraTree.setNeedRoot(xmlData.documentElement.getAttribute('needRoot')=='1');
		loadItemFromXml(xmlData.documentElement.childNodes,UltraTree);
		document.write(UltraTree);
		if(xmlData.documentElement.getAttribute('expandAll')=='1')
			UltraTree.expandAll();
	}
}

//load
function loadTree(name,disabled,isRadio,isRelate,needRoot,imgPath,sTarget,noLine,sAction){
	UltraTree = new WebFXTree(name);
	//UltraTree.setNoLine(noLine);
	UltraTree.setNoLine(true);
	UltraTree.setImgPath(imgPath);
	UltraTree.setBehavior('classic');
	UltraTree.icon = imgPath+"/folder.gif";
	UltraTree.openIcon = imgPath+"/folderopen.gif";
	UltraTree.setDisabled(disabled);
	UltraTree.setIsRadio(isRadio);
	UltraTree.setIsRelate(isRelate);
	UltraTree.setNeedRoot(needRoot);
	if(sAction){
		UltraTree.action=sAction;
	}
	UltraTree.setActionTarget(sTarget);
	return UltraTree;
}

function loadItem(parent,text,data,isChk,canEdited,isLast,nodeType,sAction,imgPath,isValid, sTarget){
	if(isValid=="false" || isValid==false)
		isValid=false;
	else
		isValid=true;
	
	var Item = new WebFXTreeItem(text);
	if(isChk==null || isChk=="null")
		Item.isChecked=null;
	else
		Item.isChecked = isChk;
		
	if(sTarget==null || sTarget=="")
		Item.target=null; 	
	else{
		Item.target=sTarget;
	}
	
  Item.CanEdited = canEdited;
  Item.isLast=true;//isLast;
  Item.data=data;
  Item.isValid=isValid;
  Item.action=sAction;
	switch(nodeType){
		case 0://leaf,user
			Item.icon = imgPath+"/emp.gif";
			Item.openIcon=imgPath+"/emp.gif";
  		break;
  	case 1://unit
  		Item.icon = imgPath+"/corp.gif";
  		Item.openIcon = imgPath+"/corp_open.gif";
  		break;
  	case 2://dept
			Item.icon = imgPath+"/dept.gif";
  		Item.openIcon = imgPath+"/dept.gif";
  		break;
  	case 3://
			Item.icon = imgPath+"/grp.gif";
  		Item.openIcon = imgPath+"/grp.gif";
  		break;
  	case 4:
			Item.icon = imgPath+"/file.gif";
  		Item.openIcon = imgPath+"/file.gif";
  		break;
  	case 5:
			Item.icon = imgPath+"/close.gif";
  		Item.openIcon = imgPath+"/open.gif";
  		break;
  	case 6:
			Item.icon = imgPath+"/folder.gif";
  		Item.openIcon = imgPath+"/folderopen.gif";
  		break;
  	case 7:
			Item.icon = imgPath+"/page.gif";
  		Item.openIcon = imgPath+"/page.gif";
  		break;
  	case 8:
			Item.icon = imgPath+"/flag.gif";
  		Item.openIcon = imgPath+"/flag.gif";
  		break;
  	case 9:
			Item.icon = imgPath+"/edit.gif";
  		Item.openIcon = imgPath+"/edit.gif";
  		break;
  	default://4
  		Item.icon = imgPath+"/file.gif";
  		Item.openIcon = imgPath+"/file.gif";
	}
	parent.add(Item);
	return Item;
}

function showTree(isExpand){
	document.write(UltraTree);
	if(isExpand)
		UltraTree.expandAll();
}

//tax public
function setValue(bSingle, sVarName, sCorpName, sDeptName, sEmpName)
{
  var sInnerValue = "";
  var sTitle = getSelNameList().replace("/,/g",";");
  var sTmpName=sCorpName;
  if(sCorpName!=null && sCorpName!="null")
    sTmpName=sCorpName;
  else if(sDeptName!=null && sDeptName!="null")
    sTmpName=sDeptName;
  else
    sTmpName=sEmpName;
  var selCodeList=getSelCodeList();
  var aryCode=selCodeList.split(',');
  //alert(selCodeList);
  for(var i=0;i<aryCode.length;i++){
    if(bSingle && i==0)
      sInnerValue+="<input type=\"hidden\" name=\""
      	+sTmpName+"\" value=\""+aryCode[i]+"\">";
    else{
      sInnerValue+="<input type=\"hidden\" name=\""
      	+sTmpName+"["+i+"]\" value=\""+aryCode[i]+"\">";
      sInnerValue+="<input type=\"hidden\" name=\""
      	+sTmpName+"_Tmp\" value=\""+aryCode[i]+"\">";
    }
  }

  if (sTitle == "")
    sTitle = "请选择......";
  // 设置名称（link）
  var objA = opener.document.all(sVarName + "_Link");
  objA.innerText = sTitle;
  // 设置值（hiddens）
  var objResult = opener.document.all(sVarName + "_Values");
  objResult.innerHTML = sInnerValue;
  window.close();
}

function checkAll(el){
	if(el.checked)
		Root.allChk(Root);
	else
		Root.clearChk(Root);
}
