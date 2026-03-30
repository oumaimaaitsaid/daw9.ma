package com.daw9.service;

import com.daw9.model.Notification;
import com.daw9.model.User;
import com.daw9.model.enums.NotificationType;
import com.daw9.repository.NotificationRepository;
import com.daw9.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final com.daw9.mapper.NotificationMapper notificationMapper;

    @PostConstruct
    public void init() {
        try {
            log.info(" Synchronisation de la base de données : suppression des contraintes Enums obsolètes...");
            notificationRepository.dropTypeConstraint();
            log.info(" Contraintes synchronisées.");
        } catch (Exception e) {
            log.warn("ℹLa synchronisation automatique a échoué (PostgreSQL constraint or unique violation).");
        }
    }

    public java.util.List<com.daw9.dto.NotificationDTO> getNotificationsByUserId(Long userId) {
        return notificationMapper.toDTOList(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @Transactional
    public void createNotification(String titre, String message, Long userId, NotificationType type) {
        log.info(" Tentative de création de notification: '{}' pour l'utilisateur ID: {}", titre,
                userId != null ? userId : 1);

        User user = (userId == null) ? userRepository.findById(1L).orElse(null)
                : userRepository.findById(userId).orElse(null);

        if (user == null) {
            log.warn(" Notification annulée : Utilisateur ID {} introuvable en base.", userId != null ? userId : 1);
            return;
        }

        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitre(titre != null ? titre : "Notification");
        notif.setMessage(message != null ? message : "");
        notif.setType(type != null ? type : NotificationType.STATUS_CHANGE);
        notif.setIsRead(false);
        notif.setCreatedAt(java.time.LocalDateTime.now());

        try {
            Notification saved = notificationRepository.save(notif);
            log.info(" Notification enregistrée avec succès (ID: {})", saved.getId());
            messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), saved);
        } catch (Exception e) {
            log.error("ERREUR SQL CRITIQUE lors de la sauvegarde de la notification: {}", e.getMessage());

            throw e;
        }
    }

    @Transactional
    public void sendNotification(Long userId, Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(java.time.LocalDateTime.now());
        }
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
    }
}