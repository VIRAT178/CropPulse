package com.croppulse.backend.dto;

import lombok.Data;

@Data
public class AIRecommendationDTO {
    private String recommendedCrop;
    private Double expectedPrice;
    private String riskLevel;
    private Double confidenceScore;
}
