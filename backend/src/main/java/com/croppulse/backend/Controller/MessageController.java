package com.croppulse.backend.Controller;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.Message;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Repos.MessageRepo;
import com.croppulse.backend.Repos.UserRepository;
import com.croppulse.backend.Response.ApiResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepo messageRepo;
    private final FarmerRepo farmerRepo;
    private final UserRepository userRepository;

    public MessageController(MessageRepo messageRepo, FarmerRepo farmerRepo, UserRepository userRepository) {
        this.messageRepo = messageRepo;
        this.farmerRepo = farmerRepo;
        this.userRepository = userRepository;
    }

    /**
     * Get farmer's conversations (with all buyers)
     */
    @GetMapping("/farmer/conversations")
    public ApiResponse<List<Map<String, Object>>> getFarmerConversations() {
        try {
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
            
            if (!farmer.isPresent()) {
                return new ApiResponse<>(false, "Farmer not found", null);
            }
            
            // Return empty conversations list for now
            // In a real implementation, this would fetch from a database
            List<Map<String, Object>> conversations = new ArrayList<>();
            return new ApiResponse<>(true, "Farmer conversations retrieved", conversations);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching conversations: " + e.getMessage(), null);
        }
    }

    /**
     * Get messages between a farmer and a specific buyer
     */
    @GetMapping("/farmer/buyer/{buyerId}")
    public ApiResponse<List<Map<String, Object>>> getMessagesWithBuyer(@PathVariable Long buyerId) {
        try {
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
            
            if (!farmer.isPresent()) {
                return new ApiResponse<>(false, "Farmer not found", null);
            }
            
            Optional<User> buyer = userRepository.findById(buyerId);
            
            if (!buyer.isPresent()) {
                return new ApiResponse<>(false, "Buyer not found", null);
            }
            
            // Get messages from database between farmer and buyer
            List<Message> messages = messageRepo.findByConversationIdOrderByTimestampAsc(
                    "farmer_" + farmer.get().getId() + "_buyer_" + buyerId
            );
            
            // Also get messages from the other direction
            List<Message> messagesReverse = messageRepo.findByConversationIdOrderByTimestampAsc(
                    "buyer_" + buyerId + "_farmer_" + farmer.get().getId()
            );
            
            messages.addAll(messagesReverse);
            messages.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));
            
            List<Map<String, Object>> response = messages.stream().map(msg -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", msg.getId());
                map.put("conversationId", msg.getConversationId());
                map.put("senderId", msg.getSenderId());
                map.put("senderType", msg.getSenderType());
                map.put("recipientId", msg.getRecipientId());
                map.put("recipientType", msg.getRecipientType());
                map.put("content", msg.getContent());
                map.put("timestamp", msg.getTimestamp());
                map.put("isRead", msg.getIsRead());
                return map;
            }).collect(Collectors.toList());
            
            return new ApiResponse<>(true, "Messages retrieved", response);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching messages: " + e.getMessage(), null);
        }
    }

    /**
     * Send message from farmer to buyer (via REST - optional, WebSocket is primary)
     */
    @PostMapping("/farmer/send")
    public ApiResponse<Void> sendMessageToBuyer(@RequestBody Map<String, String> payload) {
        // Messages are sent via WebSocket and persisted there
        // This endpoint is kept for compatibility but messages should use WebSocket
        return new ApiResponse<>(true, "Please use WebSocket for messaging", null);
    }

    /**
     * Get buyer's conversations (with all farmers)
     */
    @GetMapping("/buyer/conversations")
    public ApiResponse<List<Map<String, Object>>> getBuyerConversations() {
        try {
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
            
            Optional<User> buyer = userRepository.findByEmail(email);
            
            if (!buyer.isPresent()) {
                return new ApiResponse<>(false, "Buyer not found", null);
            }
            
            // Return empty conversations list for now
            // In a real implementation, this would fetch from a database
            List<Map<String, Object>> conversations = new ArrayList<>();
            return new ApiResponse<>(true, "Buyer conversations retrieved", conversations);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching conversations: " + e.getMessage(), null);
        }
    }

    /**
     * Get messages between a buyer and a specific farmer
     */
    @GetMapping("/buyer/farmer/{farmerId}")
    public ApiResponse<List<Map<String, Object>>> getMessagesWithFarmer(@PathVariable Long farmerId) {
        try {
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
            
            Optional<User> buyer = userRepository.findByEmail(email);
            
            if (!buyer.isPresent()) {
                return new ApiResponse<>(false, "Buyer not found", null);
            }
            
            Optional<Farmer> farmer = farmerRepo.findById(farmerId);
            
            if (!farmer.isPresent()) {
                return new ApiResponse<>(false, "Farmer not found", null);
            }
            
            // Get messages from database between buyer and farmer
            List<Message> messages = messageRepo.findByConversationIdOrderByTimestampAsc(
                    "buyer_" + buyer.get().getId() + "_farmer_" + farmerId
            );
            
            // Also get messages from the other direction
            List<Message> messagesReverse = messageRepo.findByConversationIdOrderByTimestampAsc(
                    "farmer_" + farmerId + "_buyer_" + buyer.get().getId()
            );
            
            messages.addAll(messagesReverse);
            messages.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));
            
            List<Map<String, Object>> response = messages.stream().map(msg -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", msg.getId());
                map.put("conversationId", msg.getConversationId());
                map.put("senderId", msg.getSenderId());
                map.put("senderType", msg.getSenderType());
                map.put("recipientId", msg.getRecipientId());
                map.put("recipientType", msg.getRecipientType());
                map.put("content", msg.getContent());
                map.put("timestamp", msg.getTimestamp());
                map.put("isRead", msg.getIsRead());
                return map;
            }).collect(Collectors.toList());
            
            return new ApiResponse<>(true, "Messages retrieved", response);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching messages: " + e.getMessage(), null);
        }
    }

    /**
     * Send message from buyer to farmer (via REST - optional, WebSocket is primary)
     */
    @PostMapping("/buyer/send")
    public ApiResponse<Void> sendMessageToFarmer(@RequestBody Map<String, String> payload) {
        // Messages are sent via WebSocket and persisted there
        // This endpoint is kept for compatibility but messages should use WebSocket
        return new ApiResponse<>(true, "Please use WebSocket for messaging", null);
    }
}
