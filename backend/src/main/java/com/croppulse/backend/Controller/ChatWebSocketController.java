package com.croppulse.backend.Controller;

import java.time.Instant;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.Message;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.Repos.MessageRepo;
import com.croppulse.backend.Repos.UserRepository;
import com.croppulse.backend.Service.NotificationService;
import com.croppulse.backend.dto.ChatMessageDTO;
import com.croppulse.backend.dto.TypingEventDTO;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final FarmerRepo farmerRepo;
    private final UserRepository userRepository;
    private final MessageRepo messageRepo;

    public ChatWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            NotificationService notificationService,
            FarmerRepo farmerRepo,
            UserRepository userRepository,
            MessageRepo messageRepo) {
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.farmerRepo = farmerRepo;
        this.userRepository = userRepository;
        this.messageRepo = messageRepo;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDTO message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(Instant.now());
        }
        
        // Save message to database
        try {
            Message dbMessage = new Message(
                    message.getConversationId(),
                    message.getSenderId(),
                    message.getSenderType(),
                    message.getRecipientId(),
                    message.getRecipientType(),
                    message.getContent(),
                    message.getTimestamp()
            );
            messageRepo.save(dbMessage);
        } catch (Exception e) {
            // Log but don't fail message delivery
        }
        
        String destination = "/topic/conversation/" + message.getConversationId();
        messagingTemplate.convertAndSend(destination, message);

        try {
            if (message.getRecipientId() != null && message.getSenderId() != null) {
                String senderType = message.getSenderType() != null ? message.getSenderType().toUpperCase() : "";
                String recipientType = message.getRecipientType() != null ? message.getRecipientType().toUpperCase() : "";

                if ("BUYER".equals(senderType) && "FARMER".equals(recipientType)) {
                    String buyerName = userRepository.findById(message.getSenderId())
                            .map(User::getName)
                            .orElse("Buyer");
                    notificationService.notifyFarmerOfNewMessage(message.getRecipientId(), buyerName, message.getContent());
                } else if ("FARMER".equals(senderType) && "BUYER".equals(recipientType)) {
                    String farmerName = farmerRepo.findById(message.getSenderId())
                            .map(Farmer::getName)
                            .orElse("Farmer");
                    notificationService.notifyBuyerOfNewMessage(message.getRecipientId(), farmerName, message.getContent());
                }
            }
        } catch (Exception e) {
        }
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingEventDTO typingEvent) {
        if (typingEvent.getConversationId() == null) {
            return;
        }
        String destination = "/topic/conversation/" + typingEvent.getConversationId() + "/typing";
        messagingTemplate.convertAndSend(destination, typingEvent);
    }
}
