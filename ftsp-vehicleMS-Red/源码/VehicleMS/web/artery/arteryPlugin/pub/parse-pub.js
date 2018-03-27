
// ***************************************************************************************//
// Common override
// ***************************************************************************************//

/**
 * Override initComponent mehtod, add create component name method
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
Ext.override(Ext.Component, {
			initComponent : function() {
				// onBeforeChange事件
				if (!Ext.isEmpty(this.onBeforeChangeEvent)) {
					this.on('beforeselect',
							function(field, newValue, oldValue) {
								// alert("newValue:" + newValue + " oldValue:"
								// +oldValue);
								if (newValue == null) {
									newValue = "";
								}
								if (oldValue == null) {
									oldValue = "";
								}
								if (newValue.toString() == oldValue.toString()) {
									return;
								}
								var newValueText = this
										.getValueTextByValue(newValue);
								return Artery.regItemEvent(this,
										'onBeforeChangeEvent',
										'onBeforeChangeServer', {
											'newValue' : newValue,
											'newValueText' : newValueText,
											'oldValue' : oldValue
										});
							}, this);
				}
				// onChange事件
				if (!Ext.isEmpty(this.onChangeEvent)) {
					this.on('change', function(field, newValue, oldValue) {
								// alert("newValue:" + newValue + " oldValue:"
								// +oldValue);
								if (newValue == null) {
									newValue = "";
								}
								if (oldValue == null) {
									oldValue = "";
								}
								if (newValue.toString() == oldValue.toString()) {
									return;
								}
								Artery.regItemEvent(this, 'onChangeEvent',
										'onChangeServer', {
											'newValue' : newValue,
											'oldValue' : oldValue
										});
							}, this);
				}
				// onClick事件
				if (!Ext.isEmpty(this.onClickEvent)) {
					this.on('click', function(itemCmp, e) {
								Artery.regItemEvent(this, 'onClickEvent',
										'onClickServer');
							}, this);
				}
				// linkto事件
				if (!Ext.isEmpty(this.linktoEvent)) {
						this.on('click', function(itemCmp, e) {
                           
                            if(!Ext.isEmpty(e)){
                                 e.stopEvent();
                            }                             
                            if(this.cancleLinkto !== true && this.cancelLinkto !== true){
								Artery.regLinktoEvent(this, 'linktoEvent');
							}
                           
						}, this);
				}
				
				// onKeyup事件
				if (!Ext.isEmpty(this.onKeyupEvent)) {
					this.on('keyup', function(itemCmp, e) {
						var value = itemCmp.getValue();
						Artery.regItemEvent(this,'onKeyupEvent','onKeyupServer',{
							'value' : value,
							'eventObject' : e
						});
					}, this);
				}
			}, 
			getVisibiltyEl : function(){
				 if((this.hiddenId)&&(Ext.get(this.hiddenId))){
					 return Ext.get(this.hiddenId);    
				 }
				 else{
					 return this.hideParent ? this.container : this.getActionEl();
				 }
			 }
			
		})

Ext.override(Ext.Container, {

			// 如果没有layout，则不初始化子类
			add : function(comp) {
				this.initItems();
				var args = arguments.length > 1;
				if (args || Ext.isArray(comp)) {
					Ext.each(args ? arguments : comp, function(c) {
								this.add(c);
							}, this);
					return;
				}
				if (this.getLayout()) {
					var c = this.lookupComponent(this.applyDefaults(comp));
					var pos = this.items.length;
					if (this.fireEvent('beforeadd', this, c, pos) !== false
							&& this.onBeforeAdd(c) !== false) {
						this.items.add(c);
						c.ownerCt = this;
						this.fireEvent('add', this, c, pos);
					}
					return c;
				} else {
					this.initCfgItems();
					this.cfgItems.add(comp.id, comp);
				}
			},
			// 初始化子组件配置信息列表
			initCfgItems : function() {
				if (!this.cfgItems) {
					this.cfgItems = new Ext.util.MixedCollection();
				}
			},
			// 得到子组件配置信息列表
			getCfgItems : function() {
				this.initCfgItems();
				return this.cfgItems;
			}
		})

/**
 * Button add click method
 * 
 * @author baon
 * @date 18/08/2009
 * 
 * @class Ext.Button
 */
