package com.daw9.dto;

import java.time.LocalDateTime;

public record NotificationDTO(
    Long id,
    String titre,
    String message,
    String type,
    boolean isRead,
    LocalDateTime createdAt
) {}
