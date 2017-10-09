package com.ssm.springmvc.model;



/**
 * 测试
 * 
 * @author liuxl
 * 2017-9-21 下午4:15:53
 */
public class User {

    private String id;
    private String loginId;
    private String userName;
    private String password;
    
    
    public String getLoginId() {
        return loginId;
    }
    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
}