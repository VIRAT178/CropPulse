package com.croppulse.backend.Model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "recommendations")
public class Recommendation {
    public static final String SEQUENCE_NAME = "recommendations_sequence";
    
    @Id
    private Long id;

    private String recommendedCrop;
    private Double expectedPrice;
    private String riskLevel;
    private Double confidenceScore;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Long farmerId;

}
