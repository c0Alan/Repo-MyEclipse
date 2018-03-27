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
    Ext.onReady(function(){
		initFilterGrid();
    });
    
function initFilterGrid(){
	    var myData = [
	        ['3m Co',71.72,0.02,'Tee','9/1 12:00am'],
	        ['Alcoa Inc',29.01,0.42,'Embroidered','9/1 12:00am'],
	        ['Altria Group Inc',83.81,0.28,'Pajamas','9/1 12:00am'],
	        ['American Express Company',52.55,0.01,'Crosscourt','9/1 12:00am'],
	        ['American International Group, Inc.',64.13,0.31,'Embroidered','9/1 12:00am'],
	        ['AT&T Inc.',31.61,-0.48,'Sleepwear','9/1 12:00am'],
	        ['Boeing Co.',75.43,0.53,'Stamped','9/1 12:00am'],
	        ['Caterpillar Inc.',67.27,0.92,'Gurfield','9/1 12:00am'],
	        ['Citigroup, Inc.',49.37,0.02,'Pleated','9/1 12:00am'],
	        ['E.I. du Pont de Nemours and Company',40.48,0.51,'Shirt','9/1 12:00am'],
	        ['Exxon Mobil Corp',68.1,-0.43,'Short','9/1 12:00am'],
	        ['General Electric Company',34.14,-0.08,'Diamond','9/1 12:00am'],
	        ['General Motors Corporation',30.27,1.09,'Stamped','9/1 12:00am'],
	        ['Hewlett-Packard Co.',36.53,-0.03,'Jersey','9/1 12:00am'],
	        ['Honeywell Intl Inc',38.77,0.05,'Linen','9/1 12:00am'],
	        ['Intel Corporation',19.88,0.31,'Shirt','9/1 12:00am'],
	        ['International Business Machines',81.41,0.44,'Potpourri','9/1 12:00am'],
	        ['Johnson & Johnson',64.72,0.06,'Vunelli','9/1 12:00am'],
	        ['JP Morgan & Chase & Co',45.73,0.07,'Crosscourt','9/1 12:00am'],
	        ['McDonald\'s Corporation',36.76,0.86,'Linen','9/1 12:00am'],
	        ['Merck & Co., Inc.',40.96,0.41,'Printed','9/1 12:00am'],
	        ['Microsoft Corporation',25.84,0.14,'Short','9/1 12:00am'],
	        ['Pfizer Inc',27.96,0.4,'Diamond','9/1 12:00am'],
	        ['The Coca-Cola Company',45.07,0.26,'Skirt','9/1 12:00am'],
	        ['The Home Depot, Inc.',34.64,0.35,'Skirt','9/1 12:00am'],
	        ['The Procter & Gamble Company',61.91,0.01,'Tee','9/1 12:00am'],
	        ['United Technologies Corporation',63.26,0.55,'Tee','9/1 12:00am'],
	        ['Verizon Communications',35.57,0.39,'Shirt','9/1 12:00am'],
	        ['Wal-Mart Stores, Inc.',45.45,0.73,'Shirt','9/1 12:00am']
	    ];
	// example of custom renderer function
    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    // example of custom renderer function
    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }

	var store = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy(myData),
				
		reader: new Ext.data.ArrayReader({id: 0}, [
           {name: 'company'},
           {name: 'price', type: 'float'},
           {name: 'change', type: 'float'},
           {name: 'product'},
           {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}            
			                                   
        ])
	});
	store.on("load",function(store,records,options){
		if(options.params == null){
			return;
		}
		var filterParams = options.params["filter"]
		if(filterParams == ''){
			return;
		}
		
		var filterArray = filterParams.split(';');
		for(var i = 0; i < filterArray.length-1; i++){
			var filter = filterArray[i].split(':');
			doFilter(store,filter);
		}
		
	});
	
	
	store.load();
	
    var grid = new Ext.grid.GridPanel({
        store: store,
        columns: [
            {id:'company',header: "Company", width: 160, sortable: true,filter:true, dataIndex: 'company'},
            {header: "Price", width: 75, sortable: true, renderer: 'usMoney',filter:true,  dataIndex: 'price'},
            {header: "Change", width: 75, sortable: true, renderer: change, dataIndex: 'change'},
            {header: "Product", width: 75, sortable: true, filter:true, dataIndex: 'product'},
            {header: "Last Updated", width: 85, sortable: true, renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'lastChange'}
        ],
        stripeRows: true,
        autoExpandColumn: 'company',
        height:350,
        width:600,
        title:'FilterGrid',
        plugins:new Ext.tusc.plugins.FilterGrid()
    });

    grid.render('filterGrid-example');
}

function deconvert(val){
	if(Ext.isEmpty(val)){
		return "";
	}
	
	return val.replace(/$sem/,";").replace(/$col/,":");
}

