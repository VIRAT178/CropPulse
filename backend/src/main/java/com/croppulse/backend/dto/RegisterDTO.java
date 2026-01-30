package com.croppulse.backend.dto;

import com.croppulse.backend.Model.UserRole;
import lombok.Data;

@Data
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
    private String mobile;
    private String state;
    private UserRole role; // FARMER or BUYER
    
    // Farmer-specific
    private Double landSize;
    private String village;
    private String soilType;
    
    // Buyer-specific
    private String company;
    private String interestedCrops;
}
