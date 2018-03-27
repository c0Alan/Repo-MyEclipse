package com.thunisoft.vehicle.logic;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.time.DateUtils;

import com.thunisoft.artery.module.organ.util.ArteryOrganUtil;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.support.LogicClass;
import com.thunisoft.artery.plugin.base.Item;
import com.thunisoft.artery.util.ArteryUtil;
import com.thunisoft.artery.util.ParamUtil;
import com.thunisoft.vehicle.dao.impl.TVehicleApplyDaoImpl;
import com.thunisoft.vehicle.hibernate.TVehicle;
import com.thunisoft.vehicle.hibernate.TVehicleApply;
import com.thunisoft.vehicle.service.ITVehicleApplyService;
import com.thunisoft.vehicle.service.ITVehicleService;
import com.thunisoft.vehicle.util.BeanUtils;

/**
 * carapplyform 服务器端逻辑类
 * 
 * @author huayu
 * @date 2017-06-07
 * @id c4f873564fd6d82c0615591e0517860c
 */
public class Carapplyform extends LogicClass {

	
	


	/**
	 * 数据源查询方法
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Object 当为分页查询时，需要返回IPagableData对象，否则可为任意pojo
	 */
	public Object ds_rs1(IQueryInfo qp) {
	
		return null;
	}

	
	/**
	 * 申请表单提交后台函数
	 * 
	 * @param item
	 *            控件对象
	 */
	public Object buttonfde75_onClickServer(Item item) {
		
		String cllx = ParamUtil.getString("cllx");
		String clid = ParamUtil.getString("cl");
		String pp = ParamUtil.getString("pp");
		String czs = ParamUtil.getString("czs");
		String sqrid = ParamUtil.getString("sqr");
		String sqr = ArteryOrganUtil.getUserNameById(sqrid);
		String kssj = ParamUtil.getString("kssj");
		String jssj = ParamUtil.getString("jssj");
		String mmd = ParamUtil.getString("mmd");
		String sy = ParamUtil.getString("sy");
		String bz = ParamUtil.getString("bz");
		String vid = "001646438815C6FB33A337DA6D8A13AF";
		Date stdate=null;
		Date enddate=null;
		try {
			stdate = DateUtils.parseDate(kssj,new String[]{"yyyy-MM-dd HH:mm:ss"});
			enddate = DateUtils.parseDate(jssj,new String[]{"yyyy-MM-dd HH:mm:ss"});
		} catch (ParseException e) {
			return false;
		}
		
		
		ITVehicleService vehicleService = (ITVehicleService) BeanUtils.getService(ITVehicleService.class);
		TVehicle v = vehicleService.getById(vid);
		
		ITVehicleApplyService vehicleApplyService = (ITVehicleApplyService) BeanUtils.getService(ITVehicleApplyService.class);
		
		List list = vehicleApplyService.queryApplyListByTime(clid, kssj, jssj);
		
		if(list !=null && list.size() >0){
			return false;
		}
		TVehicleApply apply = new TVehicleApply(clid, sqrid,
				sqr, sy, stdate,
				enddate, mmd,bz,new Date());
		vehicleApplyService.add(apply);
		 return true;
	}



	/**
	 * 动态数据
	 * 
	 * @param item
	 *            控件对象
	 * @return 可返回Map或List + Object数组，如果是Map则key代表代码值，value代表代码名称，
	 *         如果是数组，则第一列为代码名称，第二列为代码值，第三列为代码简拼，第四列为分级信息。
	 */
	public Object sCl_dynamicData(Item item) {
		Integer nCarType = ParamUtil.getInteger("cllx");
		if(nCarType == null){
			return null;
		}
		TVehicleApplyDaoImpl tVehicleApplyDaoImpl = (TVehicleApplyDaoImpl)Artery.getBean("tVehicleApplyDaoImpl");
		return tVehicleApplyDaoImpl.getCarNoByCarType(nCarType);
	}



	/**
	 * 根据车辆类型获取车辆列表
	 * 
	 * @param qp
	 *            查询参数，只在分页查询时可用，否则为null
	 * @return Object 当为分页查询时，需要返回IPagableData对象，否则可为任意pojo
	 */
	public Object getVType(IQueryInfo qp) {
		List list =new ArrayList();
		Map map = new HashMap();
		map.put("key", "test");
		list.add(map);
		return list;
	}



	
	
	/**
	 * 值改变时脚本
	 * 
	 * @param item
	 *            控件对象
	 */
	public Object sCl_onChangeServer(Item item) {
		String nCarNo = ParamUtil.getString("cl");
		if(nCarNo == null){
			return null;
		}
		TVehicle t = (TVehicle) getHibernateTemplate().get(TVehicle.class, nCarNo);
		return t;
	}


	/**
	 * 设置为只读
	 * 
	 * @param item
	 */
	public void onShowReadOnly(Item item) {
		item.set("displayType", "readOnly");
	}


	
	
	
	
			


}