// u93c4ue21au60c1u93c1u677fu74e7
function isValidNumber(sValue) {
	var sValidChars = "0123456789";
	var iStartFrom = 0;
	if (sValue.substring(0, 2) == "0x") {
		sValidChars = "0123456789abcdefABCDEF";
		iStartFrom = 2;
	} else {
		if (sValue.charAt(0) == "0") {
			sValidChars = "01234567";
			iStartFrom = 1;
		} else {
			if (sValue.charAt(0) == "-") {
				iStartFrom = 1;
			}
		}
	}
	for (var i = iStartFrom; i < sValue.length; i++) {
		if (sValidChars.indexOf(sValue.substring(i, i + 1)) == -1) {
			return false;
		}
	}
	return true;
}


// u9352u3086u67c7u93c4ue21au60c1u95c8u70b6u790bu93c1ufffd
function isValidPositiveNumber(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (isValidNumber(sValue)) {
		var iValue = parseFloat(sValue);
		if (!isNaN(iValue) && iValue >= 0) {
			return true;
		}
	}
	return false;
}


// u9352u3086u67c7u6924u7535u721cu6dc7u2103u4f05u93c4ue21au60c1u935au581fu7876
function validatePageNo(fieldPageNo, nMaxPage) {
	var iPageNo = fieldPageNo.value;
	var bValid = false;
	if (iPageNo != null && iPageNo != "") {
		if (!isValidPositiveNumber(iPageNo)) {
			alert("\u975e\u6cd5\u7684\u9875\u7801\u683c\u5f0f!");
		} else {
			if (iPageNo > nMaxPage || iPageNo < 1) {
				alert("\u9875\u7801\u5e94\u8be5\u57281\u5230" + nMaxPage + "\u4e4b\u95f4");
			} else {
				bValid = true;
			}
		}
	} else {
		alert("\u9875\u7801\u4e0d\u80fd\u4e3a\u7a7a");
	}
	if (!bValid) {
		fieldPageNo.focus();
		fieldPageNo.value = "";
	}
	return bValid;
}
/**
* u93cdu89c4u5d41u701bu6941ue18cu935au5d87u041eu6960u5c83u7609u701bu6941ue18cu6748u64b3u53c6u9350u546due190u93c4ue21au60c1u935au581fu7876
* @param formItem formu7035u7845u8584
* @param sFieldName u701bu6941ue18cu935au5d87u041e
* @param iFieldType u701bu6941ue18cu7eebu8bf2u7037
* @param sFieldShownName u701bu6941ue18cu93c4u5267u305au935au5d87u041e
* @param sProps u95c4u52ebu59deu705eu70b4ufffdufffd
* @param bCanNull u9359ue21au60c1u6d93u8679u2516
*/
function validateFormFieldWithName(formItem, sFieldName, iFieldType, sFieldShownName, sProps, bCanNull) {
	var fieldItem = formItem.elements(sFieldName);
	// modified by limin:原有的判断，没有判断field对象的长度，当有多个同名字段时，此处的判断会有问题
	if (fieldItem != null && fieldItem.length != null && formItem.length == 0) {
		fieldItem = fieldItem(0);			
	}
	return validateFormField(fieldItem, iFieldType, sFieldShownName, sProps, bCanNull);
}

