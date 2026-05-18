package com.croppulse.backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.croppulse.backend.Model.Recommendation;
import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Repos.RecommendationRepo;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Service.RecommendationService;
import com.croppulse.backend.Service.EmailService;
import com.croppulse.backend.Response.ApiResponse;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final RecommendationRepo recommendationRepo;
    private final FarmerRepo farmerRepo;
    private final EmailService emailService;

    public RecommendationController(RecommendationService recommendationService,
            RecommendationRepo recommendationRepo,
            FarmerRepo farmerRepo,
            EmailService emailService) {
        this.recommendationService = recommendationService;
        this.recommendationRepo = recommendationRepo;
        this.farmerRepo = farmerRepo;
        this.emailService = emailService;
    }

    @PostMapping("/me")
    public ApiResponse<Recommendation> generateRecommendationForCurrentFarmer() {
        // Extract email from the JWT authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        
        if (principal instanceof java.util.Map) {
            email = (String) ((java.util.Map<?, ?>) principal).get("email");
        } else if (principal instanceof String) {
            email = (String) principal;
        }
        
        if (email == null || email.trim().isEmpty()) {
            return new ApiResponse<>(false, "Unable to extract email from authentication token", null);
        }
        
        Optional<Farmer> farmer = farmerRepo.findByEmail(email);
        
        if (farmer.isPresent()) {
            Recommendation recommendation = recommendationService.genrateAndSaveRecommendation(farmer.get().getId());
            return new ApiResponse<>(true, "Recommendation generated", recommendation);
        }
        return new ApiResponse<>(false, "Farmer not found", null);
    }

    @GetMapping("/my-history")
    public ApiResponse<List<Recommendation>> getMyRecommendationHistory() {
        // Extract email from the JWT authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        
        if (principal instanceof java.util.Map) {
            email = (String) ((java.util.Map<?, ?>) principal).get("email");
        } else if (principal instanceof String) {
            email = (String) principal;
        }
        
        if (email == null || email.trim().isEmpty()) {
            return new ApiResponse<>(false, "Unable to extract email from authentication token", null);
        }
        
        Optional<Farmer> farmer = farmerRepo.findByEmail(email);
        
        if (farmer.isPresent()) {
            List<Recommendation> history = recommendationRepo.findByFarmerId(farmer.get().getId());
            return new ApiResponse<>(true, "Recommendation history retrieved", history);
        }
        return new ApiResponse<>(false, "Farmer not found", null);
    }

    @PostMapping("/{farmerId}")
    public Recommendation genrateRecommendation(@PathVariable Long farmerId) {
        return recommendationService.genrateAndSaveRecommendation(farmerId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Recommendation> getFarmerHistory(@PathVariable Long farmerId) {
        return recommendationRepo.findByFarmerId(farmerId);
    }

    @PostMapping("/{recommendationId}/send-email")
    public ApiResponse<String> sendRecommendationEmail(@PathVariable Long recommendationId) {
        try {
            Optional<Recommendation> recommendationOpt = recommendationRepo.findById(recommendationId);
            
            if (!recommendationOpt.isPresent()) {
                return new ApiResponse<>(false, "Recommendation not found", null);
            }

            Recommendation recommendation = recommendationOpt.get();
            Farmer farmer = recommendation.getFarmerId() == null ? null : farmerRepo.findById(recommendation.getFarmerId()).orElse(null);

            if (farmer == null || farmer.getEmail() == null) {
                return new ApiResponse<>(false, "Farmer email not found", null);
            }

            // Send the recommendation email
            emailService.sendRecommendationEmail(
                    farmer.getEmail(),
                    farmer.getName(),
                    recommendation.getRecommendedCrop(),
                    recommendation.getExpectedPrice(),
                    recommendation.getRiskLevel(),
                    recommendation.getConfidenceScore()
            );

            return new ApiResponse<>(true, "Recommendation email sent successfully", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to send email: " + e.getMessage(), null);
        }
    }

}
