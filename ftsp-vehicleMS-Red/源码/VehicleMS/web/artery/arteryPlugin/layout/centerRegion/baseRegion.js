// ***************************************************************************************//
// Region Lyaout //
// ***************************************************************************************//
/**
 * 
 * @author baon
 * @date 29/10/2009
 * 
 */
Artery.AtyRegionList = [];
Artery.initRegion = function(regionId,position,arrowStyle){
	if(Artery.AtyRegionList[regionId]){
		return;
	}
	Artery.AtyRegionList[regionId] = new Artery.plugin.AtyRegion({regionId:regionId,position:position,arrowStyle:arrowStyle});
}

Artery.plugin.AtyRegion = function(cfg){
	Ext.apply(this,cfg);
	this.initComponent();
}

Ext.override(Artery.plugin.AtyRegion,{
	regionId:null,
	
	position:null,
	
	el:null,
	
	splitEl:null,
	
	regionEl:null,
	
	miniSplitEl:null,
	
	arrowStyle:"",
	
	initComponent: function(){
		this.el = Ext.get(this.regionId);
		this.splitEl = Ext.get(this.regionId + "-Split");
		this.regionEl = Ext.get(this.regionId + "-Region");
		if(this.splitEl){
			this.splitBar = new Ext.SplitBar(this.splitEl.dom, this.regionEl, this.getSplitPosition());
			this.miniSplitEl = this.splitEl.child(".x-layout-mini-cust");
			this.initMiniSplit(this.miniSplitEl,this.regionEl,this.position);
		}
	},
	
	getSplitPosition: function(){
		if(this.position == "up" || this.position == "down"){
			return Ext.SplitBar.VERTICAL;
		}else{
			Ext.SplitBar.HORIZONTAL;
		}
	},
	
	initMiniSplit:function(miniSplitEl,regionEl,position){
		if(miniSplitEl == null){
			return;
		}
		miniSplitEl.on("click",function(){
			var suffix = '';
			if(this.arrowStyle)
				suffix="-"+this.arrowStyle;
			if(regionEl.isDisplayed()){
				regionEl.setDisplayed(false);
				if(position=='up'){
					miniSplitEl.replaceClass('x-layout-mini-top-cust'+suffix,'x-layout-mini-bottom-cust'+suffix);
				}else if(position == 'down'){
					miniSplitEl.replaceClass('x-layout-mini-bottom-cust'+suffix,'x-layout-mini-top-cust'+suffix);
				}else if(position == 'left'){
					miniSplitEl.replaceClass('x-layout-mini-left-cust'+suffix,'x-layout-mini-right-cust'+suffix);
				}else if(position == 'right'){
					miniSplitEl.replaceClass('x-layout-mini-right-cust'+suffix,'x-layout-mini-left-cust'+suffix);
				}
			}else{
				regionEl.setDisplayed(true);
				if(position=='up'){
					miniSplitEl.replaceClass('x-layout-mini-bottom-cust'+suffix,'x-layout-mini-top-cust'+suffix);
				}else if(position == 'down'){
					miniSplitEl.replaceClass('x-layout-mini-top-cust'+suffix,'x-layout-mini-bottom-cust'+suffix);
				}else if(position == 'left'){
					miniSplitEl.replaceClass('x-layout-mini-right-cust'+suffix,'x-layout-mini-left-cust'+suffix);
				}else if(position == 'right'){
					miniSplitEl.replaceClass('x-layout-mini-left-cust'+suffix,'x-layout-mini-right-cust'+suffix);
				}
			}
		},this)
	}
})

/**
 * Artery BlankPanel component
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.BaseRegion = Ext.extend(Artery.plugin.BasePanel, {
	
	regionEl:null,
	
	initComponent:function(){
		Artery.plugin.BaseRegion.superclass.initComponent.call(this);
		this.regionEl = Ext.get(this.id + "-Region");
	},
	
	expand: function(){
		this.regionEl.setDisplayed(true);
	},
	collapse: function(){
		this.regionEl.setDisplayed(false)
	}
})

Ext.reg('apBaseRegion', Artery.plugin.BaseRegion);

/**
 * Artery Blank container
 * 
 * @author baon
 * @date 16/11/2009
 * 
 */
Artery.plugin.BaseRegionContainer = Ext.extend(Artery.plugin.BaseContainer, {
	
	regionEl:null,
	
	initComponent:function(){
		Artery.plugin.BaseRegionContainer.superclass.initComponent.call(this);
		this.regionEl = Ext.get(this.id + "-Region");
	},
	
	expand: function(){
		this.regionEl.setDisplayed(true);
	},
	collapse: function(){
		this.regionEl.setDisplayed(false)
	}
})

