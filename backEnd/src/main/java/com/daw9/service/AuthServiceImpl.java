package com.daw9.service;

import com.daw9.dto.*;
import com.daw9.model.Client;
import com.daw9.model.User;
import com.daw9.model.enums.Role;
import com.daw9.mapper.UserMapper;
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
import org.springframework.security.authentication.BadCredentialsException;

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
    private final UserMapper userMapper;

    @Override
    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = tokenService.generateToken(userDetails, user.getRole().name());

        AuthResponse response = userMapper.toAuthResponse(user);
        response.setToken(token);

        log.info("Login réussi pour: {}", req.getEmail());
        return response;
    }

    @Override
    public AuthResponse registerClient(RegisterClientRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Client client = userMapper.toEntity(req);
        client.setPassword(passwordEncoder.encode(req.getPassword()));

        clientRepository.save(client);

        log.info("Nouveau client inscrit: {}", req.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = tokenService.generateToken(userDetails, Role.CLIENT.name());

        AuthResponse response = userMapper.toAuthResponse(client);
        response.setToken(token);

        return response;
    }
}
