/*******************************************************************************
 * 此处为根据summer需求所写的专用函数，可单独封装为一JS文件
 ******************************************************************************/

/**
 * 显示下拉菜单
 * 
 * @param menu DropTree
 * @param createMenuCallBackFunc 创建下拉树菜单的回调函数
 */
function dropMenu(menu, createMenuCallBackFunc){
    menu = createDropMenu(menu, createMenuCallBackFunc);
    menu.tree.selectChanged = false;
    menu.showDropDownList(true); // 显示下拉树
}

/**
 * 创建下拉菜单，不显示
 * 
 * @param menu DropTree
 * @param createMenuCallBackFunc 创建下拉树菜单的回调函数
 */
function createDropMenu(menu, createMenuCallBackFunc){
    if (typeof(menu) == "undefined") {
        menu = createMenuCallBackFunc();
        // 创建菜单按钮
        menu.createButton();
        menu.srcRoot = menu.tree.getRootItem(); // 取得根节点
    }
    return menu;
}
/**
 * 选择或取消选择指定节点
 * 
 * @param {} item 节点ID
 * @param {} state 是否选择.不指定的话,将改变节点当前的选择状态(取反)
 */
DropTree.prototype.checkItem = function(item, state){
    if (state == null) {
        state = !this.tree.isItemChecked(item);
    }
    // 设定缺省被点击的节点(Id和节点对象均可)
    if (this.tree.radioOn) {
        this.tree.setRadioCheck(item, state);
        // 设置改变状态为true
        this.tree.selectChanged = true;
    } else if (this.tree.checkBoxOn) {
        this.tree.setCheck(item, state);
        // 设置改变状态为true
        this.tree.selectChanged = true;
    }
    // trigger
    dealSelect4DropTree(this);
}
/**
 * 处理选择之后,确定事件的回调函数 收起菜单时激发确定事件
 * 
 * @param dropTree DropTree
 */
function dealSelect4DropTree(menu){
    // modified by limin 检查选项是否变化
    if (!menu.tree.selectChanged) {
        return;
    }

    var textfieldShow = menu.getParentElement().firstChild; // 取得当前下拉树菜单所依附的td
    var textfieldSend = menu.getParentElement().lastChild;
    var textShow = "";
    // 此处多加了一个分号，是为了在此变量中判断主键是否存在使用的，要保证每个主键的两边都有分号
    // 在传到页面之前，就把这第一个分号给去掉了
    var textSend = ";";

    // 当不是[全选]状态时: 处理[动态加载]节点已选择情况
    // 即：[全选]只能选中已加载的节点(即使已选中的节点,只要尚未加载也不能被选中)
    if (menu.tree.isDynamicLoad() && menu.tree._selectAllState != 1) {
        var arrSelected = menu.tree.selectedDynamic;
        if (arrSelected) {
            for (var i = 0; i < arrSelected.length; i++) {
                if (menu.tree.getNode(arrSelected[i].id) == 0) {
                    if (menu.tree.saveType == 'bitCode') {
                        textSend = textSend | (1 << (selectedNodes[i].id - 1));
                    } else {
                        if (textSend.indexOf(";" + arrSelected[i].id + ";") != -1) {
                            continue;
                        }
                        textSend += arrSelected[i].id + ";";
                    }
                    textShow += arrSelected[i].value + ";";
                }
            }
        }
    }

    if (menu.tree.radioOn) {
        textShow = "";
        textSend = "";
        var selectedNode = menu.tree.getSelectedRadioItem(); // 当前被选择的节点对象
        if (selectedNode) {
            var image = selectedNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
            if (image.style.display != "none") {
                textShow = selectedNode.label;
                if (menu.needWholename) {
                    var parentItem = selectedNode.getParentItem();
                    while (parentItem) {
                        if (parentItem.getLevel() == 0)
                            break;
                        textShow = parentItem.label + "-" + textShow;
                        parentItem = parentItem.getParentItem();
                    }
                }
                textSend = selectedNode.id;
                menu.tree.selectedDynamic = null;
                menu.tree.u_selected = "";
            }
        }
    } else if (menu.tree.checkBoxOn) {
        var selectedNodes = menu.tree.getCheckedItems();
        if (selectedNodes && selectedNodes.length > 0) {
            for (var i = 0; i < selectedNodes.length; i++) {
                var image = selectedNodes[i].htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
                var label = selectedNodes[i].label;
                if (label.indexOf("加载中") != -1 || label == ""
                        || image.style.display == "none") {// 加载中
                    continue;
                }
                if (menu.tree.u_organType
                        && selectedNodes[i].organType
                        && (menu.tree.u_organType != selectedNodes[i].organType)) {
                    continue;
                }

                // add by wangtt for saving bitCode begin
                if (menu.tree.saveType == 'bitCode') {
                    textSend = textSend | (1 << (selectedNodes[i].id - 1));
                } else {
                	if (textSend.indexOf(";" + selectedNodes[i].id + ";") != -1) {
                        continue;
                    }
                    textSend += selectedNodes[i].id + ";";
                }
                // add by wangtt for saving bitCode end
                var selectedName = selectedNodes[i].label;
                if (menu.needWholename) {
                    var parentItem = selectedNodes[i].getParentItem();
                    while (parentItem) {
                        if (parentItem.getLevel() == 0)
                            break;
                        selectedName = parentItem.label + "-" + selectedName;
                        parentItem = parentItem.getParentItem();
                    }
                }
                textShow += selectedName + ";";
            }
            textShow = textShow.substring(0, textShow.length - 1);
            // 把这个字符串用来分隔主键的第一个分号去掉，因为后台其他代码都不处理第一个分号，历史问题
            textSend = textSend.substring(1, textSend.length);
        }
    }

    textfieldSend.value = textSend;
    textfieldShow.value = textShow;

    menu.tree.selectChanged = false;
}

