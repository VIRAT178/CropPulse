package com.croppulse.backend.dto;

import lombok.Data;

@Data
public class MarketTrendDTO {
    private Long cropId;
    private String cropName;
    private Double currentPrice;
    private Double minPrice;
    private Double maxPrice;
    private Double percentageChange; // percentage change over time
    private String supplyStatus; // High, Medium, Low
    private String demandStatus; // High, Medium, Low
    private Double avgVolume; // average trading volume
    private Double volatility; // price volatility percentage
    private String sentiment; // Bullish, Bearish, Neutral
    private String analysis; // Detailed analysis text
}
