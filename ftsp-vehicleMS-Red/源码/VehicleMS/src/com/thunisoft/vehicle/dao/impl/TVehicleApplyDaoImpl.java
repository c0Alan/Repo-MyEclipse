package com.thunisoft.vehicle.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.util.DateUtils;
import com.thunisoft.vehicle.dao.ITVehicleApplyDao;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.pojo.VehicleApplyQO;

/**
 * ClassName: TVehicleApplyDaoImpl 
 * @Description: 用车申请的实现类
 * @author 蔡海滨
 * @date 2017-6-9
 */
@Repository("tVehicleApplyDaoImpl")
public class TVehicleApplyDaoImpl extends BaseDaoImpl<TVehicleApply> implements ITVehicleApplyDao {

	/**
	 * 获取分页数据
	 * @param
	 * 		VehicleApplyQO qo 查询对象（包括查询条件和分页对象）
	 */
	public IPagableData queryPage(VehicleApplyQO qo) {
		List<Object> params = new ArrayList<Object>();
		StringBuilder hql = new StringBuilder("from TVehicleApply a, TVehicle b where a.CVehicleId = b.CId ");
		if (StringUtils.isNotEmpty(qo.getCarNo())){
			hql.append(" and b.CCarNumber like ?");
			params.add("%"+qo.getCarNo().trim()+"%");
		}		

		if (StringUtils.isNotEmpty(qo.getStart())){
			Date dt = DateUtils.parseDateTime(qo.getStart());
			hql.append(" and a.dtEndTime > ?");
			params.add(dt);
		}
		
		if (StringUtils.isNotEmpty(qo.getEnd())){
			Date dt = DateUtils.parseDateTime(qo.getEnd());
			hql.append(" and a.dtStartTime < ?");
			params.add(dt);
		}
		IPagableData data = queryPage(hql.toString(), params, qo.getQueryInfo(), "a.dtCreateTime", "DESC");
		return data;

	}

	
	public Map getCarNoByCarType(int carType){
		StringBuilder hql = new StringBuilder(" from TVehicle where CCarType = ? ");
		List<TVehicle> list = getHibernateTemplate().find(hql.toString(), new Object[]{String.valueOf(carType)});	
		Map< String,String> map = new HashMap();
		for(TVehicle t :list){
			map.put(t.getCId(), t.getCCarNumber());
		}
		return map;
	}
	
	public TVehicle getByCarNo(String carNo){
		StringBuilder hql = new StringBuilder(" from TVehicle where CCarNumber = ? ");
		List<TVehicle> list = getHibernateTemplate().find(hql.toString(), new Object[]{String.valueOf(carNo)});	
		return list.size()>0?list.get(0):null;
	}

	/**
	 * 获取车辆在指定时间段内的申请情况
	 * @param
	 * 		String vid 车辆id
	 * 		Date start 开始时间
	 * 		Date end 结束时间
	 */
	public List<TVehicleApply> queryApplyListByTime(String vid, Date start, Date end) {
		StringBuilder hql = new StringBuilder("from TVehicleApply where CVehicleId =? and dtStartTime < ? and dtEndTime > ?");
		return getHibernateTemplate().find(hql.toString(), new Object[]{vid, end,  start});		
		
	}
	
}
