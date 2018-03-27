/*******************************************************************************
 * more javascript from http://www.smallrain.net 
 * 时间：2004-01-01 
 * 作者：Smart
 * 功能：日历式日期选择控件 
 * 参数： 
 * 说明： 
 * 1.输入框直接调用用以下代码 <Script>DateBox("InputName","DateValue")<\/Script>
 *      其中:InputName 为输入日期的文本框.注:不能为空. 
 *      DateValue 为输入日期的文本框默认日期值.格式为:YYYY-MM-DD.
 *      如2004-01-01 此值可以不填或为空.则默认值为当天日期.(客户端)
 * 2.其它"按钮"调用用以下代码 CallDate("InputName") 
 *      其中:InputName 为输入日期的文本框.注:不能为空. 修改区 时间：
 * 修改人： 原因：
 ******************************************************************************/

var Datepick_ImagePath = sys.getPluginPath() + "/datepick/images/";

/*基本参数*/
var Frw = 172; // 日历宽度
var Frh = 142; // 日历高度
var Frs = 4; // 影子大小
var Hid = true;// 日历是否打开
var ColorTitle = '#395592';
var ColorToday = '#FF0000';
var ColorSunday = "#E50000";
var ColorSaturday = "#008000";
var ColorTodayBG = "buttonface";
var ColorTodayFG = "#FFFFFF";
var ColorHeader = "#F5F5F5";
var ColorTailer = "#F5F5F5";
var ColorPreMonth = "#BBBBBB";
var ColorCurMonth = "#555555";
var ColorHeaderBG = "#555555";
var ColorOver = "#E1E1E1";
var ColorGrid = "#EEEEEE";
var TDFont = "font-size:11px;font-family:Arial;";
/*创建框架*/
document
        .writeln('<Div id="Calendar" Author="smart" scrolling="no" frameborder=0 style="border:0px solid #EEEEEE ;position: absolute; width: '
                + Frw
                + 'px; height: '
                + Frh
                + 'px; z-index: 9999; filter :\'progid:DXImageTransform.Microsoft.Shadow(direction=135,color=#AAAAAA,strength='
                + Frs + ')\' ;display: none"></Div>');

document
        .writeln('<div id="CalendarFrame" style="position: absolute; z-index: 9998;display: none;width: '
                + Frw + '; height: ' + Frh + ';">');
document
        .writeln('<iframe src="javascript:false" style=" visibility:inherit; width:'
                + +Frw
                + 'px; height: '
                + Frh
                + 'px; z-index:-1;'
                + ' filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe></div>');
