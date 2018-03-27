/**
 文件名:
 sanlib/js/xtree.js

 用途:
 树形菜单控件。

 用法：
 tree=new XTree(window, "parentDiv","100%","100%",0);
 tree.insertNewItem(...); //用脚本添加菜单节点
 或者
 var root = tree.getRootItem();
 root.appendChild(...);   //添加子节点
 root.appendFriend(...);  //添加兄弟节点
 ...
 或者
 tree.loadXML(url); // 从xml加载树形菜单
 如果要让xtree的节点可拖放调整位置，必须在树创建后节点添加之前调用：
 tree.enableDragAndDrop(true);
 
 */

/**
 * xml树形结构加载器。
 */
function XTreeLoader(wnd, funcObject, dhtmlObject){
    this.wnd = wnd ? wnd : window;
    this.doc = this.wnd.document;
    this.xmlDoc = "";
    this.onloadAction = funcObject || null;
    this.mainObject = dhtmlObject || null;
    return this;
}

XTreeLoader.prototype.waitLoadFunction = function(dhtmlObject){
    this.check = function(){
        if (!dhtmlObject.xmlDoc.readyState) {
            dhtmlObject.onloadAction(dhtmlObject.mainObject);
        } else {
            if (dhtmlObject.xmlDoc.readyState != 4) {
                return false;
            } else {
                dhtmlObject.onloadAction(dhtmlObject.mainObject);
            }
        }
    };
    return this.check;
};
// 从xml中取得文档根节点。
XTreeLoader.prototype.getXMLTopNode = function(tagName){
    var z;
    if (this.xmlDoc.responseXML) {
        var temp = this.xmlDoc.responseXML.getElementsByTagName(tagName);
        z = temp[0];
    } else {
        z = this.xmlDoc.documentElement;
    }
    if (z) {
        return z;
    }
    // alert("不正确的XML.");
    return this.doc.createElement("DIV");
};
// 加载xml格式的字串.
XTreeLoader.prototype.loadXMLString = function(xmlString){
    try {
        var parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xmlString, "text/xml");
    } catch (e) {
        this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        this.xmlDoc.loadXML(xmlString);
    }
    this.onloadAction(this.mainObject);
};
// 从指定url加载xml树。
XTreeLoader.prototype.loadXML = function(filePath){
    try {
        var xmlReq = new XMLHttpRequest();
        xmlReq.open("GET", xmlfilepath, false);
        xmlReq.send(null);
        this.xmlDoc = xmlReq.responseXML;
        return;
    } catch (e) {
        try {
            this.xmlDoc = this.doc.implementation.createDocument("", "", null);
            this.xmlDoc.onload = new this.waitLoadFunction(this);
        } catch (e) {
            this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            this.xmlDoc.async = "true";
            this.xmlDoc.onreadystatechange = new this.waitLoadFunction(this);
        }
        this.xmlDoc.load(filePath);
    }
};
function callerFunction(funcObject, dhtmlObject){
    this.handler = function(e){
        if (!e) {
            e = event;
        }
        funcObject(e, dhtmlObject);
        return true;
    };
    return this.handler;
}
function getAbsoluteLeft(htmlObject){
    var xPos = htmlObject.offsetLeft;
    var temp = htmlObject.offsetParent;
    while (temp != null) {
        xPos += temp.offsetLeft;
        temp = temp.offsetParent;
    }
    return xPos;
}
function getAbsoluteTop(htmlObject){
    var yPos = htmlObject.offsetTop;
    var temp = htmlObject.offsetParent;
    while (temp != null) {
        yPos += temp.offsetTop;
        temp = temp.offsetParent;
    }
    return yPos;
}
function convertStringToBoolean(inputString){
    if (typeof(inputString) == "boolean")
        return inputString;
    if (typeof(inputString) == "string")
        inputString = inputString.toLowerCase();
    switch (inputString) {
        case "1" :
        case "true" :
        case "yes" :
        case "y" :
        case 1 :
        case true :
            return true;
            break;
        default :
            return false;
    }
}
function getUrlSymbol(str){
    if (str.indexOf("?") != -1)
        return "&"
    else
        return "?"
}
/**
 * 控制树形节点可拖放的对象
 */
function XTreeDragAndDrop(wnd){
    this.wnd = wnd ? wnd : window;
    this.doc = this.wnd.document;
    this.lastLanding = 0;
    this.dragNode = 0;
    this.dragStartNode = 0;
    this.dragStartObject = 0;
    this.tempDOMU = null;
    this.tempDOMM = null;
    this.waitDrag = 0;
    this.enabled = true;
    this.dropEnabled = true;
    // if (this.wnd.dhtmlDragAndDrop)return this.wnd.dhtmlDragAndDrop;
    this.wnd.dhtmlDragAndDrop = this;
    // return this;
}

XTreeDragAndDrop.prototype.removeDraggableItem = function(htmlNode){
    htmlNode.onmousedown = null;
    htmlNode.dragStarter = null;
    htmlNode.dragLanding = null;
}
XTreeDragAndDrop.prototype.addDraggableItem = function(htmlNode, dhtmlObject){
    var self = this;
    htmlNode.onmousedown = function(evt){
        self.preCreateDragCopy(evt, self.wnd, this)
    };
    htmlNode.dragStarter = dhtmlObject;
    this.addDragLanding(htmlNode, dhtmlObject);

}

XTreeDragAndDrop.prototype.addDragLanding = function(htmlNode, dhtmlObject){
    htmlNode.dragLanding = dhtmlObject;
}
XTreeDragAndDrop.prototype.preCreateDragCopy = function(evt, wnd, owner){
    var evt = evt ? evt : wnd.event;
    var dragger = wnd.dhtmlDragAndDrop;
    dragger.dragStartNode = owner;
    dragger.dragStartObject = owner.dragStarter;

    if (!dragger.dragStartObject)
        return;
    if (!dragger.dragStartObject.canDragAndDrop())
        return;

    // 回调树节点的onDragStart事件。
    var dragSrc = dragger.dragStartObject;
    var dragObj = dragger.dragStartNode.parentObject;
    var dragTarget = null;
    var dragTargetObj = null;
    var dndEvent = new DragAndDropEvent(dragSrc, dragObj, dragTarget,
        dragTargetObj);
    if (dragObj) {
        var dndResult = dragObj.onDragStart(dndEvent);
        if (dndResult && dndResult.cancelDnD) {
            dragger._cancelDrag();
            return;
        }
    }
    //
    if (dragger.waitDrag) {
        dragger.waitDrag = 0;
        wnd.document.body.onmouseup = dragger.tempDOMU;
        wnd.document.body.onmousemove = dragger.tempDOMM;
        return;
    }
    dragger.waitDrag = 1;
    dragger.tempDOMU = wnd.document.body.onmouseup;
    dragger.tempDOMM = wnd.document.body.onmousemove;
    wnd.document.body.onmouseup = function(e){
        dragger.preCreateDragCopy(e, wnd, owner)
    };
    wnd.document.body.onmousemove = function(e){
        dragger.callDrag(e, wnd)
    };

};

// callDrag在拖动过程中被调用
XTreeDragAndDrop.prototype.callDrag = function(e, wnd){
    var dragger = wnd.dhtmlDragAndDrop;
    if (!dragger.dragStartObject)
        return;
    if (!dragger.dragStartObject.canDragAndDrop())
        return;

    if (!e)
        e = wnd.event;
    if (!e.srcElement)
        var htmlObject = e.target;
    else
        htmlObject = e.srcElement;

    dragger.checkLanding(htmlObject);

    if (!dragger.dragNode) {
        dragger.dragNode = dragger.dragStartObject
                ._createDragNode(dragger.dragStartNode);
        wnd.document.body.appendChild(dragger.dragNode);
        wnd.document.body.onmouseup = function(evt){
            dragger.stopDrag(evt, wnd)
        };
        dragger.waitDrag = 0;
    }

    // 回调树节点的onDragOver事件。
    if (dragger.lastanding && dragger.lastLanding.parentObject) {
        var dragSrc = dragger.dragStartObject;
        var dragObj = dragger.dragStartNode.parentObject;
        var dragTarget = dragger.lastLanding.parentObject.getOwner();
        var dragTargetObj = dragger.lastLanding.parentObject;
        var dndEvent = new DragAndDropEvent(dragSrc, dragObj, dragTarget,
            dragTargetObj);

        var dndResult = dragObj.onDragOver(dndEvent);
        if (dndResult && dndResult.cancelDnD) {
            dragger._cancelDrag();
            return;
        }
    }
    //

    dragger.dragNode.style.left = e.clientX + 15 + wnd.document.body.scrollLeft;
    dragger.dragNode.style.top = e.clientY + 3 + wnd.document.body.scrollTop;
    dragger.dragNode.style.zIndex = 99999999;
}

XTreeDragAndDrop.prototype.checkLanding = function(htmlObject){
    if (htmlObject.dragLanding) {
        if (this.lastLanding)
            this.lastLanding.dragLanding._dragOut(this.lastLanding);
        this.lastLanding = htmlObject;
        this.lastLanding = this.lastLanding.dragLanding._dragIn(
            this.lastLanding, this.dragStartNode);
    } else {
        if (htmlObject.tagName != "BODY")
            this.checkLanding(htmlObject.parentNode);
        else {
            if (this.lastLanding)
                this.lastLanding.dragLanding._dragOut(this.lastLanding);
            this.lastLanding = 0;
        }
    }
}
// 当鼠标松开时被调用
XTreeDragAndDrop.prototype.stopDrag = function(e, wnd){
    if (!e) {
        e = wnd.event;
    }
    var dragger = wnd.dhtmlDragAndDrop;
    if (!dragger.dragStartObject)
        return;
    if (!dragger.dragStartObject.canDragAndDrop())
        return;

    // 回调树节点的onDragEnd事件。
    var dragSrc = dragger.dragStartObject;
    var dragObj = dragger.dragStartNode.parentObject;
    var dragTarget = dragger.lastLanding
            ? dragger.lastLanding.dragLanding
            : null;
    var dragTargetObj = dragger.lastLanding.parentObject;
    var dndEvent = new DragAndDropEvent(dragSrc, dragObj, dragTarget,
        dragTargetObj);

    var dndResult = dragObj.onDragEnd(dndEvent);
    if (dndResult) {
        if (dndResult.cancelDnD) {
            dragger._cancelDrag();
            return;
        }
    }
    //
    if (dragger.lastLanding)
        dragger.lastLanding.dragLanding._drag(dragger.dragStartNode,
            dragger.dragStartObject, dragger.lastLanding, dndResult);
    dragger.lastLanding = 0;
    dragger.dragNode.parentNode.removeChild(dragger.dragNode);
    dragger.dragNode = 0;
    dragger.dragStartNode = 0;
    dragger.dragStartObject = 0;
    wnd.document.body.onmouseup = dragger.tempDOMU;
    wnd.document.body.onmousemove = dragger.tempDOMM;
    dragger.tempDOMU = null;
    dragger.tempDOMM = null;
    dragger.waitDrag = 0;
}
// 取消拖动处理过程
XTreeDragAndDrop.prototype._cancelDrag = function(){
    var dragger = this.wnd.dhtmlDragAndDrop;
    if (dragger.lastLanding && dragger.lastLanding.parentObject)
        dragger.lastLanding.dragLanding
                ._clearStyles(dragger.lastLanding.parentObject);
    dragger.lastLanding = 0;
    dragger.dragNode.parentNode.removeChild(dragger.dragNode);
    dragger.dragNode = 0;
    dragger.dragStartNode = 0;
    dragger.dragStartObject = 0;
    this.wnd.document.body.onmouseup = dragger.tempDOMU;
    this.wnd.document.body.onmousemove = dragger.tempDOMM;
    dragger.tempDOMU = null;
    dragger.tempDOMM = null;
    dragger.waitDrag = 0;
}

