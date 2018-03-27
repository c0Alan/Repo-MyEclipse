Ext.tusc.plugins.Select= function(config) {
	Ext.tusc.plugins.Select.superclass.constructor.call(this, config);
	config = config || {};
	this.initialConfig = config;
	Ext.apply(this, config);
};

Ext.extend(Ext.tusc.plugins.Select, Ext.util.Observable, {
	
	/**
	 * 引用此插件的控件对象
	 * @type 
	 */
	item : null,
	
	/**
	 * 注册事件的element
	 * @type 
	 */
	eventEl : null,
	
	/**
	 * 控件的wrap对象，用户计算弹出select的宽高
	 * @type 
	 */
	itemWrap : null,
	
	/**
	 * 插件是否初始话
	 * @type Boolean
	 */
	rendered : false,
	
	queryField : "jp",

	valueField : "value",

	displayField : "text",
	
	/**
	 * @cfg {Number} minListWidth The minimum width of the dropdown list in pixels
	 * (defaults to <tt>70</tt>,
	 * will be ignored if <tt>{@link #listWidth}</tt> has a higher value)
	 */
	minListWidth : 70,
	
	/**
	 * @cfg {Number} maxHeight The maximum height in pixels of the dropdown list before scrollbars are shown
	 * (defaults to <tt>300</tt>)
	 */
	maxHeight : 300,
	/**
	 * @cfg {Number} minHeight The minimum height in pixels of the dropdown list when the list is constrained by its distance to the viewport edges
	 *      (defaults to <tt>90</tt>)
	 */
	minHeight : 90,

	store : null,

	storeData : null,
	
	minChars : 0,
	
	queryDelay : 500,
	
	mode : 'local',
	
	selectedClass : 'x-combo-selected',
	
	// 弹出层最大高度
	layerHeight : 300,
	
	// 弹出层最小宽度
	minLayerWidth : 150,
	
	//是否启用简拼查询
	enableJP : true,
	
	//是否输入重新加载
	editReload: true,
	
	//是否多选
	multiSelect : false,
	
	// 延迟执行任务，避免restrictLayerDirect方法执行太多次
	restrictLayerTask : new Ext.util.DelayedTask(),
	
	init : function(item) {
		this.item = item;
		this.multiSelectSeparator = Artery.getMultiSelectSeparator();
		
		if (this.mode == 'local') {
			if (!Ext.isDefined(this.initialConfig.queryDelay)) {
				this.queryDelay = 10;
			}
			if (!Ext.isDefined(this.initialConfig.minChars)) {
				this.minChars = 0;
			}
		}
		
		if (!Ext.isEmpty(this.item.layerHeight)) {
			this.layerHeight = this.item.layerHeight;
		}
		
		if (!Ext.isEmpty(this.item.minLayerWidth)) {
			this.minLayerWidth = this.item.minLayerWidth;
		}
		
//		if (!Ext.isEmpty(this.item.editReload)) {
//			this.editReload = this.item.editReload;
//		}
		
		if (this.item.getMultiSelect && Ext.isFunction(this.item.getMultiSelect)) {
			this.multiSelect = this.item.getMultiSelect();
		}
		
		this.addEvents('expand', 'collapse', 'beforeselect', 'select', 'beforequery');
		item.initEvents = item.initEvents.createSequence(this.registerSelect, this);
		
		// 防止 内存泄露
		Ext.EventManager.on(window, 'beforeunload', function() {
			try {
				if (this.view) {
					this.view.destroy();
					this.view = null;
				}
				if (this.list) {
					this.list.destroy();
					this.list = null;
				}
			} catch (e) {
			}
		}, this)
	},
	
	registerSelect : function() {
		this.eventEl = this.item.getEventElement ? this.item.getEventElement() : this.item.el;
		this.itemWrap = this.item.getWrap ? this.item.getWrap() : (this.item.wrap ? this.item.wrap : this.item.el);
		
		this.eventEl.on("keyup", this.onKeyUpList, this);
	},
	
	onKeyUpList : function(e) {
		if (this.item.isShowSelectList && Ext.isFunction(this.item.isShowSelectList)) {
			if (!this.item.isShowSelectList()) {
				return
			}
		}
		
		if (!this.rendered) {
			this.rendered = true;
			this.initStore();
			this.initList();
			this.initEvents();
		}
		
		if (this.editReload) {
			var key = e.getKey();
			if (key != Ext.EventObject.LEFT
					&& key != Ext.EventObject.UP
					&& key != Ext.EventObject.RIGHT
					&& key != Ext.EventObject.DOWN
					&& key != Ext.EventObject.SHIFT
					&& key != Ext.EventObject.TAB
					&& key != Ext.EventObject.CTRL
					&& key != Ext.EventObject.ALT
					&& key != Ext.EventObject.ENTER
					&& key != Ext.EventObject.ESC) {
				this.reload();
			}
		} else {
			// modify by wj 当按下回车键时，也开始搜索；兼容用中文输入法按回车输入英文字母的情况
			if (!e.isSpecialKey() || e.getKey() == Ext.EventObject.ENTER || e.getKey() == Ext.EventObject.BACKSPACE) {
				// modify
				if (!this.multiSelect) {
					this.valueArray = [];
				}
				this.lastKey = e.getKey();
				this.dqTask.delay(this.queryDelay);
			}
		}
	},

	initEvents : function() {
		this.keyNav = new Ext.KeyNav(this.eventEl, {
			"up" : function(e) {
				this.inKeyMode = true;
				this.hoverPrev();
			},
			"down" : function(e) {
				this.inKeyMode = true;
				this.hoverNext();
			},
			"enter" : function(e) {
				if (this.isExpanded()) {
					this.inKeyMode = true;
					// modify
					if (this.view.lastItem == null || this.view.lastItem === undefined) {
						e.stopEvent();
						return;
					}
					var hoveredIndex = this.view.indexOf(this.view.lastItem);
					this.onViewBeforeClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
					this.onViewClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
				} 
				return true;
			},
			"esc" : function(e) {
				this.collapse();
			},
			"tab" : function(e) {
				this.collapse();
				return true;
			},
			"home" : function(e) {
				this.hoverFirst();
				return false;
			},
			"end" : function(e) {
				this.hoverLast();
				return false;
			},
			scope : this,
			doRelay : function(foo, bar, hname) {
				if (hname == 'down' || this.scope.isExpanded()) {
					return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}
				// ANDRIE
				if (hname == 'enter' || this.scope.isExpanded()) {
					return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}
				// END
				return true;
			},
			forceKeyDown : true
		});
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == 'local' ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
	},
	
	//初始化store
	initStore : function(){
		if (this.store == null) {
				var storeCfg = {
					proxy : new Ext.data.HttpProxy({
						url : sys.getContextPath() + '/artery/form/dealParse.do?action=runItemLogic'
					}),
					reader : new Ext.data.ArrayReader({}, this.getStoreFields())
				}
				if(this.storeData != null){
					storeCfg.data = this.storeData;
				}
				this.store = new Ext.data.Store(storeCfg);
				this.store.on("beforeload", this.onBeforeload, this);
		}
	},
	
	getStoreFields: function(){
		if(Ext.isTrue(this.enableJP)){
			return ['text','value','jp'];
		}else{
			return ['text','value'];
		}
	},
	
	initList : function() {
		this.valueArray = Ext.isEmpty(this.item.getValue()) ? [] : this.item.getValue().split(this.multiSelectSeparator);
		
		if (!this.list) {
			var cls = 'x-combo-list';
			this.list = Artery.pwin.Ext.tusc.plugins.Select.prototype.createList({field : this, cls : cls});
			this.list.setZIndex(20000);
			var lw = this.listWidth || Math.max(this.itemWrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			//this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;

			if (this.title) {
				this.header = this.list.createChild({
							cls : cls + '-hd',
							html : this.title
						});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList.on('mouseover', this.onViewOver, this);
			this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'))

			if (!this.tpl) {
				this.tpl = '<tpl for="."><div class="' + cls + '-item">{'
						+ this.displayField + '}</div></tpl>';
			}
			this.view = Artery.pwin.Ext.tusc.plugins.Select.prototype.createDataView({field : this, cls : cls});

			this.view.on('click', this.onViewClick, this);
			// ANDRIE
			this.view.on('beforeClick', this.onViewBeforeClick, this);
			// END
			//this.view.getEl().setStyle('padding-bottom','15px');
			
			this.bindStore(this.store, true);
			if (this.valueArray.length) {
				this.selectByValue(this.valueArray);
			}
		}
	},
	
	createList : function(cfg){
		var vlist = new Artery.plugin.PopupLayer({
						shadow : cfg.field.shadow,
						cls : [cfg.cls, cfg.field.listClass].join(' '),
						constrain : false,
						popupField: cfg.field
					});
		cfg.field.innerList = vlist.createChild({
						cls : cfg.cls + '-inner'
					});
		return vlist;
	},
	
	createDataView : function(cfg){
		var vDateView = new Ext.DataView({
						applyTo : cfg.field.innerList,
						tpl : cfg.field.tpl,
						singleSelect : true,

						// ANDRIE
						multiSelect : cfg.field.multiSelect,
						simpleSelect : true,
						overClass : cfg.cls + '-cursor',
						// END

						selectedClass : cfg.field.selectedClass,
						itemSelector : cfg.field.itemSelector || '.' + cfg.cls + '-item',
						onContainerClick : function(e){}
					});
		return vDateView;
	},

	// private
	onViewOver : function(e, t) {
		if (this.inKeyMode) { // prevent key nav and mouse over conflicts
			return;
		}
	},
	
	// private
	onViewMove : function(e, t) {
		this.inKeyMode = false;
	},
	
	// private
	onViewClick : function(vw, index, node, e) {
		// from the old doFocus argument; don't really know its use
		// 在设值之前先focus，使设值之后的光标位置输入框的最后；否则先focus后设置光标一直在输入框的最前面
		if (vw !== false) {
			this.eventEl.focus(); //modify by hf
		}
		if (typeof index != 'undefined') {
			var arrayIndex = this.preClickSelections.indexOf(index);
			if (arrayIndex != -1 && this.multiSelect) {
				this.removeValue(this.store.getAt(index).data[this.valueField || this.displayField]);
				if (this.inKeyMode) {
					this.view.deselect(index, true);
				}
			} else {
				var r = this.store.getAt(index);
				if (r) {
					if (this.inKeyMode) {
						this.view.select(index, true);
					}
					this.onSelect(r, index);
				}
			}
			if (this.item.validate && Ext.isFunction(this.item.validate)) {
				this.item.validate();
			}
		}
		if (vw !== false) {
			// modify
			this.hover(index)
		}
	},
	
	// private
	onViewBeforeClick : function(vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
	},

	// private
	bindStore : function(store, initial) {
		if (this.store && !initial) {
			this.store.un('beforeload', this.onBeforeload, this);
			this.store.un('load', this.onLoad, this);
			this.store.un('exception', this.collapse, this);
			if (this.store !== store && this.store.autoDestroy) {
				this.store.destroy();
			}
			if (!store) {
				this.store = null;
				if (this.view) {
					this.view.bindStore(null);
				}
			}
		}
		if (store) {
			if (!initial) {
				this.lastQuery = null;
				if (this.pageTb) {
					this.pageTb.bindStore(store);
				}
			}

			this.store = Ext.StoreMgr.lookup(store);
			this.store.on({
						scope : this,
						beforeload : this.onBeforeload,
						load : this.onLoad,
						exception : this.collapse
					});

			if (this.view) {
				this.view.bindStore(store);
			}
		}
	},
	
	// 加载前设置一些参数
	onBeforeload: function(store, options){
		if (options.params == null) {
			options.params = {};
		}
		Ext.apply(options.params, Artery.getParams({
			method:'loadSelectStore',
			editReload : this.editReload
		}, this.item));
		var userParam = (this.item.getLoadSelectStoreParam ? this.item.getLoadSelectStoreParam() : {}) || {};
		Ext.apply(options.params, userParam);
		
		// 设置用户自定义参数
		options.params.custParams = Ext.encode(this.item.custParams);
	},
	
	onLoad : function() {
		if (!this.item.hasFocus) {
			return;
		}
		if (this.store.getCount() > 0) {
			this.expand();
			this.restrictHeight();
			this.selectNext();
//			if (this.lastQuery == this.allQuery) {
//				if (this.editable) {
//					this.eventEl.dom.select();
//				}
//				this.selectByValue(this.item.value, true);
//			} else {
//				this.selectNext();
//			}
		} else {
			this.onEmptyResults();
		}
		this.eventEl.focus();
	},
	
	// 重新加载
	// {multiSelect:true,params:{},callback:function}
	reload : function(o) {
		Artery.plugin.PopupLayerMgr.hideAll();
		
		if(o == null){
			o = {}
		}
		if(o.params == null){
			o.params = {};
		}
		this.store.reload({
			params : o.params,
			callback : function(r, options, success) {
				if (o.multiSelect && o.multiSelect != this.multiSelect) {
					this.multiSelect = o.multiSelect;
				}
				this.loaded = true;
				this.store.loaded = true;
				if(this.view){
					this.view.refresh();
				}
				this.reSelectValue();
				if (o.callback) {
					o.callback.call(this, r, options, success);
				}
			},
			scope : this
		})
	},
	
	isExpanded : function() {
		return this.list && this.list.isVisible();
	},
	
	expand : function() {
		if (this.isExpanded() || !this.item.hasFocus) {
			return;
		}
		this.restrictLayer();
		this.fireEvent('expand', this);
	},
	
	collapse : function() {
		this.hoverOut();
		if (!this.isExpanded()) {
			return;
		}
		this.list.hide();
		Ext.getDoc().un('mousewheel', this.collapseIf, this);
		Ext.getDoc().un('mousedown', this.collapseIf, this);
		this.item.focus();
		if (this.item.validate && Ext.isFunction(this.item.validate)) {
			this.item.validate();
		}
	},

	// 在事件发生在本组件以外时，关闭弹出层
	collapseIf : function(e) {
		if (!e) {
			this.collapse();
			return;
		}
		if (!e.within(this.eventEl) && !e.within(this.list)) {
			this.collapse();
		}
	},
	
	// 显示弹出层并调整高度
	restrictLayer: function(){
		this.restrictLayerTask.delay(10, this.restrictLayerDirect, this, []);
	},
	
	restrictLayerDirect : function() {
		this.list.show();
		var layerWidth = Math.max(this.itemWrap.getWidth(), this.minLayerWidth);
		var pos = this.getPosInParent(this.itemWrap);
		// ha为浏览器上部可视高度
		var ha = pos[1] - Artery.pwin.Ext.getBody().getScroll().top;
		// hb为浏览器下部可视高度
		var hb = Artery.pwin.Ext.lib.Dom.getViewHeight() - ha - this.itemWrap.getHeight();

		var layerPos = null;
		if ((ha > hb) && (this.layerHeight > (hb - 5))) {
			// 在上面显示layer
			layerPos = [pos[0], (pos[1] - this.list.getHeight())];
		} else {
			// 在下面显示layer
			layerPos = [pos[0], (pos[1] + this.itemWrap.getHeight())];
		}
		this.list.beginUpdate();
		this.innerList.setWidth(layerWidth);
		this.list.endUpdate();
		this.list.setWidth(layerWidth);
		this.list.setXY(layerPos);
	},
	
	// private
	restrictHeight : function() {
		this.innerList.dom.style.height = '';
		var inner = this.innerList.dom;
		var pad = this.list.getFrameWidth('tb') + 0 + this.assetHeight;
		var h = Math.max(inner.clientHeight, inner.offsetHeight,
				inner.scrollHeight);
		var ha = this.item.getPosition()[1] - Ext.getBody().getScroll().top;
		var hb = Ext.lib.Dom.getViewHeight() - ha - this.item.getSize().height;
		var space = Math.max(ha, hb, this.minHeight || 0)
				- this.list.shadowOffset - pad - 5;
		h = Math.min(h, space, this.maxHeight);

		var innerListDom = this.innerList.dom;
		//判断是否出现了横向滚动条
		if(innerListDom.offsetLeft > 1 || innerListDom.scrollWidth > innerListDom.offsetWidth){
			if (Ext.isIE) { // 在ie下，需要加上横向滚动条的高度
				h = h + Artery.SCROLLBAR_HEIGHT;
			}
		}
		this.innerList.setHeight(h);
		this.list.beginUpdate();
		this.list.setHeight(h + pad);
		// this.list.alignTo(this.wrap, this.listAlign);
		this.list.endUpdate();
	},
	
	// 获得一个el在父页面中的位置
	getPosInParent: function(el) {
		var x =0, y=0;
		var fn = function(win){
			while(Artery.pwin != win ){
				var iframeEl = win.parent.Ext.get(win.frameElement);
				x +=  iframeEl.getLeft();
				y += iframeEl.getTop();
				win = win.parent;
			}
		}
		if (Artery.pwin == window) {
			x = el.getLeft();
			y = el.getTop();
		} else {
			fn(window);
			x += el.getLeft();
			y += el.getTop();
		}
		return [x, y];
	},
	
	// private
	onEmptyResults : function() {
		this.collapse();
	},
	
	// private
	onSelect : function(record, index) {
		if (this.fireEvent('beforeselect', this, record.data[this.valueField || this.displayField], this.item.getValue()) !== false) {
			this.addValue(record.data[this.valueField || this.displayField]);
			this.fireEvent('select', this, record, index);
			if (!this.multiSelect) {
				this.collapse();
			}
		}
	},
	
	select : function(index, scrollIntoView) {
		this.selectedIndex = index;
		if (!this.view) {
			return;
		}
		this.view.select(index, this.multiSelect);
		if (scrollIntoView !== false) {
			var el = this.view.getNode(index);
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},
	
	deselect : function(index, scrollIntoView) {
		this.selectedIndex = index;
		this.view.deselect(index, this.multiSelect);
		if (scrollIntoView !== false) {
			var el = this.view.getNode(index);
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},
	
	removeValue : function(v) {
		var ov = this.item.getValue();
		v = String(v);
		if (this.list) {
			var r = this.findRecord(this.valueField, v);
			this.deselect(this.store.indexOf(r));
		}
		this.valueArray.remove(v);

		this.item.setValue(this.valueArray.join(this.multiSelectSeparator));
		
		//防止onblur的时候再次触发onChange事件
		this.item.startValue = this.item.getValue();
		this.item.fireEvent('change',this.item,this.item.startValue,ov);
	},
	
	addValue : function(v) {
		var ov = this.item.getValue();
		v = String(v);
		if (!this.multiSelect) {
			this.item.setValue(v);
			this.valueArray = []
			this.valueArray.push(v);
		} else {
			if (this.valueArray.indexOf(v) == -1) {
				this.valueArray.push(v);
			}
			this.item.setValue(this.valueArray.join(this.multiSelectSeparator));
		}
		//防止onblur的时候再次触发onChange事件
		this.item.startValue = this.item.getValue();
		this.item.fireEvent('change',this.item,this.item.startValue,ov);
	},
	
	reSelectValue : function() {
		this.valueArray = Ext.isEmpty(this.item.getValue()) ? [] : this.item.getValue().split(this.multiSelectSeparator);
		
		if (this.view) {
			this.view.clearSelections();
			this.selectByValue(this.valueArray);
		}

	},
	
	// private
	selectNext : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else if (this.selectedIndex < ct - 1) {
				this.select(this.selectedIndex + 1);
			}
		}
	},

	// private
	selectPrev : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else if (this.selectedIndex !== 0) {
				this.select(this.selectedIndex - 1);
			}
		}
	},

	selectByValue : function(v, scrollIntoView) {
		this.hoverOut();
		if (v !== undefined && v !== null) {
			if (!(v instanceof Array)) {

				v = [v];
			}
			var result = [];
			for (var i = 0, len = v.length; i < len; i++) {
				var value = v[i];
				var r = this.findRecord(this.valueField || this.displayField, value);
				if (r) {
					this.select(this.store.indexOf(r), scrollIntoView);
					result.push(value);
				}
			}
			return result.join(this.multiSelectSeparator);
		}
		return false;
	},
	
	// private
	findRecord : function(prop, value) {
		var record;
		if (this.store.getCount() > 0) {
			this.store.each(function(r) {
						if (r.data[prop] == value) {
							record = r;
							return false;
						}
					});
		}
		return record;
	},
	
	// private
	initQuery : function() {
		var queryValue = this.item.getRawValue();
		if (this.lastQueryValue !== undefined && this.lastQueryValue == queryValue) {
			return;
		}
		this.lastQueryValue = queryValue;
		this.doQuery(queryValue);
	},
	
	// private
	doQuery : function(q, forceAll) {
		if (Ext.isEmpty(q)) {
//			this.collapse();
//			return;
			q = '';
		}
		
		var qe = {
			query : q,
			forceAll : forceAll,
			combo : this,
			cancel : false
		};
		if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
			return false;
		}

		// modify
		if (this.loaded == null) {
			this.store.on('load', function(store) {
						store.loaded = true;
					}, this)
			this.store.load();
			this.loaded = true;
		}
		if (this.store.loaded == null) {
			this.doQuery.defer(200, this, [q, forceAll]);
			return false;
		}

		q = qe.query;
		forceAll = qe.forceAll;
		if (forceAll === true || (q.length >= this.minChars)) {
			if (this.lastQuery !== q) {
				this.lastQuery = q;
				if (this.mode == 'local') {
					this.selectedIndex = -1;
					if (forceAll) {
						this.store.clearFilter();
					} else {
						var reg = "";
						var index = 0;//q.lastIndexOf(";");
						if(q)
							index = q.lastIndexOf(";");
						if(q.length>index+1)
							q = q.substring(index+1);
						try{
							reg = new  RegExp("("+q+")");
						}catch(e){
							reg = q;
						}
						// judge queryField
						if (this.enableJP && this.queryField != null) {
							this.store.filter(this.queryField, reg);
							// window.status = this.store.getCount()
							if (this.store.getCount() == 0) {
								this.store.filter(this.displayField, reg);
							}
						} else {
							this.store.filter(this.displayField, reg);
						}

					}
					this.onLoad();
				} else {
					this.store.baseParams[this.queryParam] = q;
					this.store.load({
								params : this.getParams(q)
							});
					this.expand();
				}
			} else {
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
		// modify
		this.reSelectValue();
	},
	
	// private
	getParams : function(q) {
		var p = {};
		return p;
	},
	
	/**
	 * Hover an item in the dropdown list by its numeric index in the list.
	 * 
	 * @param {Number}
	 *            index The zero-based index of the list item to select
	 * @param {Boolean}
	 *            scrollIntoView False to prevent the dropdown list from
	 *            autoscrolling to display the hovered item if it is not
	 *            currently in view (defaults to true)
	 */
	hover : function(index, scrollIntoView) {
		if (!this.view) {
			return;
		}
		this.hoverOut();
		var node = this.view.getNode(index);
		this.view.lastItem = node;
		Ext.fly(node).addClass(this.view.overClass);
		if (scrollIntoView !== false) {
			var el = this.view.getNode(index);
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	hoverOut : function() {
		if (!this.view) {
			return;
		}
		if (this.view.lastItem) {
			Ext.fly(this.view.lastItem).removeClass(this.view.overClass);
			delete this.view.lastItem;
		}
	},

	// private
	hoverNext : function() {
		if (!this.view) {
			return;
		}
		var ct = this.store.getCount();
		if (ct > 0) {
			if (!this.view.lastItem) {
				this.hover(0);
			} else {
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if (hoveredIndex < ct - 1) {
					this.hover(hoveredIndex + 1);
				} else {
					this.hover(0);
				}
			}
		}
	},

	// private
	hoverPrev : function() {
		if (!this.view) {
			return;
		}
		var ct = this.store.getCount();
		if (ct > 0) {
			if (!this.view.lastItem) {
				this.hover(0);
			} else {
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if (hoveredIndex != 0) {
					this.hover(hoveredIndex - 1);
				}
			}
		}
	},

	// private
	hoverFirst : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			this.hover(0);
		}
	},

	// private
	hoverLast : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			this.hover(ct-1);
		}
	}
	
})