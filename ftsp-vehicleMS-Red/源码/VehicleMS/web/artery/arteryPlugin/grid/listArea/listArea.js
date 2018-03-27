/**
 * Artery ListCollection component
 * 
 * @author baon
 * @date 20/02/2009
 * 
 */
Artery.ListCollection = function() {
	//grid集合
	var data = new Ext.util.MixedCollection();

	return {
		add : function(key, obj) {
			data.add(key, obj);
		},

		resize : function() {
			data.each(function(item, idx) {
				if (item.autoHeight) {
					item.gridElSize = item.getGridEl().getSize(true);
				}
				item.gridBody.setDisplayed(false);
			}, this);
			data.each(function(item, idx) {
				item.onResize.defer(1, item);
			}, this);
		}
	}
}()
//注册事件
Ext.EventManager.onWindowResize(function() {
	Artery.ListCollection.resize();
}, this)

Ext.override(Ext.grid.GridView, {
	getEditorParent : function() {
		return document.body;
	}
});

/**
 * Artery ListAreaView component
 * 
 * @author baon
 * @date 20/02/2009
 * 
 */
Artery.plugin.ListAreaView = Ext
		.extend(
				Ext.grid.GridView,
				{
					initTemplates : function() {
						var ts = this.templates || {};
						if (!ts.master) {
							ts.master = new Ext.Template(
									'<div class="x-grid3" hidefocus="true">',
									'<div class="x-grid3-viewport">',
									'<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>',
									'<div class="x-grid3-scroller"><div class="x-grid3-body">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
									"</div>",
									'<div class="x-grid3-resize-marker">&#160;</div>',
									'<div class="x-grid3-resize-proxy">&#160;</div>',
									"</div>");
						}

						if (!ts.header) {
							ts.header = new Ext.Template(
									'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
									'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
									"</table>");
						}

						if (!ts.hcell) {
							ts.hcell = new Ext.Template(
									'<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="text-align:left;{style}"><div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" style="{istyle}">',
									this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>'
											: '',
									'{value}<img class="x-grid3-sort-icon" src="',
									Ext.BLANK_IMAGE_URL, '" />', "</div></td>");
						}

						if (!ts.body) {
							ts.body = new Ext.Template('{rows}');
						}

						if (!ts.row) {
							ts.row = new Ext.Template(
									'<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
									'<tbody><tr>{cells}</tr>',
									(this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>'
											: ''), '</tbody></table></div>');
						}

						if (!ts.cell) {
							ts.cell = new Ext.Template(
									'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
									'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
									"</td>");
						}

						for ( var k in ts) {
							var t = ts[k];
							if (t && typeof t.compile == 'function'
									&& !t.compiled) {
								t.disableFormats = true;
								t.compile();
							}
						}

						this.templates = ts;

						this.tdClass = 'x-grid3-cell';
						this.cellSelector = 'td.x-grid3-cell';
						this.hdCls = 'x-grid3-hd';
						this.rowSelector = 'div.x-grid3-row';
						this.colRe = new RegExp("x-grid3-td-([^\\s]+)", "");
					},
					doRender : function(cs, rs, ds, startRow, colCount, stripe) {
						var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
						var tstyle = 'width:' + this.getTotalWidth() + ';';
						// buffers
						var buf = [], cb, c, p = {}, rp = {
							tstyle : tstyle
						}, r;
						for ( var j = 0, len = rs.length; j < len; j++) {
							r = rs[j];
							cb = [];
							var rowIndex = (j + startRow);
							for ( var i = 0; i < colCount; i++) {
								c = cs[i];
								p.id = c.id;
								p.css = i == 0 ? 'x-grid3-cell-first '
										: (i == last ? 'x-grid3-cell-last '
												: '');
								p.attr = p.cellAttr = "";
								if (this.grid.isSum) {
									p.isSum = this.grid.isSum;
									p.isSumTop = this.grid.isSumTop;
								}
								p.value = c.renderer(r.data[c.name], p, r,
										rowIndex, i, ds);
								p.style = c.style;
								if (p.value == undefined || p.value === "")
									p.value = "&#160;";
								if (r.dirty
										&& typeof r.modified[c.name] !== 'undefined') {
									//modify
									//p.css += ' x-grid3-dirty-cell';
								}
								cb[cb.length] = ct.apply(p);
							}
							var alt = [];
							if (stripe && ((rowIndex + 1) % 2 == 0)) {
								alt[0] = "x-grid3-row-alt";
							}
							if (r.dirty) {
								alt[1] = " x-grid3-dirty-row";
							}
							rp.cols = colCount;
							if (this.getRowClass) {
								alt[2] = this.getRowClass(r, rowIndex, rp, ds);
							}
							if (this.grid.isSum && Ext.isTrue(this.grid.isSum)) {
								if (Ext.isTrue(this.grid.isSumTop) && j == 0) {
									alt.push("grid-title-fixed-top");
								} else if (!Ext.isTrue(this.grid.isSumTop)
										&& j == len - 1) {
									alt.push("grid-title-fixed-bottom");
								}
							}
							rp.alt = alt.join(" ");
							rp.cells = cb.join("");

							if (this.grid.tipTpl) {
								var d = {};
								var val;
								for ( var i in r.data) {
									val = r.data[i].value;
									if ((typeof val) == 'string') {
										val = val.replace(/(\r\n|\n)/g, '<br>');
									}
									eval("d." + i + "=val");
								}
								// alert(Ext.encode(d));
								var tip = this.grid.tipTpl.apply(d);
								this.grid.setTip(rowIndex, tip);
							}

							buf[buf.length] = rt.apply(rp);
						}
						return buf.join("");
					},
					// private
					getColumnData : function() {
						// build a map for all the columns
						var cs = [], cm = this.cm, colCount = cm
								.getColumnCount();
						for ( var i = 0; i < colCount; i++) {
							var name = cm.getDataIndex(i);
							cs[i] = {
								name : (typeof name == 'undefined' ? this.ds.fields
										.get(i).name
										: name),
								renderer : cm.getRenderer(i),
								id : cm.getColumnId(i),
								style : this.getColumnStyle(i),
								columnStyle : this.getColumnStyle(i),
								grid : this.grid
							};
						}
						return cs;
					},
					onCellSelect : function(row, col) {
						var r = this.grid.store.getAt(row);
						if (r == null) {
							return;
						}
						var field = this.grid.colModel.getDataIndex(col);
						if (field == null) {
							return;
						}
						var data = r.data[field];
						if (data == null) {
							return;
						}
						var opers = data.opers;
						if (opers == null || opers.length == 0) {
							var cell = this.getCell(row, col);
							if (cell) {
								this.fly(cell).addClass("x-grid3-cell-selected");
								Ext.get(cell).scrollIntoView(this.scroller);
							}
						}
					},
					layout : function() {
						if (!this.mainBody) {
							return; // not rendered
				}
				var g = this.grid;
				g.gridBody.setDisplayed(false);
				var c = g.getGridEl();
				c.setStyle("width", "");
				var csize = c.getSize(true);
				if (g.gridElSize) {
					csize.height = g.gridElSize.height;
				}
				//adjust size
				csize.width = csize.width - 1;
				csize.height = csize.height - 1;

				var vw = csize.width;
				//modify
				g.gridBody.setDisplayed(true);

				if (vw < 20 || csize.height < 20) { // display: none?
					return;
				}
				if (g.autoHeight) {
					this.scroller.dom.style.overflow = 'visible';
				} else {
					//this.el.setSize(csize.width, csize.height);

					var hdHeight = this.mainHd.getHeight();
					var vh = csize.height - (hdHeight);
					this.scroller.setSize(vw, vh);
					if (this.innerHd) {
						this.innerHd.style.width = (vw) + 'px';
					}
				}
				if (this.forceFit) {
					if (this.lastViewWidth != vw) {
						this.fitColumns(false, false);
						this.lastViewWidth = vw;
					}
				} else {
					this.autoExpand();
					this.syncHeaderScroll();
				}
				this.onLayout(vw, vh);
			},
			focusRow : function(row) {
				//this.focusCell(row, 0, false);
				}
				})
/**
 * Modify Record
 * 
 * @author baon
 * @date 10/10/2008
 * 
 * @class Ext.tusc.Store
 * @extends Ext.data.Store
 */
Ext.override(Ext.data.Record, {
	set : function(name, value) {
		var v1 = this.data[name];
		if (typeof (v1) == 'object') {
			v1 = Ext.encode(v1);
		}
		var v2 = value;
		if (typeof (v2) == 'object') {
			v2 = Ext.encode(v2);
		}
		if (String(v1) == String(v2)) {
			return;
		}
		this.dirty = true;
		if (!this.modified) {
			this.modified = {};
		}
		if (typeof this.modified[name] == 'undefined') {
			this.modified[name] = this.data[name];
		}
		this.data[name] = value;
		if (!this.editing && this.store) {
			this.store.afterEdit(this);
		}
	}
})
/**
 * 扩展JsonReader，实现行事件的读取
 */
Artery.plugin.JsonReader = Ext.extend(Ext.data.JsonReader, {

	extractValues : function(data, items, len) {
		var f, values = {};
		for ( var j = 0; j < len; j++) {
			f = items[j];
			var v = this.ef[j](data);
			values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue,
					data);
		}
		// 行双击事件
		if (data.rowdbclick) {
			values["rowdbclick"] = data.rowdbclick;
		}
		// 行双击连接到
		if (data.rowdblinkto) {
			values["rowdblinkto"] = data.rowdblinkto;
		}
		// 行单击事件
		if (data.rowclick) {
			values["rowclick"] = data.rowclick;
		}
		// 行单击链接到
		if (data.rowlinkto) {
			values["rowlinkto"] = data.rowlinkto;
		}
		return values;
	}
});

