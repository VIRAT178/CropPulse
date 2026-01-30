package com.croppulse.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication()
@EnableScheduling
public class CropPulseApplication {

	public static void main(String[] args) {
		SpringApplication.run(CropPulseApplication.class, args);
	}
	
}
