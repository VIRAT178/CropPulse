package com.croppulse.backend.Repos;

import com.croppulse.backend.Model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, Long> {
    
    List<Notification> findByUserIdAndUserTypeOrderByCreatedAtDesc(Long userId, String userType);
    
    List<Notification> findByUserIdAndUserTypeAndIsReadOrderByCreatedAtDesc(Long userId, String userType, Boolean isRead);
    
    Long countByUserIdAndUserTypeAndIsRead(Long userId, String userType, Boolean isRead);
    
    List<Notification> findByIsReadAndEmailSentAndCreatedAtBefore(Boolean isRead, Boolean emailSent, LocalDateTime createdBefore);
}
