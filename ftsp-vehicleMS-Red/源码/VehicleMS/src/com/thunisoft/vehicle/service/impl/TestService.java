package com.thunisoft.vehicle.service.impl;

import java.util.Collection;
import java.util.List;

import com.thunisoft.artery.module.normalcode.util.ArteryNormalCodeUtil;
import com.thunisoft.artery.module.normalcode.util.CodeUtil;
import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.pojo.VehicleApplyQO;
import com.thunisoft.vehicle.pojo.VehicleQO;
import com.thunisoft.vehicle.service.ITVehicleApplyService;
import com.thunisoft.vehicle.service.ITVehicleService;
import com.thunisoft.vehicle.util.BeanUtils;

public class TestService {

	public static void main(String[] args) {
		
//		VehicleApplyQO qo2 = new VehicleApplyQO();
//		qo2.setQueryInfo(null);
//		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
		
//		TVehicleApply apply = new TVehicleApply();
//		apply.setCVehicleId("yyy");
//		apply.setCApplyUserName("xxx");
//		vehicleApplyService.add(apply);
		
//		Collection collection = vehicleApplyService.queryPage(qo2).getData();
//		
//		System.out.println(collection.size());
		
//		
//		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
//		
//		VehicleQO qo=new VehicleQO();
//		qo.setQueryInfo(null);
//		qo.setCarNo("TEST");
//		
//		System.out.println(vehicleService.queryPage(qo).getData().size());
		
		
		
//		
		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
//		
//		VehicleApplyQO qo = new VehicleApplyQO();
//		qo.setQueryInfo(null);
//		qo.setStart("2017-06-08 00:00:00");
//		System.out.println(vehicleApplyService.queryPage(qo).getData().size());
		
		vehicleApplyService.delete("002A3D6ECB295CA0D502FD0B3B7ACF21");
		
//		qo.setQueryInfo(null);
//		
//		IPagableData data = vehicleApplyService.queryPage(qo);
//		
//		System.out.println(vehicleApplyService.queryPage(qo));
//		
//		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
//		System.out.println(vehicleApplyService.queryApplyListByTime("001646438815C6FB33A337DA6xx8A13AF", "2017-06-08 09:00:00", "2017-06-08 11:00:00").size());
		
		
	}
	
}
