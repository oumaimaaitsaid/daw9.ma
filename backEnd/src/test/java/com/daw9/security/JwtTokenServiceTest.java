package com.daw9.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenServiceTest {

    private JwtTokenService jwtTokenService;
    private final String secret = "mysecretkeymysecretkeymysecretkeymysecretkeymysecretkey";
    private final Long expiration = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenService = new JwtTokenService();
        ReflectionTestUtils.setField(jwtTokenService, "secret", secret);
        ReflectionTestUtils.setField(jwtTokenService, "expiration", expiration);
    }

    @Test
    void testGenerateAndValidateToken() {
        UserDetails userDetails = new User("test@example.com", "password", new ArrayList<>());
        String token = jwtTokenService.generateToken(userDetails, "ROLE_CLIENT");

        assertNotNull(token);
        assertTrue(jwtTokenService.validateToken(token, userDetails));
        assertEquals("test@example.com", jwtTokenService.extractUsername(token));
        assertEquals("ROLE_CLIENT", jwtTokenService.extractRole(token));
    }

    @Test
    void testTokenExpiration() {
        UserDetails userDetails = new User("test@example.com", "password", new ArrayList<>());
        String token = jwtTokenService.generateToken(userDetails, "ROLE_CLIENT");
        
        Date expirationDate = jwtTokenService.extractExpiration(token);
        assertTrue(expirationDate.after(new Date()));
    }
}
