String.prototype.isEmpty=function(){return ((this.replace(/ /g, "").length==0)?true:false);}
var webFXTreeConfig = {
	rootIcon0        : 'foldericon.png',
	openRootIcon0    : 'openfoldericon.png',
	folderIcon0     : 'foldericon.png',
	openFolderIcon0  : 'openfoldericon.png',
	fileIcon0        : 'file.png',
	iIcon0           : 'I.png',
	lIcon0           : 'L.png',
	lMinusIcon0      : 'Lminus.png',
	lPlusIcon0       : 'Lplus.png',
	tIcon0           : 'T.png',
	tMinusIcon0      : 'Tminus.png',
	tPlusIcon0       : 'Tplus.png',
	blankIcon0       : 'blank.png',

	rootIcon        : 'foldericon.png',
	openRootIcon    : 'openfoldericon.png',
	folderIcon      : 'foldericon.png',
	openFolderIcon  : 'openfoldericon.png',
	fileIcon        : 'file.png',
	iIcon           : 'I.png',
	lIcon           : 'L.png',
	lMinusIcon      : 'Lminus.png',
	lPlusIcon       : 'Lplus.png',
	tIcon           : 'T.png',
	tMinusIcon      : 'Tminus.png',
	tPlusIcon       : 'Tplus.png',
	blankIcon       : 'blank.png',
	defaultText     : 'Tree Item',
	defaultAction   : 'javascript:void(0);',
	defaultBehavior : 'classic',
	usePersistence	: true,
	isDisabled      : true,
	isRadio         : false,
	isRelate        : true,
	needRoot        : true,
	actionTarget    : '_self'
};

var webFXTreeHandler = {
	selectedId:null,
	subObj    :null,
	idCounter : 0,
	idPrefix  : "webfx-tree-object-",
	all       : {},
	behavior  : null,
	selected  : null,
	onSelect  : null, /* should be part of tree, not handler */
	getId     : function() { return this.idPrefix + this.idCounter++; },
	toggle    : function (oItem) { this.all[oItem.id.replace('-plus','')].toggle(); },
	select    : function (oItem) { this.all[oItem.id.replace('-icon','')].select(); },
	focus     : function (oItem) { this.all[oItem.id.replace('-anchor','')].focus(); },
	blur      : function (oItem) { this.all[oItem.id.replace('-anchor','')].blur(); },
	keydown   : function (oItem, e) { return this.all[oItem.id].keydown(e.keyCode); },
	checked   : function (oItem) { return this.all[oItem.id.replace('-checked','')].checked(oItem.checked); },
	insertHTMLBeforeEnd	:	function (oElement, sHTML) {
		if (oElement.insertAdjacentHTML != null) {
			oElement.insertAdjacentHTML("BeforeEnd", sHTML)
			return;
		}
		var df;	// DocumentFragment
		var r = oElement.ownerDocument.createRange();
		r.selectNodeContents(oElement);
		r.collapse(false);
		df = r.createContextualFragment(sHTML);
		oElement.appendChild(df);
	}
};
//var selectedID = null;
//var subObj = null;

/*
 * WebFXTreeAbstractNode class
 */

function WebFXTreeAbstractNode(sText, sAction) {
	this.childNodes  = [];
	this.id     = webFXTreeHandler.getId();
	this.text   = sText || webFXTreeConfig.defaultText;
	this.action = sAction || webFXTreeConfig.defaultAction;
	this._last  = false;
	webFXTreeHandler.all[this.id] = this;
}

/*
 * To speed thing up if you're adding multiple nodes at once (after load)
 * use the bNoIdent parameter to prevent automatic re-indentation and call
 * the obj.ident() method manually once all nodes has been added.
 */

