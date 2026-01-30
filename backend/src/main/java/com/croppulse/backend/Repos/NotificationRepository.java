package com.croppulse.backend.Repos;

import com.croppulse.backend.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdAndUserTypeOrderByCreatedAtDesc(Long userId, String userType);
    
    List<Notification> findByUserIdAndUserTypeAndIsReadOrderByCreatedAtDesc(Long userId, String userType, Boolean isRead);
    
    Long countByUserIdAndUserTypeAndIsRead(Long userId, String userType, Boolean isRead);
    
    List<Notification> findByIsReadAndEmailSentAndCreatedAtBefore(Boolean isRead, Boolean emailSent, LocalDateTime createdBefore);
}
