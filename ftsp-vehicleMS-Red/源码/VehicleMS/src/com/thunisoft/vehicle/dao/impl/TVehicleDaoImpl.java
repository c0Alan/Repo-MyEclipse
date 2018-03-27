package com.thunisoft.vehicle.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.vehicle.dao.ITVehicleDao;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.pojo.VehicleQO;

/**
 * ClassName: TVehicleDaoImpl 
 * @Description: 车辆信息的实现类
 * @author 蔡海滨
 * @date 2017-6-9
 */
@Repository("tVehicleDaoImpl")
public class TVehicleDaoImpl extends BaseDaoImpl<TVehicle> implements ITVehicleDao {

	/**
	 * 获取分页数据
	 * @param
	 * 		VehicleQO qo 查询对象（包括查询条件和分页对象）
	 */
	public IPagableData query(VehicleQO qo) {
		// TODO Auto-generated method stub
		List<Object> params = new ArrayList<Object>();
		
		StringBuilder hql = new StringBuilder("from TVehicle where 1=1 ");
		
		if (StringUtils.isNotEmpty(qo.getCarId())){
			hql.append(" and CId != ?");
			params.add(qo.getCarId());
		}
		if (StringUtils.isNotEmpty(qo.getCarNo())){
			hql.append(" and CCarNumber like ?");
			params.add("%"+qo.getCarNo().trim()+"%");
		}
		if (StringUtils.isNotEmpty(qo.getCarType())){
			hql.append(" and CCarType = ?");
			params.add(qo.getCarType().trim());
		}		
		
		return queryPage(hql.toString(), params, qo.getQueryInfo(), "dtUpdateTime", "DESC");
		
	}
	

	
}
