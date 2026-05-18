package com.croppulse.backend.Repos;

import com.croppulse.backend.Model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepo extends MongoRepository<Message, Long> {
    
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    
    List<Message> findByRecipientIdAndRecipientTypeOrderByTimestampDesc(Long recipientId, String recipientType);
    
    List<Message> findBySenderIdAndSenderTypeAndRecipientIdAndRecipientTypeOrderByTimestampDesc(
            Long senderId, String senderType, Long recipientId, String recipientType);
}
