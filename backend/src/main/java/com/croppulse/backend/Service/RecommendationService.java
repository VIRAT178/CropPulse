package com.croppulse.backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.Recommendation;
import com.croppulse.backend.Repos.RecommendationRepo;
import com.croppulse.backend.dto.AIRecommendationDTO;

@Service
public class RecommendationService {

    private final RecommendationRepo recommendationRepo;
    private final FarmerService farmerService;

    public RecommendationService(RecommendationRepo recommendationRepo, FarmerService farmerService) {
        this.recommendationRepo = recommendationRepo;
        this.farmerService = farmerService;
    }

    public Recommendation genrateAndSaveRecommendation(Long farmerId){
        Farmer farmer = farmerService.getFarmerById(farmerId);
        RestTemplate restTemplate = new RestTemplate();
        String pythonUrl = "http://localhost:8000/recommend-crop";
        AIRecommendationDTO aiRecommendationDTO = restTemplate.postForObject(pythonUrl, farmer, AIRecommendationDTO.class);

        Recommendation rec = new Recommendation();
        rec.setRecommendedCrop(aiRecommendationDTO.getRecommendedCrop());
        rec.setExpectedPrice(aiRecommendationDTO.getExpectedPrice());
        rec.setRiskLevel(aiRecommendationDTO.getRiskLevel());
        rec.setConfidenceScore(aiRecommendationDTO.getConfidenceScore());
        rec.setFarmer(farmer);

        return recommendationRepo.save(rec);
    }
}