XTree.ROOTID = "0000000000";
XTree.pepareOrganCodeNew = function(tree, item){
    var map = new Map();
    map.put("key", "pub.code.loadCode");
    map.put("treeType", "newOrganCode");

    map.put("provider", tree.u_provider ? tree.u_provider : "");
    map.put("loader", tree.u_loader ? tree.u_loader : "");
    map.put("organType", tree.u_organType ? tree.u_organType : "");
    map.put("selected", tree.u_selected ? tree.u_selected : "");
    map.put("filter", tree.u_filter ? tree.u_filter : "");

    map.put("code", item.entryId);
    map.put("isChecked", item.isChecked());
    map.put("currentLevel", tree.getLevel(item.getItemId()));

    return map;
}
/**
 * 准备ajax动态加载的参数.与v2.0的兼容.
 */
XTree.prototype.prepare = function(tree, item){
    var map = new Map();
    map.put("key", "pub.code.loadCode");
    map.put("code", item.getItemId());
    map.put("treeType", this.u_treeType ? this.u_treeType : "");

    map.put("codeType", this.u_codeType ? this.u_codeType : "");
    map.put("filterClass", this.u_filterClass ? this.u_filterClass : "");
    map.put("showLevel", this.u_showLevel ? this.u_showLevel : "");
    map.put("selected", this.u_selected ? this.u_selected : "");
    map.put("filter", this.u_filter ? this.u_filter : "");
    map.put("onlyselleaf", this.u_onlyselleaf ? this.u_onlyselleaf : "");
    map.put("organType", this.u_organType ? this.u_organType : "");
    map.put("organScope", this.u_organScope ? this.u_organScope : "");
    map.put("mainUrl", this.u_mainUrl ? this.u_mainUrl : "");
    map.put("target", this.u_target ? this.u_target : "");
    map.put("empExpression", this.u_empExpression ? this.u_empExpression : "");
    map.put("deptExpression", this.u_deptExpression
                ? this.u_deptExpression
                : "");
    map.put("corpExpression", this.u_corpExpression
                ? this.u_corpExpression
                : "");
    map.put("isStrict", this.u_isStrict ? this.u_isStrict : "");
    map.put("selectAllState", this._selectAllState);
    map.put("isChecked", item.isChecked());
    map.put("currentLevel", this.getLevel(item.getItemId()));
    // limin added
    map.put("showInvalid", this.u_showInvalid ? this.u_showInvalid : "");

    return map;
}
/**
 * 动态加载特定节点下所有的一级子节点
 * 
 * @param action string 操作类型 "create" : 从根节点开始创建整棵树 "loadTreeNode" :
 *            创建特定节点下所有一级子节点
 * @param nodeId string 根节点Id
 */