/* 拖放事件.
 * 此事件有3个属性：
 * @param src 正被拖的对象的宿主对象（例如它所在的tree对象）。
 * @param srcObj 正在拖动的对象。
 * @param target 拖放的目标对象。
 * @param targetObj 播放目标位置的对象。
 */
DragAndDropEvent = function(src, srcObj, target, targetObj){
    this.dndSource = src || null;
    this.dndSourceObject = srcObj || null;
    this.dndTarget = target || null;
    this.dndTargetObject = targetObj || null;
}
/**
 * 拖放事件的结果对象。
 * 
 * @param dropType 放置方式。为1表示放到目标节点所在位置,原节点下移。2表示放到目标节点下成为子节点。缺省为1.
 * @param rmvObj 放下后, 是否从源对象中删除被拖的项目。
 * @param cnclDnD 是否取消拖放事件.该值为true将使正在执行的拖放事件取消。。
 */
DragAndDropResult = function(dropType, cnclDnD, rmvObj){
    this.dropType = dropType || 1;
    this.cancelDnD = cnclDnD || false;
    this.removeSrcObjAfterDrop = rmvObj || true;
}
/**
 * 可拖放对象。 提供3个事件。每个事件的返回值类型要求是DragAndDropResult。
 */
DragObject = function(){
}
DragObject.prototype.onDragStart = function(dragEvent){
}
DragObject.prototype.onDragOver = function(dragEvent){
}
DragObject.prototype.onDragEnd = function(dragEvent){
}

/** ========== XTree 定义 ========== */
function XTree(wnd, parentElement, width, height, rootId){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parentElement, width, height);
    this.parentObject = this.parentElement;
    this.mytype = "tree";
    this.width = width;
    this.height = height;
    this.rootId = rootId || "xtree$root";
    this.style_pointer = "pointer";
    if (navigator.appName == 'Microsoft Internet Explorer')
        this.style_pointer = "hand";
    this.hfMode = 0;
    this.nodeCut = 0;
    this.XMLsource = 0;
    this.XMLloadingWarning = 0;
    this._globalIdStorage = new Array();
    this.globalNodeStorage = new Array();
    this._globalIdStorageSize = 0;
    this.treeLinesOn = true;
    this.checkFuncHandler = 0;
    this.openFuncHandler = 0;
    this.dblclickFuncHandler = 0;
    this.tscheck = false;
    this.timgen = true;

    // added by limin 2007-10-10
    // 默认选择的对象没有变化，不更新数据区域
    this.selectChanged = false;

    this.radioArray = new Array(XTree.imagePath + "iconRadio_none.gif",
        XTree.imagePath + "iconRadio_one.gif", XTree.imagePath
                + "radioCheckGray.gif");
    this.checkArray = new Array(XTree.imagePath + "iconUnCheckAll.gif",
        XTree.imagePath + "iconCheckAll.gif", XTree.imagePath
                + "iconCheckGray.gif");
    this.lineArray = new Array(XTree.imagePath + "line2.gif", XTree.imagePath
                + "line3.gif", XTree.imagePath + "line4.gif", XTree.imagePath
                + "blank.gif", XTree.imagePath + "blank.gif");
    this.minusArray = new Array(XTree.imagePath + "minus2.gif", XTree.imagePath
                + "minus3.gif", XTree.imagePath + "minus4.gif", XTree.imagePath
                + "minus.gif", XTree.imagePath + "minus5.gif");
    this.plusArray = new Array(XTree.imagePath + "plus2.gif", XTree.imagePath
                + "plus3.gif", XTree.imagePath + "plus4.gif", XTree.imagePath
                + "plus.gif", XTree.imagePath + "plus5.gif");
    this.imageArray = new Array(XTree.imagePath + "book_titel.gif",
        XTree.imagePath + "books_open.gif", XTree.imagePath + "books_close.gif");
    // this.imageArray = new Array(XTree.imagePath + "leaf.gif", XTree.imagePath
    // + "folderOpen.gif", XTree.imagePath + "folderClosed.gif");
    this.cutImg = new Array(0, 0, 0);
    this.cutImage = XTree.imagePath + "but_cut.gif";
    this.dragger = new XTreeDragAndDrop(this.wnd);
    this.htmlNode = new XTreeItem(this.rootId, "", 0, this);
    var chd = this.htmlNode.htmlNode.childNodes[0].childNodes[0];
    chd.style.display = "none";
    chd.className = "hiddenRow";
    this.allTree = this._createSelf();
    this.allTree.appendChild(this.htmlNode.htmlNode);
    this.allTree.onselectstart = new Function("return false;");
    this.XMLLoader = new XTreeLoader(this.wnd, this._parseXMLTree, this);
    this.dragger.addDragLanding(this.allTree, this);

    this.onDragStartFunc = function(e){
        return new DragAndDropResult();
    };
    this.onDragOverFunc = function(e){
        return new DragAndDropResult();
    };
    this.onDragEndFunc = function(e){
        var dndResult = new DragAndDropResult();
        return dndResult;
    };

    return this;
}

XTree.ITEM_RADIO = "radio";
XTree.ITEM_CHECKBOX = "checkbox";
XTree.SEPARATOR = ",";

XTree.MODE_REVERSE = "REVERSE";
XTree.MODE_CHECKED = "CHECKED";
XTree.MODE_OPEN = "OPEN";
XTree.MODE_OPEN_REVERSE = "OPEN,REVERSE";
XTree.MODE_OPEN_CHECKED = "OPEN,CHECKED";

XTree.imagePath = sys.getPluginPath() + "/droptree/images/xtree/";

_extendClass(XTree, SanComponent, "XTree");

XTree.prototype.toString = function(){
    return "XTree";
}
/*设置树是否是只读。此属性并不会对树产生直接作用。只是提供给其它js调用者做状态检查用。例如调用者
 * 可以根据isReadOnly()来实现不同的树行为(让树可以编辑或不可编辑)。
 */
XTree.prototype.setReadOnly = function(bool){
    this.readonly = bool;
}
// 检查树是否为只读。
XTree.prototype.isReadOnly = function(){
    return this.readonly;
}

/*树结点对象 */
function XTreeItem(itemId, itemText, parentObject, treeObject, actionHandler,
        mode, href, target){
    this.htmlNode = "";
    this.acolor = "";
    this.scolor = "";
    this.tr = 0;
    this.childsCount = 0;
    this.tempDOMM = 0;
    this.tempDOMU = 0;
    this.dragSpan = 0;
    this.dragMove = 0;
    this.span = 0;
    this.closeble = 1;
    this.childNodes = new Array();

    this.userObj = null; // 存放用户对象。

    this.checkstate = 0;
    this.treeNod = treeObject;
    this.label = itemText;
    this.href = href;
    this.target = target;
    this.parentObject = parentObject;
    this.actionHandler = actionHandler;
    this.images = new Array(treeObject.imageArray[0], treeObject.imageArray[1],
        treeObject.imageArray[2]);
    // 添加拖放事件
    this.onDragStart = treeObject.onDragStartFunc;
    this.onDragOver = treeObject.onDragOverFunc;
    this.onDragEnd = treeObject.onDragEndFunc;

    this.id = treeObject._globalIdStorageAdd(itemId, this);
    if (this.treeNod.checkBoxOn) {
        this.htmlNode = this.treeNod._createItem(1, this, mode,
            XTree.ITEM_CHECKBOX);
    } else if (this.treeNod.radioOn) {
        this.htmlNode = this.treeNod._createItem(1, this, mode,
            XTree.ITEM_RADIO);
    } else {
        this.htmlNode = this.treeNod._createItem(0, this, mode,
            XTree.ITEM_CHECKBOX);
    }

    this.htmlNode.objBelong = this;
    return this;
}
;

_extendClass(XTreeItem, DragObject, "XTreeItem");

/*取得节点上的用户对象*/
XTreeItem.prototype.getUserObj = function(){
    return this.userObj;
}
/*将用户对象放入节点*/
XTreeItem.prototype.setUserObj = function(userObj){
    this.userObj = userObj;
}
/*取得节点所属的tree对象*/
XTreeItem.prototype.getOwner = function(){
    return this.treeNod;
}
/*返回父节点*/
XTreeItem.prototype.getParentItem = function(){
    return this.parentObject;
}
/*检查是否有子节点*/
XTreeItem.prototype.hasChildren = function(){
    return this.childNodes.length > 0 ? true : false;
};
/*取得子节点的数量*/
XTreeItem.prototype.getChildrenCount = function(){
    return this.childNodes.length;
}
/*取得指定的子节点*/
XTreeItem.prototype.getChildItem = function(i){
    try {
        return this.childNodes[i];
    } catch (e) {
        throwError("子节点不存在!");
    }
};

XTreeItem.prototype.setLoaded = function(loaded){
    this._isLoaded = loaded;
}
XTreeItem.prototype.isLoaded = function(){
    if (typeof(this._isLoaded) == "undefined")
        return true;
    return this._isLoaded;
}
/*设置节点前的+/-号。
 * 如果在树的创建过程中调用此方法可能会失效，因为每添加一个节点，会重新调整一下相关的节点的图标，
 * 所以此调用可能会失效。建议在树创建完成之后再调用。
 * @param s 如果参数为"+"号则设置为对应的+图标，否则为-图标。
 */
XTreeItem.prototype.setPlusIcon = function(s){
    var workArray;
    if (s == "+") {
        workArray = this.treeNod.plusArray;
    } else {
        workArray = this.treeNod.minusArray;
    }
    var plusIcon = this.htmlNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    if (!this.treeNod && !this.treeNod.treeLinesOn)
        plusIcon.src = workArray[3];
    else {
        if (this.parentObject)
            tempNum = this.treeNod._getCountStatus(this.id, this.parentObject);
        plusIcon.src = workArray[tempNum];
    }
}

XTreeItem.prototype.toString = function(){
    return "XTreeItem:" + this.label;
}
/**
 * 在当前节点下添加子节点
 * 
 * @param itemText string 节点上显示的文字内容
 * @param itemid string 节点的ID,整个树都是唯一的
 * @param actionHandler function 单击节点时所调用的处理函数
 * @param mode string 控制字符串，由一些控制子串拼接而成
 * @param href string 节点的链接
 * @param target string 链接的目标
 * @param img0 string 文字前的图片
 * @param img1 string 节点展开时的图片
 * @param img2 节点关闭时的图片
 * @param itemid
 */
XTreeItem.prototype.appendChild = function(itemName, itemId, actionHandler,
        optionStr, href, target, image1, image2, image3){
    return this.treeNod.insertNewItem(this, itemId, itemName, actionHandler,
        image1, image2, image3, optionStr, null, href, target);
}
/*为当前节点添加兄弟节点*/
XTreeItem.prototype.appendFriend = function(itemName, itemId, actionHandler,
        optionStr, href, target, image1, image2, image3){
    return this.treeNod.insertNewNext(this, itemId, itemName, actionHandler,
        image1, image2, image3, optionStr, null, href, target);
}
/*删除节点.
 * @param selectParent 删除后是否选择父节点
 * */
XTreeItem.prototype.remove = function(selectParent){
    this.treeNod._deleteItem(this.id, selectParent);
}
/*删除所有子节点 */
XTreeItem.prototype.clearChildren = function(){
    this.treeNod.deleteChildItems(this.id);
}

