package com.thunisoft.vehicle.logic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.support.LogicClass;
import com.thunisoft.artery.util.ParamUtil;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.service.ITVehicleApplyService;
import com.thunisoft.vehicle.util.BeanUtils;

/**
 * applyfail 服务器端逻辑类
 * 
 * @author huayu
 * @date 2017-06-07
 * @id 81dde32f9da7f8a68d4936000bdaea03
 */
public class Applyfail extends LogicClass {

	/**
	 * 数据源查询方法
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Object 当为分页查询时，需要返回IPagableData对象，否则可为任意pojo
	 */
	public Object applyfailList(IQueryInfo qp) {
			String cid = ParamUtil.getString("cid");
			String st = ParamUtil.getString("st");
			String et = ParamUtil.getString("et");
			
			
			ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
			/*List<Map<String,String>> list =new ArrayList<Map<String,String>>();
			for(int i=1;i<10;i++){
				Map<String,String> map =new HashMap<String,String>();
				map.put("ycr", cid);
				map.put("kssj", "2017-05-01 20:12:42");
				map.put("jssj", "2017-05-02 20:12:42");
				list.add(map);
			}*/
			
		return vehicleApplyService.queryApplyListByTime(cid, st, et);
	}

}