package com.croppulse.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class FarmerConnectionDTO {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String village;
    private String state;
    private String address;
    private String status; // ACTIVE, PENDING, DISCONNECTED
    private Double rating;
    private Integer transactionCount;
    private List<String> specialtyCrops;
    private String connectionDate;
    private String lastTransaction;
    private List<ReviewDTO> reviews;
}