XTreeItem.prototype.getItemId = function(){
    return this.id;
}
/*设置节点文字*/
XTreeItem.prototype.setItemText = function(text){
    this.label = text;
    var item = this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0];
    item.innerHTML = text;
}
/*设置节点上link （<a>标签） 的文字*/
XTreeItem.prototype.setItemLinkText = function(text){
    this.label = text;
    var item = this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0];
    if (item.childNodes && item.childNodes[0]) {
        item.childNodes[0].innerText = text;
    }
}
/*取得节点的文字内容*/
XTreeItem.prototype.getItemText = function(){
    return this.label;
}
/*取得节点的简单文本（剔除html标签后）*/
XTreeItem.prototype.getItemPlainText = function(){
    if (this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerText)
        return this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerText;
    else
        return this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].textContent;
}
/*设置右键菜单事件*/
XTreeItem.prototype.setOnContextMenu = function(func){
    if (!func)
        return;
    this._oncontextmenu = func;
    var self = this;
    if (typeof(func) == "function") {
        this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].oncontextmenu = function(
                e){
            self.getOwner().selectItem(self.id, false);
            doCallBack(func, e, self.id);
            return false;
        };
    }
}
/*设置节点链接*/
XTreeItem.prototype.setItemHref = function(href){
    this.href = href;
}
XTreeItem.prototype.getItemHref = function(){
    return this.href;
}

/*设置节点链接显示的目标容器*/
XTreeItem.prototype.setItemTarget = function(target){
    this.target = target;
}

/*设置节点的文字颜色
 * @param defaultColor 默认状态下的颜色
 * @param selectedColor 选择状态下的颜色
 */
XTreeItem.prototype.setItemColor = function(defaultColor, selectedColor){
    if ((this.treeNod.lastSelected)
            && (temp.tr == this.treeNod.lastSelected.parentObject.tr)) {
        if (selectedColor)
            this.span.style.color = selectedColor;
    } else {
        if (defaultColor)
            this.span.style.color = defaultColor;
    }
    if (selectedColor)
        this.scolor = selectedColor;
    if (defaultColor)
        this.acolor = defaultColor;
};
/*设置节点是否可关闭*/
XTreeItem.prototype.setItemCloseable = function(flag){
    flag = convertStringToBoolean(flag);
    this.closeble = flag;
};
/*设置节点图标2
 * @param leafImg 叶节点图标(没子节点时的图标)
 * @param openImg 开启图标  (可选)
 * @param closeImg 关闭图标 (可选)
 */
XTreeItem.prototype.setItemImage2 = function(leafImg, openImg, closeImg){
    if (!openImg && !closeImg) {
        this.images[1] = leafImg; // 开启图标
        this.images[2] = leafImg; // 关闭图标
        this.images[0] = leafImg; // 叶节点图标
    } else if (!closeImg) {
        this.images[1] = openImg; // 开启图标
        this.images[2] = openImg; // 关闭图标
        this.images[0] = leafImg; // 叶节点图标
    } else {
        this.images[1] = openImg; // 开启图标
        this.images[2] = closeImg; // 关闭图标
        this.images[0] = leafImg; // 叶节点图标
    }
    this.treeNod._correctPlus(this);
};
/*设置节点图标。
 * @param openImg 开启图标
 * @param closeImg 关闭图标(可选). 如果此参数未指定，则开启图标同叶节点图标一样。
 */
XTreeItem.prototype.setItemImage = function(openImg, closeImg){
    if (closeImg) {
        this.images[1] = openImg;
        this.images[2] = closeImg;
    } else
        this.images[0] = openImg;
    this.treeNod._correctPlus(this);
};
/*设置是否展开节点*/
XTreeItem.prototype.setExpanded = function(yes){
    if (convertStringToBoolean(yes))
        this.treeNod.openItem(this);
    else
        this.treeNod.closeItem(this);
};
/*检查节点是否展开*/
XTreeItem.prototype.isExpanded = function(){
    var nodes = this.htmlNode.childNodes[0].childNodes;
    var count = nodes.length;
    if (count > 1 && nodes[1].style.display != "none")
        return true;
    else
        return false;
}
/*取得节点所在的层级数*/
XTreeItem.prototype.getLevel = function(){
    return this.treeNod.getLevel(this);
}
/*节点是否已勾选*/
XTreeItem.prototype.isChecked = function(){
    return this.treeNod.isItemChecked(this.id);
}

/*取得根节点对象*/
XTree.prototype.getRootItem = function(){
    return this.htmlNode;
}
/*
 * 取得根节点id.
 */
XTree.prototype.getRootId = function(){
    return this.rootId;
};
/**
 * 清除所有树节点，但根节点rootId除外。
 */
XTree.prototype.clearTree = function(){
    this.deleteChildItems(this.getRootId());
};

/**
 * 设定树节点的ID 如果没有制定ID，则自动生成一个唯一的ID 如果当前所制定的ID在树中不是唯一的，则自动加上一个前缀来保证唯一
 */
XTree.prototype._globalIdStorageAdd = function(itemId, itemObject){
    if (itemId == null) {
        itemId = "xtree$" + Math.floor(Math.random() * 999999);
        return this._globalIdStorageAdd(itemId, itemObject);
    }
    // if ( this._globalIdStorageFind(itemId)) {
    // itemId = "xtree$"+Math.floor(Math.random() * 999999) + "_" + itemId;
    // return this._globalIdStorageAdd(itemId, itemObject);
    // }
    this._globalIdStorage[this._globalIdStorageSize] = itemId;
    this.globalNodeStorage[this._globalIdStorageSize] = itemObject;
    this._globalIdStorageSize += 1;
    return itemId;
};
XTree.prototype._globalIdStorageSub = function(itemId){
    var i = 0;
    while (i < this._globalIdStorageSize) {
        if (this._globalIdStorage[i] == itemId) {
            this._globalIdStorage[i] = this._globalIdStorage[this._globalIdStorageSize
                    - 1];
            this.globalNodeStorage[i] = this.globalNodeStorage[this._globalIdStorageSize
                    - 1];
            this._globalIdStorageSize -= 1;
            this._globalIdStorage[this._globalIdStorageSize] = 0;
            this.globalNodeStorage[this._globalIdStorageSize] = 0;
        }
        i += 1;
    }
};
XTree.prototype._globalIdStorageFind = function(itemId){
    var i = 0;
    while (i < this._globalIdStorageSize) {
        if (this._globalIdStorage[i] == itemId) {
            return this.globalNodeStorage[i];
        }
        i += 1;
    }
    return 0;
};

/**
 * Added by wangxl 根据不同类型的参数信息，取得节点对象
 * 
 * @param obj XTreeItem | string 节点对象 | 节点id
 */
XTree.prototype.getNode = function(obj){
    if (typeof(obj) == "string") {
        obj = this._globalIdStorageFind(obj);
    }
    return obj;
};

XTree.prototype._drawNewTr = function(htmlObject){
    var result = this.__drawnewtrnode;
    if (!result) {
        var tr = this.doc.createElement('tr');
        var td1 = this.doc.createElement("td");
        var td2 = this.doc.createElement("td");
        td1.appendChild(this.doc.createTextNode(" "));
        td2.colSpan = 3;
        tr.appendChild(td1);
        tr.appendChild(td2);
        this.__drawnewtrnode = tr;
        result = tr;
    }
    result = result.cloneNode(true);
    result.childNodes[1].appendChild(htmlObject);
    return result;
};
// 载入xml格式的字串
XTree.prototype.loadXMLString = function(xmlString){
    this.XMLLoader.loadXMLString(xmlString);
};
// 载入指定url的xml文件。
XTree.prototype.loadXML = function(url){
    this.XMLLoader.loadXML(url);
};
XTree.prototype._attachChildNode = function(parentObject, itemId, itemText,
        itemActionHandler, image1, image2, image3, optionStr, childs,
        beforeNode, href, target){
    if (beforeNode)
        parentObject = beforeNode.parentObject;
    if (((parentObject.XMLload == 0) && (this.XMLsource))
            && (!this.XMLloadingWarning)) {
        parentObject.XMLload = 1;
        this.loadXML(this.XMLsource + getUrlSymbol(this.XMLsource) + "itemId="
                + escape(parentObject.itemId));
    }
    var Count = parentObject.childsCount;
    var Nodes = parentObject.childNodes;
    if ((!itemActionHandler) && (this.aFunc)) {
        itemActionHandler = this.aFunc;
    }
    Nodes[Count] = new XTreeItem(itemId, itemText, parentObject, this,
        itemActionHandler, optionStr, href, target);
    if (image1)
        Nodes[Count].images[0] = image1;
    if (image2)
        Nodes[Count].images[1] = image2;
    if (image3)
        Nodes[Count].images[2] = image3;
    parentObject.childsCount += 1;
    var tr = this._drawNewTr(Nodes[Count].htmlNode);
    if (this.XMLloadingWarning)
        Nodes[Count].htmlNode.parentNode.parentNode.style.display = "none";
    if (optionStr) {
        var tempStr = optionStr.split(XTree.SEPARATOR);
        if (tempStr.length <= 1 && XTree.SEPARATOR != ";") {
            tempStr = optionStr.split(";");
        }
        for (var i = 0; i < tempStr.length; i += 1) {
            switch (tempStr[i]) {
                case "TOP" :
                    if (parentObject.childsCount > 1)
                        beforeNode = parentObject.htmlNode.childNodes[0].childNodes[1].nodem.previousSibling;
                    break;
            }
        }
    }
    // 如果beforeNode有下一个兄弟节点，则在其之前插入一兄弟节点。
    if ((beforeNode) && (beforeNode.tr.nextSibling))
        parentObject.htmlNode.childNodes[0].insertBefore(tr,
            beforeNode.tr.nextSibling);
    else
        parentObject.htmlNode.childNodes[0].appendChild(tr);
    if (this.XMLsource)
        if ((childs) && (childs != 0))
            Nodes[Count].XMLload = 0;
        else
            Nodes[Count].XMLload = 1;

    Nodes[Count].tr = tr;
    tr.nodem = Nodes[Count];
    if (parentObject.itemId == 0)
        tr.childNodes[0].className = "hiddenRow";
    if (optionStr) {
        var tempStr = optionStr.split(XTree.SEPARATOR);
        if (tempStr.length <= 1 && XTree.SEPARATOR != ";") {
            tempStr = optionStr.split(";");
        }
        for (var i = 0; i < tempStr.length; i += 1) {
            switch (tempStr[i]) {
                case "SELECT" :
                    this.selectItem(itemId, false);
                    break;
                case "CALL" :
                    this.selectItem(itemId, true);
                    break;
                case "CHILD" :
                    Nodes[Count].XMLload = 0;
                    break;
                case "CHECKED" :
                    // Modified by wangxl
                    if (this.XMLloadingWarning)
                        this.setCheckList += itemId;
                    else {
                        if (this.radioOn)
                            this.setRadioCheck(itemId, 1);
                        else if (this.checkBoxOn)
                            this.setCheck(itemId, 1);
                    }
                    break;
                case "OPEN" :
                    Nodes[Count].openMe = 1;
                    break;
            }
        }
    }

    if (!this.XMLloadingWarning) {
        if (this._getOpenState(parentObject) < 0)
            this.openItem(parentObject.id);
        if (beforeNode) {
            this._correctPlus(beforeNode);
            this._correctAllLine(beforeNode);
        }

        // 调整父节点的+/-号和图标
        this._correctPlus(parentObject);
        // 调整父节点的竖线
        this._correctLine(parentObject);
        // 调整当前节点的+/-号和图标
        this._correctPlus(Nodes[Count]);
        // 当父节点的子节点数>=2时，调整它的倒数第二个节点的+/-号和竖线
        if (parentObject.childsCount >= 2) {
            this._correctPlus(Nodes[Count - 1]);
            this._correctAllLine(Nodes[Count - 1]);
        }
        if (parentObject.childsCount != 2)
            this._correctPlus(Nodes[0]);
        if (this.tscheck)
            this._correctCheckStates(parentObject);
    }
    Nodes[Count].parentObject = parentObject;
    // 将节点调整到数组的正确位置.by chxb
    var rowIndex = tr.rowIndex - 1;
    var tempNode = Nodes[Count];
    Nodes.splice(Nodes.length - 1, 1);
    Nodes.insertAt(tempNode, rowIndex);

    return Nodes[rowIndex];
};

