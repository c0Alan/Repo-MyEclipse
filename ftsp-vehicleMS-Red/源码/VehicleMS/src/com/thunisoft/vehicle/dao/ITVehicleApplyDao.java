package com.thunisoft.vehicle.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Date;
import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.pojo.BaseQO;
import com.thunisoft.vehicle.pojo.VehicleApplyQO;

/**
 * ClassName: ITVehicleApplyDao 
 * @Description: 用车申请接口类
 * @author 蔡海滨
 * @date 2017-6-9
 */
public interface ITVehicleApplyDao extends BaseDao<TVehicleApply, Serializable> {

	/**
	 * 获取分页数据
	 * @param
	 * 		VehicleApplyQO qo 查询对象（包括查询条件和分页对象）
	 */
	IPagableData queryPage(VehicleApplyQO qo);
	
	Map  getCarNoByCarType(int carType);
	
	TVehicle getByCarNo(String carNo);
	
	
	/**
	 * 获取车辆在指定时间段内的申请情况
	 * @param
	 * 		String vid 车辆id
	 * 		Date start 开始时间
	 * 		Date end 结束时间
	 */
	List<TVehicleApply> queryApplyListByTime(String vid, Date start, Date end);

}
