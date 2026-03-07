package com.daw9.service;

import com.daw9.model.Notification;
import com.daw9.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Notification> getNotificationsByUserId(Long userId) {
        // 💡 Calli l-method li m-creya f Repository
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void sendNotification(Long userId, Notification notification) {
        Notification saved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, saved);
    }
}