Ext.reg('apBaseRegionContainer', Artery.plugin.BaseRegionContainer);

// 重写Ext.layout.BorderLayout.Region中的方法
// 重写Ext.layout.BorderLayout.SplitRegion中的方法
// 严格按collapsible，collapsed，split状态处理

Ext.override(Ext.layout.BorderLayout.Region,{
	
	getCollapsedEl : function(){
        if(!this.collapsedEl){
            if(!this.toolTemplate){
                var tt = new Ext.Template(
                     '<div class="x-tool x-tool-{id}">&#160;</div>'
                );
                tt.disableFormats = true;
                tt.compile();
                Ext.layout.BorderLayout.Region.prototype.toolTemplate = tt;
            }
            this.collapsedEl = this.targetEl.createChild({
                cls: "x-layout-collapsed x-layout-collapsed-"+this.position,
                id: this.panel.id + '-xcollapsed'
            });
            this.collapsedEl.enableDisplayMode('block');

            if(this.arteryMode && !this.collapsible){
            	// arteryMode
            }else{
            	if(this.collapseMode == 'mini'){
	                this.collapsedEl.addClass('x-layout-cmini-'+this.position);
	                this.miniCollapsedEl = this.collapsedEl.createChild({
	                    cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
	                });
	                this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
	                this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
	                this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
	            }else {
	                if(this.collapsible !== false && !this.hideCollapseTool) {
	                    var t = this.toolTemplate.append(
	                            this.collapsedEl.dom,
	                            {id:'expand-'+this.position}, true);
	                    t.addClassOnOver('x-tool-expand-'+this.position+'-over');
	                    t.on('click', this.onExpandClick, this, {stopEvent:true});
	                }
	                if(this.floatable !== false || this.titleCollapse){
	                   this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
	                   this.collapsedEl.on("click", this[this.floatable ? 'collapseClick' : 'onExpandClick'], this);
	                }
	            }
            }
        }
        return this.collapsedEl;
    },
    
    beforeCollapse : function(p, animate){
        this.lastAnim = animate;
        if(this.splitEl){
            this.splitEl.hide();
        }
        if(this.arteryMode && !this.collapsible){
        	// arteryMode
        	this.getCollapsedEl().hide();
        }else{
        	this.getCollapsedEl().show();
        }
        this.panel.el.setStyle('z-index', 100);
        this.isCollapsed = true;
        this.layout.layout();
    },
    
    onCollapse : function(animate){
        this.panel.el.setStyle('z-index', 1);
        if(!this.arteryMode || this.collapsible){
	        if(this.lastAnim === false || this.panel.animCollapse === false){
	            this.getCollapsedEl().dom.style.visibility = 'visible';
	        }else{
	            this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
	        }
        }
        this.state.collapsed = true;
        this.panel.saveState();
    },
    
    onShow : function(){
        if(this.isCollapsed){
        	if(!this.arteryMode || this.collapsible){
	            this.getCollapsedEl().show();
        	}
        }else if(this.splitEl){
            this.splitEl.show();
        }
    }
});

Ext.override(Ext.layout.BorderLayout.SplitRegion,{
	
	render : function(ct, p){
        Ext.layout.BorderLayout.SplitRegion.superclass.render.call(this, ct, p);

        var ps = this.position;

        this.splitEl = ct.createChild({
            cls: "x-layout-split x-layout-split-"+ps, html: "&#160;",
            id: this.panel.id + '-xsplit'
        });

        if(this.arteryMode && !this.collapsible){
        	// arteryMode
        }else{
        	if(this.collapseMode == 'mini'){
	            this.miniSplitEl = this.splitEl.createChild({
	                cls: "x-layout-mini x-layout-mini-"+ps, html: "&#160;"
	            });
	            this.miniSplitEl.addClassOnOver('x-layout-mini-over');
	            this.miniSplitEl.on('click', this.onCollapseClick, this, {stopEvent:true});
	        }
        }

        var s = this.splitSettings[ps];

        this.split = new Ext.SplitBar(this.splitEl.dom, p.el, s.orientation);
        this.split.tickSize = this.tickSize;
        this.split.placement = s.placement;
        this.split.getMaximumSize = this[s.maxFn].createDelegate(this);
        this.split.minSize = this.minSize || this[s.minProp];
        this.split.on("beforeapply", this.onSplitMove, this);
        this.split.useShim = this.useShim === true;
        this.maxSize = this.maxSize || this[s.maxProp];

        if(p.hidden){
            this.splitEl.hide();
        }

        if(this.useSplitTips){
            this.splitEl.dom.title = this.collapsible ? this.collapsibleSplitTip : this.splitTip;
        }
        if(this.collapsible){
            this.splitEl.on("dblclick", this.onCollapseClick,  this);
        }
    }
});