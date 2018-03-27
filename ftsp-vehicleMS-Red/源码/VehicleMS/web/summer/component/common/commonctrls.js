/**
文件名:
sanlib/js/commonctrls.js

用途:
这个js文件定义的是一个基类,其它组件都继承这个基类.另外还定义了一些基本组件。

用法：
todo
*/

var commonctrls_imagePath = sys.getPluginPath() + "/common/images/";

function SanComponent(wnd, parentElement, width, height){
    if (_biInPrototype)
        return;
    this.width = width;
    this.height = height;
    this.wnd = wnd ? wnd : window;
    this.doc = this.wnd.document;
    this.parentElement = typeof(parentElement) == "string" ? this.doc
            .getElementById(parentElement) : (typeof(parentElement) == "object"
            ? parentElement
            : this.doc.body);
    this.cssClassPrefix = "";
}

/*创建该组件，调用方法，var s = SanComponent.create();*/
SanComponent.create = function(wnd){
    return new SanComponent(wnd);
}

/*返回类名*/
SanComponent.prototype.toString = function(){
    return "SanComponent";
}

/*获得父dom对象*/
SanComponent.prototype.getParentElement = function(){
    return this.parentElement;
}

// 设置对象的父dom，子类要实现__getBaseDom方法
SanComponent.prototype.setParentElement = function(v){
    this.parentElement = v;
    this.parentElement.appendChild(this.__getBaseDom());
}

/*返回此控件所属的document对象*/
SanComponent.prototype.getDocument = function(){
    return this.wnd.document;
}

/*类似getDocument().createElement(elmnt)*/
SanComponent.prototype.createElement = function(elmnt){
    return this.wnd.document.createElement(elmnt);
}

/*返回此控件所属的页面的window对象*/
SanComponent.prototype.getWindow = function(){
    return this.wnd;
}

/*设置组件的样式前缀*/
SanComponent.prototype.setCssClassPrefix = function(prefix){
    this.cssClassPrefix = prefix ? prefix : "";
}

/*获取组件的样式前缀*/
SanComponent.prototype.getCssClassPrefix = function(){
    return this.cssClassPrefix;
}

/*设置组件的样式文件和该样式的前缀*/
SanComponent.prototype.setCssStyle = function(name, prefix){
    addStyle(this.wnd.document, name);
    this.setCssClassPrefix(prefix);
}
/*获取指定的样式名，如设有样式前缀，则返回带有样式前缀的样式名*/
SanComponent.prototype.getCssClassName = function(name){
    if (this.cssClassPrefix) {
        return this.cssClassPrefix + name;
    } else {
        return name;
    }
}

/*获得此控件的最底层的dom对象，所有子类都必须实现此方法*/
SanComponent.prototype.__getBaseDom = function(){
    throwError("not implements");
}

/*返回此控件在y轴上的坐标,如果parentNode不传递则返回相对与自己的直接父控件的坐标，否则返回相对与指定parentNode的坐标*/
SanComponent.prototype.getTop = function(parentNode){
    if (!parentNode) {
        return this._getDomTop(this.__getBaseDom());
    }
    var dom = this.__getBaseDom();
    var pnode = dom.offsetParent;
    var r = this._getDomTop(dom, true);
    while (pnode != null && pnode != parentNode) {
        r += this._getDomTop(pnode, true);
        pnode = pnode.offsetParent;
    }
    return r;
}

SanComponent.prototype._getDomTop = function(dom, ignoreScroll){
    return dom.offsetTop - (ignoreScroll ? dom.scrollTop : 0);
}

/*返回此控件在x轴上的坐标,如果parentNode不传递则返回相对与自己的直接父控件的坐标，否则返回相对与指定parentNode的坐标*/
SanComponent.prototype.getLeft = function(parentNode){
    if (!parentNode) {
        return this._getDomLeft(this.__getBaseDom());
    }
    var dom = this.__getBaseDom();
    var pnode = dom.offsetParent;
    var r = this._getDomLeft(dom, true);
    while (pnode != null && pnode != parentNode) {
        r += this._getDomLeft(pnode, true);
        pnode = pnode.offsetParent;
    }
    return r;
}

SanComponent.prototype._getDomLeft = function(dom, ignoreScroll){
    return dom.offsetLeft - (ignoreScroll ? dom.scrollLeft : 0);
}

/*返回此控件的高度*/
SanComponent.prototype.getHeight = function(){
    var dom = this.__getBaseDom();
    return dom.offsetHeight;
}

/*返回此控件的宽度*/
SanComponent.prototype.getWidth = function(){
    var dom = this.__getBaseDom();
    return dom.offsetWidth;
}

/*设置此控件是否可见*/
SanComponent.prototype.setVisible = function(v){
    this.__getBaseDom().style.display = v ? "" : "none";
}

/*返回此控件是否可见*/
SanComponent.prototype.isVisible = function(){
    var s = this.__getBaseDom().style.display;
    return s != "none";
}

/*释放引用*/
SanComponent.prototype.dispose = function(){
    // alert('dispose SanComponent');
    this.wnd = null;
    this.doc = null;
    this.parentElement = null;
}

function FloatDiv(wnd, parentElement, width, height){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parentElement, width, height);

    /*用于reize的border的宽度*/
    this.RESIZE_BORDER = 3;

    this.div1 = this.createElement("div");
    this.div1.id = FloatDiv.DEFAULT_ID + Math.floor(Math.random() * 999999);
    // 最底层的div
    this.div1._sancomponent = this;
    with (this.div1.style) {
        position = "absolute";
        if (this.width)
            width = this.width + "px";
        if (this.height)
            height = this.height + "px";
        border = "0px";
        // if (isie) overflow = "hidden";
        backgroundColor = "#FFFFFF";
        whiteSpace = "nowrap";
        zIndex = 10020;
    }

    this.div2 = this.createElement("div");
    // 真正使用的div
    this.div2._sanobj = this;
    with (this.div2.style) {
        // width = "100%";
        whiteSpace = "nowrap";
        height = "100%";
        overflow = "hidden";
        border = this.RESIZE_BORDER + "px solid Silver";
        // 银灰色的边框
    }

    if (isie) {
        this.iframe = this.createElement("iframe");
        with (this.iframe) {
            frameBorder = 0;
            border = 0;
        }

        with (this.iframe.style) {
            position = "absolute";
            left = "0px";
            top = "0px";
            width = "100%";
            height = "100%";
            zIndex = (this.div2.style.zIndex - 1);
            borderWidth = "0px";
        }
    }

    // addEvent(this.div2, "mousedown", this._div2onmousedown, false);
    // addEvent(this.div2, "mousemove", this._div2onmousemove, true);

    this.div1.appendChild(this.div2);
    if (isie) {
        this.div1.appendChild(this.iframe);
    }

    if (this.parentElement)
        this.parentElement.appendChild(this.div1);

    this.resizing = false;
    // 是否正在resize

    // 如果this.resizing为真，则此变量表示鼠标点击那个点开始resize的
    // 0:客户区，1：左上角，2：上边，3：右上角，4：右边，5：右下角，6：下边，7：左下角，8：左边
    this.resizepoint = -1;

    this.resize_minwidth = 10;
    this.resize_minheight = 10;
    this.onresize = null;
    // 当此控件的size发生改变时回调。
}

// 0:客户区，1：左上角，2：上边，3：右上角，4：右边，5：右下角，6：下边，7：左下角，8：左边
FloatDiv.RESIZEPOINT_CLIENT = 0;
FloatDiv.RESIZEPOINT_LEFTTOP = 1;
FloatDiv.RESIZEPOINT_TOP = 2;
FloatDiv.RESIZEPOINT_RIGHTTOP = 3;
FloatDiv.RESIZEPOINT_RIGHT = 4;
FloatDiv.RESIZEPOINT_RIGHTBOTTOM = 5;
FloatDiv.RESIZEPOINT_BOTTOM = 6;
FloatDiv.RESIZEPOINT_LEFTBOTTOM = 7;
FloatDiv.RESIZEPOINT_LEFT = 8;
FloatDiv.RESIZECURSORS = ["auto", "nw-resize", "n-resize", "ne-resize",
    "w-resize", "se-resize", "s-resize", "sw-resize", "w-resize"];
FloatDiv.DEFAULT_ID = "_SLK$FLoatDiv_";

_p = _extendClass(FloatDiv, SanComponent, "FloatDiv");

_p.dispose = function(){
    // alert('dispose floatdiv');
    this.parentElement.removeChild(this.div1);
    this.div1._sancomponent = null;
    removeEvent(this.div2, "mousedown", this._div2onmousedown);
    removeEvent(this.div2, "mousemove", this._div2onmousemove, true);
    this.div1 = null;
    this.div2 = null;
    this.iframe = null;
    this.onresize = null;

    // 调用父类的释放函数
    SanComponent.prototype.dispose.call(this);
}

_p.getDom = function(){
    return this.div2;
}

_p.__getBaseDom = function(){
    return this.div1;
}

_p.setVisible = function(v){
    this.div1.style.display = v ? "" : "none";
    this._adjustIFrameSize();
}
_p.getHtml = function(){
    alert(this.div1.innerHTML);
}
/*设置此控件的坐标或者宽和高，如果设置了宽高则会触发onresize回调事件
所有参数都可以传递null表示忽略*/
_p.setBounds = function(x, y, w, h){
    with (this.div1.style) {
        var resized = false;
        if (typeof(w) == "number") {
            this._setDiv1Width(w);
            resized = true;
        }
        if (typeof(h) == "number") {
            this._setDiv1Height(h);
            resized = true;
        }
        if (typeof(x) == "number") {
            if (isie) {
                pixelLeft = x;
            } else {
                left = x + "px";
            }
        }
        if (typeof(y) == "number") {
            if (isie) {
                pixelTop = y;
            } else {
                top = y + "px";
            }
        }
        if (resized) {
            this._doOnResize();
        }
    }
}

/*设置floatdiv的边框，有边框才能resize，b可以时一个整形，也可以时一个字符串，如2px solid Silver*/
_p.setBorderWidth = function(b){
    this.RESIZE_BORDER = parseInt(b);
    if (typeof(b) == "number") {
        this.div2.style.border = b + "px solid Silver";
        // 银灰色的边框
    } else {
        this.div2.style.border = b;
    }
}

/*在ie里设置了div1的高度后div2本身是100％高的应该自动调整高度，但是ie有bug他不调整所以,
  */
_p._setDiv1Height = function(h){
    if (isie) {
        this.div2.style.height = h + "px";
    }
    this.div1.style.height = h + "px";
    if (isie) {
        this.div2.style.height = (h + 26) + "px";
        // 此处不能简单的将iframe的高度设置成100%，总是有问题
        // this.iframe.height = "100%";
        this.iframe.style.height = (h + 26) + "px";
    }
}

_p._adjustIFrameSize = function(){
    if (isie) {
        this.iframe.style.height = this.div1.clientHeight + "px";
        this.iframe.style.width = this.div1.clientWidth + "px";
    }
}

_p._setDiv1Width = function(w){
    if (isie) {
    }
    this.div1.style.width = w + "px";
    if (isie) {
        this.iframe.style.width = this.div1.clientWidth + "px";
    }

    return parseInt(this.div1.style.width) == w;
}

