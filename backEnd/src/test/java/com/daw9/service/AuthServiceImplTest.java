package com.daw9.service;

import com.daw9.dto.AuthRequest;
import com.daw9.dto.AuthResponse;
import com.daw9.dto.RegisterClientRequest;
import com.daw9.model.Client;
import com.daw9.model.User;
import com.daw9.model.enums.Role;
import com.daw9.repository.ClientRepository;
import com.daw9.repository.UserRepository;
import com.daw9.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ClientRepository clientRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private TokenService tokenService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setRole(Role.CLIENT);
        testUser.setNom("John");
        testUser.setPrenom("Doe");
    }

    @Test
    void testLoginSuccess() {
        AuthRequest req = new AuthRequest();
        req.setEmail("test@example.com");
        req.setPassword("password");
        UserDetails userDetails = mock(UserDetails.class);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(tokenService.generateToken(userDetails, "CLIENT")).thenReturn("mock-token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        assertEquals("CLIENT", response.getRole());
        assertEquals("test@example.com", response.getEmail());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testRegisterClientSuccess() {
        RegisterClientRequest req = new RegisterClientRequest();
        req.setEmail("new@example.com");
        req.setPassword("password");
        req.setNom("Alice");
        req.setPrenom("Smith");

        UserDetails userDetails = mock(UserDetails.class);

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(userDetailsService.loadUserByUsername("new@example.com")).thenReturn(userDetails);
        when(tokenService.generateToken(userDetails, "CLIENT")).thenReturn("new-token");

        AuthResponse response = authService.registerClient(req);

        assertNotNull(response);
        assertEquals("new-token", response.getToken());
        verify(clientRepository).save(any(Client.class));
    }

    @Test
    void testRegisterClientEmailAlreadyExists() {
        RegisterClientRequest req = new RegisterClientRequest();
        req.setEmail("exists@example.com");

        when(userRepository.existsByEmail("exists@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.registerClient(req));
        verify(clientRepository, never()).save(any());
    }
}