XTree.prototype.loadTreeFromXML = function(item){
    // debugger;
    var self = this;
    var map;
    try {
        // alert(self.prepare);
        // alert(item);
        map = self.prepare(self, item);
    } catch (e) {
        alert(e.description);
        return;
    }

    var query = new QueryObj(map, function(){
        var xmlObj = query.getDetail();
        var nodes = xmlObj.getElementsByTagName("node");
        if (!nodes || nodes.length == 0) {
            // window.alert(query.currNode.getItemText());
            if (query.currNode.getChildrenCount() > 0
                    && query.currNode.childNodes[0].getItemText() == "加载中...") {
                query.currNode.clearChildren(); // 清空当前所有子节点
                query.currNode.setLoaded(true);
            }
            return;
        }

        // debugger;
        for (var i = 0; i < nodes.length; i = i + 1) {
            // 取得单一节点详细信息
            var node = nodes[i];
            var id = node.getAttribute("id");
            var entryId = node.getAttribute("entryId");
            var organType = node.getAttribute("organType");
            var content = node.getElementsByTagName("content")[0].text;
            var parentId = node.getElementsByTagName("parentId")[0].text;
            var canselect = node.getElementsByTagName("canselect")[0].text;
            var haschild = node.getElementsByTagName("haschild")[0].text;
            var mainUrl = null;
            var target = null;
            var showlink = false;
            try {
                mainUrl = node.getElementsByTagName("mainUrl")[0].text;
                target = node.getElementsByTagName("target")[0].text;
                showlink = node.getElementsByTagName("showlink")[0].text;
            } catch (e) {
            }
            var selected = node.getElementsByTagName("selected")[0];
            if (selected) {
                // 判断当前的全选状态： 1-选择 0-去除 (@see DropTree.prototype.selectAll)
                // 如果是[清除]状态，则不选择
                selected = (self._selectAllState == 0)
                        ? "false"
                        : selected.firstChild.data;
            }

            // 取得父节点对象
            var parentNode = (parentId == "" || parentId == null
                    || parentId == "null" || parentId == DropTree.ROOTID)
                    ? self.getRootItem()
                    : self.getNode(parentId);
            if (!typeof(parentNode) == "string") {
                continue;
            }
            if (parentNode.getChildrenCount() > 0
                    && parentNode.childNodes[0].getItemText() == "加载中...") {// 加载中...
                parentNode.clearChildren(); // 清空当前所有子节点
                parentNode.setLoaded(true);
            }

            var mode_reverse = (!canselect || canselect == "false")
                    ? XTree.MODE_REVERSE
                    : "";
            var mode_checked = (selected && selected == "true")
                    ? XTree.MODE_CHECKED
                    : "";
            var mode = mode_reverse + "," + mode_checked;
            var nodeItem;
            if (mainUrl && showlink != null && showlink != ""
                    && showlink != "null") {
            	//modifyed by zhjing 2012-01-30
            	//修正了dd标签动态生成节点链接地址错误的bug,
            	//需要和最新的CodeDynamicLogic.java配合使用
                nodeItem = parentNode.appendChild(content, id, null, mode,
                    mainUrl+showlink, target);
                //nodeItem = parentNode.appendChild(content, id, null, mode,
                //mainUrl, target);
            } else {
                nodeItem = parentNode.appendChild(content, id, null, mode);
            }
            // zhangjy-为新标签的扩展:将entryId附加为js对象的属性
            nodeItem.entryId = entryId;
            nodeItem.organType = organType;

            if (haschild && haschild == "true") {
                if (!this.u_treeType) {
                    var mode = XTree.MODE_REVERSE;
                }
                var nodeWait = nodeItem.appendChild("加载中...", null, null, mode);// 加载中...
                nodeWait.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0].style.display = 'none';
                // debugger;
                nodeItem.setLoaded(false);
                nodeItem.setExpanded(false);
            }

            if (selected && selected == "true") {
                // 设定缺省被点击的节点(Id和节点对象均可)
                if (self.radioOn)
                    self.setRadioCheck(nodeItem, true);
                else if (self.checkBoxOn) {
                    self.setCheck(nodeItem, true);
                }
                // 展开缺省被点击的节点
                // self.tree.openItem(nodeItem);
            }
        }

    });
    query.currNode = item;
    query.send();
}