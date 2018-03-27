package com.thunisoft.vehicle.pojo;

import java.util.Date;

/**
 * ClassName: VehicleApplyQO 
 * @Description: 用车申请查询对象
 * @author 蔡海滨
 * @date 2017-6-9
 */
public class VehicleApplyQO  extends BaseQO{
	
	
	private String carType;
	private String carNo;
	private String start;
	private String end;
	public String getCarType() {
		return carType;
	}
	public void setCarType(String carType) {
		this.carType = carType;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getCarNo() {
		return carNo;
	}
	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}
	
	
	
	
	
}