WebFXTreeAbstractNode.prototype.add = function (node, bNoIdent) {
	node.parentNode = this;
	this.childNodes[this.childNodes.length] = node;
	var root = this;
	if (this.childNodes.length >= 2) {
		this.childNodes[this.childNodes.length - 2]._last = false;
	}
	while (root.parentNode) { root = root.parentNode; }
	if (root.rendered) {
		if (this.childNodes.length >= 2) {
			document.getElementById(this.childNodes[this.childNodes.length - 2].id + '-plus').src = ((this.childNodes[this.childNodes.length -2].folder)?((this.childNodes[this.childNodes.length -2].open)?webFXTreeConfig.tMinusIcon:webFXTreeConfig.tPlusIcon):webFXTreeConfig.tIcon);
			this.childNodes[this.childNodes.length - 2].plusIcon = webFXTreeConfig.tPlusIcon;
			this.childNodes[this.childNodes.length - 2].minusIcon = webFXTreeConfig.tMinusIcon;
			this.childNodes[this.childNodes.length - 2]._last = false;
		}
		this._last = true;
		var foo = this;
		while (foo.parentNode) {
			for (var i = 0; i < foo.parentNode.childNodes.length; i++) {
				if (foo.id == foo.parentNode.childNodes[i].id) { break; }
			}
			if (i == foo.parentNode.childNodes.length - 1) { foo.parentNode._last = true; }
			else { foo.parentNode._last = false; }
			foo = foo.parentNode;
		}
		webFXTreeHandler.insertHTMLBeforeEnd(document.getElementById(this.id + '-cont'), node.toString());
		if ((!this.folder) && (!this.openIcon)) {
			this.icon = webFXTreeConfig.folderIcon;
			this.openIcon = webFXTreeConfig.openFolderIcon;
		}
		if (!this.folder) { this.folder = true; this.collapse(true); }
		if (!bNoIdent) { this.indent(); }
	}
	return node;
}

WebFXTreeAbstractNode.prototype.toggle = function() {
	if (this.folder) {
		if (this.open) {
	                this.collapse();
                }
		else { this.expand(); }
}	}

WebFXTreeAbstractNode.prototype.select = function() {
	document.getElementById(this.id + '-anchor').focus();
}

WebFXTreeAbstractNode.prototype.deSelect = function() {
	document.getElementById(this.id + '-anchor').className = '';
	webFXTreeHandler.selected = null;
}

WebFXTreeAbstractNode.prototype.focus = function() {
	if ((webFXTreeHandler.selected) && (webFXTreeHandler.selected != this)) { webFXTreeHandler.selected.deSelect(); }
	webFXTreeHandler.selected = this;
	if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.openIcon; }
	document.getElementById(this.id + '-anchor').className = 'selected';
	document.getElementById(this.id + '-anchor').focus();
	if (webFXTreeHandler.onSelect) { webFXTreeHandler.onSelect(this); }
}

WebFXTreeAbstractNode.prototype.blur = function() {
	if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.icon; }
	document.getElementById(this.id + '-anchor').className = 'selected-inactive';
}

WebFXTreeAbstractNode.prototype.doExpand = function() {
	if (webFXTreeHandler.behavior == 'classic') { document.getElementById(this.id + '-icon').src = this.openIcon; }
	if (this.childNodes.length) {
            var str=document.getElementById(this.id+'-cont').innerHTML;
            if(str.isEmpty()){
               for (var i = 0; i < this.childNodes.length; i++) {
		   str += this.childNodes[i].toString(i,this.childNodes.length);
               }
               document.getElementById(this.id+'-cont').innerHTML=str;
            }
            document.getElementById(this.id + '-cont').style.display = 'block';
        }
	this.open = true;
}

WebFXTreeAbstractNode.prototype.doCollapse = function() {
	if (webFXTreeHandler.behavior == 'classic') { document.getElementById(this.id + '-icon').src = this.icon; }
	if (this.childNodes.length) { document.getElementById(this.id + '-cont').style.display = 'none'; }
	this.open = false;
}

WebFXTreeAbstractNode.prototype.expandAll = function() {
	this.expandChildren();
	if ((this.folder) && (!this.open)) { this.expand(); }
}

WebFXTreeAbstractNode.prototype.expandChildren = function() {
	for (var i = 0; i < this.childNodes.length; i++) 
	{
		this.childNodes[i].expandAll();		  
	}
}

WebFXTreeAbstractNode.prototype.collapseAll = function() {
	this.collapseChildren();
	if ((this.folder) && (this.open)) { this.collapse(true); }
}

WebFXTreeAbstractNode.prototype.collapseChildren = function() {
	for (var i = 0; i < this.childNodes.length; i++) {
		this.childNodes[i].collapseAll();
} }

