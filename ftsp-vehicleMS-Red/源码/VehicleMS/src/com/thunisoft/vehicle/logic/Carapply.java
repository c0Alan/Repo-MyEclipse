package com.thunisoft.vehicle.logic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.support.LogicClass;
import com.thunisoft.artery.plugin.base.Item;
import com.thunisoft.artery.util.ParamUtil;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.pojo.VehicleApplyQO;
import com.thunisoft.vehicle.pojo.VehicleQO;
import com.thunisoft.vehicle.service.ITVehicleApplyService;
import com.thunisoft.vehicle.service.ITVehicleService;
import com.thunisoft.vehicle.util.BeanUtils;

/**
 * carapply 服务器端逻辑类
 * 
 * @author huayu
 * @date 2017-06-07
 * @id 5e8c627d5f049ad158a4de088f48a061
 */
public class Carapply extends LogicClass {

	/**
	 * 申请页面查询事件
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Object 当为分页查询时，需要返回IPagableData对象，否则可为任意pojo
	 */
	public Object getCarList(IQueryInfo qp) {
		String cVehicleId = ParamUtil.getString("cph");
		String  end = ParamUtil.getString("jssj");
		String  start= ParamUtil.getString("kssj");
		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
		VehicleApplyQO qo= new VehicleApplyQO();
		qo.setQueryInfo(qp);
		if(cVehicleId!=null){
			qo.setCarNo(cVehicleId);
		}
		if(start != null){
			qo.setStart(start);
		}
		if(end !=null){
			qo.setEnd(end);
		}
		 IPagableData pd = vehicleApplyService.queryPage(qo);
		 return pd;
	}

	
	
	/**
	 * 点击时脚本删除用车信息
	 * 
	 * @param item
	 *            控件对象
	 */
	public Object button482be_onClickServer(Item item) {
		return true;
	}



	
	
	/**
	 * 点击时脚本删除用车信息
	 * 
	 * @param item
	 *            控件对象
	 */
	public Object colOperTexte7e7b_onClickServer(Item item) {
		
		String cid = ParamUtil.getString("cid");
		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
		vehicleApplyService.delete(cid);
		return true;
	}
	
			
	
			

	
	
			

		

}