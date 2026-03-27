package com.daw9.controller;

import com.daw9.model.Notification;
import com.daw9.repository.NotificationRepository;
import com.daw9.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(notificationRepository.countByUserIdAndIsReadFalse(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable("userId") Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findTop10ByOrderByCreatedAtDesc());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable("id") Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}/clear")
    @Transactional
    public ResponseEntity<Void> clearAllUserNotifications(@PathVariable("userId") Long userId) {
        notificationRepository.deleteByUserId(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long id) {
        try {
            if (notificationRepository.existsById(id)) {
                notificationRepository.deleteById(id);
                log.info("Notification {} supprimée", id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}