WebFXTreeAbstractNode.prototype.indent = function(lvl, del, last, level, nodesLeft) {
	/*
	 * Since we only want to modify items one level below ourself,
	 * and since the rightmost indentation position is occupied by
	 * the plus icon we set this to -2
	 */
	if (lvl == null) { lvl = -2; }
	var state = 0;
	for (var i = this.childNodes.length - 1; i >= 0 ; i--) {
		state = this.childNodes[i].indent(lvl + 1, del, last, level);
		if (state) { return; }
	}
	if (del) {
		if ((level >= this._level) && (document.getElementById(this.id + '-plus'))) {
			if (this.folder) {
				document.getElementById(this.id + '-plus').src = (this.open)?webFXTreeConfig.lMinusIcon:webFXTreeConfig.lPlusIcon;
				this.plusIcon = webFXTreeConfig.lPlusIcon;
				this.minusIcon = webFXTreeConfig.lMinusIcon;
			}
			else if (nodesLeft) { document.getElementById(this.id + '-plus').src = webFXTreeConfig.lIcon; }
			return 1;
	}	}
	var foo = document.getElementById(this.id + '-indent-' + lvl);
	if (foo) {
		if ((foo._last) || ((del) && (last))) { foo.src =  webFXTreeConfig.blankIcon; }
		else { foo.src =  webFXTreeConfig.iIcon; }
	}
	return 0;
}

/*
 * WebFXTree class
 */

function WebFXTree(sText, sAction, sBehavior, sIcon, sOpenIcon) {
	this.base = WebFXTreeAbstractNode;
	this.base(sText, sAction);
	this.icon      = sIcon || webFXTreeConfig.rootIcon;
	this.openIcon  = sOpenIcon || webFXTreeConfig.openRootIcon;
	/* Defaults to open */
	this.open  = true;
	this.folder    = true;
	this.rendered  = false;
	this.onSelect  = null;
	if (!webFXTreeHandler.behavior) {  webFXTreeHandler.behavior = sBehavior || webFXTreeConfig.defaultBehavior; }
}

WebFXTree.prototype = new WebFXTreeAbstractNode;

WebFXTree.prototype.setDisabled = function (boolDis) {
	webFXTreeConfig.isDisabled =  boolDis;
};

WebFXTree.prototype.setIsRadio = function (boolBtnType) {
	webFXTreeConfig.isRadio =  boolBtnType;
};

WebFXTree.prototype.setIsRelate = function (boolRel) {
	webFXTreeConfig.isRelate =  boolRel;
};

WebFXTree.prototype.setNeedRoot = function (boolRel) {
	webFXTreeConfig.needRoot =  boolRel;
};

WebFXTree.prototype.setActionTarget = function (sTarget) {
	webFXTreeConfig.actionTarget =  sTarget;
};

WebFXTree.prototype.setImgPath = function (sPath) {
	sPath=sPath+"/";
	webFXTreeConfig.rootIcon=sPath+webFXTreeConfig.rootIcon0;
	webFXTreeConfig.openRootIcon=sPath+webFXTreeConfig.openRootIcon0;
	webFXTreeConfig.folderIcon=sPath+webFXTreeConfig.folderIcon0;
	webFXTreeConfig.openFolderIcon=sPath+webFXTreeConfig.openFolderIcon0;
	webFXTreeConfig.fileIcon=sPath+webFXTreeConfig.fileIcon0;
	webFXTreeConfig.iIcon=sPath+webFXTreeConfig.iIcon0;
	webFXTreeConfig.lIcon=sPath+webFXTreeConfig.lIcon0;
	webFXTreeConfig.lMinusIcon=sPath+webFXTreeConfig.lMinusIcon0;
	webFXTreeConfig.lPlusIcon=sPath+webFXTreeConfig.lPlusIcon0;
	webFXTreeConfig.tIcon=sPath+webFXTreeConfig.tIcon0;
	webFXTreeConfig.tMinusIcon=sPath+webFXTreeConfig.tMinusIcon0;
	webFXTreeConfig.tPlusIcon=sPath+webFXTreeConfig.tPlusIcon0;
	webFXTreeConfig.blankIcon=sPath+webFXTreeConfig.blankIcon0;
};
//do this before setImgPath
WebFXTree.prototype.setNoLine = function (bNoLine) {
	if(bNoLine){
		var sPrefix="noline_";
		//webFXTreeConfig.rootIcon0=sPrefix+webFXTreeConfig.rootIcon0;
		//webFXTreeConfig.openRootIcon0=sPrefix+webFXTreeConfig.openRootIcon0;
		//webFXTreeConfig.folderIcon0=sPrefix+webFXTreeConfig.folderIcon0;
		//webFXTreeConfig.openFolderIcon0=sPrefix+webFXTreeConfig.openFolderIcon0;
		//webFXTreeConfig.fileIcon0=sPrefix+webFXTreeConfig.fileIcon0;
		webFXTreeConfig.iIcon0=sPrefix+webFXTreeConfig.iIcon0;
		webFXTreeConfig.lIcon0=sPrefix+webFXTreeConfig.lIcon0;
		webFXTreeConfig.lMinusIcon0=sPrefix+webFXTreeConfig.lMinusIcon0;
		webFXTreeConfig.lPlusIcon0=sPrefix+webFXTreeConfig.lPlusIcon0;
		webFXTreeConfig.tIcon0=sPrefix+webFXTreeConfig.tIcon0;
		webFXTreeConfig.tMinusIcon0=sPrefix+webFXTreeConfig.tMinusIcon0;
		webFXTreeConfig.tPlusIcon0=sPrefix+webFXTreeConfig.tPlusIcon0;
		//webFXTreeConfig.blankIcon0=sPrefix+webFXTreeConfig.blankIcon0;
	}
}