_p._div2onmousedown = function(e){
    if (!e)
        e = this.wnd.event;
    var self = _getMouseEventSanComponent(e);
    if (!self) {
        return;
    }
    self.resizePoint = self._getResizePoint(e);
    if (self.resizePoint > 0) {// 点击在边框上
        self.resizing = true;
        self.mouseDownX = self._getMouseX(e, self.div2);
        self.mouseDownY = self._getMouseY(e, self.div2);

        if (isie) {
            self.getDocument().body.setCapture();
        } else {
            self.wnd.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        addEvent(self.getDocument(), "mouseup", self._doconmouseup, false);
        addEvent(self.getDocument(), "mousemove", self._doconmousemove, false);

        self.getDocument()._floatdiv_resizing_obj = self;
    }
}

_p._doconmouseup = function(e){
    if (!e)
        e = this.wnd.event;
    var self = _getMouseEventTarget(e).ownerDocument._floatdiv_resizing_obj;
    if (!self) {
        return;
    }
    if (self.resizing) {
        self.resizing = false;
        removeEvent(self.getDocument(), "mouseup", self._doconmouseup, false);
        removeEvent(self.getDocument(), "mousemove", self._doconmousemove,
            false);
        if (isie) {
            self.getDocument().body.releaseCapture();
        } else {
            self.wnd.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        self.getDocument()._floatdiv_resizing_obj = null;
    }
}

_p._div2onmousemove = function(e){
    if (!e)
        e = this.wnd.event;
    var self = _getMouseEventSanComponent(e);
    if (!self)
        return;
    if (!self.resizing) {// 没有在resize
        var pt = self._getResizePoint(e);
        self.div2.style.cursor = FloatDiv.RESIZECURSORS[pt];
    }
}

/*
在ie上e.offsetX和e.offsetY表示鼠标在所在元素上的相对位置，如果所在元素有border的话，则原点是去掉border的左上角
在ff上e.layerX和e.layerY表示鼠标在所在元素上的相对位置，原点是包括border的左上角。

*/
_p._doconmousemove = function(e){
    if (!e)
        e = this.wnd.event;
    var self = _getMouseEventTarget(e).ownerDocument._floatdiv_resizing_obj;
    if (self && self.resizing) {// 正在resize
        self._resizeself(e);
    }
}

_p._resizeself = function(e){
    var x = this._getMouseX(e, this.div2);
    var y = this._getMouseY(e, this.div2);
    switch (this.resizePoint) {
        case FloatDiv.RESIZEPOINT_LEFTTOP :
            this._resizelefttop(x, y);
            break;
        case FloatDiv.RESIZEPOINT_TOP :
            this._resizetop(x, y);
            break;
        case FloatDiv.RESIZEPOINT_RIGHTTOP :
            this._resizerighttop(x, y);
            break;
        case FloatDiv.RESIZEPOINT_RIGHT :
            this._resizeright(x, y);
            break;
        case FloatDiv.RESIZEPOINT_RIGHTBOTTOM :
            this._resizerightbottom(x, y);
            break;
        case FloatDiv.RESIZEPOINT_BOTTOM :
            this._resizebottom(x, y);
            break;
        case FloatDiv.RESIZEPOINT_LEFTBOTTOM :
            this._resizeleftbottom(x, y);
            break;
        case FloatDiv.RESIZEPOINT_LEFT :
            this._resizeleft(x, y);
            break;
    }
    this._doOnResize();
}

_p._resizetop = function(x, y){
    with (this.div1.style) {
        var newheight = parseInt(height) - (y - this.RESIZE_BORDER);
        if (newheight < this.resize_minheight) {
            return;
        }
        this.setBounds(null, this.getTop() + this.getHeight() - newheight,
            null, newheight);
    }
}

_p._resizelefttop = function(x, y){
    this._resizeleft(x, y);
    this._resizetop(x, y);
}

_p._resizerighttop = function(x, y){
    this._resizeright(x, y);
    this._resizetop(x, y);
}

_p._resizeright = function(x, y){
    var newwidth = x + (isie ? this.RESIZE_BORDER : -this.RESIZE_BORDER);
    if (newwidth < this.resize_minwidth) {
        return;
    }
    this.setBounds(null, null, newwidth, null);
}

_p._resizerightbottom = function(x, y){
    this._resizeright(x, y);
    this._resizebottom(x, y);
}

_p._resizebottom = function(x, y){
    var newheight = y + (isie ? this.RESIZE_BORDER : -this.RESIZE_BORDER);
    if (newheight < this.resize_minheight) {
        return;
    }
    this.setBounds(null, null, null, newheight);
}

_p.setOnResize = function(v){
    this.onresize = v;
}

// 回调onresize事件
_p._doOnResize = function(){
    CallBackFunc.doCallBack(this.onresize, this);
}

_p._resizeleft = function(x, y){
    with (this.div1.style) {
        var newwidth = parseInt(width) - (x - (isie ? this.RESIZE_BORDER : 0));
        if (newwidth < this.resize_minwidth) {
            return;
        }
        this.setBounds(this.getLeft() + this.getWidth() - newwidth, null,
            newwidth, null);
    }
}

_p._resizeleftbottom = function(x, y){
    this._resizebottom(x, y);
    this._resizeleft(x, y);
}

/*根据鼠标事件，获得鼠标点击在哪个点*/
_p._getResizePoint = function(e){
    var div2 = this.div2;
    var x = this._getMouseX(e, div2);
    var y = this._getMouseY(e, div2);
    var bd = this.RESIZE_BORDER;
    if (y <= bd) {// 在上边
        if (x < bd) {
            return FloatDiv.RESIZEPOINT_LEFTTOP;
        } else if (x >= bd + div2.clientWidth) {
            return FloatDiv.RESIZEPOINT_RIGHTTOP;
        } else {
            return FloatDiv.RESIZEPOINT_TOP;
        }
    } else if (y >= bd + div2.clientHeight - 1) {// 在下边
        if (x < bd) {// 在左下边
            return FloatDiv.RESIZEPOINT_LEFTBOTTOM;
        } else if (x >= bd + div2.clientWidth - 1) {// 在右下边
            return FloatDiv.RESIZEPOINT_RIGHTBOTTOM;
        } else {// 在下边
            return FloatDiv.RESIZEPOINT_BOTTOM;
        }
    } else {// 垂直在中间
        if (x < bd) {
            return FloatDiv.RESIZEPOINT_LEFT;
        } else if (x >= bd + div2.clientWidth) {
            return FloatDiv.RESIZEPOINT_RIGHT;
        } else {
            return FloatDiv.RESIZEPOINT_CLIENT;
        }
    }
}

_p._getMouseX = function(e, div2){
    return e.clientX - div2.parentNode.offsetLeft;
}

_p._getMouseY = function(e, div2){
    return e.clientY
            - div2.parentNode.offsetTop
            + (isie && this.doc.body.scrollTop > 0
                    ? this.doc.body.scrollTop
                    : 0);
}

_getMouseEventTarget = function(e){
    return e.srcElement ? e.srcElement : e.target;
}

/*根据鼠标事件获得鼠标事件所在的元素所属的SanCompolenet类*/
function _getMouseEventSanComponent(e){
    var relEl;
    if (isie) {
        if (e.type == "mouseover")
            relEl = e.fromElement;
        else if (e.type == "mouseout")
            relEl = e.toElement;
        else
            relEl = e.srcElement;
    } else
        relEl = e.target;
    try {
        while (relEl != null && relEl._sancomponent == null)
            relEl = relEl.parentNode;
    } catch (ex) {
        return null;
    }
    if (relEl == null)
        return null;
    return relEl._sancomponent;
}

/*设置div为指定的x和y，x和y为整形，div的position应为absolute*/
function setDivPos(div, x, y){
    if (isie) {
        with (div.style) {// ie中要使用pixelTop和pixelLeft设置图层的位置，不然可能使ie崩溃
            pixelTop = y;
            pixelLeft = x;
        }
    } else {
        with (div.style) {
            top = y + "px";
            left = x + "px";
        }
    }
}

/*添加外部脚本,doc为document对象, src为脚本名*/
function addScript(doc, src){
    var _head = doc.getElementsByTagName("head");
    var hasHead = _head;

    if (hasHead) {
        if (findScript(doc, src) != -1)
            return;
        var __head = _head[0];
        var _script = __head.appendChild(doc.createElement("script"));
        _script.src = src;
    }
}

/*添加外部样式,doc为document对象, name为样式名*/
function addStyle(doc, name){
    var _head = doc.getElementsByTagName("head");
    var hasHead = _head;

    if (hasHead) {
        if (findStyle(doc, name) != -1)
            return;
        var __head = _head[0];
        var _link = __head.appendChild(doc.createElement("link"));
        _link.href = name;
        _link.rel = "stylesheet";
        _link.type = "text/css";
    }
}

/*查找指定的外部脚本是否存在，不存在则返回-1,doc为document对象, src为脚本文件名*/
function findScript(doc, src){
    var _script = doc.getElementsByTagName("script");
    if (!_script)
        return;
    var count = _script.length;
    for (var i = 0; i < count; i += 1) {
        if (_script[i].src.indexOf(src) != -1)
            return i;
    }
    return -1;
}

/*查找指定的外部样式是否存在，不存在则返回-1,doc为document对象, name为样式文件名*/
function findStyle(doc, name){
    var _link = doc.getElementsByTagName("link");
    if (!_link)
        return;
    var count = _link.length;
    for (var i = 0; i < count; i += 1) {
        if (_link[i].href.indexOf(name) != -1)
            return i;
    }
    return -1;
}

/*给作用对象添加一个事件，obj是作用对象，eventType为事件类型，
fp为调用的函数，cap为firefox特有的，表示是否捕获，可以不传*/
function addEvent(obj, eventType, fp, cap){
    cap = cap || false;
    if (obj.attachEvent)
        obj.attachEvent("on" + eventType, fp);
    else if (obj.addEventListener)
        obj.addEventListener(eventType, fp, cap);
}

/*删除指定作用对象的事件，obj是作用对象，eventType为事件类型，
fp为调用的函数，cap为firefox特有的，表示是否捕获，可以不传*/
function removeEvent(obj, eventType, fp, cap){
    cap = cap || false;
    if (obj && obj.detachEvent)
        obj.detachEvent("on" + eventType, fp);
    else if (obj && obj.removeEventListener)
        obj.removeEventListener(eventType, fp, cap);
}

/*用于封装一些基本的Html元素,doc为document, doc如果不传递缺省使用document，
 eparent所创建的控件依附的父元素，此参数可以不传递，如果不传递则所创建的元素初始化还
 未依附任何父控件(除非创建函数自己传递了父元素)，如果传递可以是字符串或一个dom对象*/
function HtmlElementFactory(doc, eparent){
    this.isie = window.navigator.userAgent.indexOf("MSIE") != -1;
    this.doc = typeof(doc) == "object" ? doc : document;
    this.eparent = typeof(eparent) == "string" ? this.doc
            .getElementById(eparent) : (typeof(eparent) == "object"
            ? eparent
            : null);
}

HtmlElementFactory.prototype._appendChild = function(childElement){
    if (this.eparent) {
        return this.eparent.appendChild(childElement);
    }
    return childElement;
}

HtmlElementFactory.prototype.addLink = function(img, caption, ptitle, underline){
    caption = caption ? caption : "";
    ptitle = ptitle ? ptitle : "";
    underline = typeof(underline) == "boolean" ? underline : true;
    var span = this.doc.createElement("span");
    span.style.paddingLeft = "2px";
    this._appendChild(span);
    var _link = this._appendChild(this.doc.createElement("a"));
    _link.isListViewExLink = true;
    with (_link.style) {
        cursor = "pointer";
        padding = "0px 2px 0px 2px";
        if (underline)
            textDecoration = "underline";
    }

    var _icon;
    if (img) {
        _icon = _link.appendChild(this.doc.createElement("img"));
        _icon.isListViewExLink = true;
        with (_icon) {
            src = img;
            border = 0;
            align = "absmiddle";
            title = ptitle;
        }
    }

    var textNode = this.doc.createTextNode(caption);
    _link.appendChild(textNode);

    _link.setCaption = function(c){
        textNode.nodeValue = c;
    }

    _link.setColor = function(colorstr){
        _link.style.color = colorstr;
    }

    _link.setImage = function(p){
        if (img) {
            _icon.src = p;
        }
    }
    return _link;
}

/*创建一个表格*/
HtmlElementFactory.prototype.table = function(){
    var r = this._appendChild(this.doc.createElement("table"));
    with (r) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
    }
    return r;
}

HtmlElementFactory.prototype.div = function(){
    var r = this._appendChild(this.doc.createElement("div"));

    r.setVisible = function(v){
        r.style.display = v ? "" : "none";
    }
    return r;
}

HtmlElementFactory.prototype.span = function(){
    var r = this._appendChild(this.doc.createElement("span"));
    return r;
}

HtmlElementFactory.prototype.label = function(t){
    var r = this._appendChild(this.doc.createElement("label"));
    r.setCaption = function(t){
        r.innerText = t ? t : "";
    };
    r.setCaption(t);
    return r;
}

/*创建图像*/
HtmlElementFactory.prototype.img = function(){
    var r = this._appendChild(this.doc.createElement("img"));
    r.setImg = function(p){
        r.src = p;
    }

    r.getImg = function(){
        return r.src;
    }

    r.resize = function(w, h){
        r.width = w;
        r.height = h;
    }

    return r;
}

/*创建一个空格*/
HtmlElementFactory.prototype.space = function(){
    var r = this._appendChild(this.doc.createElement("span"));
    r.innerHTML = "&nbsp;";
    return r;
}

HtmlElementFactory.prototype.inputElement = function(type, name, initValue,
        ischecked){
    type = typeof(type) == "string" ? type : null;
    name = typeof(name) == "string" ? name : null;
    if (!type)
        return;
    var _type = type.toLowerCase();
    var _id = _type + Math.floor(Math.random() * 99999999);
    var t = this._appendChild(this.doc.createElement(this.isie ? "<input type="
            + _type + " name=" + (name ? name : _id) + " id=" + _id
            + (typeof(ischecked) == "boolean" ? " checked=" + ischecked : "")
            + ">" : "INPUT"));
    if (!this.isie) {
        t.setAttribute("type", _type);
        t.setAttribute("name", name ? name : _id);
        t.setAttribute("id", _id);
    }
    if (initValue)
        t.value = initValue;
    return t;
}

HtmlElementFactory.prototype.file = function(){
    var t = this.inputElement("file");
    if (!t)
        return;
    with (t.style) {
        padding = "0px";
    }
    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
    }
    return t;
}

/*创建一个单行的输入框*/
HtmlElementFactory.prototype.edit = function(initText, name){
    var t = this.inputElement("text", name, initText);
    if (!t)
        return;
    with (t.style) {
        fontSize = "12px";
        backgroundColor = "#FFFFFF";
        color = "#000000";
        padding = "0px 4px 0px 4px";
        border = "1px solid #7F9DB9";
    }

    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
        with (t.style) {
            color = disable ? "#C9C7BA" : "#000000";
            borderColor = disable ? "#C9C7BA" : "#7F9DB9";
            backgroundColor = disable ? "#F2F2ED" : "#FFFFFF";
        }
    }

    return t;
}

/*隐藏单元*/
HtmlElementFactory.prototype.hidden = function(initText, name){
    var t = this.inputElement("hidden", name, initText);
    return t;
}

