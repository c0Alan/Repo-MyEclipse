Artery.valid={};
Ext.onReady(function(){
	Artery.valid.runScript();
});

Artery.valid.runScript = function(last){
	var phaseValidManager = Artery.valid.findPhaseValidManager();
	if(phaseValidManager && phaseValidManager.valid){
		var script = phaseValidManager.getScript(Artery.params.formid,last);
		if(script){
			if(phaseValidManager.isCurrentLastScript()){
				phaseValidManager.valid = false;
			}
			script = "var fn=function("+phaseValidManager.paramsInfo[phaseValidManager.currentPoint.id].sign+"){\n"+script+"\n}";
			eval(script);
			fn.apply(this,phaseValidManager.paramsInfo[phaseValidManager.currentPoint.id].value);
		}
	}
}

Artery.valid.findPhaseValidManager = function(){
	var fn = function(win){
		if(win.Artery && win.Artery.valid){
			return win.Artery.valid.PhaseValidManager;
		}
	}
	var pvm = fn(Artery.TopWinManager.getTopWin());
//	if(pvm == null && top.opener){
//		pvm = fn(top.opener.top);
//	}
	return pvm;
}

Artery.valid.PhaseValid =Ext.extend(Ext.Component,{
	
	validCfg:null,//验证配置信息
	
	currentPoint:null,//当前激活的模板信息
	
	currentPointEl:null,
	
	nextTemplateIdx:null,//下一个要激活的模板序列号
	
	paramsInfo:null,//参数信息{sign:'name,id',value:['hh','123']}
	
	initComponent : function() {
		Artery.valid.PhaseValid.superclass.initComponent.call(this);
		this.parseParamsInfo();
		//alert(Ext.encode(this.validCfg));
	},
	
	getScript: function(formId,last){
		var scripts = this.currentPoint.template.scripts;
		if(scripts[formId]!= null){
			return scripts[formId].script;
		}
		//判断是否取最后一个脚本
		if(last){
			var idx = 0;
			for(var i in scripts){
				if(Ext.isNumber(parseInt(i)) && (parseInt(i) > idx)){
					idx = i;
				}
			}
			return scripts[idx + ""].script;
		}
		var idx = this.nextTemplateIdx++;
		if(scripts[idx + ""] == null){
			return null;
		}
		return scripts[idx + ""].script;
	},
	
	isCurrentLastScript: function(){
		var scripts = this.currentPoint.template.scripts;
		var idx=0;
		for(var i in scripts){
			idx++;
		}
		return this.nextTemplateIdx == idx;
	},
	
	parseParamsInfo: function(){
		this.paramsInfo = [];
		if(Ext.isArray(this.validCfg)){
			var length = this.validCfg.length;
			for(var i=0;i<length;i++){
				this.parseParam(this.validCfg[i]);
			}
		}else{
			this.parseParam(this.validCfg);
		}
	},
	
	parseParam: function(cfg){
		var sign = [];
		var value = [];
		for(var i in cfg.params){
			sign.push(i);
			value.push(cfg.params[i])
		}
		var pi = {};
		pi.sign = sign.join(',');
		pi.value = value;
		pi.initParams = cfg.params;
		this.paramsInfo[cfg.id] = pi;
	},
	
	getCurrentParams: function(){
		var p = Ext.apply({},this.paramsInfo[this.currentPoint.id].initParams);
		p.curridx = this.nextTemplateIdx + 1;
		delete p.focusItemId;
		delete p.validMessage;
		delete p.formId;
		return p;
	},
	
	onRender : function(ct, position){
		this.el = ct.createChild({tag:'div',cls:'x-valid-phase-wrap'});
		
		if(Ext.isArray(this.validCfg)){
			var length = this.validCfg.length;
			for(var i=0;i<length;i++){
				this.createValidPoint(this.validCfg[i]);
			}
		}else{
			this.createValidPoint(this.validCfg);
		}
		
	},
	
	createValidPoint: function(cfg){
		//alert(Ext.encode(cfg))
		var point = this.el.createChild({
			tag:'div',
			cls:'x-valid-phase-point',
			html:cfg.params.validMessage
		});
		point.on('click',function(){
			//alert(Ext.encode(cfg))
			//判断要验证的验证点的参数和当前的打开的页面的参数是否一致，如果一致则直接定位
			var fn = function(currentPoint,cfg){
				var o1 = Ext.apply({},currentPoint.params);
				delete o1.validMessage;
				delete o1.focusItemId;
				var o2 = Ext.apply({},cfg.params);
				delete o2.validMessage;
				delete o2.focusItemId;
				return Ext.encode(o1) == Ext.encode(o2);
			}
			
			//切换验证点的点击状态
			var togglePoint = function(){
				if(this.currentPointEl != null){
					this.currentPointEl.removeClass('x-valid-phase-point-selected');
				}
				point.addClass('x-valid-phase-point-selected');
				this.currentPointEl = point;
			}
			
			//页面不跳转时的情况
			if(this.currentPoint && fn(this.currentPoint,cfg)){
				var win = Artery.findWindowByFormId(cfg.params.formId);
				if(win){
					this.currentPoint = cfg;
					this.valid = true;
					win.Artery.valid.runScript(true);
					togglePoint();
					return;
				}
			}
			
			//验证表单是否已经修改，提示保存
			if(!this.validFormChange()){
				return;
			}
			//设置跳转开关，只有点击时脚本才起作用，在最后定位脚本时清除
			this.valid = true;
			this.currentPoint = cfg;
			this.runScript(cfg);
			togglePoint();
		},this);
		point.addClassOnOver('x-valid-phase-point-over');
	},
	
	runScript: function(cfg){
		Artery.TopWinManager.closeAll();
		var script = cfg.template.scripts.root;
		if(script == null){
			script = cfg.template.scripts["0"].script;
			this.nextTemplateIdx = 1;
		}else{
			script = script.script;
			this.nextTemplateIdx = 0;
		}
		var funScript = "var fn=function("+this.paramsInfo[cfg.id].sign+"){\n"+script+"\n};";
		eval(funScript);
		fn.apply(this,this.paramsInfo[cfg.id].value);
	},
	
	validFormChange: function(){
		var wins = Artery.TopWinManager.getShowWinMap();
		var topWin = Artery.TopWinManager.getTopWin();
		var length = wins.length;
		for(var i=0;i<length;i++){
			var forms = topWin[wins[i].id + "iframe"].Artery.getAllFormAreas();
			for(var j=0;j<forms.length;j++){
				if(forms[j].isChange()){
					return window.confirm("页面中有未保存的数据，确定跳转吗？");
				}
			}
		}
		
		return true;
	}
});