XTree.prototype._parseXMLTree = function(dhtmlObject, node, parentId, level){
    dhtmlObject.XMLloadingWarning = 1;
    var nodeAskingCall = "";
    if (!node) {
        node = dhtmlObject.XMLLoader.getXMLTopNode("tree");
        parentId = node.getAttribute("id");
        dhtmlObject.setCheckList = "";
    }

    for (var i = 0; i < node.childNodes.length; i += 1) {
        var chdi = node.childNodes[i];
        if ((chdi.nodeType == 1) && (chdi.tagName == "item")) {
            var name = chdi.getAttribute("text");
            var cId = chdi.getAttribute("id");
            var im0 = chdi.getAttribute("im0");
            var im1 = chdi.getAttribute("im1");
            var im2 = chdi.getAttribute("im2");
            var aColor = chdi.getAttribute("aCol");
            var sColor = chdi.getAttribute("sCol");
            var chd = chdi.getAttribute("child");
            var atop = chdi.getAttribute("top");
            var aopen = chdi.getAttribute("open");
            var aselect = chdi.getAttribute("select");
            var acall = chdi.getAttribute("call");
            var achecked = chdi.getAttribute("checked");
            var closeable = chdi.getAttribute("closeable");
            var href = chdi.getAttribute("href");
            var target = chdi.getAttribute("target");
            var zST = "";
            if (aselect)
                zST += ",SELECT";
            if (atop)
                zST += ",TOP";
            if (acall)
                nodeAskingCall = cId;
            if (achecked)
                zST += ",CHECKED";
            if ((aopen) && (aopen != "0"))
                zST += ",OPEN";
            var temp = dhtmlObject._globalIdStorageFind(parentId);
            temp.XMLload = 1;
            var newItemObj = dhtmlObject.insertNewItem(temp, cId, name, 0, im0,
                im1, im2, zST, chd);
            newItemObj.href = href || "";
            newItemObj.target = target || "";
            if (dhtmlObject.parserExtension)
                dhtmlObject.parserExtension._parseExtension(chdi,
                    dhtmlObject.parserExtension, cId, parentId);
            dhtmlObject.setItemColor(cId, aColor, sColor);
            if ((closeable == "0") || (closeable == "1"))
                dhtmlObject.setItemCloseable(cId, closeable);
            var zcall = dhtmlObject._parseXMLTree(dhtmlObject, chdi, cId, 1);
            if (zcall != "")
                nodeAskingCall = zcall;
        } else if ((chdi.nodeType == 1) && (chdi.tagName == "userdata")) {
            var name = chdi.getAttribute("name");
            if ((name) && (chdi.childNodes[0])) {
                dhtmlObject
                        .setUserData(parentId, name, chdi.childNodes[0].data);
            }
            ;
        }
        ;
    }
    ;

    if (!level) {
        dhtmlObject.lastLoadedXMLId = parentId;
        dhtmlObject._redrawFrom(dhtmlObject);
        dhtmlObject.XMLloadingWarning = 0;
        var chArr = dhtmlObject.setCheckList.split(XTree.SEPARATOR);
        if (chArr.length <= 1 && XTree.SEPARATOR != ";") {
            chArr = dhtmlObject.setCheckList.split(";");
        }
        for (var n = 0; n < chArr.length; n += 1)
            if (chArr[n])
                dhtmlObject.setCheck(chArr[n], 1);
        if (nodeAskingCall != "")
            dhtmlObject.selectItem(nodeAskingCall, true);
    }
    return nodeAskingCall;
};

XTree.prototype._redrawFrom = function(dhtmlObject, itemObject){
    if (!itemObject) {
        var tempx = dhtmlObject
                ._globalIdStorageFind(dhtmlObject.lastLoadedXMLId);
        dhtmlObject.lastLoadedXMLId = -1;
        if (!tempx)
            return 0;
    } else
        tempx = itemObject;
    for (var i = 0; i < tempx.childsCount; i += 1) {
        if (!itemObject)
            tempx.childNodes[i].htmlNode.parentNode.parentNode.style.display = "";
        if (tempx.childNodes[i].openMe == 1)
            for (var zy = 0; zy < tempx.childNodes[i].childNodes.length; zy += 1)
                tempx.childNodes[i].htmlNode.childNodes[0].childNodes[zy + 1].style.display = "";
        dhtmlObject._redrawFrom(dhtmlObject, tempx.childNodes[i]);
        dhtmlObject._correctAllLine(tempx.childNodes[i]);
        dhtmlObject._correctPlus(tempx.childNodes[i]);
    }
    dhtmlObject._correctAllLine(tempx);
    dhtmlObject._correctPlus(tempx);
};
XTree.prototype._createSelf = function(){
    var div = this.__createSelf;
    if (!div) {
        div = this.doc.createElement('div');
        div.className = "containerTableStyle";
        with (div.style) {
            position = "absolute";
            overflow = "auto";
        }
        this.__createSelf = div;
    }
    div = div.cloneNode(true);
    with (div.style) {
        width = this.width;
        height = this.height;
    }
    this.parentObject.appendChild(div);
    with (this.parentObject.style) {
        position = "relative";
        overflow = "hidden";
        width = "100%";
        height = "100%";
    }

    var self = this;
    div.onmouseup = function(e){
        var evt = e ? e : window.event;
        self.cancelSelection();
    }

    return div;
};

XTree.prototype._xcloseAll = function(itemObject){
    if (this.rootId != itemObject.id)
        this._HideShow(itemObject, 1);
    for (var i = 0; i < itemObject.childsCount; i += 1)
        this._xcloseAll(itemObject.childNodes[i]);
};
XTree.prototype._xopenAll = function(itemObject){
    this._HideShow(itemObject, 2);
    for (var i = 0; i < itemObject.childsCount; i += 1)
        this._xopenAll(itemObject.childNodes[i]);
};
XTree.prototype._correctPlus = function(itemObject){
    if (!itemObject)
        return;
    var workArray = this.lineArray;
    var icon = itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
    if ((this.XMLsource) && (!itemObject.XMLload)) {
        var workArray = this.plusArray;
        if (itemObject.images[2]) {
            icon.src = itemObject.images[2];
            icon.style.display = "block";
        } else
            icon.style.display = "none";
    } else
        try {
            if (itemObject.childsCount) // 如果有子节点
            {
                if (itemObject.htmlNode.childNodes[0].childNodes[1].style.display != "none") // 如果节点是展开的，设为展开图标
                {
                    var workArray = this.minusArray;
                    if (itemObject.images[1]) {
                        icon.src = itemObject.images[1];
                        icon.style.display = "block";
                    } else
                        icon.style.display = "none";
                } else // 如果节点是闭合的。设置为闭合图标
                {
                    var workArray = this.plusArray;

                    if (itemObject.images[2]) {
                        icon.src = itemObject.images[2];
                        icon.style.display = "block";
                    } else
                        icon.style.display = "none";
                }
            } else // 否则无子节点，则设为叶节点图标
            {
                if (itemObject.images[0]) {
                    icon.src = itemObject.images[0];
                    icon.style.display = "block";
                } else
                    icon.style.display = "none";
            }
        } catch (e) {
        }
    ;
    // 以下根据展开/闭合状态设置相应的+/-号
    var tempNum = 2;
    var plusIcon = itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    if (!itemObject.treeNod && !itemObject.treeNod.treeLinesOn)
        plusIcon.src = workArray[3];
    else {
        if (itemObject.parentObject)
            tempNum = this._getCountStatus(itemObject.id,
                itemObject.parentObject);
        plusIcon.src = workArray[tempNum];
    }
};
// 调整当前节点的竖线
XTree.prototype._correctLine = function(itemObject){
    var sNode = itemObject.parentObject;
    try {
        if (sNode) { // 如果指定的item有父节点
            var chd0 = itemObject.htmlNode.childNodes[0].childNodes[itemObject.childsCount].childNodes[0];
            if ((this._getLineStatus(itemObject.id, sNode) == 0)
                    || (!this.treeLinesOn)) { // 如果itemObject是父节点下的最后一个节点，则它的子节点没有左边的竖线。
                with (chd0.style) {
                    backgroundImage = "";
                    backgroundRepeat = "";
                }
            } else { // 否则,画左边的那条竖线。
                var bkgdimg = "url(" + XTree.imagePath + "line1.gif)";
                with (chd0.style) {
                    if (backgroundImage != bkgdimg)
                        backgroundImage = bkgdimg;
                    if (backgroundRepeat != "repeat-y")
                        backgroundRepeat = "repeat-y";
                }
            }
        }
    } catch (e) {
    }
};
// 调整节点下的所有节点的竖线
XTree.prototype._correctAllLine = function(itemObject){
    if (itemObject == null)
        return;
    var sNode = itemObject.parentObject;
    try {
        if (sNode) { // 如果指定的item有父节点
            var chd0 = itemObject.htmlNode.childNodes[0];
            if ((this._getLineStatus(itemObject.id, sNode) == 0)
                    || (!this.treeLinesOn)) { // 如果itemObject是父节点下的最后一个节点，则它的子节点没有左边的竖线。
                var i = 1;
                while (i <= itemObject.childsCount) {
                    var chd00 = chd0.childNodes[i].childNodes[0];
                    i += 1;
                    with (chd00.style) {
                        backgroundImage = "";
                        backgroundRepeat = "";
                    }
                }
            } else { // 否则,画左边的那条竖线。
                var i = 1;
                while (i <= itemObject.childsCount) {
                    var chd00 = chd0.childNodes[i].childNodes[0];
                    i += 1;
                    with (chd00.style) {
                        backgroundImage = "url(" + XTree.imagePath
                                + "line1.gif)";
                        backgroundRepeat = "repeat-y";
                    }
                }
            }
        }
    } catch (e) {
    }
};
XTree.prototype._getCountStatus = function(itemId, itemObject){
    try {
        if (itemObject.childsCount <= 1) {
            if (itemObject.id == this.rootId)
                return 4;
            else
                return 0;
        }
        if (itemObject.htmlNode.childNodes[0].childNodes[1].nodem.id == itemId)
            if (!itemObject.id)
                return 2;
            else
                return 1;
        if (itemObject.htmlNode.childNodes[0].childNodes[itemObject.childsCount].nodem.id == itemId)
            return 0;
    } catch (e) {
    }
    ;
    return 1;
};
// 判断itemId是否itemObject下的最后一个子节点
XTree.prototype._getLineStatus = function(itemId, itemObject){
    if (itemObject.htmlNode.childNodes[0].childNodes[itemObject.childsCount].nodem.id == itemId)
        return 0;
    return 1;
}
XTree.prototype._HideShow = function(itemObject, mode){
    if (((this.XMLsource) && (!itemObject.XMLload)) && (!mode)) {
        itemObject.XMLload = 1;
        this.loadXML(this.XMLsource + getUrlSymbol(this.XMLsource) + "id="
                + escape(itemObject.id));
        return;
    }
    ;
    var Nodes = itemObject.htmlNode.childNodes[0].childNodes;
    var Count = Nodes.length;
    if (Count > 1) {
        var nodestyle;
        if (((Nodes[1].style.display != "none") || (mode == 1)) && (mode != 2)) {
            nodestyle = "none";
        } else {
            nodestyle = "block";
        }
        itemObject.htmlNode.childNodes[0].childNodes[0].style.height = '22px';
        var i = 1;
        while (i < Count) {
            Nodes[i].style.display = nodestyle;
            i = i + 1;
        }
    }
    this._correctPlus(itemObject);
}
XTree.prototype._getOpenState = function(itemObject){
    if (!itemObject.htmlNode)
        return;
    var z = itemObject.htmlNode.childNodes[0].childNodes;
    if (z.length <= 1)
        return 0;
    if (z[1].style.display != "none")
        return 1;
    else
        return -1;
}
XTree.prototype.onRowDblClick = function(){
    if (this.parentNode.parentObject.treeNod.dblclickFuncHandler)
        if (!this.parentNode.parentObject.treeNod
                .dblclickFuncHandler(this.parentNode.parentObject.id))
            return 0;
    if ((this.parentNode.parentObject.closeble)
            && (this.parentNode.parentObject.closeble != "0"))
        this.parentNode.parentObject.treeNod
                ._HideShow(this.parentNode.parentObject);
    else
        this.parentNode.parentObject.treeNod._HideShow(
            this.parentNode.parentObject, 2);
};
XTree.prototype.onRowClick = function(){
    var tree = this.owner;
    if (this.parentObject.treeNod.openFuncHandler) {
        if (!this.parentObject.treeNod.openFuncHandler(this.parentObject.id,
            this.parentObject.treeNod._getOpenState(this.parentObject))) {
            return 0;
        }
    }
    if ((this.parentObject.closeble) && (this.parentObject.closeble != "0")) {
        this.parentObject.treeNod._HideShow(this.parentObject);
    } else {
        this.parentObject.treeNod._HideShow(this.parentObject, 2);
    }

    // Modified by wangxl
    if (tree.isDynamicLoad() && this.parentObject.isExpanded()
            && !this.parentObject.isLoaded()) {
        tree.loadTreeFromXML(this.parentObject);
    }
};
XTree.prototype.onRowSelect = function(e, htmlObject, mode){
    if (!htmlObject) {
        htmlObject = this.parentNode;
    }
    htmlObject.childNodes[0].className = "selectedTreeRow";
    if (htmlObject.parentObject.scolor) {
        htmlObject.parentObject.span.style.color = htmlObject.parentObject.scolor;
    }
    if ((htmlObject.parentObject.treeNod.lastSelected)
            && (htmlObject.parentObject.treeNod.lastSelected != htmlObject)) {
        htmlObject.parentObject.treeNod.lastSelected.childNodes[0].className = "standartTreeRow";
        if (htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor) {
            htmlObject.parentObject.treeNod.lastSelected.parentObject.span.style.color = htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor;
        }
    }
    htmlObject.parentObject.treeNod.lastSelected = htmlObject;
    if (!mode) {
        if (htmlObject.parentObject.actionHandler)
            htmlObject.parentObject.actionHandler(htmlObject.parentObject.id);
    }
    htmlObject.parentObject.treeNod.dragger.waitDrag = 0;
}