/*创建密码输入框*/
HtmlElementFactory.prototype.password = function(initText, name){
    var t = this.inputElement("password", name, initText);
    if (!t)
        return;
    with (t.style) {
        fontSize = "12px";
        backgroundColor = "#FFFFFF";
        color = "#000000";
        padding = "0px 4px 0px 4px";
        border = "1px solid #7F9DB9";
    }
    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
        with (t.style) {
            color = disable ? "#C9C7BA" : "#000000";
            borderColor = disable ? "#C9C7BA" : "#7F9DB9";
            backgroundColor = disable ? "#F2F2ED" : "#FFFFFF";
        }
    }
    return t;
}

/*创建一个checkbox*/
HtmlElementFactory.prototype.checkbox = function(name, value, ischecked){
    var t = this.inputElement("checkbox", name, value);
    t.style.width = "14px";
    t.style.height = "14px";
    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
    }

    return t;
}

/*创建一个radio*/
HtmlElementFactory.prototype.radio = function(name, value, ischecked){
    var t = this.inputElement("radio", name, value, ischecked);
    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
    }
    return t;
}

/*创建一个多行的输入框*/
HtmlElementFactory.prototype.textarea = function(initText, name){
    var _id = "Textarea$" + Math.floor(Math.random() * 99999999);
    var t = this._appendChild(this.doc.createElement("textarea"));
    t.setAttribute("name", name ? name : _id);
    t.setAttribute("id", _id);
    t.value = initText ? initText : "";
    with (t.style) {
        fontSize = "12px";
        backgroundColor = "#FFFFFF";
        color = "#000000";
        padding = "4px";
        border = "1px solid #7F9DB9";
    }
    t.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        t.disabled = disable;
        with (t.style) {
            color = disable ? "#C9C7BA" : "#000000";
            borderColor = disable ? "#C9C7BA" : "#7F9DB9";
            backgroundColor = disable ? "#F2F2ED" : "#FFFFFF";
        }
    }
    return t;
}

/*
enctype multipart/form-data
target boolean or string
*/
HtmlElementFactory.prototype.form = function(name, enctype, method, action,
        target){
    var _t = null;
    var _target = null;
    name = typeof(name) == "string" ? name : null;
    var _id = "Form$" + Math.floor(Math.random() * 99999999);
    if (typeof(target) == "boolean") {
        if (target) {
            _t = this.iframe();
            _t.size(0, 0);
            _target = _t.name;
        }
    }
    if (typeof(target) == "string")
        _target = target;
    t = this._appendChild(this.doc.createElement(this.isie ? "<form action="
            + (action ? action : "") + (enctype ? " enctype=" + enctype : "")
            + " method=" + (method ? method : "post")
            + (_target ? " target=" + _target : "") + " name="
            + (name ? name : _id) + " id=" + _id + ">" : "form"));
    if (typeof(target) == "boolean") {
        if (target)
            t.appendChild(_t);
    }
    if (!this.isie) {
        t.setAttribute("name", name ? name : _id);
        t.setAttribute("id", _id);
        if (action)
            t.setAttribute("action", action);
        if (enctype)
            t.setAttribute("enctype", enctype);
        if (method)
            t.setAttribute("method", method);
        if (_target)
            t.setAttribute("target", _target);
    }
    with (t.style) {
        padding = "0px";
        margin = "0px";
    }
    /*如果iframe存在那么就返回iframe,否则返回null*/
    t.getIFrame = function(){
        return _t;
    }

    t.setAction = function(url){
        if (!this.isie) {
            t.setAttribute("action", url);
        } else {
            t.action = url;
        }
    }
    return t;
}

/*创建一个image*/
HtmlElementFactory.prototype.image = function(src){
    var cb = this._appendChild(this.doc.createElement("img"));
    if (src)
        cb.src = src;
    return cb;
}

/*创建一个combobox*/
HtmlElementFactory.prototype.combobox = function(){
    var doc = this.doc;
    var cb = this._appendChild(doc.createElement("select"));
    cb.style.fontSize = "12px";
    // cb.style.height = "12px";

    /*清除所有项目*/
    cb.clearOption = function(){
        for (var i = this.getCount() - 1; i > -1; i -= 1) {
            this.removeOption(i);
        }
    }
    /*新增一项*/
    cb.addOption = function(value, text){
        if (cb.findOption(value, false) == -1) {
            var o = doc.createElement("option");
            o.value = value;
            o.text = text;
            cb.options.add(o);
            return o;
        }
    }

    /*删除指定项目,index可以是数值或字符串*/
    cb.removeOption = function(index, isText){
        if (typeof(index) == "string") {
            index = cb.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1)
            cb.remove(index);
    }

    /*获取项目数*/
    cb.getCount = function(){
        return cb.options.length;
    }

    /*获取指定的项目,index可以是数值或字符串*/
    cb.getOption = function(index, isText){
        if (typeof(index) == "string") {
            index = cb.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1)
            return cb.options[index];
    }

    /*设置指定的项目为选择状态,index可以是数值或字符串*/
    cb.setSelected = function(index, isText){
        if (typeof(index) == "string") {
            if (!isText && this.value == index) {
                return;
            }
            index = cb.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1)
            cb.options[index].selected = true;
    }

    /*查找指定的项目是否存在,如不存在则返回空, isText是布尔值,表示text是否为text还是value,缺省为text*/
    cb.findOption = function(text, isText){
        isText = typeof(isText) == "boolean" ? isText : true;
        var count = cb.options.length;
        var tmp = null;
        for (var i = 0; i < count; i += 1) {
            tmp = cb.options[i];
            if (isText ? tmp.text == text : tmp.value == text)
                return i;
        }
        return -1;
    }

    /*获取当前被选择的项目*/
    cb.getCurrentOption = function(){
        for (var i = 0; i < cb.options.length; i += 1) {
            if (cb.options[i].selected)
                return cb.options[i];
        }
        return null;
    }

    cb.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        if (cb.disabled != disable)
            cb.disabled = disable;
    }

    return cb;
}

/*创建一个按钮*/
HtmlElementFactory.prototype.button = function(caption){
    var bt = this._appendChild(this.doc.createElement(this.isie
            ? "<input type=button>"
            : "INPUT"));
    if (!this.isie) {
        bt.setAttribute("type", "button");
    }
    bt.value = caption ? caption : "";
    with (bt.style) {
        fontSize = "12px";
        borderWidth = "0px";
    }
    bt.setDisabled = function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        bt.disabled = disable;
    }
    return bt;
}

HtmlElementFactory.prototype.button2 = function(caption){
    var bt = Button.create(this.doc, null, caption);
    this._appendChild(bt.getContainer());
    return bt;
}

/*创建一个iframe框架*/
HtmlElementFactory.prototype.iframe = function(){
    var _id = "Iframe$" + Math.floor(Math.random() * 99999999);
    var fo = this._appendChild(this.doc.createElement(this.isie
            ? "<iframe name=" + _id + " id=" + _id + ">"
            : "iframe"));
    if (!this.isie) {
        fo.setAttribute("name", _id);
        fo.setAttribute("id", _id);
    }
    with (fo) {
        frameBorder = 0;
        height = "100%";
        width = "100%";
        marginheight = 0;
        marginwidth = 0;
        border = 0;
        style.border = "0";
    }

    /*设置iframe大小*/
    fo.size = function(w, h){
        fo.width = w;
        fo.height = h;
    }

    /*引用的url*/
    fo.url = function(url){
        fo.src = url;
    }

    /*框架是否可见*/
    fo.visible = function(bool){
        fo.style.display = typeof(bool) != "boolean" ? "none" : (bool
                ? ""
                : "none");
    }

    /*获取框架的document对象*/
    fo.getDocument = function(){
        return fo.contentWindow.document;
    }

    /*获取框架的body对象*/
    fo.getBody = function(){
        return fo.contentWindow.document.body;
    }

    return fo;
}

HtmlElementFactory.prototype._separator = function(ep, width){
    var obj = ep.appendChild(this.doc.createElement("hr"));
    with (obj) {
        size = 1;
        noShade = true;
    }
    if (typeof(width) == "number") {
        obj.style.width = width + "px";
    } else if (typeof(width) == "string") {
        if (width.lastIndexOf("%") != -1) {
            obj.style.width = width;
        } else {
            obj.style.width = width + "px";
        }
    } else
        obj.style.width = "100%";
    return obj;
}

/*分割栏*/
HtmlElementFactory.prototype.separator = function(caption){
    if (caption) {
        var obj = this._appendChild(this.doc.createElement("table"));
        with (obj) {
            border = 0;
            width = "100%";
            cellPadding = 0;
            cellSpacing = 0;
        }
        var line = obj.insertRow(0);
        var t0 = line.insertCell(0);
        t0.width = "1%";
        t0.noWrap = true;
        this._separator(t0, 10);

        var t1 = line.insertCell(1);
        t1.width = "1%";
        t1.noWrap = true;
        t1.style.fontSize = "12px";
        t1.style.padding = "0px 4px 0px 4px";
        t1.innerHTML = caption ? caption : "&nbsp;";

        var t2 = line.insertCell(2);
        t2.width = "98%";
        this._separator(t2);
        return obj;
    } else {
        return this._separator(this.eparent);
    }
}

/*创建一个文字段*/
HtmlElementFactory.prototype.textnode = function(caption){
    return this._appendChild(this.doc.createTextNode(caption));
}
HtmlElementFactory.prototype.textnote = HtmlElementFactory.prototype.textnode;

/*checkBox，radio控件*/
function CheckBox(adoc/*document对象*/, aparentElement/*父控件对象或名字id*/,
        atype/*此控件的类型，可以为checkbox或者radio*/, aid/*此控件的id*/, aname/*此控件的名字*/,
        avalue/*此控件的值*/){
    /*返回此控件的类型。*/
    this.isie = window.navigator.userAgent.indexOf("MSIE") != -1;
    this.doc = adoc;
    this.eparent = aparentElement;
    this.dom = null;
    this.type = atype ? atype : "checkbox";
    this.id = aid ? aid : this.type + "_" + Math.floor(Math.random() * 999999);
    this.name = aname ? aname : this.id;
    this.value = avalue ? avalue : "1";

    this._initCheckBox();
}

CheckBox.prototype.getType = function(){
    var tmp = this.type.toLowerCase();
    if (tmp != "checkbox" && tmp != "radio") {
        return "checkbox";
    }
    return tmp;
}

/*返回此控件的id*/
CheckBox.prototype.getId = function(){
    return this.id;
}

/*设置此控件的id*/
CheckBox.prototype.setId = function(aid){
    this.id = aid;
    this.dom.id = this.id;
}

/*返回此控件的id*/
CheckBox.prototype.getName = function(){
    return this.name;
}

/*设置此控件的id*/
CheckBox.prototype.setName = function(name){
    this.name = name;
    this.dom.name = this.name;
}

/*返回此控件的Value*/
CheckBox.prototype.getValue = function(){
    return this.value;
}

/*设置此控件的value*/
CheckBox.prototype.setValue = function(avalue){
    this.value = avalue;
    this.dom.value = this.value;
}

/*判断此控件是否被选中*/
CheckBox.prototype.isChecked = function(){
    return this.dom.checked;
}

/*设置此控件是否被选中*/
CheckBox.prototype.setChecked = function(avalue){
    this.dom.checked = avalue;
}

/*返回dom对象*/
CheckBox.prototype.getDom = function(){
    return this.dom;
}

/*附加一个object*/
CheckBox.prototype.attachObject = function(obj){
    this.dom.attachObject = obj;
}

/*释放掉附加的object*/
CheckBox.prototype.detachObject = function(){
    delete this.dom.attachObject;
}

/*获取附加的object*/
CheckBox.prototype.getAttachObject = function(){
    return this.dom.attachObject;
}

/*设置点击回调事件，回调时*/
CheckBox.prototype.setOnClick = function(onclick){
    this.onclick = onclick;
}

/*dom的onclick回调事件*/
CheckBox.prototype._domonclick = function(){
    if (this._sanobj.onclick) {
        this._sanobj.onclick(this._sanobj);
    }
}

CheckBox.prototype._initCheckBox = function(){
    this.dom = this.doc.createElement(this.isie ? "<input type="
            + this.getType() + " id=" + this.id + " name=" + this.name
            + " value=" + this.value + ">" : "INPUT");
    if (!this.isie) {
        this.dom.type = this.getType();
        this.dom.id = this.id;
        this.dom.name = this.name;
        this.dom.value = this.value;
    }
    // this.dom._sanobj = this;
    // 将js对象赋于dom，用于在dom的onclick回调事件中访问js对象
    // this.dom.onclick = this._domonclick;
    var self = this;
    this.dom.onclick = function(){
        if (self.onclick)
            self.onclick(self);
    }
    if (this.eparent)
        this.eparent.appendChild(this.dom);
}

/*组合框对象*/
function ComboBox(wnd, parentElement, width, floatwidth, floatheight){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parentElement, width, 30);
    this.downbtnimg;// 下拉按钮的图片对象
    this.cbar = null;
    this.dom = null;
    this.domValue = null;
    this.div = null;
    this.impgpath = "irpt/images/";
    this.defaultIcon = commonctrls_imagePath + "null.gif";
    this.arrowImg = commonctrls_imagePath + "cbarrow.gif";
    this.disabled = false;
    this._initComboBox(typeof(width) == "number" ? width : 180,
        typeof(floatwidth) == "number" ? floatwidth : 180,
        typeof(floatheight) == "number" ? floatheight : 180);
    this.cbar._sancomponent = this;
}

