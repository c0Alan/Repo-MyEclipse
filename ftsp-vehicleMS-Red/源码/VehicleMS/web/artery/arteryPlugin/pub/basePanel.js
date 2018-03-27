/**
 * baseComponent
 * @author baon
 * @date 21/07/2009
 */
Artery.plugin.BaseComponent = Ext.extend(Ext.Component,{
	allowDomMove:false,
	
	onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.BaseComponent.superclass.onRender.call(this, ct, position);
    }
})

/**
 * baseContainer
 * @author baon
 * @date 21/10/2009
 */
Artery.plugin.BaseContainer = Ext.extend(Ext.Container,{
	
	allowDomMove:false,
	
	//不提供默认的layout，即默认不初始化子组件，如果需要初始化，则提供layout参数
	getLayout : function(){
        /*if(!this.layout){
            var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }*/
        return this.layout;
    },
    onRender : function(ct, position){
    	this.el = Ext.get(this.id);
        Artery.plugin.BaseContainer.superclass.onRender.call(this, ct, position);
    },
    
    // 如果子组件已经初始化过了，则避免重复创建
    lookupComponent : function(comp){
    	//alert(comp + ":" + comp.id);
        if(typeof comp == 'string'){
            return Ext.ComponentMgr.get(comp);
        }else{
        	var c = Ext.getCmp(comp.id);
        	if(c){
        		return c;
        	}else if(!comp.events){
            	return this.createComponent(comp);
        	}
        }
        return comp;
    },
//    onHide : function() {
//		var conEl = this.getContanerEl();
//		if(this.clearInvalid){
//			this.clearInvalid();
//		}
//		if (conEl) {
//			conEl.addClass('x-hide-' + this.hideMode);
//			// visibility时，显示子组件有问题，需再设style
//			if(this.hideMode=="visibility"){
//				conEl.dom.style.visibility = "hidden";
//			}
//		} else {
//			this.getActionEl().addClass('x-hide-' + this.hideMode);
//		}
//	},
//
//	onShow : function() {
//		var conEl = this.getContanerEl();
//		if (conEl) {
//			conEl.removeClass('x-hide-' + this.hideMode);
//			// visibility时，显示子组件有问题，需再设style
//			if(this.hideMode=="visibility"){
//				conEl.dom.style.visibility = "";
//			}
//		} else {
//			this.getActionEl().removeClass('x-hide-' + this.hideMode);
//		}
//	},

//	getContanerEl : function() {
//		return this.el.findParentNode('td.x-form-td-cust', 50, true);
//	},
    collapse: function(){
    	this.fireEvent('beforecollapse', this, false)
    	this.el.hide();
    	this.fireEvent('collapse', this);
    },
    
    expand: function(){
    	this.fireEvent('beforeexpand', this, false)
    	this.el.show();
    	this.fireEvent('expand', this);
    },
    alignTo: function(otherEl,position,relative){
		this.show();
		this.el.setStyle('position','absolute')
		Ext.getBody().appendChild(this.el);
		this.el.alignTo(otherEl,position,relative);
	},
	center: function(){
		this.show();
		this.el.setStyle('position','absolute')
		Ext.getBody().appendChild(this.el);
		this.el.center();
	}
})

/**
 * 此panel可用HTML片段做为内容
 * @author weijx
 * @date 17/02/2009
 */
