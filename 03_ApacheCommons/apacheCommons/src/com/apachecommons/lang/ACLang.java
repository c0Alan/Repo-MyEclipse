package com.apachecommons.lang;

import org.apache.commons.lang3.StringUtils;

/**
 * apache commons lang 包测试类
 * 
 * @author liuxl
 * 2017-9-27 下午2:10:17
 */
public class ACLang {
    
    /**
     * 测试  StringUtils 类
     * 
     * 2017-9-27 下午2:13:08
     */
    public void testStringUtils(){
        String str = "abc";
        
        boolean isEmpty = StringUtils.isEmpty(str); // 判断字符串是否为空
        System.out.println(isEmpty);
        
    }

}
