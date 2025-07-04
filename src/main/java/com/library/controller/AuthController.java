package com.library.controller;

import com.library.dto.JwtResponse;
import com.library.dto.LoginRequest;
import com.library.dto.SignupRequest;
import com.library.service.AuthService;
import com.library.model.User;
import com.library.model.Member;
import com.library.repository.UserRepository;
import com.library.repository.MemberRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            String message = authService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/setup-admin")
    @Transactional
    public ResponseEntity<?> setupInitialAdmin(@Valid @RequestBody AdminSetupRequest request) {
        try {
            // Check if any admin already exists
            boolean adminExists = userRepository.existsByRole(User.Role.ADMIN);
            if (adminExists) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Admin user already exists. Use regular admin creation."));
            }

            // Create admin user
            User adminUser = new User(
                    request.getUsername(),
                    passwordEncoder.encode(request.getPassword()),
                    User.Role.ADMIN
            );

            User savedUser = userRepository.save(adminUser);

            // Create admin member profile
            Member adminMember = new Member(
                    savedUser,
                    request.getFullName(),
                    request.getEmail()
            );
            memberRepository.save(adminMember);

            return ResponseEntity.ok(new MessageResponse("Admin user created successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating admin: " + e.getMessage()));
        }
    }

    // Inner class for response messages
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Inner class for admin setup request
    public static class AdminSetupRequest {
        @NotBlank
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank
        @Size(min = 6, max = 100)
        private String password;

        @NotBlank
        @Size(max = 100)
        private String fullName;

        @NotBlank
        @Size(max = 100)
        private String email;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
