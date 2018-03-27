package com.thunisoft.vehicle.dao;

import java.io.Serializable;
import java.util.List;

import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.vehicle.pojo.VehicleQO;

/**
 * ClassName: BaseDao 
 * @Description: 基础dao接口类
 * @author 蔡海滨
 * @date 2017-6-9
 */
public interface BaseDao<T,PK extends Serializable>{

    T get(PK id);

    void persist(T entity);

    PK save(T entity);

    void saveOrUpdate(T entity);
    
    void update(T entity);

    void delete(PK id);

    void flush();
    
    IPagableData queryPage(String hql, List<Object> params, IQueryInfo query, String defaultSortField, String defaultSortDir);
    
    
}