/*取消高亮选择的项*/
XTree.prototype.cancelSelection = function(){
    var htmlObject = this.getSelectedItem();
    if (htmlObject) {
        htmlObject.parentObject.treeNod.lastSelected.childNodes[0].className = "standartTreeRow";
        if (htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor)
            htmlObject.parentObject.treeNod.lastSelected.parentObject.span.style.color = htmlObject.parentObject.treeNod.lastSelected.parentObject.acolor;
        this.lastSelected = null;
    }
}
XTree.prototype._correctCheckStates = function(dhtmlObject){
    if (!this.tscheck)
        return;
    if (dhtmlObject.id == this.rootId)
        return;
    if (!dhtmlObject.htmlNode)
        return;
    var act = dhtmlObject.htmlNode.childNodes[0].childNodes;
    var flag1 = 0;
    var flag2 = 0;
    if (act.length < 2)
        return;
    for (var i = 1; i < act.length; i += 1)
        if (act[i].nodem.checkstate == 0)
            flag1 = 1;
        else if (act[i].nodem.checkstate == 1)
            flag2 = 1;
        else {
            flag1 = 1;
            flag2 = 1;
            break;
        }

    if ((flag1) && (flag2))
        this._setCheck(dhtmlObject, "notsure");
    else if (flag1)
        this._setCheck(dhtmlObject, false);
    else
        this._setCheck(dhtmlObject, true);
    this._correctCheckStates(dhtmlObject.parentObject);
}
XTree.prototype.onCheckBoxClick = function(e){
    // modified by limin 2007-10-10
    // 触发了选择单击事件，设置改变状态为true
    this.treeNod.selectChanged = true;

    if (this.treeNod.tscheck) {
        if (this.parentObject.checkstate == 1) {
            this.treeNod._setSubChecked(false, this.parentObject);
        } else {
            this.treeNod._setSubChecked(true, this.parentObject);
        }
    } else if (this.parentObject.checkstate == 1) {
        this.treeNod._setCheck(this.parentObject, false);
    } else {
        this.treeNod._setCheck(this.parentObject, true);
    }
    this.treeNod._correctCheckStates(this.parentObject.parentObject);
    if (this.treeNod.checkFuncHandler) {
        return (this.treeNod.checkFuncHandler(this.parentObject.id,
            this.parentObject.checkstate));
    } else {
        return true;
    }
};

XTree.prototype.onRadioClick = function(e){
    // modified by limin 2007-10-10
    // 触发了选择单击事件，设置改变状态为true
    this.treeNod.selectChanged = true;

    if (this.parentObject.checkstate == 1) {
        this.treeNod._setRadioCheck(this.parentObject, false);
    } else {
        this.treeNod._setRadioCheck(this.parentObject, true);
    }
}
XTree.prototype._createItem = function(acheck, itemObject, mode, type){
    if (mode && mode.indexOf(XTree.MODE_REVERSE) != -1) {
        // 将acheck的状态置反 by wangxl
        acheck = (acheck == 1) ? 0 : 1;
    }

    var table = this.__createItem;
    var iconImg = this.__iconImg;
    var chkImg = this.__chkImg;
    if (!table) {
        table = this.doc.createElement('table');
        table.cellSpacing = 0;
        table.cellPadding = 0;
        table.border = 0;
        table.style.margin = 0;
        table.style.padding = 0;
        var tbody = this.doc.createElement('tbody');
        tbody.valign = "top";
        var tr = this.doc.createElement('tr');
        var td1 = this.doc.createElement('td');
        td1.valign = "top"
        td1.className = "standartTreeImage";
        var img0 = this.doc.createElement("img");
        img0.border = "0";
        img0.style.padding = 0;
        td1.appendChild(img0);
        var td11 = this.doc.createElement('td');
        td11.valign = "top"
        td11.width = "16px";
        if (!this.__chkImg) {
            this.__chkImg = this.doc.createElement("img");
            this.__chkImg.checked = 0;
            this.__chkImg.style.width = "16px";
            this.__chkImg.style.height = "16px";
        }
        chkImg = this.__chkImg.cloneNode(true);
        if (!acheck) {
            chkImg.style.display = "none";
            chkImg.checked = 0;
        } else {
            chkImg.checked = 1;
        }
        td11.style.width = "0";
        td11.appendChild(chkImg);

        var td12 = this.doc.createElement('td');
        td12.className = "standartTreeImage";
        td12.valign = "top";
        if (!this.__iconImg) {
            this.__iconImg = this.doc.createElement("img");
            this.__iconImg.border = "0";
            this.__iconImg.style.padding = 0;
            this.__iconImg.style.margin = 0;
        }
        iconImg = this.__iconImg.cloneNode(true);
        td12.appendChild(iconImg);
		
        var td2 = this.doc.createElement('td');
        td2.noWrap = true;
        td2.style.width = "100%";
        td2.style.verticalAlign = "";
        td2.valign = "top";
        var span = this.doc.createElement('span');
        td2.style.paddingLeft = "3px";
        td2.appendChild(span);
        tr.appendChild(td1);
        tr.appendChild(td11);
        tr.appendChild(td12);
        tr.appendChild(td2);
        tr.valign = "top";
        tbody.appendChild(tr);
        
        
        tbody.valign = "top";
        table.valign = "top";
        table.appendChild(tbody);

        this.__createItem = table;
    }
    table = table.cloneNode(true);
    if (this.hfMode)
        table.style.tableLayout = "fixed";
    chkImg = table.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (type == XTree.ITEM_CHECKBOX) {
        chkImg.src = this.checkArray[0];
        chkImg.onclick = this.onCheckBoxClick;
    } else if (type == XTree.ITEM_RADIO) {
        chkImg.src = this.radioArray[0];
        chkImg.onclick = this.onRadioClick;
    }

    chkImg.treeNod = this;
    chkImg.parentObject = itemObject;
    if (!acheck) {
        chkImg.style.display = "none";
        chkImg.checked = 0;
    } else {
        chkImg.style.display = "block";
        chkImg.checked = 1;
    }

    iconImg = table.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
    if (!mode)
        iconImg.src = this.imageArray[0];
    iconImg.onmousedown = this._preventNsDrag;
    with (iconImg.style) {
        if (this.timgen) {
            // width = "18px";
            // height = "18px";
        } else {
            width = "0px";
            height = "0px";
        }
    }

    var td1 = table.childNodes[0].childNodes[0].childNodes[0]
    var td2 = table.childNodes[0].childNodes[0].childNodes[3]
    itemObject.span = td2.childNodes[0];
    itemObject.span.className = "standartTreeRow";

    // 对链接进行处理
    if (itemObject.href) {
        itemObject.span.innerHTML = "<a href='" + itemObject.href
                + "' target='" + itemObject.target + "'>" + itemObject.label
                + "</a>";
    } else {
        itemObject.span.innerHTML = itemObject.label;
    }

    td2.parentObject = itemObject;
    td1.parentObject = itemObject;
    td1.owner = this; // by wangxl
    // td2.onclick = this.onRowSelect;
    itemObject.span.onclick = this.onRowSelect;
    td1.onclick = this.onRowClick; // 点+/-号，触发onOpen事件。 Modified by wangxl
    // td2.ondblclick = this.onRowDblClick;
    itemObject.span.ondblclick = this.onRowDblClick;
    if (this.dragAndDropOff)
        this.dragger.addDraggableItem(td2, this);
    // td2.style.cursor = this.style_pointer;
    itemObject.span.style.cursor = this.style_pointer;

    return table;
};
/*设置开始拖动节点的事件。当节点被添加到树时将传给该节点。
 * 此事件要求返回boolean值。
 */
XTree.prototype.setOnDragStart = function(func){
    if (typeof(func) == "function")
        this.onDragStartFunc = func;
    else
        this.onDragStartFunc = eval(func);
}
/*设置拖动节点中的事件。当节点被添加到树时将传给该节点。
 * 此事件要求返回boolean值。
 */
XTree.prototype.setOnDragOver = function(func){
    if (typeof(func) == "function")
        this.onDragOverFunc = func;
    else
        this.onDragOverFunc = eval(func);
}
/*设置结束拖动节点的事件。当节点被添加到树时将传给该节点。
 * 此事件要求返回boolean值。
 */
