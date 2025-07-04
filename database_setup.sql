-- Use the library_management database
USE library_management;

-- USER TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL
);

-- MEMBER INFO TABLE
CREATE TABLE IF NOT EXISTS members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    full_name VARCHAR(100),
    email VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- BOOK TABLE
CREATE TABLE IF NOT EXISTS books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    author VARCHAR(100),
    genre VARCHAR(50),
    available_copies INT,
    total_copies INT,
    has_digital_copy BOOLEAN DEFAULT FALSE
);

-- BORROW RECORDS
CREATE TABLE IF NOT EXISTS borrowings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    book_id BIGINT,
    borrow_date DATE,
    return_date DATE,
    due_date DATE,
    fine DECIMAL(10,2),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- EBOOK LINKS
CREATE TABLE IF NOT EXISTS digital_books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT,
    file_format VARCHAR(10),
    file_url TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insert some sample data for testing
-- Insert admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample user (password: user123)
INSERT INTO users (username, password, role) VALUES 
('user1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER')
ON DUPLICATE KEY UPDATE username=username;

-- Insert member profile for user1
INSERT INTO members (user_id, full_name, email) VALUES 
((SELECT id FROM users WHERE username = 'user1'), 'John Doe', 'john.doe@example.com')
ON DUPLICATE KEY UPDATE full_name=full_name;

-- Insert sample books
INSERT INTO books (title, author, genre, available_copies, total_copies, has_digital_copy) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 5, 5, FALSE),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 3, 3, TRUE),
('1984', 'George Orwell', 'Dystopian', 4, 4, TRUE),
('Pride and Prejudice', 'Jane Austen', 'Romance', 2, 2, FALSE),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 3, 3, FALSE),
('Java: The Complete Reference', 'Herbert Schildt', 'Technology', 2, 2, TRUE),
('Clean Code', 'Robert C. Martin', 'Technology', 1, 1, TRUE),
('Design Patterns', 'Gang of Four', 'Technology', 2, 2, FALSE),
('The Alchemist', 'Paulo Coelho', 'Philosophy', 4, 4, FALSE),
('Sapiens', 'Yuval Noah Harari', 'History', 3, 3, TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE members;
DESCRIBE books;
DESCRIBE borrowings;
DESCRIBE digital_books;