Ext.override(Ext.Button, {
	click : function() {
		if (this.disabled) {
			this.fireEvent("click");
		} else {
			this.el.dom.click();
		}
		Ext.get(this.btnEl.dom.id).focus();
	},
	onDisableChange : function(disabled) {
		if (this.el) {
			if (!Ext.isIE6 || !this.text) {
				this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
			}
			if (!disabled) {
				this.el.removeClass(this.disabledClass);
			}
			this.el.dom.disabled = disabled;
		}
		this.disabled = disabled;
	}
})

if (Ext.form.BasicForm) {
	Ext.override(Ext.form.BasicForm, {
				isValid : function(isValidHidden) {
					var valid = true;
					var hasFocusField = false;
					this.items.each(function(f) {
								// not valid when hide
								if (!isValidHidden && f.isHidden()) {
									return;
								}
								if (f.validate && !f.validate()) {
									valid = false;
									if (!hasFocusField) { // 聚焦第一个验证没有通过的控件
										hasFocusField = true;
										f.clearInvalid();
										f.focus();
										f.validate();
									}
								}
							});
					return valid;
				},
				validRequired : function() {
					var valid = true;
					var hasFocusField = false;
					this.items.each(function(f) {
								// not valid when hide
								var validValue=true;
								if(f.allowBlank&&!this.editable){
									validValue=false;
								}
								if (validValue&&f.validate && !f.validate()) {
									valid = false;
									if (!hasFocusField) { // 聚焦第一个验证没有通过的控件
										hasFocusField = true;
										f.clearInvalid();
										f.focus();
										f.validate();
									}
								}
							});
					return valid;
				}
				
				
			})
}