XTree.prototype.setOnDragEnd = function(func){
    if (typeof(func) == "function")
        this.onDragEndFunc = func;
    else
        this.onDragEndFunc = eval(func);
}
XTree.prototype.setOnClickHandler = function(func){
    if (typeof(func) == "function") {
        this.aFunc = func;
    } else {
        this.aFunc = eval(func);
    }
};
XTree.prototype.getOnClickHandler = function(){
    return this.aFunc;
}
XTree.prototype.setXMLAutoLoading = function(filePath){
    this.XMLsource = filePath;
};
XTree.prototype.setOnCheckHandler = function(func){
    if (typeof(func) == "function") {
        this.checkFuncHandler = func;
    } else {
        this.checkFuncHandler = eval(func);
    }
};
XTree.prototype.setOnOpenHandler = function(func){
    if (typeof(func) == "function") {
        this.openFuncHandler = func;
    } else {
        this.openFuncHandler = eval(func);
    }
};
XTree.prototype.getOnOpenHandler = function(){
    return this.openFuncHandler;
}
XTree.prototype.setOnDblClickHandler = function(func){
    if (typeof(func) == "function")
        this.dblclickFuncHandler = func;
    else
        this.dblclickFuncHandler = eval(func);
};
XTree.prototype.getOnDblClickHandler = function(){
    return this.dblclickFuncHandler;
}
XTree.prototype.expandAllItems = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    this._xopenAll(temp);
};
XTree.prototype.getOpenState = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return "";
    return this._getOpenState(temp);
};
XTree.prototype.closeAllItems = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    this._xcloseAll(temp);
};
XTree.prototype.setUserData = function(itemId, name, value){
    var sNode = this._globalIdStorageFind(itemId);
    if (!sNode)
        return;
    if (name == "hint")
        sNode.htmlNode.childNodes[0].childNodes[0].title = value;
    sNode[name] = value;
};
XTree.prototype.getUserData = function(itemId, name){
    var sNode = this._globalIdStorageFind(itemId);
    if (!sNode)
        return;
    return eval("sNode." + name);
};
/*取得取得的节点对象*/
XTree.prototype.getSelectedItem = function(){
    if (!this.lastSelected)
        return null;
    return this._globalIdStorageFind(this.lastSelected.parentObject.id);
}
XTree.prototype.getSelectedItemId = function(){
    if (this.lastSelected)
        if (this._globalIdStorageFind(this.lastSelected.parentObject.id))
            return this.lastSelected.parentObject.id;
    return ("");
};

/**
 * Added by wangxl 取得Radio已被选中的节点对象
 */
XTree.prototype.getSelectedRadioItem = function(){
    return this._selectedRadioItem;
}

// 根据id取得对应的节点对象XTreeItem.
XTree.prototype.getItemObj = function(itemId){
    return this._globalIdStorageFind(itemId);
}
XTree.prototype.getItemColor = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;

    var res = new Object();
    if (temp.acolor)
        res.acolor = temp.acolor;
    if (temp.acolor)
        res.scolor = temp.scolor;
    return res;
};
XTree.prototype.setItemColor = function(itemId, defaultColor, selectedColor){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    else {
        if ((this.lastSelected)
                && (temp.tr == this.lastSelected.parentObject.tr)) {
            if (selectedColor)
                temp.span.style.color = selectedColor;
        } else {
            if (defaultColor)
                temp.span.style.color = defaultColor;
        }
        if (selectedColor)
            temp.scolor = selectedColor;
        if (defaultColor)
            temp.acolor = defaultColor;
    }
};
XTree.prototype.getItemText = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    return (temp.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML);
};
XTree.prototype.getParentId = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if ((!temp) || (!temp.parentObject))
        return "";
    return temp.parentObject.id;
};
XTree.prototype.changeItemId = function(itemId, newItemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.id = newItemId;
    var i = 0;
    while (i < this._globalIdStorageSize) {
        if (this._globalIdStorage[i] == itemId) {
            this._globalIdStorage[i] = newItemId;
        }
        i += 1;
    }
};
XTree.prototype.doCut = function(){
    if (this.nodeCut)
        this.clearCut();
    this.nodeCut = this.lastSelected;
    if (this.nodeCut) {
        var tempa = this.nodeCut.parentObject;
        this.cutImg[0] = tempa.images[0];
        this.cutImg[1] = tempa.images[1];
        this.cutImg[2] = tempa.images[2];
        tempa.images[0] = tempa.images[1] = tempa.images[2] = this.cutImage;
        this._correctPlus(tempa);
    }
};
XTree.prototype.doPaste = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    if (this.nodeCut) {
        if ((!this._checkParenNodes(this.nodeCut.parentObject.id, temp))
                && (id != this.nodeCut.parentObject.parentObject.id))
            this._moveNode(temp, this.nodeCut.parentObject);
        this.clearCut();
    }
};
XTree.prototype.clearCut = function(){
    if (this.nodeCut) {
        var tempa = this.nodeCut.parentObject;
        tempa.images[0] = this.cutImg[0];
        tempa.images[1] = this.cutImg[1];
        tempa.images[2] = this.cutImg[2];
        if (tempa.parentObject)
            this._correctPlus(tempa);
        if (tempa.parentObject)
            this._correctAllLine(tempa);
        this.nodeCut = 0;
    }
};
/**
 * 移动节点.
 * 
 * @param itemObject 要移到的itemObject对象
 * @param targetObject 目标对象
 * @param dndResult dndResult对象，记录有一些dnd的结果信息。根据这些信息来决定dnd的行为。
 */
XTree.prototype._moveNode = function(itemObject, targetObject, dndResult){
    if (this.dragFunc)
        if (!this.dragFunc(itemObject.id, targetObject.id))
            return false;
    if ((targetObject.XMLload == 0) && (this.XMLsource)) {
        targetObject.XMLload = 1;
        this.loadXML(this.XMLsource + getUrlSymbol(this.XMLsource) + "id="
                + escape(targetObject.id));
    }

    if (dndResult && dndResult.dropType == 1) { // 移到targetObject所在位置上，targetObject下移。
        if (!targetObject.parentObject)
            return;
        // 检查targetObject是否itemObject的下一相邻节点
        var tr1 = itemObject.tr.rowIndex;
        var tr2 = targetObject.tr.rowIndex;
        var isSibling = (targetObject.treeNod == itemObject.treeNod
                && targetObject.parentObject == itemObject.parentObject && (tr2 - tr1) == 1);
        // 在原位置移除
        var c = null;
        var i = 0;
        var z = null;
        if (isSibling) {
            targetObject.parentObject.htmlNode.childNodes[0]
                    .removeChild(targetObject.tr);
            c = targetObject.parentObject.childsCount;
            z = targetObject.parentObject;
        } else {
            itemObject.parentObject.htmlNode.childNodes[0]
                    .removeChild(itemObject.tr);
            c = itemObject.parentObject.childsCount;
            z = itemObject.parentObject;
        }
        var compareObject = isSibling ? targetObject : itemObject;
        var oldIndex = -1;
        while (i < z.childsCount) {
            if (z.childNodes[i].id == compareObject.id) {
                oldIndex = i;
                // // z.childNodes.splice(i,1);
                break;
            }
            i += 1;
        }
        // // z.childsCount-=1;
        var oldTree = null;
        // 在新位置添加
        var tr = this._drawNewTr(isSibling
                ? targetObject.htmlNode
                : itemObject.htmlNode);
        if (isSibling) {
            var tr = this._drawNewTr(targetObject.htmlNode);
            itemObject.parentObject.htmlNode.childNodes[0].insertBefore(tr,
                itemObject.tr);
            targetObject.tr = tr;
            // 交换新旧位置的数组元素
            var tempObj = targetObject.parentObject.childNodes[oldIndex];
            itemObject.parentObject.childNodes[oldIndex] = itemObject;
            itemObject.parentObject.childNodes[tr.rowIndex - 1] = tempObj;

            tr.nodem = targetObject;
            itemObject.tr.nodem = itemObject;
            oldTree = targetObject.treeNod;

        } else {
            var tr = this._drawNewTr(itemObject.htmlNode);
            targetObject.parentObject.htmlNode.childNodes[0].insertBefore(tr,
                targetObject.tr);
            itemObject.tr = tr;
            // 交换新旧位置的数组元素
            var tempObj = itemObject.parentObject.childNodes[oldIndex];
            targetObject.parentObject.childNodes.splice(oldIndex, 1);
            targetObject.parentObject.childNodes.insertAt(tempObj, tr.rowIndex
                        - 1);

            tr.nodem = itemObject;
            targetObject.tr.nodem = targetObject;
            itemObject.parentObject = targetObject.parentObject;
            oldTree = itemObject.treeNod;
            itemObject.treeNod = targetObject.treeNod;
            itemObject.onDragStart = targetObject.treeNod.onDragStartFunc;
            itemObject.onDragOver = targetObject.treeNod.onDragOverFunc;
            itemObject.onDragEnd = targetObject.treeNod.onDragEndFunc;
            itemObject.parentObject = targetObject.parentObject;
        }

        // 调整item样式、线条、图标
        if (oldTree != targetObject.treeNod) {
            if (itemObject.treeNod._registerBranch(itemObject, oldTree))
                return;
            this._clearStyles(itemObject);
        }
        if (c > 1) {
            oldTree._correctPlus(z.childNodes[c - 2]);
            oldTree._correctAllLine(z.childNodes[c - 2]);
        }
        oldTree._correctPlus(z);

        this._correctAllLine(targetObject.parentObject);
        this._correctPlus(itemObject);
        this._correctAllLine(itemObject);
        this._correctPlus(targetObject);
        this._correctAllLine(targetObject);
        if (targetObject.parentObject.childsCount >= 2) {
            this
                    ._correctPlus(targetObject.parentObject.childNodes[targetObject.parentObject.childsCount
                            - 2]);
            this
                    ._correctAllLine(targetObject.parentObject.childNodes[targetObject.parentObject.childsCount
                            - 2]);
        }
        if (this.tscheck)
            this._correctCheckStates(targetObject.parentObject);
        if (oldTree.tscheck)
            oldTree._correctCheckStates(z);

    } else { // 移到targetObject下成为子节点
        this.openItem(targetObject.id); // 展开目标节点
        var oldTree = itemObject.treeNod;
        var c = itemObject.parentObject.childsCount;
        var z = itemObject.parentObject;
        var Count = targetObject.childsCount;
        var Nodes = targetObject.childNodes;
        Nodes[Count] = itemObject;
        itemObject.treeNod = targetObject.treeNod;
        targetObject.childsCount += 1;
        var tr = this._drawNewTr(Nodes[Count].htmlNode); // 开始复制一份源节点
        targetObject.htmlNode.childNodes[0].appendChild(tr);
        itemObject.parentObject.htmlNode.childNodes[0]
                .removeChild(itemObject.tr); // 删除源节点
        var i = 0;
        while (i < z.childsCount) {
            if (z.childNodes[i].id == itemObject.id) {
                z.childNodes.splice(i, 1);
                break;
            }
            i += 1;
        }
        z.childsCount -= 1;
        itemObject.tr = tr;
        tr.nodem = itemObject;

        itemObject.parentObject = targetObject;
        if (oldTree != targetObject.treeNod) {
            if (itemObject.treeNod._registerBranch(itemObject, oldTree))
                return;
            this._clearStyles(itemObject);
        }
        if (c > 1) {
            oldTree._correctPlus(z.childNodes[c - 2]);
            oldTree._correctAllLine(z.childNodes[c - 2]);
        }
        this._correctPlus(targetObject);
        this._correctAllLine(targetObject);
        oldTree._correctPlus(z);
        this._correctAllLine(itemObject);
        this._correctPlus(Nodes[Count]);
        if (targetObject.childsCount >= 2) {
            this._correctPlus(Nodes[targetObject.childsCount - 2]);
            this._correctAllLine(Nodes[targetObject.childsCount - 2]);
        }
        if (this.tscheck)
            this._correctCheckStates(targetObject);
        if (oldTree.tscheck)
            oldTree._correctCheckStates(z);
    }
    return true;
}

