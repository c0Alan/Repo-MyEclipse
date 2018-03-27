package com.thunisoft.vehicle.service.impl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.util.DateUtils;
import com.thunisoft.vehicle.dao.ITVehicleApplyDao;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.pojo.BaseQO;
import com.thunisoft.vehicle.pojo.VehicleApplyQO;
import com.thunisoft.vehicle.service.ITVehicleApplyService;

/**
 * ClassName: TVehicleApplyServiceImpl 
 * @Description: 查询对象基类
 * @author 蔡海滨
 * @date 2017-6-9
 */

@Service("tVehicleApplyServiceImpl")
public class TVehicleApplyServiceImpl implements ITVehicleApplyService {

	@Autowired
	ITVehicleApplyDao vehicleApplyDao;

	/**
	 * 获取分页数据
	 * @param
	 * 		BaseQO baseQO 查询对象（包括查询条件和分页对象）
	 * @return
	 * 		IPagableData 返回分页数据
	 */
	public IPagableData queryPage(BaseQO baseQO) {
		
		VehicleApplyQO qo = (VehicleApplyQO)baseQO;
		
		return vehicleApplyDao.queryPage(qo);
	}

	/**
	 * 新增数据
	 * @param
	 * 		TVehicleApply t 用车申请数据
	 */
	public void add(TVehicleApply t) {
		// TODO Auto-generated method stub
		vehicleApplyDao.save(t);
	}

	/**
	 * 根据id获取用车申请的对象
	 * @param
	 * 		Serializable id 主键id
	 */
	public TVehicleApply getById(Serializable id) {
		// TODO Auto-generated method stub
		return vehicleApplyDao.get(id);
	}




	public Map getCarNoListByCarType(int carType) {
		// TODO Auto-generated method stub
		return vehicleApplyDao.getCarNoByCarType(carType);
	}



	public TVehicle getCarByCarNo(String carNo) {
		// TODO Auto-generated method stub
		return vehicleApplyDao.getByCarNo(carNo);
	}

	/**
	 * 新增或者更新对象
	 * @param
	 * 		TVehicleApply t 用车申请对象
	 */
	public void saveOrUpdate(TVehicleApply t) {
		// TODO Auto-generated method stub
		if (StringUtils.isEmpty(t.getCId())){
			vehicleApplyDao.save(t);
		}else{
			vehicleApplyDao.update(t);
		}		
	}

	/**
	 * 更新对象
	 * @param
	 * 		TVehicleApply t 用车申请对象
	 */
	public void update(TVehicleApply t) {
		// TODO Auto-generated method stub
		vehicleApplyDao.update(t);
	}


	/**
	 * 检索车辆在指定时间段内的申请情况
	 * @param
	 * 		TVehicleApply t 用车申请对象
	 */
	public List<TVehicleApply> queryApplyListByTime(String CVehicleId, String start, String end) {
		if (StringUtils.isEmpty(start) || StringUtils.isEmpty(end)) {
			return new ArrayList<TVehicleApply>();
		}
		
		Date dtStart = DateUtils.parseDateTime(start);
		Date dtEnd = DateUtils.parseDateTime(end);
		
		return vehicleApplyDao.queryApplyListByTime(CVehicleId, dtStart, dtEnd);

	}


	/**
	 * 删除数据
	 * @param
	 * 		String id 主键id
	 */

	public void delete(String id) {
		vehicleApplyDao.delete(id);
		// TODO Auto-generated method stub
		
	}

}
