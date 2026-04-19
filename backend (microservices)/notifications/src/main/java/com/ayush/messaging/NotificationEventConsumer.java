package com.ayush.messaging;

import com.ayush.modal.Notification;
import com.ayush.payload.dto.BookingDTO;
import com.ayush.payload.dto.NotificationDTO;
import com.ayush.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = "notification-queue")
    public void sentBookingUpdateEvent(Notification notification){
        notificationService.createNotification(notification);
    }

}
