package com.library;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseConnectionTest {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/library_management";
        String username = "root";
        String password = "Supriyasql@6505";
        
        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Establish connection
            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println("✅ Database connection successful!");
            
            // Test query
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'library_management'");
            
            if (resultSet.next()) {
                int tableCount = resultSet.getInt("table_count");
                System.out.println("✅ Found " + tableCount + " tables in library_management database");
            }
            
            // Test users table
            ResultSet userResult = statement.executeQuery("SELECT COUNT(*) as user_count FROM users");
            if (userResult.next()) {
                int userCount = userResult.getInt("user_count");
                System.out.println("✅ Found " + userCount + " users in the database");
            }
            
            // Test books table
            ResultSet bookResult = statement.executeQuery("SELECT COUNT(*) as book_count FROM books");
            if (bookResult.next()) {
                int bookCount = bookResult.getInt("book_count");
                System.out.println("✅ Found " + bookCount + " books in the database");
            }
            
            // Close connections
            resultSet.close();
            userResult.close();
            bookResult.close();
            statement.close();
            connection.close();
            
            System.out.println("✅ Database setup is complete and working!");
            System.out.println("\n🚀 You can now run your Spring Boot application!");
            System.out.println("📝 Test credentials:");
            System.out.println("   Admin: username=admin, password=secret");
            System.out.println("   User:  username=user1, password=secret");
            
        } catch (Exception e) {
            System.err.println("❌ Database connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}



