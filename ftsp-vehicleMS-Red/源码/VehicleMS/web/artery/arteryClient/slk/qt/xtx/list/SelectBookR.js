// **********************************************//
// SelectBook 客户端脚本
// 
// @author Artery 
// @date 2010-05-06
// @id 9f8110ac4132b9c54904669443c4bd84
// **********************************************//
/**
 * 客户端(button537a2)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function button537a2_onClickClient (rc){
	var val = Artery.get('listAreaa3e00').getSelectedRowJson();
	if(val == null || val == ''){
		return;
	}
	
	//判断是否已经存在
	var values = Artery.get('listArea0876b').getValuesArray('columnString2f259');
	if(values != null && values.length != 0){
		for(var i in values){
			if(values[i] == val['columnStringCNAME']){
				return;
			}
		}
	}
	
	var o = {};
	for(var i in val){
		o['columnString2f259'] = val[i];
	}
	Artery.get('listArea0876b').insertRecord(o);
	
	//改变选中节点的颜色
	var selectRow = Artery.get('listAreaa3e00').selectedRow;
	if(selectRow != null){
		Ext.fly(selectRow).setStyle('background-color','#f5f5f5');
	}
}
/**
 * 客户端(buttonfffd1)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function buttonfffd1_onClickClient (rc){
	var selVal = Artery.get('listArea0876b').getSelectedRowJson();
	var cell = Artery.get('listAreaa3e00').getCellByValue('columnStringCNAME',selVal['columnString2f259']);
	Ext.fly(cell).parent('tr').setStyle('background-color','transparent');
	Artery.get('listArea0876b').deleteRecord();	
}
/**
 * 客户端(colOperImg55ed7)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function colOperImg55ed7_onClickClient (rc){
	var selVal = Artery.get('listArea0876b').getSelectedRowJson();
	var cell = Artery.get('listAreaa3e00').getCellByValue('columnStringCNAME',selVal['columnString2f259']);
	Ext.fly(cell).parent('tr').setStyle('background-color','transparent');
	Artery.get('listArea0876b').deleteRecord();	
}
/**
 * 客户端(tbButtonc9a0e)
 * 
 * @param  rc 系统提供的AJAX调用对象
 */
function tbButtonc9a0e_onClickClient (rc){
	alert(Artery.get('listArea0876b').getValues('columnString2f259'))	
}