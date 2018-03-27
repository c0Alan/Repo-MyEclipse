<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<%@ include file="/artery/pub/jsp/jshead.jsp"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Filter Grid</title>
		<style>
			body {
			  font-size: 12px;
			  font-family: Arial, Helvetica, sans-serif
			}
		</style>
<link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/parse/js/plugin/Select.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/parse/css/form-parse.css'/>" />

<script src="<c:url value='/artery/pub/js/parse/Artery.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/plugin/Select.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/plugin/GridDragSelector.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/plugin/GridFilterPlugin.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/parse-pub.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/parse-form.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/parse-date.js'/>"></script>
<script src="<c:url value='/artery/form/parse/js/parse-organ.js'/>"></script>
		<script>
			Ext.onReady(function() {
				Ext.QuickTips.init();
				Ext.apply(Ext.QuickTips.getQuickTip(), {
					showDelay : 0,
					hideDelay : 0
				});
				new Ext.Viewport({
					layout : 'fit',
					border : false,
					hideBorders : true,
			
					items : [{
						autoScroll:true,
						
						items:[
							importCmp,
							dateCmp,
							selectCmp,
							sorganCmp,
							morganCmp,
							sclasscodeCmp,
							mclasscodeCmp
						]
					}]
				});
			
			});
			
			//导入说明
			var importCmp = {
				width:700,
				layout:'form',
				border:false,
				style:'margin-bottom:10px;border:1px solid #99BBE8;border-bottom:0px;',
				
				items:[{
					title:'导入文件说明',
					border:false,
					collapsible :true,
					collapsed :true,
					style:'background-color:#DFE8F6;',
					bodyStyle:'padding:5px;',
					contentEl :'importCmpInfo'
				}]
			}
						
			//日期选择控件
			var dateCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'日期选择控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6',
					bodyStyle:'padding:5px;',
					contentEl :'dateCmpInfo'
				},{
					"xtype" : "tuscdatefield",
					"id" : "date",
					"fieldLabel" : "日期选择",
					value:"2008-09-01 06:13:43",
					"showTime":true,
					"width": 250
				},{
					xtype:'button',
					text:'setValue("2007-03-15 12:03:23")',
					handler:function(){
						Ext.getCmp("date").setValue("2007-03-15 12:03:23");
					}
				}]
			}
			
			//代码选择控件
			var selectCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'代码拼音选择控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6;',
					bodyStyle:'padding:5px;',
					contentEl :'selectCmpInfo'
				},{
						"xtype" : "tuscselect",
						"id" : "testCode",
						"fieldLabel" : "代码多选",
						"value" : "2,3",
						"codeType" : "2",
						"width": 250,
						"hiddenName" : "codeMulti",
						"multiSelect" : true
					},{
						xtype:'button',
						text:'setValue("1,4,5")',
						handler:function(){
							Ext.getCmp("testCode").setValue("1,4,5");
						}
					}]
			}
			
			//组织机构单选控件
			var sorganCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'组织机构单选控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6',
					bodyStyle:'padding:5px;',
					contentEl :'sorganCmpInfo'
				},{
					"xtype" : "tuscsorgantree",
					"id" : "leader",
					"fieldLabel" : "单选人员",
					"value" : "7",
					"width": 250,
					"readOnly" : false,
					"enablePinyin" : true,
					"organType" : "user"
				},{
					xtype:'button',
					text:'setValue("6")',
					handler:function(){
						Ext.getCmp("leader").setValue("6");
					}
				}]
			}
			
			//组织机构多选控件
			var morganCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'组织机构多选控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6',
					bodyStyle:'padding:5px;',
					contentEl :'morganCmpInfo'
				},{
					"xtype" : "tuscmorgantree",
					"id" : "multiOrgan",
					"fieldLabel" : "多选人员",
					"value" : "5,7",
					"width": 250,
					"readOnly" : false,
					"enablePinyin" : true,
					"organType" : "user"
				},{
					xtype:'button',
					text:'setValue("6,8")',
					handler:function(){
						Ext.getCmp("multiOrgan").setValue("6,8");
					}
				}]
			}
			
			//分级代码单选控件
			var sclasscodeCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'分级代码单选控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6',
					bodyStyle:'padding:5px;',
					contentEl :'sclasscodeCmpInfo'
				},{
					"xtype" : "tuscsclasscodetree",
					"id" : "sclasscode",
					"fieldLabel" : "分级代码单选",
					"codeType" : "T_SYS_CC_AY",
					"value" : "95",
					"selType" : "1",
					"width": 250
				},{
					xtype:'button',
					text:'setValue("97")',
					handler:function(){
						Ext.getCmp("sclasscode").setValue("97");
					}
				}]
			}
			
			//分级代码多选控件
			var mclasscodeCmp = {
				width:500,
				layout:'form',
				bodyStyle:'padding-bottom:5px;',
				style:'padding-bottom:10px;',
				
				items:[{
					title:'分级代码多选控件',
					collapsible :true,
					collapsed :true,
					border:false,
					style:'margin-bottom:5px;background-color:#DFE8F6',
					bodyStyle:'padding:5px;',
					contentEl :'mclasscodeCmpInfo'
				},{
					"xtype" : "tuscmclasscodetree",
					"id" : "mclasscode",
					"fieldLabel" : "分级代码多选",
					"codeType" : "T_SYS_CC_AY",
					"value" : "95",
					"selType" : "1",
					"width": 250
				},{
					xtype:'button',
					text:'setValue("97,99")',
					handler:function(){
						Ext.getCmp("mclasscode").setValue("97,99");
					}
				}]
			}

		</script>

	</head>
