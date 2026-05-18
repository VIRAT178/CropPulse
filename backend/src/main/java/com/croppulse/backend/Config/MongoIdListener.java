package com.croppulse.backend.Config;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Model.Message;
import com.croppulse.backend.Model.Notification;
import com.croppulse.backend.Model.Recommendation;
import com.croppulse.backend.Model.User;
import com.croppulse.backend.Service.SequenceGeneratorService;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;

@Component
public class MongoIdListener extends AbstractMongoEventListener<Object> {

    private final SequenceGeneratorService sequenceGeneratorService;

    public MongoIdListener(SequenceGeneratorService sequenceGeneratorService) {
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object source = event.getSource();

        if (source instanceof User user && user.getId() == null) {
            user.setId(sequenceGeneratorService.generateSequence(User.SEQUENCE_NAME));
        } else if (source instanceof Farmer farmer && farmer.getId() == null) {
            farmer.setId(sequenceGeneratorService.generateSequence(Farmer.SEQUENCE_NAME));
        } else if (source instanceof Message message && message.getId() == null) {
            message.setId(sequenceGeneratorService.generateSequence(Message.SEQUENCE_NAME));
        } else if (source instanceof Notification notification && notification.getId() == null) {
            notification.setId(sequenceGeneratorService.generateSequence(Notification.SEQUENCE_NAME));
        } else if (source instanceof Recommendation recommendation && recommendation.getId() == null) {
            recommendation.setId(sequenceGeneratorService.generateSequence(Recommendation.SEQUENCE_NAME));
        }
    }
}