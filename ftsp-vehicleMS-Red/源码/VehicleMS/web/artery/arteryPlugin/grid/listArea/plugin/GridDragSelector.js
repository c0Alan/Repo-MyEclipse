/**
 * Ext.ux.grid DragSelector Class
 * 
 * @author Claudio Walser aka Foggy cwa[at]uwd.ch
 * @copyright 2007-2008, UWD GmbH, all rights reserved.
 * 
 * 
 * License: Ext.ux.grid DragSelector is licensed under the terms of the Open
 * Source LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 * 
 */
Ext.ux.grid={};

Ext.ux.grid.DragSelector = function(cfg) {
	cfg = cfg || {};
	var rs, rsOrig, objectsSelected = [];
	var grid, view, regions, proxy, tracker, selModel, scroller;
	var bodyRegion, mainRegion, dragRegion = new Ext.lib.Region(0, 0, 0, 0);
	var dragSafe = cfg.dragSafe === true;
	var ctrlState, shiftState, isDragging = false;
	var scrollTopStart, scrollTop = 0;

	this.init = function(cmp) {
		grid = cmp;
		view = grid.getView();
		selModel = grid.getSelectionModel();
		grid.on('render', onRender);
		grid.on('bodyscroll', syncScroll);
	};

	function syncScroll(e) {
		syncRowRegions();
		var top = scroller.getScroll().top;
		scrollTop = top - scrollTopStart;
		if (isDragging) {
			onDrag(e, true);
		}
	}

	function fillAllRegions() {
		mainRegion = scroller.getRegion();
		bodyRegion = scroller.getRegion();
		objectsSelected = [];
		var itemSelector = 'div.x-grid3-row';
		var mainElement = view.el.dom;
		Ext.each(Ext.query(itemSelector, mainElement), function(el) {
					objectsSelected[objectsSelected.length] = selModel
							.isSelected(objectsSelected.length);
				});
		fillRowRegions();
		syncScroll();
	}

	function fillRowRegions() {
		rs = [];
		rsOrig = [];
		var itemSelector = 'div.x-grid3-row';
		var mainElement = view.el.dom;
		Ext.each(Ext.query(itemSelector, mainElement), function(el) {
					rsOrig[rsOrig.length] = Ext.get(el).getRegion();
					rs[rs.length] = Ext.get(el).getRegion();
				});
	}

	function syncRowRegions() {
		fillRowRegions();
	}

	function cancelClick(e) {
		ctrlState = e.ctrlKey;
		shiftState = e.shiftKey;
		grid.stopEditing();
		var target = e.getTarget();
		if (!ctrlState && !shiftState && target.className === 'x-grid3-body') {
			selModel.clearSelections();
		}
		return true;
	}

	function onBeforeStart(e) {
		// return false if is a right mouseclick
		if (e.button === 2) {
			return false;
		}
		// return false if any grid editor is active
		if (grid.activeEditor && grid.activeEditor !== null) {
			return false;
		}

		// return false if the header was clicked
		if (e.getPageY() <= view.el.getY() + 25) {
			return false;
		}
		// scrollbar fix from digitalbucket.net :)
		if (e.getPageX() > view.el.getX() + view.el.dom.clientWidth - 20) {
			return false;
		}

		// call cancelClick
		cancelClick(e);
		return !dragSafe || e.target == view.el.dom;
	}

	function onStart(e) {
		scrollTopStart = scroller.getScroll().top;
		fillAllRegions();
		if (!proxy) {
			proxy = view.el.createChild({
						cls : 'x-view-selector'
					});
		} else {
			proxy.setDisplayed('block');
		}
		isDragging = true;
	}

	function onDrag(e, scaleSelector) {
		var startXY = tracker.startXY;
		var xy = tracker.getXY();
		if (xy[0] < startXY[0] && !scaleSelector) {
			xy[0] += 2;
		}
		if (scrollTop >= 0) {
			if ((startXY[1] - scrollTop) <= xy[1]) {
				var y = startXY[1] - scrollTop;
				var h = Math.abs(y - xy[1]);
			} else {
				var y = xy[1];
				var h = Math.abs(startXY[1] - xy[1]) - scrollTop;
			}
			var x = Math.min(startXY[0], xy[0]);
			var w = Math.abs(startXY[0] - xy[0]);
			bodyRegion.top -= scrollTop;
		} else {
			if ((startXY[1] - scrollTop) < xy[1]) {
				var y = startXY[1] - scrollTop;
				var h = Math.abs(y - xy[1]);
			} else {
				var y = xy[1]; // richtig in jedem fall
				var h = Math.abs((startXY[1] - scrollTop) - xy[1]);
			}

			var x = Math.min(startXY[0], xy[0]);
			var w = Math.abs(startXY[0] - xy[0]);

			bodyRegion.bottom -= scrollTop;
		}
		// set this values
		dragRegion.left = x;
		dragRegion.top = y;
		dragRegion.right = x + w;
		dragRegion.bottom = y + h;

		dragRegion.constrainTo(bodyRegion);
		proxy.setRegion(dragRegion);

		for (var i = 0, len = rs.length; i < len; i++) {
			var r = rs[i], sel = dragRegion.intersect(r);
			var selected = selModel.isSelected(i);
			var selectedBefore = objectsSelected[i];

			if (ctrlState) {
				if (selectedBefore) {
					if (sel && selected) {
						selModel.deselectRow(i);
					} else if (!sel && !selected) {
						selModel.selectRow(i, true);
					}
				} else {
					if (sel && !selected) {
						selModel.selectRow(i, true);
					} else if (!sel && selected) {
						selModel.deselectRow(i);
					}
				}
			} else {
				if (sel && !selected) {
					selModel.selectRow(i, true);
				} else if (!sel && selected) {
					selModel.deselectRow(i);
				}
			}

		}

		if (xy[1] + 10 >= mainRegion.bottom) {
			// slow up for ie
			if (Ext.isIE) {
				setTimeout(function() {
							scroller.scrollTo('top', scroller.getScroll().top
											+ 40);
						}, 100);
			} else {
				scroller.scrollTo('top', scroller.getScroll().top + 40);
			}
		}

		if (xy[1] - 10 <= mainRegion.top) {
			// slow up for ie
			if (Ext.isIE) {
				setTimeout(function() {
							scroller.scrollTo('top', scroller.getScroll().top
											- 40);
						}, 100);
			} else {
				scroller.scrollTo('top', scroller.getScroll().top - 40);
			}
		}
	}

	function onEnd(e) {
		isDragging = false;
		if (proxy) {
			proxy.setDisplayed(false);
		}
	}

	function onRender(view) {
		tracker = new Ext.dd.DragTracker({
					onBeforeStart : onBeforeStart,
					onStart : onStart,
					onDrag : onDrag,
					onEnd : onEnd
				});
		tracker.initEl(view.el);
		scroller = Ext.get(grid.getView().scroller);
	}
};
