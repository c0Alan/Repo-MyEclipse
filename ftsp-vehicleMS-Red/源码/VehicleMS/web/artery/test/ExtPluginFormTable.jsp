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
		<script type="text/javascript" language='javascript'
			src="<c:url value='/artery/pub/js/ext-plugin.js'/>"></script>
		<script>
Ext.onReady(function() {
	
	initForm1();
	initForm2();
	initForm3();

});

var store = new Ext.data.Store({
    // load using script tags for cross domain, if the data in on the same domain as
    // this page, an HttpProxy would be better
    proxy: new Ext.data.ScriptTagProxy({
        url: 'http://extjs.com/forum/topics-browse-remote.php'
    }),

    // create reader that reads the Topic records
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'threadid',
        fields: [
            'title', 'forumtitle', 'forumid', 'author',
            {name: 'replycount', type: 'int'},
            {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
            'lastposter', 'excerpt'
        ]
    }),

    // turn on remote sorting
    remoteSort: true
});

function initForm1(){

	/*
	 * ================ Form Table =======================
	 */
	var formTable = new Ext.FormPanel({
		labelAlign : 'left',
		labelWidth:70,
		frame : true,
		title : 'Form Table Layout Auto Width (label left)',
		//width : 700,
		renderTo : document.body,
		items : [{
			layout : 'tusctable',
			layoutConfig : {
				columns : 3
			},
			items : [{
				layout : 'form',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'First Name',
					name : 'first',
					anchor:'100%'
				}]

			}, {
				layout : 'form',
				items : [{
					xtype:'combo',
			        store: store,
			        fieldLabel : 'Company',
			        displayField:'title',
			        valueField:'title',
			        typeAhead: true,
			        mode: 'remort',
			        triggerAction: 'all',
			        emptyText:'Select a state...',
			        selectOnFocus:true,
			        value:'boluo',
			        valueNotFoundText:'ddddd'
			    }]
			}, {
				layout : 'form',
				rowspan:2,
				items : [{
					xtype : 'textarea',
					fieldLabel : 'Last Name',
					name : 'last',
					anchor:'100%'
				}]
			}, {
				layout : 'form',
				colspan : 2,
				items : [{
					xtype : 'textfield',
					fieldLabel : 'Email',
					name : 'email',
					vtype : 'email',
					anchor:'100%'
				}]
			}]
		}],

		buttons : [{
			text : 'Save'
		}, {
			text : 'Cancel'
		}]
	});
	window.onresize = function(){
		formTable.resizeFields();
	}	
}

function initForm2(){
	var formTable = new Ext.FormPanel({
		labelAlign : 'top',
		labelWidth:70,
		frame : true,
		title : 'Form Table Layout Fix Width (label top)',
		//width : 700,
		renderTo : document.body,
		style:'margin-top:10px;',
		items : [{
			layout : 'tusctable',
			layoutConfig : {
				columns : 3
			},
			items : [{
				layout : 'form',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'First Name',
					name : 'first',
					width:200
				}]

			}, {
				layout : 'form',
				items : [{
					xtype:'combo',
			        store: store,
			        fieldLabel : 'Company',
			        displayField:'title',
			        valueField:'title',
			        typeAhead: true,
			        mode: 'remort',
			        triggerAction: 'all',
			        emptyText:'Select a state...',
			        selectOnFocus:true,
			        value:'boluo',
			        valueNotFoundText:'ddddd',
			        width:200
			    }]
			}, {
				layout : 'form',
				rowspan:2,
				items : [{
					xtype : 'textarea',
					fieldLabel : 'Last Name',
					name : 'last',
					anchor:'none 100%',
					width:200
				}]
			}, {
				layout : 'form',
				colspan : 2,
				items : [{
					xtype : 'textfield',
					fieldLabel : 'Email',
					name : 'email',
					vtype : 'email',
					width:450
				}]
			}]
		}],

		buttons : [{
			text : 'Save'
		}, {
			text : 'Cancel'
		}]
	});
}

function initForm3(){
	var formTable = new Ext.FormPanel({
		labelAlign : 'right',
		labelWidth:70,
		frame : true,
		title : 'Form Table Layout Fix Table (label right)',
		width : 700,
		renderTo : document.body,
		style:'margin-top:10px;',
		items : [{
			layout : 'tusctable',
			layoutConfig : {
				columns : 3
			},
			items : [{
				layout : 'form',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'First Name',
					name : 'first',
					anchor:'100%'
				}]

			}, {
				layout : 'form',
				items : [{
					xtype:'combo',
			        store: store,
			        fieldLabel : 'Company',
			        displayField:'title',
			        valueField:'title',
			        typeAhead: true,
			        mode: 'remort',
			        triggerAction: 'all',
			        emptyText:'Select a state...',
			        selectOnFocus:true,
			        value:'boluo',
			        valueNotFoundText:'ddddd'
			    }]
			}, {
				layout : 'form',
				rowspan:2,
				items : [{
					xtype : 'textarea',
					fieldLabel : 'Last Name',
					name : 'last',
					anchor:'100%'
				}]
			}, {
				layout : 'form',
				colspan : 2,
				items : [{
					xtype : 'textfield',
					fieldLabel : 'Email',
					name : 'email',
					vtype : 'email',
					anchor:'100%'
				}]
			}]
		}],

		buttons : [{
			text : 'Save'
		}, {
			text : 'Cancel'
		}]
	});
}
    
		</script>

	</head>
	<body style="margin:10px">
	<br>
		<br>
		<h2 style="font-size:30px;">
			FormTableLayout
		</h2>
		<br>
	</body>
</html>