// u701bu6941ue18cu7eebu8bf2u7037u7039u6c2bu7b9f
var FIELD_TYPE_String = 0;        // u701bu6943ue0c1u6d93ufffd
var FIELD_TYPE_NormalCode = 1;    // u93c5ue1c0ufffdu6c2bu552cu942eufffd
var FIELD_TYPE_CombinedCode = 2;  // u6fb6u5d85u608eu6d60uff47u721c
var FIELD_TYPE_CorpNo = 3;        // u9357u66dau7d85u7f02u6827u5f7f
var FIELD_TYPE_DeptCode = 4;      // u95aeu3129u68ecu7f02u6827u5f7f
var FIELD_TYPE_EmpNo = 5;         // u6d5cu54c4u61b3u7f02u6827u5f7f
var FIELD_TYPE_LimitativeRelated = 6;        // u934fu5ba0u4ec8u9350u546due190
var FIELD_TYPE_Related = 7;       // u934fu5ba0u4ec8u93c4u5267u305a
var FIELD_TYPE_Image = 8;         // u9365u5267u5896
var FIELD_TYPE_Date = 9;          // u93c3u30e6u6e61
var FIELD_TYPE_Time = 10;         // u93c3u5815u68ff
var FIELD_TYPE_File = 11;         // u93c2u56e6u6b22
var FIELD_TYPE_DateTime = 12;     // u93c3u30e6u6e61u93c3u5815u68ff
var FIELD_TYPE_DateHourMinute = 16;    // u93c3u30e6u6e61u704fu5fd4u6902u9352u55dbu6313
var FIELD_TYPE_CascadeCode = 13;  // u9352u55d9u9a87u6d60uff47u721c
var FIELD_TYPE_Year = 14;	        // u9a9eu7fe0u5524
var FIELD_TYPE_Password = 15;          // u7035u55d9u721c
var FIELD_TYPE_Corp_Dept = 30;         // u9357u66dau7d85u95aeu3129u68ec
var FIELD_TYPE_Corp_Dept_Emp = 31;     // u9357u66dau7d85u95aeu3129u68ecu6d5cu54c4u61b3
var FIELD_TYPE_Mail2Emp = 32;          // u95adue1bbu6b22u9366u677fu6f43
var FIELD_TYPE_Mail2Address = 33;      // u95adue1bbu6b22u9366u677fu6f43
var FIELD_TYPE_MultiCascadeCode = 34;  // u6fb6u6c2cufffdu714eu578eu7efeu0442u552cu942eufffd
var FIELD_TYPE_Float = 40;             // u5a34ue1beu5063u93c1ufffd
var FIELD_TYPE_Integer = 41;           // u93c1u6751u8230
var FIELD_TYPE_PopSearch = 42;    // u5beeu7470u56adu93ccu30e8ue1d7u7ed0u6940u5f5b
var FIELD_TYPE_URL = 43;          // URL
var FIELD_TYPE_Composite = 46;    // u6fb6u5d85u608eu701bu6941ue18c
var FIELD_TYPE_Binary = 47;       // u6d5cu5c83u7e58u9352ufffd
var FIELD_TYPE_UserDefine = 100;       // u9422u3126u57dbu9477ue044u757eu6d94ufffd
/**
* u6960u5c83u7609u701bu6941ue18cu6748u64b3u53c6u6dc7u2103u4f05u93c4ue21au60c1u935au581fu7876
* @param fieldItem inputu7035u7845u8584
* @param iFieldType u701bu6941ue18cu7eebu8bf2u7037 
* @param sFieldShownName u701bu6941ue18cu93c4u5267u305au935au5d87u041e
* @param sProps u93b5u2541u774du705eu70b4ufffdufffd
* @param bCanNull u9359ue21au60c1u6d93u8679u2516
*/
function validateFormField(fieldItem, iFieldType, sFieldShownName, sProps, bCanNull) {
	if (!bCanNull) {
		if (isEmptyField(fieldItem)) {
			if (!isFieldCanNull(fieldItem, iFieldType, bCanNull)) {
				alert(sFieldShownName + "\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9\uff01");
				focusField(fieldItem);
				return false;
			} else {
				return true;
			}
		}
	}
	if (iFieldType == FIELD_TYPE_File || iFieldType == FIELD_TYPE_Image) {
		return validateFileName(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Mail2Address) {
		return validateEmail(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_URL) {
		return validateURL(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Year) { // u9a9eu7fe0u5524
		return validateYear(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Date) { // u93c3u30e6u6e61
		return validateDate(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_DateTime) { // u93c3u30e6u6e61u93c3u5815u68ff
		return validateDateTime(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_DateHourMinute) { // u93c3u30e6u6e61u704fu5fd4u6902u9352u55dbu6313
		return validateDateHourMinute(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Time) { // u93c3u5815u68ff
		return validateTime(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Password) { // u7035u55d9u721c
		return validatePassword(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Float) {
		return validateFloat(fieldItem, sFieldShownName, sProps);
	}
	if (iFieldType == FIELD_TYPE_Integer) {
		return validateInteger(fieldItem, sFieldShownName, sProps);
	}
	return true;
}
/******************************************************************************
 *                                                                            *
 *                    u9422u3125u57ccu9428u52ebu6087u5bb8u30e5u53ffu93c2u89c4u7876                                        *
 *                                                                            *
 ******************************************************************************/
/**
 * u6d60u5ea1u7758u93acu0443u74e7u7ed7ufe3fu8986u6d93ue161u5e4fu9359u6827ue1eeu6434u65c2u6b91u705eu70b4ufffdu0443ufffdufffd
 */
function getProperty(sProps, sParName) {
	return parseParValue(sProps, sParName, ";");
}
/**
 * u6960u5c83u7609u93c2u56e6u6b22u935au5d87u041e
 *
 * @param fieldItem inputu7035u7845u8584
 * @param sFieldShownName u93c4u5267u305au935au5d87u041e
 * @param sProps u93b5u2541u774du705eu70b4ufffdufffd
 */
function validateFileName(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidFileName(sValue)) {
		sErrorMsg = sFieldShownName + "\u4e0d\u662f\u5408\u6cd5\u7684\u6587\u4ef6\u540d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u5204RL
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateEmail(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidEmail(sValue)) {
		sErrorMsg = sFieldShownName + "\u7684\u683c\u5f0f\u5e94\u8be5\u662f\uff1ayourname@yourcorp.com";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u5204RL
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateURL(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidURL(sValue)) {
		sErrorMsg = sFieldShownName + "\u4e0d\u662f\u5408\u6cd5\u7684URL\uff0cURL\u9700\u8981\u4ee5\u201chttp://\u201d\u8d77\u59cb";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ebu52feu6d60ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 * @param bCanNull boolean u93c4ue21au60c1u9359ue21cu2516
 */
function validateYear(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidYear(sValue, false)) {
		sErrorMsg = sFieldShownName + "\u7684\u683c\u5f0f\u5e94\u8be5\u662f\uff1a2004\uff0c\u5e76\u4e14\u5e74\u4efd\u9700\u8981\u57281900\u548c3000\u5e74\u4e4b\u95f4";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ebu52feu6d60u65a4u7d1du9a9eu6735u7b16u9a9eu7fe0u5524u6d93u5d88u5158u6d93u8679u2516
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateNotEmptyYear(fieldItem, sFieldShownName, sProps) {
	if (isEmptyField(fieldItem)) {
		alert(sFieldShownName + "\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9\uff01");
		focusField(fieldItem);
		return false;
	} else {
		return validateYear(fieldItem, sFieldShownName, sProps);
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu68e9u93c8u71b8u6902u95c2ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateDateTime(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidDateTime(sValue)) {
		sErrorMsg = sFieldShownName + "\u7684\u683c\u5f0f\u5e94\u8be5\u662f\uff1a2004-1-1 12:01:01\uff0c\u5e76\u4e14\u5e74\u4efd\u9700\u8981\u57281900\u548c3000\u5e74\u4e4b\u95f4";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu68e9u93c8u71b7u76acu93c3u8dfau578eu95bdufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateDateHourMinute(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidDateHourMinute(sValue)) {
		sErrorMsg = sFieldShownName + "\u7684\u683c\u5f0f\u5e94\u8be5\u662f\uff1a2004-1-1 12:01\uff0c\u5e76\u4e14\u5e74\u4efd\u9700\u8981\u57281900\u548c3000\u5e74\u4e4b\u95f4";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu68e9u93c8u71b8u6902u95c2u8fbeu7d1du9a9eu6735u7b16u93c3u30e6u6e61u93c3u5815u68ffu6d93u5d88u5158u6d93u8679u2516
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateNotEmptyDateTime(fieldItem, sFieldShownName, sProps) {
	if (isEmptyField(fieldItem)) {
		alert(sFieldShownName + "\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9\uff01");
		focusField(fieldItem);
		return false;
	} else {
		return validateDateTime(fieldItem, sFieldShownName, sProps);
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu68e9u93c8ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateDate(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidDate(sValue)) {
		sErrorMsg = sFieldShownName + "\u7684\u683c\u5f0f\u5e94\u8be5\u662f\uff1a2004-1-1\uff0c\u5e76\u4e14\u5e74\u4efd\u9700\u8981\u57281900\u548c3000\u5e74\u4e4b\u95f4";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu68e9u93c8u71c2u7d1du9a9eu6735u7b16u93c3u30e6u6e61u6d93u5d88u5158u6d93u8679u2516
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateNotEmptyDate(fieldItem, sFieldShownName, sProps) {
	if (isEmptyField(fieldItem)) {
		alert(sFieldShownName + "\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9\uff01");
		focusField(fieldItem);
		return false;
	} else {
		return validateDate(fieldItem, sFieldShownName, sProps);
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu6902u95c2ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateTime(fieldItem, sFieldShownName, sProps) {
	return true;
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ebu7611u942eu4f8au7d1du7035u55d9u721cu9359ue044u5391u7481u6b4cu7dedu934fu30e5u74e7u59e3u5d83ufffdu4f79u669fu701bu693cufffdu4f77u7b05u9352u6394u568e
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validatePassword(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sErrorMsg = null;
	if (!isValidPassword(sValue)) {
		sErrorMsg = sFieldShownName + "\u4e0d\u662f\u5408\u6cd5\u7684\u5bc6\u7801\uff0c\u5bc6\u7801\u53ea\u5141\u8bb8\u8f93\u5165\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu8bdeu9410u7470u74e7u5a08ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateFloat(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sMax = getProperty(sProps, "max");
	var sMin = getProperty(sProps, "min");
	var sErrorMsg = null;
	if (isValidFloat(sValue, false)) {
		if (sMax != null) {
			if (parseInt(sMax) < sValue) {
				sErrorMsg = sFieldShownName + "\u5fc5\u987b\u5c0f\u4e8e\u7b49\u4e8e" + sMax;
			}
		}
		if (sMin != null) {
			if (parseInt(sMin) > sValue) {
				sErrorMsg = sFieldShownName + "\u5fc5\u987b\u5927\u4e8e\u7b49\u4e8e" + sMin;
			}
		}
	} else {
		sErrorMsg = sFieldShownName + "\u4e0d\u662f\u6d6e\u70b9\u6570\uff0c\u8bf7\u8f93\u5165\u6d6e\u70b9\u6570";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u9428u52ecu66a3u93c1u677fu74e7u5a08ufffd
 *
 * @param fieldItem Field u752fufe3du724eu6960u5c7du74e7u5a08ufffd
 * @param sFieldShownName String u701bu6941ue18cu6d93ue15fu6783u935aufffd
 * @param sProps String u705eu70b4ufffdufffd
 */
function validateInteger(fieldItem, sFieldShownName, sProps) {
	var sValue = fieldItem.value;
	var sMax = getProperty(sProps, "max");
	var sMin = getProperty(sProps, "min");
	var sErrorMsg = null;
	if (isValidInteger(sValue, false)) {
		if (sMax != null) {
			if (parseInt(sMax) < parseInt(sValue)) {
				sErrorMsg = sFieldShownName + "\u5fc5\u987b\u5c0f\u4e8e\u7b49\u4e8e" + sMax;
			}
		}
		if (sMin != null) {
			if (parseInt(sMin) > parseInt(sValue)) {
				sErrorMsg = sFieldShownName + "\u5fc5\u987b\u5927\u4e8e\u7b49\u4e8e" + sMin;
			}
		}
	} else {
		sErrorMsg = sFieldShownName + "\u4e0d\u662f\u6574\u6570\uff0c\u8bf7\u8f93\u5165\u6574\u6570";
	}
	if (sErrorMsg == null) {
		return true;
	} else {
		alert(sErrorMsg);
		focusField(fieldItem);
		return false;
	}
}
/**
 * u59abufffdu93ccue64cormu6d93ue160u6b91u93ccu612au91dcFieldu93c4ue21au60c1u59dduff47u2018
 * u701bu612fu3003u701bu6941ue18cu935au5d88u3003u7ec0u70d8u67dfu5a09u66deu8230u6fe1u50a6u7d30
 *    TableItem(sMainTb).rows[0].subTable(sSubTb).rows[0].column(sTbFieldName).value
 *    TableItem.rows[0].subTable(sSubTb).rows[0].column(sTbFieldName).value
 *
 * @param formItem Form u5bf0u546eu724eu6960u5c80u6b91Form
 * @param fieldItem Field Formu6d93ue160u6b91u93ccu612au91dcu701bu6941ue18c
 * @param iFieldType int Fieldu9366u3126u669fu93b9ue1bcu74e7u934fu9550u8151u9428u52edu88abu9368ufffd
 * @param bCanNull boolean u93c4ue21au60c1u9359ue219u8d1fu7eccufffd
 *
 * @return boolean true: u701bu6941ue18cu9350u546due190u59dduff47u2018; false: u701bu6941ue18cu9350u546due190u6d93u5d86ue11cu7eadufffd
 */
function isFieldCanNull(fieldItem, iFieldType, bCanNull) {
	return bCanNull || null == fieldItem;
}
/******************************************************************************
 *                                                                            *
 *                         u93cduffe0u7359u934au517cu67dfu5a09ufffd                                          *
 *                                                                            *
 ******************************************************************************/
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu93c1u677fu74e7u93cdu714eu7d21u951bu5c7cu7b09u93c0ue21bu5bd4u9225ufffd-0xu9225ufffd
 *
 * @param sNumber String u93c1u677fu74e7u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidNumber(sValue) {
	var sValidChars = "0123456789";
	var iStartFrom = 0;
	if (sValue.substring(0, 2) == "0x") {
		sValidChars = "0123456789abcdefABCDEF";
		iStartFrom = 2;
	} else {
		if (sValue.charAt(0) == "0") {
			sValidChars = "01234567";
			iStartFrom = 1;
		} else {
			if (sValue.charAt(0) == "-") {
				iStartFrom = 1;
			}
		}
	}
	for (var i = iStartFrom; i < sValue.length; i++) {
		if (sValidChars.indexOf(sValue.substring(i, i + 1)) == -1) {
			return false;
		}
	}
	return true;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu59dduff46u669fu93cdu714eu7d21
 *
 * @param sValue String u93c1u677fu74e7u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidPositiveNumber(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (isValidNumber(sValue)) {
		var iValue = parseFloat(sValue);
		if (!isNaN(iValue) && iValue >= 0) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eFloatu93cdu714eu7d21
 *
 * @param sValue String u5a34ue1beu5063u93c1u677fu74e7u7ed7ufe3fu8986
 * @param bPositiveOnly boolean u93c4ue21au60c1u8e47u5474u300fu93c4ue21bue11cu93c1ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidFloat(sValue, bPositiveOnly) {
	if (sValue.length == 0) {
		return true;
	}
	var asTemp = sValue.split(".");
	var sJoined = asTemp.join("");
	var bValidNumber;
	if (!bPositiveOnly) {
		bValidNumber = isValidNumber(sJoined);
	} else {
		bValidNumber = isValidPositiveNumber(sJoined);
	}
	if (bValidNumber) {
		var iValue = parseFloat(sValue);
		return !isNaN(iValue);
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eIntegeru93cdu714eu7d21
 *
 * @param sValue String u93c1u5b58u669fu701bu6943ue0c1u6d93ufffd
 * @param bPositiveOnly boolean u93c4ue21au60c1u8e47u5474u300fu93c4ue21bue11cu93c1ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidInteger(sValue, bPositiveOnly) {
	if (sValue.length == 0) {
		return true;
	}
	var bValidNumber;
	if (!bPositiveOnly) {
		bValidNumber = isValidNumber(sValue);
	} else {
		bValidNumber = isValidPositiveNumber(sValue);
	}
	if (bValidNumber) {
		var iValue = parseInt(sValue);
		if (!isNaN(iValue) && (iValue >= -9223372036854776000 && iValue <= 9223372036854776000)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eShortu93cdu714eu7d21
 *
 * @param sValue String Shortu701bu6943ue0c1u6d93ufffd
 * @param bPositiveOnly boolean u93c4ue21au60c1u8e47u5474u300fu93c4ue21bue11cu93c1ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidShort(sValue, bPositiveOnly) {
	if (sValue.length == 0) {
		return true;
	}
	var bValidNumber;
	if (!bPositiveOnly) {
		bValidNumber = isValidNumber(sValue);
	} else {
		bValidNumber = isValidPositiveNumber(sValue);
	}
	if (bValidNumber) {
		var iValue = parseInt(sValue);
		if (!isNaN(iValue) && (iValue >= -32768 && iValue <= 32767)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eByteu93cdu714eu7d21
 *
 * @param sValue String Byteu701bu6943ue0c1u6d93ufffd
 * @param bPositiveOnly boolean u93c4ue21au60c1u8e47u5474u300fu93c4ue21bue11cu93c1ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidByte(sValue, bPositiveOnly) {
	if (sValue.length == 0) {
		return true;
	}
	if (isValidNumber(sValue)) {
		var iValue = parseInt(sValue);
		if (!isNaN(iValue) && (iValue >= -128 && iValue <= 127)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu95adue1bbu6b22u9366u677fu6f43u93cdu714eu7d21
 *
 * @param sValue String u95adue1bbu6b22u9366u677fu6f43u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidEmail(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eURLu93cdu714eu7d21
 *
 * @param sValue String URLu701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidURL(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^http:\/\/.*\..*/i;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu93c2u56e6u6b22u935au5d86u7278u5beeufffd
 *
 * @param sValue String u93c2u56e6u6b22u935au5d85u74e7u7ed7ufe3fu8986
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidFileName(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^[^\?\*<>\|\"]*$/;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u7035u55d9u721cu93cdu714eu7d21
 *
 * @param sValue String u5bf0u546eue5c5u93ccu30e7u6b91u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidPassword(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^\w*$/;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u9428u52ecu7621u6d93ue044u74e7u7ed7ufe3du69f8u935aufe3du69f8u9369u70d8u6e70ASCIIu942eufffd
 *
 * @param sValue String u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValidBasicAscii(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^\w*$/;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u9428u52ecu7621u6d93ue044u74e7u7ed7ufe3du69f8u935aufe3du69f826u701bu6941u761d
 *
 * @param sValue String u701bu6943ue0c1u6d93ufffd
 *
 * @return boolean true: u7ed7ufe40u608e; false: u6d93u5d87ue0c1u935aufffd
 */
function isValid26Letters(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	var sRE = /^[a-zA-Z]*$/;
	return sRE.test(sValue);
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u93c3u30e6u6e61u93cdu714eu7d21
 *     u935au581fu7876u9a9eu7fe0u5524u951bufffd00-3000u951bufffd
 *     u935au581fu7876u93c8u581cu5524u951bufffd12u951bufffd
 *     u935au581fu7876u93c3u30e6u6e61u951bufffd31u951bufffd
 *
 * @param sValue String u93c3u30e6u6e61u701bu6943ue0c1u6d93u8be7u7d19u935au581fu7876u93c3u30e6u6e61u951bu6b7dyyy-mm-ddu951bufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidDate(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (sValue.length < 8) {
		return false;
	}
	var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2})$/;
	var asMatched = sRE.exec(sValue);
	if (asMatched != null) {
		var sYear = asMatched[1];
		var sMonth = asMatched[3];
		var sDay = asMatched[4];
		if (isValidDateNumber(sYear, sMonth, sDay)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u93c3u30e6u6e61u93c3u5815u68ffu93cdu714eu7d21
 *     u935au581fu7876u9a9eu7fe0u5524u951bufffd00-3000u951bufffd
 *     u935au581fu7876u93c8u581cu5524u951bufffd12u951bufffd
 *     u935au581fu7876u93c3u30e6u6e61u951bufffd31u951bufffd
 *     u935au581fu7876u704fu5fd4u6902u951bufffd24u951bufffd
 *     u935au581fu7876u9352u55dbu6313u951bufffd59u951bufffd
 *     u935au581fu7876u7ec9u639eu7d30  0-59u951bufffd
 *
 * @param sValue String u93c3u30e6u6e61u701bu6943ue0c1u6d93u8be7u7d19u935au581fu7876u93c3u30e6u6e61u951bu6b7dyyy-mm-dd hh:mm:ss/yyyy.mm.dd hh:mm:ssu951bufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidDateTime(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (sValue.length < 15) {
		return isValidDate(sValue);
	}
	var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var asMatched = sRE.exec(sValue);
	if (asMatched != null) {
		var sYear = asMatched[1];
		var sMonth = asMatched[3];
		var sDay = asMatched[4];
		var sHour = asMatched[5];
		var sMinute = asMatched[6];
		var sSecond = asMatched[7];
		if (!isValidDateNumber(sYear, sMonth, sDay)) {
			return false;
		}
		if (isValidTimeNumber(sHour, sMinute, sSecond, true)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u93c3u30e6u6e61u93c3u5815u68ffu93cdu714eu7d21
 *     u935au581fu7876u9a9eu7fe0u5524u951bufffd00-3000u951bufffd
 *     u935au581fu7876u93c8u581cu5524u951bufffd12u951bufffd
 *     u935au581fu7876u93c3u30e6u6e61u951bufffd31u951bufffd
 *     u935au581fu7876u704fu5fd4u6902u951bufffd24u951bufffd
 *     u935au581fu7876u9352u55dbu6313u951bufffd59u951bufffd
 *
 * @param sValue String u93c3u30e6u6e61u701bu6943ue0c1u6d93u8be7u7d19u935au581fu7876u93c3u30e6u6e61u951bu6b7dyyy-mm-dd hh:mm:ss/yyyy.mm.dd hh:mmu951bufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidDateHourMinute(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (sValue.length < 15) {
		return isValidDate(sValue);
	}
	var sRE = /^(\d{4})([\.\-\/])(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
	var asMatched = sRE.exec(sValue);
	if (asMatched != null) {
		var sYear = asMatched[1];
		var sMonth = asMatched[3];
		var sDay = asMatched[4];
		var sHour = asMatched[5];
		var sMinute = asMatched[6];
		var sSecond = "0";
		if (!isValidDateNumber(sYear, sMonth, sDay)) {
			return false;
		}
		if (isValidTimeNumber(sHour, sMinute, sSecond, true)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u93c3u5815u68ffu93cdu714eu7d21
 *     u935au581fu7876u704fu5fd4u6902u951bufffd24u951bufffd
 *     u935au581fu7876u9352u55dbu6313u951bufffd59u951bufffd
 *     u935au581fu7876u7ec9u639eu7d30  0-59u951bufffd
 *
 * @param sValue String u93c3u5815u68ffu701bu6943ue0c1u6d93u8be7u7d19u935au581fu7876u93c3u30e6u6e61u951bu6b68h:mm:ssu951bufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidTime(sValue) {
	if (sValue.length == 0) {
		return true;
	}
	if (sValue.length < 15) {
		return false;
	}
	var sRE = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var asMatched = sRE.exec(sValue);
	if (asMatched != null) {
		var sHour = matched[1];
		var sMinute = matched[2];
		var sSecond = matched[3];
		if (isValidTimeNumber(sHour, sMinute, sSecond, true)) {
			return true;
		}
	}
	return false;
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u93c3u30e6u6e61
 *     u935au581fu7876u9a9eu7fe0u5524u951bufffd00-3000u951bufffd
 *     u935au581fu7876u93c8u581cu5524u951bufffd12u951bufffd
 *     u935au581fu7876u93c3u30e6u6e61u951bufffd31u951bufffd
 *
 * @param iYear int u9a9eu7fe0u5524
 * @param iMonth int u93c8u581cu5524
 * @param iDay u93c3u30e6u6e61
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidDateNumber(iYear, iMonth, iDay) {
	if (!iYear || !iMonth || !iDay) {
		return false;
	}
	if (!isValidYear(iYear, false)) {
		return false;
	}
	if (iMonth < 1 || iMonth > 12) {
		return false;
	}
	if (iDay < 1 || iDay > 31) {
		return false;
	}
	if ((iMonth == 4 || iMonth == 6 || iMonth == 9 || iMonth == 11) && (iDay == 31)) {
		return false;
	}
	if (iMonth == 2) {
		var bLeapYear = (iYear % 4 == 0 && (iYear % 100 != 0 || iYear % 400 == 0));
		if (iDay > 29 || (iDay == 29 && !bLeapYear)) {
			return false;
		}
	}
	return true;
}
/**
 * u59abufffdu93ccu30e6u69f8u935aufe3du69f8u935au581fu7876u93c3u5815u68ff
 *     u935au581fu7876u704fu5fd4u6902u951bufffd24u951bufffd
 *     u935au581fu7876u9352u55dbu6313u951bufffd59u951bufffd
 *     u935au581fu7876u7ec9u639eu7d300-59u951bufffd
 *
 * @param iHour int u9a9eu7fe0u5524
 * @param iMinute int u93c8u581cu5524
 * @param iSecond int u7ec9ufffd
 * @param bCheckSecond boolean u93c4ue21au60c1u59abufffdu93ccu30e2ufffdu6ec5ue757u9225ufffd
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidTimeNumber(iHour, iMinute, iSecond, bCheckSecond) {
	if (!iHour || !iMinute) {
		return false;
	}
	if (iHour > 23 || iHour < 0) {
		return false;
	}
	if (iMinute > 59 || iMinute < 0) {
		return false;
	}
	if (bCheckSecond) {
		if (!iSecond) {
			return false;
		}
		if (iSecond > 59 || iSecond < 0) {
			return false;
		}
	}
	return true;
}
/**
 * u59abufffdu93ccu30e5u74e7u7ed7ufe3fu8986u93c4ue21au60c1u7ed7ufe40u608eu935au581fu7876u9a9eu7fe0u5524u93cdu714eu7d21
 *
 * @param sValue String u5bf0u546eue5c5u93ccu30e7u6b91u701bu6943ue0c1u6d93ufffd
 * @param bPastYear boolean u93c4ue21au60c1u93c4ue21au51e1u7f01u5fd5u7ca1u9358u55dau7e43u9428u52ebu52feu6d60u65a4u7d19u9356u546du60c8u8930u64b3u58a0u9a9eu8fbeu7d1a
 *
 * @return boolean true: u935au581fu7876; false: u95c8u70b4u7876
 */
function isValidYear(sValue, bPastYear) {
	var today = new Date();
	if (sValue == "" || sValue == null) {
		return true;
	}
	if (sValue.length == 4 && isValidPositiveNumber(sValue)) {
		var iYear = parseInt(sValue);
		if (iYear >= 1900 && iYear <= 3000) {
			if (bPastYear) {
				if (iYear <= parseInt(today.getYear())) {
					return true;
				}
			} else {
				return true;
			}
		}
	}
	return false;
}