WebFXTree.prototype.clearChk = function (obj) {
    if(webFXTreeHandler.selectedID!=null)
    {
        var objself=document.getElementById(webFXTreeHandler.selectedID+"-checked");
        if(objself!=null)
		{
		    webFXTreeHandler.subObj.isChecked=false;		    
		    objself.checked=false;		    
		}      
    }
  
//	for(var i=0;i<obj.childNodes.length;i++){
//		var subObj = obj.childNodes[i];
//		var objself=document.getElementById(subObj.id+"-checked");
//		if(objself!=null){
//			subObj.isChecked=false;
//			objself.checked=false;
//		}
//		if(subObj.folder){
//			this.clearChk(subObj);
//		}
//	}
};

WebFXTree.prototype.allChk = function (obj) {
	for(var i=0;i<obj.childNodes.length;i++){
		var subObj = obj.childNodes[i];
		var objself=document.getElementById(subObj.id+"-checked");
		if(objself!=null){
			subObj.isChecked=true;
			objself.checked=true;
		}
		if(subObj.folder){
			this.allChk(subObj);
		}
	}
};

WebFXTree.prototype.setBehavior = function (sBehavior) {
	webFXTreeHandler.behavior =  sBehavior;
};

WebFXTree.prototype.getBehavior = function (sBehavior) {
	return webFXTreeHandler.behavior;
};

WebFXTree.prototype.getSelected = function() {
	if (webFXTreeHandler.selected) { return webFXTreeHandler.selected; }
	else { return null; }
}

WebFXTree.prototype.remove = function() { }

WebFXTree.prototype.expand = function() {
	this.doExpand();
}

WebFXTree.prototype.collapse = function(b) {
	if (!b) { this.focus(); }
	this.doCollapse();
}

WebFXTree.prototype.getFirst = function() {
	return null;
}

WebFXTree.prototype.getLast = function() {
	return null;
}

WebFXTree.prototype.getNextSibling = function() {
	return null;
}

WebFXTree.prototype.getPreviousSibling = function() {
	return null;
}

WebFXTree.prototype.keydown = function(key) {
	if (key == 39) {
		if (!this.open) { this.expand(); }
		else if (this.childNodes.length) { this.childNodes[0].select(); }
		return false;
	}
	if (key == 37) { this.collapse(); return false; }
	if ((key == 40) && (this.open) && (this.childNodes.length)) { this.childNodes[0].select(); return false; }
	return true;
}

