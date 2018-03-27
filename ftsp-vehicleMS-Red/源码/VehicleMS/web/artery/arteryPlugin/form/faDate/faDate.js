
// ***************************************************************************************//
// datepicker //
// ***************************************************************************************//
Artery.plugin.DateTrigger = Ext.extend(Ext.form.TriggerField, {
	width : 45,
	editable : true
})

Ext.override(Ext.DatePicker, {

	showTime : false,
	
	timeType : 1,//当是否显示Time属性为true时起作用，1代表显示时分秒，2代表显示时分，3代表只显示时
	
	showToday : true,

	todayTip : "{0}",
	
	listClass:' x-menu-arteryPopup ',

	handleDateClick : function(e, t) {
		e.stopEvent();
		if (t.dateValue && !Ext.fly(t.parentNode).hasClass("x-date-disabled")) {
			this.setValue(new Date(t.dateValue));
			// modify
			if (!this.showTime) {
				this.fireEvent("select", this, this.value);
			}
		}
	},
	handleDateDbClick : function(e, t) {
		e.stopEvent();
		if (t.dateValue && !Ext.fly(t.parentNode).hasClass("x-date-disabled")) {
			if (this.showTime) {
				this.selectDateTime();
			}
		}
	},
	activeDateDisabled : function(date) {
		if (!date) {
			return false;
		}
		var disabled = true;
		if (this.cells) {
			this.cells.each(function(c) {
				if (c.hasClass("x-date-active") && c.dom.firstChild.dateValue == date.getTime()) {
				  disabled = false;
				}
			});
		}
		return disabled;
	},
	setValue : function(value, time) {
		// modify
		if (this.showTime && time == true && this.el) {
			this.hourSpiner.setValue(value.getHours())
			this.minuteSpiner.setValue(value.getMinutes())
			this.secondSpiner.setValue(value.getSeconds())
		}
		var old = this.value;
		this.value = value.clearTime(true);
		this.oldVal = value;
		// modify
		this.value.tdate = value.tdate;
		if (this.el) {
			this.update(this.value);
		}
	},
	onRender : function(container, position) {
		var m = [
				'<table cellspacing="0" style="width:',this.showTime?300:200,'">',
				'<tr><td class="x-date-left"><a href="#" title="',
				this.prevText,
				'">&#160;</a></td><td class="x-date-middle" align="right"></td><td class="x-date-middle" align="left"></td><td class="x-date-right"><a href="#" title="',
				this.nextText, '">&#160;</a></td></tr>',
				'<tr><td colspan="4"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
		var dn = this.dayNames;
		for (var i = 0; i < 7; i++) {
			var d = this.startDay + i;
			if (d > 6) {
				d = d - 7;
			}
			m.push("<th><span>", dn[d].substr(0, 1), "</span></th>");
		}
		m[m.length] = "</tr></thead><tbody><tr>";
		for (var i = 0; i < 42; i++) {
			if (i % 7 == 0 && i != 0) {
				m[m.length] = "</tr><tr>";
			}
			m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span>ABC</span></em></a></td>';
		}
		// modify
		// add time td
		var sTime = '';
		if (!this.showTime) {
			sTime = '<table border=0 cellpadding=0 cellspacing=0 width=100%><tr><td class="x-date-todaybtn" align=center></td></tr></table>';
		}
		m[m.length] = '</tr></tbody></table></td></tr><tr><td colspan="4" align="center" class="x-date-bottom">'
				+ sTime + '</td></tr></table><div class="x-date-mp"></div>';
				

		var el = document.createElement("div");
		el.className = "x-date-picker";
		el.innerHTML = m.join("");

		container.dom.insertBefore(el, position);
		if(this.showTime){
			var timeEl = document.createElement("div");
			timeEl.className = 'x-date-bottom x-date-table-wrap';
			timeEl.innerHTML = '<table cellpadding=0 cellspacing=0 width=285 style="height:32px;margin-left:10px;"><tr><td width=50  class="x-date-todaybtn"></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td class="x-date-hourtd"></td><td style="font-weight: bold;">：</td><td class="x-date-minutetd"></td><td style="font-weight: bold;">：</td><td class="x-date-secondtd"></td><td width=100%></td><td width=50 class="x-date-okbtn"></td></tr></table>';
			container.dom.appendChild(timeEl);
			Ext.get(timeEl).on('click',function(e){
				e.stopEvent();
			})
			this.timeTable = timeEl.firstChild;
		}

		this.el = Ext.get(el);
		this.eventEl = Ext.get(el.firstChild);

		this.leftcr = new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
					handler : this.showPrevMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});

		this.rightcr = new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
					handler : this.showNextMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});

		this.eventEl.on("mousewheel", this.handleMouseWheel, this);

		this.monthPicker = this.el.down('div.x-date-mp');
		this.monthPicker.enableDisplayMode('block');
		this.yearPicker = this.el.down('div.x-date-mp');
		this.yearPicker.enableDisplayMode('block');

		this.keyNav = new Ext.KeyNav(this.eventEl, {
					"left" : function(e) {
						e.ctrlKey ? this.showPrevMonth() : this
								.update(this.activeDate.add("d", -1));
					},

					"right" : function(e) {
						e.ctrlKey ? this.showNextMonth() : this
								.update(this.activeDate.add("d", 1));
					},

					"up" : function(e) {
						e.ctrlKey ? this.showNextYear() : this
								.update(this.activeDate.add("d", -7));
					},

					"down" : function(e) {
						e.ctrlKey ? this.showPrevYear() : this
								.update(this.activeDate.add("d", 7));
					},

					"pageUp" : function(e) {
						this.showNextMonth();
					},

					"pageDown" : function(e) {
						this.showPrevMonth();
					},

					"enter" : function(e) {
						if (this.activeDateDisabled(this.activeDate)) {
							e.stopPropagation();
							return false;
						}
						if (this.showTime) {
							this.selectDateTime();
						} else {
							this.setValue(this.activeDate);
							this.fireEvent('select', this, this.value);
						}
						e.stopPropagation();
						return true;
					},

					scope : this
				});

		this.eventEl.on("click", this.handleDateClick, this, {
					delegate : "a.x-date-date"
				});

		this.eventEl.on("dblclick", this.handleDateDbClick, this, {
					delegate : "a.x-date-date"
				});
				
		this.el.unselectable();

		this.cells = this.el.select("table.x-date-inner tbody td");
		this.textNodes = this.el.query("table.x-date-inner tbody span");

        this.ybtn = new Ext.Button({
            text: '&#160;',
            //tooltip: this.monthYearText,
            renderTo: this.el.query('td.x-date-middle')[0]
        });
        this.ybtn.el.child('em').addClass('x-btn-arrow');

		this.ybtn.on('click', this.showYearPicker, this);
		this.ybtn.el.child(this.ybtn.menuClassTarget).addClass("x-btn-with-menu");
		this.mbtn = new Ext.Button({
					text : "&#160;",
					//tooltip : this.monthYearText,
					renderTo : this.el.query("td.x-date-middle")[1]
				});
		this.mbtn.el.child('em').addClass('x-btn-arrow');
		this.mbtn.on('click', this.showMonthPicker, this);
		this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");


		if (this.showToday) {
			this.todayKeyListener = this.eventEl.addKeyListener(
					Ext.EventObject.SPACE, this.selectToday, this);
			var today = (new Date()).dateFormat(this.format);
			this.todayBtn = new Ext.Button({
				renderTo : container.child("td.x-date-todaybtn", true),
				text : String.format(this.todayText, today),
				tooltip : String.format(this.todayTip, today),
				tooltipType: "title",
				handler : this.selectToday,
				scope : this
			});
			this.todayBtn.on("mouseover",function(btn,e){
				var today = (new Date()).dateFormat(this.format);
				btn.setTooltip(today);
			},this);
		}

		// modify
		if (this.showTime) {
			var dp = this;
			this.okBtn = new Ext.Button({
				renderTo : container.child("td.x-date-okbtn", true),
				text : '确定',
				handler : this.selectDateTime,
				scope : this
			});
			
			this.hourSpiner = new Ext.ux.form.Spinner({
				renderTo : container.child("td.x-date-hourtd", true),
				width: 55,
				value:'01',
				strategy: new Ext.ux.form.Spinner.TimeStrategy({
					format: 'H',
					incrementConstant: Date.HOUR,
					alternateIncrementValue: 3,
					alternateIncrementConstant: Date.HOUR
				})
			})
			this.minuteSpiner = new Ext.ux.form.Spinner({
				renderTo : container.child("td.x-date-minutetd", true),
				width: 55,
				strategy: new Ext.ux.form.Spinner.TimeStrategy({
					format: 'i',
					incrementConstant: Date.MINUTE,
					alternateIncrementValue: 5,
					alternateIncrementConstant: Date.MINUTE
				})
			})
			this.secondSpiner = new Ext.ux.form.Spinner({
				renderTo : container.child("td.x-date-secondtd", true),
				width: 55,
				strategy: new Ext.ux.form.Spinner.TimeStrategy({
					format: 's',
					incrementConstant: Date.SECOND,
					alternateIncrementValue: 5,
					alternateIncrementConstant: Date.SECOND
				})
			})


			this.hourSpiner.setValue(this.oldVal.getHours())
			this.minuteSpiner.setValue(this.oldVal.getMinutes())
			this.secondSpiner.setValue(this.oldVal.getSeconds())
			
			this.disableTimeState();
		}

		if (Ext.isIE) {
			this.el.repaint();
		}
		this.update(this.value);
	},
	
	// private
    createMonthPicker : function(){
    	
    	var setClick = false;
        if(!this.monthPicker.dom.firstChild){
        	setClick = true;
        }
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(
                    '<tr><td class="x-date-mp-month"><a href="#">', Date.getShortMonthName(i), '</a></td>',
                    '<td class="x-date-mp-month x-date-mp-sep"><a href="#">', Date.getShortMonthName(i + 6), '</a></td>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4">',
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.monthPicker.update(buf.join(''));

            this.mpMonths = this.yearPicker.select('td.x-date-mp-month');
            this.mpYears = this.yearPicker.select('td.x-date-mp-year');
            
            if(setClick){
             	this.mon(this.monthPicker, 'click', this.onDateDblClick, this);
        		this.mon(this.monthPicker, 'dblclick', this.onDateDblClick, this);
        	}
        		
            this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
            this.mpYears = this.monthPicker.select('td.x-date-mp-year');

            this.mpMonths.each(function(m, a, i){
                i += 1;
                if((i%2) === 0){
                    m.dom.xmonth = 5 + Math.round(i * 0.5);
                }else{
                    m.dom.xmonth = Math.round((i-1) * 0.5);
                }
            });
        //}
    },
	
    // private
    showMonthPicker : function(){
        if(!this.disabled){
            this.createMonthPicker();
            var size = this.el.getSize();
            this.monthPicker.setSize(size);
            this.monthPicker.child('table').setSize(size);

            this.mpSelMonth = (this.activeDate || this.value).getMonth();
            this.updateMPMonth(this.mpSelMonth);

            this.monthPicker.slideIn('t', {duration:0.2});
        }
    },
    
    // private
    onDateDblClick : function(e, t){
        e.stopEvent();
        var el = new Ext.Element(t), pn;
        if(el.is('button.x-date-mp-cancel')){
            this.hideDatePicker();
        }
        else if(el.is('a.x-date-mp-prev')){
            this.updateMPYear(this.mpyear-10);
        }
        else if(el.is('a.x-date-mp-next')){
            this.updateMPYear(this.mpyear+10);
        }
        
        if((pn = el.up('td.x-date-mp-month', 2))){
            var selMonth = parseInt(pn.dom.xmonth);
            var newDate = new Date((this.activeDate || this.value).getFullYear(), selMonth, (this.activeDate || this.value).getDate());
            while (newDate.getMonth() > selMonth) {
                newDate.setDate(newDate.getDate() - 1);
            }
            this.update(newDate);
            this.hideDatePicker();
        }
        else if((pn = el.up('td.x-date-mp-year', 2))){
            this.update(new Date(pn.dom.xyear, (this.activeDate || this.value).getMonth(), (this.activeDate || this.value).getDate()));
            this.hideDatePicker();
        }
    },
    
    // private
    hideDatePicker : function(disableAnim){
        if(this.monthPicker){
            if(disableAnim === true){
                this.monthPicker.hide();
            }else{
                this.monthPicker.slideOut('t', {duration:0.2});
            }
        }
        if(this.yearPicker){
            if(disableAnim === true){
                this.yearPicker.hide();
            }else{
                this.yearPicker.slideOut('t', {duration:0.2});
            }
        }
    },
    
    // private
    createYearPicker : function(){
        var setClick = false;
        if(!this.yearPicker.dom.firstChild){
        	setClick = true;
        }
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(

                    i === 0 ?
                    '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
                    '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4">',
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.yearPicker.update(buf.join(''));
			if(setClick){
				this.mon(this.yearPicker, 'click', this.onDateDblClick, this);
            	this.mon(this.yearPicker, 'dblclick', this.onDateDblClick, this);
          	}

            this.mpMonths = this.yearPicker.select('td.x-date-mp-month');
            this.mpYears = this.yearPicker.select('td.x-date-mp-year');
        //}
    },

    // private
    showYearPicker : function(){
        if(!this.disabled){
            this.createYearPicker();
            var size = this.el.getSize();
            this.yearPicker.setSize(size);
            this.yearPicker.child('table').setSize(size);

            this.mpSelYear = (this.activeDate || this.value).getFullYear();
            this.updateMPYear(this.mpSelYear);

            this.yearPicker.slideIn('t', {duration:0.2});
        }
    },
    
	disableTimeState: function(){
		if(this.timeType == 3){
			this.minuteSpiner.setValue(0);
			this.secondSpiner.setValue(0);
			this.timeTable.rows[0].cells[3].style.display = 'none';
			this.timeTable.rows[0].cells[4].style.display = 'none';
			this.timeTable.rows[0].cells[5].style.display = 'none';
			this.timeTable.rows[0].cells[6].style.display = 'none';
		}else if(this.timeType == 2){
			this.secondSpiner.setValue(0);
			this.timeTable.rows[0].cells[5].style.display = 'none';
			this.timeTable.rows[0].cells[6].style.display = 'none';
		}
	},

	selectToday : function() {
		// modify
		var date = new Date().clearTime();
		date.tdate = new Date();
		if(this.timeType == 3){
			date.tdate.setMinutes(0);
			date.tdate.setSeconds(0);
		}else if(this.timeType == 2){
			date.tdate.setSeconds(0);
		}
		
		this.setValue(date);
		this.fireEvent("select", this, this.value);
	},

	// private
	selectDateTime : function() {
		var date = this.activeDate;
		if(this.activeDateDisabled(this.activeDate)){
			date = this.value;
		}
		date.tdate = date.clone();
		var iH = this.hourSpiner.getValue();
		if(isNaN(iH)||iH<0||iH>23){
			this.hourSpiner.setValue(23)
		}
		var iM = this.minuteSpiner.getValue();
		if(isNaN(iM)||iM<0||iM>59){
			this.minuteSpiner.setValue(59);
		}
		var iS = this.secondSpiner.getValue();
		if(isNaN(iS)||iS<0||iS>59){
			this.secondSpiner.setValue(59);
		}

		date.tdate.setHours(this.hourSpiner.getValue(), this.minuteSpiner.getValue(),
				this.secondSpiner.getValue());
		this.setValue(date);
		this.fireEvent("select", this, this.value);
	},
	
	update : function(date, forceRefresh){
        var vd = this.activeDate;
        this.activeDate = date;
        if(!forceRefresh && vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
//                       setTimeout(function(){
//                            try{c.dom.firstChild.focus();}catch(e){}
//                       }, 50);
                       return false;
                   }
                });
                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        // convert everything to numbers so it's fast
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;

        if(this.showToday){
            var td = new Date().clearTime();
            var disable = (td < min || td > max ||
                (ddMatch && format && ddMatch.test(td.dateFormat(format))) ||
                (ddays && ddays.indexOf(td.getDay()) != -1));

            this.todayBtn.setDisabled(disable);
            this.todayKeyListener[disable ? 'disable' : 'enable']();
        }

        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            // disabling
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
        }
        for(; i < days; i++){
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
        }

        this.ybtn.setText(date.getFullYear());
        this.mbtn.setText(this.monthNames[date.getMonth()]);

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Ext.fly(main).setWidth(w);
            this.internalRender = true;
            // opera does not respect the auto grow header center column
            // then, after it gets a width opera refuses to recalculate
            // without a second pass
            if(Ext.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
    },
    
    //override
    beforeDestroy : function() {
        if(this.rendered){
        	if(this.keyNav){
            	this.keyNav.disable();
            	this.keyNav = null;
        	}
            Ext.destroy(
                this.leftcr,
                this.rightcr,
                this.eventEl,
                this.mbtn,
                this.ybtn,
                this.todayBtn,
                this.okBtn,
                this.hourSpiner,
                this.minuteSpiner,
                this.secondSpiner,
                this.monthPicker,
                this.yearPicker
            );
            this.leftcr=null;
            this.rightcr=null;
            this.eventEl=null;
            this.mbtn=null;
            this.ybtn=null;
            this.todayBtn=null;
            this.okBtn=null;
            this.hourSpiner=null;
            this.minuteSpiner=null;
            this.secondSpiner=null;
            this.monthPicker=null;
            this.yearPicker=null;
        }
    }
})