Artery.valid.showPhaseValid = function(cfg) {
	var phaseValidWin = Artery.valid.getPhaseValidWin();
	phaseValidWin.show();
	if(Artery.valid.PhaseValidManager){
		Artery.valid.PhaseValidManager.destroy();
		phaseValidWin.phaseValidContainer.update();
	}
	Artery.valid.PhaseValidManager = new Artery.valid.PhaseValid({validCfg:Ext.decode(cfg)});
	Artery.valid.PhaseValidManager.render(phaseValidWin.phaseValidContainer)

}

Ext.EventManager.onWindowResize(function() {
	if (Artery.valid.phaseValidWin && Artery.valid.phaseValidWin.rendered && !Artery.valid.phaseValidWin.hidden){
		Artery.valid.phaseValidWin.onShowHandle();
	}
});

Artery.valid.getPhaseValidWin = function() {
	if (Artery.valid.phaseValidWin == null) {
		Artery.valid.phaseValidWin = new Ext.Window({
					width : 300,
					height : 250,
					closeAction : 'hide',
					cls:'x-mini-close-window',
					collapsible:true,
					title:'验证信息',
					
					html:'<div id="parseValidContainer" class="x-phase-valid-container"></div>',
					onShowHandle : function() {
						var x = document.body.clientWidth - this.getWidth();
						var y = document.body.clientHeight - this.getHeight();
						this.setPosition(x, y);
					}
				});
		Artery.valid.phaseValidWin.on('show', Artery.valid.phaseValidWin.onShowHandle)
		Artery.valid.phaseValidWin.on('afterrender',function(phaseValidWin){
			phaseValidWin.phaseValidContainer = phaseValidWin.el.child('.x-phase-valid-container');
		});
		Artery.valid.phaseValidWin.on('hide',function(){
			Artery.valid.PhaseValidManager.destroy();
			Artery.valid.PhaseValidManager = null;
			Artery.valid.phaseValidWin.phaseValidContainer.update();
		},this);

	}
	return Artery.valid.phaseValidWin;
}


//得到本页面的链接到等要传递的额外的验证参数
Artery.getValidParams = function(){
	//var params={phaseValidFlag:true,iddd:'extend.config'};
	var params={phaseValidFlag:true};
	var phaseValidManager = Artery.valid.findPhaseValidManager();
	if(phaseValidManager && phaseValidManager.valid){
		var p = Ext.encode(phaseValidManager.getCurrentParams());
		params.phaseValidParams=Artery.escape(p);
		return params;
	}
	return null;
}