_extendClass(ComboBox, SanComponent, "ComboBox");

ComboBox.prototype.getFloatDiv = function(){
    return this.div;
}

ComboBox.prototype.setFloatBounds = function(l, t, w, h){
    this.getFloatDiv().setBounds(l, t, w, h);
}

ComboBox.prototype.setFloatBorder = function(p){
    this.getFloatDiv().setBorderWidth(p);
}

ComboBox.prototype.setIcon = function(img, path){
    if (img) {
        var _index = img.lastIndexOf("/");
        if (_index != -1)
            img = img.substring(_index + 1);
    }

    var __img = this.doc.createElement("img");
    __img.src = img
            ? (path ? path + img : this.impgpath + img)
            : this.defaultIcon;

    this.icon.appendChild(__img);
}

ComboBox.prototype.__getBaseDom = function(){
    return this.cbar;
}

// 返回最底层的dom对象
ComboBox.prototype.getDom = function(){
    return this.cbar;
}

// 获得编辑器，如果combobox是可编辑的，则返回input的dom对象。
ComboBox.prototype.getEdit = function(){
    return this.dom;
}

ComboBox.prototype.getValueDom = function(){
    return this.domValue;
}

ComboBox.prototype.setValue = function(value){
    this.domValue.value = value;
}

ComboBox.prototype.getValue = function(){
    return this.domValue.value;
}

ComboBox.prototype.setCaption = function(value){
    this.dom.value = value;
}

ComboBox.prototype.getCaption = function(){
    return this.dom.value;
}

/*设置该控件是否可用*/
ComboBox.prototype.setDisabled = function(value){
    this.disabled = typeof(value) == "boolean" ? value : false;
    this.readOnly(this.disabled);
    this.cbar.style.filter = "alpha(opacity=" + (this.disabled ? 15 : 100)
            + ")";
    this.cbar.style.opacity = this.disabled ? ".15" : "100";
}

ComboBox.prototype.getDisabled = function(){
    return this.disabled;
}

/*获取下拉框的domobj，可以通过给这个dom添加自节点来实现下拉树和下拉其他类容，
也可以通过设置这个dom的style的Width来控制下拉对象的宽度，长度类似*/
ComboBox.prototype.getDropDownDomObj = function(){
    return this.div.getDom();
}

ComboBox.prototype.setBeforeShowDropDownList = function(v){
    this.befortshowlist = v;
}
/*空方法，当将要显示下拉框时调用，用于给子类重载*/
ComboBox.prototype.__beforeShowDropDownList = function(){
    CallBackFunc.doCallBack(this.befortshowlist);
}
/**
 * 取消显示dropdownlist后执行
 */
ComboBox.prototype.setAfterCancelDropDownList = function(v){
    this.aftercancel = v;
}

ComboBox.prototype.__afterCancelDropDownList = function(){
    CallBackFunc.doCallBack(this.aftercancel);
}

/*设置下拉框dom是否显示*/
ComboBox.prototype.showDropDownList = function(value){
    if (this.div.isVisible() == value) {
        return;
    }
    if (value) {
        var _top;
        if (isie)
            _top = this.getTop(this.doc.body);
        else
            _top = this.getTop(this.doc.body) - this.doc.body.scrollTop;

        if (_top + this.div.height - (isie ? this.doc.body.scrollTop : 0) > this.doc.body.clientHeight)
            _top = _top - this.getHeight() - this.div.height - (isie ? 0 : 5);
        else
            _top = _top + this.getHeight();

        var cw = this.doc.body.clientWidth;
        var ch = this.doc.body.clientHeight;
        var fdw = parseInt(this.div.div1.style.width);
        var fdh = parseInt(this.div.div1.style.height);
        var left = this.getLeft(this.doc.body);
        var top = _top;
        if (left + fdw > cw)
            left = cw - fdw - 4;
        if (top + fdh > ch)
            top = ch - fdh;

        this.div.setBounds(left, top, null, null);
        this.__beforeShowDropDownList();
    }
    this.div.setVisible(value);
    if (value) {
        if (isie) {
            // this.div.setCapture();此处不能setcapture，因为这样会使下拉框无法resize
        } else {
            this.wnd.captureEvents(Event.MOUSEDOWN);
        }
        this.doc._sancombobox_dropdown_obj = this;
        attacheEvent4TopIframes("add", "mousedown", this._doconmousedown);
        // addEvent(this.doc, "mousedown", this._doconmousedown, false);
        // this.getDocument()._sancombobox_dropdown_obj = this;
    } else {
        attacheEvent4TopIframes("remove", "mousedown", this._doconmousedown);
        // removeEvent(this.getDocument(), "mousedown", this._doconmousedown,
        // false);
        if (isie) {
            // this.getDocument().body.releaseCapture();
        } else {
            this.wnd.releaseEvents(Event.MOUSEDOWN);
        }
        this.doc._sancombobox_dropdown_obj = null;
        this.__afterCancelDropDownList();
    }
}

ComboBox.prototype._doconmousedown = function(e){
    if (!e)
        e = this.wnd.event;
    var self = _getMouseEventTarget(e).ownerDocument._sancombobox_dropdown_obj;
    if (!self) {
        if (this.document._sancombobox_dropdown_obj)
            this.document._sancombobox_dropdown_obj.showDropDownList(false);
        return;
    }
    var mouseobj = _getMouseEventSanComponent(e);
    if (mouseobj && (mouseobj == self || mouseobj == self.div)) {
        return;
    }
    self.showDropDownList(false);
}

/*返回下拉框dom是否显示*/
ComboBox.prototype.isDropDownListVisible = function(){
    return this.div.isVisible();
}

/*设置是否可以手工输入数据，缺省的不能输入*/
ComboBox.prototype.readOnly = function(value){
    this.dom.readOnly = typeof(value) == "boolean" ? value : true;
}

/*初始化组合框控件的界面元素*/
ComboBox.prototype._initComboBox = function(w, w2, h2){
    this.cbar = this.doc.createElement("table");
    with (this.cbar) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
        width = w;
        style.backgroundColor = "#ffffff";
        style.border = "1px solid #7F9DB9";
    }
    var row = this.cbar.insertRow(0);
    this.icon = row.insertCell(-1);
    this.icon.align = "left";
    this.icon.vAlign = "middle";
    var ci = row.insertCell(-1);
    ci.align = "left";
    ci.style.width = "100%";
    var arrow = row.insertCell(-1);
    arrow.align = "left";
    arrow.vAlign = "middle";
    var img = arrow.appendChild(this.doc.createElement("img"));
    img.align = "absmiddle";
    img.style.cursor = "pointer";
    img.src = this.arrowImg;
    this._hef = new HtmlElementFactory(this.doc, ci);
    this.dom = this._hef.edit();
    this.dom.size = 1;
    this.dom.style.width = "100%";
    this.dom.style.border = "0px";
    this.dom.readOnly = true;
    this.domValue = this._hef.hidden();
    this.domValue.style.border = "0px";
    this.div = new FloatDiv(this.wnd, null, w2, h2);
    this.div.setBounds(null, null, w2, h2);
    this.div.setBorderWidth("2px outset");
    this.div.setVisible(false);
    this.div.setParentElement(this.doc.body);
    this._initEventClick(img);
    this.downbtnimg = img;
    if (this.parentElement) {
        this.parentElement.appendChild(this.cbar);
    }
}

ComboBox.prototype.setWidth = function(width){
    if (typeof(width) != "number") {
        return;
    }
    this.cbar.width = width;
}
ComboBox.prototype._initEventClick = function(o){
    var self = this;
    o.onclick = function(){
        if (self.disabled)
            return false;
        self.showDropDownList(!self.isDropDownListVisible());
    }

    this.dom.onclick = function(){
        if (self.disabled)
            return false;
        self.showDropDownList(false);
    }
}

ComboBox.prototype.dispose = function(){
    this.cbar._sancomponent = null;
    this.downbtnimg.onclick = null;
    this.downbtnimg = null;
    this.cbar = null;
    this.dom.onclick = null;
    this.dom = null;
    this.domValue.onclick = null;
    this.domValue = null;
    this.div.dispose();
    this.div = null;
    SanComponent.prototype.dispose.call(this);
}

/*一个显示用的进度条*/
function ProgressBar(wnd, doc, eparent){
    if (_biInPrototype)
        return;
    this.wnd = typeof(wnd) == "object" ? wnd : window;
    this.doc = typeof(doc) == "object" ? doc : document;
    this.eparent = typeof(eparent) == "object"
            ? eparent
            : (typeof(eparent) == "string"
                    ? this.doc.getElementById(eparent)
                    : this.doc.body);
    this.w = "100%";
    this.color = "#000033";
    this._min;
    this._max;
    this._step;
    this._stepit = 0;
    this.nbar;
    this.unbar;
    this.loadingImg = commonctrls_imagePath + "loading.gif";

    this._init();
}

ProgressBar.create = function(wnd, doc, eparent){
    return new ProgressBar(wnd, doc, eparent);
}

_p = _extendClass(ProgressBar, SanComponent, "ProgressBar");

_p.dispose = function(){
    this.wnd = null;
    this.doc = null;
    this.eparent = null;
    this.nbar = null;
    this.unbar = null;
    this.barDom = null;
    this.infobar = null;
    this.barCell = null;
    this.otherCell = null;
    SanComponent.prototype.dispose.call(this);
}

_p._init = function(){
    this.barDom = this.eparent.appendChild(this.doc.createElement("table"));
    with (this.barDom) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 4;
        width = this.w;
        style.height = "100%";
    }
    var infoCell = this.barDom.insertRow(0).insertCell(0);
    infoCell.style.height = "1%";
    infoCell.align = "center";
    infoCell.vAlign = "top";
    this.infobar = infoCell.appendChild(this.doc.createElement("div"));
    this.infobar.style.fontSize = "12px";
    this.infobar.innerHTML = "&nbsp;";

    this.barCell = this.barDom.insertRow(1).insertCell(0);
    this.barCell.style.height = "1%";
    this.barCell.vAlign = "top";
    this.nbar = this.barCell.appendChild(this.doc.createElement("div"));
    with (this.nbar.style) {
        width = "0px";
        height = "100%";
        backgroundColor = this.color;
    }
    this.nbar.innerHTML = "&nbsp;";
    this.otherCell = this.barDom.insertRow(2).insertCell(0);
    this.otherCell.style.height = "98%";
    this.otherCell.vAlign = "top";
}

_p.getDom = function(){
    return this.barDom;
}

_p.setMessage = function(v){
    this.infobar.innerHTML = v;
}

/*设置进度条的最大最小和步长*/
_p.setProgress = function(amin, amax, step){
    this._min = amin;
    this._max = amax;
    this._step = step;
}

/*前进指定步*/
_p.step = function(value){
    var t = Math
            .floor((this._stepit += (this._step * value)) / this._max * 100);
    if (t > 100) {
        t = 100;
        this._stepit = 100;
    }
    this.nbar.style.width = t + "%";
}

/*前进一步*/
_p.stepit = function(){
    var t = Math.floor((this._stepit += this._step) / this._max * 100);
    if (t > 100) {
        t = 100;
        this._stepit = 100;
    }
    this.nbar.style.width = t + "%";
}

/*设置进度的位置*/
_p.setPosition = function(value){
    this.nbar.style.width = value + "%";
}

/*获得进度的位置*/
_p.getPosition = function(){
    return parseInt(this.nbar.style.width);
}

/*if(value)显示未知进度的进度条else显示进度确切的进度条*/
_p.showUnknownProgress = function(value){
    if (value) {
        this.nbar.style.display = "none";
        if (!this.unbar) {
            this.unbar = this.barCell
                    .appendChild(this.doc.createElement("div"));
            this.unbar.align = "center";
            var img = this.unbar.appendChild(this.doc.createElement("img"));
            img.src = this.loadingImg;
        }
        this.unbar.style.display = "";
    } else {
        this.nbar.style.display = "";
        if (this.unbar) {
            this.unbar.style.display = "none";
        }
    }
}

_p.getStep = function(){
    return this._step;
}

_p.getMin = function(){
    return this._min;
}

_p.getMax = function(){
    return this._max;
}

/*PageControl实现多页框架*/
function PageControl(wnd, parentElement){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parentElement, "100%", "100%");
    this._tabAry = {};
    this._tabCount = 0;
    this.onChanging;

    this.css = {
        tabClass : "pageControl",
        tabOverClass : "pageControl_over",
        tabCurrentClass : "pageControl_current",
        tabFormClass : "pageControl_form",
        tabBodyClass : "pageControl_body"
    }

    this._initPageControl();
}

PageControl.DEFAULT_ID = "_SLK$PageControl."

/*从SanComponent基类继承*/
_extendClass(PageControl, SanComponent, "PageControl");

PageControl.prototype.dispose = function(){
    this.onChanging = null;
    this.onChanged = null;

    this._body = null;
    this.dtb = null;
    this.dBar = null;
    this.dBody = null;

    for (var i = 0; i < this._tabCount; i += 1) {
        tmp = this._tabAry[i];
        this._tabAry[i] = null;
        tmp.dispose();
    }

    SanComponent.prototype.dispose.call(this);
}

PageControl.prototype._initPageControl = function(){
    this._makeBody();
}

