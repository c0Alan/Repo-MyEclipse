package com.thunisoft.vehicle.pojo;

import org.apache.commons.lang.StringUtils;

public class Result {
	/**
	 * ClassName: Result 
	 * @Description: 返回结果类，封装了返回的编码，数据，和信息
	 * @author 蔡海滨
	 * @date 2017-6-9
	 */
	
	private String code;
	private String msg;
	private Object data;
	
	
	
	
	public Result(String code, String msg) {
		super();
		this.code = code;
		this.msg = msg;
	}
	
	
	
	
	public Result(String code, String msg, Object data) {
		super();
		this.code = code;
		this.msg = msg;
		this.data = data;
	}




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
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
	public static Result success(){
		return new Result(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg());
	}
	
	public static Result fail(String msg){
		return new Result(ResultCode.FAIL.getCode(), StringUtils.isEmpty(msg)? ResultCode.FAIL.getMsg():msg);
	}
	
	
}
