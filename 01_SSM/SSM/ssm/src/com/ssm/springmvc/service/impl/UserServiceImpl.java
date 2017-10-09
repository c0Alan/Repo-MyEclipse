package com.ssm.springmvc.service.impl;



import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ssm.springmvc.mapper.UserMapper;
import com.ssm.springmvc.model.User;
import com.ssm.springmvc.service.UserService;

@Service("userService")
public class UserServiceImpl implements UserService{

    @Resource
    private UserMapper userDao;
    
    @Override
    public User login(User user) {
        return userDao.login(user);
    }

}
