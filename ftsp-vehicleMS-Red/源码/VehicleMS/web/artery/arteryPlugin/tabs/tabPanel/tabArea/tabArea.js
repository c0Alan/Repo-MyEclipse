
/**
 * 调整header的滚动
 * 
 * @author baon
 * @date 30/10/2010
 */
Artery.initTabHeaderScroll = function(cfg){
	var tabEl = Ext.get(cfg.id);
	var tabHeaderEl = tabEl.child('.x-tab-panel-header');
	var stripWrapEl = tabEl.child('.x-tab-strip-wrap');
	var stripEl = stripWrapEl.child('.x-tab-strip');
	var slEl = tabHeaderEl.child('.x-tab-scroller-left');
	var srEl = tabHeaderEl.child('.x-tab-scroller-right');
	
	//scroll to left
	if(cfg.scrollLeft !== false){
		stripWrapEl.scrollTo('left', 0, false);
	}
	
	// 解决在多浏览器的情况下，子节点查找不正确的问题
	var w = 0;
	Ext.select('li', false, stripEl.dom).each(function(item){
		w += item.dom.offsetWidth+2;
	});

	if(w > stripWrapEl.getWidth()){
		tabHeaderEl.addClass('x-tab-scrolling');
		slEl.removeClass('x-hide-visibility');
		srEl.removeClass('x-hide-visibility');
	}else{
		tabHeaderEl.removeClass('x-tab-scrolling');
		slEl.addClass('x-hide-visibility');
		srEl.addClass('x-hide-visibility');
	}
	
}

/**
 * TabArea with header
 * 
 * @author weijx
 * @date 17/02/2009
 */
