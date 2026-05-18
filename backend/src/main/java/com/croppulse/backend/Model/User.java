package com.croppulse.backend.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "users")
public class User {

    public static final String SEQUENCE_NAME = "users_sequence";
    
    @Id
    private Long id;

    @Indexed(unique = true)
    private String email;

    private String password; // Hashed

    private String name;

    private String mobile;

    private String state;

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
