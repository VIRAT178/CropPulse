package com.croppulse.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed

    @Column(nullable = false)
    private String name;

    private String mobile;

    private String state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // FARMER, BUYER, ADMIN

    // Farmer-specific
    private Double landSize;

    // Buyer-specific
    private String company;
    private String interestedCrops; 

    // Password reset
    private String resetToken;

    private Instant resetTokenExpiry;
}
