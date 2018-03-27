/**
 * form表单制作 参数界面
 */
AtyCon.Form_Params = function(config){
	var cf = config || {};
	cf.layout = "fit";
    this.initStore();
    this.initGridPanel();
    cf.items = [this.mainPnl];
	AtyCon.Form_Params.superclass.constructor.call(this, cf);
};

Ext.extend(AtyCon.Form_Params, Ext.Panel, {
    store: null,
    mainPnl: null,
    comboData:[
    	['1','数据源相关参数'],
    	['2','普通参数']
    ],
    
   	eformtpl: null,
   	
   	toolbar_save: null,
   	
   	/**
   	 * 记录参数的修改状态
   	 */
   	isModifyed: false,
    
    /**
     * 初始化store
     */
    initStore: function(){
		this.store = new Ext.data.Store({
			proxy: new Ext.data.MemoryProxy([]),
			reader: new Ext.data.ArrayReader({}, [
            	{name: 'name'},
            	{name: 'showName'},
            	//{name: 'type'},
            	{name: 'value'},
            	{name: 'pvalue'}
        	])
		});
		this.store.load();  
    },
    
    /**
     * 保存入口参数
     */
    saveHandler: function(){
        var jsonArray = [];
        this.store.each(function(item) {
            jsonArray.push(item.data);
        });
        
        //校验，（1）id不能重复；（2）id不可空
        var sValid=",";
        for(var i=0;i<jsonArray.length;i++){
            if(Ext.isEmpty(jsonArray[i].name.trim())){
              showTips("验证出错：参数名称不可为空",4);
              return false;
            }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
              showTips("验证出错：参数名称不可重复",4);
              return false;
            }
            sValid+=jsonArray[i].name.trim()+",";
        }
        
        var docParam=loadXMLString("<?xml version='1.0' encoding='gbk'?><params/>");
        var rootEl = docParam.documentElement;
        
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docParam.createElement("param");
            // 处理名称
            var attrName = docParam.createAttribute("name");
	        attrName.value = jsonArray[i].name;
	        newNode.setAttributeNode(attrName);
            // 处理显示名
            var attrShowName = docParam.createAttribute("showName");
            attrShowName.value = jsonArray[i].showName;
            newNode.setAttributeNode(attrShowName);
            // 处理类型
            /*var attrType = docParam.createAttribute("type");
	        attrType.value = jsonArray[i].type;
	        newNode.setAttributeNode(attrType);*/
            // 处理默认值
            var attrValue = docParam.createAttribute("value");
	        attrValue.value = jsonArray[i].value;
	        newNode.setAttributeNode(attrValue);
            // 处理预览默认值
            var attrPreviewValue = docParam.createAttribute("pvalue");
            attrPreviewValue.value = jsonArray[i].pvalue;
            newNode.setAttributeNode(attrPreviewValue);
            rootEl.appendChild(newNode);
        }
        var pp = this;
        var map = new Map();
        map.put("key", "formmake.saveparams");
        map.put("eformid", this.eformtpl.id);
        map.put("complibId", this.eformtpl.complibId);
        map.put("eformtype", this.eformtpl.type);
        map.put("params",XmlUtil.getXml(docParam));
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            if(msg=="ok"){
                showTips("保存表单入口参数成功",2);
            }else{
                showTips("未知错误：保存表单入口参数失败",4);
            }
            pp.isModifyed  = false;
            pp.store.commitChanges();
        });
        query.send();
	},
    
    /**
     * 添加一个参数
     */
    addHandler: function(){
		var s = this.store.getCount();
		var p = new Ext.data.Record({
			name:'param'+(s+1), type:'1', value:'', pvalue:'',showName:''
		});
		this.mainPnl.stopEditing();
		this.store.add(p);
		this.mainPnl.view.refresh();
		this.mainPnl.startEditing(s, 1);
		this.isModifyed = true;
    },
    
    /**
     * 删除一个参数
     */
    delHandler: function(){
        var sm = this.mainPnl.getSelectionModel();
        var cell = sm.getSelectedCell();
        if(!cell){
        	return;
        }
        var record = this.store.getAt(cell[0]);
        if(!record){
        	return;
        }
        var pp = this;
        Ext.Msg.confirm('信息', '确定要删除参数么？', function(btn){
            if (btn == 'yes') {
                pp.store.remove(record);
                pp.mainPnl.view.refresh();
                pp.isModifyed = true;
            }
        });
	},
	
	/**
	 * 预览表单
	 */
    previewForm: function(runTimeType){
    	var url = "";
    	if(this.eformtpl.type == '1'){
			url = sys.getContextPath() + '/artery/form/dealParse.do?action=previewForm&formid=' + this.eformtpl.id;
		}else if(this.eformtpl.type == '3'){
		  	url = sys.getContextPath() + '/artery/writparse.do?action=previewWrit&runtype=insert&writtplid=' + this.eformtpl.id;
	  	}else if(this.eformtpl.type == "5"){
	        url = sys.getContextPath() + "/frameparse.do?action=previewFrame&id=" + this.eformtpl.id;
	    }
	    url += "&complibId=" + this.eformtpl.complibId
	    
	    if(runTimeType){
	        url += "&runTimeType="+runTimeType;
	    }
	  	win = Artery.open({name:'previewWin',feature:{status:'yes',location:'yes'}});
	  	win.location.href=url;
	  	win.focus();
	},
	
	/**
	 * 初始化toolbar
	 */
	initToolbar: function(){
		var pp = this;
		this.toolbar_save = new Ext.Toolbar.Button({
            text: '保存',
            tooltip: '保存参数<br/>HotKey:Ctrl+S',
            cls : 'x-btn-text-icon save',
            handler: function(){
            	pp.saveHandler();
            }
        });
        
        //判断是否是文书，用于隐藏“预览(展示)”按钮
        var isWrit = false;
        if(typeof(eformtpl) != 'undefined'){
	       	isWrit = (eformtpl.formtype==3);
        }
        
        var tb =new Ext.Toolbar([
        	this.toolbar_save,'-',{
            text: '添加参数',
            tooltip: '添加一个新参数<br/>HotKey:Ctrl+A',
            cls : 'x-btn-text-icon add',
            handler: function(){
            	pp.addHandler();
            }
        }, '-', {
            text: '删除参数',
            tooltip: '删除当前选中的参数<br>删除后将无法恢复，需谨慎操作<br/>HotKey:Delete',
            cls : 'x-btn-text-icon delete',
            handler: function(){
            	pp.delHandler();
            }
        },'->',{
            tooltip: '预览插入表单效果',
            cls: 'x-btn-text-icon preview-i',
            handler: function(){
                pp.previewForm("insert");
            }
        },{
            tooltip: '预览更新表单效果',
            cls: 'x-btn-text-icon preview-u',
            handler: function(){
                pp.previewForm("update");
            }
        },{
            hidden : isWrit,
            tooltip: '预览展示表单（只读）效果',
            cls: 'x-btn-text-icon preview-d',
            handler : function(){
                pp.previewForm("display");
            }
        }, {
			tooltip : '预览打印表单效果',
			cls : 'x-btn-text-icon preview-p',
			handler : function() {
				previewForm("print");
			}
		}]);
        return tb;
	},
	
	/**
	 * 初始化GridPanel
	 */
	initGridPanel: function(){
		var tb = this.initToolbar();
		var pp = this;
		var cm = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(),{
            header:'名称',
            dataIndex:'name',
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false
                })
            },{
                header:'显示名',
                dataIndex:'showName',
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false
                })
           /* },{
                header:'类型',
                dataIndex:'type',
                sortable:true,
                editor:new Ext.form.ComboBox({
                    store: new Ext.data.SimpleStore({
                        fields:['value','text'],
                        data: pp.comboData
                    }),
                    emptyText: '请选择',
                    mode: 'local',
                    triggerAction: 'all',
                    valueField: 'value',
                    displayField: 'text',
                    editable: false,
                    value:'1'
                }),
                renderer: function(value){
                    return pp.comboData[value-1][1];
                }*/
            },{
                header:'默认值',
                dataIndex:'value',
                sortable:true,
                editor:new Ext.form.TextField()
            },{
                header:'预览值',
                dataIndex: 'pvalue',
                sortable: true,
                editor: new Ext.form.TextField()
            }
        ]);  
        this.mainPnl=new Ext.grid.EditorGridPanel({
            cm:cm,
            store: this.store,
            loadMask: true,
            border:false,
            stripeRows:true,
            clicksToEdit:1,
            viewConfig: {
                forceFit: true,
                scrollOffset:2 // the grid will never have scrollbars
            },
            tbar: tb
        });
	},
	
	/**
	 * 解析参数XML，生成Record
	 */
	loadParamFromStr: function(paramStr){
		this.eformtpl.params = paramStr;
      	this.eformtpl.dom=loadXMLString(this.eformtpl.params);
      	var rootEl=this.eformtpl.dom.documentElement;
       	for(var i=0;i<rootEl.childNodes.length;i++){
           	var subEl = rootEl.childNodes[i];
           	if(subEl.nodeType!=1){
           		continue;
           	}
           	var pValue = subEl.getAttribute("pvalue");
           	if(!pValue){
               	pValue = "";
           	}
           	var showName = subEl.getAttribute("showName");
           	if(!showName){
               	showName = "";
           	}
           	
           	var p = new Ext.data.Record({
               	name: subEl.getAttribute("name"),
               	showName: showName, 
               	//type: subEl.getAttribute("type"), 
               	value: subEl.getAttribute("value"),
               	pvalue: pValue
           	});
           	this.store.addSorted(p);
       	}
	},
	
	/**
	 * 显示指定form的参数
	 */
	showParams: function(cf){
		this.eformtpl = {
			id: cf.formid,
			type: cf.formtype,
			complibId: cf.complibId
		};
		this.store.removeAll();
		var pp = this;
		// 通过ajax方法，加载xml
      	var map = new Map();
      	map.put("key", "formmake.loadParamsXML");
      	map.put("formid", cf.formid);
      	map.put("complibId", cf.complibId);
      	map.put("formtype", cf.formtype);
      	var query = new QueryObj(map,function(query){
      		var po = Ext.decode(query.getDetail());
      		pp.loadParamFromStr(po.params);
      		pp.isModifyed = false;
      	});
      	query.send();
	},
	
	/**
	 * 检查此组件是否修改
	 */
	isModify: function(){
		this.mainPnl.stopEditing();
		if(this.store.modified && this.store.modified.length>0){
			return true;
		}
		return this.isModifyed;
	}
});