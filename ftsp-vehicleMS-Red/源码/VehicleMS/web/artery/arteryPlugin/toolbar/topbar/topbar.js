/**
 * 扩展Ext.Toolbar,有什么特殊方法,可以写在这里
 * 
 * @author weijx
 * @date 2009-02-19
 */
Artery.plugin.Toolbar = Ext.extend(Ext.Toolbar,{
	
	initComponent: function(){
		Artery.plugin.Toolbar.superclass.initComponent.call(this);
	},
	
	// 直接获得el
	onRender : function(ct, position){
		this.el = Ext.get(this.id);
    },
	
	//不使用Ext的布局
	getLayout : function(){
        return null;
    }
});

Ext.reg('apToolbar', Artery.plugin.Toolbar);

// Artery2中用到
Artery.plugin.PagingToolbar = Ext.extend(Ext.PagingToolbar,{
	
	displayMsg : '本页显示:{0} - {1} 总记录数:{2}',
	beforePageText: "第",
	afterPageText  : "页 共 {0} 页",
	emptyMsg : "无记录",

	initComponent : function(){
		var lid = this.listItemId;
		Ext.apply(Artery["cfg_"+lid+"_page_first"],{
			tooltip: this.firstText,
			overflowText: this.firstText,
			disabled: true,
            handler: this.moveFirst,
            scope: this
		});
		this.first = Artery.get(lid+"_page_first");
		Ext.apply(Artery["cfg_"+lid+"_page_prev"],{
			tooltip: this.prevText,
            overflowText: this.prevText,
            disabled: true,
            handler: this.movePrevious,
            scope: this
		});
		this.prev = Artery.get(lid+"_page_prev");

		this.inputItem = Ext.getDom(this.listItemId+"_page_number");
		this.inputItem.setValue = function(value){
			this.value = value;
		}
		this.inputItem.getValue = function(){
			return this.value;
		}
		this.inputItem.select = function(){
			this.focus();
		}
		
		Ext.get(this.inputItem).on('keydown',this.onPagingKeyDown,this);
		
//        this.inputItem = new Ext.form.NumberField({
//        	applyTo: this.listItemId+"_page_number",
//            cls: 'x-tbar-page-number',
//            allowDecimals: false,
//            style:'background-image:none;',
//            allowNegative: false,
//            enableKeyEvents: true,
//            selectOnFocus: true,
//            listeners: {
//                scope: this,
//                keydown: this.onPagingKeyDown,
//                blur: this.onPagingBlur
//            }
//        });
		
        
        this.afterTextItem = new Ext.Toolbar.TextItem({
        	applyTo: this.listItemId+"_page_afterText",
            text: String.format(this.afterPageText, 1)
        });
        Ext.apply(Artery["cfg_"+lid+"_page_next"],{
            tooltip: this.nextText,
            overflowText: this.nextText,
            disabled: true,
            handler: this.moveNext,
            scope: this
		});
		this.next = Artery.get(lid+"_page_next");
		Ext.apply(Artery["cfg_"+lid+"_page_last"],{
            tooltip: this.lastText,
            overflowText: this.lastText,
            disabled: true,
            handler: this.moveLast,
            scope: this
		});
		this.last = Artery.get(lid+"_page_last");
		Ext.apply(Artery["cfg_"+lid+"_page_refresh"],{
            tooltip: this.refreshText,
            overflowText: this.refreshText,
            handler: this.refresh,
            scope: this
		});
		this.refresh = Artery.get(lid+"_page_refresh");
        if(this.displayInfo){
            this.displayItem = new Ext.Toolbar.TextItem({
            	applyTo: this.listItemId+"_page_info"
            });
        }
        Ext.PagingToolbar.superclass.initComponent.call(this);
        this.addEvents('change','beforechange');
        this.on('afterlayout', this.onFirstLayout, this, {single: true});
        this.cursor = 0;
        this.bindStore(this.store);
        
        // 初始化后即算render了
        this.el = this.container = Ext.get(this.id);
        this.layout = null;
        this.rendered = true;
    },
    //
    updatePageNumber : function(step){
		try{
			if(step > 0){
				step =1
			}else if(step < 0){
			    step = -1
			}else{
			    return;
			}
			var txt = "";
			
			var st = Ext.get(this.listItemId+"_page_info");
			if(!st)
				return ;
			txt = st.dom.innerText;
			var beginIndex = this.displayMsg.indexOf("{1}");
			var endIndex = this.displayMsg.indexOf("{2}");
			var num = "";
			if(beginIndex > -1 && endIndex >beginIndex){
				var splitTxt = this.displayMsg.substring(beginIndex+3,endIndex);
				num = txt.indexOf(splitTxt)!=-1?txt.substring(txt.indexOf(splitTxt)+splitTxt.length):"";
			}
			if(num !=""){
				num = parseInt(num);
				if(num > 1){
					var reg = new RegExp(num,"gm");
					txt = txt.replace(reg,num+step);
				}else if(num==1){
					if(step>0)
						txt = this.displayMsg.format(1,2,2);
					else
					    txt = this.emptyMsg;
				}
			}
			else{
				if(step>0)
					txt = this.displayMsg.format(1,1,1);
				else
					txt = this.emptyMsg;
			}
			st.dom.innerText = txt;		
		}catch(e){}
	},
    onPagingKeyDown : function(e,field){
        var k = e.getKey(), d = this.getPageData(), pageNum;
        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = this.readPage(d);
            if(pageNum !== false){
                pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
                this.doLoad(pageNum * this.pageSize);
            }
        }else if (k == e.HOME || k == e.END){
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : d.pages;
            field.dom.setValue(pageNum);
        }else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
            e.stopEvent();
            if((pageNum = this.readPage(d))){
                var increment = e.shiftKey ? 10 : 1;
                if(k == e.DOWN || k == e.PAGEDOWN){
                    increment *= -1;
                }
                pageNum += increment;
                if(pageNum >= 1 & pageNum <= d.pages){
                    field.dom.setValue(pageNum);
                }
            }
        }
    },
    
	//不使用Ext的布局
	getLayout : function(){
        return null;
    },
    bindStore : function(store, initial){
        var doLoad;
        if(!initial && this.store){
            if(store !== this.store && this.store.autoDestroy){
                this.store.destroy();
            }else{
                this.store.un('beforeload', this.beforeLoad, this);
                this.store.un('load', this.onLoad, this);
                this.store.un('exception', this.onLoadError, this);
            }
            if(!store){
                this.store = null;
            }
        }
        if(store){
        	if(Ext.StoreMgr){
            	store = Ext.StoreMgr.lookup(store);
        	}
            store.on({
                scope: this,
                beforeload: this.beforeLoad,
                load: this.onLoad,
                exception: this.onLoadError
            });
            doLoad = true;
        }
        this.store = store;
        if(doLoad){
            this.onLoad(store, null, {});
        }
    },
    // private
    updateInfo : function(){
    	this.cursor = (this.store.currPageNo-1)*this.store.rowsPerPage;
        if(this.displayItem){
            var count = this.store.getCount();
            //记录总数
            var totalCount=this.store.getTotalCount();
            //当前页可以容纳的最后一条记录
            var currPageEndNo = this.store.currPageNo*this.store.rowsPerPage;
            var toNo=currPageEndNo < totalCount? currPageEndNo: totalCount;
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    (this.store.currPageNo-1)*this.store.rowsPerPage+1, toNo, totalCount
                );//modify by zhangchw 第二个参数的计算方式
            this.displayItem.setText(msg);
        }
        if(this.inputItem){
        	this.inputItem.setValue(this.store.currPageNo);
        }
        //按钮状态
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
    },
    doLoad : function(start) {
		var o = {}, pn = this.getParams();
		o[pn.start] = start;
		o[pn.limit] = this.pageSize;
		// 回传记录总数
		o["totalCount"] = this.store.getTotalCount();
		if (this.store.lastOptions) {
			Artery.applyIf(o, this.store.lastOptions.params);
		}
		//增加beforechange时间触发
		if(this.fireEvent('beforechange', this, o) !== false){
            this.store.load({
				params : o
			})
        }
		
	}
});

Ext.reg('apPagingToolbar', Artery.plugin.PagingToolbar);
