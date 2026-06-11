package com.example.myFirstProject.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/api/message")
    public String getMessage() {
        return "SCCL Backend Connected Successfully";
    }
}