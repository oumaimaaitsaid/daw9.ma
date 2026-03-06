package com.daw9.model;

import com.daw9.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String titre;

    @Column(length = 500)
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();


    public static Notification createForClient(User user, NotificationType type, String titre, String message) {
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setType(type);
        notif.setTitre(titre);
        notif.setMessage(message);
        return notif;
    }
}