/*取得今日日期*/
function GetTodayDate(){
    today = new Date();
    y = today.getFullYear();
    m = (today.getMonth() + 1);
    m = FillZero(m);
    d = today.getDate();
    d = FillZero(d);
    return y + '-' + m + '-' + d;
}
function FillZero(s){
    if (s < 10)
        s = '0' + s;
    return s;
}
/*输入今天日期*/
function SetTodayDate(InputBox){
    HiddenCalendar();
    InputBox.value = GetTodayDate();
}
/*取某年某月第一天的星期值(月份-1)*/
function GetFirstWeek(The_Year, The_Month){
    return (new Date(The_Year, The_Month - 1, 1)).getDay()
}
/*取某年某月中总天数*/
function GetThisDays(The_Year, The_Month){
    return (new Date(The_Year, The_Month, 0)).getDate()
}
/*取某年某月上个月中总天数*/
function GetLastDays(The_Year, The_Month){
    return (new Date(The_Year, The_Month - 1, 0)).getDate()
}
/*判断是否是闰年*/
function RunNian(The_Year){
    if ((The_Year % 400 == 0) || ((The_Year % 4 == 0) && (The_Year % 100 != 0)))
        return true;
    else
        return false;
}
/* 判断日期(YYYY-MM-DD)的日期是否正确 */
function DateIsTrue(dateStr){
    var datePat = /^((?!0{4})\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/;// requires 4
    // digit year
    var matchArray = dateStr.match(datePat);// is the format ok?
    if (matchArray == null) {
        return false;
    }
    // month = isMonthName(matchArray[3]);//parse date into variables
    month = matchArray[3];
    year = matchArray[1];
    day = matchArray[4];
    if (month < 1 || month > 12) {// check month range
        return false;
    }
    if (day < 1 || day > 31) {
        return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        return false;
    }
    if (month == 2) {// check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            return false;
        }
    }
    return true;
}
/*取某年某月的周值*/
function GetCountWeeks(The_Year, The_Month){
    var Allday;
    Allday = 0;
    if (The_Year > 2000) {

        for (i = 2000; i < The_Year; i = i + 1)
            if (RunNian(i))
                Allday += 366;
            else
                Allday += 365;
        for (i = 2; i <= The_Month; i = i + 1) {
            switch (i) {
                case 2 :
                    if (RunNian(The_Year))
                        Allday += 29;
                    else
                        Allday += 28;
                    break;
                case 3 :
                    Allday += 31;
                    break;
                case 4 :
                    Allday += 30;
                    break;
                case 5 :
                    Allday += 31;
                    break;
                case 6 :
                    Allday += 30;
                    break;
                case 7 :
                    Allday += 31;
                    break;
                case 8 :
                    Allday += 31;
                    break;
                case 9 :
                    Allday += 30;
                    break;
                case 10 :
                    Allday += 31;
                    break;
                case 11 :
                    Allday += 30;
                    break;
                case 12 :
                    Allday += 31;
                    break;
            }
        }
    }
    return (Allday + 6) % 7;
}
/*输入框显示*/
function InputValue(InputBox, Year, Month, Day){
    if (Month < 10) {
        Month = '0' + Month
    }
    if (Day < 10) {
        Day = '0' + Day
    }
    InputBox.value = Year + "-" + Month + "-" + Day
    // ***********************/
}
// 上一月
function ForwardMonth(InputBox, Year, Month, Day){
    Month = Month - 1;
    if (Month < 1) {
        Month = 12;
        Year = Year - 1;
        if (Year < 1800)
            Year = 2500;
    }
    Day = ((GetThisDays(Year, Month) < Day) ? GetThisDays(Year, Month) : Day)
    Hid = false;
    ShowCalendar(InputBox, Year, Month, Day)
}
// 下一月
function NextMonth(InputBox, Year, Month, Day){
    Month = Month + 1;
    if (Month > 12) {
        Month = 1;
        Year = Year + 1;
        if (Year > 2500)
            Year = 1800;
    }
    Day = ((GetThisDays(Year, Month) < Day) ? GetThisDays(Year, Month) : Day)
    Hid = false;
    ShowCalendar(InputBox, Year, Month, Day)
}
// 上一年
function ForwardYear(InputBox, Year, Month, Day){
    Year = Year - 1;
    if (Year < 1800)
        Year = 2500;
    Day = ((GetThisDays(Year, Month) < Day) ? GetThisDays(Year, Month) : Day)
    Hid = false;
    ShowCalendar(InputBox, Year, Month, Day)
}
// 下一年
function NextYear(InputBox, Year, Month, Day){
    Year = Year + 1;
    if (Year > 2500)
        Year = 1800;
    Day = ((GetThisDays(Year, Month) < Day) ? GetThisDays(Year, Month) : Day)
    Hid = false;
    ShowCalendar(InputBox, Year, Month, Day)
}

/**
 * 在显示日历时，给显示的选择面板指定一个默认是选择日期
 * 
 * @author liuzhr
 */
function OpenDateFocus(where, focusDay){
    var dateInput = document.getElementById(where);
    if (dateInput.disabled) {
        return;
    }

    GetCalendar(dateInput, focusDay);
}

/*其它事件显示日历*/
function OpenDate(where){
    var dateInput = document.getElementById(where);
    if (dateInput.disabled)
        return;

    GetCalendar(dateInput, "");
}

/*根据输入框中的日期显示日历*/
/**
 * hack by liuzhr 如果指定了focusDay并且是一个有效的日期，则面板上选择日期时，使用这个日期
 * 
 * @param where 控件名称
 * @param focusDay 指定的面板上显示的默认日期
 */
