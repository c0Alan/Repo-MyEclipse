Ext.apply(Ext.DataView.prototype, {
	deselect : function(node, suppressEvent) {
		if (this.isSelected(node)) {
			var node = this.getNode(node);
			this.selected.removeElement(node);
			if (this.last == node.viewIndex) {
				this.last = false;
			}
			Ext.fly(node).removeClass(this.selectedClass);
			if (!suppressEvent) {
				this.fireEvent('selectionchange', this, this.selected.elements);
			}
		}
	}
});

Ext.ux.Andrie={};

/**
 * @class Ext.ux.Andrie.Select
 * @extends Ext.form.ComboBox A combobox control with support for multiSelect.
 * @constructor Create a new Select.
 * @param {Object}
 *            config Configuration options
 * @author Andrei Neculau - andrei.neculau@gmail.com /
 *         http://andreineculau.wordpress.com
 * @version 0.3.7
 */
Ext.ux.Andrie.Select = function(config) {
	if (config.transform && typeof config.multiSelect == 'undefined') {
		var o = Ext.getDom(config.transform);
		config.multiSelect = (Ext.isIE
				? o.getAttributeNode('multiple').specified
				: o.hasAttribute('multiple'));
	}
	if (config.multiSelect) {
		config.selectOnFocus = false;
	}
	config.hideTrigger2 = config.hideTrigger2 || config.hideTrigger;
	Ext.ux.Andrie.Select.superclass.constructor.call(this, config);
}

