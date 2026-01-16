package com.croppulse.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CropPulseController {
    @GetMapping("/hello")
    public String hello() {
        return "🌾 Welcome to CropPulse Backend!";
    }
}
