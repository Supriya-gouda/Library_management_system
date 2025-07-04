package com.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.io.File;

@SpringBootApplication
@EnableJpaRepositories
public class LibraryManagementApplication {
    public static void main(String[] args) {
        // Create uploads directory if it doesn't exist
        File uploadsDir = new File("uploads/digital-books");
        if (!uploadsDir.exists()) {
            uploadsDir.mkdirs();
            System.out.println("Created uploads directory: " + uploadsDir.getAbsolutePath());
        }

        SpringApplication.run(LibraryManagementApplication.class, args);
    }
}