XTree.prototype._checkParenNodes = function(itemId, htmlObject, shtmlObject){
    if (shtmlObject) {
        if (shtmlObject.parentObject.id == htmlObject.id)
            return 1;
    }
    if (htmlObject.id == itemId)
        return 1;
    if (htmlObject.parentObject)
        return this._checkParenNodes(itemId, htmlObject.parentObject);
    else
        return 0;
};
XTree.prototype._clearStyles = function(itemObject){
    var td1 = itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[1];
    var td3 = td1.nextSibling.nextSibling;
    if (this.checkBoxOn) {
        td1.childNodes[0].style.display = "";
        td1.childNodes[0].onclick = this.onCheckBoxClick;
    } else
        td1.childNodes[0].style.display = "none";
    td1.childNodes[0].treeNod = this;
    this.dragger.removeDraggableItem(td3);
    if (this.dragAndDropOff)
        this.dragger.addDraggableItem(td3, this);
    td3.childNodes[0].className = "standartTreeRow";
    // td3.onclick = this.onRowSelect;
    itemObject.span.onclick = this.onRowSelect;
    // td3.ondblclick = this.onRowDblClick;
    itemObject.span.ondblclick = this.onRowDblClick;
    td1.previousSibling.onclick = this.onRowClick; // onOpen事件

    this._correctAllLine(itemObject);
    this._correctPlus(itemObject);
    for (var i = 0; i < itemObject.childsCount; i += 1)
        this._clearStyles(itemObject.childNodes[i]);
};
XTree.prototype._registerBranch = function(itemObject, oldTree){
    itemObject.id = this._globalIdStorageAdd(itemObject.id, itemObject);
    itemObject.treeNod = this;
    if (oldTree)
        oldTree._globalIdStorageSub(itemObject.id);
    for (var i = 0; i < itemObject.childsCount; i += 1)
        this._registerBranch(itemObject.childNodes[i], oldTree);
    return 0;
};
XTree.prototype.enableThreeStateCheckboxes = function(mode){
    this.tscheck = convertStringToBoolean(mode);
};
/*设置是否显示节点图标*/
XTree.prototype.enableTreeImages = function(mode){
    this.timgen = convertStringToBoolean(mode);
};
XTree.prototype.enableFixedMode = function(mode){
    this.hfMode = convertStringToBoolean(mode);
};
/*设置是否显示checkbox*/
XTree.prototype.enableCheckBoxes = function(mode){
    mode = convertStringToBoolean(mode);
    // if (mode)
    // this.enableRadios(false); //by wangxl
    this.checkBoxOn = mode;
};

/**
 * by wangxl 设置是否显示radio
 */
XTree.prototype.enableRadios = function(mode){
    mode = convertStringToBoolean(mode);
    // if (mode)
    // this.enableCheckBoxes(false);
    this.radioOn = mode;
};

/*设置节点图标，将应用于所有节点图标*/
XTree.prototype.setStdImages = function(image1, image2, image3){
    this.imageArray[0] = image1;
    this.imageArray[1] = image2;
    this.imageArray[2] = image3;
};
/*设置是否显示竖线*/
XTree.prototype.enableTreeLines = function(mode){
    this.treeLinesOn = convertStringToBoolean(mode);
}
XTree.prototype.setImageArrays = function(arrayName, image1, image2, image3,
        image4, image5){
    switch (arrayName) {
        case "plus" :
            this.plusArray[0] = image1;
            this.plusArray[1] = image2;
            this.plusArray[2] = image3;
            this.plusArray[3] = image4;
            this.plusArray[4] = image5;
            break;
        case "minus" :
            this.minusArray[0] = image1;
            this.minusArray[1] = image2;
            this.minusArray[2] = image3;
            this.minusArray[3] = image4;
            this.minusArray[4] = image5;
            break;
    }
};

XTree.prototype.openItem = function(item){
    var sNode = this.getNode(item);
    if (!sNode)
        return 0;
    this._HideShow(sNode, 2);
    if ((sNode.parentObject) && (this._getOpenState(sNode.parentObject) < 0))
        this.openItem(sNode.parentObject.id);
};

/**
 * 关闭节点 Modified by wangxl
 * 
 * @param sNode XTreeItem | string 结点对象 | 结点Id
 * @param closeSub boolean 是否关闭其下所有子节点
 */
XTree.prototype.closeItem = function(sNode, closeSub){
    sNode = this.getNode(sNode);
    if (!sNode)
        return 0;

    if (closeSub) {
        for (var i = 0; i < sNode.childsCount; i += 1) {
            this.closeItem(sNode.childNodes[i], true);
        }
    }
    if (sNode.closeble)
        this._HideShow(sNode, 1);
};

/**
 * Added by wangxl 展开到指定层数
 * 
 * @param level number 层数
 * @param sNode XTreeItem 当前操作节点 private 供内部递归调用
 */
XTree.prototype.openLevel = function(level, sNode){
    if (!sNode) {
        sNode = this.getRootItem();
        this.closeItem(sNode, true);
    }

    if (sNode.getLevel() < level) {
        for (var i = 0; i < sNode.childsCount; i += 1) {
            this.openLevel(level, sNode.childNodes[i]);
        }
    } else {
        this.openItem(sNode);
    }
}

/**
 * Added by wangxl 关闭指定层数之下所有及节点
 * 
 * @param level number 层数
 */
XTree.prototype.closeLevel = function(level){
    // @todo
}

// 取得节点所在的层级数。
XTree.prototype.getLevel = function(item){
    if (typeof(item) == "string") {
        item = this._globalIdStorageFind(item);
    }
    if (!item)
        return 0;
    return this._getNodeLevel(item, 0);
};
XTree.prototype.setItemCloseable = function(itemId, flag){
    flag = convertStringToBoolean(flag);
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.closeble = flag;
};
XTree.prototype._getNodeLevel = function(itemObject, count){
    if (itemObject.parentObject)
        return this._getNodeLevel(itemObject.parentObject, count + 1);
    return (count);
};
XTree.prototype.hasChildren = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    else {
        if ((this.XMLsource) && (!temp.XMLload))
            return true;
        else
            return temp.childsCount;
    }
    ;
};

// 设置节点文字
XTree.prototype.setItemText = function(itemId, newLabel){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.label = newLabel;
    temp.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML = newLabel;
};

// 设置节点的动作链接
XTree.prototype.setItemHref = function(itemId, newHref){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.href = newHref;
};

// 设置节点的显示链接的目标容器。
XTree.prototype.setItemTarget = function(itemId, newTarget){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.target = newTarget;
};

XTree.prototype.refreshItem = function(itemId){
    if (!itemId)
        itemId = this.rootId;
    var temp = this._globalIdStorageFind(itemId);
    this.deleteChildItems(itemId);
    this.loadXML(this.XMLsource + getUrlSymbol(this.XMLsource) + "id="
            + escape(itemId));
};
XTree.prototype.setItemImage2 = function(itemId, image1, image2, image3){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    temp.images[1] = image2;
    temp.images[2] = image3;
    temp.images[0] = image1;
    this._correctPlus(temp);
};
XTree.prototype.setItemImage = function(itemId, image1, image2){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    if (image2) {
        temp.images[1] = image1;
        temp.images[2] = image2;
    } else
        temp.images[0] = image1;
    this._correctPlus(temp);
};
// 取得指定节点下的子节点(不递归)
XTree.prototype.getSubItems = function(itemId){
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;

    var z = "";
    for (var i = 0; i < temp.childsCount; i += 1) {
        if (!z) {
            z = temp.childNodes[i].id;
        } else {
            z += XTree.SEPARATOR + temp.childNodes[i].id;
        }
    }
    return z;
};
// 取得所有的子节点(递归)
XTree.prototype.getAllSubItems = function(itemId){
    return this._getAllSubItems(itemId);
}
XTree.prototype._getAllSubItems = function(itemId, z, node){
    var temp;
    if (node) {
        temp = node;
    } else {
        temp = this._globalIdStorageFind(itemId);
    }
    if (!temp)
        return 0;
    z = "";
    for (var i = 0; i < temp.childsCount; i += 1) {
        if (!z)
            z = temp.childNodes[i].id;
        else
            z += XTree.SEPARATOR + temp.childNodes[i].id;
        var zb = this._getAllSubItems(0, z, temp.childNodes[i])
        if (zb)
            z += XTree.SEPARATOR + zb;
    }
    return z;
};
/*将节点置于被选择状态*/
XTree.prototype.selectItem = function(itemId, mode){
    mode = convertStringToBoolean(mode);
    var temp = this._globalIdStorageFind(itemId);
    if (!temp)
        return 0;
    if (this._getOpenState(temp.parentObject) == -1) {
        this.openItem(itemId);
    }
    if (mode) {
        this.onRowSelect(0,
            temp.htmlNode.childNodes[0].childNodes[0].childNodes[3], false);
    } else {
        this.onRowSelect(0,
            temp.htmlNode.childNodes[0].childNodes[0].childNodes[3], true);
    }
};
// 取得被选择的节点文字
XTree.prototype.getSelectedItemText = function(){
    if (this.lastSelected)
        return this.lastSelected.parentObject.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML;
    else
        return ("");
};

XTree.prototype._deleteNode = function(itemId, htmlObject, skip){

    if (!skip) {
        this._globalIdStorageRecSub(htmlObject);
    }
    if ((!htmlObject) || (!htmlObject.parentObject))
        return 0;
    var tempos = 0;
    var tempos2 = 0;
    if (htmlObject.tr.nextSibling)
        tempos = htmlObject.tr.nextSibling.nodem;
    if (htmlObject.tr.previousSibling)
        tempos2 = htmlObject.tr.previousSibling.nodem;
    var sN = htmlObject.parentObject;
    var Count = sN.childsCount;
    var Nodes = sN.childNodes;
    for (var i = 0; i < Count; i += 1) {
        if (Nodes[i].id == itemId) {
            if (!skip) {
                sN.htmlNode.childNodes[0].removeChild(Nodes[i].tr);
                Nodes.splice(i, 1);
            }
            break;
        }
    }
    if (!skip) {
        sN.childsCount -= 1;
    }

    if (tempos) {
        this._correctPlus(tempos);
        this._correctAllLine(tempos);
    }
    if (tempos2) {
        this._correctPlus(tempos2);
        this._correctAllLine(tempos2);
    }
    if (this.tscheck)
        this._correctCheckStates(sN);
};

/**
 * 设置单选按钮点击状态 by wangxl
 */
XTree.prototype.setRadioCheck = function(item, state){
    var sNode = this.getNode(item);
    if (!sNode)
        return;
    this._setRadioCheck(sNode, state);
}

XTree.prototype._setRadioCheck = function(sNode, state){
    state = convertStringToBoolean(state);
    var image = sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (state) {
        // 取消已选择单选按钮的状态
        // for (var i = 0; i < this._globalIdStorageSize; i+=1) {
        // var node = this.globalNodeStorage[i];
        // if (node != sNode)
        // this._setRadioCheck(node, false);
        // }
        if (this._selectedRadioItem)
            this._setRadioCheck(this._selectedRadioItem, false);

        sNode.checkstate = 1;
        this._selectedRadioItem = sNode;
    } else {
        sNode.checkstate = 0;
        this._selectedRadioItem = null;
    }
    image.src = this.radioArray[sNode.checkstate];
}

XTree.prototype.setCheck = function(item, state){
    state = convertStringToBoolean(state);
    var sNode = this.getNode(item);
    if (!sNode) {
        return;
    }
    if (!this.tscheck) {
        return this._setSubChecked(state, sNode);
    } else {
        this._setCheck(sNode, state);
    }
    this._correctCheckStates(sNode.parentObject);
};

XTree.prototype._setCheck = function(sNode, state){
    var z = sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (state == "notsure") {
        sNode.checkstate = 2;
    } else if (state) {
        // checked
        sNode.checkstate = 1;
    } else {
        // uncheck
        sNode.checkstate = 0;
    }
    z.src = this.checkArray[sNode.checkstate];
};