WebFXTree.prototype.toString = function() {
	var str = "";
	if(webFXTreeConfig.needRoot){
		if(this.action!="" && this.action!="javascript:void(0);"){
		  str+="<div nowrap id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" onkeydown=\"return webFXTreeHandler.keydown(this, event)\">";
		  str += "<img id=\"" + this.id + "-icon\" class=\"webfx-tree-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\"webFXTreeHandler.select(this);\"><a target=\""+webFXTreeConfig.actionTarget+"\" href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onfocus=\"webFXTreeHandler.focus(this);\" onblur=\"webFXTreeHandler.blur(this);\">" + this.text + "</a></div>";
	  }
	  else{
	  	str+="<div id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" onkeydown=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\">";
		  str += "<img id=\"" + this.id + "-icon\" class=\"webfx-tree-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\"webFXTreeHandler.select(this);\"><span nowrap id=\"" + this.id + "-anchor\" style=\"word-break:keep-all;cursor:default;margin-left: 3px;padding: 0px 2px 0px 2px;font-size:12px\">" + this.text + "</span></div>";
	  }
	}
	str += "<div nowrap id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">";
	for (var i = 0; i < this.childNodes.length; i++) {
		str += this.childNodes[i].toString(i, this.childNodes.length);
	}
	str += "</div>";
	this.rendered = true;
	return str;
};

/*
 * WebFXTreeItem class
 */

function WebFXTreeItem(sText, sAction, eParent, sIcon, sOpenIcon, sData ,
	isChecked,isLast,CanEdited,isValid) {
	this.base = WebFXTreeAbstractNode;
	this.base(sText, sAction);
	/* Defaults to close */
	this.open = false;
	if (sIcon) { this.icon = sIcon; }
	if (sOpenIcon) { this.openIcon = sOpenIcon; }
	if (eParent) { eParent.add(this); }
	if (sData) { this.data = sData; }
	else this.data = "";
	if (isChecked) { this.isChecked = isChecked; }
	else this.isChecked = false;
  if(isLast)
   	this.isLast=true;
  else
  this.isLast=false;
    if(CanEdited)
  this.CanEdited=CanEdited;
	this.isValid=isValid;
}

WebFXTreeItem.prototype = new WebFXTreeAbstractNode;

//WebFXTreeItem.prototyp.getFullPath=function(){
//	if(this.parentNode)
		//return this.parentNode.getFullPath()+"/"+this.text;
//}

WebFXTreeItem.prototype.remove = function() {
	var iconSrc = document.getElementById(this.id + '-plus').src;
	var parentNode = this.parentNode;
	var prevSibling = this.getPreviousSibling(true);
	var nextSibling = this.getNextSibling(true);
	var folder = this.parentNode.folder;
	var last = ((nextSibling) && (nextSibling.parentNode) && (nextSibling.parentNode.id == parentNode.id))?false:true;
	this.getPreviousSibling().focus();
	this._remove();
	if (parentNode.childNodes.length == 0) {
		document.getElementById(parentNode.id + '-cont').style.display = 'none';
		parentNode.doCollapse();
		parentNode.folder = false;
		parentNode.open = false;
	}
	if (!nextSibling || last) { parentNode.indent(null, true, last, this._level, parentNode.childNodes.length); }
	if ((prevSibling == parentNode) && !(parentNode.childNodes.length)) {
		prevSibling.folder = false;
		prevSibling.open = false;
		iconSrc = document.getElementById(prevSibling.id + '-plus').src;
		iconSrc = iconSrc.replace('minus', '').replace('plus', '');
		document.getElementById(prevSibling.id + '-plus').src = iconSrc;
		document.getElementById(prevSibling.id + '-icon').src = webFXTreeConfig.fileIcon;
	}
	if (document.getElementById(prevSibling.id + '-plus')) {
		if (parentNode == prevSibling.parentNode) {
			iconSrc = iconSrc.replace('minus', '').replace('plus', '');
			document.getElementById(prevSibling.id + '-plus').src = iconSrc;
}	}	}

WebFXTreeItem.prototype._remove = function() {
	for (var i = this.childNodes.length - 1; i >= 0; i--) {
		this.childNodes[i]._remove();
 	}
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) {
			for (var j = i; j < this.parentNode.childNodes.length; j++) {
				this.parentNode.childNodes[j] = this.parentNode.childNodes[j+1];
			}
			this.parentNode.childNodes.length -= 1;
			if (i + 1 == this.parentNode.childNodes.length) { this.parentNode._last = true; }
			break;
	}	}
	webFXTreeHandler.all[this.id] = null;
	var tmp = document.getElementById(this.id);
	if (tmp) { tmp.parentNode.removeChild(tmp); }
	tmp = document.getElementById(this.id + '-cont');
	if (tmp) { tmp.parentNode.removeChild(tmp); }
}

