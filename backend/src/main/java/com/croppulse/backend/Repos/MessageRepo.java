package com.croppulse.backend.Repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.croppulse.backend.Model.Message;
import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {
    
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    
    List<Message> findByRecipientIdAndRecipientTypeOrderByTimestampDesc(Long recipientId, String recipientType);
    
    List<Message> findBySenderIdAndSenderTypeAndRecipientIdAndRecipientTypeOrderByTimestampDesc(
            Long senderId, String senderType, Long recipientId, String recipientType);
}
