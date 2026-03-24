package com.daw9.repository;

import com.daw9.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Modifying
    @Transactional
    @Query(value = "ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check", nativeQuery = true)
    void dropTypeConstraint();

    @Modifying 
    @Transactional 
    void deleteByUserId(Long userId);

    @Modifying
    @Transactional
    void deleteById(Long id);
}