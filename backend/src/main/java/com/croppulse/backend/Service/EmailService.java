package com.croppulse.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.croppulse.backend.Model.User;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationEmail(User user) {
        String subject = "Welcome to CropPulse";
        String text = "Hi " + safe(user.getName()) + ",\n\n" +
                "Your account has been successfully registered with email: " + safe(user.getEmail()) + ".\n" +
                "We're excited to have you on board!\n\n" +
                "- CropPulse Team";
        send(user.getEmail(), subject, text);
    }

    public void sendLoginEmail(User user) {
        String subject = "Login Notification";
        String text = "Hi " + safe(user.getName()) + ",\n\n" +
                "A login to your CropPulse account was just detected.\n" +
                "If this wasn't you, please reset your password immediately.\n\n" +
                "- CropPulse Security";
        send(user.getEmail(), subject, text);
    }

    public void sendPasswordResetEmail(User user, String resetUrl) {
        String subject = "Reset Your Password";
        String text = "Hi " + safe(user.getName()) + ",\n\n" +
                "We received a request to reset your password.\n" +
                "Use the link below to set a new password (valid for 1 hour):\n" +
                resetUrl + "\n\n" +
                "If you didn't request this, you can safely ignore this email.\n\n" +
                "- CropPulse Security";
        send(user.getEmail(), subject, text);
    }

    public void sendRecommendationEmail(String farmerEmail, String farmerName, String recommendedCrop, 
                                         Double expectedPrice, String riskLevel, Double confidenceScore) {
        String subject = "Your AI Crop Recommendation from CropPulse 🌾";
        String text = "Hi " + safe(farmerName) + ",\n\n" +
                "Here's your personalized AI-powered crop recommendation:\n\n" +
                "📌 Recommended Crop: " + safe(recommendedCrop) + "\n" +
                "💰 Expected Price: ₹" + (expectedPrice != null ? String.format("%.2f", expectedPrice) : "N/A") + " per quintal\n" +
                "⚠️ Risk Level: " + safe(riskLevel) + "\n" +
                "📊 Confidence Score: " + (confidenceScore != null ? String.format("%.0f%%", confidenceScore * 100) : "N/A") + "\n\n" +
                "This recommendation is based on your soil type, location, and current market trends.\n" +
                "Visit your CropPulse dashboard for more detailed insights and market analysis.\n\n" +
                "Happy Farming!\n" +
                "- CropPulse AI Team";
        send(farmerEmail, subject, text);
    }

    public void sendProfileUpdateEmail(String farmerEmail, String farmerName, String village, 
                                       String state, String soilType, Double landSize) {
        String subject = "Profile Updated Successfully - CropPulse";
        String text = "Hi " + safe(farmerName) + ",\n\n" +
                "Your CropPulse profile has been successfully updated.\n\n" +
                "📋 Updated Profile Information:\n" +
                "👤 Name: " + safe(farmerName) + "\n" +
                "🏘️ Village: " + safe(village) + "\n" +
                "📍 State: " + safe(state) + "\n" +
                "🪨 Soil Type: " + safe(soilType) + "\n" +
                "🌾 Land Size: " + (landSize != null ? landSize + " acres" : "N/A") + "\n\n" +
                "These updated details will be used for generating your future crop recommendations.\n" +
                "You can now generate a new recommendation based on your updated profile.\n\n" +
                "If you didn't make these changes, please contact support immediately.\n\n" +
                "- CropPulse Team";
        send(farmerEmail, subject, text);
    }

    private void send(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
        }
    }

    private String safe(String s) { return s == null ? "" : s; }
}
