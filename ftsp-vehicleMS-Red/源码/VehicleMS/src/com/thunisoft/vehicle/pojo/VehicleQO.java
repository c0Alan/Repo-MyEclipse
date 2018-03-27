package com.thunisoft.vehicle.pojo;

/**
 * ClassName: VehicleQO 
 * @Description: 车辆信息查询对象
 * @author 蔡海滨
 * @date 2017-6-9
 */
public class VehicleQO extends BaseQO {
	
	private String carId;
	private String carNo;
	private String carType;
	
	public String getCarNo() {
		return carNo;
	}
	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}
	public String getCarType() {
		return carType;
	}
	public void setCarType(String carType) {
		this.carType = carType;
	}
	public String getCarId() {
		return carId;
	}
	public void setCarId(String carId) {
		this.carId = carId;
	}
	
	
	
	
	
}
