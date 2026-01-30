package com.croppulse.backend.Service;

import com.croppulse.backend.Config.JwtTokenProvider;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Repos.UserRepository;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.dto.AuthTokenDTO;
import com.croppulse.backend.dto.LoginDTO;
import com.croppulse.backend.dto.RegisterDTO;
import com.croppulse.backend.Model.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerRepo farmerRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${app.reset.base-url:http://localhost:5173/reset-password?token=}")
    private String resetBaseUrl;

    public AuthService(UserRepository userRepository, FarmerRepo farmerRepo, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, EmailService emailService) {
        this.userRepository = userRepository;
        this.farmerRepo = farmerRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    public AuthTokenDTO register(RegisterDTO dto) {
        // Validate input
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (dto.getRole() == null) {
            throw new RuntimeException("Role is required");
        }
        
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setMobile(dto.getMobile());
        user.setState(dto.getState());
        user.setRole(dto.getRole());
        user.setLandSize(dto.getLandSize());
        user.setCompany(dto.getCompany());
        user.setInterestedCrops(dto.getInterestedCrops());

        try {
            User saved = userRepository.save(user);
            
            // If user is a farmer, create a corresponding Farmer record
            if (saved.getRole() == UserRole.FARMER) {
                Farmer farmer = new Farmer();
                farmer.setEmail(saved.getEmail());
                farmer.setName(saved.getName());
                farmer.setState(saved.getState());
                // Use default values if not provided to satisfy @NotBlank constraints
                farmer.setVillage(dto.getVillage() != null && !dto.getVillage().trim().isEmpty() ? dto.getVillage() : "Not Specified");
                farmer.setSoilType(dto.getSoilType() != null && !dto.getSoilType().trim().isEmpty() ? dto.getSoilType() : "Unknown");
                farmer.setLandSize(saved.getLandSize() != null && saved.getLandSize() > 0 ? saved.getLandSize() : 1.0);
                farmerRepo.save(farmer);
            }
            
            String token = jwtTokenProvider.generateToken(saved.getEmail(), saved.getRole().name(), saved.getId());
            try { emailService.sendRegistrationEmail(saved); } catch (Exception e) { }
            return new AuthTokenDTO(token, saved.getEmail(), saved.getRole().name(), saved.getId(), saved.getName());
        } catch (Exception e) {
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    public AuthTokenDTO login(LoginDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        // Login email notifications disabled per request to avoid email on login
        return new AuthTokenDTO(token, user.getEmail(), user.getRole().name(), user.getId(), user.getName());
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = generateResetToken();
        user.setResetToken(token);
        user.setResetTokenExpiry(Instant.now().plusSeconds(3600)); // 1 hour
        userRepository.save(user);

        String url = resetBaseUrl + token;
        emailService.sendPasswordResetEmail(user, url);
    }

    public void resetPassword(String token, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required");
        }

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry() == null || Instant.now().isAfter(user.getResetTokenExpiry())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private String generateResetToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

