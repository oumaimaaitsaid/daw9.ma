package com.daw9.dto;

import com.daw9.model.Client;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ClientProfileDTO(
    Long id,
    String email,
    String nom,
    String prenom,
    String phone,
    String ville,
    BigDecimal budget,
    LocalDate dateMarriage,
    Integer nombreInvites,
    boolean active
) {
    public static ClientProfileDTO fromEntity(Client client) {
        return new ClientProfileDTO(
            client.getId(),
            client.getEmail(),
            client.getNom(),
            client.getPrenom(),
            client.getPhone(),
            client.getVille(),
            client.getBudget(),
            client.getDateMarriage(),
            client.getReservations().stream().findFirst().map(r -> r.getNombreInvites()).orElse(null), // Actually usually we'd have this in the profile
            client.isActive()
        );
    }
}
