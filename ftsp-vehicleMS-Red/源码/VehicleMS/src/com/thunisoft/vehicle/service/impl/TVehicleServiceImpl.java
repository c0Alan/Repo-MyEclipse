package com.thunisoft.vehicle.service.impl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import sun.swing.StringUIClientPropertyKey;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.vehicle.dao.ITVehicleDao;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.pojo.BaseQO;
import com.thunisoft.vehicle.pojo.VehicleQO;
import com.thunisoft.vehicle.service.ITVehicleService;

@Service("tVehicleServiceImpl")
public class TVehicleServiceImpl implements ITVehicleService{

	@Autowired
	ITVehicleDao vehicleDao;
	
	/**
	 * 获取分页数据
	 * @param
	 * 		BaseQO baseQO 查询对象（包括查询条件和分页对象）
	 * @return
	 * 		IPagableData 返回分页数据
	 */
	public IPagableData queryPage(BaseQO baseQO) {
		
		VehicleQO qo = (VehicleQO)baseQO;	
		return vehicleDao.query(qo);
		
	}

	/**
	 * 新增数据
	 * @param
	 * 		TVehicle t 车辆数据
	 */
	public void add(TVehicle t) {
		// TODO Auto-generated method stub
		vehicleDao.save(t);
		
	}
	
	/**
	 * 根据id获取车辆对象
	 * @param
	 * 		Serializable id 主键id
	 */
	public TVehicle getById(Serializable id) {
		// TODO Auto-generated method stub
		return vehicleDao.get(id);
	}

	/**
	 * 新增或者更新对象
	 * @param
	 * 		TVehicle t 车辆对象
	 */
	public void saveOrUpdate(TVehicle t) {
		// TODO Auto-generated method stub
		if (StringUtils.isEmpty(t.getCId())){
			vehicleDao.save(t);			
		}else{
			vehicleDao.update(t);
		}
	}

	/**
	 * 更新对象
	 * @param
	 * 		TVehicle t 车辆对象
	 */
	public void update(TVehicle t) {
		// TODO Auto-generated method stub
		vehicleDao.update(t);
	}
	
	

}