// ***************************************************************************************//
// datefield //
// ***************************************************************************************//
/**
 * Artery datefield component
 * 
 * @author baon
 * @date 2/06/2008
 * 
 * @class Artery.plugin.FaDateDate
 * @extends Ext.form.DateField
 */
Artery.plugin.FaDateDate = Ext.extend(Ext.form.DateField, {
	
	allowDomMove:false,
	
	// 为true，则显示时间
	showTime : false,
	
	// 1-时分秒 2-时分 3-时
	timeType : 1,
	
	margin: true,

	format : "Y-m-d",
	
	formatError:'YYYY-mm-dd',
	
	//覆盖父类的altFormats属性，增加了Y-n-j格式，为了适应用户输入2010-01-1,2010-1-1格式日期的识别
	altFormats : "Y-n-j|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|Ymd|ymd|md|mdy|mdY|d|Y-m-d",

	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "24",
		autocomplete : "off"
	},
	
	editable:true,

	getTrigger : Artery.plugin.TwinTriggerField.prototype.getTrigger,

	initTrigger : Artery.plugin.TwinTriggerField.prototype.initTrigger,
	
	initHTMLTrigger : Artery.plugin.TwinTriggerField.prototype.initHTMLTrigger,
	
	initComponentTigger: Artery.plugin.TwinTriggerField.prototype.initComponentTigger,
	
	hideTrg : Artery.plugin.TwinTriggerField.prototype.hideTrg,

	showTrg : Artery.plugin.TwinTriggerField.prototype.showTrg,
	
	setFieldEditable : Artery.plugin.TwinTriggerField.prototype.setFieldEditable,
	
	read : Artery.plugin.TwinTriggerField.prototype.read,

	edit : Artery.plugin.TwinTriggerField.prototype.edit,
	
	onTrigger1Click :Artery.plugin.TwinTriggerField.prototype.onTrigger1Click,
	
	afterRender :Artery.plugin.TwinTriggerField.prototype.afterRender,
	
	setTriggerState: Artery.plugin.TwinTriggerField.prototype.setTriggerState,
	
	onHide :Artery.plugin.TwinTriggerField.prototype.onHide,
	
	onShow :Artery.plugin.TwinTriggerField.prototype.onShow,

	initEvents : Artery.plugin.TwinTriggerField.prototype.initEvents,
	
	initClearValueTaskEvent : Artery.plugin.TwinTriggerField.prototype.initClearValueTaskEvent,
	
	getPositionEl : Artery.plugin.TwinTriggerField.prototype.getPositionEl,
	
	trigger1Class : 'x-form-clear-trigger',
	
	reset : function(){
		if(!this.rendered){
			return;
		}
		if(this.originalValue + "" == this.getValueText() + ""){
			return;
		}
	    this.clearInvalid();
        this.setValueNoValid(this.originalValue);
    },

	initComponent : function() {
		if(this.margin){
			this.defaultAutoCreate.style = "margin:0;";
		}
		this.adjustFormat();
		this.triggerConfig = {
			tag : 'span',
			cls : 'x-form-twin-triggers',
			cn : [{
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger1Class
					}, {
						tag : "img",
						src : Ext.BLANK_IMAGE_URL,
						cls : "x-form-trigger " + this.trigger2Class
					}]
		};
		if (this.showTime) {
			this.defaultAutoCreate = {
				tag : "input",
				type : "text",
				size : "24",
				autocomplete : "off"
			}
			if(this.margin){
				this.defaultAutoCreate.style = "margin:0;";
			}
		}
		Artery.plugin.FaDateDate.superclass.initComponent.call(this);
		this.initComponentTigger();

		//防止内存泄露
		Ext.EventManager.on(window, 'beforeunload', function(){
			try{
				if(this.keyNav) {
					try{
						this.keyNav.disable();
						this.keyNav = null;
					}catch(e){
						//alert("执行this.keyNav.disable()异常:" + e.description);
					}
				}
				if(this.menu){
					if(this.menu.destroy){
						try{
							this.menu.destroy();
						}catch(e){
							//alert("执行this.menu.destroy()异常:" + e.description);
						}
					}
					this.menu = null;
				}
			}catch(e){
				//alert("执行unload异常");
			}
		},this);
	},
	/**
	 * 调整Format
	 */
	adjustFormat: function(){
		if(this.customFormat){
			this.format = this.customFormat;
			if(this.showTime){
				this.formatError = "YYYY-mm-dd hh:MM:ss";
			}else{
				this.formatError = "YYYY-mm-dd";
			}
		}else if(this.showTime){
			this.format = "Y-m-d H:i:s";
			this.formatError = "YYYY-mm-dd hh:MM:ss";
		}
	},
	
	getFormatError: function(){
		if (this.customFormatError){
			return this.customFormatError
		}
		if(this.formatError){
			return this.formatError;
		}
		return this.format;
	},
	
	    // private
    validateValue : function(value){
        value = this.formatDate(value);
        
        if(!Ext.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.getFormatError()));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
            this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },

    // 覆盖父类DateField的方法,Date.parseDate()方法最后一个参数设为true,表示严格地解析日期字符串，对于非法的日期字符串不做解析
    parseDate : function(value){
        if(!value || Ext.isDate(value)){
            return value;
        }
        var v = Date.parseDate(value, this.format, true);
        if(!v && this.altFormats){
            if(!this.altFormatsArray){
                this.altFormatsArray = this.altFormats.split("|");
            }
            for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
                v = Date.parseDate(value, this.altFormatsArray[i],true);
            }
        }
        return v;
    },
	// private
	onBlur : function() {
		this.beforeBlur();
		if (!Ext.isOpera && this.focusClass) { // don't touch in Opera
			this.el.removeClass(this.focusClass);
		}
		this.hasFocus = false;
		if (this.validationEvent !== false && this.validateOnBlur
				&& this.validationEvent != "blur") {
			this.validate();
		}
	},
	
	// 在选择了日期后，触发change事件
	onSelect: function(m, d){
		var ov = this.getValue();
		Artery.plugin.FaDateDate.superclass.onSelect.call(this, m, d);
		var nv = this.getValue();
		if (String(ov) !== String(nv)) {
			//防止onblur的时候再次触发onChange事件
			this.startValue = this.getValue();
			this.fireEvent('change', this, nv, ov);
		}
    },

	onRender : function(ct, position) {
		Artery.plugin.TwinTriggerField.prototype.onRender.call(this, ct, position);
		
		if(!this.readOnly){
			if(this.editable){
				this.el.dom.readOnly = false;
			}else{
				this.el.dom.readOnly = true;
			}
		}
		this.keyNav = new Ext.KeyNav(this.el, {
					"down" : function(e) {
						this.onTriggerClick(e);
					},
					scope : this
				});
		this.mon(this.el, 'keydown', this.onKeyDown, this);
	},
	//add by zhangchw 回车自动解析并赋值，解决如果formarea有回车事件的话取不到正确的值的问题
	onKeyDown : function (e){
		if(e.keyCode == e.ENTER){
			var v = this.parseDate(this.getRawValue());
			if (v) {
				this.setValue(v);
			}
		}
	},
	// 组件默认的onchage事件
	initDefaultOnChange : function(field, newValue, oldValue) {
		if (this.data) {
			if (Ext.isEmpty(newValue)) {
				this.data.value = "";
			} else {
				this.data.value = newValue.format(this.format);
			}
		}
	},
	
	/**
	 * 设置日期值
	 * @param date 字符串或日期对象
	 */
	setValue : function(date) {
		var vt;	// 显示值
		if (date) {
			// modify
			if (date.tdate != null) {
				date = date.tdate.clone();
			}
			if(Ext.isDate(date)){
				vt = this.formatDate(date);
				date = this.formatValueDate(date);
			}else{
				vt = this.formatDate(this.parseValueDate(date));
			}
		}
		// 设置显示值
		Artery.plugin.FaDateDate.superclass.setValue.call(this, vt);
		// 设置控件值
		Artery.plugin.TwinTriggerField.prototype.setValue.call(this, date, vt);
	},
	
	getValue : function(){
        return this.value || "";
    },
    
    getDate : function(){
        return this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
    },
	
	/**
	 * 解析日期字符串,格式应为:2009-06-06 或 2009-06-06 12:12:12
	 * @param val
	 * @return 日期对象
	 */
	parseValueDate: function(val){
		var v = Date.parseDate(val, "Y-m-d");
		if(v){
			return v;
		}
		v = Date.parseDate(val, "Y-m-d H:i:s");
		if(v){
			return v;
		}
		return this.parseDate(val);
	},
	
	/**
	 * 格式化值字符串
	 * @param val
	 * @return 格式化的字符串
	 */
	formatValueDate: function(val){
		var v;
		if(this.showTime){
			v = val.dateFormat("Y-m-d H:i:s")
		}else{
			v = val.dateFormat("Y-m-d")
		}
		if(v){
			return v;
		}else{
			return this.formatDate(val);
		}
	},

	// get Format value
	getFormateValue : function(date) {
		return this.el.dom.value;
	},

	createMenu : function(cfg) {
		var omenu = new Ext.menu.DateMenu({shadow :false});
		return omenu;
	},
	
	setPickerValue : function(cfg) {
		var maxDate = cfg.field.maxValue;
		var d = new Date();
		if(!Ext.isEmpty(maxDate) && maxDate < d){
			d.setFullYear(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
		}
		cfg.field.menu.picker.setValue(cfg.field.getDate() || d, true);
//		cfg.field.menu.picker.setValue(cfg.field.getDate() || new Date(), true);
	},
	
	onTrigger2Click : function(e) {
		if(this.disabled || this.readOnly){
            return;
        }
		if (this.menu == null) {
			this.menu = Artery.pwin.Artery.plugin.FaDateDate.prototype.createMenu({field:this});
			this.menu.on("hide", function() {
				this.validate();
			}, this)
		}
		
		Ext.apply(this.menu.picker, {
			// modify
			showTime : this.showTime,
			timeType : this.timeType,
			minDate : this.minValue ? this.minValue.clone() : null,
			maxDate : this.maxValue ? this.maxValue.clone() : null,
			disabledDatesRE : this.ddMatch,
			disabledDatesText : this.disabledDatesText,
			disabledDays : this.disabledDays,
			disabledDaysText : this.disabledDaysText,
			format : this.format,
			minText : String.format(this.minText, this.formatDate(this.minValue)),
			maxText : String.format(this.maxText, this.formatDate(this.maxValue))
		});
		this.menu.on(Ext.apply({}, this.menuListeners, {
			scope : this
		}));
		// modify
		Artery.pwin.Artery.plugin.FaDateDate.prototype.setPickerValue({field:this});
		if(!this.menu.el){
			this.menu.render();
		}
		if(e){
			this.menu.showXY(Artery.getXY(e.browserEvent, this.menu.el));
		}
		this.menuEvents('on');
		(function(){
			this.menu.picker.eventEl.focus();
		}).defer(100,this);
	},
	
	onTriggerClick: function(e){
		this.onTrigger2Click(e);
	},

	beforeBlur : function() {
		var v = this.parseDate(this.getRawValue());
		if (v) {
			this.setValue(v);
		}
	}
})

