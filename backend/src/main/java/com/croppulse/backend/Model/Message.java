package com.croppulse.backend.Model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "messages")
public class Message {

    public static final String SEQUENCE_NAME = "messages_sequence";

    @Id
    private Long id;

    @Field("conversationId")
    private String conversationId;

    @Field("senderId")
    private Long senderId;

    @Field("senderType")
    private String senderType; // "FARMER" or "BUYER"

    @Field("recipientId")
    private Long recipientId;

    @Field("recipientType")
    private String recipientType; // "FARMER" or "BUYER"

    @Field("content")
    private String content;

    @Field("timestamp")
    private Instant timestamp;

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