function GetCalendar(where, focusDay){
    Hid = false;
    var Box_Name = where.name;
    var Box_value = where.value;
    // add by lizuhr
    // 使用自定义的面板默认选中值
    if (DateIsTrue(focusDay)) {
        loDate = focusDay.split("-");
        Y = parseFloat(loDate[0]);
        M = parseFloat(loDate[1]);
        D = parseFloat(loDate[2]);
        ShowCalendar(where, Y, M, D);
        return;
    }
    // add end-----------
    if (DateIsTrue(Box_value)) {
        loDate = Box_value.split("-");
        Y = parseFloat(loDate[0]);
        M = parseFloat(loDate[1]);
        D = parseFloat(loDate[2]);
        ShowCalendar(where, Y, M, D);
    } else {
        today = new Date();
        y = today.getFullYear();
        m = (today.getMonth() + 1);
        d = today.getDate();
        ShowCalendar(where, y, m, d);
    }
}

/*隐藏日历*/
function HiddenCalendar(){
    document.getElementById("Calendar").style.display = "none";
    document.getElementById("CalendarFrame").style.display = "none";
}
function CloseCalendar(){
    if (Hid) {
        HiddenCalendar();
    }
    Hid = true;
}

/*显示日历*/
function ShowCalendar(InputBox, The_Year, The_Month, The_Day){
    var Now_Year = (The_Year == null ? 2004 : The_Year);
    var Now_Month = (The_Month == null ? 1 : The_Month);
    var Now_Day = (The_Day == null ? 1 : The_Day);
    // var Box_Name='window.document.all.'+InputBox.name;
    var Box_Name = InputBox;
    var fw = GetFirstWeek(Now_Year, Now_Month);
    var ld = GetLastDays(Now_Year, Now_Month);
    var td = GetThisDays(Now_Year, Now_Month);
    var isnd = false;// 是否是下个月的日期
    var d = 1,
        w = 1;
    var FrameContent;
    var Frl, Frt, Winw, Winh, offsetLeft, offsetTop;

    /*显示的位置*/
    var dateInput = "document.getElementById('" + InputBox.id + "')";
    Winw = document.body.offsetWidth;
    Winh = document.body.offsetHeight;
    Frl = InputBox.getBoundingClientRect().left;
    Frt = InputBox.getBoundingClientRect().top + InputBox.clientHeight;
    offsetLeft = getLeft(InputBox) - Frl;
    offsetTop = getTop(InputBox) - Frt + InputBox.clientHeight;
    if (((Frl + Frw + Frs) > Winw) && (Frw + Frs < Winw))
        Frl = Winw - Frw - Frs;
    if ((Frt + Frh + Frs > Winh) && (Frh + Frs < Winh))
        Frt = Winh - Frh - Frs;
    Frl += offsetLeft;
    Frt += offsetTop + 3;
    with (document.getElementById("Calendar")) {
        style.display = "";
        style.left = Frl;
        style.top = Frt;
    }
    with (document.getElementById("CalendarFrame")) {
        style.display = "";
        style.left = Frl;
        style.top = Frt;
    }
    // 显示日历内容
    FrameContent = "\n<table onselectstart=\"return false;\" border='0' cellpadding='0' cellspacing='0' bgcolor='"
            + ColorTitle
            + "' width='"
            + Frw
            + "px' height='19px' style=\"color:white;font-weight:bolder;border:0px solid\">"
            + "\n<tr>\n";
    FrameContent += "<td width='18' align=right style='" + TDFont + "'>";
    FrameContent += "<img src='"
            + Datepick_ImagePath
            + "--.gif' width='8' height='11' border='0' alt='上一年' style='cursor:hand' onclick=\"ForwardYear ("
            + dateInput + "," + Now_Year + "," + Now_Month + "," + Now_Day
            + ")\">";
    FrameContent += "</td>\n";
    FrameContent += "<td vAlign=middle align='center' style='" + TDFont + "'>";
    FrameContent += Now_Year;
    FrameContent += "年";
    FrameContent += "</td>\n";
    FrameContent += "<td width=18 style='" + TDFont + "'>";
    FrameContent += "<img src='"
            + Datepick_ImagePath
            + "++.gif' width='8' height='11' border='0' alt='下一年' style='cursor:hand' onclick=\"NextYear ("
            + dateInput + "," + Now_Year + "," + Now_Month + "," + Now_Day
            + ")\">";
    FrameContent += "</td>\n";
    FrameContent += "<td width=18 align=right style='" + TDFont + "'>";
    FrameContent += "<img src='"
            + Datepick_ImagePath
            + "-.gif' width='8' height='11' border='0' alt='上一月' style='cursor:hand' onclick=\"ForwardMonth ("
            + dateInput + "," + Now_Year + "," + Now_Month + "," + Now_Day
            + ")\">";
    FrameContent += "</td>\n";
    FrameContent += "<td vAlign=middle align='center' width='16' style='"
            + TDFont + "'>";
    FrameContent += Now_Month;
    FrameContent += "</td>\n";
    FrameContent += "<td vAlign=middle align='center' width='13' style='"
            + TDFont + "'>";
    FrameContent += "月";
    FrameContent += "</td>\n";
    FrameContent += "<td width=18 style='" + TDFont + "'>";
    FrameContent += "<img src='"
            + Datepick_ImagePath
            + "+.gif' width='8' height='11' border='0' alt='下一月' style='cursor:hand' onclick=\"NextMonth ("
            + dateInput + "," + Now_Year + "," + Now_Month + "," + Now_Day
            + ")\">";
    FrameContent += "</td>" + "\n";
    FrameContent += "</tr>" + "\n";
    FrameContent += "</table>" + "\n";
    FrameContent += "<table onselectstart=\"return false;\" border='0' cellpadding='0' cellspacing='1' width='"
            + Frw + "' bgcolor='" + ColorGrid + "'>" + "\n";
    FrameContent += "<tr bgcolor='" + ColorHeader + "'>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorHeaderBG + "'>一</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorHeaderBG + "'>二</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorHeaderBG + "'>三</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorHeaderBG + "'>四</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorHeaderBG + "'>五</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorSaturday + "'>六</font></b></center></td>" + "\n";
    FrameContent += "<td style='" + TDFont + "'><center><b><font color='"
            + ColorSunday + "'>日</font></b></center></td>" + "\n";
    FrameContent += "</tr>" + "\n";
    // 如果本月第一天是星期一或星期天.应加上七.保证可以看到上个月的日期
    if (fw < 2)
        tf = fw + 7;
    else
        tf = fw;
    FrameContent += "<tr bgcolor='#FFFFFF'>" + "\n";
    // 第一行上月日期
    for (l = (ld - tf + 2); l <= ld; l = l + 1) {
        FrameContent += "<td  onclick=\"ForwardMonth (" + dateInput + ","
                + Now_Year + "," + Now_Month + "," + l
                + ")\" style='cursor:hand;" + TDFont
                + "'><center><font color='" + ColorPreMonth + "'>" + l
                + "</font></center></td>" + "\n";
        w = w + 1;
    }
    // 第一行本月日期
    for (f = tf; f <= 7; f = f + 1) {
        // 星期天但非输入日期
        if (((w % 7) == 0) && (d != Now_Day))
            FrameContent += "<td onMouseOver=\"this.style.background=\'"
                    + ColorOver
                    + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                    + dateInput + "," + Now_Year + "," + Now_Month + "," + d
                    + ");HiddenCalendar()\" style='cursor:hand;" + TDFont
                    + "'><center><font color='" + ColorSunday + "'>" + d
                    + "</font></center></td>" + "\n";
        else if (((w % 7) == 6) && (d != Now_Day))
            FrameContent += "<td onMouseOver=\"this.style.background=\'"
                    + ColorOver
                    + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                    + dateInput + "," + Now_Year + "," + Now_Month + "," + d
                    + ");HiddenCalendar()\" style='cursor:hand;" + TDFont
                    + "'><center><font color='" + ColorSaturday + "'>" + d
                    + "</font></center></td>" + "\n";
        // 日期为输入日期
        else if (d == Now_Day)
            FrameContent += "<td style=\"background:" + ColorTodayBG
                    + ";cursor:hand;" + TDFont + "\" onClick=\"InputValue("
                    + dateInput + "," + Now_Year + "," + Now_Month + "," + d
                    + ");HiddenCalendar()\"><center><font color='"
                    + ColorTodayFG + "'>" + d + "</font></center></td>" + "\n";
        // 其它
        else
            FrameContent += "<td onMouseOver=\"this.style.background=\'"
                    + ColorOver
                    + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                    + dateInput + "," + Now_Year + "," + Now_Month + "," + d
                    + ");HiddenCalendar()\" style='cursor:hand;" + TDFont
                    + "'><center><font color='" + ColorCurMonth + "'>" + d
                    + "</font></center></td>" + "\n";
        d = d + 1;
        w = w + 1;
    }
    FrameContent += "</tr>" + "\n";
    w = 1;
    for (i = 2; i < 7; i = i + 1) {
        FrameContent += "<tr bgcolor='#FFFFFF'>" + "\n";
        for (j = 1; j < 8; j = j + 1) {
            if (isnd)// 下个月的日期
                FrameContent += "<td style='cursor:hand;" + TDFont
                        + "' onclick=\"NextMonth (" + dateInput + ","
                        + Now_Year + "," + Now_Month + "," + d
                        + ")\"><center><font color='" + ColorPreMonth + "'>"
                        + d + "</font></center></td>" + "\n";
            else// 本月的日期
            {
                // alert(y+""+m+""+d+":"+FillZero(Now_Year)+FillZero(Now_Month)+FillZero(Now_Day));
                // 星期天但非输入日期
                if (((w % 7) == 0) && (d != Now_Day))
                    FrameContent += "<td onMouseOver=\"this.style.background=\'"
                            + ColorOver
                            + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                            + dateInput
                            + ","
                            + Now_Year
                            + ","
                            + Now_Month
                            + ","
                            + d
                            + ");HiddenCalendar()\" style='cursor:hand;"
                            + TDFont
                            + "'><center><font color='"
                            + ColorSunday
                            + "'>" + d + "</font></center></td>" + "\n";
                else if (((w % 7) == 6) && (d != Now_Day))
                    FrameContent += "<td onMouseOver=\"this.style.background=\'"
                            + ColorOver
                            + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                            + dateInput
                            + ","
                            + Now_Year
                            + ","
                            + Now_Month
                            + ","
                            + d
                            + ");HiddenCalendar()\" style='cursor:hand;"
                            + TDFont
                            + "'><center><font color='"
                            + ColorSaturday
                            + "'>"
                            + d
                            + "</font></center></td>" + "\n";
                // 日期为输入日期
                else if (d == Now_Day)
                    FrameContent += "<td style=\"background:" + ColorTodayBG
                            + ";cursor:hand;" + TDFont
                            + "\" onClick=\"InputValue(" + dateInput + ","
                            + Now_Year + "," + Now_Month + "," + d
                            + ");HiddenCalendar()\"><center><font color='"
                            + ColorTodayFG + "'>" + d + "</font></center></td>"
                            + "\n";
                // 其它
                else
                    FrameContent += "<td onMouseOver=\"this.style.background=\'"
                            + ColorOver
                            + "\'\" onMouseOut=\"this.style.background=\'#FFFFFF\'\" onClick=\"InputValue("
                            + dateInput
                            + ","
                            + Now_Year
                            + ","
                            + Now_Month
                            + ","
                            + d
                            + ");HiddenCalendar()\" style='cursor:hand;"
                            + TDFont
                            + "'><center><font color='"
                            + ColorCurMonth
                            + "'>"
                            + d
                            + "</font></center></td>" + "\n";
            }
            // 判断是否为本月的日期
            if (d == td) {
                isnd = true;
                d = 0;
            }
            w = w + 1;
            d = d + 1;
        }
        FrameContent += "</tr>" + "\n";
    }
    FrameContent += "</table>" + "\n";
    FrameContent += "<table onselectstart=\"return false;\" cellpadding='0' cellspacing='0' bgcolor='"
            + ColorTailer + "' width='" + Frw + "px' height='15'>" + "\n<tr>\n";
    FrameContent += "<td title=\"今日:" + GetTodayDate()
            + "\" style=\"cursor:hand;padding-left:4px;" + TDFont
            + "\" onclick=\"SetTodayDate(" + dateInput + ")\">";
    FrameContent += "<font color='" + ColorToday + "'>今日:</font><font color='"
            + ColorCurMonth + "'>" + GetTodayDate();
    FrameContent += "</font></td>\n";
    FrameContent += "<td onclick=\"clearCalendar(" + dateInput
            + ")\" style='cursor:hand;'>清除</td>";
    FrameContent += "<td  style='" + TDFont + "'>";
    FrameContent += "<img src='"
            + Datepick_ImagePath
            + "close.gif' width='11' height='11' border='0' alt='关闭' style='cursor:hand' onclick=\"HiddenCalendar()\">";
    FrameContent += "</td>\n";
    FrameContent += "</tr>\n";
    FrameContent += "</table>\n";
    document.getElementById("Calendar").innerHTML = FrameContent;
    document.getElementById("Calendar").style.display = "";
    document.getElementById("CalendarFrame").style.display = "";
}
/*显示输入框*/
function DateBox(sBoxName, sDfltValue){
    if (sBoxName == null)
        sBoxName = 'Date_Box'
    if ((sDfltValue == null) || !(DateIsTrue(sDfltValue)))
        sDfltValue = GetTodayDate()
    else {
        DateStr = sDfltValue.split("-");
        Y = parseFloat(DateStr[0]);
        M = (parseFloat(DateStr[1]) < 10)
                ? ('0' + parseFloat(DateStr[1]))
                : parseFloat(DateStr[1]);
        D = (parseFloat(DateStr[2]) < 10)
                ? ('0' + parseFloat(DateStr[2]))
                : parseFloat(DateStr[2]);
        sDfltValue = Y + '-' + M + '-' + D
    }
    document.write("<input size='10' readonly class='inputdate' name='"
            + sBoxName + "' value='" + sDfltValue + "' onclick='GetCalendar("
            + dateInput + ")' >");
}
document.onclick = CloseCalendar;
function clearCalendar(InputBox){
    InputBox.value = "";
}

