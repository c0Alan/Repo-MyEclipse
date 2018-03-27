package com.thunisoft.vehicle.util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.thunisoft.vehicle.service.IBaseService;

/**
 * ClassName:  BeanUtils
 * @Description: Bean辅助类
 * @author 蔡海滨
 * @date 2017-6-9
 */
public class BeanUtils {

	private static ApplicationContext ctx = null;
	
	private synchronized static ApplicationContext getApplicationContext(){
		if (null == ctx){
			ctx = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
		}
		return ctx;
	}
	
	/**
	 * 获取服务的bean
	 * @param
	 * 		Class clazz 服务的类
	 */
	public static IBaseService getService(Class clazz){
		
		ApplicationContext ctx = getApplicationContext();
		
		String name = clazz.getSimpleName();
		String a = name.substring(1,2).toLowerCase();
		String b = name.substring(2);
		name = a+b+"Impl";		
		return (IBaseService)ctx.getBean(name, clazz);
		
	}
	
}
