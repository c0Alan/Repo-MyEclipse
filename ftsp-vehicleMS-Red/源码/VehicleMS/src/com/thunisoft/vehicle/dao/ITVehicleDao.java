package com.thunisoft.vehicle.dao;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.pojo.VehicleQO;

/**
 * ClassName: ITVehicleDao 
 * @Description: 用车申请接口类
 * @author 蔡海滨
 * @date 2017-6-9
 */
public interface ITVehicleDao extends BaseDao<TVehicle, Serializable>{
	
	/**
	 * 获取分页数据
	 * @param
	 * 		VehicleQO qo 查询对象（包括查询条件和分页对象）
	 */
	IPagableData query(VehicleQO qo); 
	
}
