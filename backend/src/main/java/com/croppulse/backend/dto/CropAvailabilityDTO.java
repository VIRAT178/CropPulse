package com.croppulse.backend.dto;

import lombok.Data;

@Data
public class CropAvailabilityDTO {
    private Long id;
    private String name;
    private String farmerName;
    private Double quantity; // in kg
    private Double pricePerKg;
    private String village;
    private String state;
    private String quality; // Premium, Standard, Economy
    private String harvestDate;
    private String certification; // Organic, Non-organic, etc.
    private String description;
}
