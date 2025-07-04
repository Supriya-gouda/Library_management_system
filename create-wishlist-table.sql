-- Create wishlist table
USE library_management;

CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_book (member_id, book_id)
);

-- Add some sample wishlist items for testing
INSERT IGNORE INTO wishlist (member_id, book_id) 
SELECT m.id, b.id 
FROM members m, books b 
WHERE m.user_id = (SELECT id FROM users WHERE username = 'user1')
AND b.id IN (1, 2)
LIMIT 2;

-- Verify the table
SELECT * FROM wishlist;
DESCRIBE wishlist;
