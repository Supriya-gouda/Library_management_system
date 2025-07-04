package com.library;

import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class ApplicationStartupTest implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n🚀 Library Management System - Startup Test");
        System.out.println("=" .repeat(50));

        // Test database connection
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("✅ Database connection: SUCCESS");
            System.out.println("   Database URL: " + connection.getMetaData().getURL());
        } catch (Exception e) {
            System.err.println("❌ Database connection: FAILED - " + e.getMessage());
        }

        // Test password encoder
        try {
            String testPassword = "pass123";
            String encoded = passwordEncoder.encode(testPassword);
            boolean matches = passwordEncoder.matches(testPassword, encoded);
            System.out.println("✅ Password encoder: " + (matches ? "SUCCESS" : "FAILED"));
        } catch (Exception e) {
            System.err.println("❌ Password encoder: FAILED - " + e.getMessage());
        }

        // Create default admin user
        try {
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("pass123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println("✅ Default admin user created: username=admin, password=pass123");
            } else {
                System.out.println("✅ Admin user already exists");
            }

            if (!userRepository.existsByUsername("user1")) {
                User user = new User();
                user.setUsername("user1");
                user.setPassword(passwordEncoder.encode("pass123"));
                user.setRole(User.Role.USER);
                User savedUser = userRepository.save(user);

                // Create member profile
                Member member = new Member();
                member.setUser(savedUser);
                member.setFullName("John Doe");
                member.setEmail("john.doe@example.com");
                memberRepository.save(member);

                System.out.println("✅ Default user created: username=user1, password=pass123");
            } else {
                System.out.println("✅ Regular user already exists");
            }
        } catch (Exception e) {
            System.err.println("❌ Default user creation: FAILED - " + e.getMessage());
        }

        System.out.println("=" .repeat(50));
        System.out.println("🎯 Application ready!");
        System.out.println("📍 Server: http://localhost:8080");
        System.out.println("📖 API Docs: http://localhost:8080");
        System.out.println("🔑 Default credentials:");
        System.out.println("   Admin: username=admin, password=pass123");
        System.out.println("   User:  username=user1, password=pass123");
        System.out.println("=" .repeat(50));
    }
}
