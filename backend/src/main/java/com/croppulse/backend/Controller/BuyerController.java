package com.croppulse.backend.Controller;

import com.croppulse.backend.Model.User;
import com.croppulse.backend.Response.ApiResponse;
import com.croppulse.backend.Service.BuyerService;
import com.croppulse.backend.dto.CropAvailabilityDTO;
import com.croppulse.backend.dto.FarmerConnectionDTO;
import com.croppulse.backend.dto.MarketTrendDTO;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/buyers")
@CrossOrigin(origins = "*")
public class BuyerController {

    private final BuyerService buyerService;

    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    private String resolveBuyerEmail(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Map) {
            Object emailObj = ((Map<?, ?>) principal).get("email");
            if (emailObj != null) {
                return emailObj.toString();
            }
        }
        if (principal instanceof String) {
            return (String) principal;
        }
        String name = authentication.getName();
        return (name == null || name.isBlank()) ? null : name;
    }

    /**
     * Get all buyers
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getAllBuyers() {
        try {
            List<Map<String, Object>> buyers = buyerService.getAllBuyers();
            return new ApiResponse<>(true, "Buyers retrieved successfully", buyers);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching buyers: " + e.getMessage(), null);
        }
    }

    /**
     * Get available crops from all farmers
     * Filter options: all, high, low
     */
    @GetMapping("/crops")
    public ApiResponse<List<CropAvailabilityDTO>> getAvailableCrops(
            @RequestParam(defaultValue = "all") String filter) {
        try {
            List<CropAvailabilityDTO> crops = buyerService.getAvailableCrops(filter);
            return new ApiResponse<>(true, "Available crops retrieved successfully", crops);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching available crops: " + e.getMessage(), null);
        }
    }

    /**
     * Get market trends for crops
     * Time range in days: 7, 30, 90
     */
    @GetMapping("/market-trends")
    public ApiResponse<List<MarketTrendDTO>> getMarketTrends(
            @RequestParam(defaultValue = "30") String timeRange) {
        try {
            List<MarketTrendDTO> trends = buyerService.getMarketTrends(Integer.parseInt(timeRange));
            return new ApiResponse<>(true, "Market trends retrieved successfully", trends);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching market trends: " + e.getMessage(), null);
        }
    }

    /**
     * Get buyer's connections with farmers
     * Filter options: all, active, pending
     */
    @GetMapping("/connections")
    public ApiResponse<List<FarmerConnectionDTO>> getBuyerConnections(
            @RequestParam(defaultValue = "all") String filter) {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            List<FarmerConnectionDTO> connections = buyerService.getBuyerConnections(buyerEmail, filter);
            return new ApiResponse<>(true, "Buyer connections retrieved successfully", connections);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching connections: " + e.getMessage(), null);
        }
    }

    /**
     * Connect buyer with a farmer
     */
    @PostMapping("/connect")
    public ApiResponse<FarmerConnectionDTO> connectWithFarmer(@RequestBody Map<String, Long> payload) {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            Long farmerId = payload.get("farmerId");
            FarmerConnectionDTO connection = buyerService.createConnection(buyerEmail, farmerId);
            return new ApiResponse<>(true, "Successfully connected with farmer", connection);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error connecting with farmer: " + e.getMessage(), null);
        }
    }

    /**
     * Disconnect from a farmer
     */
    @DeleteMapping("/disconnect/{connectionId}")
    public ApiResponse<Void> disconnectFromFarmer(@PathVariable Long connectionId) {
        try {
            buyerService.disconnectFromFarmer(connectionId);
            return new ApiResponse<>(true, "Successfully disconnected from farmer", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error disconnecting: " + e.getMessage(), null);
        }
    }

    /**
     * Send message to a farmer
     */
    @PostMapping("/messages")
    public ApiResponse<Void> sendMessage(@RequestBody Map<String, String> payload) {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            Long farmerId = Long.parseLong(payload.get("farmerId"));
            String message = payload.get("message");
            buyerService.sendMessageToFarmer(buyerEmail, farmerId, message);
            return new ApiResponse<>(true, "Message sent successfully", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error sending message: " + e.getMessage(), null);
        }
    }

    /**
     * Get conversation history with a farmer
     */
    @GetMapping("/messages/{farmerId}")
    public ApiResponse<List<Map<String, Object>>> getConversationHistory(@PathVariable Long farmerId) {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            List<Map<String, Object>> messages = buyerService.getConversationHistory(buyerEmail, farmerId);
            return new ApiResponse<>(true, "Conversation history retrieved", messages);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching messages: " + e.getMessage(), null);
        }
    }

    /**
     * Rate a farmer
     */
    @PostMapping("/rate-farmer/{farmerId}")
    public ApiResponse<Void> rateFarmer(
            @PathVariable Long farmerId,
            @RequestBody Map<String, Object> payload) {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            Double rating = Double.parseDouble(payload.get("rating").toString());
            String review = (String) payload.get("review");
            buyerService.rateFarmer(buyerEmail, farmerId, rating, review);
            return new ApiResponse<>(true, "Farmer rated successfully", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error rating farmer: " + e.getMessage(), null);
        }
    }

    /**
     * Get buyer's profile
     */
    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getBuyerProfile() {
        try {
            String buyerEmail = resolveBuyerEmail(SecurityContextHolder.getContext().getAuthentication());
            if (buyerEmail == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            Map<String, Object> profile = buyerService.getBuyerProfile(buyerEmail);
            return new ApiResponse<>(true, "Buyer profile retrieved", profile);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching profile: " + e.getMessage(), null);
        }
    }

    /**
     * Get current logged-in buyer's data
     */
    @GetMapping("/me")
    public ApiResponse<User> getCurrentBuyer(Authentication authentication) {
        try {
            String email = resolveBuyerEmail(authentication);
            if (email == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            User buyer = buyerService.getCurrentBuyer(email);
            return new ApiResponse<>(true, "Buyer data retrieved", buyer);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error fetching buyer: " + e.getMessage(), null);
        }
    }

    /**
     * Update current buyer's profile
     */
    @PutMapping("/me")
    public ApiResponse<User> updateCurrentBuyer(Authentication authentication, @RequestBody User buyerData) {
        try {
            String email = resolveBuyerEmail(authentication);
            if (email == null) {
                return new ApiResponse<>(false, "Unauthorized", null);
            }
            User updatedBuyer = buyerService.updateCurrentBuyer(email, buyerData);
            return new ApiResponse<>(true, "Buyer updated successfully", updatedBuyer);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error updating buyer: " + e.getMessage(), null);
        }
    }
}
