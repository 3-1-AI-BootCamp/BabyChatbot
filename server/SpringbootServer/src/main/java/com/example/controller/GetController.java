package com.example.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/ajs")
public class GetController {

    @GetMapping("/check")
    public String getHello() {
        return "server is running";
    }


    @GetMapping("/anything")
    public String getAnything() {
        return "can add anything!";
    }

}