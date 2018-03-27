// **********************************************//
// 图书管理 首页面
// 
// @author Artery
// @date 2010-03-30
// @id E59B8F2F756AB1B27A08D4DD8099C8E2
// **********************************************//

/**
 * 客户端(loginBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function loginBtn_onClickClient (rc){
	Artery.get("loginForm").login(function(result){
		Artery.get('searchBtn').show();
		Artery.get('userBtn').show();
		if(result.isLibAdmin){
			Artery.get('bookBtn').show();
		}
		if(result.isSuperAdmin){
			Artery.get('libBtn').show();
		}
		var dt = new Date();
		Artery.get("welcomArea").show();
		Artery.get("welcomArea").updateText('<span style="padding-left;10px">欢迎你：'+result.userName + '，今天是：'+dt.format('Y年m月d日') + '</span>');		
		Artery.get("loginForm").hide();
		Artery.get("loginBtn").hide();
		Artery.get("logoutBtn").show();
		Artery.get("bookList").reload();
		Artery.showMessage("登录成功！");
	});
}

/**
 * 客户端(searchBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function searchBtn_onClickClient (rc){
	Artery.get("cxtstab").active();
}

  	
/**
 * 回车时脚本(loginForm)
 * 
 */
function loginForm_onEnter (){
	Artery.get("loginBtn").fireEvent("click");
}
  	

/**
 * 客户端(userBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function userBtn_onClickClient (rc){
	Artery.get("gytab").openForm({
		formId:'B5327983AA4C4B5160C52C1EBD63C431'
	});
	Artery.get("gytab").active();
}

/**
 * 客户端(bookBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function bookBtn_onClickClient (rc){
	Artery.get("gytab").openForm({
		formId:'2765BEF77ADB83F136E8E5B076CB476D'
	});
	Artery.get("gytab").active();
}

/**
 * 客户端(libBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function libBtn_onClickClient (rc){
	Artery.get("gytab").openForm({
		formId:'C0C7240951FBB6F53F1700DEE8812493'
	});
	Artery.get("gytab").active();
}

/**
 * 客户端(themeExt)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function themeExt_onClickClient (rc){
	rc.put("themes","default");
	rc.send(function(result){
		window.location.reload(true);
	});
}

/**
 * 客户端(themeClassic)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function themeClassic_onClickClient (rc){
	rc.put("themes","classic");
	rc.send(function(result){
		window.location.reload(true);
	});
}

/**
 * 客户端(themeNice)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function themeNice_onClickClient (rc){
	rc.put("themes","nice");
	rc.send(function(result){
		window.location.reload(true);
	});
}

/**
 * 客户端(logoutBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function logoutBtn_onClickClient (rc){
	Artery.logout(function(result){
		window.location.reload(true);
	});
}

/**
 * 客户端(ydOper)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function ydOper_onClickClient (rc, c_id){
	rc.put("bookCId",c_id); 
	rc.send(function(result){
		if(result.error){
	    	Artery.showError(result.error);
	    	return ;
		}
		Artery.showMessage("预定成功！");
  		Artery.get("bookList").reload(); 
	});
}

/**
 * 客户端(ghOper)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param {rs1.C_ID}
 */
function ghOper_onClickClient (rc, bookCId){
	Artery.confirmMsg('归还',"确定要归还这本图书？",function(btn){
	    if(btn == 'yes'){
	        rc.put("bookCId",bookCId); 
	        rc.send(function(result){
	            Artery.get("bookList").reload(); 
	        });
	    }
	});
}

/**
 * 客户端(userBtn)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function userBtn_onClickClient (rc){
	Artery.get("gytab").openForm({
		formId:'B5327983AA4C4B5160C52C1EBD63C431'
	});
	Artery.get("gytab").active();
}