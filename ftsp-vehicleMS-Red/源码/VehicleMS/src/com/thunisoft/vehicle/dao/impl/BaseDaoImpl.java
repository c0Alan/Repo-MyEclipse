package com.thunisoft.vehicle.dao.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Repository;

import com.sun.istack.internal.FinalArrayList;
import com.thunisoft.artery.module.config.ArteryConfigUtil;
import com.thunisoft.artery.module.dict.util.ArteryDictUtil;
import com.thunisoft.artery.module.organ.util.ArteryOrganUtil;
import com.thunisoft.artery.parse.dataset.domain.IPagableData;
import com.thunisoft.artery.parse.dataset.domain.IQueryInfo;
import com.thunisoft.artery.parse.dataset.domain.ISortInfo;
import com.thunisoft.artery.parse.dataset.domain.impl.DefaultPagableData;
import com.thunisoft.artery.parse.dataset.domain.impl.DefaultQueryInfo;
import com.thunisoft.artery.util.ArteryUtil;
import com.thunisoft.vehicle.dao.BaseDao;
import com.thunisoft.vehicle.hibernate.TVehicle;

/**
 * ClassName: BaseDaoImpl 
 * @Description: 基础的dao实现类，实现了增删改查和分页功能
 * @author 蔡海滨
 * @date 2017-6-9
 */

@Repository("baseDaoImpl")
public class BaseDaoImpl<T> implements BaseDao<T, Serializable>{

	@Autowired
	@Qualifier("sessionFactory_vehicle")
	private SessionFactory sessionFactory;
	
	private HibernateTemplate hibernateTemplate;
	
	protected synchronized HibernateTemplate getHibernateTemplate(){
		if (null == hibernateTemplate){
			hibernateTemplate = new HibernateTemplate(sessionFactory);
		}
		return hibernateTemplate;
	}
	
	/**
	 * 获取泛型类的类型
	 * 
	 * @return Class 返回泛型类的类型
	 */
	private Class getTClass(){
		Type genType = getClass().getGenericSuperclass();   
		Type[] params = ((ParameterizedType) genType).getActualTypeArguments();   
	    Class	entityClass =  (Class)params[0];
	    return entityClass;
	}
	
	/**
	 * 根据id获取对象
	 * @param
	 * 		id 主键id
	 * @return T 返回泛型类的实例
	 */
	public T get(Serializable id) {		
		return (T)getHibernateTemplate().get(getTClass(), id);		
	}

	/**
	 * 持久化实体
	 * @param
	 * 		T entity 对象
	 */
	public void persist(T entity) {
		getHibernateTemplate().persist(entity);
		// TODO Auto-generated method stub
		
	}

	/**
	 * 保存实体
	 * @param
	 * 		T entity 对象
	 */
	public Serializable save(T entity) {
		getHibernateTemplate().save(entity);
		return (Serializable)entity;
	}

	/**
	 * 更新
	 * @param
	 * 		T entity 对象
	 */
	public void saveOrUpdate(T entity) {
		getHibernateTemplate().persist(entity);
	}
	
	/**
	 * 更新
	 * @param
	 * 		T entity 对象
	 */
	public void update(T entity) {
		getHibernateTemplate().update(entity);
	}

	/**
	 * 删除
	 * @param
	 * 		Serializable id 对象id
	 */
	public void delete(Serializable id) {
		T t = get(id);
		getHibernateTemplate().delete(t);
	}

	/**
	 * flush
	 */
	public void flush() {
		getHibernateTemplate().flush();
	}

	/**
	 * 分页查询
	 * @param
	 * 		String hql 查询的sql语句 
	 * 		List<Object> params sql的参数
	 * 		IQueryInfo query 分页对象及查询结果
	 * 		String defaultSortField 默认排序字段
	 */
	public IPagableData queryPage(String hql, List<Object> params, IQueryInfo query, String defaultSortField, String defaultSortDir) {
		if (null == params || params.size() == 0){
			params = new ArrayList<Object>();
		}
		
		if (null == query){
			query = new DefaultQueryInfo();
			query.setCurrPageNo(1);
			query.setRowsPerPage(10);
		}
		
	    String dataHql = addSortInfo(hql, query.getSortColumns(), defaultSortField, defaultSortDir);	
		
		DefaultPagableData pageData = new DefaultPagableData();
		int offset = (query.getCurrPageNo()-1)*query.getRowsPerPage();
		int size = query.getRowsPerPage();
		
		pageData.setData(getListForPage(dataHql, params, offset, size));
		query.setRowCount(getRowCount(hql, params));
		pageData.setPageInfo(query);
		return pageData;
	}
	
	/**
	 * 获取当页的数据集
	 * @param
	 * 		String hql 查询的sql语句 
	 * 		List<Object> params sql的参数
	 * 		int offset 偏移量
	 * 		int size 每页大小
	 */
	private List getListForPage(final String hql, final List<Object> params, final int offset, final int size){
		List list = getHibernateTemplate().executeFind(new HibernateCallback() {     
		    public Object doInHibernate(Session session)     
		      throws HibernateException, SQLException {     
		     Query query = session.createQuery(hql);
		     if (null != params){
		    	 for (int ii = 0; ii < params.size(); ii++) {
					query.setParameter(ii, params.get(ii));
				 }
		     }		     
		     query.setFirstResult(offset);     
		     query.setMaxResults(size);     
		     List list = query.list();     
		     return list;     
		    }     
		   });     
		   return list;   
	}
	
	/**
	 * 获取总记录数
	 * @param
	 * 		String hql 查询的sql语句 
	 * 		List<Object> params sql的参数
	 */
	 private int getRowCount(final String hql, final List<Object> params) {        
	        Long result = null;     
	        result = (Long)getHibernateTemplate().execute(new HibernateCallback() {     
	    
	            public Object doInHibernate(Session arg0)     
	                    throws HibernateException, SQLException {     
	                Query query = arg0.createQuery("select count(*) " + hql);     
	                if (null != params){
	   		    	 for (int ii = 0; ii < params.size(); ii++) {
		   					query.setParameter(ii, params.get(ii));
		   				 }
		   		     }		     
	                return query.uniqueResult();     
	            }     
	    
	        });   
	        long ret = result;
	        return (int)ret;     
	    }    

	
	 /**
		 * list对象转出pagabledata对象
		 * @param
		 * 		List data list的数据集 
		 * 		IQueryInfo q 分页对象
		 */
	protected IPagableData toPageData(List data, IQueryInfo q) {
		DefaultPagableData pd = new DefaultPagableData();
		pd.setData(data);
		pd.setPageInfo(q);
		return pd;
	}
	
	
	/**
	 * 附加排序信息
	 * @param
	 * 		String hql 查询的sql语句 
	 * 		ISortInfo[] sortInfos 排序信息
	 * 		String defaultSortField 默认排序字段
	 */
	protected String addSortInfo(String hql, ISortInfo[] sortInfos, String defaultSortField, String defaultSortDir) {
		
		if (sortInfos != null) {
            StringBuffer queryBuffer = new StringBuffer(hql);
            queryBuffer.append(" order by ");
            for (ISortInfo sortInfo : sortInfos) {
                queryBuffer.append(sortInfo.getColumn()).append(" ")
                        .append(sortInfo.getDir()).append(",");
            }
            return queryBuffer.substring(0, queryBuffer.length() - 1);
            // return queryBuffer.toString();

        } else {
        	StringBuffer queryBuffer = new StringBuffer(hql);
        	queryBuffer.append(" order by ").append(defaultSortField).append(" ").append(defaultSortDir);
            return queryBuffer.toString();
        }
		
	}

}
