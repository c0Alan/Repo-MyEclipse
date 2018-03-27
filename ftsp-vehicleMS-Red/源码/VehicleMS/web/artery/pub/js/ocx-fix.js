﻿
Ext.override(Ext.Panel,{
	    // private
    onRender : function(ct, position){
        Ext.Panel.superclass.onRender.call(this, ct, position);
        this.createClasses();

        var el = this.el,
            d = el.dom,
            bw;
        //modify
        if(this.height && !this.el.parent().hasClass("x-layer")){
        	this.el.dom.style.height=this.height;
 			d.innerHTML+="<iframe id='"+this.id+"_iframeOcx' src=\"javascript:false\" style=\"position:absolute; visibility:inherit; top:0px; left:0px; height:'100%';width:'100%'; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
 		}
        el.addClass(this.baseCls);
        if(d.firstChild){ // existing markup
            this.header = el.down('.'+this.headerCls);
            this.bwrap = el.down('.'+this.bwrapCls);
            var cp = this.bwrap ? this.bwrap : el;
            this.tbar = cp.down('.'+this.tbarCls);
            this.body = cp.down('.'+this.bodyCls);
            this.bbar = cp.down('.'+this.bbarCls);
            this.footer = cp.down('.'+this.footerCls);
            this.fromMarkup = true;
        }
        if (this.preventBodyReset === true) {
            el.addClass('x-panel-reset');
        }
        if(this.cls){
            el.addClass(this.cls);
        }

        if(this.buttons){
            this.elements += ',footer';
        }

        // This block allows for maximum flexibility and performance when using existing markup

        // framing requires special markup
        if(this.frame){
            el.insertHtml('afterBegin', String.format(Ext.Element.boxMarkup, this.baseCls));

            this.createElement('header', d.firstChild.firstChild.firstChild);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            bw = this.bwrap.dom;
            var ml = d.childNodes[1], bl = d.childNodes[2];
            bw.appendChild(ml);
            bw.appendChild(bl);

            var mc = bw.firstChild.firstChild.firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.lastChild.firstChild.firstChild);

            if(!this.footer){
                this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
            }
        }else{
            this.createElement('header', d);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            bw = this.bwrap.dom;
            this.createElement('tbar', bw);
            this.createElement('body', bw);
            this.createElement('bbar', bw);
            this.createElement('footer', bw);

            if(!this.header){
                this.body.addClass(this.bodyCls + '-noheader');
                if(this.tbar){
                    this.tbar.addClass(this.tbarCls + '-noheader');
                }
            }
        }

        if(this.padding !== undefined) {
            this.body.setStyle('padding', this.body.addUnits(this.padding));
        }

        if(this.border === false){
            this.el.addClass(this.baseCls + '-noborder');
            this.body.addClass(this.bodyCls + '-noborder');
            if(this.header){
                this.header.addClass(this.headerCls + '-noborder');
            }
            if(this.footer){
                this.footer.addClass(this.footerCls + '-noborder');
            }
            if(this.tbar){
                this.tbar.addClass(this.tbarCls + '-noborder');
            }
            if(this.bbar){
                this.bbar.addClass(this.bbarCls + '-noborder');
            }
        }

        if(this.bodyBorder === false){
           this.body.addClass(this.bodyCls + '-noborder');
        }

        this.bwrap.enableDisplayMode('block');

        if(this.header){
            this.header.unselectable();

            // for tools, we need to wrap any existing header markup
            if(this.headerAsText){
                this.header.dom.innerHTML =
                    '<span class="' + this.headerTextCls + '">'+this.header.dom.innerHTML+'</span>';

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

        if(this.buttons && this.buttons.length > 0){
            this.fbar = new Ext.Toolbar({
                items: this.buttons,
                toolbarCls: 'x-panel-fbar'
            });
        }
        this.toolbars = [];
        if(this.fbar){
            this.fbar = Ext.create(this.fbar, 'toolbar');
            this.fbar.enableOverflow = false;
            if(this.fbar.items){
                this.fbar.items.each(function(c){
                    c.minWidth = c.minWidth || this.minButtonWidth;
                }, this);
            }
            this.fbar.toolbarCls = 'x-panel-fbar';

            var bct = this.footer.createChild({cls: 'x-panel-btns x-panel-btns-'+this.buttonAlign});
            this.fbar.ownerCt = this;
            this.fbar.render(bct);
            bct.createChild({cls:'x-clear'});
            this.toolbars.push(this.fbar);
        }

        if(this.tbar && this.topToolbar){
            if(Ext.isArray(this.topToolbar)){
                this.topToolbar = new Ext.Toolbar(this.topToolbar);
            }else if(!this.topToolbar.events){
                this.topToolbar = Ext.create(this.topToolbar, 'toolbar');
            }
            this.topToolbar.ownerCt = this;
            this.topToolbar.render(this.tbar);
            this.toolbars.push(this.topToolbar);
        }
        if(this.bbar && this.bottomToolbar){
            if(Ext.isArray(this.bottomToolbar)){
                this.bottomToolbar = new Ext.Toolbar(this.bottomToolbar);
            }else if(!this.bottomToolbar.events){
                this.bottomToolbar = Ext.create(this.bottomToolbar, 'toolbar');
            }
            this.bottomToolbar.ownerCt = this;
            this.bottomToolbar.render(this.bbar);
            this.toolbars.push(this.bottomToolbar);
        }
        Ext.each(this.toolbars, function(tb){
            tb.on({
                scope: this,
                afterlayout: this.syncHeight,
                remove: this.syncHeight
            });
        }, this);
    }
})

Ext.override(Ext.Window.DD,{
	startDrag : function(){
        var w = this.win;
        this.proxy = w.ghost();
        if(w.constrain !== false){
            var so = w.el.shadowOffset;
            this.constrainTo(w.container, {right: so, left: so, bottom: so});
        }else if(w.constrainHeader !== false){
            var s = this.proxy.getSize();
            this.constrainTo(w.container, {right: -(s.width-this.headerOffsets[0]), bottom: -(s.height-this.headerOffsets[1])});
        }
        //modify
		var newiframe= Ext.getDom(this.win.id+'_newiframe');
		if (!newiframe){
			this.proxy.dom.innerHTML+="<iframe id='"+this.win.id+'_newiframe' +"' src=\"javascript:false\" style=\"position:absolute; visibility:inherit; top:0; left:0; width:100%; height:100%; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
		}
    }
})

Ext.override(Ext.menu.Menu,{
	    // private
    onRender : function(ct, position){
        if(!ct){
            ct = Ext.getBody();
        }

        var dh = {
            id: this.getId(),
            cls: 'x-menu ' + ((this.floating) ? 'x-menu-floating x-layer ' : '') + (this.cls || '') + (this.plain ? ' x-menu-plain' : '') + (this.showSeparator ? '' : ' x-menu-nosep'),
            style: this.style,
            cn: [
                {tag: 'a', cls: 'x-menu-focus', href: '#', onclick: 'return false;', tabIndex: '-1'},
                {tag: 'ul', cls: 'x-menu-list'}
            ]
        };
        if(this.floating){
            this.el = new Ext.Layer({
                shadow: this.shadow,
                dh: dh,
                constrain: false,
                parentEl: ct,
                zindex:15000
            });
        }else{
            this.el = ct.createChild(dh);

        }
        //modify
        Ext.DomHelper.append(this.el.dom, {
		 tag : 'iframe',
		 id: this.id + "_iframeOcx",
		 style : "background-color:transparent;position:absolute; visibility:inherit; top:0; left:0; width:100%; height:100%; z-index:-1; filter:'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"
		});
        Ext.menu.Menu.superclass.onRender.call(this, ct, position);

        if(!this.keyNav){
            this.keyNav = new Ext.menu.MenuNav(this);
        }
        // generic focus element
        this.focusEl = this.el.child('a.x-menu-focus');
        this.ul = this.el.child('ul.x-menu-list');
        this.mon(this.ul, {
            scope: this,
            click: this.onClick,
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut
        });
        if(this.enableScrolling){
            this.mon(this.el, {
                scope: this,
                delegate: '.x-menu-scroller',
                click: this.onScroll,
                mouseover: this.deactivateActive
            });
        }
    }
})

Artery.plugin.PopupLayer.prototype.callBack = function(ele) {
	ele.dom.innerHTML+="<iframe id='"+ele.id+"_iframeOcx' src=\"javascript:false\" style=\"position:absolute; visibility:inherit; top:0px; left:0px; height:'100%';width:'100%'; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
};
