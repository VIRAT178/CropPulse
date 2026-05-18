package com.croppulse.backend.Config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class MongoUriValidator {

    private final Environment environment;

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    public MongoUriValidator(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validateMongoUri() {
        if (mongoUri == null || mongoUri.isBlank() || mongoUri.contains("${")) {
            throw new IllegalStateException(
                "spring.data.mongodb.uri is not configured. Set MONGODB_URI for deployment or add a local profile override."
            );
        }

        boolean isProdProfile = false;
        for (String profile : environment.getActiveProfiles()) {
            if ("prod".equalsIgnoreCase(profile) || "production".equalsIgnoreCase(profile)) {
                isProdProfile = true;
                break;
            }
        }

        if (isProdProfile && mongoUri.contains("localhost:27017")) {
            throw new IllegalStateException(
                "spring.data.mongodb.uri points to localhost in production. Use a hosted MongoDB URI (for example MongoDB Atlas)."
            );
        }
    }
}