# Library Management System

A full-stack Library Management System with digital book support, user authentication, borrowing system, and smart recommendations. Built with Spring Boot (Java) for the backend and React (with Tailwind CSS) for the frontend.

---

## Features

### Core Library Features
- **User Authentication:** Secure login/signup with JWT tokens
- **Role-based Access Control:** Admin and User roles
- **Book Circulation:** Borrowing and return system with fine calculation
- **Book & Member Management:** Complete CRUD operations (Admin-only)
- **Tracking & History:** User dashboard with borrowing history

### Search & Recommendations
- **Flexible Search:** By title, author, genre, or keywords
- **Advanced Filters:** Combine multiple search criteria
- **Availability Status:** Real-time availability tracking
- **Personalized Suggestions:** Based on borrowing history and preferences
- **Mood-based Recommendations:** Map moods to book genres
- **Popular Reads:** Trending and most borrowed books

### Digital Library Integration
- **E-Book Support:** PDF, EPUB, MOBI format support with in-browser reading
- **Digital Access Management:** Secure file serving
- **File Upload:** Admin can upload digital books

---

## Technology Stack

- **Backend:** Spring Boot 3.2.0, Spring Security (JWT), JPA/Hibernate
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Database:** MySQL 8+
- **Build Tools:** Maven (backend), npm (frontend)
- **Java Version:** 17

---

## Project Structure

```
root/
├── backend/
│   ├── src/main/java/com/library/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   ├── model/          # Entity classes
│   │   ├── security/       # Security configuration
│   │   └── dto/            # Data transfer objects
│   └── resources/
│       ├── application.properties
│       └── static/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.js
│   ├── public/
│   └── package.json
├── uploads/digital-books/   # Digital book files
├── database_setup.sql       # SQL schema
└── README.md
```

---

## Project Screenshots

| Home Page | Login Page |
|-----------|------------|
| ![Home Page](./frontend/public/homepage.png) | ![Login Page](./frontend/public/loginpage.png) |

| User Dashboard | Admin Dashboard |
|----------------|----------------|
| ![User Dashboard]![image](https://github.com/user-attachments/assets/2d77fd19-0355-4768-abe2-825297223154)
 | ![Admin Dashboard](./frontend/public/admindashboard.png) |

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Node.js & npm (for frontend)

### Backend Setup
1. Create a MySQL database named `library_management`.
2. Update database credentials in `src/main/resources/application.properties`.
3. Run the provided SQL scripts to create tables.
4. In the project root, run:
   ```bash
   mvn spring-boot:run
   ```
5. The backend will start at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. The frontend will start at `http://localhost:3000`.

---

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/signin` — User login
- `POST /api/auth/signup` — User registration
- `GET /api/auth/me` — Get current user info

### Books
- `GET /api/books` — Get all books
- `GET /api/books/{id}` — Get book by ID
- `POST /api/books/search` — Advanced search
- `GET /api/books/popular` — Popular books
- `GET /api/books/recommendations` — Personalized recommendations

### Borrowing
- `POST /api/borrowings/borrow/{bookId}` — Borrow a book
- `PUT /api/borrowings/return/{borrowingId}` — Return a book
- `GET /api/borrowings/current` — Current borrowings
- `GET /api/borrowings/history` — Borrowing history

### Digital Books
- `GET /api/digital-books/book/{bookId}` — Get digital versions
- `GET /api/digital-books/read/{digitalBookId}` — Read digital book
- `POST /api/digital-books/upload/{bookId}` — Upload digital book (Admin)

### Admin (Admin Role Required)
- `POST /api/admin/books` — Add new book
- `PUT /api/admin/books/{id}` — Update book
- `DELETE /api/admin/books/{id}` — Delete book
- `GET /api/admin/members` — Get all members
- `POST /api/admin/users/admin` — Create admin user

---

## Business Logic & Rules

- **Borrowing:** Max 5 books per member, 14-day period, $1/day overdue fine, cannot borrow same book twice simultaneously.
- **Recommendations:** Based on user history, preferred genres, mood, and trending books.
- **File Management:** Secure upload, access control, in-browser reading for digital books.

---

## Testing

- Backend: `mvn test`
- Frontend: `npm test` (if tests are present)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## Database Schema

The application uses the following database tables:
- `users` - User authentication and roles
- `members` - Member profile information
- `books` - Book catalog with availability tracking
- `borrowings` - Borrowing records with due dates and fines
- `digital_books` - Digital book file references

### Database Table Definitions (MySQL)

```sql
-- USERS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL
);

-- MEMBERS
CREATE TABLE IF NOT EXISTS members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    full_name VARCHAR(100),
    email VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- BOOKS
CREATE TABLE IF NOT EXISTS books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    author VARCHAR(100),
    genre VARCHAR(50),
    available_copies INT,
    total_copies INT,
    has_digital_copy BOOLEAN DEFAULT FALSE
);

-- BORROWINGS
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

-- DIGITAL BOOKS
CREATE TABLE IF NOT EXISTS digital_books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    book_id BIGINT,
    file_format VARCHAR(10),
    file_url TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

---

## License

This project is licensed under the MIT License.

---