Artery.plugin.TabArea = Ext.extend(Ext.TabPanel, {

	enableTabScroll: true,
	
	suspendUpdates:true,
	
	tabWidth:null,
	
	onRender : function(ct, position) {
		this.on("beforetabchange",this.beforetabchangeHandler,this);
		this.on("tabchange", this.onTabChangeHandler, this);
		Artery.plugin.BasePanel.prototype.onRender.call(this, ct, position);
		
        var st = this[this.stripTarget];
        this.stripWrap = st.child(".x-tab-strip-wrap");
        this.stripSpacer = st.child(".x-tab-strip-spacer");
        // 解决在多浏览器的情况下，子节点查找不正确的问题
        this.strip = new Ext.Element(this.stripWrap.child(".x-tab-strip"));
        this.edge = this.strip.child(".x-tab-edge");
        
        if(!this.itemTpl){
            var tt = new Ext.Template(
					'<li class="{cls}" id="{id}"><a class="x-tab-strip-close" onclick="return false;"></a>',
					'<a class="x-tab-right" href="#" onclick="return false;"><em class="x-tab-left">',
					// 增加了参数 iconPath
					'<span class="x-tab-strip-inner"><span {iconPath} style="{textStyle}" title="{textTitle}" class="x-tab-strip-text {iconCls}">{text}</span></span>',
					'</em></a></li>');
			tt.disableFormats = true;
			tt.compile();
			Artery.plugin.TabArea.prototype.itemTpl = tt;
        }

        this.items.each(this.initHTMLTab, this);
        
        this.createScrollers();
	},
	
	beforetabchangeHandler : function(item,tab,obj){
		if(tab && tab.id && !tab.rendered){
			Artery.get(tab.id);
		}
	},
	
    afterRender : function(){
        Ext.TabPanel.superclass.afterRender.call(this);
        if(this.autoTabs){
            this.readTabs(false);
        }
        if(this.activeTab !== undefined){
            var item = Ext.isObject(this.activeTab) ? this.activeTab : this.items.get(this.activeTab);
            delete this.activeTab;
            Ext.each(this.items,function(index,tmpItem){
            	if(tmpItem && tmpItem.id && tmpItem.formUrl){
            		Artery.get(tmpItem.id);
            	}
            });
            if(item){
	            if(item.id){
	            	this.setActiveTabOnRender(Artery.get(item.id));
	            }else{
	            	this.setActiveTabOnRender(item);
	            }
            }
        }
    },
    
    // 设置激活页签，不触发activate事件
    setActiveTabOnRender : function(item){
        item = this.getComponent(item);
        if(!item || this.fireEvent('beforetabchange', this, item, this.activeTab) === false){
            return;
        }
        if(this.activeTab != item){
            if(this.activeTab){
                var oldEl = this.getTabEl(this.activeTab);
                if(oldEl){
                    Ext.fly(oldEl).removeClass('x-tab-strip-active');
                }
                this.activeTab.fireEvent('deactivate', this.activeTab);
            }
            var el = this.getTabEl(item);
            Ext.fly(el).addClass('x-tab-strip-active');
            this.activeTab = item;
            this.stack.add(item);

            this.layout.setActiveItem(item);
            if(this.scrolling){
                this.scrollToTab(item, this.animScroll);
            }
            this.fireEvent('tabchange', this, item);
        }
    },
	
	// 不需要设置大小
	setSize : function(w, h){
		
	},
	
	initEvents : function(){
        Artery.plugin.TabArea .superclass.initEvents.call(this);
        this.on("remove",function(item){
        	if(this.activeTab == null){
        		this.hide();
        	}
        },this);
        this.on("beforeadd",function(item){
        	this.show();
        },this);
        this.on("beforeremove",function(item, tab){
        	this.onTabBeforeRemoveHandler(tab);
        },this);
        this.on("remove",function(item){
        	Artery.initTabHeaderScroll({id:this.id});
        },this);
    },
	
	// 执行onTabChange事件
	onTabChangeHandler: function(me, tab){
		if (Ext.isEmpty(this.onTabChangeEvent)) {
			return ;
		}
		Artery.regItemEvent(this,'onTabChangeEvent','onTabChangeServer',{
			'tab':tab
		});
	},
	
	onTabBeforeRemoveHandler: function(tab) {
		try{
			var frame = tab.getFrame();
			frame.contentWindow.document.write('');//清空iframe的内容
			frame.contentWindow.close();//避免iframe内存泄漏
		} catch(e) {
			//拒绝访问时，忽略异常
		}
    },
    
	// override
	initTab : function(item, index) {
		// 修改获得before的方法，解决在多浏览器的情况下，子节点查找不正确的问题
		var i = -1;
		var before;
		Ext.select('li', false, this.strip.dom).each(function(n){
			i++;
			if (i == index) {
				before = n.dom;
			}
		});
		var p = this.getTemplateArgs(item);
		var el = before ? this.itemTpl.insertBefore(before, p) : this.itemTpl
				.append(this.strip, p);

		Ext.fly(el).addClassOnOver('x-tab-strip-over');

		if (item.tabTip) {
			Ext.fly(el).child('span.x-tab-strip-text', true).qtip = item.tabTip;
		}
		item.tabEl = el;

		item.on('disable', this.onItemDisabled, this);
		item.on('enable', this.onItemEnabled, this);
		item.on('titlechange', this.onItemTitleChanged, this);
		item.on('iconchange', this.onItemIconChanged, this);
		item.on('beforeshow', this.onBeforeShowItem, this);
	},
	
	initHTMLTab : function(item, index) {
		var id = this.id + this.idDelimiter + item.getItemId();
		var el = Ext.getDom(id);
		//Ext.fly(el).addClassOnOver('x-tab-strip-over');
		if (item.tabTip) {
			Ext.fly(el).child('span.x-tab-strip-text', true).qtip = item.tabTip;
		}
		item.tabEl = el;

        item.on('disable', this.onItemDisabled, this);
        item.on('enable', this.onItemEnabled, this);
        item.on('titlechange', this.onItemTitleChanged, this);
        item.on('iconchange', this.onItemIconChanged, this);
        item.on('beforeshow', this.onBeforeShowItem, this);
	},
	
	getTemplateArgs : function(item) {
		var iconPath = "";
        var cls = item.closable ? 'x-tab-strip-closable' : '';
        if(item.disabled){
            cls += ' x-item-disabled';
        }
        if(item.iconCls){
            cls += ' x-tab-with-icon';
        }else{
        	//modify
        	if (item.icon) {
				cls += ' x-tab-with-icon';
				iconPath = "style=\"background-image:url(" + item.icon + ") !important;\"";
			}
        }
        if(item.tabCls){
            cls += ' ' + item.tabCls;
        }
        
        var fn = function(){
        	var width="";
        	if(!Ext.isEmpty(item.tabWidth)){
        		width = item.tabWidth;
        	}else if(!Ext.isEmpty(this.tabWidth)){
        		width = this.tabWidth;
        	}
        	if(Ext.isEmpty(width)){
        		return "";
        	}
        	return "width:"+width+"px;";
        }
        
        return {
            id: this.id + this.idDelimiter + item.getItemId(),
            text: item.title,
            cls: cls,
            iconCls: item.iconCls || '',
            iconPath : iconPath,
            textStyle: fn.call(this),
            textTitle: item.title.replace(/"/g, "&quot;")
        };	
    },
    
    createScrollers : function(){
    	this.pos = this.tabPosition=='bottom' ? this.footer : this.header;
        var h = this.stripWrap.dom.offsetHeight;

        // left
        var sl = this.pos.child('.x-tab-scroller-left');
        sl.setHeight(h);
        sl.addClassOnOver('x-tab-scroller-left-over');
        this.leftRepeater = new Ext.util.ClickRepeater(sl, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollLeft,
            scope: this
        });
        this.scrollLeft = sl;

        // right
        var sr = this.pos.child('.x-tab-scroller-right');
        sr.setHeight(h);
        sr.addClassOnOver('x-tab-scroller-right-over');
        this.rightRepeater = new Ext.util.ClickRepeater(sr, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollRight,
            scope: this
        });
        this.scrollRight = sr;
    },
    
    updateScrollButtons : function(){
    },
	
	/**
	 * 添加Tab
	 */
	addLinkto: function(conf,active){
		if(conf.id){
			if(this.getItem(conf.id)){
				this.setActiveTab(this.getItem(conf.id));
				return;
			}
		}else{
			conf.id = Ext.id();
		}
		if(!conf.params){
			conf.params = {};
		}
		var url = Ext.tusc.getLinkUrl(conf);
		var pc = {
			id: conf.id,
			tabWidth:conf.tabWidth,
			html: {
				tag: "iframe",
				frameborder: 0,
				style: "width:100%;height:100%",
				src: url,
				id: conf.id+"_iframe",
				name: conf.id+"_iframe"
			}
		};
		if(this.dealMoreProp){
			this.dealMoreProp(conf, pc);
		}
		if(conf.onActive){
			pc.onActivateHandler = conf.onActive;
		}
		var lt = new Artery.plugin.TabItem(pc);
		var bc = this.items.getCount();
		this.add(lt);
		var ac = this.items.getCount();
		// add时可能不成功，此时不能setActiveTab
		if(active && (ac>bc)){
			this.setActiveTab(lt);
		}
		Artery.initTabHeaderScroll({id:this.id,scrollLeft:false});
		this.scrollToTab(this.activeTab, false);
	},
	
	// private 处理更多属性
	dealMoreProp: function(conf, pc){
		if(conf.closable){
			pc.closable = conf.closable;
		}
		if(conf.title){
			pc.title = conf.title;
		}else{
			pc.title = "<空>";
		}
		if(conf.titleEscape){
			pc.title = pc.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		if(conf.iconpath){
			pc.icon = sys.getContextPath()+conf.iconpath;
		}else if(conf.icon){
			pc.icon = sys.getContextPath()+conf.icon;
		}
	},
	
	/**
	 * 自动设置活动页签
	 */
    setActiveNext : function(){
		var tabs = this.items.items;
		for(var i=0; i<tabs.length; i++) {
			if(this.activeTab.id != tabs[i].id
					&& !tabs[i].tabEl.hidden) {
				this.setActiveTab(tabs[i]);
				return true;
			}
		}
    }
});
Ext.reg('apTabArea', Artery.plugin.TabArea);

Artery.plugin.TabPanel = Ext.extend(Artery.plugin.BasePanel, {
	
	layout:'card',
	
	layoutConfig:{
		deferredRender : true
	},
	
	monitorResize : true,
	
	render : function(){
        Artery.plugin.TabPanel.superclass.render.apply(this, arguments);
        if(this.activeTab !== undefined){
            var item = this.activeTab;
            delete this.activeTab;
            this.setActiveTab(item);
        }
    },
	
	/**
	 * 设置活动页签
	 */
	setActiveTab : function(item){
        item = this.getComponent(item);
        if(!item){
            return;
        }
        if(!this.rendered){
            this.activeItem = item;
            return;
        }
 		this.layout.setActiveItem(item);
 		item.fireEvent('activate', item);
 		if(item.doLayout){
        	item.doLayout();
        }
    },
    
    getItem: Artery.plugin.TabArea.prototype.getItem,
    
    /**
	 * 添加Tab
	 */
	addLinkto: Artery.plugin.TabArea.prototype.addLinkto
});
Ext.reg('apTabPanel', Artery.plugin.TabPanel);