Artery.plugin.BasePanel = Ext.extend(Ext.Panel, {
	
	allowDomMove:false,
	
	deferHeight: false,	// setSize方法会使用此属性，为false时，会设置el到高度
	
	//不提供默认的layout，即默认不初始化子组件，如果需要初始化，则提供layout参数
	getLayout : function(){
        /*if(!this.layout){
            var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }*/
        return this.layout;
    },
	
	onRender : function(ct, position) {
		this.el = Ext.get(this.id);
		Ext.Panel.superclass.onRender.call(this, ct, position);
        this.createClasses();

        var el = this.el,
            d = el.dom,
            bw;
        if(d.firstChild){ // existing markup
//            this.header = el.child('.'+this.headerCls);
//            this.bwrap = el.child('.'+this.bwrapCls);
//            var cp = this.bwrap ? this.bwrap : el;
//            this.tbar = cp.child('.'+this.tbarCls);
//            this.body = cp.child('.'+this.bodyCls);
//            this.bbar = cp.child('.'+this.bbarCls);
//            this.footer = cp.child('.'+this.footerCls);
            this.header = Ext.get(this.id + '-atheader');
            this.bwrap = Ext.get(this.id + '-atbwrap');
            this.tbar = Ext.get(this.id + '-attbar');
            this.body = Ext.get(this.id + '-atbody');
            this.bbar = Ext.get(this.id + '-atbbar');
            this.footer = Ext.get(this.id + '-atfooter');
            this.fromMarkup = true;
        }

        if(this.buttons){
            this.elements += ',footer';
        }

        if(this.header){
            this.header.unselectable();

            // for tools, we need to wrap any existing header markup
            if(this.headerAsText){

                if(this.iconCls){
                    this.setIconClass(this.iconCls);
                }
            }
        }

        if(this.floating){
            this.makeFloating(this.floating);
        }

        if(this.collapsible){
            this.tools = this.tools ? this.tools.slice(0) : [];
            if(!this.hideCollapseTool){
                this.tools[this.collapseFirst?'unshift':'push']({
                    id: 'toggle',
                    handler : this.toggleCollapse,
                    scope: this
                });
            }
            if(this.titleCollapse && this.header){
                this.mon(this.header, 'click', this.toggleCollapse, this);
                this.header.setStyle('cursor', 'pointer');
            }
        }
        if(this.tools){
            var ts = this.tools;
            this.tools = {};
            this.addTool.apply(this, ts);
        }else{
            this.tools = {};
        }
        this.toolbars = [];
        if(this.fbar){
            this.fbar = Ext.create(this.fbar, 'toolbar');
            this.toolbars.push(this.fbar);
        }

        if(this.tbar && this.topToolbar){
            if(Ext.isArray(this.topToolbar)){
                this.topToolbar = new Ext.Toolbar(this.topToolbar);
            }else if(!this.topToolbar.events){
                this.topToolbar = Ext.create(this.topToolbar, 'toolbar');
            }
            this.topToolbar.ownerCt = this;
            this.toolbars.push(this.topToolbar);
        }
        if(this.bbar && this.bottomToolbar){
            if(Ext.isArray(this.bottomToolbar)){
                this.bottomToolbar = new Ext.Toolbar(this.bottomToolbar);
            }else if(!this.bottomToolbar.events){
                this.bottomToolbar = Ext.create(this.bottomToolbar, 'toolbar');
            }
            this.bottomToolbar.ownerCt = this;
            this.toolbars.push(this.bottomToolbar);
        }
	},
	
	afterRender : function(){
        if(this.floating && !this.hidden){
            this.el.show();
        }

        if(this.html){
            this.body.update(Ext.isObject(this.html) ?
                             Ext.DomHelper.markup(this.html) :
                             this.html);
            delete this.html;
        }
        if(this.contentEl){
            var ce = Ext.getDom(this.contentEl);
            Ext.fly(ce).removeClass(['x-hidden', 'x-hide-display']);
            this.body.dom.appendChild(ce);
        }
        if(this.collapsed){
            this.collapsed = false;
            this.collapse(false);
        }
        Ext.Panel.superclass.afterRender.call(this); // do sizing calcs last
        this.initEvents();
        
        //判断是否折叠
        if(!this['bwrap'].isDisplayed()){
        	this.collapsed = true;
        }
    },
    
    initEvents : function(){
        if(this.keys){
            this.getKeyMap();
        }
        if(this.draggable){
            this.initDraggable();
        }
        /*if(this.toolbars.length > 0){
            Ext.each(this.toolbars, function(tb){
                tb.doLayout();
                tb.on({
                    scope: this,
                    afterlayout: this.syncHeight,
                    remove: this.syncHeight
                });
            }, this);
            if(!this.ownerCt){
                this.syncHeight();
            }
        }*/
    },
    
    // Ext中会调用此方法调整tbar,bbar的大小，artery中不需要
    onResize: function(){
	},
	setSize: function(w,h){
		if(this.region){
			Artery.plugin.BasePanel.superclass.setSize.call(this,w,h);
		}
	},
	alignTo: function(otherEl,position,relative){
		this.show();
		this.el.setStyle('position','absolute')
		Ext.getBody().appendChild(this.el);
		this.el.alignTo(otherEl,position,relative);
	},
	center: function(){
		this.show();
		this.el.setStyle('position','absolute')
		Ext.getBody().appendChild(this.el);
		this.el.center();
	}

});
Ext.reg('apBasePanel', Artery.plugin.BasePanel);

/**
 * Ext.tusc.AnchorLayout
 * 
 * @author baon
 * @date 14/05/2008
 * 
 * @class Ext.tusc.TableLayout
 * @extends Ext.layout.TableLayout
 */
Artery.plugin.AtyLayout = Ext.extend(Ext.layout.ContainerLayout, {
	renderItem : function(c, position, target){
		if(c && !c.rendered){
            c.render(target, position);
        }
    }
})
// register layout
Ext.Container.LAYOUTS['atylayout'] = Artery.plugin.AtyLayout;

/**
 * basePagingbar
 * @author hanf
 * @date 29/11/2010
 */
Artery.plugin.BasePagingbar = Ext.extend(Artery.plugin.BaseContainer,{
	
	pageInfoTpl:null, //分页信息
	
	pageInfoTplContent:null, //分页信息模板内容
	
	isOnePageHideBar:false, //少于一页隐藏分页栏
	
	initComponent: function(){
		Artery.plugin.BasePagingbar.superclass.initComponent.call(this);
		if(!Ext.isEmpty(this.pageInfoTplContent)){
			this.pageInfoTpl = new Ext.XTemplate(this.pageInfoTplContent);
		}else{
			this.pageInfoTpl = new Ext.XTemplate(Artery.tpl.pageInfo);
		}
   		this.pageInfoTpl.compile();
	}
})
Ext.reg('apBasePagingbar', Artery.plugin.BasePagingbar);

