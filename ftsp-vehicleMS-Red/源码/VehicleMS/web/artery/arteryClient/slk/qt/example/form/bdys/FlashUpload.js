// **********************************************//
// FlashUpload 客户端脚本
// 
// @author Artery
// @date 2011-05-05
// @id a7a12d46c2e6ad7cfa2d9afc716c5851
// **********************************************//
/**
 * onClickClient(buttone0ad9)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttone0ad9_onClickClient(rc) {
	Artery.get("uploadInPanel").startUpload({
				params : {
					x : 5
				},
				callback : function(result) {
					alert(result);
				}
			});
}
/**
 * onClickClient(buttoneb175)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttoneb175_onClickClient(rc) {
	Artery.get("uploadInForm").startUpload({
				params : {
					x : 5
				},
				callback : function(result) {
					alert(result);
				}
			});
}
/**
 * onClickClient(button44b37)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button44b37_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getStats()));
}
/**
 * onClickClient(button3368d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button3368d_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getFileName()));
}
/**
 * onClickClient(buttone4003)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttone4003_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getFileSize()));
}
/**
 * onClickClient(button0337e)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button0337e_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getFileSize("mb")));
}
/**
 * onClickClient(buttond902d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttond902d_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getFile(0)));
}
/**
 * onClickClient(button01972)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button01972_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInPanel").getFile()));
}

/**
 * onClickClient(button44b37)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button411da_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getStats()));
}

/**
 * onClickClient(button3368d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button6d33c_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getFileName()));
}

/**
 * onClickClient(buttone4003)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button8aa4b_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getFileSize()));
}
/**
 * onClickClient(buttonfd1bb)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttonfd1bb_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getFileSize("kb")));
}

/**
 * onClickClient(buttond902d)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function button8e81a_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getFile(0)));
}

/**
 * onClickClient(button01972)
 * 
 * @param rc
 *            系统提供的AJAX调用对象
 */
function buttona3ceb_onClickClient(rc) {
	alert(Ext.encode(Artery.get("uploadInForm").getFile()));
}
