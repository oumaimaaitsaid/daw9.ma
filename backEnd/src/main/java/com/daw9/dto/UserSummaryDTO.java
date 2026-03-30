package com.daw9.dto;

public record UserSummaryDTO(
    Long id,
    String prenom,
    String nom,
    String email
) {}