XTree.prototype.setSubChecked = function(item, state){
    var sNode = this.getNode(item);
    this._setSubChecked(state, sNode);
    this._correctCheckStates(sNode.parentObject);
}
XTree.prototype._setSubChecked = function(state, sNode){
    state = convertStringToBoolean(state);
    if (!sNode)
        return;
    var i = 0;
    while (i < sNode.childsCount) {
        this._setSubChecked(state, sNode.childNodes[i]);
        i += 1;
    }
    var z = sNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (state)
        sNode.checkstate = 1;
    else
        sNode.checkstate = 0;
    z.src = this.checkArray[sNode.checkstate];
};
XTree.prototype.isItemChecked = function(item){
    var sNode = this.getNode(item);
    if (!sNode) {
        return;
    }
    return sNode.checkstate;
};
XTree.prototype.getAllChecked = function(){
    return this._getAllChecked("", "", 1);
}
/*取得所有已勾选的节点.返回一个TreeItem的数组。*/
XTree.prototype.getCheckedItems = function(){
    var list = this.getAllChecked();
    if (list) {
        var items = [];
        var ids = list.split(XTree.SEPARATOR);
        if (ids.length <= 1 && XTree.SEPARATOR != ";") {
            ids = list.split(";");
        }
        for (var i = 0; i < ids.length; i += 1) {
            items.push(this.getItemObj(ids[i]));
        }
        return items;
    }
    return null;
}
XTree.prototype.getAllCheckedBranches = function(){
    return this._getAllChecked("", "", 0);
}
XTree.prototype._getAllChecked = function(htmlNode, list, mode){
    if (!htmlNode)
        htmlNode = this.htmlNode;
    if (((mode) && (htmlNode.checkstate == 1))
            || ((!mode) && (htmlNode.checkstate > 0))) {
        if (list)
            list += XTree.SEPARATOR + htmlNode.id;
        else
            list = htmlNode.id;
    }
    var j = htmlNode.childsCount;
    var i = 0;
    while (i < j) {
        list = this._getAllChecked(htmlNode.childNodes[i], list, mode);
        i += 1;
    }
    ;
    if (list)
        return list;
    else
        return "";
};
XTree.prototype.deleteChildItems = function(itemId){
    var sNode = this._globalIdStorageFind(itemId);
    if (!sNode)
        return;
    var j = sNode.childsCount;
    var i = 0;
    while (i < j) {
        this._deleteNode(sNode.childNodes[0].id, sNode.childNodes[0]);
        i += 1;
    }
    this._correctPlus(sNode);
};
/**
 * 删除指定的节点。
 * 
 * @param itemId 要删除的节点id
 * @param selectPaarent 删除后是否选中父节点。
 */
XTree.prototype.deleteItem = function(itemId, selectParent){
    this._deleteItem(itemId, selectParent);
}
XTree.prototype._deleteItem = function(itemId, selectParent, skip){
    selectParent = convertStringToBoolean(selectParent);
    var sNode = this._globalIdStorageFind(itemId);
    if (!sNode)
        return;
    if (selectParent)
        this.selectItem(this.getParentId(this.getSelectedItemId()), 1);
    if (!skip) {
        this._globalIdStorageRecSub(sNode);
    }
    ;
    var zTemp = sNode.parentObject;
    this._deleteNode(itemId, sNode, skip);
    this._correctPlus(zTemp);
    this._correctAllLine(zTemp);
};
XTree.prototype._globalIdStorageRecSub = function(itemObject){
    var i = 0;
    while (i < itemObject.childsCount) {
        this._globalIdStorageRecSub(itemObject.childNodes[i]);
        this._globalIdStorageSub(itemObject.childNodes[i].id);
        i += 1;
    }
    this._globalIdStorageSub(itemObject.id);
};

// 插入新的子节点.
XTree.prototype.insertNewItem = function(parentObj, itemId, itemText,
        itemActionHandler, image1, image2, image3, optionStr, childs, href,
        target){
    if (!parentObj)
        return (-1);
    return this._attachChildNode(parentObj, itemId, itemText,
        itemActionHandler, image1, image2, image3, optionStr, childs, null,
        href, target);
};

// 插入新的兄弟节点
XTree.prototype.insertNewNext = function(parentObj, itemId, itemName,
        itemActionHandler, image1, image2, image3, optionStr, childs, href,
        target){
    if (!parentObj)
        return (0);
    return this._attachChildNode(0, itemId, itemName, itemActionHandler,
        image1, image2, image3, optionStr, childs, parentObj, href, target);
};

XTree.prototype.getItemIdByIndex = function(itemId, index){
    var z = this._globalIdStorageFind(itemId);
    if (!z)
        return 0;
    var temp = z.htmlNode.childNodes[0].childNodes[0];
    while (index > 0) {
        temp = temp.nextSibling;
        if ((!temp) || (!temp.nodem))
            return 0;
        index -= 1;
    }
    return temp.nodem.id;
};
XTree.prototype.getChildItemIdByIndex = function(itemId, index){
    var sNode = this._globalIdStorageFind(itemId);
    if (!sNode)
        return (0);
    if (this.hasChildren(itemId) < index)
        return 0;
    return sNode.htmlNode.childNodes[0].childNodes[index].nodem.id;
};
XTree.prototype.setDragHandler = function(func){
    if (typeof(func) == "function")
        this.dragFunc = func;
    else
        this.dragFunc = eval(func);
};
XTree.prototype._clearMove = function(htmlNode){
    if (htmlNode.parentObject.span) {
        htmlNode.parentObject.span.className = 'standartTreeRow';
        if (htmlNode.parentObject.acolor)
            htmlNode.parentObject.span.style.color = htmlNode.parentObject.acolor;
    }
};
// 是否启用拖放节点的功能。
XTree.prototype.enableDragAndDrop = function(mode){
    this.dragAndDropOff = convertStringToBoolean(mode);
};
// 检查树是否可拖放。
XTree.prototype.canDragAndDrop = function(){
    return this.dragAndDropOff;
}
XTree.prototype._setMove = function(htmlNode){
    if (htmlNode.parentObject.span) {
        htmlNode.parentObject.span.className = 'selectedTreeRow';
        if (htmlNode.parentObject.scolor)
            htmlNode.parentObject.span.style.color = htmlNode.parentObject.scolor;
    }
};
XTree.prototype._createDragNode = function(htmlObject){
    var dhtmlObject = htmlObject.parentObject;
    if (this.lastSelected)
        this._clearMove(this.lastSelected);
    var dragSpan = this.doc.createElement('div');
    dragSpan.appendChild(this.doc
            .createTextNode(dhtmlObject.getItemPlainText()));
    dragSpan.style.position = "absolute";
    dragSpan.className = "dragSpanDiv";
    return dragSpan;
}
XTree.prototype._preventNsDrag = function(e){
    if ((e) && (e.preventDefault)) {
        e.preventDefault();
        return false;
    }
}

XTree.prototype._drag = function(sourceHtmlObject, dhtmlObject,
        targetHtmlObject, dndResult){
    if (!targetHtmlObject.parentObject) {
        targetHtmlObject = this.htmlNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    } else
        this._clearMove(targetHtmlObject);
    if (dhtmlObject.lastSelected)
        dhtmlObject._setMove(dhtmlObject.lastSelected);
    if ((!this.dragMove) || (this.dragMove()))
        this._moveNode(sourceHtmlObject.parentObject,
            targetHtmlObject.parentObject, dndResult);

}
/*
 * @param htmlObject
 * @param shtmlObject 被拖动的源节点对象
 */
XTree.prototype._dragIn = function(htmlObject, shtmlObject){
    if (!htmlObject.parentObject) {
        return htmlObject;
    }
    if (shtmlObject.parentObject
            && (!this._checkParenNodes(shtmlObject.parentObject.id,
                htmlObject.parentObject, shtmlObject.parentObject))
            && (htmlObject.parentObject.id != shtmlObject.parentObject.id)) {
        this._setMove(htmlObject);
        if (this._getOpenState(htmlObject.parentObject) < 0)
            this._autoOpenTimer = this.wnd.setTimeout(new callerFunction(
                    this._autoOpenItem, this), 1000);
        this._autoOpenId = htmlObject.parentObject.id;
        return htmlObject;
    } else
        return 0;
}
XTree.prototype._autoOpenItem = function(e, treeObject){
    treeObject.openItem(treeObject._autoOpenId);
};
XTree.prototype._dragOut = function(htmlObject){
    if (!htmlObject.parentObject)
        return 0;
    this._clearMove(htmlObject);
    if (this._autoOpenTimer)
        clearTimeout(this._autoOpenTimer);
}

// 创建一个新的xml文档对象
XTree.prototype._createXmlDoc = function(){
    var xmlDoc;
    try { // for FF/Mozilla
        xmlDoc = this.doc.implementation.createDocument("", "", null);
    } catch (e) { // for IE
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    }
    return xmlDoc;
}

/**
 * 将树的所有节点导出为xml文档对象。
 */
XTree.prototype.export2Xml = function(){
    var xmlDoc = this._createXmlDoc();
    var rootNode = xmlDoc.createElement("tree");
    xmlDoc.appendChild(rootNode);
    rootNode.setAttribute("id", this.rootId);

    this._lookupTreeNodes(this.rootId, xmlDoc, rootNode);

    return xmlDoc;
}
// 遍历tree节点，将其加到xml文档中。
XTree.prototype._lookupTreeNodes = function(itemId, xmlDoc, xmlNode){
    var treeItem = this._globalIdStorageFind(itemId);
    if (!treeItem)
        return;
    var count = treeItem.childsCount;
    if (count == 0)
        return;
    var i = 0;
    while (i < count) {
        var item = treeItem.childNodes[i];
        i += 1;
        var text = item.label;
        var id = item.id;
        var href = item.href;
        var target = item.target;
        var m0 = item.images[0];
        var m1 = item.images[1];
        var m2 = item.images[2];

        var xNode = xmlDoc.createElement("item");
        xNode.setAttribute("text", text);
        xNode.setAttribute("id", id);
        xNode.setAttribute("open", "1");
        xNode.setAttribute("href", href || "");
        xNode.setAttribute("target", target || "");
        // FIXME:
        if (m0)
            xNode.setAttribute("im0", m0);
        if (m1)
            xNode.setAttribute("im1", m1);
        if (m2)
            xNode.setAttribute("im2", m2);
        xmlNode.appendChild(xNode);

        this._lookupTreeNodes(id, xmlDoc, xNode);
    }
}
/**
 * 将tee结构导出为xml的字串形式。
 */
XTree.prototype.export2Str = function(){
    var xmlDoc = this.export2Xml();
    var xmlHeader = "<?xml version='1.0' encoding='GBK'?>";
    if (navigator.appName == 'Microsoft Internet Explorer') { // for IE
        var xml = xmlDoc.xml;
        return xmlHeader + xmlDoc.xml;
    } else { // for FF/MOzilla
        var serializer = new XMLSerializer();
        var xml = serializer.serializeToString(xmlDoc);
        return xmlHeader + xml;
    }
}

/**
 * 获得是否动态加载
 */
XTree.prototype.isDynamicLoad = function(){
    return this._isDynamicLoad ? this._isDynamicLoad : false;
}

/**
 * 设置是否动态加载
 */
XTree.prototype.setDynamicLoad = function(){
    this._isDynamicLoad = true;
}

/**
 * 动态加载抽象方法
 */
XTree.prototype.loadTreeFromXML = function(item){
}

XTreeItem.prototype.setOnMouseOver = function(func){
    if (!func)
        return;
    var self = this;
    if (typeof(func) == "function") {
        this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].onmouseover = function(
                e){
            self.getOwner().selectItem(self.id, false);
            doCallBack(func, e, self.id);
            return false;
        };
    }
}
XTreeItem.prototype.setOnMouseOut = function(func){
    if (!func)
        return;
    var self = this;
    if (typeof(func) == "function") {
        this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].onmouseout = function(
                e){
            self.getOwner().selectItem(self.id, false);
            doCallBack(func, e, self.id);
            return false;
        };
    }
}

XTreeItem.prototype.setOnclick = function(func){
    if (!func)
        return;
    var self = this;
    if (typeof(func) == "function") {
        this.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].onclick = function(
                e){
            self.getOwner().selectItem(self.id, false);
            doCallBack(func, e, self.id);
            return false;
        };
    }
}
