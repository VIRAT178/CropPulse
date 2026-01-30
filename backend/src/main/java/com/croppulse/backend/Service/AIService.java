package com.croppulse.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class AIService {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.1-70b-versatile}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getAIResponse(String userMessage, String userRole) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-groq-api-key-here")) {
            return "AI service not configured. Please set GROQ_API_KEY environment variable or get a free API key from https://console.groq.com";
        }

        try {
            // Create system prompt based on user role
            String systemPrompt = userRole.equals("farmer") ?
                "You are a helpful agricultural AI assistant for farmers. Provide practical advice about crop farming, pest management, irrigation, soil health, market prices, and best practices. Be concise and actionable." :
                "You are a helpful AI assistant for agricultural buyers. Provide advice about crop sourcing, quality assessment, pricing negotiations, and supplier relationships. Be concise and practical.";

            // Prepare request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            // Build messages array for chat completion
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("messages", messages);
            payload.put("max_tokens", 500);
            payload.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            // Make request using ResponseEntity for better error handling
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(apiUrl, request, String.class);
            
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                // Parse response manually
                JsonNode response = objectMapper.readTree(responseEntity.getBody());
                
                // Extract response from OpenAI-compatible format
                if (response.has("choices")) {
                    JsonNode choices = response.get("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        JsonNode firstChoice = choices.get(0);
                        if (firstChoice.has("message")) {
                            JsonNode message = firstChoice.get("message");
                            if (message.has("content")) {
                                return message.get("content").asText().trim();
                            }
                        }
                    }
                }
            }

            return "I'm having trouble understanding your question. Please try again.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I encountered an error: " + e.getMessage();
        }
    }
}
