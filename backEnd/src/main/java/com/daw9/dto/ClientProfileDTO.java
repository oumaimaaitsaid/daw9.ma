package com.daw9.dto;

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
}
