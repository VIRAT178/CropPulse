package com.croppulse.backend.Config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MongoUriValidator {

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @PostConstruct
    public void validateMongoUri() {
        if (mongoUri == null || mongoUri.isBlank()) {
            throw new IllegalStateException(
                "spring.data.mongodb.uri is not configured. Set MONGODB_URI for deployment or add a local profile override."
            );
        }
    }
}