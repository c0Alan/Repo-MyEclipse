package com.ssm.springmvc.controller;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RequestController {
    
    private static Logger logger = Logger.getLogger(RequestController.class);
    
    private String resource = "request/";
    
    @RequestMapping("/helloWorld")
    public String helloWorld(){
        return "success";
    }
    
    @RequestMapping("/testPathVariable/{id}")
    public String testPathVariable(@PathVariable(value="id") Integer id, Map<String, Integer> result){
        result.put("testPathVariable", id);
        logger.info(id);
        return resource + "requestResult";
    }

}
