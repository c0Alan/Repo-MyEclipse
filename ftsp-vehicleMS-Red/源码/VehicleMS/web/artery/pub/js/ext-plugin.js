
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
						'<tr style="{fstyle}">{fcells}</tr>', '</tpl>',
						'<tr class="x-grid3-hd-row">{cells}</tr>', "</table>"),

				fcell : new Ext.Template(
						'<td style="border-bottom:1px solid #DDDDDD;"><div class="filter-input" style="padding:3px;{fstyle}">',
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
					cb[cb.length] = ct.apply(p);

					// apply filter cell style,show or not
					p.fstyle = this.getFColumnStyle(i);
					fb[fb.length] = ft.apply(p);
				}
				return ts.header.apply({
							cells : cb.join(""),
							tstyle : 'width:' + this.getTotalWidth() + ';',
							fcells : fb.join(""),
							isFilter : this.isFilter()
						});
			},

			// private
			getFColumnStyle : function(col) {
				var style = 'width:100%;';
				if (this.cm.isHidden(col)) {
					style += 'display:none;';
				}
				if (typeof this.cm.config[col].filter == "undefined"
						|| this.cm.config[col].filter == false) {
					style += 'visibility :hidden;';
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
				if (fg.pageCount != 0) {
					this.ds.load({
								params : {
									start : 0,
									limit : fg.pageCount
								}
							});
				} else {
					this.ds.load();
				}
			},
			// private
			convert : function(val) {
				if (Ext.isEmpty(val)) {
					return "";
				}
				return val.replace(/;/, "$sem").replace(/:/, "$col");
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
						})

				// init search field
				this.mainHd.select(".filter-input").each(
						function(el, cmp, idx) {
							var field = new Ext.tusc.FilterTriggerField();
							gw.filters.add(gw.getFColumnName(idx), field);
							field.onTriggerClick = function() {
								this.el.dom.value = "";
								this.hideTrigger();
								gw.doFilter();

							};
							field.render(el.dom);
							field.on("specialkey", function(tfield, e) {
										if (e.getKey() == Ext.EventObject.ENTER) {
											if (!Ext.isEmpty(tfield.getValue())) {
												tfield.showTrigger();
											} else {
												tfield.hideTrigger();
											}
											gw.doFilter();

										} else if (e.getKey() == Ext.EventObject.ESC) {
											tfield.onTriggerClick();
										}
									});

							if (!el.isDisplayed() || !el.isVisible()) {
								field.hide();
							}
						})
			},
			cleanAllFilter : function() {
				this.filters.each(function(item, idx, length) {
							item.el.dom.value = "";
							item.hideTrigger();

						})
				this.doFilter();
			},
			cleanFilter : function(name) {
				var item = this.filters.get(name);
				if (item != null) {
					item.onTriggerClick();
				}
			},
			getFilterParams : function() {
				var p = "";
				this.filters.each(function(item, idx, length) {
							var el = item.el;
							if (!Ext.isEmpty(el.dom.value)) {
								p += this.getFColumnName(idx) + ":"
										+ this.convert(el.dom.value) + ";";
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
Ext.tusc.FilterTriggerField = Ext.extend(Ext.form.TriggerField, {

	triggerClass : 'x-form-clear-trigger',

	hideTrigger : true,

	defaultAutoCreate : {
		tag : "input",
		type : "text",
		cls : 'filter-input-field',
		style : "width:100%;margin:0;",
		autocomplete : "off"
	},

	onRender : function(ct, position) {

		Ext.form.TriggerField.superclass.onRender.call(this, ct, position);
		this.wrap = this.el.wrap({
					cls : "x-form-field-wrap"
				});
		this.trigger = this.wrap.createChild(this.triggerConfig || {
			tag : "img",
			src : Ext.BLANK_IMAGE_URL,
			cls : "x-form-trigger " + this.triggerClass,
			style : 'position:absolute;bottom:0;right:0;border-left:1px solid #B5B8C8;'
		});
		if (this.hideTrigger) {
			this.hideTrigger();
		}
		this.initTrigger();
	},

	hideTrigger : function() {
		this.trigger.dom.style.visibility='hidden';
		this.el.dom.style.marginRight = "0px";
	},

	showTrigger : function() {
		this.trigger.dom.style.visibility='visible';
		this.el.dom.style.marginRight = "18px";
	}
});

/**
 * Ext.tusc.TableLayout
 * 
 * @author baon
 * @date 14/05/2008
 * 
 * @class Ext.tusc.TableLayout
 * @extends Ext.layout.TableLayout
 */
Ext.tusc.TableLayout = Ext.extend(Ext.layout.TableLayout, {

			onLayout : function(ct, target) {
				var cs = ct.items.items, len = cs.length, c, i;

				if (!this.table) {
					target.addClass('x-table-layout-ct');

					this.table = target.createChild({
								tag : 'table',
								cls : 'x-table-layout',
								cellspacing : 5,
								style : 'width:100%;',
								cn : {
									tag : 'tbody'
								}
							}, null, true);

					this.renderAll(ct, target);
				}
			},

			// add set td's width method
			getNextCell : function(c) {
				var td = Ext.tusc.TableLayout.superclass.getNextCell.call(this,
						c);
				td.style.width = this.getTdWidth(c.colspan) + "%";
				return td;
			},

			// private,get the td's width by columns
			getTdWidth : function(colspan) {
				var width = 100 / parseInt(this.columns);
				if (!Ext.isEmpty(colspan)) {
					width = width * colspan;
				}
				return width;
			}

		});

// register layout
Ext.Container.LAYOUTS['tusctable'] = Ext.tusc.TableLayout;
