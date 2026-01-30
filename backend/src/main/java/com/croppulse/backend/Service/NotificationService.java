package com.croppulse.backend.Service;

import com.croppulse.backend.Model.Notification;
import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Repos.NotificationRepository;
import com.croppulse.backend.Repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FarmerRepo farmerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Create a new notification for a user
     */
    @Transactional
    public Notification createNotification(Long userId, String userType, String type, String message, String senderName, Long relatedMessageId) {
        Notification notification = new Notification(userId, userType, type, message);
        notification.setSenderName(senderName);
        notification.setRelatedMessageId(relatedMessageId);
        return notificationRepository.save(notification);
    }

    /**
     * Create notification when a farmer receives a message from a buyer
     */
    @Transactional
    public Notification notifyFarmerOfNewMessage(Long farmerId, String buyerName, String messagePreview) {
        String message = String.format("New message from %s: %s", buyerName, 
            messagePreview.length() > 50 ? messagePreview.substring(0, 50) + "..." : messagePreview);
        return createNotification(farmerId, "FARMER", "MESSAGE", message, buyerName, null);
    }

    /**
     * Create notification when a buyer receives a message from a farmer
     */
    @Transactional
    public Notification notifyBuyerOfNewMessage(Long buyerId, String farmerName, String messagePreview) {
        String message = String.format("New message from %s: %s", farmerName, 
            messagePreview.length() > 50 ? messagePreview.substring(0, 50) + "..." : messagePreview);
        return createNotification(buyerId, "BUYER", "MESSAGE", message, farmerName, null);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId, String userType) {
        return notificationRepository.findByUserIdAndUserTypeOrderByCreatedAtDesc(userId, userType);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId, String userType) {
        return notificationRepository.findByUserIdAndUserTypeAndIsReadOrderByCreatedAtDesc(userId, userType, false);
    }

    /**
     * Get unread notification count for a user
     */
    public Long getUnreadCount(Long userId, String userType) {
        return notificationRepository.countByUserIdAndUserTypeAndIsRead(userId, userType, false);
    }

    /**
     * Mark notification as read and delete it
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.deleteById(notificationId);
        });
    }

    /**
     * Mark all notifications as read for a user and delete them
     */
    @Transactional
    public void markAllAsRead(Long userId, String userType) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId, userType);
        notificationRepository.deleteAll(unreadNotifications);
    }

    /**
     * Delete a specific notification
     */
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Send email notification
     */
    private void sendEmailNotification(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@croppulse.com");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    /**
     * Scheduled task to send email for unread notifications older than 1 hour
     * Runs every 15 minutes
     */
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    @Transactional
    public void sendEmailForOldUnreadNotifications() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Notification> oldUnreadNotifications = notificationRepository
            .findByIsReadAndEmailSentAndCreatedAtBefore(false, false, oneHourAgo);

        for (Notification notification : oldUnreadNotifications) {
            try {
                String userEmail = getUserEmail(notification.getUserId(), notification.getUserType());
                if (userEmail != null && !userEmail.isEmpty()) {
                    String subject = "CropPulse - You have unread notifications";
                    String body = String.format(
                        "Hello,\n\n" +
                        "You have an unread notification from CropPulse:\n\n" +
                        "%s\n\n" +
                        "Please log in to view your notifications and messages.\n\n" +
                        "Best regards,\n" +
                        "CropPulse Team\n\n" +
                        "This is an automated message, please do not reply.",
                        notification.getMessage()
                    );

                    sendEmailNotification(userEmail, subject, body);
                    notification.setEmailSent(true);
                    notificationRepository.save(notification);
                }
            } catch (Exception e) {
                System.err.println("Error processing notification " + notification.getId() + ": " + e.getMessage());
            }
        }

        if (!oldUnreadNotifications.isEmpty()) {
            System.out.println("Sent " + oldUnreadNotifications.size() + " email notifications for unread messages");
        }
    }

    /**
     * Get user email based on userId and userType
     */
    private String getUserEmail(Long userId, String userType) {
        if ("FARMER".equals(userType)) {
            return farmerRepository.findById(userId)
                .map(Farmer::getEmail)
                .orElse(null);
        }
        if ("BUYER".equals(userType)) {
            return userRepository.findById(userId)
                .map(User::getEmail)
                .orElse(null);
        }
        return null;
    }

    /**
     * Delete old read notifications (cleanup - optional)
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
    @Transactional
    public void cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Notification> oldNotifications = notificationRepository
            .findByIsReadAndEmailSentAndCreatedAtBefore(true, true, thirtyDaysAgo);
        
        if (!oldNotifications.isEmpty()) {
            notificationRepository.deleteAll(oldNotifications);
            System.out.println("Cleaned up " + oldNotifications.size() + " old notifications");
        }
    }
}