// register xtype
Ext.reg('apfadatedate', Artery.plugin.FaDateDate);

/**
 * Override Ext.menu.Menu
 * 
 * @author baon
 * @date 21/05/2008
 * 
 * @class Ext.Panel
 * @extends Ext.Panel
 */
Ext.override(Ext.menu.Menu, {
	showXY : function(xy, pos, parentMenu) {
		this.parentMenu = parentMenu;
		if (!this.el) {
			this.render();
		}
//		this.fireEvent("beforeshow", this);
		this.showAt(xy, parentMenu, false);
	}
})

/**
 * 重写日期解析，0不在默认为当前时间
 */
Ext.apply(Date,{ 
  xf : function(format) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return format.replace(/\{(\d+)\}/g, function(m, i) {
	        return args[i];
	    });
  },   
  
  createParser : function() {
        var code = [
            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
                "def = Date.defaults,",
                "results = String(input).match(Date.parseRegexes[{0}]);", // either null, or an array of matched strings

            "if(results){",
                "{1}",

                "if(u != null){", // i.e. unix time is defined
                    "v = new Date(u * 1000);", // give top priority to UNIX time
                "}else{",
                    // create Date object representing midnight of the current day;
                    // this will provide us with our date defaults
                    // (note: clearTime() handles Daylight Saving Time automatically)
                    "dt = (new Date()).clearTime();",

                    // date calculations (note: these calculations create a dependency on Ext.num())
//					"y = y >= 0 ? y : Ext.num(def.y, dt.getFullYear());",
//					"m = m >= 0 ? m : Ext.num(def.m - 1, dt.getMonth());",
//					"d = d >= 0 ? d : Ext.num(def.d, dt.getDate());",
                    "y = y !== undefined ? y : Ext.num(def.y, dt.getFullYear());",
                    "m = m !== undefined ? m : Ext.num(def.m - 1, dt.getMonth());",
                    "d = d !== undefined ? d : Ext.num(def.d, dt.getDate());",

                    // time calculations (note: these calculations create a dependency on Ext.num())
                    "h  = h || Ext.num(def.h, dt.getHours());",
                    "i  = i || Ext.num(def.i, dt.getMinutes());",
                    "s  = s || Ext.num(def.s, dt.getSeconds());",
                    "ms = ms || Ext.num(def.ms, dt.getMilliseconds());",

                    "if(z >= 0 && y >= 0){",
                        // both the year and zero-based day of year are defined and >= 0.
                        // these 2 values alone provide sufficient info to create a full date object

                        // create Date object representing January 1st for the given year
                        "v = new Date(y, 0, 1, h, i, s, ms);",

                        // then add day of year, checking for Date "rollover" if necessary
                        "v = !strict? v : (strict === true && (z <= 364 || (v.isLeapYear() && z <= 365))? v.add(Date.DAY, z) : null);",
                    "}else if(strict === true && !Date.isValid(y, m + 1, d, h, i, s, ms)){", // check for Date "rollover"
                        "v = null;", // invalid date, so return null
                    "}else{",
                        // plain old Date object
                        "v = new Date(y, m, d, h, i, s, ms);",
                    "}",
                "}",
            "}",

            "if(v){",
                // favour UTC offset over GMT offset
                "if(zz != null){",
                    // reset to UTC, then add offset
                    "v = v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                    // reset to GMT, then add offset
                    "v = v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
            "}",

            "return v;"
        ].join('\n');

        return function(format) {
            var regexNum = Date.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "";

            for (var i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(String.escape(ch));
                } else {
                    var obj = Date.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        calc.push(obj.c);
                    }
                }
            }

            Date.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", "i");
            Date.parseFunctions[format] = new Function("input", "strict", this.xf(code, regexNum, calc.join('')));
        }
    }()
  }
)