// --Added by wangxl
/**
 * 获取左坐标
 */
function getLeft(o){
    var l = o.offsetLeft;
    while (o = o.offsetParent) {
        l += o.offsetLeft;
    }
    return l;
}

/**
 * 获取上坐标
 */
function getTop(o){
    var t = o.offsetTop;
    while (o = o.offsetParent) {
        t += o.offsetTop;
    }
    return t;
}

/**
 * 拷贝自ui.js，用来判断一个字符串是否是整数串
 * 
 * @param s 待判断的串
 * @return 如果s为空，返回true；如果都是数字，返回true;其他情况返回false
 */
function isInt(s){
    if (!s || s.isEmpty())
        return true;
    var arr = s.match(/^\d+$/);
    return arr != null;
}

/**
 * 处理输入Html Input失去焦点事件 校验输入的值是否是合法的，如果是YYYYMMDD则自动转化其格式为yyyy-MM-dd格式
 * 
 * @param dateInput 输入Html Input控件
 */
function checkDateValue(dateInput, errorMsg){
    var sDate = dateInput.value;
    if (sDate == "" || DateIsTrue(sDate)) {
        if (sDate != "") {
            splitXG(dateInput, sDate);
        }
        return true;
    }
    if (sDate && sDate.length == 8 && isInt(sDate)) {
        var d = sDate.substring(0, 4);
        d = d + "-";
        d = d + sDate.substring(4, 6);
        d = d + "-";
        d = d + sDate.substring(6);
        if (DateIsTrue(d)) {
            dateInput.value = d;
            return true;
        }
    }

    // TODO liuzhr 输出的错误信息更加合法化
    if (!errorMsg)
        return;
    errorMsg = errorMsg.replace(/(\^P)/g, "\n");
    if (window.confirm(errorMsg)) {
        dateInput.focus();
    } else {
        dateInput.value = GetTodayDate();
    }
}
/**
 * 将正斜杠替换为短横线
 * 
 * @param {} sDate
 */
function splitXG(dateInput, sDate){
    var oldDate = sDate;
    sDate = sDate.replace(/\//g, "-");
    var loDate = sDate.split("-");
    var Y = loDate[0];
    var M = loDate[1];
    var D = loDate[2];
    if (M.length == 1) {
        M = "0" + M;
    }
    if (D.length == 1) {
        D = "0" + D;
    }
    sDate = Y + "-" + M + "-" + D;

    if (sDate != oldDate)
        dateInput.value = sDate;
}
