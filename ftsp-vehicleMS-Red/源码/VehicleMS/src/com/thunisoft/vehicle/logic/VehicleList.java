package com.thunisoft.vehicle.logic;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.support.LogicClass;
import com.thunisoft.artery.plugin.base.Item;
import com.thunisoft.artery.util.ParamUtil;
import com.thunisoft.vehicle.pojo.VehicleQO;
import com.thunisoft.vehicle.service.ITVehicleService;
import com.thunisoft.vehicle.util.BeanUtils;

/**
 * 车辆信息管理 服务器端逻辑类
 * 
 * @author liuwang
 * @date 2017-06-07
 * @id a9e1f91b625280460f42c22db5e3398c
 */
public class VehicleList extends LogicClass {

	/**
	 * 数据源查询方法
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Object 当为分页查询时，需要返回IPagableData对象，否则可为任意pojo
	 */
	public Object Vehiclelist(IQueryInfo qp) {
		String cCarNumber=ParamUtil.getString("cCarNumber");
		String cCarType = ParamUtil.getString("cCarType");
		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
		VehicleQO qo= new VehicleQO();
		qo.setQueryInfo(qp);
		qo.setCarNo(cCarNumber);
		qo.setCarType(cCarType);
		return vehicleService.queryPage(qo);
	}
}