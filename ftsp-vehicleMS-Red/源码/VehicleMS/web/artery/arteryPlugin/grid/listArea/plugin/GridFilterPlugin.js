/**
 * Ext.tusc.plugins.FilterGrid plugin for Ext.grid.GridPanel
 * 
 * @author baon
 * @date 08/05/2008
 * 
 * @class Ext.tusc.plugins.FilterGrid
 * @extends Ext.util.Observable
 */
// css
// document.write("<style>.filter-input{border:1px solid #AFAFAF;}</style>");
Ext.tusc.plugins.FilterGrid = function(config) {
	Ext.tusc.plugins.FilterGrid.superclass.constructor.call(this, config);

	Ext.apply(this, config);
};

// plugin code
Ext.extend(Ext.tusc.plugins.FilterGrid, Ext.util.Observable, {
	/**
	 * The split page count number,default 0 is not pass the split page params
	 * 
	 * @type Number
	 */
	pageCount : 0,

	init : function(gridPanel) {
		var gp = gridPanel;
		var fg = this;

		// viewCfg
		var viewConfig = {

			// filter items
			filters : new Ext.util.MixedCollection(),

			templates : {
				header : new Ext.XTemplate(
						'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
						'<tpl if="isFilter == true">',
						'<tr class="x-grid3-hd-filter" style="{fstyle}">{fcells}</tr>',
						'</tpl>', '<tr class="x-grid3-hd-row">{cells}</tr>',
						"</table>"),

				fcell : new Ext.Template(
						'<td class="x-grid3-td-{id} {css}" style="border-bottom:1px solid #DDDDDD;{style}"><div class="filter-input" style="padding:3px;{fstyle}">',
						"</div></td>")
			},

			renderHeaders : function() {
				var cm = this.cm, ts = this.templates;
				var ct = ts.hcell;
				var ft = ts.fcell;

				var cb = [], sb = [], p = {}, fb = [];

				for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
					p.id = cm.getColumnId(i);
					p.value = cm.getColumnHeader(i) || "";
					p.style = this.getColumnStyle(i, true);
					p.tooltip = this.getColumnTooltip(i);
					if (cm.config[i].align == 'right') {
						p.istyle = 'padding-right:16px';
					} else {
						delete p.istyle;
					}
					p.css = this.getColumnCss(i, false);
					cb[cb.length] = ct.apply(p);

					// apply filter cell style,show or not
					p.fstyle = this.getFColumnStyle(i);
					p.css = this.getColumnCss(i, true);
					fb[fb.length] = ft.apply(p);
				}
				return ts.header.apply({
							cells : cb.join(""),
							tstyle : 'width:' + this.getTotalWidth() + ';',
							fcells : fb.join(""),
							isFilter : this.isFilter()
						});
			},

			getColumnCss : function(col, fcol) {
				if (!fcol && Ext.isTrue(this.cm.config[col].isFix)) {
					return "x-grid-hd-fix";
				}
				if (fcol && Ext.isTrue(this.cm.config[col].isFix)) {
					return "x-grid-fhd-fix";
				}
				return "";
			},

			// private
			getFColumnStyle : function(col) {
				var style = 'width:100%;';
				if (this.cm.isHidden(col)) {
					style += 'display:none;';
				}
				if (this.cm.config[col].isFix) {
					style += 'height:25;z-index:9999;background-color:#F9F9F9;';
				}
				return style;
			},

			isFilter : function() {
				var cm = this.cm;
				for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
					if (typeof cm.config[i].filter != "undefined"
							&& cm.config[i].filter == true) {
						return true;
					}
				}
				return false;
			},
			doFilter : function() {
				var o = {};
				if(this.ds.lastOptions && this.ds.lastOptions.params){
					Ext.apply(o,this.ds.lastOptions.params);
				}
				o.start = 0;
				if (fg.pageCount != 0) {
					o.limit = fg.pageCount;
				}
				this.ds.load({params:o});
			},
			// private
			convert : function(item) {
				var val = item.getValue();
				if (Ext.isEmpty(val)) {
					return "";
				}
				val = val.replace(/;/, "$sem").replace(/:/, "$col");
				if(item.store){
					return "~" + val + "##" + item.el.dom.value;
				}else{
					return val;
				}
			},
			// private
			initElements : function() {
				var gw = this;
				var E = Ext.Element;

				var el = this.grid.getGridEl().dom.firstChild;
				var cs = el.childNodes;

				this.el = new E(el);

				this.mainWrap = new E(cs[0]);
				this.mainHd = new E(this.mainWrap.dom.firstChild);

				if (this.grid.hideHeaders) {
					this.mainHd.setDisplayed(false);
				}

				this.innerHd = this.mainHd.dom.firstChild;
				this.scroller = new E(this.mainWrap.dom.childNodes[1]);
				if (this.forceFit) {
					this.scroller.setStyle('overflow-x', 'hidden');
				}
				this.mainBody = new E(this.scroller.dom.firstChild);

				this.focusEl = new E(this.scroller.dom.childNodes[1]);
				this.focusEl.swallowEvent("click", true);

				this.resizeMarker = new E(cs[1]);
				this.resizeProxy = new E(cs[2]);

				// set parameter
				this.ds.on("beforeload", function(ds, options) {
					var p = gw.getFilterParams();
					if (options.params == null) {
						options.params = {};
					}
					Ext.apply(options.params, {
								filter : p
							})
						// alert(options.params.filter);
					})

				// init search field
				this.mainHd.select(".filter-input").each(
						function(el, cmp, idx) {
							var field, cd;
							if(gp.cdata){
								cd = gp.cdata[gw.cm.config[idx].dataIndex];
							}
							if (cd && cd.data) {
								field = new Ext.tusc.FilterComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['name', 'code'],
												data : eval("gp.cdata."
														+ gw.cm.config[idx].dataIndex
														+ ".data")
											}),
									displayField : 'name',
									valueField : 'code',
									mode : 'local',
									triggerAction : 'all'
								});
								field.on("select",
										function(field, record, idx) {
											gw.doFilter();
										}, this)
								field.onTrigger1Click = function() {
									this.clearValue();
									this.getTrigger(0).hide();
									gw.doFilter();
								}
							} else {
								field = new Ext.tusc.FilterTextField({
									emptyText: gw.cm.config[idx].filterEmptyText
								});
								
								field.on("specialkey", function(tfield, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										gw.doFilter();
									} else if (e.getKey() == Ext.EventObject.ESC) {
										el.dom.value = "";
									    gw.doFilter();
									}
								});
							}
							// 设置过滤默认值
							if(cd && cd.filterDefault!==undefined){
								field.setValue(cd.filterDefault);
							}
							gw.filters.add(gw.getFColumnName(idx), field);
							field.render(el.dom);

							if (!el.isDisplayed()
									|| !el.isVisible()
									|| (typeof gw.cm.config[idx].filter == "undefined" || gw.cm.config[idx].filter == false)) {
								field.hide();
							}

						})
			},
			
			// reloadList为true，则重新加载列表，默认为true
			cleanAllFilter : function(reloadList) {
				this.filters.each(function(item, idx, length) {
					item.setValue();
					if(item.getTrigger){
						item.getTrigger(0).hide();
					}
				});
				if(reloadList!==false){
					this.doFilter();
				}
			},
			cleanFilter : function(name) {
				var item = this.filters.get(name);
				if (item != null) {
					item.onTriggerClick();
				}
			},
			getFilterParams : function() {
				var gw = this;
				var p = "";
				this.filters.each(function(item, idx, length) {
							var el = item.el;
							if (!Ext.isEmpty(el.dom.value)) {
								if(el.dom.value != gw.cm.config[idx].filterEmptyText)
								p += this.getFColumnName(idx) + ":"
										+ this.convert(item) + ";";
							}
						}, this)
				return p;
			},

			// private
			getFColumnName : function(idx) {
				var name = this.cm.getDataIndex(idx);
				return typeof name == 'undefined'
						? this.ds.fields.get(idx).name
						: name;
			},
			updateSortIcon : function(col, dir) {
				var sc = this.sortClasses;
				var hds = this.mainHd.select('td.x-grid3-hd').removeClass(sc);
				hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
			},
			// private
			updateColumnHidden : function(col, hidden) {
				var tw = this.getTotalWidth();

				this.innerHd.firstChild.firstChild.style.width = tw;

				var display = hidden ? 'none' : '';

				var hd = this.getHeaderCell(col);
				hd.style.display = display;

				// set title column style
				var hds = this.getSecondHeaderCell(col);
				hds.style.display = display;

				var ns = this.getRows();
				for (var i = 0, len = ns.length; i < len; i++) {
					ns[i].style.width = tw;
					ns[i].firstChild.style.width = tw;
					ns[i].firstChild.rows[0].childNodes[col].style.display = display;
				}

				this.onColumnHiddenUpdated(col, hidden, tw);

				delete this.lastViewWidth; // force recalc
				this.layout();
			},
			// private
			getSecondHeaderCell : function(index) {
				return this.mainHd.select('td.x-grid3-hd').item(index).dom
			},
			// private
			updateAllColumnWidths : function() {
				var tw = this.getTotalWidth();
				var clen = this.cm.getColumnCount();
				var ws = [];
				for (var i = 0; i < clen; i++) {
					ws[i] = this.getColumnWidth(i);
				}

				this.innerHd.firstChild.firstChild.style.width = tw;
				for (var i = 0; i < clen; i++) {
					var hd = this.getHeaderCell(i);
					hd.style.width = ws[i];

					// set title column width
					var hds = this.getSecondHeaderCell(i);
					hds.style.width = ws[i];
				}
				var ns = this.getRows();
				for (var i = 0, len = ns.length; i < len; i++) {
					ns[i].style.width = tw;
					ns[i].firstChild.style.width = tw;
					var row = ns[i].firstChild.rows[0];
					for (var j = 0; j < clen; j++) {
						row.childNodes[j].style.width = ws[j];
					}
				}
				this.onAllColumnWidthsUpdated(ws, tw);
			},

			// private
			updateColumnWidth : function(col, width) {
				var w = this.getColumnWidth(col);
				var tw = this.getTotalWidth();

				this.innerHd.firstChild.firstChild.style.width = tw;
				var hd = this.getHeaderCell(col);
				hd.style.width = w;

				// set title column width
				var hds = this.getSecondHeaderCell(col);
				hds.style.width = w;

				var ns = this.getRows();
				for (var i = 0, len = ns.length; i < len; i++) {
					ns[i].style.width = tw;
					ns[i].firstChild.style.width = tw;
					ns[i].firstChild.rows[0].childNodes[col].style.width = w;
				}

				this.onColumnWidthUpdated(col, w, tw);
			}
		}

		if (gp.viewConfig != null) {
			Ext.apply(viewConfig, gp.viewConfig);
		}

		Ext.apply(gp, {
					viewConfig : viewConfig
				});
	}
});

