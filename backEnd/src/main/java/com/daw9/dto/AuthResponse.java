package com.daw9.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private String nom;
    private String prenom;
    private boolean active;
}
