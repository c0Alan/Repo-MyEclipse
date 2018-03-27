package com.thunisoft.vehicle.service;

import java.io.Serializable;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.vehicle.pojo.BaseQO;

/**
 * 
 * @author dingql 本接口实现所有没有任何业务相关最基础的方法。
 */


public interface IBaseService<T,PK extends Serializable>{
	
	IPagableData queryPage(BaseQO qo);
	
	void add(T t);
	
	T getById(Serializable id);
	
	void saveOrUpdate(T t);
	
	void update(T t);
}
