package com.croppulse.backend.Service;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Model.UserRole;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Repos.UserRepository;
import com.croppulse.backend.dto.CropAvailabilityDTO;
import com.croppulse.backend.dto.FarmerConnectionDTO;
import com.croppulse.backend.dto.MarketTrendDTO;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BuyerService {

    private final FarmerRepo farmerRepo;
    private final UserRepository userRepository;

    // In-memory storage for connections, messages, and ratings
    private Map<String, List<FarmerConnectionDTO>> buyerConnections = new HashMap<>();
    private Map<String, List<Map<String, Object>>> messages = new HashMap<>();
    private Map<Long, Map<String, Object>> farmerRatings = new HashMap<>();

    public BuyerService(FarmerRepo farmerRepo, UserRepository userRepository) {
        this.farmerRepo = farmerRepo;
        this.userRepository = userRepository;
    }

    /**
     * Get all buyers
     */
    public List<Map<String, Object>> getAllBuyers() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(user -> user.getRole() == UserRole.BUYER)
                .map(user -> {
                    Map<String, Object> buyerMap = new HashMap<>();
                    buyerMap.put("id", user.getId());
                    buyerMap.put("name", user.getName());
                    buyerMap.put("email", user.getEmail());
                    buyerMap.put("mobile", user.getMobile());
                    buyerMap.put("state", user.getState());
                    buyerMap.put("company", user.getCompany());
                    buyerMap.put("interestedCrops", user.getInterestedCrops());
                    return buyerMap;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get available crops from all farmers
     */
    public List<CropAvailabilityDTO> getAvailableCrops(String filter) {
        List<Farmer> farmers = farmerRepo.findAll();
        List<CropAvailabilityDTO> crops = new ArrayList<>();

        for (Farmer farmer : farmers) {
            // Mock crop data - in production, this would come from a Crop entity
            CropAvailabilityDTO crop1 = new CropAvailabilityDTO();
            crop1.setId(farmer.getId() * 100 + 1);
            crop1.setName("Wheat");
            crop1.setFarmerName(farmer.getName());
            crop1.setQuantity(500.0 + (Math.random() * 500));
            crop1.setPricePerKg(25.0 + Math.random() * 10);
            crop1.setVillage(farmer.getVillage());
            crop1.setState(farmer.getState());
            crop1.setQuality(getRandomQuality());
            crop1.setHarvestDate("2025-02-" + (15 + (int)(Math.random() * 10)));
            crop1.setCertification("Organic");
            crop1.setDescription("High-quality wheat from certified organic farm");

            CropAvailabilityDTO crop2 = new CropAvailabilityDTO();
            crop2.setId(farmer.getId() * 100 + 2);
            crop2.setName("Rice");
            crop2.setFarmerName(farmer.getName());
            crop2.setQuantity(300.0 + (Math.random() * 400));
            crop2.setPricePerKg(30.0 + Math.random() * 12);
            crop2.setVillage(farmer.getVillage());
            crop2.setState(farmer.getState());
            crop2.setQuality(getRandomQuality());
            crop2.setHarvestDate("2025-02-" + (10 + (int)(Math.random() * 15)));
            crop2.setCertification("Non-organic");
            crop2.setDescription("Premium quality rice with excellent taste");

            crops.add(crop1);
            crops.add(crop2);
        }

        // Apply filter
        if ("high".equals(filter)) {
            return crops.stream().filter(c -> c.getQuantity() > 300).collect(Collectors.toList());
        } else if ("low".equals(filter)) {
            return crops.stream().filter(c -> c.getQuantity() <= 300).collect(Collectors.toList());
        }

        return crops;
    }

    /**
     * Get market trends
     */
    public List<MarketTrendDTO> getMarketTrends(int timeRangeInDays) {
        List<MarketTrendDTO> trends = new ArrayList<>();

        // Mock market trend data
        String[] crops = {"Wheat", "Rice", "Corn", "Potato", "Tomato"};
        double[] basePrice = {25, 30, 18, 12, 8};

        for (int i = 0; i < crops.length; i++) {
            MarketTrendDTO trend = new MarketTrendDTO();
            trend.setCropId((long)(i + 1));
            trend.setCropName(crops[i]);
            trend.setCurrentPrice(basePrice[i] + (Math.random() * 5));
            trend.setMinPrice(basePrice[i] - 3);
            trend.setMaxPrice(basePrice[i] + 8);
            trend.setPercentageChange(-5 + (Math.random() * 15)); // -5% to +10%
            trend.setSupplyStatus(getRandomStatus());
            trend.setDemandStatus(getRandomStatus());
            trend.setAvgVolume(100.0 + Math.random() * 900);
            trend.setVolatility(2.0 + Math.random() * 10);
            trend.setSentiment(getRandomSentiment());
            trend.setAnalysis("Market shows " + (trend.getPercentageChange() > 0 ? "positive" : "negative") + 
                    " trend. Supply is " + trend.getSupplyStatus() + " while demand is " + trend.getDemandStatus());

            trends.add(trend);
        }

        return trends;
    }

    /**
     * Get buyer's connections with farmers
     */
    public List<FarmerConnectionDTO> getBuyerConnections(String buyerEmail, String filter) {
        List<FarmerConnectionDTO> connections = buyerConnections.getOrDefault(buyerEmail, new ArrayList<>());

        // Mock connections if none exist
        if (connections.isEmpty()) {
            List<Farmer> farmers = farmerRepo.findAll().stream().limit(3).collect(Collectors.toList());
            for (Farmer farmer : farmers) {
                FarmerConnectionDTO connection = new FarmerConnectionDTO();
                connection.setId((long)(Math.random() * 1000));
                connection.setFarmerId(farmer.getId());
                connection.setFarmerName(farmer.getName());
                connection.setVillage(farmer.getVillage());
                connection.setState(farmer.getState());
                connection.setAddress(farmer.getVillage() + ", " + farmer.getState());
                connection.setStatus(Math.random() > 0.3 ? "ACTIVE" : "PENDING");
                connection.setRating(3.5 + Math.random() * 1.5);
                connection.setTransactionCount((int)(Math.random() * 20));
                connection.setSpecialtyCrops(Arrays.asList("Wheat", "Rice"));
                connection.setConnectionDate("2025-01-" + (1 + (int)(Math.random() * 28)));
                connection.setLastTransaction("2025-02-15");
                connections.add(connection);
            }
            buyerConnections.put(buyerEmail, connections);
        }

        // Apply filter
        if ("active".equals(filter)) {
            return connections.stream().filter(c -> "ACTIVE".equals(c.getStatus())).collect(Collectors.toList());
        } else if ("pending".equals(filter)) {
            return connections.stream().filter(c -> "PENDING".equals(c.getStatus())).collect(Collectors.toList());
        }

        return connections;
    }

    /**
     * Create a new connection with a farmer
     */
    public FarmerConnectionDTO createConnection(String buyerEmail, Long farmerId) {
        Farmer farmer = farmerRepo.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerConnectionDTO connection = new FarmerConnectionDTO();
        connection.setId((long)(Math.random() * 10000));
        connection.setFarmerId(farmer.getId());
        connection.setFarmerName(farmer.getName());
        connection.setVillage(farmer.getVillage());
        connection.setState(farmer.getState());
        connection.setAddress(farmer.getVillage() + ", " + farmer.getState());
        connection.setStatus("PENDING");
        connection.setRating(0.0);
        connection.setTransactionCount(0);
        connection.setConnectionDate(LocalDate.now().toString());

        List<FarmerConnectionDTO> connections = buyerConnections.getOrDefault(buyerEmail, new ArrayList<>());
        connections.add(connection);
        buyerConnections.put(buyerEmail, connections);

        return connection;
    }

    /**
     * Disconnect from a farmer
     */
    public void disconnectFromFarmer(Long connectionId) {
        for (List<FarmerConnectionDTO> connections : buyerConnections.values()) {
            connections.removeIf(c -> c.getId().equals(connectionId));
        }
    }

    /**
     * Send message to farmer
     */
    public void sendMessageToFarmer(String buyerEmail, Long farmerId, String messageText) {
        String key = buyerEmail + "_" + farmerId;
        List<Map<String, Object>> conversation = messages.getOrDefault(key, new ArrayList<>());

        Map<String, Object> message = new HashMap<>();
        message.put("sender", buyerEmail);
        message.put("text", messageText);
        message.put("timestamp", LocalDateTime.now().toString());
        message.put("read", false);

        conversation.add(message);
        messages.put(key, conversation);
    }

    /**
     * Get conversation history
     */
    public List<Map<String, Object>> getConversationHistory(String buyerEmail, Long farmerId) {
        String key = buyerEmail + "_" + farmerId;
        return messages.getOrDefault(key, new ArrayList<>());
    }

    /**
     * Rate a farmer
     */
    public void rateFarmer(String buyerEmail, Long farmerId, Double rating, String review) {
        Map<String, Object> ratingData = new HashMap<>();
        ratingData.put("buyerEmail", buyerEmail);
        ratingData.put("rating", rating);
        ratingData.put("review", review);
        ratingData.put("date", LocalDateTime.now().toString());

        farmerRatings.put(farmerId, ratingData);
    }

    /**
     * Get buyer's profile
     */
    public Map<String, Object> getBuyerProfile(String buyerEmail) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("email", buyerEmail);
        profile.put("totalConnections", buyerConnections.getOrDefault(buyerEmail, new ArrayList<>()).size());
        profile.put("totalOrders", (int)(Math.random() * 50));
        profile.put("totalSpent", (int)(Math.random() * 50000));
        profile.put("joinDate", "2024-01-15");
        profile.put("averageRating", 4.2 + Math.random() * 0.8);

        return profile;
    }

    /**
     * Get current buyer by email
     */
    public User getCurrentBuyer(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }

    /**
     * Update current buyer's profile
     */
    public User updateCurrentBuyer(String email, User buyerData) {
        User buyer = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Buyer not found"));
        
        // Update buyer fields
        if (buyerData.getName() != null) {
            buyer.setName(buyerData.getName());
        }
        if (buyerData.getMobile() != null) {
            buyer.setMobile(buyerData.getMobile());
        }
        if (buyerData.getState() != null) {
            buyer.setState(buyerData.getState());
        }
        if (buyerData.getCompany() != null) {
            buyer.setCompany(buyerData.getCompany());
        }
        if (buyerData.getInterestedCrops() != null) {
            buyer.setInterestedCrops(buyerData.getInterestedCrops());
        }
        
        return userRepository.save(buyer);
    }

    // Helper methods
    private String getRandomQuality() {
        String[] qualities = {"Premium", "Standard", "Economy"};
        return qualities[(int)(Math.random() * 3)];
    }

    private String getRandomStatus() {
        String[] statuses = {"High", "Medium", "Low"};
        return statuses[(int)(Math.random() * 3)];
    }

    private String getRandomSentiment() {
        String[] sentiments = {"Bullish", "Bearish", "Neutral"};
        return sentiments[(int)(Math.random() * 3)];
    }
}
