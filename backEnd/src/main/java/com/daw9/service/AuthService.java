package com.daw9.service;

import com.daw9.dto.AuthRequest;
import com.daw9.dto.AuthResponse;
import com.daw9.dto.RegisterClientRequest;

public interface AuthService {
    AuthResponse login(AuthRequest req);
    AuthResponse registerClient(RegisterClientRequest req);
}
