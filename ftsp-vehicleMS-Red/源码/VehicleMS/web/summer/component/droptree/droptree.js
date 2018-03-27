DropTree.imagePath = sys.getPluginPath() + "/droptree/images/menu/";

/**
 * by wangtt
 */
function DropTree(wnd, parent, width, height, needWholename, saveType){
    if (_biInPrototype) {
        return;
    }
    FloatDivMenu.call(this, wnd, parent, width, height);
    this.refonclick = false;
    this.needWholename = needWholename == 'true';
    this._initCtrl();
    this.saveType = saveType;// add by wangtt
}
_extendClass(DropTree, FloatDivMenu, "DropTree");
DropTree.prototype.dispose = function(){
    if (this.refonclick) {
        this._removeOnClickEventListener();
    }
    FloatDivMenu.prototype.dispose.call(this);
};
DropTree.prototype.setParentElement = function(v){
    this.parentElement = v;
};
DropTree.prototype.showDropDownList = function(value, noHidden){
    if (this.refonclick) {
        if (value) {
            this._addOnClickEventListener();
        } else {
            this._removeOnClickEventListener();
        }
    }
    FloatDivMenu.prototype.showDropDownList.call(this, value, noHidden);
};
/*是否监听点击事件，默认不监听*/
DropTree.prototype.setRefOnClickEvent = function(v){
    this.refonclick = v;
};
/*监听点击事件*/
DropTree.prototype._addOnClickEventListener = function(){
    if (this.hasAddOnClickEvent) {
        return;
    }
    var self = this;
    var doc = self.doc;
    var wnd = doc.parentWindow;
    this._mouseDownListener = function(e){
        if (!e) {
            e = wnd.event;
        }
        var mouseobj = _getMouseEventSanComponent(e);
        if (mouseobj && mouseobj._className == "FloatDiv") {
            return;
        }
        if (self.floatdiv.isVisible()) {
            self.show(false);
        }
    };
    attacheEvent4TopIframes("add", "mousedown", this._mouseDownListener);
    this.hasAddOnClickEvent = true;
};
/*删除点击事件*/
DropTree.prototype._removeOnClickEventListener = function(){
    if (this.hasAddOnClickEvent) {
        attacheEvent4TopIframes("remove", "mousedown", this._mouseDownListener);
        this.hasAddOnClickEvent = false;
    }
};
DropTree.prototype._initCtrl = function(){
    var self = this;
    // if(typeof(XTree) == 'undefined') sys.lib.include("sanlib/js/xtree.js");
    var baseDiv = this.doc.createElement("div");
    with (baseDiv.style) {
        width = "100%";
        height = this.floatdiv.__getBaseDom().style.height;
    }
    var table = this.doc.createElement("table");
    with (table) {
        border = "0";
        cellPadding = "0";
        cellSpacing = "0";
        width = "100%";
        with (table.style) {
            position = "relative";
            height = "100%";
            border = "2px solid #c3daf9";
        }
    }
    var tbody = this.doc.createElement("tbody");
    var tr1 = this.doc.createElement("tr");
    var td1 = this.doc.createElement("td");
    with (td1.style) {
        backgroundImage = "url(" + DropTree.imagePath + "border.gif)";
        height = "22px";
    }
    tr1.appendChild(td1);

    var tr2 = this.doc.createElement("tr");
    var td2 = this.doc.createElement("td");
    with (td2.style) {
        width = "100%";
        height = this.floatdiv.__getBaseDom().style.height;
    }
    tr2.appendChild(td2);

    tbody.appendChild(tr1);
    tbody.appendChild(tr2);
    table.appendChild(tbody);
    baseDiv.appendChild(table);

    var div = this.doc.createElement("div");
    td2.appendChild(div);
    with (div) {
        width = "100%";
        height = this.floatdiv.__getBaseDom().style.height;
        position = "relative";
    }

    // 创建下拉菜单
    if (!this.tree) {
        this.tree = new XTree(this.getWindow(), div, "100%", "100%", 0);
        this.tree.setOnClickHandler(function(id){
                self.onClick(id);
            });
        this.tree.setOnDblClickHandler(function(id){
            });
    }

    this._menuContent = td1;
    this.floatdiv.getDom().appendChild(baseDiv);
};

DropTree.prototype.createButton = function(quick){
    var style = "style='background-image:url("
            + DropTree.imagePath
            + "button.gif);width:41px; height:19px;border:0px;padding-top:3px;color:#014189'";
    var strBuff = "<table cellpadding=0 cellspacing=0 width='100%'><tr>";
    if (quick && quick == true) {
        strBuff += "<td align='left'><input id='NavQuick' type='text' style='width:80px;height:20px;'><input type='button' "
                + style + " value='检索' onClick='quicklookup(NavQuick)'></td>";
    }
    // modify by wangtt
    // 增加dealSelect4DropTree参数
    strBuff += "<td align='right'><input type='button' "
            + style
            + " value='确定' onClick='var self = _getMouseEventTarget(event).ownerDocument._sancombobox_dropdown_obj;"
            + "dealSelect4DropTree(self);self.showDropDownList(false);' /> &nbsp;";
    if (!this.tree.radioOn) {
        strBuff += "<input type='button' "
                + style
                + " value='全选' onClick='var self = _getMouseEventTarget(event).ownerDocument._sancombobox_dropdown_obj;"
                + "self.selectAll(1);' /> &nbsp;<input type='button' "
                + style
                + " value='清空' onClick='var self = _getMouseEventTarget(event).ownerDocument._sancombobox_dropdown_obj; self.selectAll(0);'/>";
    } else {
        strBuff += "<input type='button' "
                + style
                + " value='清空' onClick='var self = _getMouseEventTarget(event).ownerDocument._sancombobox_dropdown_obj; self.selectAll(0);'/>";
    }
    strBuff += "</td></tr></table>";
    this._menuContent.innerHTML = strBuff;
}

DropTree.prototype.onClick = function(id){
    var node = this.tree.getNode(id);
    if (this.tree.checkBoxOn) {
        this.tree.setCheck(node, !node.isChecked());
        this.tree.selectChanged = true;
    } else if (this.tree.radioOn) {
        this.tree.setRadioCheck(node, !node.isChecked());
        this.tree.selectChanged = true;
    }
};
DropTree.prototype.setOnClick = function(v){
    this.callbackonclick = v;
};
DropTree.prototype.__beforeShowDropDownList = function(){
};
DropTree.prototype.expandTree = function(item){
    if (item.isExpanded()) {
        item.setExpanded(false);
    } else {
        item.setExpanded(true);
    }
};
DropTree.prototype.setOpenLevel = function(level){
    this.openLevel = level;
};
DropTree.prototype.setLoadLevel = function(level){
    this._loadLevel = level;
};
DropTree.prototype.setLoadUrl = function(url){
    this._loadUrl = url;
};

/**
 * @param state 选择状态 1：选择 0:去除
 */
DropTree.prototype.selectAll = function(state){
    this.tree.selectChanged = true;
    this.tree._selectAllState = state;
    this.tree.selectedDynamic = null;
    if (this.tree.radioOn) {
        var item = this.tree.getSelectedRadioItem();
        this.tree.setRadioCheck(item, state);
        var scb_dd_obj = window.document._sancombobox_dropdown_obj;
        dealSelect4DropTree(scb_dd_obj);
        scb_dd_obj.showDropDownList(false);
    } else {
        var root = this.tree.getRootItem();
        this.tree.setSubChecked(root, state);
    }
}