// ***************************************************************************************//
// TreeRadioNodeUI //
// ***************************************************************************************//
if (Ext.tree.TreePanel) {
	Ext.override(Ext.tree.TreePanel, {
				initComponent : function() {
					Ext.tree.TreePanel.superclass.initComponent.call(this);

					if (!this.eventModel) {
						this.eventModel = new Ext.tree.TreeEventModel(this);
					} else {
						this.eventModel = new this.eventModel(this);
					}

					// initialize the loader
					var l = this.loader;
					if (!l) {
						l = new Ext.tree.TreeLoader({
									dataUrl : this.dataUrl,
									requestMethod : this.requestMethod
								});
					} else if (typeof l == 'object' && !l.load) {
						l = new Ext.tree.TreeLoader(l);
					}
					this.loader = l;

					this.nodeHash = {};

					/**
					 * The root node of this tree.
					 * 
					 * @type Ext.tree.TreeNode
					 * @property root
					 */
					if (this.root) {
						var r = this.root;
						delete this.root;
						this.setRootNode(r);
					}

					this.addEvents("append", "remove", "movenode", "insert",
							"beforeappend", "beforeremove", "beforemovenode",
							"beforeinsert", "beforeload", "load", "textchange",
							"beforeexpandnode", "beforecollapsenode",
							"expandnode", "disabledchange", "collapsenode",
							"beforeclick", "click", "checkchange", "dblclick",
							"contextmenu", "beforechildrenrendered",
							"startdrag", "enddrag", "dragdrop",
							"beforenodedrop", "nodedrop", "nodedragover");
					if (this.singleExpand) {
						this.on("beforeexpandnode", this.restrictExpand, this);
					}
				}

			})
	/**
	 * Artery TreeRadioEvent component
	 * 
	 * @author baon
	 * @date 29/05/2008
	 * 
	 * @class Ext.tusc.TextField
	 * @extends Ext.form.TextField
	 */
	Ext.tusc.TreeRadioEvent = Ext.extend(Ext.tree.TreeEventModel, {
				delegateClick : function(e, t) {
					if (!this.beforeEvent(e)) {
						return;
					}
					// modify
					if (e.getTarget('input[type=radio]', 1)) {
						this.onCheckboxClick(e, this.getNode(e));
					} else if (e.getTarget('.x-tree-ec-icon', 1)) {
						this.onIconClick(e, this.getNode(e));
					} else if (this.getNodeTarget(e)) {
						this.onNodeClick(e, this.getNode(e));
					}
				}
			})

	/**
	 * Artery TreeNodeUI component
	 * 
	 * @author baon
	 * @date 29/05/2008
	 * 
	 * @class Ext.tusc.TextField
	 * @extends Ext.form.TextField
	 */
	Ext.tree.TreeSingleNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
		// private

		renderElements : function(n, a, targetNode, bulkRender) {
			// add some indent caching, this helps performance when rendering a
			// large tree
			this.indentMarkup = n.parentNode
					? n.parentNode.ui.getChildIndent()
					: '';

			var cb = typeof a.checked == 'boolean';
			var imgTagHtml = "";
			if (a.useIcon != null && (!a.useIcon))
				imgTagHtml = "&nbsp;";
			else
				imgTagHtml = ['<img src="',
					a.icon || this.emptyIcon,
					'" class="x-tree-node-icon',
					(a.icon ? " x-tree-node-inline-icon" : ""),
					(a.iconCls ? " " + a.iconCls : ""),
					'" unselectable="on" />'].join('');
			var href = a.href ? a.href : Ext.isGecko ? "" : "#";
			
			var disablecheck = "";
			if (a.disablecheck)
				disablecheck = ' disabled="disabled" '
			var buf = [
					'<li class="x-tree-node" title="',
					a.title,
					'"><div ext:tree-node-id="',
					n.id,
					'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
					a.cls,
					'" unselectable="on">',
					'<span class="x-tree-node-indent">',
					this.indentMarkup,
					"</span>",
					'<img src="',
					this.emptyIcon,
					'" class="x-tree-ec-icon x-tree-elbow" />',
					imgTagHtml,
					cb
							? ('<input class="x-tree-node-cb" type="radio" style="vertical-align:middle;" name="singleRadio'
									+ n.attributes.uuid + '"  id="'+n.id+'_check" '+disablecheck+ (a.checked
									? 'checked="checked" />'
									: '/>'))
							: '',
					'<a hidefocus="on" class="x-tree-node-anchor" href="',
					href, '" tabIndex="1" ',
					a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
					'><span unselectable="on">', n.text, "</span></a></div>",
					'<ul class="x-tree-node-ct" style="display:none;"></ul>',
					"</li>"].join('');

			var nel;
			if (bulkRender !== true && n.nextSibling
					&& (nel = n.nextSibling.ui.getEl())) {
				this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
			} else {
				this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode,
						buf);
			}

			this.elNode = this.wrap.childNodes[0];
			this.ctNode = this.wrap.childNodes[1];
			var cs = this.elNode.childNodes;
			this.indentNode = cs[0];
			this.ecNode = cs[1];
			this.iconNode = cs[2];
			var index = 3;
			if (cb) {
				this.checkbox = cs[3];
				// fix for IE6
				this.checkbox.defaultChecked = this.checkbox.checked;
				index++;
			}
			this.anchor = cs[index];
			this.textNode = cs[index].firstChild;
		},
		// 以下两个方法为了防止roo节点删除子节点时报错的问题
		remove : function() {
			if (this.rendered) {
				// this.holder = document.createElement("div");
				// this.holder.appendChild(this.wrap);
				this.wrap.removeNode(true);
			}
		},

		destroy : function() {
			if (this.elNode) {
				Ext.dd.Registry.unregister(this.elNode.id);
			}
			delete this.elNode;
			delete this.ctNode;
			delete this.indentNode;
			delete this.ecNode;
			delete this.iconNode;
			delete this.checkbox;
			delete this.anchor;
			delete this.textNode;

			if (this.holder) {
				delete this.wrap;
				Ext.removeNode(this.holder);
				delete this.holder;
			} else {
				// Ext.removeNode(this.wrap);
				delete this.wrap;
			}
		}
	})

	// 树多选model
	Ext.tusc.MultiSelectModel = Ext.extend(Ext.tree.MultiSelectionModel, {
				select : function(node, e, keepExisting) {
					if (keepExisting != true) {
						this.clearSelections(true);
					}
					if (this.isSelected(node)) {
						// this.lastSelNode = node;
						this.unselect(node);
						return node;
					}
					this.selNodes.push(node);
					this.selMap[node.attributes.cid] = node;
					this.lastSelNode = node;
					node.ui.onSelectedChange(true);
					this.fireEvent("selectionchange", this, this.selNodes);
					return node;
				}
			})

	Ext.override(Ext.tree.TreeNodeUI, {

		renderElements : function(n, a, targetNode, bulkRender) {
			// add some indent caching, this helps performance when rendering a
			// large tree
			this.indentMarkup = n.parentNode
					? n.parentNode.ui.getChildIndent()
					: '';
			if (!Ext.isEmpty(a.onDblClickEvent)) {
				this.node.on('dblClick', a.onDblClickEvent, this);
			}
			//throw e;
			var cb = typeof a.checked == 'boolean';
			var imgHtml = "";
			var src = a.icon ? a.icon : this.emptyIcon;
			var imgClass = a.icon ? " x-tree-node-inline-icon" : "";
			var iconClass = a.iconCls ? " " + a.iconCls : "";
			if (a.useIcon != null && (!a.useIcon))
				imgHtml = "&nbsp;";
			else
				imgHtml = '<img src="' + src + '" class="x-tree-node-icon'
						+ imgClass + iconClass + '" unselectable="on" />';
			
			var disablecheck = "";
			if (a.disablecheck)
				disablecheck = ' disabled="disabled" '
			var href = a.href ? a.href : Ext.isGecko ? "" : "#";
			var buf = [
					'<li class="x-tree-node" title="',
					a.title,
					'"><div ext:tree-node-id="',
					n.id,
					'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
					a.cls,
					'" unselectable="on">',
					'<span class="x-tree-node-indent">',
					this.indentMarkup,
					"</span>",
					'<img src="',
					this.emptyIcon,
					'" class="x-tree-ec-icon x-tree-elbow" />',
					imgHtml,
					cb
							? ('<input class="x-tree-node-cb" type="checkbox" style="vertical-align:middle;" id="'+n.id+'_check" '+disablecheck+ (a.checked
									? 'checked="checked" />'
									: '/>'))
							: '',
					'<a hidefocus="on" class="x-tree-node-anchor" href="',
					href, '" tabIndex="1" ',
					a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
					'><span unselectable="on">', n.text, "</span></a></div>",
					'<ul class="x-tree-node-ct" style="display:none;"></ul>',
					"</li>"].join('');

			var nel;
			if (bulkRender !== true && n.nextSibling
					&& (nel = n.nextSibling.ui.getEl())) {
				this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
			} else {
				this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode,
						buf);
			}

			this.elNode = this.wrap.childNodes[0];
			this.ctNode = this.wrap.childNodes[1];
			var cs = this.elNode.childNodes;
			this.indentNode = cs[0];
			this.ecNode = cs[1];
			this.iconNode = cs[2];
			var index = 3;
			if (cb) {
				this.checkbox = cs[3];
				// fix for IE6
				this.checkbox.defaultChecked = this.checkbox.checked;
				index++;
			}
			if (cs[index]) {
				this.anchor = cs[index];
				this.textNode = cs[index].firstChild;
			}
		},
		/*
		 * 重写 Ext.tree.TreeNodeUI的onClick()和onDblClick()方法
		 * 当TreeNode节点生成时为disabled，TreeNodeUI的this.disabled为undefined
		 * 因此判断节点是否disabled时，应该加上对this.node.disabled的判断 hanf
		 */
		// private
		onDblClick : function(e) {
			e.preventDefault();
			if (this.disabled || this.node.disabled) {
				return;
			}
			if (this.checkbox && !this.checkbox.disabled) {
				this.toggleCheck();
			}
			if (!this.animating && this.node.isExpandable()) {
				this.node.toggle();
			}
			this.fireEvent("dblclick", this.node, e);
		},
		// private
		onClick : function(e) {
			if (this.dropping) {
				e.stopEvent();
				return;
			}
			if (this.fireEvent("beforeclick", this.node, e) !== false) {
				var a = e.getTarget('a');
				if (!(this.disabled || this.node.disabled)
						&& this.node.attributes.href && a) {
					this.fireEvent("click", this.node, e);
					return;
				} else if (a && e.ctrlKey) {
					e.stopEvent();
				}
				e.preventDefault();
				if (this.disabled || this.node.disabled) {
					return;
				}

				if (this.node.attributes.singleClickExpand && !this.animating
						&& this.node.isExpandable()) {
					this.node.toggle();
				}

				this.fireEvent("click", this.node, e);
			} else {
				e.stopEvent();
			}
		}
	})

}

