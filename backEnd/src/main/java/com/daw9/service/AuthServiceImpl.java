package com.daw9.service;

import com.daw9.dto.*;
import com.daw9.model.Client;
import com.daw9.model.User;
import com.daw9.model.enums.Role;
import com.daw9.repository.ClientRepository;
import com.daw9.repository.UserRepository;
import com.daw9.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = tokenService.generateToken(userDetails, user.getRole().name());

        log.info("Login réussi pour: {}", req.getEmail());

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getEmail(),
                user.getNom(),
                user.getPrenom()
        );
    }

    @Override
    public AuthResponse registerClient(RegisterClientRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Client client = new Client();
        client.setEmail(req.getEmail());
        client.setPassword(passwordEncoder.encode(req.getPassword()));
        client.setNom(req.getNom());
        client.setPrenom(req.getPrenom());
        client.setPhone(req.getPhone());
        client.setVille(req.getVille());
        client.setBudget(req.getBudget());
        client.setDateMarriage(req.getDateMarriage());
        client.setRole(Role.CLIENT);

        clientRepository.save(client);

        log.info("Nouveau client inscrit: {}", req.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = tokenService.generateToken(userDetails, Role.CLIENT.name());

        return new AuthResponse(
                token,
                Role.CLIENT.name(),
                client.getId(),
                client.getEmail(),
                client.getNom(),
                client.getPrenom()
        );
    }
}