/**
 * Artery Grid Store
 * 
 * @author baon
 * @date 10/10/2008
 * 
 * @class Ext.tusc.Store
 * @extends Ext.data.Store
 */
Artery.plugin.ListAreaStore = Ext.extend(Ext.data.Store, {
	// 初始化数据
	initData : null,

	load : function(options) {
		if (this.initData != null) {
			var result = this.reader.readRecords(this.initData);
			this.loadRecords(result, options, true);
			this.initData = null;
			return true;
		}
		options = options || {};
		if (this.fireEvent("beforeload", this, options) !== false) {
			this.storeOptions(options);
			var p = Ext.apply(options.params || {}, this.baseParams);
			if (this.sortInfo && this.remoteSort) {
				var pn = this.paramNames;
				p[pn["sort"]] = this.sortInfo.field;
				p[pn["dir"]] = this.sortInfo.direction;
			}
			this.proxy.doRequest("read", null, p, this.reader,
					this.loadRecords, this, options);
			return true;
		} else {
			return false;
		}
	},
	removeValuefromArray:function(array,value){
		var res = array;
		if(array && array.length>0){
			res=[]
			for(var i=0;i<array.length;i++){
				if(array[i]!=value)
					res.push(array[i])
			}
		}
		return res;
	},
	//调用删除时,需要将选中的checkbox的value从参数中移除
	removeCheckParamWhenDelete:function(record){
	    for(var d in record.data){
	    	d = record.data[d];
	    	var p = Artery.get(this.gridId).cdata[d.id];
			if(p){
				if(p.checkbox || p.radio){
					Artery.get(this.gridId).cdata[d.id].cparam.params = this.removeValuefromArray(Artery.get(this.gridId).cdata[d.id].cparam.params,d.value);
					Artery.get(this.gridId).cdata[d.id].cparam.removeParams = this.removeValuefromArray(Artery.get(this.gridId).cdata[d.id].cparam.removeParams,d.value);
				}
			}
	   }
	},
    remove : function(record){
        var index = this.data.indexOf(record);
        if(index > -1){
            this.data.removeAt(index);
            if(this.pruneModifiedRecords){
                this.modified.remove(record);
            }
            if(this.snapshot){
                this.snapshot.remove(record);
            }
			this.removeCheckParamWhenDelete(record);
            this.fireEvent('remove', this, record, index);
        }
    },
    
//    removeAt : function(index){
//        this.remove(this.getAt(index));
//    },

//    insert : function(index, records){
//        records = [].concat(records);
//        for(var i = 0, len = records.length; i < len; i++){
//            this.data.insert(index, records[i]);
//            records[i].join(this);
//        }
//        this.fireEvent('add', this, records, index);
//    },
    
	// 在排序时，自动跳转到第一页
	sort : function(fieldName, dir) {
		var f = this.fields.get(fieldName);
		if (!f) {
			return false;
		}
		if (!dir) {
			if (this.sortInfo && this.sortInfo.field == f.name) { // toggle sort dir
				dir = (this.sortToggle[f.name] || 'ASC').toggle('ASC', 'DESC');
			} else {
				dir = f.sortDir;
			}
		}
		var st = (this.sortToggle) ? this.sortToggle[f.name] : null;
		var si = (this.sortInfo) ? this.sortInfo : null;

		this.sortToggle[f.name] = dir;
		this.sortInfo = {
			field : f.name,
			direction : dir
		};
		if (!this.remoteSort) {
			this.applySort();
			this.fireEvent('datachanged', this);
		} else {
			// 排序时，自动跳转到第一页
			var o = this.lastOptions || {};
			if (this.pageCount != 0) {
				if (!o.params) {
					o.params = {};
				}
				o.params.start = 0;
				o.params.limit = this.pageCount;
			}
			if (!this.load(o)) {
				if (st) {
					this.sortToggle[f.name] = st;
				}
				if (si) {
					this.sortInfo = si;
				}
			}
		}
	}
})

/**
 * Artery Grid ColumnModel
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.ListAreaColumnModel = Ext.extend(Ext.grid.ColumnModel, {

	defaultType : 'textfield',

	/*setConfig : function(config, initial){
	    if(!initial){ // cleanup
	        delete this.totalWidth;
	        for(var i = 0, len = this.config.length; i < len; i++){
	            var c = this.config[i];
	            if(c.editor){
	                c.editor.destroy();
	            }
	        }
	    }
	    this.config = config;
	    this.lookup = {};
	    // if no id, create one
	    for(var i = 0, len = config.length; i < len; i++){
	        var c = config[i];
	        if(typeof c.renderer == "string"){
	            c.renderer = Ext.util.Format[c.renderer];
	        }
	        if(typeof c.id == "undefined"){
	            c.id = i;
	        }
	        
	        //modify
	        if(c.editor && c.editor.xtype){
	        	c.editor = Ext.ComponentMgr.create(c.editor, this.defaultType);
	        }
	        //modify
	        if(c.editor && c.editor.isFormField){
	            c.editor = new Artery.plugin.ListAreaGridEditor(c.editor);
	        }
	        c.getCellEditor = function(rowIndex){
	        	return this.editor;
	        }
	        this.lookup[c.id] = c;
	    }
	    if(!initial){
	        this.fireEvent('configchange', this);
	    }
	},*/

	hasEditorEdit : function() {
		var config = this.config;
		for ( var i = 0, len = config.length; i < len; i++) {
			var c = config[i];

			if (c.editor) {
				if (c.editor.editing && !c.editor.field.isValid()) {
					return true;
				}
			}
		}
		return false;
	}
})

/**
 * 列对象,用于生成自定义列
 * @class Artery.plugin.ListAreaColumn
 * @extends Ext.grid.Column
 */
Artery.plugin.ListAreaColumn = function(config){
    Ext.apply(this, config);

    if(typeof this.renderer == 'string'){
        this.renderer = Ext.util.Format[this.renderer];
    } else if(Ext.isObject(this.renderer)){
        this.scope = this.renderer.scope;
        this.renderer = this.renderer.fn;
    }
    // 不要创建delegate,this指针会漂移的
    //this.renderer = this.renderer.createDelegate(this);

    if(this.id === undefined){
        this.id = ++Ext.grid.Column.AUTO_ID;
    }
    if(this.editor){
        this.editor = Ext.create(this.editor, 'textfield');
    }
};
Ext.extend(Artery.plugin.ListAreaColumn,Ext.grid.Column, {
	
	coltype: "arterycolumn",
	
	scope: this,
	
	getCellEditor: function(rowIndex){
        var editor = this.getEditor(rowIndex);
        if(editor){
            if(!editor.startEdit){
                if(!editor.gridEditor){
                    editor.gridEditor = new Artery.plugin.ListAreaGridEditor(editor);
                }
                return editor.gridEditor;
            }else if(editor.startEdit){
                return editor;
            }
        }
        return null;
    }
});
Ext.grid.Column.types["arterycolumn"] = Artery.plugin.ListAreaColumn;

/**
 * Artery GridEditor
 * 
 * @author baon
 * @date 29/05/2008
 * 
 */
