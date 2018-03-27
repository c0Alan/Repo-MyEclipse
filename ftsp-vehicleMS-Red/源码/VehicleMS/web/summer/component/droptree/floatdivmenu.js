/*基于floatdiv的下拉菜单*/
function FloatDivMenu(wnd, parent, width, height){
    if (_biInPrototype) {
        return;
    }
    SanComponent.call(this, wnd, parent, width, height);
    this.floatdiv = new FloatDiv(this.wnd, null, width, height);
    this.floatdiv.setBounds(null, null, width, height);
    this.floatdiv.setBorderWidth("2px outset");
    this.floatdiv.setVisible(false);
    this.floatdiv.setParentElement(this.doc.body);
    this.floatdiv._setDiv1Height(height);
}

_extendClass(FloatDivMenu, SanComponent, "FloatDivMenu");

FloatDivMenu.prototype.__getBaseDom = function(){
    return this.floatdiv.__getBaseDom();
}

FloatDivMenu.prototype.__afterShowDropDownList = function(){

}

FloatDivMenu.prototype.setWidth = function(v){
    this.floatdiv._setDiv1Width(v);
}

FloatDivMenu.prototype.setHeight = function(v){
    this.floatdiv._setDiv1Height(v);
}

FloatDivMenu.prototype.showDropDownList = function(value, noHidden){
    if (this.floatdiv.isVisible() == value) {
        return;
    }
    if (value) {
        /*修改弹出控件的显示位置*/
        // modified by zhout 2009-02-15 ver:5.0.0.37
        var Winw = document.body.offsetWidth;
        var Winh = document.body.offsetHeight;
        var Frh = parseInt(this.floatdiv.div1.style.height);// 得到弹出控件的高度
        var Frw = parseInt(this.floatdiv.div1.style.width);// 得到弹出控件的宽度
        var Frs = 4;
        var Frl = this.parentElement.getBoundingClientRect().left;
        var Frt = this.parentElement.getBoundingClientRect().top
                + this.parentElement.clientHeight;
        var offsetLeft = getLeft(this.parentElement) - Frl;
        var offsetTop = getTop(this.parentElement) - Frt
                + this.parentElement.clientHeight;
        if (((Frl + Frw + Frs) > Winw) && (Frw + Frs < Winw)) {
            Frl = Winw - Frw - Frs;
        }
        if ((Frt + Frh + Frs > Winh) && (Frh + Frs < Winh)) {
            Frt = Winh - Frh - Frs;
        }
        Frl += offsetLeft;
        Frt += offsetTop;

        this.floatdiv.setBounds(Frl, Frt, null, null);
        this.__beforeShowDropDownList();
    }
    this.floatdiv.setVisible(value);
    if (value) {
        if (isie) {
            // 此处不能setcapture，因为这样会使下拉框无法resize
            // this.floatdiv.setCapture();
        } else {
            this.wnd.captureEvents(Event.MOUSEDOWN);
        }
        // addEvent(this.doc, "mousedown", this._doconmousedown, false);
        this.doc._sancombobox_dropdown_obj = this;
        /*是否当点击其他区域时隐藏该树型结构*/
        if (noHidden && noHidden == true) {
        } else {
            attacheEvent4TopIframes("add", "mousedown", this._doconmousedown);
        }
        this.__afterShowDropDownList();
    } else {
        // removeEvent(this.getDocument(), "mousedown", this._doconmousedown,
        // false);
        attacheEvent4TopIframes("remove", "mousedown", this._doconmousedown);
        if (isie) {
            // this.getDocument().body.releaseCapture();
        } else {
            this.wnd.releaseEvents(Event.MOUSEDOWN);
        }
        this.doc._sancombobox_dropdown_obj = null;
    }
}

FloatDivMenu.prototype._doconmousedown = function(e){
    if (!e) {
        e = this.wnd.event;
    }
    var self = _getMouseEventTarget(e).ownerDocument._sancombobox_dropdown_obj;
    if (!self) {
        if (this.document._sancombobox_dropdown_obj) {
            // this.document._sancombobox_dropdown_obj.showDropDownList(false);
        	// limin 修改 2011年9月22日
        	self = this.document._sancombobox_dropdown_obj;
        }else{
        	return;
        }
    }
    var mouseobj = _getMouseEventSanComponent(e);
    if (mouseobj && (mouseobj == self || mouseobj == self.floatdiv)) {
        return;
    }

    // -- by wangxl
    if (self._beforeMenuCloseFunc) {
        if (self._saveType) {
            // "self._saveType" add by wangtt
            self._beforeMenuCloseFunc(self, self._saveType);
        } else {
            self._beforeMenuCloseFunc(self);
        }
    }

    self.showDropDownList(false);
}

FloatDivMenu.prototype.dispose = function(){
    if (this.floatdiv) {
        this.floatdiv.dispose = null;
        this.floatdiv = null;
    }
}

/**
 * --Added by wangxl 设定菜单收起时的回调函数（收起菜单相当于确定操作）
 */
FloatDivMenu.prototype.setBeforeMenuCloseFunc = function(func){
    this._beforeMenuCloseFunc = func;
}

/**
 * --Added by wangtt
 * 设定菜单收起时的回调函数中的保存方式参数saveType
 */
FloatDivMenu.prototype.setSaveType = function(saveType){
    this._saveType = saveType;
}
