package com.thunisoft.vehicle.pojo;

import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;

/**
 * ClassName: BaseQO 
 * @Description: 查询对象基类
 * @author 蔡海滨
 * @date 2017-6-9
 */
public class BaseQO {
	
	/*分页对象*/
	private IQueryInfo queryInfo;

	public IQueryInfo getQueryInfo() {
		return queryInfo;
	}

	public void setQueryInfo(IQueryInfo queryInfo) {
		this.queryInfo = queryInfo;
	}
	
	
}
