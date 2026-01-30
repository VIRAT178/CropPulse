package com.croppulse.backend.Controller;

import com.croppulse.backend.Service.AIService;
import com.croppulse.backend.Response.ApiResponse;
import com.croppulse.backend.dto.AIChatMessageDTO;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-chat")
@CrossOrigin(origins = "*")
public class AIChatController {

    private final AIService aiService;

    public AIChatController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/message")
    public ApiResponse<Map<String, String>> sendMessage(@RequestBody AIChatMessageDTO chatMessage) {
        try {
            // Extract email from the JWT authentication principal
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String userEmail = null;
            
            if (principal instanceof java.util.Map) {
                userEmail = (String) ((java.util.Map<?, ?>) principal).get("email");
            } else if (principal instanceof String) {
                userEmail = (String) principal;
            }
            
            if (userEmail == null) {
                userEmail = "unknown";
            }
            
            String aiResponse = aiService.getAIResponse(chatMessage.getMessage(), chatMessage.getUserRole());

            Map<String, String> responseData = new HashMap<>();
            responseData.put("userMessage", chatMessage.getMessage());
            responseData.put("aiResponse", aiResponse);
            responseData.put("userEmail", userEmail);

            return new ApiResponse<>(true, "Response generated successfully", responseData);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error processing message: " + e.getMessage(), null);
        }
    }

    @GetMapping("/health")
    public ApiResponse<String> healthCheck() {
        return new ApiResponse<>(true, "AI Chat service is running", "OK");
    }
}