PageControl.prototype._makeBody = function(){
    this._body = this.parentElement
            .appendChild(this.doc.createElement("table"));
    this._body.id = PageControl.DEFAULT_ID + Math.floor(Math.random() * 9999);
    with (this._body) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
    }
    with (this._body.style) {
        width = "100%";
        height = "100%";
    }
    this._body.className = this.css.tabBodyClass;
    var _bcon = this._body.insertRow(0).insertCell(0);
    _bcon.vAlign = "top";
    _bcon.style.height = "100%";
    this.dtb = _bcon.appendChild(this.doc.createElement("table"));
    with (this.dtb) {
        width = "100%";
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
    }
    this.dtb.style.height = "100%";
    this.dBar = this.dtb.insertRow(0).insertCell(0);
    this.dBar.vAlign = "top";
    this.dBar.style.height = "1%";
    this.dBar.style.MozUserSelect = "none";
    this.dBar.onselectstart = function(){
        return false;
    }

    this.dBody = this.dtb.insertRow(1).insertCell(0);
    this.dBody.vAlign = "top";
    this.dBody.style.height = "99%";
}

/*新增一个指定的项目,s为项目的标题*/
PageControl.prototype.addPage = function(s){
    var self = this;
    s = typeof(s) == "string" ? s : " ";
    var header = this.dBar.appendChild(this.doc.createElement("div"));
    header.className = this.css.tabClass;
    header.style.cursor = "default";

    var _pg = new PageControlPage(this, header);
    _pg.setCaption(s);
    _pg.index = this._tabCount;

    this._tabAry[this._tabCount++] = _pg;
    return _pg;
}

/*获取项目的数目*/
PageControl.prototype.getPageCount = function(){
    return this._tabCount;
}

/*获取指定的项目,s为索引或标题*/
PageControl.prototype.getPage = function(s){
    var _tp = typeof(s);
    var tmp;
    for (var i = 0; i < this._tabCount; i += 1) {
        tmp = this._tabAry[i];
        if (_tp == "number") {
            if (i == s)
                return tmp;
        } else if (_tp == "string") {
            if (tmp.getCaption() == s)
                return tmp;
        }
    }
    return null;
}

/*删除一个指定的项目*/
PageControl.prototype.removePage = function(s){
    var tmp = this.getPage(s);
    if (!tmp)
        return;
    this.dBar.removeChild(tmp.getHeaderDom());
    this.dBody.removeChild(tmp.getDom());
    this._remove(tmp.getIndex());
}

PageControl.prototype._remove = function(s){
    var tmpAry = {};
    var tmpCount = 0;
    var tmp;
    for (var i = 0; i < this._tabCount; i += 1) {
        tmp = this._tabAry[i];

        if (tmp.getIndex() != s) {
            tmpAry[tmpCount++] = tmp;
        }
    }
    this._tabAry = tmpAry;
    this._tabCount = tmpAryCount;
    delete tmpAry;
    tmpAryCount = 0;
}

/*设置激活一个指定的项目,激活的项目只能有一个, s为索引或标题*/
PageControl.prototype.setActivePage = function(s){
    var pg = this.getPage(s);
    if (pg) {
        this._showPage(pg);
    }
}

PageControl.prototype._showPage = function(pg){
    if (typeof(this.onChanging) == "function") {
        if (!this.onChanging(pg)) {
            return false;
        }
    }
    pg.setVisible(true);
    this._activePage = pg;
    if (typeof(this.onChanged) == "function") {
        this.onChanged(this);
    }
    for (var i = 0; i < this._tabCount; i += 1) {
        tmp = this._tabAry[i];
        if (tmp != pg) {
            tmp.setVisible(false);
        }
    }
}

/*获取激活的项目*/
PageControl.prototype.getActivePage = function(){
    return this._activePage;
}

/*返回第几个tab是当前的，0based*/
PageControl.prototype.getActiveIndex = function(){
    return this._activePage ? this._activePage.index : -1;
}

/*设置是否显示项目头,缺省的为显示*/
PageControl.prototype.setShowPageHeader = function(v){
    this.dBar.style.display = v ? "" : "none";
}

/*回调方式是cent(newpage)会将将要显示的页对象传入，如果回调函数返回false则不能切换*/
PageControl.prototype.setOnChanging = function(cent){
    this.onChanging = cent;
}

/*回调方式是cent(this)会将pagecontrol对象传入，*/
PageControl.prototype.setOnChanged = function(cent){
    this.onChanged = cent;
}

PageControl.prototype.destroy = function(){
    this.doc.removeChild(this.dBody);
}

function PageControlPage(owner, headerdom){
    this.owner = owner;
    this._headerdom = headerdom;
    this.captionNode = headerdom.appendChild(owner.doc.createTextNode(""));
    this._initPageControlPage();
}

PageControlPage.prototype.dispose = function(){
    this._headerdom._sanobj = null;
    this._headerdom.onclick = null;
    this._headerdom.onmouseover = null;
    this._headerdom.onmouseout = null;
    this.owner = null;
    this._headerdom = null;
    this.captionNode = null;
    this._tbContent = null;
    this._contentDom = null;
}

/*设置是否显示项目头,缺省的为显示*/
PageControlPage.prototype.setShowPageHeader = function(v){
    this._headerdom.style.display = v ? "" : "none";
}

PageControlPage.prototype.isVisible = function(){
    return !(this._headerdom.style.display == "none");
}

PageControlPage.prototype._initPageControlPage = function(){
    var _doc = this.owner.doc;
    this._tbContent = this.owner.dBody.appendChild(_doc.createElement("table"));
    with (this._tbContent) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
        width = "100%";
        style.height = "100%";
    }
    this._tbContent.className = this.owner
            .getCssClassName(this.owner.css.tabFormClass);

    this._contentDom = this._tbContent.insertRow(0).insertCell(0);
    this._contentDom.style.height = "100%";
    this._contentDom.vAlign = "top";
    this.setVisible(false);

    this._headerdom._sanobj = this;
    this._headerdom.onclick = function(){
        var pgctrl = this._sanobj.owner;
        pgctrl._showPage(this._sanobj);
        return true;
    }

    this._headerdom.onmouseover = function(){
        var pgctrl = this._sanobj.owner;
        if (this.className != pgctrl.css.tabCurrentClass) {
            this.className = pgctrl.css.tabOverClass;
        }
    }

    this._headerdom.onmouseout = function(){
        var pgctrl = this._sanobj.owner;
        if (this.className != pgctrl.css.tabCurrentClass) {
            this.className = pgctrl.css.tabClass;
        }
    }
}

PageControlPage.prototype.getDom = function(){
    return this._contentDom;
}

PageControlPage.prototype.insertDom = function(v){
    var _v;
    if (typeof(v) == "string")
        _v = this._headerdom.ownerDocument.getElementById(v);
    else if (typeof(v) == "object")
        _v = v;
    else
        return;
    this._contentDom.appendChild(_v);
}

PageControlPage.prototype.setVisible = function(v){
    this._tbContent.style.display = (v ? "" : "none");
    this.getHeaderDom().className = v
            ? this.owner.css.tabCurrentClass
            : this.owner.css.tabClass;
}

PageControlPage.prototype.getIndex = function(){
    return this.index;
}

PageControlPage.prototype.getCaption = function(){
    return this.captionNode.nodeValue;
}

PageControlPage.prototype.setCaption = function(v){
    this.captionNode.nodeValue = v;
}

PageControlPage.prototype.getHeaderDom = function(){
    return this._headerdom;
}

/*此控件封装了一个带scrollbar的元素,可以在此元素内添加其它控件*/
function DivScrollbar(wnd, parentElement, width, height){
    if (typeof(wnd.title) != "undefined") {
        this.doc = wnd;
        this.wnd = this.doc.parentWindow;
    } else {
        this.wnd = wnd;
        this.doc = this.wnd.document;
    }
    if (typeof(parentElement) == "object")
        this.pe = parentElement;
    if (typeof(parentElement) == "string")
        this.pe = this.doc.getElementById(parentElement);
    this.width = toPerNumber(width);
    this.height = toPerNumber(height);
    this._initDivScrollbar();
}
;

DivScrollbar.create = function(wnd, parentElement, width, height){
    var r = new DivScrollbar(wnd, parentElement, width, height);
    addDispose(r);
    return r;
};

DivScrollbar.prototype._initDivScrollbar = function(){
    this.dOutdiv = this.pe.appendChild(this.doc.createElement("div"));
    with (this.dOutdiv.style) {
        position = "relative";
        width = "100%";
        height = "100%";
        overflow = "hidden";
        display = "block";
    }
    this.dContent = this.dOutdiv.appendChild(this.doc.createElement("div"));
    with (this.dContent.style) {
        position = "absolute";
        width = "100%";
        height = "100%";
        padding = "0px";
        display = "block";
        fontSize = "12px";
        whiteSpace = "nowrap";
        overflow = "auto";
    }
    var tmpdiv = this.dOutdiv.appendChild(this.doc.createElement("div"));
    with (tmpdiv.style) {
        fontSize = "0px";
        clear = "both";
        display = "block";
    }
};

DivScrollbar.prototype.dispose = function(){
    this.dOutdiv = null;
    this.dContent = null;
};

/*是否有边框*/
DivScrollbar.prototype.setHasBorder = function(f){
    f = typeof(f) == "boolean" ? f : false;
    if (f) {
        with (this.dOutdiv.style) {
            border = "1px solid #ACA899";
            borderRightColor = "#FFFFFF";
            borderBottomColor = "#FFFFFF";
        }
    } else {
        this.dOutdiv.style.border = "0px";
    }
};

DivScrollbar.prototype.setHasScrollbar = function(f){
    if (typeof(f) == "boolean") {
        this.dContent.style.overflow = f ? "auto" : "hidden";
    }
};

DivScrollbar.prototype.getContent = function(){
    return this.dContent;
};

DivScrollbar.prototype.getDom = function(){
    return this.dOutdiv;
};

/*微调控制器,如果没有指定parentElement,需要将该控件加入到其它控件时可以引用getSpinner()来获取该控件的DOM*/
function Spinner(wnd, parentElement){
    if (typeof(wnd.title) != "undefined") {
        this.doc = wnd;
        this.wnd = this.doc.parentWindow;
    } else {
        this.wnd = wnd;
        this.doc = this.wnd.document;
    }
    this.pe = parentElement;
    this._onRun;
    this._btupTimer;
    this._btdownTimer;
    this.DEF_MAX = Spinner.MAX;
    this.DEF_MIN = Spinner.MIN;
    this.config = {
        img : {
            path : "sanlib/images/",
            arrowDown : "arrow.down.gif",
            arrowUp : "arrow.up.gif"
        }
    };
    this._initSpinner();
}

Spinner.MAX = 100;
Spinner.MIN = 0;
Spinner.create = function(wnd, parentElement){
    var result = new Spinner(wnd, parentElement);
    addDispose(result);
    return result;
}

Spinner.prototype.setArrowDown = function(p, path){
    var r = p
            ? (path ? path + p : this.config.img.path + p)
            : this.config.img.path + this.config.img.arrowDown;
    this._btdown.style.backgroundImage = r;
}

Spinner.prototype.setArrowUp = function(p, path){
    var r = p
            ? (path ? path + p : this.config.img.path + p)
            : this.config.img.path + this.config.img.arrowUp;
    this._btup.style.backgroundImage = r;
}

Spinner.prototype.dispose = function(){
    this._onRun = null;
    this.config = null;
    this._edit.onselectstart = null;
    this._edit.onkeyup = null;
    this._btup.onmousedown = null;
    this._btup.onmouseup = null;
    this._btup.onmouseout = null;
    this._btup = null;

    this._btdown.onmousedown = null;
    this._btdown.onmouseup = null;
    this._btdown.onmouseout = null;
    this._btdown = null;

    this._btupTimer = null;
    this._btdownTimer = null;
}

Spinner.prototype._run = function(issub){
    issub = typeof(issub) == "boolean" ? issub : false;
    var n = parseInt(this._edit.value);
    if (isNaN(n))
        n = this.getMin();
    if (issub)
        n -= 1;
    else
        n += 1;
    this._checkEdit(n);
}

