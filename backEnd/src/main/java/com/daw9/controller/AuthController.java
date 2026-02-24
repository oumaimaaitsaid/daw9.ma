package com.daw9.controller;

import com.daw9.dto.*;
import com.daw9.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints pour l'inscription et la connexion")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Connexion utilisateur", description = "Permet de s'authentifier et de recevoir un token JWT")
    @ApiResponse(responseCode = "200", description = "Authentification réussie")
    @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @Operation(summary = "Inscription Client", description = "Crée un nouveau profil client")
    @ApiResponse(responseCode = "200", description = "Inscription réussie")
    @ApiResponse(responseCode = "400", description = "Données invalides ou email déjà utilisé")
    @PostMapping("/register/client")
    public ResponseEntity<AuthResponse> registerClient(@Valid @RequestBody RegisterClientRequest req) {
        return ResponseEntity.ok(authService.registerClient(req));
    }
}
