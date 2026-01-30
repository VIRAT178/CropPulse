package com.croppulse.backend.Controller;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Repos.UserRepository;
import com.croppulse.backend.Response.ApiResponse;
import com.croppulse.backend.Service.FarmerService;
import com.croppulse.backend.Service.EmailService;
import com.croppulse.backend.dto.FarmerDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerService farmerService;
    private final FarmerRepo farmerRepo;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public FarmerController(FarmerService farmerService, FarmerRepo farmerRepo, UserRepository userRepository, EmailService emailService, RestTemplate restTemplate) {
        this.farmerService = farmerService;
        this.farmerRepo = farmerRepo;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/me")
    public ApiResponse<Farmer> getCurrentFarmer() {
        // Extract email from the JWT authentication principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        
        if (principal instanceof java.util.Map) {
            email = (String) ((java.util.Map<?, ?>) principal).get("email");
        } else if (principal instanceof String) {
            email = (String) principal;
        }
        
        if (email == null || email.trim().isEmpty()) {
            System.err.println("Unable to extract email from principal: " + principal);
            return new ApiResponse<>(false, "Unable to extract email from authentication token", null);
        }
        
        System.out.println("getCurrentFarmer called for email: " + email);
        
        Optional<Farmer> farmerOpt = farmerRepo.findByEmail(email);
        
        if (farmerOpt.isPresent()) {
            System.out.println("Farmer found: " + farmerOpt.get().getName());
            return new ApiResponse<>(true, "Farmer data retrieved", farmerOpt.get());
        }
        
        System.out.println("Farmer not found, attempting to create from User record...");
        
        // If farmer record doesn't exist, try to create one from User record
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("User found: " + user.getName() + ", ID: " + user.getId());
            
            Farmer newFarmer = new Farmer();
            newFarmer.setEmail(user.getEmail());
            newFarmer.setName(user.getName());
            newFarmer.setState(user.getState() != null && !user.getState().trim().isEmpty() ? user.getState() : "Not Specified");
            newFarmer.setVillage("Not Specified");
            newFarmer.setSoilType("Unknown");
            newFarmer.setLandSize(user.getLandSize() != null && user.getLandSize() > 0 ? user.getLandSize() : 1.0);
            
            try {
                Farmer savedFarmer = farmerRepo.save(newFarmer);
                System.out.println("Farmer profile created successfully with ID: " + savedFarmer.getId());
                return new ApiResponse<>(true, "Farmer profile created and retrieved", savedFarmer);
            } catch (Exception e) {
                System.err.println("Error creating farmer profile: " + e.getMessage());
                e.printStackTrace();
                return new ApiResponse<>(false, "Failed to create farmer profile: " + e.getMessage(), null);
            }
        }
        
        System.err.println("User not found for email: " + email);
        return new ApiResponse<>(false, "Farmer not found and user record does not exist for email: " + email, null);
    }

    @PutMapping("/me")
    public ApiResponse<Farmer> updateCurrentFarmerProfile(@Valid @RequestBody FarmerDTO farmerDTO) {
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
        
        Optional<Farmer> farmerOpt = farmerRepo.findByEmail(email);
        
        if (!farmerOpt.isPresent()) {
            return new ApiResponse<>(false, "Farmer not found", null);
        }

        Farmer farmer = farmerOpt.get();
        farmer.setName(farmerDTO.getName());
        farmer.setVillage(farmerDTO.getVillage());
        farmer.setState(farmerDTO.getState());
        farmer.setLandSize(farmerDTO.getLandSize());
        farmer.setSoilType(farmerDTO.getSoilType());

        Farmer updatedFarmer = farmerRepo.save(farmer);

        // Send profile update confirmation email
        try {
            emailService.sendProfileUpdateEmail(
                updatedFarmer.getEmail(),
                updatedFarmer.getName(),
                updatedFarmer.getVillage(),
                updatedFarmer.getState(),
                updatedFarmer.getSoilType(),
                updatedFarmer.getLandSize()
            );
        } catch (Exception e) {
            // Log but don't fail the request if email fails
        }

        return new ApiResponse<>(true, "Profile updated successfully", updatedFarmer);
    }

    @PostMapping("/recommendation")
    public Object getCropRecommendation(@RequestBody Farmer farmer) {

        String url = aiServiceUrl + "/recommend-crop";
        return restTemplate.postForObject(url, farmer, Object.class);
    }

    @GetMapping("/page")
    public Page<Farmer> getFarmersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return farmerRepo.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/search/state")
    public List<Farmer> searchByState(@RequestParam String state) {
        return farmerRepo.findByState(state);
    }

    @GetMapping("/search/village")
    public List<Farmer> searchByVillage(@RequestParam String village) {
        return farmerRepo.findByVillage(village);
    }

    @GetMapping
    public List<Farmer> getAllFarmers() {
        return farmerService.getAllFarmers();
    }

    @GetMapping("getByid/{id}")
    public Farmer getFarmerById(@PathVariable Long id) {
        return farmerService.getFarmerById(id);
    }

    @PostMapping
    public ApiResponse<Farmer> addFarmer(
            @Valid @RequestBody FarmerDTO farmerDTO) {

        Farmer farmer = new Farmer();
        farmer.setEmail(farmerDTO.getEmail());
        farmer.setName(farmerDTO.getName());
        farmer.setVillage(farmerDTO.getVillage());
        farmer.setState(farmerDTO.getState());
        farmer.setLandSize(farmerDTO.getLandSize());
        farmer.setSoilType(farmerDTO.getSoilType());

        Farmer savedFarmer = farmerService.saveFarmer(farmer);

        return new ApiResponse<>(
                true,
                "Farmer added successfully",
                savedFarmer);
    }

    @PutMapping("/{id}")
    public ApiResponse<Farmer> updateFarmer(
            @PathVariable Long id,
            @Valid @RequestBody FarmerDTO farmerDTO) {

        Farmer farmer = new Farmer();
        farmer.setEmail(farmerDTO.getEmail());
        farmer.setName(farmerDTO.getName());
        farmer.setVillage(farmerDTO.getVillage());
        farmer.setState(farmerDTO.getState());
        farmer.setLandSize(farmerDTO.getLandSize());
        farmer.setSoilType(farmerDTO.getSoilType());

        Farmer updatedFarmer = farmerService.updateFarmer(id, farmer);

        return new ApiResponse<>(
                true,
                "Farmer updated successfully",
                updatedFarmer);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteFarmer(@PathVariable Long id) {

        farmerService.deleteFarmer(id);

        return new ApiResponse<>(
                true,
                "Farmer deleted successfully",
                null);
    }

}