Spinner.prototype._initSpinner = function(){
    var self = this;
    this._pane = this.doc.createElement("div");
    this._pane.id = this.getClassName() + "."
            + Math.floor(Math.random() * 999999);
    this._pane.align = "center";
    with (this._pane.style) {
        position = "relative";
        width = "48px";
        height = "18px";
        textAlign = "left";
        whiteSpace = "nowrap";
        overflow = "hidden";
    }

    this._edit = this._pane.appendChild(this.doc.createElement("input"));
    with (this._edit.style) {
        position = "absolute";
        left = "0px";
        top = "0px";
        height = "18px";
        width = "30px";
        border = "1px solid #7F9DB9";
        borderRightWidth = "0px";
    }
    this.setValue();

    this._btup = this._pane.appendChild(this.doc.createElement("button"));
    with (this._btup.style) {
        position = "absolute";
        height = "9px";
        width = "16px";
        top = "0px";
        left = "30px";
        border = "1px solid #7F9DB9";
        backgroundImage = "url(" + this.config.img.path
                + this.config.img.arrowUp + ")";
        backgroundRepeat = "no-repeat";
        backgroundColor = "#B6CEFB";
        backgroundPosition = "center center";
    }
    this._btup.onmousedown = function(){
        self._run();
        self._btupTimer = setInterval(function(){
                self._run();
            }, 200);
    }

    this._btup.onmouseup = function(){
        if (self._btupTimer)
            clearInterval(self._btupTimer);
        if (typeof(self._onRun) == "function")
            self._onRun(self);
    }

    this._btup.onmouseout = function(){
        if (self._btupTimer)
            clearInterval(self._btupTimer);
    }

    this._btdown = this._pane.appendChild(this.doc.createElement("button"));
    with (this._btdown.style) {
        position = "absolute";
        height = "9px";
        width = "16px";
        top = "9px";
        left = "30px";
        border = "1px solid #7F9DB9";
        backgroundImage = "url(" + this.config.img.path
                + this.config.img.arrowDown + ")";
        backgroundRepeat = "no-repeat";
        backgroundColor = "#B6CEFB";
        backgroundPosition = "center center";
    }
    this._btdown.onmousedown = function(){
        self._run(true);
        self._btdownTimer = setInterval(function(){
                self._run(true);
            }, 200);
    }

    this._btdown.onmouseup = function(){
        if (self._btdownTimer)
            clearInterval(self._btdownTimer);
        if (typeof(self._onRun) == "function")
            self._onRun(self);
    }

    this._btdown.onmouseout = function(){
        if (self._btdownTimer)
            clearInterval(self._btdownTimer);
    }

    this._edit.onkeyup = function(){
        var n = parseInt(self._edit.value);
        if (isNaN(n))
            n = self.getMin();
        self._checkEdit(n);
        if (typeof(self._onRun) == "function")
            self._onRun(self);
    }

    if (this.pe)
        this.pe.appendChild(this._pane);
}

Spinner.prototype._checkEdit = function(n){
    if (n > this.DEF_MAX)
        n = this.DEF_MAX;
    else if (n < this.DEF_MIN)
        n = this.DEF_MIN;
    this._edit.value = n;
}

/*设置微调的最大数值*/
Spinner.prototype.setMax = function(p){
    this.DEF_MAX = typeof(p) == "number" ? p : Spinner.MAX;
}

/*获取微调的最大数值*/
Spinner.prototype.getMax = function(){
    return this.DEF_MAX;
}

/*设置微调的最小数值*/
Spinner.prototype.setMin = function(p){
    this.DEF_MIN = typeof(p) == "number" ? p : Spinner.MIN;
}

/*获取微调的最小数值*/
Spinner.prototype.getMin = function(){
    return this.DEF_MIN;
}

/*获取微调后的数值*/
Spinner.prototype.getValue = function(){
    return parseInt(this._edit.value);
}

/*获取微调控制器的初始值*/
Spinner.prototype.setValue = function(p){
    p = typeof(p) == "number" ? p : this.getMin();
    this._edit.value = p;
}

/*设置微调框是否可手工录入数值,缺省是可以录入*/
Spinner.prototype.readOnly = function(f){
    f = typeof(f) == "boolean" ? f : false;
    this._edit.readOnly = f;
    if (f) {
        this._edit.onselectstart = function(){
            return false;
        };
    } else
        this._edit.onselectstart = null;
}

/*当没有指定parentElement时,可以用此方法获取Spinner的DOM对象*/
Spinner.prototype.getSpinner = function(){
    return this._pane;
}

Spinner.prototype.getClassName = function(){
    return "Spinner";
}

Spinner.prototype.setOnRun = function(ev){
    this._onRun = ev;
}

WideSize = function(w, h){
    this.width = typeof(w) == "number" ? w : 400;
    this.height = typeof(h) == "number" ? h : 0;

    if (this.width > 0) {
        this.height = Math.floor(this.width / WideSize.SEED);
    } else if (this.width == 0 && this.height > 0) {
        this.width = Math.floor(this.height * WideSize.SEED);
    }
}

WideSize.SEED = 1.618;

WideSize.prototype.getWidth = function(){
    return this.width;
}

WideSize.prototype.getHeight = function(){
    return this.height;
}

/*添加一条水平线*/
function addHorizontalLine(doc, parentElement){
    var lineContainer = doc.createElement("div");
    with (lineContainer.style) {
        position = "relative";
        fontSize = "1px";
        width = "100%";
        height = "4px";
        overflow = "hidden";
        borderTop = "1px solid #ACA899";
    }
    var line = lineContainer.appendChild(doc.createElement("div"));
    with (line.style) {
        position = "absolute";
        fontSize = "1px";
        width = "100%";
        height = "1px";
        top = "0px";
        left = "0px";
        overflow = "hidden";
        borderTop = "1px solid #FFFFFF";
    }
    return parentElement
            ? parentElement.appendChild(lineContainer)
            : lineContainer;
}

/*
 * 自动完成的combobox类。
 * 在文本框输入内容时，下拉框中列出相似的项目。用上、下键移动光标，回车键选择该项目。
 * 此对象继承自commonctrls.js中的ComboBox对象。
 */
function AutoCompleteComboBox(wnd, parentElement, width){
    if (_biInPrototype)
        return;
    ComboBox.call(this, wnd, parentElement, width);

    this.div.setBounds(null, null, width + 20, 200);
    // this.setFloatBorder("3px");
    this.propertyChangeListener = null;
    this.readOnly(false);
    this.comboBoxDataSource = new ComboBoxDataSource();
    this.dropdownList = null;
    this.needRequireDataSource = false;
    this.isAutoComplete = true;
    this._init();
}

_p = _extendClass(AutoCompleteComboBox, ComboBox, "AutoCompleteComboBox");

_p.dispose = function(){
    this.propertyChangeListener = null;
    this.comboBoxDataSource = null;
    this.dropdownList = null;
    this.getDom().onkeyup = null;
    ComboBox.prototype.dispose.call(this);
}

_p._init = function(){
    this.dropdownList = this.wnd.document.createElement("select");
    this.dropdownList.size = "8";
    this.dropdownList.style.width = "100%";
    this.dropdownList.style.height = "100%";
    this.dropdownList.onmousemove = null;
    var _self = this;
    this.dropdownList.ondblclick = function(){
        _self.__onchange();
        _self.setCaption(this.options[this.selectedIndex].text);
        _self.showDropDownList(false);
        _self.getEdit().focus();
        _self.__itemselected();
    }
    this.getDropDownDomObj().appendChild(this.dropdownList);

    this._regOnKeyup();

    this.downbtnimg.onclick = function(){
        if (!_self.isDropDownListVisible()) {
            _self._loadData();
        }
        _self.showDropDownList(!_self.isDropDownListVisible());
    }

}
// 设置是否启用自动完成功能
_p.enableAutoComplete = function(bool){
    this.isAutoComplete = bool == true;
}
// 设置文本框内的显示内容。
_p.setCaption = function(value){
    ComboBox.prototype.setCaption.call(this, value);
    // this.__onchange();
}
// 设置是否需要重获数据源。只有needRequireDataSource为true,requireDataSource才会被触发。
_p.setNeedRequireDataSource = function(bool){
    this.needRequireDataSource = bool;
}
// 检查并重获数据源
_p._requireDataSource = function(){
    if (this.needRequireDataSource) {
        this.requireDataSource();
        this.setNeedRequireDataSource(false);
    }
}
// 重新获取数据源。需由子类重载。
_p.requireDataSource = function(){
}

// 载入数据。
_p._loadData = function(){
    this._requireDataSource();
    if (!this.comboBoxDataSource)
        return;
    try {
        var val = this.getCaption();
        if (!this.isAutoComplete)
            val = "";
        var matchedData = this.comboBoxDataSource.findMatch(val);
        this.dropdownList.options.length = 0;
        for (var i = 0; i < matchedData.length; i += 1) {
            var opt = this.wnd.document.createElement("option");
            opt.value = matchedData[i];
            opt.text = matchedData[i];
            this.dropdownList.options.length += 1;
            this.dropdownList.options[this.dropdownList.options.length - 1] = opt;
        }
        if (this.dropdownList.options.length > 0)
            this.dropdownList.selectedIndex = 0;
    } catch (e) {
    }
}

_p.showDropDownList = function(visible){
    ComboBox.prototype.showDropDownList.call(this, visible);
}

_p._indexOf = function(data){
    var c = this.dropdownList.length;
    for (var i = 0; i < c; i += 1) {
        if (this.dropdownList.options[i].value.toLowerCase().indexOf(data
                .toLowerCase()) == 0) {
            return i;
        }
    }
    return -1;
}

// 注册按键事件。
_p._regOnKeyup = function(){

    var _self = this;

    this.getDom().onkeyup = function(e){
        if (!_self.isAutoComplete)
            return;
        var evt = e ? e : window.event;
        var keyCode = evt.keyCode;
        if (evt.ctrlKey || evt.altKey || evt.shiftKey
                || keyCode == KEYS.Key_Tab || keyCode == KEYS.Key_Ctrl
                || keyCode == KEYS.Key_Alt || keyCode == KEYS.Key_Shift)
            return;

        if (keyCode == KEYS.Key_Esc) {
            _self.showDropDownList(false);
            return;
        }
        if (keyCode != KEYS.Key_Up && keyCode != KEYS.Key_Down
                && keyCode != KEYS.Key_Enter) {
            _self._loadData();
            _self.showDropDownList(true);
            var data = _self.getCaption();
            if (data && data.length > 0) {
                var idx = _self._indexOf(data);
                if (idx != -1)
                    _self.dropdownList.selectedIndex = idx;
            }
            _self.__onchange();
        } else {
            _self.showDropDownList(true);
        }

        if (_self.dropdownList.selectedIndex == -1)
            return;
        if (keyCode == KEYS.Key_Up) {
            if (_self.dropdownList.options.selectedIndex > 0)
                _self.dropdownList.selectedIndex = _self.dropdownList.selectedIndex
                        - 1;
        } else if (keyCode == KEYS.Key_Down) {
            if (_self.dropdownList.selectedIndex < _self.dropdownList.options.length
                    - 1)
                _self.dropdownList.selectedIndex = _self.dropdownList.selectedIndex
                        + 1;
        } else if (keyCode == KEYS.Key_Enter) {
            _self
                    .setCaption(_self.dropdownList.options[_self.dropdownList.selectedIndex].text);
            _self.__onchange();
            _self.showDropDownList(false);
        }
    }

}

_p.clearComboBosDataSource = function(){
    this.comboBoxDataSource = null;
}

// 设置combobox的数据源。
_p.setComboBoxDataSource = function(data){
    this.comboBoxDataSource = data;
}

// 取得combobox的数据源。
_p.getComboBoxDataSource = function(){
    return this.comboBoxDataSource;
}

_p.__onchange = function(){
    this.onchange();
    if (this.propertyChangeListener != null)
        this.propertyChangeListener.propertyChanged(true, null);
}
_p.__itemselected = function(){
    // do others. then
    this.itemselected();
}
// 定义onchange事件。需由子类重载。当编辑框内容发生改变时被触发。
_p.onchange = function(){
}
// 定义itemSelected事件。当下拉列表内的项目被选择时触发。
_p.itemselected = function(){
}

// combox的数据源对象。
function ComboBoxDataSource(){
    this.dataset = new Array();
}

ComboBoxDataSource.prototype.count = function(){
    return this.dataset.length;
}

ComboBoxDataSource.prototype.getData = function(i){
    return this.dataset[i];
}

ComboBoxDataSource.prototype.addData = function(value){
    this.dataset.push(value);
}

ComboBoxDataSource.prototype.removeData = function(key){
    if (typeof(key) == 'string') {
        for (var i = 0; i < this.dataset.length; i += 1) {
            if (this.dataset[i] == key)
                this.dataset.splice(i, 1);
        }
    } else {
        this.dataset.splice(key, 1);
    }
}

ComboBoxDataSource.prototype.clear = function(){
    var newDataSet = new Array();
    this.dataset = null;
    this.dataset = newDataSet;
}

ComboBoxDataSource.prototype.indexOf = function(data){
    if (!data || data.length == 0)
        return -1
    try {
        for (var i = 0; i < this.dataset.length; i += 1) {
            var value = this.dataset[i];
            if (value.toLowerCase().indexOf(data.toLowerCase()) == 0) {
                return i;
            }
        }
    } catch (e) {
    }
    return -1;
}

// 从数据源中找到匹配条件的数据.
ComboBoxDataSource.prototype.findMatch = function(data){
    if (!data || data.length == 0)
        return this.dataset;
    var matchedData = new Array();
    try {
        for (var i = 0; i < this.dataset.length; i += 1) {
            var value = this.dataset[i];
            if (value.toLowerCase().indexOf(data.toLowerCase()) == 0) {
                matchedData.push(value);
            }
        }
    } catch (e) {
    }
    return matchedData;
}

function DebugViewer(wnd, pe){
    var hef = new HtmlElementFactory(wnd.document, pe);
    this._debug = hef.textarea("", "DebugTextarea");
    with (this._debug.style) {
        fontSize = "12px";
        fontWeight = "bold";
        width = "100%";
        height = "100%";
    }
}

DebugViewer.prototype.println = function(p){
    this._debug.value += "=== @" + new Date().toLocaleTimeString() + "\n" + p
            + "\n=== !End. ===\n";
}

DebugViewer.prototype.print = function(p){
    this._debug.value = "=== @" + new Date().toLocaleTimeString() + "\n" + p
            + "\n=== !End. ===\n";
}

DebugViewer.prototype.setVisible = function(f){
    if (typeof(f) == "boolean")
        this._debug.style.display = f ? "" : "none";
}