/**
 * 去掉所有的阴影
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
if (Ext.Shadow) {
	Ext.override(Ext.Shadow, {
				show : function(target) {
				},
				isVisible : function() {
					return false;
				},
				realign : function(l, t, w, h) {
				},
				hide : function() {
				},
				setZIndex : function(z) {
				}
			})

}
/**
 * 默认生成mask
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
Ext.override(Ext.Window, {
			onRender : function(ct, position) {
				Ext.Window.superclass.onRender.call(this, ct, position);

				if (this.plain) {
					this.el.addClass('x-window-plain');
				}

				// this element allows the Window to be focused for keyboard
				// events
				this.focusEl = this.el.createChild({
							tag : 'a',
							href : '#',
							cls : 'x-dlg-focus',
							tabIndex : '-1',
							html : '&#160;'
						});
				this.focusEl.swallowEvent('click', true);

				this.proxy = this.el.createProxy('x-window-proxy');
				this.proxy.enableDisplayMode('block');

				// if(this.modal){
				this.mask = this.container.createChild({
							cls : 'ext-el-mask'
						}, this.el.dom);
				this.mask.enableDisplayMode('block');
				this.mask.hide();
				this.mon(this.mask, 'click', this.focus, this);
				// }
				this.initTools();
			},

			close : function() {
				if (this.closeAction == 'hide') {
					this.hide();
					return;
				}
				if (this.fireEvent("beforeclose", this) !== false) {
					this.hide(null, function() {
								this.fireEvent('close', this);
								this.destroy();
							}, this);
				}
			},

			beforeShow : function() {
				delete this.el.lastXY;
				delete this.el.lastLT;
				if (this.x === undefined || this.y === undefined) {
					var xy = this.el.getAlignToXY(this.container, 'c-c');
					var pos = this.el.translatePoints(xy[0], xy[1]);
					this.x = this.x === undefined ? pos.left : this.x;
					this.y = this.y === undefined ? pos.top : this.y;
				}
				this.el.setLeftTop(this.x, this.y);

				if (this.expandOnShow) {
					this.expand(false);
				}

				if (this.modal) {
					// Ext.getBody().addClass('x-body-masked');
					this.mask.setSize(Ext.getBody().getWidth(), Ext.getBody()
									.getHeight());
					this.mask.show();
				}
			},

			hide : function(animateTarget, cb, scope) {
				if (this.hidden || this.fireEvent('beforehide', this) === false) {
					return this;
				}
				if (cb) {
					this.on('hide', cb, scope, {
								single : true
							});
				}
				this.hidden = true;
				if (animateTarget !== undefined) {
					this.setAnimateTarget(animateTarget);
				}
				if (this.modal) {
					this.mask.hide();
					// Ext.getBody().removeClass('x-body-masked');
				}
				if (this.animateTarget) {
					this.animHide();
				} else {
					this.el.hide();
					this.afterHide();
				}
				return this;
			}
		})
/**
 * 在任意一个frame中点击鼠标左键都可关闭菜单
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
Ext.getDoc().on("mousedown", function(e) {
	// 关闭弹出的layer
	function closePopup(p, e) {
		if (p.Artery.plugin.PopupLayerMgr) {
			p.Artery.plugin.PopupLayerMgr.hideAll(e);
		}
	}
	var p = window;
	closePopup(p, e);
	try{
		while (p.parent != p) {
			p = p.parent;
			if (p.Ext.menu.MenuMgr) {
				p.Ext.menu.MenuMgr.hideAll();
			}
			closePopup(p);
		}
	}catch(e){}
	// p.Ext.menu.MenuMgr.hideAll.defer(100);
});

// 弹出层
Artery.plugin.PopupLayer = Ext.extend(Ext.Layer, {

			// PopupTrigger对象
			popupField : null,

			// 构造方法
			constructor : function(config, existingEl) {
				Artery.plugin.PopupLayer.superclass.constructor.call(this,
						config, existingEl);
				if (config && config.popupField) {
					this.popupField = config.popupField;
				} else {
					throw "popupField is empty";
				}
				if(this.callBack){
					this.callBack(this);
				}
			},

			// 显示layer后，注册到PopupLayerMgr中
			showAction : function() {
				Artery.plugin.PopupLayer.superclass.showAction.call(this);
				Artery.plugin.PopupLayerMgr.register(this);
			},

			// 隐藏弹出层
			popupHide : function(e) {
				try{
					this.popupField.collapseIf(e);
				}catch(e){}
			}
		});

Artery.plugin.PopupLayerMgr = (function() {

	// 所有弹出层对象
	var popups = {};

	// 关闭所有的popup layer
	function hideAll(e) {
		// 关闭当前页面的所有弹出层
		for (var p in popups) {
			popups[p].popupHide(e);
			if (!popups[p].isVisible()) {
				delete popups[p];
			}
		}

		// 如果有父页面，那么也关闭父页面的所有弹出层
		if (Artery.pwin != window) {
			Artery.pwin.Artery.plugin.PopupLayerMgr.hideAll();
		}
	}

	// 注册一个弹出的field
	function register(popuplayer) {
		var id = popuplayer.id;
		if (!Ext.isEmpty(id)) {
			popups[id] = popuplayer;
		}
	}

	return {
		hideAll : hideAll,
		register : register
	}
})();

/**
 * 菜单中的组件都应该可移动节点
 * 
 * @author baon
 * @date 21/05/2008
 */
