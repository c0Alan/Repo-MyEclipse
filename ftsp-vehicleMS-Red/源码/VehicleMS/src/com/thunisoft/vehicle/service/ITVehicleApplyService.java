package com.thunisoft.vehicle.service;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.hibernate.TVehicleApply;

public interface ITVehicleApplyService  extends IBaseService<TVehicleApply, Serializable>{

	/**
	 * 根据车辆类型查询车牌号
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Map
	 */
	public Map getCarNoListByCarType(int carType);
	/**
	 * 根据车牌号返回车品牌，车座数
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Map
	 */
	public 	TVehicle getCarByCarNo(String carNo);	
	
	/**
	 * 检索车辆在指定时间段内的申请情况
	 * @param
	 * 		String vid 车辆id
	 * 		String start 开始时间
	 * 		String end 结束时间
	 */
	List<TVehicleApply> queryApplyListByTime(String vid, String start, String end);


	/**
	 * 删除
	 * @param
	 * 		String id 申请id
	 */
	void delete(String id);
	
}
