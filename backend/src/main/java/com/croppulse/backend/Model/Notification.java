package com.croppulse.backend.Model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "notifications")
public class Notification {

    public static final String SEQUENCE_NAME = "notifications_sequence";

    @Id
    private Long id;

    @Field("userId")
    private Long userId;

    @Field("userType")
    private String userType; // FARMER or BUYER

    @Field("type")
    private String type; // MESSAGE, RECOMMENDATION, SYSTEM

    @Field("message")
    private String message;

    private Boolean isRead = false;

    private Boolean emailSent = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime readAt;

    private LocalDateTime emailSentAt;

    @Field("relatedMessageId")
    private Long relatedMessageId; // If related to a chat message

    @Field("senderName")
    private String senderName; // Name of the message sender

    // Constructors
    public Notification() {}

    public Notification(Long userId, String userType, String type, String message) {
        this.userId = userId;
        this.userType = userType;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.emailSent = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
        if (isRead && this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }

    public Boolean getEmailSent() {
        return emailSent;
    }

    public void setEmailSent(Boolean emailSent) {
        this.emailSent = emailSent;
        if (emailSent && this.emailSentAt == null) {
            this.emailSentAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public LocalDateTime getEmailSentAt() {
        return emailSentAt;
    }

    public void setEmailSentAt(LocalDateTime emailSentAt) {
        this.emailSentAt = emailSentAt;
    }

    public Long getRelatedMessageId() {
        return relatedMessageId;
    }

    public void setRelatedMessageId(Long relatedMessageId) {
        this.relatedMessageId = relatedMessageId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}