Ext.override(Ext.layout.MenuLayout, {
	renderItem : function(c, position, target) {
		if (!this.itemTpl) {
			this.itemTpl = Ext.layout.MenuLayout.prototype.itemTpl = new Ext.XTemplate(
					'<li id="{itemId}" class="{itemCls}">',
					'<tpl if="needsIcon">',
					'<img src="{icon}" class="{iconCls}"/>', '</tpl>', '</li>');
		}

		if (c && !c.rendered) {
			if (Ext.isNumber(position)) {
				position = target.dom.childNodes[position];
			}
			var a = this.getItemArgs(c);
			// vvvvv
			if (!a.isMenuItem) {
				c.allowDomMove = true;
			}
			// The Component's positionEl is the <li> it is rendered into
			c.render(c.positionEl = position ? this.itemTpl.insertBefore(
					position, a, true) : this.itemTpl.append(target, a, true));

			// Link the containing <li> to the item.
			c.positionEl.menuItemId = c.itemId || c.id;
			// vvvvvv
			if (!a.isMenuItem) {
				c.el.addClass('x-menu-non-menuItem');
			}
			// If rendering a regular Component, and it needs an icon,
			// move the Component rightwards.
			if (!a.isMenuItem && a.needsIcon) {
				c.positionEl.addClass('x-menu-list-item-indent');
			}
		} else if (c && !this.isValidParent(c, target)) {
			if (Ext.isNumber(position)) {
				position = target.dom.childNodes[position];
			}
			target.dom.insertBefore(c.getActionEl().dom, position || null);
		}
	}
})

