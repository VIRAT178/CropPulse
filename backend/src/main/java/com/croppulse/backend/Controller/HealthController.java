package com.croppulse.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("service", "CropPulse Backend API");
        response.put("version", "1.0.0");
        response.put("message", "CropPulse API is running successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "CropPulse");
        return ResponseEntity.ok(response);
    }
}