Ext.extend(Ext.ux.Andrie.Select, Ext.form.ComboBox, {
	/**
	 * @cfg {Boolean} multiSelect Multiple selection is allowed (defaults to
	 *      false)
	 */
	multiSelect : false,
	/**
	 * @cfg {Boolean} clearTrigger Show the clear button (defaults to true)
	 */
	clearTrigger : true,
	/**
	 * @cfg {Boolean} history Add selected value to the top of the list
	 *      (defaults to false)
	 */
	history : false,
	/**
	 * @cfg {Integer} historyMaxLength Number of entered values to remember. 0
	 *      means remember all (defaults to 0)
	 */
	historyMaxLength : 0,
	
	listClass:' x-menu-arteryPopup ',
	
	// 弹出层最大高度
	layerHeight : 300,
	
	// 弹出层最小宽度
	minLayerWidth : 150,

	initComponent : function() {
		// from twintrigger
		this.triggerConfig = {
			tag : 'span',
			cls : 'x-form-twin-triggers',
			cn : [{
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger1Class
					}, {
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger2Class
					}]
		};

		Ext.ux.Andrie.Select.superclass.initComponent.call(this);
		if (this.multiSelect) {
			this.typeAhead = false;
			// this.editable = false;
			// this.lastQuery = this.allQuery;
			this.triggerAction = 'all';
		}
		var separator = Artery.getMultiSelectSeparator();
		this.valueArray = this.getValue() ? this.getValue().split(separator) : [];
		
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.view){
					this.view.destroy();
					this.view = null;
				}
				if(this.list){
					this.list.destroy();
					this.list = null;
				}
			}catch(e){}
		},this)
	},

	hideTrigger1 : false,
	
	hideTrigger2 : false,

	trigger1Class : 'x-form-clear-trigger',
	
	// 延迟执行任务，避免restrictLayerDirect方法执行太多次
	restrictLayerTask : new Ext.util.DelayedTask(),

	onTrigger2Click : function() {
		this.onTriggerClick();
	},

	onTrigger1Click : function() {
		this.clearValue(true);
	},

	// private
	initQuery : function() {
		var queryValue = this.getRawValue();
		if (this.lastQueryValue !== undefined && this.lastQueryValue == queryValue) {
			return;
		}
		this.lastQueryValue = queryValue;
		this.doQuery(queryValue);
	},

	clearValue : function(fireChangeEvent) {
		this.setValue('', fireChangeEvent);
		Ext.ux.Andrie.Select.superclass.clearValue.call(this);
		this.clearAllSelect.call(this);
	},

	clearAllSelect : function() {
		if (this.view == null) {
			return;
		}
		this.valueArray = [];
		var nodes = Ext.apply([], this.view.getSelectedNodes());
		for (var i = 0, len = nodes.length; i < len; i++) {
			this.view.deselect(nodes[i], true);
		}
	},

	reset : function() {
		var nodes = Ext.apply([], this.view.getSelectedNodes());
		for (var i = 0, len = nodes.length; i < len; i++) {
			this.view.deselect(nodes[i], true);
		}
		Ext.ux.Andrie.Select.superclass.reset.call(this);
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

	initList : function() {
		if (!this.list) {
			var cls = 'x-combo-list';
			this.list = Artery.pwin.Ext.ux.Andrie.Select.prototype.createList({field : this, cls : cls});
			this.list.setZIndex(20000);
			var lw = this.listWidth
					|| Math.max(this.wrap.getWidth(), this.minListWidth);
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

			if (this.pageSize) {
				this.footer = this.list.createChild({
							cls : cls + '-ft'
						});
				this.pageTb = new Ext.PagingToolbar({
							store : this.store,
							pageSize : this.pageSize,
							renderTo : this.footer
						});
				this.assetHeight += this.footer.getHeight();
			}

			if (!this.tpl) {
				this.tpl = '<tpl for="."><div class="' + cls + '-item">{'
						+ this.displayField + '}</div></tpl>';
			}

			/**
			 * The {@link Ext.DataView DataView} used to display the ComboBox's
			 * options.
			 * 
			 * @type Ext.DataView
			 */
			this.view = Artery.pwin.Ext.ux.Andrie.Select.prototype.createDataView({field : this, cls : cls});

			this.view.on('click', this.onViewClick, this);
			// ANDRIE
			this.view.on('beforeClick', this.onViewBeforeClick, this);
			// END
			//this.view.getEl().setStyle('padding-bottom','15px');
			
			this.bindStore(this.store, true);
			if (this.valueArray.length) {
				this.selectByValue(this.valueArray);
			}

			if (this.resizable) {
				this.resizer = new Ext.Resizable(this.list, {
							pinned : true,
							handles : 'se'
						});
				this.resizer.on('resize', function(r, w, h) {
							this.maxHeight = h - this.handleHeight
									- this.list.getFrameWidth('tb')
									- this.assetHeight;
							this.listWidth = w;
							this.innerList.setWidth(w
									- this.list.getFrameWidth('lr'));
							this.restrictHeight();
						}, this);
				this[this.pageSize ? 'footer' : 'innerList'].setStyle(
						'margin-bottom', this.handleHeight + 'px');
			}
		}
	},

	// private
	onViewOver : function(e, t) {
		if (this.inKeyMode) { // prevent key nav and mouse over conflicts
			return;
		}
		// ANDRIE
		/*
		 * var item = this.view.findItemFromChild(t); if(item){ var index =
		 * this.view.indexOf(item); this.select(index, false); }
		 */
		// END
	},

	// private
	initEvents : function() {
		Ext.form.ComboBox.superclass.initEvents.call(this);
		
		this.keyNav = new Ext.KeyNav(this.el, {
					"up" : function(e) {
						this.inKeyMode = true;
						this.hoverPrev();
					},

					"down" : function(e) {
						if (!this.isExpanded()) {
							this.onTriggerClick();
						} else {
							this.inKeyMode = true;
							this.hoverNext();
						}
					},

					"enter" : function(e) {
						if (this.isExpanded()) {
							this.inKeyMode = true;
							this.selectByEnter = true;
							// modify
							if (this.view.lastItem == null) {
								e.stopEvent();
								return;
							}
							var hoveredIndex = this.view
									.indexOf(this.view.lastItem);
							this.onViewBeforeClick(this.view, hoveredIndex,
									this.view.getNode(hoveredIndex), e);
							this.onViewClick(this.view, hoveredIndex, this.view
											.getNode(hoveredIndex), e);
						} else {
							this.onSingleBlur();
						}
						this.blur();
						this.focus();
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
							return Ext.KeyNav.prototype.doRelay.apply(this,
									arguments);
						}
						// ANDRIE
						if (hname == 'enter' || this.scope.isExpanded()) {
							return Ext.KeyNav.prototype.doRelay.apply(this,
									arguments);
						}
						// END
						return true;
					},

					forceKeyDown : true
				});
		
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == 'local' ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		if (this.typeAhead) {
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		if (this.editable !== false) {
			this.el.on("keyup", this.onKeyUp, this);
		}
		if (this.forceSelection) {
			this.on('blur', this.doForce, this);
		}
		// ANDRIE
		else if (!this.multiSelect) {
			this.on('focus', this.onSingleFocus, this);
			this.on('blur', this.onSingleBlur, this);
		}
		//this.on('change', this.onChange, this);
		// END
		
		this.initClearValueTaskEvent();
	},
	
	initClearValueTaskEvent : Artery.plugin.TwinTriggerField.prototype.initClearValueTaskEvent,
	
	onBlur : function() {
		this.beforeBlur();
		if (!Ext.isOpera && this.focusClass) { // don't touch in Opera
			this.el.removeClass(this.focusClass);
		}
		this.hasFocus = false;
		if (this.validationEvent !== false && this.validateOnBlur
				&& this.validationEvent != "blur") {
			this.validate();
		}
		var v = this.getValue();
		if (String(v) !== String(this.startValue)) {
			// modify onchange事件只在setValue时触发，blur时不触发
			// this.fireEvent('change', this, v, this.startValue);
		}
		//this.fireEvent("blur", this);
	},

	onChange : function() {
		if (!this.clearTrigger) {
			return;
		}
		if (this.getValue() != '') {
			this.triggers[0].show();
		} else {
			this.triggers[0].hide();
		}
	},

	// private
	selectFirst : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			this.select(0);
		}
	},

	// private
	selectLast : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			this.select(ct);
		}
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
		if(!node)
			return;
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
			this.hover(ct);
		}
	},

	collapse : function() {
		this.hoverOut();
		Ext.ux.Andrie.Select.superclass.collapse.call(this);
	},
	
		// 在事件发生在本组件以外时，关闭弹出层
    collapseIf : function(e){
    	if(!e){
    		this.collapse();
    		return ;
    	}
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

	expand : function() {
		if(this.isExpanded() || !this.hasFocus || this.isDisplayType() || this.disabled || this.readOnly){
            return;
        }
        this.restrictLayer();
        this.fireEvent('expand', this);
	},
	
	// 显示弹出层并调整高度
	restrictLayer: function(){
		this.restrictLayerTask.delay(10, this.restrictLayerDirect, this, []);
	},
	
	restrictLayerDirect: function(){
		this.list.show();
		var layerWidth = Math.max(this.wrap.getWidth(), this.minLayerWidth);
		var pos = this.getPosInParent(this.wrap);
		// ha为浏览器上部可视高度
        var ha = pos[1]-Artery.pwin.Ext.getBody().getScroll().top;
        // hb为浏览器下部可视高度
        var hb = Artery.pwin.Ext.lib.Dom.getViewHeight()-ha-this.wrap.getHeight();
        
        var layerPos = null;
        if((ha>hb) && (this.layerHeight>(hb-5))){
        	// 在上面显示layer
        	layerPos = [pos[0],(pos[1]-this.list.getHeight())];
        }else{
        	// 在下面显示layer
        	layerPos = [pos[0],(pos[1]+this.wrap.getHeight())];
        }
        this.list.beginUpdate();
        this.innerList.setWidth(layerWidth);
        this.list.endUpdate();
        this.list.setWidth(layerWidth);
        this.list.setXY(layerPos);
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
	onSelect : function(record, index) {
		if (this.fireEvent('beforeselect', this, record.data[this.valueField || this.displayField], this.getValue()) !== false) {
			this.addValue(record.data[this.valueField || this.displayField]);
			this.fireEvent('select', this, record, index);
			if (!this.multiSelect) {
				this.collapse();
			}
		}
	},

	/**
	 * Add a value if this is a multi select
	 * 
	 * @param {String}
	 *            value The value to match
	 */
	addValue : function(v) {
		v = String(v);
		if (!this.multiSelect) {
			this.setValue(v, true);
			return;
		}
		if (this.valueArray.indexOf(v) == -1) {
			this.valueArray.push(v);
			this.setValue(this.valueArray, true);
		}
	},

	/**
	 * Remove a value
	 * 
	 * @param {String}
	 *            value The value to match
	 */
	removeValue : function(v) {
		v = String(v);
		if (this.list) {
			var r = this.findRecord(this.valueField, v);
			this.deselect(this.store.indexOf(r));
		}
		this.valueArray.remove(v);
		this.setValue(this.valueArray, true);
	},

	/**
	 * Sets the specified value for the field. The value can be an Array or a
	 * String (optionally with separating commas) If the value finds a match,
	 * the corresponding record text will be displayed in the field.
	 * 
	 * 只负责更新value，不负责更新valueText
	 * 
	 * @param {Mixed}
	 *            value The value to match
	 */
	setValue : function(v, fireChangeEvent) {
		var resultRaw = [];
		if (!(v instanceof Array)) {
			v = [v];
		}
		if (!this.multiSelect && v instanceof Array) {
			v = v.slice(0, 1);
		}
		// modify
		if (v.length == 1 && Ext.isEmpty(v[0])) {
			v = [];
		}
		for (var i = 0, len = v.length; i < len; i++) {
			var value = v[i];
			resultRaw.push(value);
		}
		var separator = Artery.getMultiSelectSeparator();
		v = resultRaw.join(separator);

		this.valueArray = resultRaw;
		if (this.hiddenField) {
			this.hiddenField.value = v;
		}

		this.value = v;
		this.reSelectValue();
		//alert(this.oldValueArray + ":" + this.valueArray);
		if (this.oldValueArray + "" != this.valueArray + "") {
			var old = this.oldValueArray;
			if(this.valueArray == null){
				this.oldValueArray = null;
			}else{
				this.oldValueArray = Ext.apply([], this.valueArray);
			}
			//alert(this.oldValueArray + "*" + this.valueArray);
			//判断是否初始设置值，初始设置值时不触发onChange事件
			if(!Ext.isTrue(this.initSte) && fireChangeEvent == true){
				var separator = Artery.getMultiSelectSeparator();
				this.fireEvent('change', this, this.value,old == null?"":old.join(separator));
			}
		}
		if (this.history && !this.multiSelect && this.mode == 'local') {
			this.addHistory(this.getRawValue());
		}
	},

	reSelectValue : function() {
		if (this.view) {
			this.view.clearSelections();
			this.selectByValue(this.valueArray);
		}

	},

	// private
	onLoad : function() {
		Artery.plugin.PopupLayerMgr.hideAll();

		if (!this.hasFocus) {
			return;
		}
		if (this.store.getCount() > 0) {
			this.expand();
			this.restrictHeight();
			if (this.lastQuery == this.allQuery) {
				if (this.editable) {
					this.el.dom.focus();
				}

				// ANDRIE
				this.selectByValue(this.value, true);
				/*
				 * if(!this.selectByValue(this.value, true)){ this.select(0,
				 * true); }
				 */
				// END
			} else {
				this.selectNext();
				if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE
						&& this.lastKey != Ext.EventObject.DELETE) {
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		} else {
			this.onEmptyResults();
		}
		// this.el.focus();
	},
	
	// private
    restrictHeight : function(){
        if (!this.list) {
        	return;
        }
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var pad = this.list.getFrameWidth('tb')+(this.resizable?this.handleHeight:0)+this.assetHeight;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        var ha = this.getPosition()[1]-Ext.getBody().getScroll().top;
        var hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height;
        var space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;
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
        this.list.setHeight(h+pad);
       // this.list.alignTo(this.wrap, this.listAlign);
        this.list.endUpdate();
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
				var r = this.findRecord(this.valueField || this.displayField,
						value);
				if (r) {
					this.select(this.store.indexOf(r), scrollIntoView);
					result.push(value);
				}
			}
			var separator = Artery.getMultiSelectSeparator();
			return result.join(separator);
		}
		return false;
	},

	// private
	onViewBeforeClick : function(vw, index, node, e) {
		this.preClickSelections = this.view.getSelectedIndexes();
	},

	// private
	onViewClick : function(vw, index, node, e) {
		// from the old doFocus argument; don't really know its use
		// 在设值之前先focus，使设值之后的光标位置输入框的最后；否则先focus后设置光标一直在输入框的最前面
		if (vw !== false) {
			this.el.focus();
		}
		if (typeof index != 'undefined') {
			var arrayIndex = this.preClickSelections.indexOf(index);
			if (arrayIndex != -1 && this.multiSelect) {
				this.removeValue(this.store.getAt(index).data[this.valueField
						|| this.displayField]);
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
			this.validate();
		}
		if (vw !== false) {
			// modify
			this.hover(index)
		}
		//解决可编辑列表的单值代码偶尔会设置不上的问题
		if (this.gridEditor && !this.multiSelect) {
			this.gridEditor.hide();
		}
	},

	validateValue : function(value) {
		this.clearInvalid();
		if (!Ext.ux.Andrie.Select.superclass.validateValue.call(this, value)) {
			return false;
		}
		if (this.valueArray.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if (this.valueArray.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		return true;
	},

	clearLastVRV : function() {
		delete this.lastVRV_V;
		delete this.lastVRV_Result;
		delete this.lastVRV_M;
	},

	validateRightValue : function(value){
		//展开提示时，不验证
		if(this.isExpanded()){
			this.clearLastVRV();
			return true;
		}
		
		if (Ext.isTrue(this.isCallByVRV)) {
			// 防止在此方法中调用setValue()方法时再次触发此方法
			return this.lastVRV_Result;
		}
		if (this.lastVRV_V && this.lastVRV_V == value){
			if (!this.lastVRV_Result) {
				this.markInvalid(this.lastVRV_M);
			}
			return this.lastVRV_Result;
		}
		this.lastVRV_V = value;

		// 最后一个字符是分隔符的时候，不进行验证，等待用户继续输入后再验证
		var lc = value.substr(value.length -1);
		if (lc==',' || lc == ';' || lc == "；") {
			return;
		}

		var searchValue = value.replace(/；/g, Artery.getMultiSelectSeparator());
		var params = Artery.getParams(this.lastReloadParams, this);
		
		var methodParams = {
			"formid" : this.formId,
			"itemid" : Artery.getEventId(this),
			"itemType" : "faCode",
			"codeType" : this.codeType,
			"value" : searchValue
		}
		Ext.apply(params,methodParams);
		
		var isValid = true;
		// 提交请求并调用回调函数
		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic&method=isRightValue",
			success : function(response, options) {
				var res = Ext.decode(response.responseText);
				if(res.value!==undefined && res.value!= this.getValue() && this.setValue){
					this.isCallByVRV = true;
					this.setValue(res.value, true);
					delete this.isCallByVRV;
				}
				if(!res.success===true){
					isValid = false;
					this.isCallByVRV = true;
					this.setValueText(searchValue);
					delete this.isCallByVRV;
					this.lastVRV_M = res.message;
					this.markInvalid(res.message);
				}
			},
			// 参数
			syn : false,
			params : params,
			scope : this
		});
		this.lastVRV_Result = isValid;
		return isValid;
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

	// ability to delete value with keyboard
	doForce : function() {
		if (this.el.dom.value.length > 0) {
			if (this.el.dom.value == this.emptyText) {
				this.clearValue(false);
			} else {
				this.el.dom.value = this.lastSelectionText === undefined
						? ''
						: this.lastSelectionText;
				this.applyEmptyText();
			}
		}
	},

	// private
	onSingleBlur : function() {
		var r = this.findRecord(this.displayField, this.getRawValue());
		if (r) {
			this.select(this.store.indexOf(r));
			return;
		}
	//失去焦点时不清空内容	
//		if (String(this.oldValue) != String(this.getRawValue())) {
//			this.setValue(this.getRawValue());
//			this.fireEvent('change', this, this.oldValue, this.getRawValue());
//		}
//		this.oldValue = String(this.getRawValue());
	},

	// private
	onSingleFocus : function() {
		this.oldValue = this.getRawValue();
	},

	addHistory : function(value) {
		if (!value.length) {
			return;
		}
		var r = this.findRecord(this.displayField, value);
		if (r) {
			this.store.remove(r);
		} else {
			var o = this.store.reader.readRecords([[value]]);
			r = o.records[0];
		}
		this.store.clearFilter();
		this.store.insert(0, r);
		this.pruneHistory();
	},

	// private
	pruneHistory : function() {
		if (this.historyMaxLength == 0) {
			return;
		}
		if (this.store.getCount() > this.historyMaxLength) {
			var overflow = this.store.getRange(this.historyMaxLength,
					this.store.getCount());
			for (var i = 0, len = overflow.length; i < len; i++) {
				this.store.remove(overflow[i]);
			}
		}
	}

});
Ext.reg('select', Ext.ux.Andrie.Select);