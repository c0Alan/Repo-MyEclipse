
//列表主键数据
var keys = {
	keys:{
		rownumber1:{name:value},
		rownumber2:{name:value}
	}
}

//列表保存时传输的数据
var transData = {
	"update":{
		rows:{
			rownumber1:{
				keys:{name:value},
				values:{name2:value1,name2:value2}
			},
			rownumber2:{
				keys:{name:value},
				values:{name2:value1,name2:value2}
			}
		}
	},
	
	"insert":{
		rows:{
			rownumber1:{
				values:{name2:value1,name2:value2}
			},
			rownumber2:{
				values:{name2:value1,name2:value2}
			}
		}
	},
	
	"delete":{
		rows:{
			rownumber1:{
				keys:{name:value}
			},
			rownumber2:{
				keys:{name:value}
			}
		}
	}
}

//列表行点击数据
var rowclick = {
	rownumber1:{
		rowdbclick:value1,
		rowdblinkto:value2,
		rowclick:value3,
		rowlinkto:value4
	},
	rownumber2:{
		rowdbclick:value1,
		rowdblinkto:value2,
		rowclick:value3,
		rowlinkto:value4
	}
}