function doFilter(store,filter){
	var filterName = filter[0];
	var filterValue = deconvert(filter[1]);
	var records = store.getRange();
	for(var i = 0; i < records.length; i++){
		if(filterValue.charAt(0) == "="){
		
			var filterReg = new RegExp('^' + filterValue.substring(1),'i');
    		if(!filterReg.test(records[i].get(filterName))){
    			store.remove(records[i]);
    		}
		}else if(filterValue.charAt(0) == ">"){
			if(filterValue.length < 2){
				continue;
			}
			
			if(filterValue.charAt(1) == "="){
				if(filterValue.length = 2){
    				continue;
    			}
				if(parseInt(records[i].get(filterName)) < parseInt(filterValue.substring(2))){
					store.remove(records[i]);
				}
				
			}else{
				if(parseFloat(records[i].get(filterName)) <= parseFloat(filterValue.substring(1))){
					store.remove(records[i]);
				}
			}
		}else if(filterValue.charAt(0) == "<"){
			if(filterValue.length < 2){
				continue;
			}
			
			if(filterValue.charAt(1) == "="){
				if(filterValue.length = 2){
    				continue;
    			}
				if(parseInt(records[i].get(filterName)) > parseInt(filterValue.substring(2))){
					store.remove(records[i]);
				}
				
			}else{
				if(parseFloat(records[i].get(filterName)) >= parseFloat(filterValue.substring(1))){
					store.remove(records[i]);
				}
			}
			
		}else{
		
    		var filterReg = new RegExp(filterValue,'i');
    		if(!filterReg.test(records[i].get(filterName))){
    			store.remove(records[i]);
    		}
		}
		
	}
}
</script>

	</head>
	<body style="margin:10px">
		<br>
		<h2 style="font-size:30px;">
			FilterGrid控件
		</h2>
		<br>
		<div id="filterGrid-example"></div>
		<br>

		<div style="padding-left:5px;">
			<div style="background-color:#FAEBD7;padding:5px;">
				<h4 style="font-size:20px;">
					注意：
				</h4>
				<ul style="padding-left:10px;line-height:30px;">
					<li>
						适用范围：本插件适用于Ext2.0.2及2.1版本。
					<li>
						此插件屏蔽了列的拖动，如果需要此功能请不要使用本插件。
					<li>
						回车进行查询，点击清除图标则清除此过滤条件查询，点击ESC也可清除此过滤条件。
				</ul>
			</div>
			<br>
			<h4 style="font-size:20px;">
				使用说明：
			</h4>
			<ul style="padding-left:5px;line-height:30px;">
				<li>
					<b style="font-size:20px;">1.</b>本控件为grid插件，在写gridPanel时需指定此插件，如：
					<div style="border:1px solid gray;padding:5px;">
						var grid = new Ext.grid.GridPanel({
						<br>
						&nbsp;&nbsp;title:'FilterGrid',
						<br>
						&nbsp;&nbsp;store: store,
						<br>
						&nbsp;&nbsp;stripeRows: true,
						<br>
						&nbsp;&nbsp;
						<span style="color:red;">plugins:new
							Ext.tusc.plugins.FilterGrid()</span>
						<br>
						&nbsp;&nbsp;......
					</div>
					如果grid需要分页，则需指定每页个数，如：
					<br>
					<span style="color:red;">plugins:new
						Ext.tusc.plugins.FilterGrid({pageCount:25})</span>
				<li>
					<b style="font-size:20px;">2.</b>在ColumnModel定义时，在需要过滤的列上设置属性“filter：true”即可，默认不过滤，如：
					<div style="border:1px solid gray;padding:5px;">
						columns: [
						<br>
						&nbsp;&nbsp;{header: "Company", width: 160, sortable: true,
						<span style="color:red;">filter:true,</span> dataIndex:
						'company'},
						<br>
						&nbsp;&nbsp;{header: "Price", width: 75, sortable: true, renderer:
						'usMoney',
						<span style="color:red;">filter:true,</span> dataIndex: 'price'},
						<br>
						&nbsp;&nbsp;{header: "Change", width: 75, sortable: true,
						renderer: change, dataIndex: 'change'},
						<br>
						&nbsp;&nbsp;{header: "Product", width: 75, sortable: true,
						<span style="color:red;">filter:true,</span> dataIndex:
						'product'},
						<br>
						&nbsp;&nbsp;{header: "Last Updated", width: 85, sortable: true,
						dataIndex: 'lastChange'}
						<br>
						]
					</div>
				<li>
					<b style="font-size:20px;">3.</b>本控件会传递过滤参数filter，其值为过滤条件，多个过滤条件之间用“；”分隔，每个过滤条件的格式为“名称：值”，如下所示：
					<br>
					&nbsp;&nbsp;
					<b>company：aaa；price：34；</b><br> 
					<b>注意：</b>company代表了数据项的名称，此名称为store中的reader设置的数据项名称，不是此列的标题。<br>
					 在后台程序中可通过
					<b>request.getParameter("filter")</b>得到此参数.
					<br>
					<div style="background-color:#FAEBD7;padding:5px;">
						<b>注意：</b>由于本控件采用“：”，“；”分隔符，当过滤条件中出现此符号时系统会进行转义：
						<br>
						<b>":" </b>转义为$col（colon的缩写）
						<br>
						<b>";" </b>转义为$sem（semicolon的缩写）
					</div>
					在后台程序处理时请时行转换处理
				<li>
					<b style="font-size:20px;">4.</b>后台程序得到参数后，进行过滤处理，返回结果。由于过滤处理在程序中控制，这也使过滤增加了一定的灵活性，可以在过滤框中输入一些有代表性的字符：如：
					<br>
					<div style="border:1px solid gray;padding:5px;">
						<b>= :</b>&nbsp;&nbsp;首字匹配
						<br>
						<b>> :</b>&nbsp;&nbsp;大于过滤值
						<br>
						<b>>= :</b>&nbsp;&nbsp;大于等于过滤值
						<br>
						<b>< :</b>&nbsp;&nbsp;小于过滤值
						<br>
						<b><= :</b>&nbsp;&nbsp;小于等于过滤值
						<br>
					</div>
					当然，后四种只适用于数值列
			</ul>
		</div>
	</body>
</html>
