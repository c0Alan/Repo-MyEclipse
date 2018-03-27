package com.thunisoft.vehicle.logic;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.thunisoft.artery.module.normalcode.util.ArteryNormalCodeUtil;
import com.thunisoft.artery.module.organ.util.ArteryOrganUtil;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.support.LogicClass;
import com.thunisoft.artery.plugin.base.Item;
import com.thunisoft.artery.util.ParamUtil;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.pojo.Result;
import com.thunisoft.vehicle.pojo.VehicleQO;
import com.thunisoft.vehicle.service.ITVehicleService;
import com.thunisoft.vehicle.util.BeanUtils;

/**
 * 车辆编辑页逻辑类
 * 
 * @author KB
 *
 */
public class VehicleEditLogic extends LogicClass {

	private static Logger logger = Logger.getLogger(VehicleEditLogic.class);

	/**
	 * 保存（新增及更新）
	 * 
	 * @param item
	 * @return
	 */
	public Object save(Item item) {
		try {
			String cId = ParamUtil.getString("C_CAR_ID");
			String cCarNumber = ParamUtil.getString("C_CAR_NUMBER");
			String cCarType = ParamUtil.getString("C_CAR_TYPE");
			String cCarTypeName = ArteryNormalCodeUtil.getSubCodeName("-700", cCarType);
			if (isVehicleExist(cId, cCarNumber)) {
				return Result.fail("该车辆已存在！");
			}			
			if (StringUtils.isBlank(cId)) {
				cId = null;
				// 车辆是否已添加校验
				
				// 车类型是否已到达指定数目校验
				if (isTypeEnough(cCarType)) {
					return Result.fail(cCarTypeName + "最多只能添加5辆！");
				}
			}
			
			Integer nSeat = ParamUtil.getInteger("N_SEAT");
			String cBrand = ParamUtil.getString("C_BRAND");
			String cResponseUserId = ParamUtil.getString("C_RESPONSE_USER_ID");
			String cResponseUserName = ArteryOrganUtil.getUserNameById(cResponseUserId);
			String cNote = ParamUtil.getString("C_NOTE");
			Date dtUpdateTime = new Date();
			Integer nIsAvailable = ParamUtil.getInteger("N_ISAVAILABLE");
			TVehicle tv = new TVehicle(cCarNumber, cCarType, cCarTypeName, nSeat, cBrand, cResponseUserId,
					cResponseUserName, cNote, dtUpdateTime, nIsAvailable);
			tv.setCId(cId);

			// 更新到数据库
			ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
			vehicleService.saveOrUpdate(tv);
		} catch (Exception ex) {
			logger.error("保存车辆信息发生异常！", ex);
			return Result.fail("未知异常！");
		}
		return Result.success();
	}

	/**
	 * 根据id获取车辆信息的对象
	 * 
	 * @param qp
	 * @return
	 */
	public Object getCar(IQueryInfo qp) {
		String cId = ParamUtil.getString("cid");
		if (StringUtils.isBlank(cId)) {
			return null;
		}
		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
		TVehicle tv = vehicleService.getById(cId);
		return tv;
	}

	

	/**
	 * 是否已存在该车辆
	 * 
	 * @param cCarNumber
	 * @return
	 */
	private boolean isVehicleExist(String cid, String cCarNumber) {
		VehicleQO qo = new VehicleQO();
		qo.setCarNo(cCarNumber);
		qo.setCarId(cid);
		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
		int size = vehicleService.queryPage(qo).getData().size();
		return size > 0 ? true : false;
	}

	/**
	 * 该类型车辆是否已多于5辆
	 * 
	 * @param carType
	 * @return
	 */
	private boolean isTypeEnough(String carType) {
		VehicleQO qo = new VehicleQO();
		qo.setCarType(carType);
		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
		int size = vehicleService.queryPage(qo).getData().size();
		return size >= 5 ? true : false;
	}	

}