// 修改borderLayout，使之支持百分比
if (Ext.layout.BorderLayout) {
	Ext.override(Ext.layout.BorderLayout, {
		onLayout : function(ct, target) {
			var collapsed;
			if (!this.rendered) {
				target.addClass('x-border-layout-ct');
				var items = ct.items.items;
				collapsed = [];
				for (var i = 0, len = items.length; i < len; i++) {
					var c = items[i];
					var pos = c.region;
					// modify
					if (pos != 'center') {
						if (c.xheight && (c.xheight.indexOf('%') != -1)) {
							c.height = parseInt(target.getHeight()
									* (parseInt(c.xheight) / 100));
						}
						if (c.xwidth && (c.xwidth.indexOf('%') != -1)) {
							c.width = parseInt(target.getWidth()
									* (parseInt(c.xwidth) / 100));
						}
					}
					if (c.collapsed) {
						collapsed.push(c);
					}
					c.collapsed = false;
					if (!c.rendered) {
						c.cls = c.cls
								? c.cls + ' x-border-panel'
								: 'x-border-panel';
						c.render(target, i);
					}
					this[pos] = pos != 'center' && c.split
							? new Ext.layout.BorderLayout.SplitRegion(this,
									c.initialConfig, pos)
							: new Ext.layout.BorderLayout.Region(this,
									c.initialConfig, pos);
					this[pos].render(target, c);
				}
				this.rendered = true;
			}

			var size = target.getViewSize();
			if (size.width < 20 || size.height < 20) { // display none?
				if (collapsed) {
					this.restoreCollapsed = collapsed;
				}
				return;
			} else if (this.restoreCollapsed) {
				collapsed = this.restoreCollapsed;
				delete this.restoreCollapsed;
			}

			var w = size.width, h = size.height;
			var centerW = w, centerH = h, centerY = 0, centerX = 0;

			var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
			if (!c && Ext.layout.BorderLayout.WARN !== false) {
				throw 'No center region defined in BorderLayout ' + ct.id;
			}

			if (n && n.isVisible()) {
				var b = n.getSize();
				var m = n.getMargins();
				b.width = w - (m.left + m.right);
				b.x = m.left;
				b.y = m.top;
				centerY = b.height + b.y + m.bottom;
				centerH -= centerY;
				n.applyLayout(b);
			}
			if (s && s.isVisible()) {
				var b = s.getSize();
				var m = s.getMargins();
				b.width = w - (m.left + m.right);
				b.x = m.left;
				var totalHeight = (b.height + m.top + m.bottom);
				b.y = h - totalHeight + m.top;
				centerH -= totalHeight;
				s.applyLayout(b);
			}
			if (west && west.isVisible()) {
				var b = west.getSize();
				var m = west.getMargins();
				b.height = centerH - (m.top + m.bottom);
				b.x = m.left;
				b.y = centerY + m.top;
				var totalWidth = (b.width + m.left + m.right);
				centerX += totalWidth;
				centerW -= totalWidth;
				west.applyLayout(b);
			}
			if (e && e.isVisible()) {
				var b = e.getSize();
				var m = e.getMargins();
				b.height = centerH - (m.top + m.bottom);
				var totalWidth = (b.width + m.left + m.right);
				b.x = w - totalWidth + m.left;
				b.y = centerY + m.top;
				centerW -= totalWidth;
				e.applyLayout(b);
			}
			if (c) {
				var m = c.getMargins();
				var centerBox = {
					x : centerX + m.left,
					y : centerY + m.top,
					width : centerW - (m.left + m.right),
					height : centerH - (m.top + m.bottom)
				};
				c.applyLayout(centerBox);
			}
			if (collapsed) {
				for (var i = 0, len = collapsed.length; i < len; i++) {
					collapsed[i].collapse(false);
				}
			}
			if (Ext.isIE && Ext.isStrict) { // workaround IE strict repainting
				// issue
				target.repaint();
			}
		}
	})

}

