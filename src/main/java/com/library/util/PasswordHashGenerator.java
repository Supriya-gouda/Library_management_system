package com.library.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hash for "secret" password
        String secretHash = encoder.encode("secret");
        System.out.println("Hash for 'secret': " + secretHash);
        
        // Generate hash for "admin123" password
        String adminHash = encoder.encode("admin123");
        System.out.println("Hash for 'admin123': " + adminHash);
        
        // Generate hash for "user123" password
        String userHash = encoder.encode("user123");
        System.out.println("Hash for 'user123': " + userHash);
        
        // Test the hashes
        System.out.println("\nTesting hashes:");
        System.out.println("'secret' matches: " + encoder.matches("secret", secretHash));
        System.out.println("'admin123' matches: " + encoder.matches("admin123", adminHash));
        System.out.println("'user123' matches: " + encoder.matches("user123", userHash));
    }
}