<body style="margin:10px">
<div id="importCmpInfo">
<pre>
&lt;link rel="stylesheet" type="text/css" href="&lt;c:url value='/artery/form/parse/js/plugin/Select.css'/&gt;" /&gt;
&lt;link rel="stylesheet" type="text/css" href="&lt;c:url value='/artery/form/parse/css/form-parse.css'/&gt;" /&gt;

&lt;script src="&lt;c:url value='/artery/pub/js/parse/Artery.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/plugin/Select.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/plugin/GridDragSelector.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/plugin/GridFilterPlugin.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/parse-pub.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/parse-form.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/parse-date.js'/&gt;"&gt;&lt;/script&gt;
&lt;script src="&lt;c:url value='/artery/form/parse/js/parse-organ.js'/&gt;"&gt;&lt;/script&gt;
</pre>
</div>

<div id="dateCmpInfo">
<pre>
new Ext.tusc.DateField({
  "id" : "date",
  "fieldLabel" : "日期选择",
  "value":"2008-09-01 06:13:43",
  "showTime":true,
  "width": 250
})
其xtype类型为：tuscdatefield
</pre>
</div>

<div id="selectCmpInfo">
<pre>
new Ext.tusc.Select({
  "id" : "testCode",
  "fieldLabel" : "代码多选",
  "value" : "1", //代码值
  "codeType" : "2", //代码类型
  "width": 250,
  "hiddenName" : "codeMulti",
  "multiSelect" : true //多选
})
其xtype类型为：tuscselect
</pre>
</div>

<div id="sorganCmpInfo">
<pre>
new Ext.tusc.SOrganTree({
  "id" : "leader",
  "fieldLabel" : "单选人员",
  "value" : "7",
  "width": 250,
  "readOnly" : false,
  "enablePinyin" : true,
  "organType" : "user"
})
其xtype类型为：tuscsorgantree
organType为类型定义，其值可为user,dept,corp
</pre>
</div>

<div id="morganCmpInfo">
<pre>
new Ext.tusc.MOrganTree({
  "id" : "multiOrgan",
  "fieldLabel" : "多选人员",
  "value" : "5,7",
  "width": 250,
  "readOnly" : false,
  "enablePinyin" : true,
  "organType" : "user"
})
其xtype类型为：tuscmorgantree
organType为类型定义，其值可为user,dept,corp
</pre>
</div>

<div id="sclasscodeCmpInfo">
<pre>
new Ext.tusc.SClassCodeTree({
  "id" : "sclasscode",
  "fieldLabel" : "分级代码单选",
  "codeType" : "T_SYS_CC_AY",
  "value" : "95",
  "selType" : "1",
  "width": 250
})
其xtype类型为：tuscsclasscodetree
selType为选择类型定义， 1：选择子节点 2:选择全部
</pre>
</div>

<div id="mclasscodeCmpInfo">
<pre>
new Ext.tusc.MClassCodeTree({
  "id" : "mclasscode",
  "fieldLabel" : "分级代码多选",
  "codeType" : "T_SYS_CC_AY",
  "value" : "95",
  "selType" : "1",
  "width": 250
})
其xtype类型为：tuscmclasscodetree
selType为选择类型定义， 1：选择子节点 2:选择全部
</pre>
</div>

</body>
</html>