if(Ext.menu.CheckItem){
	Ext.override(Ext.menu.CheckItem, {
		//如果菜单项是checkbox形式，则点击选中一个菜单项后不会隐藏菜单，可以继续选中/取消选中菜单项
		handleClick : function(e){
       		if(!this.disabled && !(this.checked && this.group)){// disable unselect on radio item
           		this.setChecked(!this.checked);
       		}
       		if(!this.href){ // if no link defined, stop the event automatically
            	e.stopEvent();
        	}
       		if(this.hideOnClick && this.group){
            	this.parentMenu.hide.defer(this.clickHideDelay, this.parentMenu, [true]);
        	}
    	}
    });
}

/** 覆盖Ext.data.SimpleStore对象的insert方法，在插入的同时将数据插入到snapshot中 */ 
if (Ext.data.SimpleStore) {
    Ext.override(Ext.data.SimpleStore,{
        insert : function(index, records){
            records = [].concat(records);
            for(var i = 0, len = records.length; i < len; i++){
                this.data.insert(index, records[i]);
                if(this.snapshot){
                    this.snapshot.insert(index, records[i]);
                }
                records[i].join(this);
            }
            this.fireEvent('add', this, records, index);
        }
    })
}

Ext.override(Ext.tree.TreePanel, {
	onRender : function(ct, position){
        Ext.tree.TreePanel.superclass.onRender.call(this, ct, position);
        this.el.addClass('x-tree');
        this.el.addClass('x-menu-arteryPopup');
        this.innerCt = this.body.createChild({tag:"ul",
               cls:"x-tree-root-ct " +
               (this.useArrows ? 'x-tree-arrows' : this.lines ? "x-tree-lines" : "x-tree-no-lines")});
    }
})

Ext.override(Ext.tree.AsyncTreeNode,{
	reload : function(callback, scope){
        this.collapse(false, false);
        while(this.firstChild){
            this.removeChild(this.firstChild).destroy();
        }
        this.childrenRendered = false;
        this.loaded = false;
        if(this.isHiddenRoot()){
            this.expanded = false;
        }
        this.expand(false, false, callback, scope);
        if(this.ownerTree&&this.ownerTree.clearClickNode){
        	this.ownerTree.clearClickNode();
        }
    }
})