WebFXTreeItem.prototype.expand = function() {
	this.doExpand();
	document.getElementById(this.id + '-plus').src = this.minusIcon;
}

WebFXTreeItem.prototype.collapse = function(b) {
	if (!b) { this.focus(); }
	this.doCollapse();
	document.getElementById(this.id + '-plus').src = this.plusIcon;
}

WebFXTreeItem.prototype.getFirst = function() {
	return this.childNodes[0];
}

WebFXTreeItem.prototype.getLast = function() {
	if (this.childNodes[this.childNodes.length - 1].open) { return this.childNodes[this.childNodes.length - 1].getLast(); }
	else { return this.childNodes[this.childNodes.length - 1]; }
}

WebFXTreeItem.prototype.getNextSibling = function() {
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) { break; }
	}
	if (++i == this.parentNode.childNodes.length) { return this.parentNode.getNextSibling(); }
	else { return this.parentNode.childNodes[i]; }
}

WebFXTreeItem.prototype.getPreviousSibling = function(b) {
	for (var i = 0; i < this.parentNode.childNodes.length; i++) {
		if (this == this.parentNode.childNodes[i]) { break; }
	}
	if (i == 0) { return this.parentNode; }
	else {
		if ((this.parentNode.childNodes[--i].open) || (b && this.parentNode.childNodes[i].folder)) { return this.parentNode.childNodes[i].getLast(); }
		else { return this.parentNode.childNodes[i]; }
} }

WebFXTreeItem.prototype.keydown = function(key) {
	if ((key == 39) && (this.folder)) {
		if (!this.open) { this.expand(); }
		else { this.getFirst().select(); }
		return false;
	}
	else if (key == 37) {
		if (this.open) { this.collapse(); }
		else { this.parentNode.select(); }
		return false;
	}
	else if (key == 40) {
		if (this.open) { this.getFirst().select(); }
		else {
			var sib = this.getNextSibling();
			if (sib) { sib.select(); }
		}
		return false;
	}
	else if (key == 38) { this.getPreviousSibling().select(); return false; }
	return true;
}

WebFXTreeItem.prototype.checked = function(isChecked) {
	if(webFXTreeConfig.isRadio){
		UltraTree.clearChk(UltraTree);
		this.isChecked=true;
		webFXTreeHandler.subObj = this;
		var objself=document.getElementById(this.id+"-checked");
		webFXTreeHandler.selectedID = this.id;
		if(objself!=null)
			objself.checked=true;
	}
	else{
		this.isChecked=isChecked;
		if(webFXTreeConfig.isRelate){
			this.isChecked=isChecked;
	  	for (var i = 0; i < this.childNodes.length; i++) {
	  		var objself=document.getElementById(this.childNodes[i].id+"-checked");
	  		if(objself!=null){
	  			this.childNodes[i].isChecked=isChecked;
					objself.checked = isChecked;
				}
				if(this.childNodes[i].folder){this.childNodes[i].checked(isChecked);}
			}
			var parentObj = this.parentNode;
			while(!isChecked && parentObj.parentNode){
				var objself=document.getElementById(parentObj.id+"-checked");
				if(objself!=null){
					parentObj.isChecked=isChecked;
					objself.checked = isChecked;
				}
				parentObj = parentObj.parentNode;
			}
			while(isChecked && parentObj.parentNode){
				var isSelAll=1;
				for(var i=0;i<parentObj.childNodes.length;i++){
					var objself=document.getElementById(parentObj.childNodes[i].id+"-checked");
					if(objself!=null && objself.checked != isChecked){
						isSelAll = 0;
						break;
					}
				}
				var objtmp=document.getElementById(parentObj.id+"-checked");
				if(isSelAll==1 && objtmp!=null)	{
					parentObj.isChecked=isChecked;
					objtmp.checked = isChecked;
				}
				parentObj = parentObj.parentNode;
			}
		}
	}
}

