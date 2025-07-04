package com.library.service;

import com.library.dto.JwtResponse;
import com.library.dto.LoginRequest;
import com.library.dto.SignupRequest;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import com.library.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication.getName(), 
                authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long memberId = null;
        if (user.getRole() == User.Role.USER) {
            Member member = memberRepository.findByUserId(user.getId()).orElse(null);
            if (member != null) {
                memberId = member.getId();
            }
        }

        return new JwtResponse(jwt, user.getUsername(), user.getRole().name(), memberId);
    }

    @Transactional
    public String registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (memberRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user account
        User user = new User(signupRequest.getUsername(),
                passwordEncoder.encode(signupRequest.getPassword()),
                User.Role.USER);

        User savedUser = userRepository.save(user);

        // Create member profile
        Member member = new Member(savedUser, signupRequest.getFullName(), signupRequest.getEmail());
        memberRepository.save(member);

        return "User registered successfully!";
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("No authenticated user found");
    }

    public Member getCurrentMember() {
        User user = getCurrentUser();
        if (user.getRole() == User.Role.USER) {
            return memberRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Member profile not found"));
        }
        throw new RuntimeException("Current user is not a member");
    }
}