Ext.extend(Ext.grid.GridView.ColumnDragZone, Ext.grid.HeaderDragZone, {
			handleMouseDown : function(e) {

			},

			callHandleMouseDown : function(e) {
				// Ext.grid.GridView.ColumnDragZone.superclass.handleMouseDown.call(this,
				// e);
			}
		});

/**
 * Ext.tusc.FilterTriggerField for Ext.tusc.plugins.FilterGrid
 * 
 * @author baon
 * @date 12/05/2008
 * 
 * @class Ext.tusc.FilterTriggerField
 * @extends Ext.form.TriggerField
 */
Ext.tusc.FilterTextField = Ext.extend(Ext.form.TextField, {

	defaultAutoCreate : {
		tag : "input",
		type : "text",
		cls : 'filter-input-field',
		style : "width:100%;margin:0px;",
		autocomplete : "off"
	},

	onRender : function(ct, position) {
		Ext.form.TextField.superclass.onRender.call(this, ct, position);
	}

});

/**
 * Ext.tusc.FilterComboBox for Ext.tusc.plugins.FilterGrid
 * 
 * @author baon
 * @date 12/05/2008
 * 
 * @class Ext.tusc.FilterComboBox
 * @extends Ext.form.ComboBox
 */
Ext.tusc.FilterComboBox = Ext.extend(Ext.form.ComboBox, {
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "24",
		style : "width:100%;margin:0px;",
		autocomplete : "off"
	},

	editable : false,

	hideTrigger1 : true,

	trigger1Class : 'x-form-clear-trigger',

	initComponent : function() {
		Ext.tusc.FilterComboBox.superclass.initComponent.call(this);

		this.triggerConfig = {
			tag : 'span',
			cls : 'x-form-twin-triggers',
			style : (Ext.isIE?'margin-bottom:1px;':'') + 'height:100%;position:absolute;bottom:0px;right:0px;',
			cn : [{
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger1Class,
						style : Ext.isIE ? '' : 'height:auto;'
					}, {
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger2Class,
						style : Ext.isIE ? '' : 'height:auto;'
					}]
		};

		this.on("select", function() {
					this.getTrigger(0).show();
				}, this)
	},

	onRender : function(ct, position) {
		Ext.form.TriggerField.superclass.onRender.call(this, ct, position);
		this.wrap = this.el.wrap({
					cls : "x-form-field-wrap",
					style : 'position:relative;'
				});
		this.trigger = this.wrap.createChild(this.triggerConfig || {
			tag : "img",
			vspace : '1',
			src : Ext.BLANK_IMAGE_URL,
			cls : "x-form-trigger " + this.triggerClass,
			style : (Ext.isIE ? '' : 'height:auto;') + 'position:absolute;bottom:0px;right:0px;'
		});
		if (this.hideTrigger) {
			this.trigger.setDisplayed(false);
		}
		this.initTrigger();

		if (this.hiddenName) {
			this.hiddenField = this.el.insertSibling({
						tag : 'input',
						type : 'hidden',
						name : this.hiddenName,
						id : (this.hiddenId || this.hiddenName)
					}, 'before', true);
			this.hiddenField.value = this.hiddenValue !== undefined
					? this.hiddenValue
					: this.value !== undefined ? this.value : '';

			// prevent input submission
			this.el.dom.removeAttribute('name');
		}
		if (Ext.isGecko) {
			this.el.dom.setAttribute('autocomplete', 'off');
		}

		if (!this.lazyInit) {
			this.initList();
		} else {
			this.on('focus', this.initList, this, {
						single : true
					});
		}

		if (!this.editable) {
			this.editable = true;
			this.setEditable(false);
		}
		
		this.el.addClass("x-grid-filter-text");
	},

	getTrigger : function(index) {
		return this.triggers[index];
	},

	initTrigger : function() {
		var ts = this.trigger.select('.x-form-trigger', true);
		this.wrap.setStyle('overflow', 'hidden');
		var triggerField = this;
		ts.each(function(t, all, index) {
					t.hide = function() {
						this.dom.style.display = 'none';
					};
					t.show = function() {
						this.dom.style.display = '';
					};
					var triggerIndex = 'Trigger' + (index + 1);

					if (this['hide' + triggerIndex]) {
						t.dom.style.display = 'none';
					}
					t.on("click", this['on' + triggerIndex + 'Click'], this, {
								preventDefault : true
							});
					t.addClassOnOver('x-form-trigger-over');
					t.addClassOnClick('x-form-trigger-click');
				}, this);
		this.triggers = ts.elements;
	},
	onTrigger2Click : function() {
		if (this.disabled) {
			return;
		}
		if (this.isExpanded()) {
			this.collapse();
			this.el.focus();
		} else {
			this.onFocus({});
			if (this.triggerAction == 'all') {
				this.doQuery(this.allQuery, true);
			} else {
				this.doQuery(this.getRawValue());
			}
			this.el.focus();
		}
	},
	onTrigger1Click : Ext.emptyFn
})
