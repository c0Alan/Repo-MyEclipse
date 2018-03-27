package com.thunisoft.vehicle.pojo;

public enum ResultCode {
	/**
	 * ClassName: ResultCode 
	 * @Description: 返回结果类型的编码枚举
	 * @author 蔡海滨
	 * @date 2017-6-9
	 */
	
	SUCCESS("10000", "操作成功！"),
	FAIL("20000", "操作失败！");
	
	private String code;
	private String msg;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	private ResultCode(String code, String msg) {
		this.code = code;
		this.msg = msg;
	}
	
	
	
	
}
