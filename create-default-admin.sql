-- Create default admin user with credentials: admin/pass123
USE library_management;

-- Remove existing admin user if exists
DELETE FROM users WHERE username = 'admin';

-- Create admin user with BCrypt hash for "pass123"
-- Hash generated using BCrypt with strength 10
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$N.zmdr9k7uOLQvQHbh8Ce.4vuXkfiAYidtRh8xbC.qEjvTPtpObOy', 'ADMIN');

-- Also create a default regular user for testing
DELETE FROM members WHERE user_id = (SELECT id FROM users WHERE username = 'user1');
DELETE FROM users WHERE username = 'user1';

INSERT INTO users (username, password, role) VALUES 
('user1', '$2a$10$N.zmdr9k7uOLQvQHbh8Ce.4vuXkfiAYidtRh8xbC.qEjvTPtpObOy', 'USER');

-- Create member profile for user1
INSERT INTO members (user_id, full_name, email) 
SELECT id, 'John Doe', 'john.doe@example.com' 
FROM users WHERE username = 'user1';

-- Verify the users
SELECT id, username, LEFT(password, 20) as password_start, LENGTH(password) as password_length, role FROM users;