WebFXTreeItem.prototype.toString = function (nItem, nItemCount) {
	var foo = this.parentNode;
	var indent = '';
	if (nItem + 1 == nItemCount) { this.parentNode._last = true; }
	var i = 0;
	while (foo.parentNode) {
		indent = "<img id=\"" + this.id + "-indent-" + i + "\" src=\"" + ((foo.isLast)?webFXTreeConfig.blankIcon:webFXTreeConfig.iIcon) + "\">" + indent;
		i++;
    foo = foo.parentNode;
	}
	this._level = i;
	if (this.childNodes.length) {
		this.folder = true;
	}
	else { this.open = false; }
	if ((this.folder) || (webFXTreeHandler.behavior != 'classic')) {
		if (!this.icon) { this.icon = webFXTreeConfig.folderIcon; }
		if (!this.openIcon) { this.openIcon = webFXTreeConfig.openFolderIcon; }
	}
	else if (!this.icon) { this.icon = webFXTreeConfig.fileIcon; }
	var label = this.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	var str = "";
	if(this.action!="" && this.action!="javascript:void(0);"){
		str += "<div nowrap style=\"cursor:default;word-break:keep-all\" id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" onkeydown=\"return webFXTreeHandler.keydown(this, event)\">";
	}
	else{
		str += "<div nowrap style=\"cursor:default;word-break:keep-all\" id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" onkeydown=\"webFXTreeHandler.toggle()\">";
	}
	str += indent;
	str += "<img id=\"" + this.id + "-plus\" src=\"" + ((this.folder)?((this.open)?((this.parentNode._last)?webFXTreeConfig.lMinusIcon:webFXTreeConfig.tMinusIcon):((this.parentNode._last)?webFXTreeConfig.lPlusIcon:webFXTreeConfig.tPlusIcon)):((this.parentNode._last)?webFXTreeConfig.lIcon:webFXTreeConfig.tIcon)) + "\" onclick=\"webFXTreeHandler.toggle(this);\">"
	if(this.isChecked!=null){
    str += "<label for=\""+this.id+"-checked\"><input name=\"" + this.name + "\" value=\"" + this.data + "\" id=\""+ this.id + "-checked\" type='"+(webFXTreeConfig.isRadio?"radio":"checkbox")+"' ";
		if(webFXTreeConfig.isDisabled || !this.CanEdited){
      str += " disabled='true'";
		}
		if(this.isChecked)
		{	
		     if (webFXTreeHandler.subObj==null)
		     {
		     webFXTreeHandler.subObj=this;
		     webFXTreeHandler.selectedID=this.id;
		     }
			 str += " checked ";
		}
		str += " style='position:absolute;clip: rect(5 16 16 5);' onclick=\"webFXTreeHandler.checked(this);\" onfocus=\"this.blur();\">&nbsp;&nbsp;&nbsp;";
	}
	str += "<img id=\"" + this.id + "-icon\" class=\"webfx-tree-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\"webFXTreeHandler.select(this);\">";
	if(this.action!="" && this.action!="javascript:void(0);"){
		if(!this.isValid)
			str += "<a target=\""+webFXTreeConfig.actionTarget+"\" href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onfocus=\"webFXTreeHandler.focus(this);\" onblur=\"webFXTreeHandler.blur(this);\" style=\"color:#555555\">" + label + "</a>";
		else
			str += "<a target=\""+webFXTreeConfig.actionTarget+"\" href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onfocus=\"webFXTreeHandler.focus(this);\" onblur=\"webFXTreeHandler.blur(this);\">" + label + "</a>";
	}
	else{
		if(!this.isValid)
			str += "<span nowrap id=\"" + this.id + "-anchor\" style=\"cursor:default;color:#555555;margin-left: 3px;padding: 0px 2px 0px 2px;;font-size:12px\">" + label + "</span>";
		else
			str += "<span nowrap id=\"" + this.id + "-anchor\" style=\"cursor:default;margin-left: 3px;padding: 0px 2px 0px 2px;;font-size:12px\">" + label + "</span>";
	}
	str += "</div>";
	str += "<div id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">";
	for (var i = 0; i < this.childNodes.length; i++) {
		str += this.childNodes[i].toString(i,this.childNodes.length);
	}
	str += "</div>";
	this.plusIcon = ((this.parentNode._last)?webFXTreeConfig.lPlusIcon:webFXTreeConfig.tPlusIcon);
	this.minusIcon = ((this.parentNode._last)?webFXTreeConfig.lMinusIcon:webFXTreeConfig.tMinusIcon);
	return str;
}