Artery.plugin.ListAreaGridEditor = Ext.extend(Ext.grid.GridEditor,{
	
	 updateEl:true,
	 
	 onRender : function(ct, position){
	 	this.field.allowDomMove = true;
	 	Artery.plugin.ListAreaGridEditor.superclass.onRender.call(this,ct, position);
	 	this.field.geditor = this;
	 },
	 
	 getValue : function(){
	 	if(this.field.getFormateValue){
	 		return this.field.getFormateValue();
	 	}
        return this.field.getValue();
     },
     
     onBlur : function(){
        if(this.allowBlur !== true && this.editing){
        	//alert(2)
            this.completeEdit();
        }
     },
	
	 startEdit : function(el, value){
	 	//add by zhangchw 增加编辑前脚本，根据返回值的真假决定是否可编辑
	 	var record=this.record;
	 	var grid = Artery.get(record.store.gridId);
		var colConf = grid.getColumnModel().getColumnById(value.id);
		if(colConf.beforeEditEvent){
			eval("var fn = function(){ return " + colConf.beforeEditEvent + "(record,value.value)\n}");
			if (!fn()) {
				return;
			}
		}
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
	 	
        //设置field的列组件id和初始值，验证会需要
        this.field.colitemid = null;
        this.field.initColVal = null;
        this.field.rowIdx = null;
        if(value && value.id){
        	this.colitemid = value.id;
        	this.field.colitemid = value.id;
        }
        if(value && value.value){
        	this.field.initColVal = value.value;
        }
        if(value && value.rowIdx){
        	this.field.rowIdx = value.rowIdx;
        }
        this.startValue = v.value;
        this.doAutoSize();
        //alert(this.boundEl.dom.outerHTML)
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        this.show();
        //alert("startedit");
        this.field.setValue(v.value);
        //modify
        this.field.validate();
    },
    cancelEdit : function(remainVisible){
        if(this.editing){
            var v = this.getValue();
            this.setValue(this.startValue);
            this.hideEdit(remainVisible);
            this.field.clearInvalid();
            this.fireEvent("canceledit", this, v, this.startValue);
        }
    },
    completeEdit : function(remainVisible){
    	//modify
//    	if(!this.field.validate()){
//    		return;
//    	}
        if(!this.editing){
            return;
        }
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        //alert(String(v) + ":" + String(this.startValue))
        if(String(v) === String(this.startValue) && this.ignoreNoChange){
            this.editing = false;
            this.hide();
            return;
        }
        //modify
        //传递json对象
		var temp = v;
		v = {};
		v.value = temp;
		if(this.field.valueText){	
			v.valueText = this.field.getValueText();
		}else{
			v.valueText =null;
		}
        if(this.fireEvent("beforecomplete", this, v.value, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
            	//modify，判断是否修改
            	var sval = String(this.startValue).replace(/(\r\n|\n\r|\n|\r)/g,"*");
        		var eval = String(v.value).replace(/(\r\n|\n\r|\n|\r)/g,"*");
        		if(sval != eval){
            		var up = v.valueText== null?v.value:v.valueText;
            		up = Ext.isEmpty(up)?"&nbsp;":Ext.HtmlEncode(up);
            		//考虑如果该列有点击时脚本时的情况(所生成的DOM结构是不一样的)
            		var aTags = this.boundEl.dom.getElementsByTagName("a");
					if (aTags.length > 0) {
						aTags[0].innerHTML = up;
					} else {
						this.boundEl.update(up);
					}
        		}
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    }
});

// 点击事件
Ext.tusc.onClick = function(gridid, eventid) {
	var cfg = Artery.get(gridid).getEventObj(eventid);
	if(cfg.eventName == null){
		cfg.eventName = 'onClickServer';
	}
	Ext.tusc.onClickCfg(cfg);
}

// 单击事件，传入事件对象
Ext.tusc.onClickCfg = function(cfg) {
	if(cfg.rowIdx){
		Artery.listRowIdx = cfg.rowIdx;
	}
	// 参数列表中首先加入点击的组件的id
	Artery.params.itemid = cfg.id;
	if (!Ext.isEmpty(cfg.onclick)) {
		var rc = Artery.createCaller(cfg.id, cfg.eventName);
		var data = cfg;
		eval("var fn = function(){"	+ cfg.onclick + "\n}");
		fn();
	}

	if (!Ext.isEmpty(cfg.linkto)) {
		var l = cfg.linkto;
		// 判断打开方式
		if (l.target == '_window') {
			/*cmp.win =*/ Ext.getWindow(l);
		} else {
			/*cmp.win =*/ Ext.getBlankWindow(l);
		}
	}
}

/**
 * Artery Grid component
 * 
 * @author baon
 * @date 19/02/2009
 * 
 * @class Ext.tusc.Grid
 * @extends Ext.form.TextField
 */
Artery.plugin.ListArea = Ext.extend(Ext.grid.EditorGridPanel, {

	forceFit : true,

	enableHdMenu : false,

	tip : '',

	// 初始化数据
	initData : null,
	
	geditor: null,
	
	//新建记录时定位的编辑框的位置
	startEditColIdx: 0 ,
	
	//是否可编辑
	isEditor:false,
	
	//编辑点击次数
	clicksToEdit:1,
	
	//行点击事件列表
	rowClickEvent: null,
	
	// 已修改的单元格文字是否标识
	showUpdate: true,
	
	disableResize:false,
	
	// 文件导出方式，stream或tempFile
	exportType: "stream",
	
	pagingbars:null,//关联的分页栏
	
	initComponent : function() {
		if(!this.isEditor){
			this.selModel = new Ext.grid.RowSelectionModel();
		}
		if(this.bodyStyle == null){
			this.bodyStyle="text-align:left;"
		}else{
			this.bodyStyle="text-align:left;" + this.bodyStyle;
		}
		
		if(Ext.isArray(this.columns)){
            this.colModel = new Artery.plugin.ListAreaColumnModel(this.columns);
            delete this.columns;
        }
        
        if(this.geditor == null){
        	this.geditor = new Artery.plugin.ListAreaGEditor(this);
        }

		this.viewConfig = {
			forceFit : this.forceFit
		}

		this.plugins = new Ext.tusc.plugins.FilterGrid({
					pageCount : parseInt(this.pageCount)
				});
		// 生成store
		this.store = new Artery.plugin.ListAreaStore({
			initData : this.initData,
			proxy : new Ext.data.HttpProxy({
				url : sys.getContextPath()
						+ "/artery/form/dealParse.do?action=runItemLogic"
			}),
			reader : new Artery.plugin.JsonReader(this.jreader),
			pageCount : parseInt(this.pageCount),
			autoLoad : false,
			remoteSort : true
		});
		this.initStoreDefaultSort();
		
		this.recordType = this.store.reader.recordType;
		
		this.store.proxy.on("loadexception",function(proxy,options,response){
			Artery.showSysError(Ext.decode(response.responseText));
		})
		
		this.clickEventMap = new Ext.util.MixedCollection();
		this.store.on("beforeload", this.onDataBeforeLoad, this);
		this.store.on("load",this.onDataLoad,this);
		if(this.pagingbars){
			this.store.on("load", this.refreshPagingbars, this);
		}

		// 加载数据前根据colHidden属性隐藏列
		this.store.on("beforeload", function(store, options) {
			var config = this.getColumnModel().config;
			var len;
			for (var i = 0, len = config.length; i < len; i++) {
				if (Ext.isTrue(config[i].colHidden)) {
					this.getColumnModel().setHidden(i, true);
				}
			}
			if (options.params == null) {
				options.params = {};
			}
			this.setColumnConf(options.params);
		}, this, {
			single : true
		});
		
		if(this.bbar){
			this.bbar.store = this.store;
		}

		// 调用父类的方法
		Artery.plugin.ListArea.superclass.initComponent.call(this);
	
		this.on("rowdblclick", this.onRowdblClick, this);
		this.on("rowclick", this.onRowClick, this)

		if (!Ext.isEmpty(this.tip)) {
			this.tipTpl = new Ext.XTemplate(this.tip);
			this.tipTpl.compile();
			this.rowTips = new Ext.util.MixedCollection();

			this.on("mouseover", function(e, t) {
				var row;
				if ((row = this.view.findRowIndex(t)) !== false) {
					var tipPanel = Artery.getTipPanel({key:'listTip'});
					tipPanel.update(this.getTip(row));
					tipPanel.showAt(e.getXY())
				}

			}, this);
		}
		
	},
	
	// 初始化store的默认排序
	initStoreDefaultSort : function(){
		var fields = this.store.reader.meta.fields;
		for(var i=0;i<fields.length;i++){
			var f = fields[i];
			if(f.isOrderBy && f.showOrderIcon){
				this.store.setDefaultSort(f.name, f.sortDir);
				return ;
			}
		}
	},
	
		//刷新所有关联的分页栏
	refreshPagingbars: function(store,recores,o){
		if(this.pagingbars == null){
			return;
		}

		var p = this.store.paramNames;
		var cursor = parseInt((o.params && o.params[p.start]) ? o.params[p.start] : 0);
		var limit = parseInt((o.params && o.params[p.limit]) ? o.params[p.limit] : 0);
		var page= 1;
		if(limit != 0){
			page=  Math.floor((cursor+limit)/limit)
		}
		var total = this.store.getTotalCount();
		for(var i=0; i< this.pagingbars.length;i++){
			Artery.get(this.pagingbars[i]).refresh({rowCount:total,currPageNo:page});
		}
	},
	
	// private 每次重新加载后都重新设置主键集
	onDataLoad: function(store,records,options){
		//翻页或者过滤时是否清空之前的状态，即checkbox列的状态
		if(this.clearStatus){
			this.clearDataStatus(false);
		}
		//将用户自定义数据加入到params
		if (store.reader.jsonData.customData) {
			options.params.customData = Ext.decode(store.reader.jsonData.customData);
		}
		//设置编辑数据
		if(store.reader.jsonData.keys){
			this.getGEditor().setKeys(store.reader.jsonData.keys);
		}
		if(store.reader.jsonData.defValues){
			this.getGEditor().setDefValues(store.reader.jsonData.defValues);
		}
		this.getGEditor().clearTransData();
		
		//设置点击事件
		if(store.reader.jsonData.rowClickEvent){
			this.rowClickEvent = store.reader.jsonData.rowClickEvent
		}
		//清空checkbox全选
		Ext.select(".x-checkbox-hd-checked",false,this.el.dom).each(function(item){
			item.removeClass('x-checkbox-hd-checked');
			item.addClass('x-checkbox-hd-unchecked');
		})
		//分页信息
		if(store.reader.jsonData.totalCount){
			store.totalCount = store.reader.jsonData.totalCount;
		}
		if(store.reader.jsonData.currPageNo){
			store.currPageNo = store.reader.jsonData.currPageNo;
		}
		if(store.reader.jsonData.rowsPerPage){
			store.rowsPerPage = store.reader.jsonData.rowsPerPage;
		}
		store.gridId = this.id;
		
		// 执行onLoadEvent
		if(this.onLoadEvent){
			Artery.regItemEvent(this,'onLoadEvent',null,{
				'store':store,
				'records':records,
				'options':options
			});
		}
		
		this.store.loadding = false;
	},
	
	// private 加载数据前，设置参数，清空事件缓存
	onDataBeforeLoad: function(store, options){
		this.clickEventMap.clear();
		if(this.store.loadding){
			return false;
		}
		this.store.loadding = true;
		if (options.params == null) {
			options.params = {};
		}
		// 设置用户自定义参数
		options.params.custParams = Ext.encode(this.custParams);
		Artery.applyIf(options.params, Artery.getParams({
			method : 'parseListData'
		}, this));
		//翻页或者过滤时是否清空之前的状态，即checkbox列的状态
		if(this.clearStatus){
			this.clearDataStatus(false);
		}
	},
	
	// private 行双击时执行
	onRowdblClick : function(grid, rowIdx, e){
		var record = this.findRowRecord();
		var rowdbclick = record.get("rowdbclick");
		var rowdblinkto = record.get("rowdblinkto");
		if(!Ext.isEmpty(rowdbclick) || !Ext.isEmpty(rowdblinkto)){
			var cfg = {
				id:this.id,
				rowIdx:rowIdx,
				onclick: rowdbclick,
				linkto: rowdblinkto,
				eventName:'onClickDoubleServer'
			}
			Ext.tusc.onClickCfg(cfg);
		}
	},
	
	// private 行单击时执行
	onRowClick : function(grid, rowIdx, e) {
		var record = this.findRowRecord();
		if(record == null){
			return;
		}
		var rowclick = record.get("rowclick");
		var rowlinkto = record.get("rowlinkto");
		if(!Ext.isEmpty(rowclick) || !Ext.isEmpty(rowlinkto)){
			var cfg = {
				id:this.id,
				rowIdx:rowIdx,
				onclick: rowclick,
				linkto: rowlinkto,
				eventName:'onClickSingleServer'
			}
			Ext.tusc.onClickCfg(cfg);
		}
	},
	
	// 增加一个事件对象，返回事件id
	addEventObj : function(dataObj) {
		var id = Ext.id();
		this.clickEventMap.add(id, dataObj);
		return id;
	},
	
	// 获得一个事件对象
	getEventObj : function(id) {
		return this.clickEventMap.get(id);
	},
	
	onRender : function(ct, position) {
        Artery.plugin.BasePanel.prototype.onRender.call(this,ct,position);
        var c = this.body;
        this.el.addClass('x-grid-panel');

        var view = this.getView();
        view.init(this);

        c.on("mousedown", this.onMouseDown, this);
        c.on("click", this.onClick, this);
        c.on("dblclick", this.onDblClick, this);
        c.on("contextmenu", this.onContextMenu, this);
        c.on("keydown", this.onKeyDown, this);

        this.relayEvents(c, ["mousedown","mouseup","mouseover","mouseout","keypress"]);

        this.getSelectionModel().init(this);
        this.view.render();
        
        this.gridBody = this.getGridEl().child("div.x-grid3");
		Artery.ListCollection.add(this.id,this);
		var currentlist=this;
		if(this.scrollPid){
			var arrays = this.scrollPid.split(";");
			for(var i=0;i<arrays.length;i++){
				scrollid=arrays[i];
				var scrollComponent = Ext.get(scrollid);
				if(scrollComponent&&scrollComponent.parent()){
					Ext.get(scrollComponent.parent().dom.id).on('scroll',function(){
						var editor  =currentlist.getGEditor();
						for(p in editor.defValues){
							var id = p+"Editor";
							if(Ext.get(id)){
								currentlist.fireEvent("bodyscroll", 0, 0);
							}
						}
					});
				}
			}
			
		}
	},
	afterRender: function(){
		Artery.plugin.ListArea.superclass.afterRender.call(this);
		if(this.hidden){
			this.on("show",function(){
				this.store.load({
					params : {
						start : 0,
						limit : this.pageCount
					}
				});
			},this,{single:true})
		}else{
			this.store.load({
				params : {
					start : 0,
					limit : this.pageCount
				}
			});
		}
		
		
		//初始化checkbox全选
		var list = this;
		Ext.select(".x-checkbox-hd-unchecked",false,this.el.dom).each(function(item){
			item.on("click",function(){
				var cn = this.dom.colName;
				var ck = null;
				if(this.hasClass('x-checkbox-hd-unchecked')){
					this.removeClass('x-checkbox-hd-unchecked');
					this.addClass('x-checkbox-hd-checked');
					list.selectAllCheckbox(cn);
					ck = true;
				}else{
					this.removeClass('x-checkbox-hd-checked');
					this.addClass('x-checkbox-hd-unchecked');
					list.deselectAllCheckbox(cn);
					ck = false;
				}
				var he = null;
				var c = list.colModel.config;
        		for(var i = 0, len = c.length; i < len; i++){
            		if(c[i].dataIndex == cn){
                		he = c[i].onHeadSelectEvent;
                		break;
            		}
        		}
				if(he){
					var rc = Artery.createCaller(cn, "onHeadSelectServer");
					rc.sync = true;
					eval("var fn = function(checked){" + he + "\n}");
					fn.call(list,ck);
				}
			})
		})
				
		//判断是否有固定列
		var cfg = this.colModel.config;
		var l = cfg.length;
		for(var i=0;i< l;i++){
			if(Ext.isTrue(cfg[i].isFix)){
				this.el.addClass("x-grid-fixed");
			}
		}
		
		//注册onResize事件
		if(!this.disableResize){
			this.el.on('resize',function(){
				this.doLayout();
			},this)
		}
	},
	
	getView : function(){
        if(!this.view){
            this.view = new Artery.plugin.ListAreaView(this.viewConfig);
        }
        //如果为自动高度，则不显示滚动条的位置
        if(this.autoHeight){
        	this.view.scrollOffset = 0;
        }
        return this.view;
    },

	getTip : function(rowIndex) {
		return this.rowTips.get(rowIndex + "tip");
	},

	setTip : function(rowIndex, tip) {
		this.rowTips.add(rowIndex + "tip", tip);
	},
	
	doLayout : function(shallow){
		Artery.plugin.ListArea.superclass.doLayout.call(this,shallow);
        if(this.rendered){
            this.onResize.call(this)
        }
	},
	/**
	 * 导出excel
	 * 
	 * @param total
	 *            是否导出全部，为false，则只导出本页
	 * @param name
	 *            导出文件名
	 */
	exportExcel : function(total,name) {
				var url = sys.getContextPath() + "/artery/form/dealParse.do";
		var p = Artery.getParams({}, this);
		if(this.store.lastOptions && this.store.lastOptions.params){
			Ext.apply(p,this.store.lastOptions.params);
		}
		// 编码参数
		Ext.tusc.encodeParam(p);
		Ext.apply(p,{
			itemid: this.id,
			formid:Artery.getFormId(this),
			method: "exportExcel",
			action: "runItemLogic",
			exportType: this.exportType
		})
		
		if(total == true){
			p.exportAll = "true";
		}
		this.setColumnConf(p);
		if (!Ext.isEmpty(name)) {
			p.exportName = name;
		} else {
			p.exportName = this.exportName;
		}
		//设置这次请求不是ajax的操作
		p.isAjax = false;
		// 根据导出方式做不同处理
//		if(Ext.isEmpty(this.exportType) || this.exportType=="stream"){			
			p.exportName = Artery.escape(p.exportName);
//			url = url+"?"+Ext.urlEncode(p);			
//			window.location = url;
			url = url+"?"+Ext.urlEncode(p);
			if(url.length>1000){
					cfg={};
					delete p.action;
					cfg.params=p;
					cfg.url="/artery/form/dealParse.do?action=runItemLogic";
					if(this.exportNewPage){
						cfg.expName = "newWindow";
					}
					Artery.autoSubmitForm(window,cfg);
			}else{
				if(this.exportNewPage){
					window.open(url);
				}
				else{
					window.location = url;
				}
			}
//		}
//		else{
//			this.container.mask("正在导出数据...");
//			Artery.request({
//				url : url,
//				success : function(response, options) {
//					this.container.unmask();
//					var res = Ext.decode(response.responseText);
//					if(res.tempFile){
//						window.location = url + "?action=download&nameencrypt=1&file="+res.tempFile+"&random="+Math.random();
//					}else{
//						alert("导出文件失败");
//					}
//				},
//				params : p,
//				scope: this
//			});
//		}
	},

	/**
	 * 导出pdf
	 * 
	 * @param total
	 *            是否导出全部，为false，则只导出本页
	 * @param name
	 *            导出文件名         
	 */
	exportPdf : function(total,name) {
		var url = sys.getContextPath() + "/artery/form/dealParse.do";
		var p = Artery.getParams({}, this);
		if(this.store.lastOptions && this.store.lastOptions.params){
			Ext.apply(p,this.store.lastOptions.params);
		}
		// 编码参数
		Ext.tusc.encodeParam(p);
		Ext.apply(p,{
			itemid: this.id,
			formid:Artery.getFormId(this),
			method: "exportPdf",
			action: "runItemLogic",
			exportType: this.exportType
		})
		
		if(total == true){
			p.exportAll = "true";
		}
		this.setColumnConf(p);
		if (!Ext.isEmpty(name)) {
			p.exportName = name;
		} else {
			p.exportName = this.exportName;
		}
		//设置这次请求不是ajax的操作
		p.isAjax = false;		
		// 根据导出方式做不同处理
		if(Ext.isEmpty(this.exportType) || this.exportType=="stream"){
			p.exportName = Artery.escape(p.exportName);
//			url = url+"?"+Ext.urlEncode(p);
//			window.location = url;
			url = url+"?"+Ext.urlEncode(p);
			if(url.length>1000){
				cfg={};
				delete p.action;
				cfg.params=p;
				cfg.url="/artery/form/dealParse.do?action=runItemLogic";
				if(this.exportNewPage){
					cfg.expName = "newWindow";
				}
				Artery.autoSubmitForm(window,cfg);
			}else{
				if(this.exportNewPage){
					window.open(url);
				}
				else{
					window.location = url;
				}
			}
		}else{
			this.container.mask("正在导出数据...");
			Artery.request({
				url : url,
				success : function(response, options) {
					this.container.unmask();
					var res = Ext.decode(response.responseText);
					if(res.tempFile){
						window.location = url + "?action=download&nameencrypt=1&file="+res.tempFile+"&random="+Math.random();
					}else{
						alert("导出文件失败");
					}
				},
				params : p,
				scope: this
			});
		}
	},
	
	// 设置显示列信息
	setColumnConf : function(params){
		var columns = this.colModel.config;
		var ca = {};
		for(var i=0;i<columns.length;i++){
			if(columns[i].dataIndex){
				var di = columns[i].dataIndex;
				ca[di] = columns[i].colHidden;
			}
		}
		params.columnConf = Ext.encode(ca);
	},

	/**
	 * 重载列表
	 * @param params 参数Map，json对象
	 * @param clearParam 为true，则清空上次查询参数，默认为false
	 * @param clearStatus 为true，则清空列表选中状态，默认为true
	 * @param clearFilter 为true，则清空列表表头过滤值，默认为false
	 */
	reload : function(options) {
		// 如果没有渲染,则什么也不做
		if(!this.rendered){
			return ;
		}
		var o = {};
		if(options){
		   o = Ext.decode(Ext.encode(options));
		   if(options.callback){
		   	o.callback = options.callback;
		   }
		}
		// 清除所有参数
		if(o.clearStatus!==false){
			this.clearDataStatus(false);
		}
		// 清除表头过滤值
		if(o.clearFilter){
			this.view.cleanAllFilter(false);
		}
		if (Ext.isTrue(this.isPageSplit) && o != null) {
			if (o.params == null) {
				o.params = {};
			}
			// 保证start,limit参数是数字
			if(o.params.start!==undefined){
				o.params.start = parseInt(o.params.start);
			}
			if(o.params.limit!==undefined){
				o.params.limit = parseInt(o.params.limit);
			}
			Artery.applyIf(o.params, {
				start : this.getBottomToolbar().cursor,
				limit : this.getBottomToolbar().pageSize
			});
		}
		// 如果不清空参数，则增加上次查询的参数
		if(!o.clearParam && this.store.lastOptions){
			Artery.applyIf(o.params,this.store.lastOptions.params);
		}
		this.store.reload(o);
	},
	
	//得到本行的指定列的值(用于onClick事件中取值）
	getValue: function(colName){
		var record = this.findRowRecordByDataIdx(Artery.listRowIdx);
		if(record){
			if(record.data[colName] == null){
				Artery.showError("找不到指定的列名称：" + colName);
				return "";
			}
			return record.data[colName].value;
		}
		return "";
	},
	
	//决断是否存在指定列
	hasColumn: function(colName){
		var columns = this.colModel.config;
		for(var i=0;i<columns.length;i++){
			if(columns[i].dataIndex == colName){
				return true;
			}
		}
		return false;
	},
	//得到本行的值(用于onClick事件中取值）
	getRowJson: function(){
		var record = this.findRowRecordByDataIdx(Artery.listRowIdx);
		if(record){
			return this._getRowValue(record);
		}
		return "";
	},
	//得到本行的值(用于onClick事件中取值）
	getRowValue: function(){
		var json = this.getRowJson();
		if(json != ""){
			return Ext.encode(json);
		}
		return "";
	},
	
	getValueText : function(colName,value){
		var columns = this.cdata;
		var col =columns[colName];
		if(!col){
			return value+"";
		}
		if(col.data){
			var data = col.data;
			for(var i=0;i<data.length;i++){
				var o = data[i];
				if(o&&o.length==2){
					if(o[1]==value){
						return o[0];
					}
				}
			}
		}
		return value+"";
	},	
	
	//设置本行指定列的值(用于onClick，onChange事件中设置值）
	setValue: function(colName,value){
		var record = this.findRowRecordByDataIdx(Artery.listRowIdx);
		if(record){
			this.setRecordValue(record,colName,{value:value + ""});
		}
	},
	//设置指定cell的值
	setRecordValue: function(record,colName,cfg){
		if(record){
			if (record.get(colName) == null) {
				Artery.showError("找不到指定的列名称：" + colName);
				return;
			}
			var data = Ext.decode(Ext.encode(record.get(colName)));
			Ext.apply(data, cfg);
			record.set.defer(100, record, [colName, data]);
			var o = {};
			o[data.id] = data.value;
			var rowNo=this.store.indexOf(record);
			var colNo=this.colModel.getIndexById(colName);
			if (rowNo > -1 && colNo > -1) {
				this.getGEditor().put(data.rowIdx, o, [rowNo, colNo]);
			}else{
				this.getGEditor().put(data.rowIdx, o);
			}
			// add by zhangchw 刷新修改过的cells
			this.getGEditor().refreshChangedCells.defer(200, this.getGEditor());
		}
	},
	getValues : function(colName) {
		return this.getValuesArray(colName).toString();
	},
	getValuesArray : function(colName) {
		//判断是否是checkbox列，checkbox列的数据在cdata中单独存储
		var p = this.cdata[colName];
		if(p == null){
			Artery.showError("找不到指定的列名称：" + colName);
			return [];
		}
		if(p.checkbox || p.radio){
			return this.cdata[colName].cparam.params;
		}else{
			var values=[];
			var data;
			var records = this.store.getRange();
			for(var i=0; i<records.length; i++){
				data = records[i].data[colName];
				if(data == null){
					Artery.showError("列:" + colName + "不存在！");
					return false;
				}else{
					if(typeof data.value == 'string'){
						values.push(data.value.trim());
					}else{
						values.push(data.value);
					}
				}
			}
			return values;
		}
	},
	
	//得到;checkbox列取消选中的值
	getDeselectValues: function(colName){
		var p = this.cdata[colName];
		if(p == null){
			Artery.showError("找不到指定的列名称：" + colName);
			return "";
		}
		if(p.checkbox || p.radio){
			return this.cdata[colName].cparam.removeParams.toString();
		}
		
		return "";
	},
	
	getDeselectValuesQuote: function(colName){
		
		var values = this.getDeselectValues(colName);
		if (values == null || values == "") {
			return values;
		}
		var array = values.split(',');
		var sb = [];
		for (var i = 0; i < array.length; i++) {
			sb.push("'" + array[i] + "'");
		}
		return sb.join(',');
	},

	//得到指定列的值，带引号
	getValuesQuote : function(colName) {
		var values = this.getValues(colName);
		if (values == null || values == "") {
			return values;
		}
		var array = values.split(',');
		var sb = [];
		for (var i = 0; i < array.length; i++) {
			sb.push("'" + array[i] + "'");
		}
		return sb.join(',');
	},
	
	//得到选择单元格的值
	getSelectedCellValue: function(){
		var cell = this.getSelectionModel().getSelectedCell();
    	if(cell == null){
    		return "";
    	}
    	var record = this.store.getAt(cell[0]);
    	var colName = this.colModel.getDataIndex(cell[1]);
    	var data = record.data[colName];
    	return data.value;
	},
	
	//得到选择的行的单元格的值
	getSelectedRowValue: function(){
		var val = this.getSelectedRowJson();
		if(val == null || val == ""){
			return "";
		}
    	return Ext.encode(val);
	},
	getSelectedRowJson: function(){
    	var record = this.findRowRecord();
    	if(record == null){
    		return "";
    	}
    	return this._getRowValue(record);
	},
	
	_getRowValue: function(record){
		var o = {};
    	for(var i in record.data){
    		if(record.data[i].id){
    			if(record.data[i].valueText){
    				o[record.data[i].id] = {value:record.data[i].value,valueText:record.data[i].valueText};
    			}else{
    				o[record.data[i].id] = record.data[i].value;
    			}
    		}
		}
		return o;
	},
	
	getCheckedRowValue: function(colName){
		var val = this.getCheckedRowJson(colName);
		if(Ext.isEmpty(val)){
			return val;
		}
		return Ext.encode(val)
	},
	
	//得到checkbox选定的行数据
	getCheckedRowJson: function(colName){
		var p = this.cdata[colName];
		if(p == null){
			//Artery.showError("找不到指定的列名称：" + colName);
			return undefined;
		}
		if(p.checkbox || p.radio){
			var checkedValues =  this.cdata[colName].cparam.params;
			if(checkedValues == null || checkedValues.length == 0){
				return "";
			}
			
			var map={};
			for(var i = 0; i < checkedValues.length;i++){
				map["key" + checkedValues[i]] = true;
			}
			var valarray = [];
			this.store.each(function(record){
				if(map["key" + record.get(colName).value]){
					valarray.push(this._getRowValue(record))
				}
			},this)
			return valarray
		}
		//Artery.showError("指定的列："+ colName + "不是checkbox列!");
		return undefined;
	},
	
	changeCheck: function(colName,values,check){
		var p = this.cdata[colName];
		if(p == null || Ext.isEmpty(values)){
			//Artery.showError("找不到指定的列名称：" + colName);
			return undefined;
		}
		var map=[];
		if(!Ext.isArray(values)){
			map[values] = true;
		}else{
			for(var i=0;i< values.length;i++){
				map[values[i]] = true;
			}
		}
		
		var checkboxs = Ext.query('[ci='+colName+'-check-item]',this.el.dom)
		
		var isChecked = function(ck){
			if(ck.type == 'radio'){
				return ck.checked;
			}else{
				return Ext.fly(ck).hasClass('x-checkbox-checked');
			}
		}
		
		if(p.checkbox || p.radio){
			this.store.each(function(record,idx){
				if(map[record.get(colName).value]){
					var ck = checkboxs[idx];
					if(!isChecked(ck)){
						if(check){
							ck.click();
						}
					}else{
						if(!check){
							ck.click();
						}
					}
				}
			},this)
		}
		
	},
	
	//得到所有的数据
	getAllValues: function(){
		return Ext.encode(this.getAllValuesJson());
	},
	getAllValuesJson: function(){
		var valarray = [];
		this.store.each(function(record){
			valarray.push(this._getRowValue(record))
		},this)
		return valarray;
	},
	
	/**
	 * 清除所有checkBox选中的数据
	 * @param clearInput 如果为false，则不扫描数据中的input
	 */
	clearDataStatus: function(clearInput){
		for(var i in this.cdata){
			if(this.cdata[i] && this.cdata[i].cparam){
				this.cdata[i].cparam.cleanParams();
				var colIdx = this.colModel.findColumnIndex(i);
				var colConf = this.colModel.getColumnAt(colIdx);
				if(colConf != null && colConf.coltype=="checkbox" && clearInput!==false){
					this.deselectAllCheckbox(i);
				}
			}
		}
	},
	
	// 处理表头checkbox的状态
	sureHeadCheckboxStatus: function(colName){
		var headInput = null;
		if(this.showTitle){
			Ext.select(".x-checkbox-hd-unchecked",false,this.el.dom).each(function(item){
				if(item.dom.colName==colName){
					headInput = item.dom;
				}
			});
			Ext.select(".x-checkbox-hd-checked",false,this.el.dom).each(function(item){
				if(item.dom.colName==colName){
					headInput = item.dom;
				}
			});
		}
		if(!headInput){
			return ;
		}
    	var domArray = Ext.query("span[ci=" + colName + "-check-item]");
		var checkCount = 0;
    	for(var i=0;i<domArray.length;i++ ){
    		if(domArray[i].className == 'x-checkbox-checked'){
    			checkCount++;
    		}
    	}
    	if(domArray.length!=0){
    		if(domArray.length==checkCount){
    			headInput.className = "x-checkbox-hd-checked";
    		}else{
    			headInput.className = "x-checkbox-hd-unchecked";
    		}
		}
	},
	
	getGEditor: function(){
		return this.geditor;
	},

	onEditComplete : function(ed, v, startValue){
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
		var r = ed.record;
        var field = this.colModel.getDataIndex(ed.col);
        v.value = this.postEditValue(v.value, startValue, r, field);
        var sval = String(startValue).replace(/(\r\n|\n\r|\n|\r)/g,"*");
        var eval = String(v.value).replace(/(\r\n|\n\r|\n|\r)/g,"*");
        if(sval !== eval){
        	var data = r.data[field];
        	data.value = v.value;
        	if(v.valueText){
        		data.valueText = v.valueText;
        	}
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: data,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel){
                r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
            var o = {};
            o[data.id] = data.value;
            this.getGEditor().put(data.rowIdx,o,[ed.row,ed.col]);
        }
        //this.view.focusCell(ed.row, ed.col);
    },
    
    //提交保存数据	params为用户自定义json类型参数
    submit: function(callbak, params, autoReload){
    	if(this.colModel.hasEditorEdit()){
    		return;
    	}
    	if(!this.getGEditor().hasTransValues()){
    		return;
    	}
    	var td = this.getGEditor().getTransData();
    	if(params){
	    	Ext.apply(td, params);
    	}
    	var reload = td["insert"] != null || td["delete"]!= null;
    	var p = Ext.encode(td);
    	//alert(p);
 		Artery.request({
			url : sys.getContextPath()
					+ "/artery/form/dealParse.do?action=runItemLogic",
			scope : this,
			params : Artery.getParams({
				buttonItemid:Artery.params.itemid,
				data:p,
				method:'parseSubmit'
			}, this),

			success : function(response, options) {
				var result = response.responseText;
				if (!Ext.isEmpty(result)) {
					result = Ext.decode(result);
				}
				if (!Ext.isEmpty(result) && result.success == false) {
					Artery.showError("出错啦，请检查！" + "<br>" + result.error)
				} else if (callbak != null && typeof callbak == "function") {
					if(reload){
						if(autoReload==undefined || autoReload){
							this.reload();
							this.getGEditor().updateCells = {};
						}
					}else{
						this.getGEditor().clearUpdateCells();
					}
					callbak.call(this, result);
				}
			}
		})   	
    },
    
    //新建记录
    insertRecord: function(o){
    	if(o && o.length){
    		for(var i =0;i< o.length;i++){
    			this._insertRecord(o[i])
    		}
    	}else{
    		this._insertRecord(o);
    	}
    	if(Artery.get(this.id+"_pagingBar")){
    		Artery.get(this.id+"_pagingBar").updatePageNumber(1);
    	}
    },
    _insertRecord: function(o){
    	var data = this.getGEditor().getDefValues();
    	//alert(Ext.encode(data))
    	if(o){
    		for(var i in o){
    			if(data[i]){
    				if(typeof(o[i]) != 'object'){
    					data[i].value = o[i]
    				}else{
    					Ext.apply(data[i],o[i])
    				}
    			}
    		}
    	}
    	//验证非空数据列的数据 add by zhangchw
    	if(this.isCheckEmpty){
	    	var cfg=this.colModel.config;
	    	for(var i=0;i<cfg.length;i++){
	    		var column=cfg[i];
	    		if(column.editor && !column.editor.allowBlank){
	    			if(Ext.isEmpty(data[column.dataIndex].value)){
	    				Artery.alertMsg("提示","\""+column.header+"\""+"列不能为空！");
	    				return ;
	    			}
	    		}
	    	}
    	}
    	this.initInsRowIdx(data);
    	//alert(Ext.encode(data))
    	var r = new this.recordType(data);
        this.stopEditing();
        var count = this.store.getCount();
        this.store.insert(count, r);
        if(Ext.isTrue(this.isAutoEditor)){
            this.startEditing(count, this.startEditColIdx);
        }
        //alert(Ext.encode(r.data))
        this.getGEditor().insertData(r.data);
    },
    
    initInsRowIdx: function(data){
    	var count = this.store.getCount();
		for(var i in data){
			//当data.rowIdx 为null时为新建的记录
			if(data[i].rowIdx == null){
				data[i].rowIdx = "insRowIdx" + count;
			}
		}
    },
    
    //删除记录
    deleteRecord: function(){
    	if(this.editing){
    		this.stopEditing(true);		
    	}
    	var rowIdx = this.findRowIdx();
    	if(rowIdx == null){
    		return;
    	}
    	//判断是否为新建的记录
    	if(rowIdx.indexOf("insRowIdx")!=-1){
    		this.getGEditor().deleteInsertData(rowIdx);
    	}else{
    		this.getGEditor().putDelete(rowIdx);
    	}
    	this.store.remove(this.findRowRecord());
    	if(Artery.get(this.id+"_pagingBar")){
    		Artery.get(this.id+"_pagingBar").updatePageNumber(-1);
    	}
    },
    
    findRowIdx: function(){
    	var record = this.findRowRecord();
    	if(record == null){
    		return null;
    	}
    	var rowIdx = this._findDataRowIdx(record);
    	return rowIdx;
    },
    
    _findDataRowIdx: function(record){
    	for(var i in record.data){
			if(record.data[i].rowIdx){
				return record.data[i].rowIdx;
			}
		}
    },
    
    findRowRecord: function(){
    	if(this.isEditor){
	    	var cell = this.getSelectionModel().getSelectedCell();
	    	if(cell == null){
	    		return null;
	    	}
	    	var record = this.store.getAt(cell[0]);
	    	return record;
    	}else{
    		return this.getSelectionModel().getSelected();
    	}
    },
    
    findRowRecordByDataIdx: function(dataRowIdx){
    	var r = null;
    	this.store.each(function(record){
    		for(var i in record.data){
				if(record.data[i].rowIdx != null && record.data[i].rowIdx == dataRowIdx){
					r = record;
					return false;
				}
			}
    	},this)
    	return r;
    },
    
    selectAllCheckbox: function(colName){
    	var x=Ext.select(".x-checkbox-hd-unchecked",this.el);
    	if(x.elements.length>0 && x.elements[0].getAttribute('colName')==colName){
    		x.removeClass('x-checkbox-hd-unchecked');
		x.addClass('x-checkbox-hd-checked');
    	}
    	
		
    	var a = Ext.query("span[ci=" + colName + "-check-item]");
    	var l = a.length;
    	for(var i=0;i<l;i++ ){
    		if(a[i].className == 'x-checkbox-unchecked' && !a[i].disabled){
    			a[i].className = "x-checkbox-checked";
    			this.dealCheckbox(a[i]);
    		}
    	}
    },
    
    deselectAllCheckbox: function(colName){
    	var x=Ext.select(".x-checkbox-hd-checked",this.el);
    	if(x.elements.length>0 && x.elements[0].getAttribute('colName')==colName){
    		x.removeClass('x-checkbox-hd-checked');
		x.addClass('x-checkbox-hd-unchecked');
    	}
    	
    	var a = Ext.query("span[ci=" + colName + "-check-item]");
    	var l = a.length;
    	for(var i=0;i<l;i++ ){
    		if(a[i].className == 'x-checkbox-checked'){
    			a[i].className = "x-checkbox-unchecked";
    			this.dealCheckbox(a[i]);
    		}
    	}
    },
    
    // 处理checkbox单击
	dealCheckbox: function(spanDom){
		var params = Ext.decode(spanDom.gridparams);
		var checked = (spanDom.className == "x-checkbox-checked");
		var cp = Ext.getCmp(params.id).cdata[params.name];
		if (checked) {
			cp.cparam.addParam(params.param);
		} else {
			cp.cparam.removeParam(params.param);
		}
		cp.value = cp.cparam.getParams();
		cp.removeValue = cp.cparam.getRemoveParams();
	}
})

// register xtype
Ext.reg('aplistarea', Artery.plugin.ListArea);

Artery.plugin.ListAreaGEditor = function(grid){
	this.grid = grid;
	this.keys = null;
	this.hasTrans = false;
	this.transData = {};
	this.defValues = null;
	this.updateCells = {};
}

Ext.override(Artery.plugin.ListAreaGEditor,{
	
	//是否有所有键集
	hasKeys: function(){
		return this.keys != null;
	},
	
	//设置键集
	setKeys: function(keys){
		this.keys = keys;
	},
	
	put: function(rowIdx,v,cell){
		if(rowIdx.indexOf("insRowIdx")!=-1){
			this.putInsert(rowIdx,v);
		}else{
			this.putUpdate(rowIdx,v);
			if(this.grid.showUpdate && cell){
				this.putUpdateCells(cell);
			}
		}
	},
	
	//添加更新值
	putUpdate: function(rowIdx,v){
		if(!this.hasKeys()){
			//Artery.showError("没有主键列!");
			return;
		}
		if(this.transData.update == null){
			this.transData.update = {rows:{}};
		}
		var rowdata = this.transData.update.rows[rowIdx];
		if(rowdata == null){
			rowdata = this.transData.update.rows[rowIdx] = {values:{}};
			var k = this.keys[rowIdx];
			if(k != null){
				rowdata.keys ={};
				Ext.apply(rowdata.keys,k);
			}
		}
		Ext.apply(rowdata.values,v);
		this.hasTrans = true;
		//alert(Ext.encode(this.transData));
	},
	
	putUpdateCells : function(cell) {
		var key = cell.join("sep");
		var boundEl = this.grid.view.getCell(cell[0], cell[1]).firstChild;
		var value = boundEl.innerText;
		var hmtlVar = "<span style='color:red'>" + value + "</span>";
		if (boundEl.getElementsByTagName("a").length > 0) {
			boundEl.getElementsByTagName("a")[0].innerHTML = hmtlVar;
		} else {
			boundEl.innerHTML=hmtlVar;
		}

		this.updateCells[key] = {
			idx : cell,
			value : value
		};
	},
	
	clearUpdateCells: function(){
		for(var i in this.updateCells){
			var o = this.updateCells[i];
			var boundEl = this.grid.view.getCell(o["idx"][0], o["idx"][1]).firstChild;
			if (boundEl.getElementsByTagName("a").length > 0) {
				boundEl.getElementsByTagName("a")[0].innerHTML =  o.value;
			} else {
				boundEl.innerHTML= o.value;
			}
		}
		this.updateCells = {};
	},
	//刷新修改过的cells
	refreshChangedCells : function() {
		for (var i in this.updateCells) {
			var o = this.updateCells[i];
			var boundEl = this.grid.view.getCell(o["idx"][0], o["idx"][1]).firstChild;
			var value = boundEl.innerText;
			var hmtlVar = "<span style='color:red'>" + value + "</span>";
			if (boundEl.getElementsByTagName("a").length > 0) {
				boundEl.getElementsByTagName("a")[0].innerHTML = hmtlVar;
			} else {
				boundEl.innerHTML=hmtlVar;
			}
		}
	},
	
	//添加新建值
	putInsert: function(rowIdx,v){
		var rowdata = this.transData.insert.rows[rowIdx];
		Ext.apply(rowdata.values,v);
		this.hasTrans = true;
		//alert(Ext.encode(this.transData));
	},
	
	hasTransValues: function(){
		return this.hasTrans;
	},
	
	getTransData: function(){
		return this.transData;
	},
	
	clearTransData: function(){
		this.transData = {};
		this.hasTrans = false;
	},
	
	setDefValues: function(values){
		this.defValues = values;
	},
	
	getDefValues: function(){
		var s = Ext.encode(this.defValues);
		return Ext.decode(s);
	},
	
	//初始化新建的数据
	insertData: function(data){
		if(this.transData.insert == null){
			this.transData.insert = {rows:{}};
		}
		var rowIdx = null;
		var rowData = {};
		for(var i in data){
			if(rowIdx == null && data[i].rowIdx){
				rowIdx = data[i].rowIdx;
			}
			rowData[i] = data[i].value;
		}
		if(rowIdx == null){
			Artery.showError("rowIdx为null!");
			return;
		}
		this.transData.insert.rows[rowIdx] = {values:rowData};
		this.hasTrans = true;
	},
	
	deleteInsertData: function(rowIdx){
		this.transData.insert.rows[rowIdx] = null;
		this.deleteTransData();
		//alert(Ext.encode(this.transData));
	},
	deleteTransData: function(){
		if(this.transData.insert){
			var rows = this.transData.insert.rows;
			var clear = true;
			for(var i in rows){
				if(rows[i] != null){
					clear = false;
				}
			}
			if(clear){
				delete this.transData.insert
			}
		}
	},
	
	putDelete: function(rowIdx){
		if(!this.hasKeys()){
			//Artery.showError("没有主键列!");
			return;
		}
		if(this.transData["delete"] == null){
			this.transData["delete"] = {rows:{}};
		}
		
		this.transData["delete"].rows[rowIdx] = {keys:this.keys[rowIdx]};
		this.hasTrans = true;
		//alert(Ext.encode(this.transData));
	}
})

/**
 * Grid的RowNumber
 * 
 * @author baon
 * @date 11/09/2008
 * 
 * @class Artery.plugin.ListAreaRowNumberer
 */
Artery.plugin.ListAreaRowNumberer = function(config) {
	Ext.apply(this, config);
	this.dataIndex = this.startnew;
	if (this.rowspan) {
		this.renderer = this.renderer.createDelegate(this);
	}
};
Artery.plugin.ListAreaRowNumberer.prototype = {
	/**
	 * @cfg {String} header Any valid text or HTML fragment to display in the
	 *      header cell for the row number column (defaults to '').
	 */
	header : "",
	/**
	 * @cfg {Number} width The default width in pixels of the row number column
	 *      (defaults to 23).
	 */
	width : 23,
	/**
	 * @cfg {Boolean} sortable True if the row number column is sortable
	 *      (defaults to false).
	 */
	sortable : false,
	/**
	 * @cfg {Boolean} start a new page count for every page.
	 */
	startnew : true,
	
	isColumn: true,

	// private
	fixed : true,
	menuDisabled : true,
	dataIndex : '',
	id : 'numberer',
	rowspan : undefined,

	// private
	renderer : function(v, p, record, rowIndex, colIdx, store) {
		if (this.rowspan) {
			p.cellAttr = 'rowspan="' + this.rowspan + '"';
		}
		var idx = 0;
		if (!Ext.isTrue(this.name) && store.lastOptions != null) {
			idx += Ext.num(store.lastOptions.params.start, 0);
		}
		
		if(rowIndex == 0){
			this.initStyle = this.style || "";
		}
		this.style = this.initStyle +";position:relative;left:expression(this.offsetParent.scrollLeft);border-right:0px solid red;";

		// 判断是否是合计行
		if (Ext.isTrue(p.isSum)) {
			if (Ext.isTrue(p.isSumTop)) {
				if (rowIndex == 0) {
					this.style = this.initStyle +";position:relative;left:expression(this.offsetParent.offsetParent.scrollLeft);";
					return "";
				} else {
					return idx += rowIndex;
				}
			} else if (!Ext.isTrue(p.isSumTop)) {
				if (rowIndex == store.getCount() - 1) {
					this.style = this.initStyle +";position:relative;left:expression(this.offsetParent.offsetParent.scrollLeft);";
					return "";
				} else {
					return idx += rowIndex + 1;
				}
			}
		}
		return idx += rowIndex + 1
	}
};
/*******************************************************************************
 * * Checkbox,Radio * *
 ******************************************************************************/
/*
 * { checked:true, handler:function(checked,params){}, params:{} }
 */

Ext.getCheckbox = function(config) {
	var dis = ""
	var filter = "";
	if (config.disable) {
		dis = " disabled=true ";
		filter = "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);"
	}

	var className = 'x-checkbox-unchecked';
	if (config.checked == true || config.checked == "true") {
		className = 'x-checkbox-checked';
	}

	var val = "<span {0} style='width:16px;height:16px;{1}' ci='" + config.params.name + "-check-item' class='{2}' gridparams='{3}' onclick='Ext.tusc.checkboxClick(this);'></span> ";
	return String.format(val, dis, filter, className, Ext.encode(config.params));
}

/*
 * { checked:true, handler:function(params){}, params:{} }
 */
Ext.getRadio = function(config) {
	var dis = ""
	if (config.disable) {
		dis = " disabled=true ";
	}

	var check = '';
	if (config.checked == true || config.checked == "true") {
		check = 'checked';
	}

	var val = "<input type='radio' {0} name='pradio'  ci='" + config.params.name + "-check-item'  {1} onclick='this.checked=true;Ext.tusc.radioClick({2});'> ";
	return String.format(val, dis, check, Ext.encode(config.params));
}

// ***************************************************************************************//
// Column Render //
// ***************************************************************************************//

Ext.tusc.operTextTpl = new Ext.XTemplate('<span class="x-oper-link" title="{tip}"><a onmouseover="if(this.clickflag == null){this.style.color=\'red\'}" onmouseout="if(this.clickflag == null){this.style.color=\'#587fa7\'}" onclick=\'this.style.color="#A0522D";this.clickflag=true;{onclick}\'>{text}</a></span>');
Ext.tusc.operImgTpl = new Ext.XTemplate('<span class="x-oper-link" title="{tip}"><a onclick=\'{onclick}\'><img align=middle src="{imgurl}"></a></span>');

/**
 * Artery DataRender component
 * 
 * @author baon
 * @date 29/05/2008
 * @param data 单元格数据
 * @param record 行record对象
 */
Ext.tusc.DataRender = function(data, metadata, record, rowIdx, colIdx, store) {
	var colConf = this.grid.getColumnModel().getColumnById(data.id);
	if(this.grid.cdata[this.name].onRenderEvent){
		this.grid.cdata[this.name].onRenderEvent.call(this,data, metadata, record, rowIdx, colIdx, store);
	}
	var val = data.valueText != null ? data.valueText :(data.value == null ? "" : data.value);
	// html转码
	if(colConf.htmlEncode){
		val = Ext.HtmlEncode(val);
	}
	
	// 解析亮显
	if (data.foreColor != null) {
		val = String.format("<span style='color:{0}'>{1}</span>", data.foreColor, val);
	}
	this.style = "vertical-align:middle;";
	if (data.backColor != null) {
		this.style += "background-color:" + data.backColor + ";";
	} else {
		this.style = "vertical-align:middle;";
	}
	//内容显示是否居中
	this.style += "text-align:"+colConf.contentAlign+";";
	
	this.style += this.columnStyle;

	//是否显示hint
	if (data.hintText!==undefined) {
		val = "<div title=\"" + data.hintText.replace(/"/g,'&quot;') + "\">" + val + "</div>";
	}
	
	// 判断是否固定列
	if (Ext.isTrue(colConf.isFix)) {
		metadata.css += " x-grid-cell-fix ";
	}
	
	//判断新建记录框时的起始位置
	if(data.editor&&this.grid.startEditColIdx == 0){
		this.grid.startEditColIdx = colIdx;
	}

	// autoRowHeight
	if (Ext.isTrue(colConf.autoRowHeight)) {
		metadata.attr = 'style="white-space:normal;word-break:break-all;"';
	}
//	if (Ext.isTrue(this.grid.autoRowHeight)) {
//		metadata.attr = 'style="white-space:normal;word-break:break-all;"';
//	}
	
	

	// 判断是否是合计行
	if (data.sumCell == true) {
		if (data.backColor == null) {
			this.style += "background-color:#fff;";
		}
		// 判断是否固定列
		if (Ext.isTrue(colConf.isFix)) {
			this.style += "left:expression(this.offsetParent.offsetParent.scrollLeft);";
		}
		if (data.foreColor == null) {
			val = "<span style='font-weight:900;'>" + val + "</span>";
		}
		return val;
	}

	// 解析onclick,linkto
	if (!Ext.isEmpty(data.onclick) || !Ext.isEmpty(data.linkto) || !Ext.isEmpty(data.onCellClick)) {
		var eventid = this.grid.addEventObj(data);
		var param = {
			onclick : 'Ext.tusc.onClick("'+this.grid.id+'","' + eventid + '")',
			text : val
		};
		val = Ext.tusc.operTextTpl.applyTemplate(param);
	}
	return Ext.tusc.getOpers(data, this.grid) + val;
}
/**
 * Artery CheckboxRender component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 * @class Ext.tusc.CheckboxRender
 */
Ext.tusc.CheckboxRender = function(data, metadata, record, rowIdx, colIdx, store) {
	var colConf = this.grid.getColumnModel().getColumnById(data.id);
	var cparam = eval("this.grid.cdata." + this.name + ".cparam");
	if (data.checked) {
		cparam.addParam(data.value);
	}

	if (cparam.containParam(data.value)) {
		data.checked = true;
	}

	this.style = "vertical-align:middle;";
	if (data.backColor != null) {
		this.style += "background-color:" + data.backColor + ";";
	} else {
		this.style = "vertical-align:middle;";
	}
	//内容显示是否居中
	this.style += "text-align:"+colConf.contentAlign+";";
	this.style += this.columnStyle;

	// 判断是否固定列
	if (Ext.isTrue(colConf.isFix)) {
		metadata.css += " x-grid-cell-fix ";
	}
	
	// autoRowHeight
	if (Ext.isTrue(this.grid.autoRowHeight)) {
		metadata.attr = 'style="white-space:normal;word-break:break-all;"';
	}
	

	// 判断是否是合计行
	if (data.sumCell == true) {
		if (data.foreColor == null) {
			return "<span style='font-weight:900;'>" + data.value + "</span>";
		}
		// 判断是否固定列
		if (Ext.isTrue(colConf.isFix)) {
			this.style += "left:expression(this.offsetParent.offsetParent.scrollLeft);";
		}
		return data.value;
	}
	
	// 解析onclick,linkto
	var eventid = null;
	if (!Ext.isEmpty(data.onclick) || !Ext.isEmpty(data.linkto)) {
		eventid = this.grid.addEventObj(data);
	}
	
	return Ext.tusc.getOpers(data, this.grid) + Ext.getCheckbox({
				disable : data.disable,
				checked : data.checked,
				params : {
					param : data.value,
					id : this.grid.id,
					name : this.name,
					eventid: eventid
				}
			});
}

// checkbox点击事件
Ext.tusc.checkboxClick = function(spanDom){
	if(spanDom.className=="x-checkbox-checked"){
		spanDom.className="x-checkbox-unchecked"
	}else{
		spanDom.className="x-checkbox-checked"
	};
	var params = Ext.decode(spanDom.gridparams);
	var gridComp = Ext.getCmp(params.id);
	gridComp.dealCheckbox(spanDom);
	gridComp.sureHeadCheckboxStatus(params.name);
	if(params.eventid){
		Ext.tusc.onClick(params.id, params.eventid);
	}
};

/**
 * Artery RadioRender component
 * 
 * @author baon
 * @date 29/05/2008
 * 
 * @class Ext.tusc.RadioRender
 */
Ext.tusc.RadioRender = function(data, metadata, record, rowIdx, colIdx, store) {
	var colConf = this.grid.getColumnModel().getColumnById(data.id);
	var cparam = eval("this.grid.cdata." + this.name + ".cparam");
	if (data.checked) {
		cparam.cleanParams();
		cparam.addParam(data.value);
	}

	if (cparam.containParam(data.value)&&!Ext.isEmpty(data.value)) {
		data.checked = true;
	}

	this.style = "vertical-align:middle;";
	if (data.backColor != null) {
		this.style += "background-color:" + data.backColor + ";";
	} else {
		this.style = "vertical-align:middle;";
	}
	//内容显示是否居中
	this.style += "text-align:"+colConf.contentAlign+";";
	this.style += this.columnStyle;
	
	// 判断是否固定列
	if (Ext.isTrue(colConf.isFix)) {
		metadata.css += " x-grid-cell-fix ";
	}
	
	// autoRowHeight
	if (Ext.isTrue(this.grid.autoRowHeight)) {
		metadata.attr = 'style="white-space:normal;word-break:break-all;"';
	}

	// 判断是否是合计行
	if (data.sumCell == true) {
		if (data.foreColor == null) {
			return "<span style='font-weight:900;'>" + data.value + "</span>";
		}
		// 判断是否固定列
		if (Ext.isTrue(colConf.isFix)) {
			this.style += "left:expression(this.offsetParent.offsetParent.scrollLeft);";
		}
		return data.value;
	}
	
	// 解析onclick,linkto
	var eventid = null;
	if (!Ext.isEmpty(data.onclick) || !Ext.isEmpty(data.linkto)) {
		eventid = this.grid.addEventObj(data);
	}

	return Ext.tusc.getOpers(data, this.grid) + Ext.getRadio({
				disable : data.disable,
				checked : data.checked,
				params : {
					param : data.value,
					id : this.grid.id,
					name : this.name,
					eventid: eventid
				}
			});
}

// radio点击事件
Ext.tusc.radioClick = function(params){
	var cp = Ext.getCmp(params.id).cdata[params.name];
	cp.cparam.cleanParams();
	cp.cparam.addParam(params.param);
	cp.value = cp.cparam.getParams();
	if(params.eventid){
		Ext.tusc.onClick(params.id, params.eventid);
	}
};

/**
 * 生成所有的操作项
 * 
 * @author baon
 * @date 29/05/2008
 * 
 * @class Ext.tusc.getOpers
 */
Ext.tusc.getOpers = function(data, grid) {
	// 判断是否是合计行
	if (data.sumCell == true) {
		return "";
	}
	var opers = data.opers;
	if (opers == null || opers.length == 0) {
		return "";
	}
	var sb = new StringBuffer();
	Ext.each(opers, function(item, idx, all) {
		sb.append(Ext.tusc.parseOper(item, grid));
	});

	return sb.toString();
}

/**
 * 解析操作项
 * 
 * @author baon
 * @date 29/05/2008
 */
Ext.tusc.parseOper = function(oper, grid) {
	var eventid = grid.addEventObj(oper);;
	var tpl = null;
	var param = {
		onclick : 'Ext.tusc.onClick("'+grid.id+'","' + eventid + '")',
		text : oper.text,
		imgurl : oper.imgurl,
		tip:oper.tip
	};
	if (oper.type == 'text') {
		tpl = Ext.tusc.operTextTpl;
	} else {
		tpl = Ext.tusc.operImgTpl;
	}
	return tpl.applyTemplate(param);
}