package com.daw9.security;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;
import io.jsonwebtoken.Claims;

public interface TokenService {
    String extractUsername(String token);
    String extractRole(String token);
    Date extractExpiration(String token);
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
    String generateToken(UserDetails userDetails, String role);
    Boolean validateToken(String token, UserDetails userDetails);
}