function EditBrowser(wnd, parent, width){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parent);
    this._width = toPerNumber(width);
    this._height = "18px";
    this.value = "";
    this._initEditButton();
}

_extendClass(EditBrowser, SanComponent, "EditBrowser");

EditBrowser.prototype.dispose = function(){
    this._hef = null;
    this.domedit = null;
    this.dombt = null;
    this.value = null;
    SanComponent.prototype.dispose.call(this);
}

EditBrowser.prototype._initEditButton = function(){
    this.cbar = this.doc.createElement("table");
    with (this.cbar) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
    }
    with (this.cbar.style) {
        width = this._width;
        height = this._height;
        backgroundColor = "#ffffff";
        border = "1px solid #7F9DB9";
    }
    var row = this.cbar.insertRow(-1);
    this.icon = row.insertCell(-1);
    with (this.icon) {
        align = "left";
        vAlign = "middle";
    }
    var _cicell = row.insertCell(-1);
    with (_cicell) {
        align = "left";
        vAlign = "middle";
        style.width = "99%";
    }
    var __cicell = _cicell.appendChild(this.doc.createElement("div"));
    with (__cicell.style) {
        position = "relative";
        width = "100%";
        height = "100%";
        display = "block";
        textAlign = "left";
        overflow = "hidden";
    }
    var cicell = __cicell.appendChild(this.doc.createElement("div"));
    with (cicell.style) {
        position = "absolute";
        width = "100%";
        height = "100%";
        display = "block";
        textAlign = "left";
        overflow = "hidden";
    }
    var btcell = row.insertCell(-1);
    with (btcell) {
        align = "left";
        vAlign = "middle";
        style.width = "1%";
    }
    this._hef = new HtmlElementFactory(this.doc);
    this.domedit = this._hef.edit();
    with (this.domedit) {
        size = 1;
        // readOnly = true;
        style.borderWidth = "0px";
        style.width = "100%";
        style.height = (parseInt(this._height) - 2) + "px";
    }
    cicell.appendChild(this.domedit);
    this.dombt = this._hef.button("");
    this.dombt.className = "morebt2";
    btcell.appendChild(this.dombt);
    if (this.getParentElement())
        this.getParentElement().appendChild(this.cbar);
}

EditBrowser.prototype.__getBaseDom = function(){
    return this.cbar;
}

EditBrowser.prototype.getButton = function(){
    return this.dombt;
}

EditBrowser.prototype.getEdit = function(){
    return this.domedit;
}

EditBrowser.prototype.setDisabled = function(disable){
    disable = typeof(disable) == "boolean" ? disable : false;
    this.cbar.disabled = disable;
    this.domedit.setDisabled(disable);
    this.dombt.setDisabled(disable);
}

function Link(wnd, parent){
    if (_biInPrototype)
        return;
    SanComponent.call(this, wnd, parent);
    this._onClick;
    this._initLink();
}

_extendClass(Link, SanComponent, "Link");

Link.prototype.dispose = function(){
    this._onClick = null;
    this._link.onclick = null;
    this._link = null;
    SanComponent.prototype.dispose.call(this);
}

Link.prototype.__getBaseDom = function(){
    return this._link;
}

Link.prototype._initLink = function(){
    var self = this;
    this._link = this.getDocument().createElement("a");
    with (this._link.style) {
        fontSize = "12px";
        padding = "0px 2px 0px 2px";
        cursor = "pointer";
    }
    this._link.innerHTML = "点击这里";
    this._link.onclick = function(){
        if (typeof(self._onClick) == "function")
            self._onClick(self);
    }
    if (this.getParentElement())
        this.getParentElement().appendChild(this._link);
}

Link.prototype.setColor = function(v){
    this._link.style.color = v;
}

Link.prototype.setUnderline = function(b){
    var v = b ? "underline" : 'none';
    this._link.style.textDecoration = v;
}

Link.prototype.setCaption = function(p){
    this._link.innerHTML = p;
}

Link.prototype.setOnClick = function(p){
    this._onClick = p;
}

Link.prototype.setDisabled = function(disable){
    disable = typeof(disable) == "boolean" ? disable : false;
    this._link.disabled = disable;
}

/*
firefox 在iframe元素上的mouse event无法正常接受,所以要生成一个非常巨大的float div用来接受事件.
*/
function firePanel(doc, visible){
    if (isie)
        return;
    var result;
    result = doc.getElementById("slk_firePane");
    if (!result) {
        result = doc.body.appendChild(doc.createElement("div"));
        result.id = "slk_firePane";
        result.oncontextmenu = function(){
            return false;
        };
        with (result.style) {
            position = "absolute";
            left = "-100px";
            top = "-100px";
            width = "999999px";
            height = "999999px";
            MozUserSelect = "none";
        }
    }
    result.style.display = visible ? "" : "none";
}

function showDisablePane(parentDom, visible, color, zindex){
    if (!parentDom.__disablePane) {
        if (!visible)
            return;
        parentDom.__disablePane = new DisablePane(parentDom, visible, color,
            zindex);
    } else
        parentDom.__disablePane.setVisible(visible);
}

/**
    @param string or object parentDom 父对象,可以是字符串或对象,如果不指定就是body
    @param boolean visible 是否可见,缺省的为true
    @param string color 透明色,例如:#FF0000,如果不指定则缺省的是#FFFFFF
    @param number zindex div的zindex值,缺省的为1
*/
function DisablePane(parentDom, visible, color, zindex){
    if (parentDom && typeof(parentDom) == "string")
        this.parentDom = this.doc.getElementById(parentDom);
    else if (parentDom && typeof(parentDom) == "object")
        this.parentDom = parentDom;
    else
        this.parentDom = document.body;
    this.doc = this.parentDom.ownerDocument;

    this.color = color && typeof(color) == "string" && color.charAt(0) == "#"
            ? color
            : "#FFFFFF";
    this.zIndex = zindex && typeof(zindex) == "number" ? zindex : 1;
    this.pid = 0;

    this._initDisablePane();
    this.setVisible(visible);
}
;

DisablePane.NAME = "slk_disablePane";

DisablePane.prototype.dispose = function(){
    if (this.inpane)
        this.inpane.oncontextmenu = null;
    this.pane.oncontextmenu = null;
    this.parentDom.removeChild(this.pane);
    this.parentDom.__disablePane = null;
};

DisablePane.prototype._initDisablePane = function(){
    this.pane = this.doc.getElementById(DisablePane.NAME);
    if (!this.pane) {
        this.pane = this.parentDom.appendChild(this.doc.createElement("div"));
        this.pane.id = DisablePane.NAME;
        this.pane.oncontextmenu = function(){
            return false;
        };
        with (this.pane.style) {
            position = "absolute";
            left = "0px";
            top = "0px";
            width = this.parentDom.offsetWidth + "px";
            height = this.parentDom.offsetHeight + "px";
        }
        if (isMSIE) {
            this.inpane = this.pane.appendChild(this.doc.createElement("div"));
            with (this.inpane.style) {
                backgroundColor = this.color;
                width = "100%";
                height = "100%";
                filter = "alpha(opacity=15)";
            }
            this.inpane.oncontextmenu = function(){
                return false;
            };
        }
        if (isFirefox) {
            with (this.pane.style) {
                backgroundColor = this.color;
                opacity = "0.15";
                MozUserSelect = "none";
            }
        }
    }
};

DisablePane.prototype.setColor = function(p){
    this.color = p && typeof(p) == "string" && p.charAt(0) == "#"
            ? p
            : "#FFFFFF";
    if (isFirefox) {
        this.pane.style.backgroundColor = this.color;
    }
    if (isMSIE) {
        this.inpane.style.backgroundColor = this.color;
    }
};

DisablePane.prototype.setVisible = function(f){
    this.pid += f ? 1 : -1;
    if (this.pid < 0)
        this.pid = 0;
    with (this.pane.style) {
        width = this.parentDom.offsetWidth + "px";
        height = this.parentDom.offsetHeight + "px";
        display = (this.pid > 0) ? "" : "none";
    }
};

function Button(wnd, parentElement, caption){
    if (typeof(wnd.title) != "undefined") {
        this.doc = wnd;
        this.wnd = this.doc.parentWindow;
    } else {
        this.wnd = wnd;
        this.doc = this.wnd.document;
    }
    if (typeof(parentElement) == "object")
        this.pe = parentElement;
    if (typeof(parentElement) == "string")
        this.pe = this.doc.getElementById(parentElement);
    this._caption = caption && typeof(caption) == "string" ? caption : "";
    this.onclick;
    this._initButton();
}
;

Button.create = function(wnd, parentElement, caption){
    var r = new Button(wnd, parentElement, caption);
    addDispose(r);
    return r;
};

Button.prototype.dispose = function(){
    this._btNode = null;
    this._caption = null;
    this.onclick = null;
    this.leftBt = null;
    if (this.midBt) {
        this.midBt.onclick = null;
        this.midBt.onmouseover = null;
        this.midBt.onmouseout = null;
        this.midBt.onmousedown = null;
        this.midBt.onmouseup = null;
        this.midBt = null;
    }
    this.rightBt = null;
};

/*初始化按钮*/
Button.prototype._initButton = function(){
    this.outside = this.doc.createElement("div");
    with (this.outside.style) {
        position = "relative";
        textAlign = "center";
        styleFloat = "left";
        cssFloat = "left";
        whiteSpace = "nowrap";
    }

    this._makeButton();
    this._eventButton();
    if (this.pe)
        this.pe.appendChild(this.outside);
};

Button.prototype._eventButton = function(){
    var self = this;
    this.midBt.onmouseover = function(){
        self.leftBt.className = "buttonLeftOver";
        this.className = "buttonMidOver";
        self.rightBt.className = "buttonRightOver";
    };
    this.midBt.onmouseout = function(){
        self.leftBt.className = "buttonLeftOut";
        this.className = "buttonMidOut";
        self.rightBt.className = "buttonRightOut";
    };
    this.midBt.onmousedown = function(){
        self.leftBt.className = "buttonLeftDown";
        this.className = "buttonMidDown";
        self.rightBt.className = "buttonRightDown";
    };
    this.midBt.onmouseup = this.midBt.onmouseout;
    this.midBt.onclick = function(){
        self.midBt.onmouseover();
        if (typeof(self.onclick) == "function")
            self.onclick(self);
    };
};

Button.prototype._makeButton = function(){
    this.leftBt = this.outside.appendChild(this.doc.createElement("button"));
    this.leftBt.disabled = true;
    this.leftBt.className = "buttonLeftOut";
    this.midBt = this.outside.appendChild(this.doc.createElement("button"));
    this.midBt.className = "buttonMidOut";
    this.rightBt = this.outside.appendChild(this.doc.createElement("button"));
    this.rightBt.disabled = true;
    this.rightBt.className = "buttonRightOut";
    with (this.leftBt.style) {
        position = "relative";
        overflow = "hidden";
        fontSize = "1px";
        padding = "0px";
        borderWidth = "0px";
        whiteSpace = "nowrap";
        styleFloat = "left";
        cssFloat = "left";
        display = "inline";
    }
    with (this.midBt.style) {
        position = "relative";
        overflow = "hidden";
        fontSize = "12px";
        padding = "0px 5px 0px 5px";
        borderWidth = "0px";
        whiteSpace = "nowrap";
        styleFloat = "left";
        cssFloat = "left";
        display = "inline";
    }
    with (this.rightBt.style) {
        position = "relative";
        overflow = "hidden";
        fontSize = "1px";
        padding = "0px";
        borderWidth = "0px";
        whiteSpace = "nowrap";
        styleFloat = "left";
        cssFloat = "left";
        display = "inline";
    }
    this._bttab = this.midBt.appendChild(this.doc.createElement("table"));
    with (this._bttab) {
        border = 0;
        cellPadding = 0;
        cellSpacing = 0;
        style.cursor = "default";
    }
    var _btrow = this._bttab.insertRow(0);
    this._imgCell = _btrow.insertCell(0);
    with (this._imgCell) {
        noWrap = true;
        align = "left";
        style.fontSize = "1px";
    }
    this._textCell = _btrow.insertCell(1);
    with (this._textCell) {
        noWrap = true;
        align = "center";
        style.fontSize = "12px";
    }
    this.setCaption(this._caption);
};

/*设置标题*/
Button.prototype.setCaption = function(cp){
    this._caption = cp ? cp : "";
    if (!this._btNode)
        this._btNode = this._textCell.appendChild(this.doc
                .createTextNode(this._caption));
    else
        this._btNode.nodeValue = this._caption;

    var self = this;
    this.__resizeStart = new Date();
    this.__resizetimer = setInterval(function(){
            if (self.midBt.offsetWidth > 0) {
                self.outside.style.width = self.midBt.offsetWidth
                        + self.rightBt.offsetWidth + self.leftBt.offsetWidth;
                if (self.__resizetimer)
                    clearInterval(self.__resizetimer);
            }
            if ((new Date() - self.__resizeStart) / 1000 > 10)
                if (self.__resizetimer)
                    clearInterval(self.__resizetimer);
        }, 10);
};

/*获取标题*/
Button.prototype.getCaption = function(){
    return this._caption;
};

/*设置点击事件*/
Button.prototype.setOnClick = function(t){
    this.onclick = t;
};

Button.prototype.getContainer = function(){
    return this.outside;
};

