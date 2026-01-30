package com.croppulse.backend.Model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id")
    private String conversationId;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "sender_type")
    private String senderType; // "FARMER" or "BUYER"

    @Column(name = "recipient_id")
    private Long recipientId;

    @Column(name = "recipient_type")
    private String recipientType; // "FARMER" or "BUYER"

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "timestamp")
    private Instant timestamp;

    @Column(name = "is_read")
    private Boolean isRead = false;

    public Message() {}

    public Message(String conversationId, Long senderId, String senderType, Long recipientId, String recipientType, String content, Instant timestamp) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.recipientId = recipientId;
        this.recipientType = recipientType;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(String recipientType) {
        this.recipientType = recipientType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
