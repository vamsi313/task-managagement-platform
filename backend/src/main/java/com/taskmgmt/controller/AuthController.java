package com.taskmgmt.controller;

import com.taskmgmt.dto.ApiResponse;
import com.taskmgmt.dto.AuthResponse;
import com.taskmgmt.dto.LoginRequest;
import com.taskmgmt.dto.SignupRequest;
import com.taskmgmt.model.User;
import com.taskmgmt.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        User createdUser = authService.registerUser(signupRequest);
        return new ResponseEntity<>(
                new ApiResponse(true, "User registered successfully with email: " + createdUser.getEmail()),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        // Since JWT is stateless, the frontend clears the stored token
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }
}