/*获取按钮id*/
Button.prototype.setId = function(id){
    if (id && typeof(id) == "string")
        this.outside.id = id;
};

/*设置按钮id*/
Button.prototype.getId = function(){
    return this.outside.id;
};

Button.prototype.setPadding = function(a){
    if (typeof(a) == "number") {
        this.midBt.style.paddingRight = this.midBt.style.paddingLeft = a + "px";
    }
};

/*设置按钮图标*/
Button.prototype.setImg = function(img, title){
    if (!this._btIcon)
        this._btIcon = this._imgCell.appendChild(this.doc.createElement("img"));
    this._btIcon.align = "absmiddle";
    this._btIcon.src = img;
    if (typeof(title) == "string") {
        this._btIcon.title = title;
    }
};

/*屏蔽按钮,布尔值*/
Button.prototype.disable = function(f){
    if (typeof(f) == "boolean")
        this.midBt.disabled = f;
};

Button.prototype.setDisabled = Button.prototype.disable;

/*是否显示,布尔值,缺省为true(显示)*/
Button.prototype.visible = function(f){
    if (typeof(f) == "boolean")
        this.outside.style.display = f ? "" : "none";
};

/*显示按钮*/
Button.prototype.show = function(){
    this.visible(true);
};

/*隐藏按钮*/
Button.prototype.hide = function(){
    this.visible(false);
};

Button.prototype.getPane = function(){
    return this.leftBt;
};

/**
 绑定事件到top的所有iframe上
 @param method string 对事件的处理方法,add是添加,remove是删除
 @param e string 绑定到哪个事件上,如mousedown
 @param func function 绑定的事件上要触发的函数
 */
function attacheEvent4TopIframes(method, e, func){
    if (typeof(func) != "function")
        return;
    attacheEvent4Iframes(method, top.document, e, func);
}

/**
 绑定事件到当前documentr的所有iframe上
 @param method string 对事件的处理方法,add是添加,remove是删除
 @param doc object 是document对象
 @param e string 绑定到哪个事件上,如mousedown
 @param func function 绑定的事件上要触发的函数
 */
function attacheEvent4Iframes(method, doc, e, func){
    if (method == "add")
        addEvent(doc, e, func, false);
    else
        removeEvent(doc, e, func, false);

    var _tmp;
    var _wnd;
    var _ifms = doc.getElementsByTagName("iframe");
    // var _ifms = doc.frames;
    for (var i = 0; _ifms && i < _ifms.length; i += 1) {
        try {
            _tmp = _ifms[i];
            _tmp.contentWindow.document; // 检查document是否可存取。domain之外的js无权限存取。
            _tmp.contentWindow.document.body;
            if (_tmp.style.display == "none"
                    || (_tmp.parentNode && _tmp.parentNode.style.display == "none"))
                continue;
            if (_tmp.id.indexOf("SAN_BACKGROUND_IFRAME_ID") >= 0)
                continue;// 显示于菜单之后的iframe
        } catch (e) {
            continue;
        }
        _wnd = _tmp.contentWindow.document;
        if (!_wnd || !_wnd.body)
            continue;
        attacheEvent4Iframes(method, _wnd, e, func);
    }
    attacheEvent4Frames(method, doc, e, func);
}

/**
 绑定事件到当前documentr的所有frame上
 @param method string 对事件的处理方法,add是添加,remove是删除
 @param doc object 是document对象
 @param e string 绑定到哪个事件上,如mousedown
 @param func function 绑定的事件上要触发的函数
 */
function attacheEvent4Frames(method, doc, e, func){
    var _tmp;
    var _wnd;
    var _fms = doc.getElementsByTagName("frame");
    for (var i = 0; i < _fms.length; i += 1) {
        _tmp = _fms[i];
        try {
            _tmp.contentWindow.document; // 检查document是否可存取。domain之外的js无权限存取。
            _tmp.contentWindow.document.body;
        } catch (e) {
            continue;
        }
        _wnd = _tmp.contentWindow.document;
        if (!_wnd || !_wnd.body)
            continue;
        attacheEvent4Iframes(method, _wnd, e, func);
    }
}

/**
*可编辑的Combobox控件
*@param wnd object window对象
*@param pe string or object 控件的容器
*@param width number 控件的宽度
*/
function EditCombobox(wnd, pe, width){
    this.wnd = typeof(wnd) == "object" && wnd.document ? wnd : window;
    this.doc = this.wnd.document;
    pe = pe && typeof(pe) == "string" ? this.doc.getElementById(pe) : pe;
    if (pe && typeof(pe) == "object")
        this.pe = pe;
    this.width = typeof(width) == "number" ? width : 80;
    this._initEditCombobox();
}
;
EditCombobox.create = function(wnd, pe, width){
    var r = new EditCombobox(wnd, pe, width);
    addDispose(r);
    return r;
};
EditCombobox.prototype = {
    dispose : function(){
        this.edit.onkeydown = null;
        this.combobox.onchange = null;
    },
    _initEditCombobox : function(){
        var self = this;
        this.container = this.doc.createElement("table");
        with (this.container) {
            border = 0;
            cellPadding = 0;
            cellSpacing = 0;
        }
        with (this.container.style) {
            position = "relative";
            styleFloat = "left";
            cssfloat = "left";
            width = (this.width + 22) + "px";
            height = "20px";
        }
        var cell = this.container.insertRow(-1).insertCell(-1);
        with (cell) {
            align = "left";
            vAlign = "top";
        }
        this.editContainer = cell.appendChild(this.doc.createElement("div"));
        with (this.editContainer.style) {
            position = "absolute";
            zIndex = 2;
            width = this.width + "px";
            height = "20px";
            border = "1px solid #ACA899";
            borderRight = "none";
            borderBottomColor = "#F1EFE2";
            overflow = "hidden";
        }
        this._editContainer = this.editContainer.appendChild(this.doc
                .createElement("div"));
        with (this._editContainer.style) {
            position = "absolute";
            width = this.width + "px";
            height = "20px";
            border = "1px solid #716F64";
            borderRight = "none";
            borderBottomColor = "#F1EFE2";
            overflow = "hidden";
        }
        this.edit = this._editContainer.appendChild(this.doc
                .createElement("input"));
        with (this.edit.style) {
            position = "absolute";
            width = this.width + "px";
            height = "20px";
            zIndex = 2;
            border = "none";
            overflow = "hidden";
        }
        this.edit.onkeydown = function(e){
            if (!e)
                e = self.wnd.event;
            if (e.keyCode == 13) {
                if (this.value)
                    self.addOption(this.value, this.value);
            }
        };
        this.ifr = this._editContainer.appendChild(this.doc
                .createElement("iframe"));
        this.ifr.frameBorder = 0;
        with (this.ifr.style) {
            position = "absolute";
            width = (this.width + 2) + "px";
            height = "20px";
            zIndex = 1;
            border = "none";
            overflow = "hidden";
        }
        this.combobox = cell.appendChild(this.doc.createElement("select"));
        with (this.combobox.style) {
            position = "absolute";
            width = (this.width + 20) + "px";
            height = "20px";
            zIndex = 1;
        }
        this.combobox.onchange = function(){
            var opt = this.options[this.selectedIndex];
            if (!opt)
                return;
            self.edit.value = opt.text;
            self.edit.realValue = opt.value;
        };
        if (this.pe)
            this.pe.appendChild(this.container);
    },

    /*清除所有项目*/
    clearOption : function(){
        for (var i = this.getCount() - 1; i > -1; i--) {
            this.removeOption(i);
        }
    },

    /**
     * 新增一项
     * @param value string 值
     * @param text string 文字
     * @return object 返回option对象
     * */
    addOption : function(value, text){
        if (this.findOption(value, false) == -1) {
            var o = this.doc.createElement("option");
            o.value = value;
            o.text = text;
            o.selected = true;
            this.setEdit(value, text);
            this.combobox.options.add(o);
            return o;
        }
    },

    /**
     * 删除指定项目,index可以是数值或字符串
     * @param index number or string 删除的索引号或者标题
     * @param isText boolean 删除的对象是否为文本,当index为字符串时,该参数可以指定删除的是以text还是value来删除
     * */
    removeOption : function(index, isText){
        if (typeof(index) == "string") {
            index = this.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1)
            this.combobox.remove(index);
    },

    /**
     * 获取项目数
     * @return number
     * */
    getCount : function(){
        return this.combobox.options.length;
    },

    /*获取指定的项目,index可以是数值或字符串*/
    getOption : function(index, isText){
        if (typeof(index) == "string") {
            index = this.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1)
            return this.combobox.options[index];
    },

    /**
     * 设置指定的项目为选择状态,index可以是数值或字符串
     * */
    setSelected : function(index, isText){
        if (typeof(index) == "string") {
            if (!isText && this.value == index) {
                return;
            }
            index = this.findOption(index, isText);
        }
        if (typeof(index) == "number" && index != -1) {
            this.combobox.options[index].selected = true;
            var r = this.combobox.options[index];
            this.setEdit(r.value, r.text);
        }
    },
    /**
     * 设置编辑框的value和caption
     * */
    setEdit : function(value, caption){
        this.edit.value = caption ? caption : "";
        this.edit.realValue = value ? value : "";
    },
    /**
     * 获取编辑框的值,这个值不是编辑框的标题,对应的是options里的value
     * */
    getEditValue : function(){
        return this.edit.realValue ? this.edit.realValue : "";
    },
    /**
     * 获取编辑框里的标题,对应的是options里的text
     * */
    getEditCaption : function(){
        return this.edit.value ? this.edit.value : "";
    },
    /**
     * 查找指定的项目是否存在,如不存在则返回空, isText是布尔值,表示text是否为text还是value,缺省为text
     * @param text string 要查找的内容
     * @param isText boolean 查找的串是text还是value
     * @sample if (findOption("环比")!=-1) {}else{}
     * */
    findOption : function(text, isText){
        isText = typeof(isText) == "boolean" ? isText : true;
        var count = this.combobox.options.length;
        var tmp = null;
        for (var i = 0; i < count; i += 1) {
            tmp = this.combobox.options[i];
            if (isText ? tmp.text == text : tmp.value == text)
                return i;
        }
        return -1;
    },

    /**
     * 获取当前被选择的项目
     * @sample getCurrentOption().value
     * */
    getCurrentOption : function(){
        for (var i = 0; i < this.combobox.options.length; i += 1) {
            if (this.combobox.options[i].selected)
                return this.combobox.options[i];
        }
        return null;
    },
    /**
     * 设置是否屏蔽
     * @param disable boolean
     * @sample setDisabled(true)
     * */
    setDisabled : function(disable){
        disable = typeof(disable) == "boolean" ? disable : false;
        if (this.combobox.disabled != disable)
            this.combobox.disabled = disable;
        this.edit.disabled = disable;
    },

    /**
     * 设置宽度
     * @param p number 具体的大小
     * @sample size(100)
     * */
    size : function(p){
        if (typeof(p) == "number") {
            this.width = p;
            this.container.style.width = (this.width + 22) + "px"
            this.editContainer.style.width = this.width + "px";
            this._editContainer.style.width = this.width + "px";
            this.edit.style.width = this.width + "px";
            this.ifr.style.width = (this.width + 2) + "px";
            this.combobox.style.width = (this.width + 20) + "px";
        }
    }
};

/*在ie中菜单，floatdiv和dialog后面都必须有一个iframe，这样就造成ie中有很多iframe，其实创建一个公共的iframe池就好了。
  此函数每次返回一个可用的iframe*/
function getBackGroundIFrame(doc){
    if (!doc)
        doc = document;
    var ifms = doc.getElementsByTagName("iframe");
    var ifm;
    for (var i = 0; ifms && i < ifms.length; i += 1) {
        ifm = ifms[i];
        if (ifm.id == "SAN_BACKGROUND_IFRAME_ID" && ifm.style.display == "none")
            return ifm;
    }
    ifm = doc.createElement("iframe");
    ifm.id = "SAN_BACKGROUND_IFRAME_ID";
    ifm.frameBorder = 0;
    with (ifm.style) {
        position = "absolute";
        width = 0;
        height = 0;
        left = "-99999px";
        top = "0px";
        display = "none";
    }
    doc.body.appendChild(ifm);
    return ifm;
}

/*显示或隐藏dom后面的iframe,如果是显示，则返回iframe*/
function showBackGroundIFrame(dom, visible){
    if (!isie)
        return;
    if (visible) {
        var ifm = dom._back_ground_iframe;
        if (!ifm)
            ifm = getBackGroundIFrame(dom.ownerDocument);
        if (ifm.parentNode != dom.parentNode) {
            ifm.parentNode.removeChild(ifm);
            dom.parentNode.appendChild(ifm);
        }
        with (ifm.style) {
            left = dom.offsetLeft + "px";
            top = dom.offsetTop + "px";
            width = dom.offsetWidth + "px";
            height = dom.offsetHeight + "px";
            zIndex = dom.style.zIndex - 1;
            display = "";
        }
        dom._back_ground_iframe = ifm;
        ifm._in_used = true;
        return ifm;
    } else {
        var ifm = dom._back_ground_iframe;
        dom._back_ground_iframe = null;
        if (!ifm)
            return;
        ifm._in_used = false;
        ifm.style.display = "none";
        if (ifm.parentNode != ifm.ownerDocument.body) {
            ifm.parentNode.removeChild(ifm);
            ifm.ownerDocument.body.appendChild(ifm);
        }
    }
}
