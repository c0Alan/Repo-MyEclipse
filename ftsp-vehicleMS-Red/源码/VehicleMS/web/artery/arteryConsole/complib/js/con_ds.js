/**
 * form表单制作 数据源配置
 */
AtyCon.Form_DS = function(config){
	var cf = config || {};
	cf.layout = "fit";
    this.initStore();
    this.initSqlWindow();
    this.initGridPanel();
    cf.items = [this.mainPnl];
	AtyCon.Form_DS.superclass.constructor.call(this, cf);
};

Ext.extend(AtyCon.Form_DS, Ext.Panel, {
    store: null,
    mainPnl: null,
   	
   	eformtpl: null,
   	
   	toolbar_save: null,
   	
   	isModifyed: false,
   	
    /**
     * 初始化store
     */
    initStore: function(){
		this.store = new Ext.data.Store({
			proxy: new Ext.data.MemoryProxy([]),
			reader: new Ext.data.ArrayReader({}, [
				{name: 'dsName'},
				{name: 'name'},
				{name: 'type'},
				{name: 'value'}
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
        //校验，（1）id不能重复；（2）id不可空；（3）sql不可空
        var sValid=",";
        for(var i=0;i<jsonArray.length;i++){
            if(Ext.isEmpty(jsonArray[i].name.trim())){
            	showTips("验证出错：查询id不可为空",4);
            	return false;
            }
//            if(Ext.isEmpty(jsonArray[i].value) || Ext.isEmpty(Ext.decode(jsonArray[i].value).trim())){
//            	showTips("验证出错：查询sql不可为空",4);
//            	return false;
//            }
            if(sValid.indexOf(","+jsonArray[i].name.trim()+",")>-1){
            	showTips("验证出错：查询id不可重复",4);
            	return false;
            }
            sValid+=jsonArray[i].name.trim()+",";
        }
        
        var docDs=loadXMLString("<?xml version='1.0' encoding='gbk'?><dslist/>");
        var rootEl = docDs.documentElement;
        for(var i=0;i<jsonArray.length;i++){
            var newNode = docDs.createElement("ds");
            var attrName = docDs.createAttribute("name");
	        attrName.value = jsonArray[i].name;
	        newNode.setAttributeNode(attrName);
            var attrDsName = docDs.createAttribute("dsName");
	        attrDsName.value = jsonArray[i].dsName;
	        newNode.setAttributeNode(attrDsName);
	        var attrType = docDs.createAttribute("type");
	        attrType.value = jsonArray[i].type;
	        newNode.setAttributeNode(attrType);
            var sqlText = Ext.isEmpty(jsonArray[i].value)?"":Ext.decode(jsonArray[i].value);
            XmlUtil.setText(newNode, sqlText);
            rootEl.appendChild(newNode);
        }
        var pp = this;
        var map = new Map();
        map.put("key", "formmake.saveds");
        map.put("eformid", this.eformtpl.id);
        map.put("complibId", this.eformtpl.complibId);
        map.put("eformtype", this.eformtpl.type);
        var xmlStr = XmlUtil.getXml(docDs);
        map.put("ds",xmlStr);
        var query = new QueryObj(map, function(query){
            var msg = query.getDetail();
            if(msg=="ok"){
                showTips("保存表单数据源成功",2);
            }else{
                showTips("未知错误：保存表单数据源失败",4);
            }
            pp.isModifyed = false;
            pp.store.commitChanges();
        });
        query.send();
	},
    
    /**
     * 添加一个参数
     */
    addHandler: function(){
    	var s = this.store.getCount();
    	var cfg = {
            name:'rs'+(s+1), value:''
        };
        if(hasUserDataSource){
			cfg.dsName = "userDataSource";
		}else{
			cfg.dsName =  "dataSource";
		}
    	var p = new Ext.data.Record(cfg);
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
        Ext.Msg.confirm('信息', '确定要删除此查询么？', function(btn){
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
	    url += "&complibId=" + this.eformtpl.complibId;
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
            tooltip: '保存数据源<br/>HotKey:Ctrl+S',
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
        
        var tb=new Ext.Toolbar([
        	this.toolbar_save,'-',{
            text: '添加查询',
            tooltip: '添加一个新查询<br/>HotKey:Ctrl+A',
            cls : 'x-btn-text-icon add',
            handler: function(){
            	pp.addHandler();
            }
        }, '-', {
            text: '删除查询',
            tooltip: '删除当前选中的查询<br>删除后将无法恢复，需谨慎操作<br/>HotKey:Delete',
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
          	hidden: isWrit,
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
	
	// 初始化sql窗口
	initSqlWindow: function(){
		var pp = this;
        this.codePanel = new CodePanel({
        	language: "sql",
        	editorTips: sqlTips
      	});
        this.sqlWindow = new Ext.Window({
            title: 'SQL编辑器',
            width: 560,
            height:430,
            resizable: false,
            border:false,
            closeAction: 'hide',
            maximizable : true,
            modal: true,
            layout: 'fit',
            plain:true,
            buttonAlign:'right',
            items:[this.codePanel],
            buttons: [{
                text: '确定',
                handler:function(){
                    var record = pp.gridEditor.record;
                    pp.mainPnl.stopEditing();
                    var myCode = pp.codePanel.getCode();
                    if(!myCode){
                        myCode = "";
                    }
                    record.data.value = Ext.encode(myCode);
                    pp.sqlWindow.setVisible(false);
                    pp.mainPnl.view.refresh();
                }
            },{
                text: '取消',
                handler:function(){
                    pp.sqlWindow.setVisible(false);
                }
            }]
        });
    },
	
	/**
	 * 初始化GridPanel
	 */
	initGridPanel: function(){
		var tb = this.initToolbar();
		var pp = this;
        this.sqlField = new Ext.form.TriggerField({
        	triggerClass: "x-form-search-trigger",
        	readOnly: true,
        	onTriggerClick: function(e){
        		pp.mainPnl.stopEditing();
            	var record = pp.gridEditor.record;
            	var sqlStr = "";
            	if(!Ext.isEmpty(record.data.value)){
              	  	sqlStr = Ext.decode(record.data.value);
            	}
            	pp.codePanel.setCode(sqlStr);
            	pp.sqlWindow.show();
        	}
        });
        this.gridEditor = new Ext.grid.GridEditor(this.sqlField);  
        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
        {
            header:'数据源',
            dataIndex:'dsName',
            sortable:true,
            width:20,
            editor:new Ext.form.ComboBox({
            	allowBlank: false,
            	store: new Ext.data.SimpleStore({
            		data:dataSourceStore,
            		fields: ['name']
            	}),
            	displayField:'name',
            	valueField:'name',
            	mode: 'local',
            	editable:false,
		        forceSelection: true,
		        triggerAction: 'all'
            })
        },{
            header:'结果集名称',
            dataIndex:'name',
            sortable:true,
            width:20,
            editor:new Ext.form.TextField({
            	allowBlank: false
            })
        },{
            header:'类型',
            dataIndex:'type',
            sortable:true,
            width:20,
            editor:new Ext.form.ComboBox({
                store: new Ext.data.SimpleStore({
                    fields:['value','text'],
                    data: [
                       	['sql','sql'],
                    	['logic','logic']
                    ]
                }),
                emptyText: '请选择',
                mode: 'local',
                triggerAction: 'all',
                valueField: 'value',
                displayField: 'text',
                editable: false,
                value:'sql'
            })
        },{
            header:'SQL',
            dataIndex:'value',
            sortable:true,
            editor: this.gridEditor
        }]);
        this.mainPnl=new Ext.grid.EditorGridPanel({
            cm:cm,
            store:this.store,
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
	loadDSFromStr: function(paramStr){
		this.eformtpl.params = paramStr;
      	this.eformtpl.dom=loadXMLString(this.eformtpl.params);
      	
      	var rootEl= this.eformtpl.dom.documentElement;    
        for(var i=0;i<rootEl.childNodes.length;i++){
            var subEl = rootEl.childNodes[i];
            if(subEl.nodeType!=1){
            	continue;
            }
            var p = new Ext.data.Record({
            	dsName: this.getDsName(subEl),
            	name: subEl.getAttribute("name"), 
            	type: subEl.getAttribute("type"),
                value: Ext.encode(XmlUtil.getText(subEl))
            });
            this.store.addSorted(p);
        }
	},
	
	getDsName: function(subEl){
		if(subEl.getAttribute("dsName") == null){
			if(hasUserDataSource){
				return "userDataSource";
			}else{
				return "dataSource";
			}
		}
		return subEl.getAttribute("dsName");
	},
	
	/**
	 * 显示指定form的数据源配置
	 */
	showDS: function(cf){
		this.eformtpl = {
			id: cf.formid,
			type: cf.formtype,
			complibId: cf.complibId
		};
		this.store.removeAll();
		var pp = this;
		
		var map = new Map();
      	map.put("key", "formmake.loadDSXML");
      	map.put("formid",this.eformtpl.id);
      	map.put("complibId",this.eformtpl.complibId);
      	map.put("formtype",this.eformtpl.type);
      	var query = new QueryObj(map,function(query){
      		var po = Ext.decode(query.getDetail());
      		pp.loadDSFromStr(po.ds);
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