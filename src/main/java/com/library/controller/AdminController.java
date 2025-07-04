package com.library.controller;

import com.library.dto.BookDTO;
import com.library.model.Book;
import com.library.model.Borrowing;
import com.library.model.Member;
import com.library.model.User;
import com.library.repository.MemberRepository;
import com.library.repository.UserRepository;
import com.library.service.BookService;
import com.library.service.BorrowingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private BookService bookService;

    @Autowired
    private BorrowingService borrowingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Book Management
    @GetMapping("/books")
    public ResponseEntity<List<BookDTO>> getAllBooksForAdmin() {
        try {
            List<Book> books = bookService.getAllBooks();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching books for admin: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping("/books")
    public ResponseEntity<?> addBook(@Valid @RequestBody Book book) {
        try {
            Book savedBook = bookService.saveBook(book);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok(new SuccessResponse("Book deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    // Member Management
    @GetMapping("/members")
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/members/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id)
                .map(member -> ResponseEntity.ok().body(member))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @Valid @RequestBody Member memberDetails) {
        try {
            Member member = memberRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));

            member.setFullName(memberDetails.getFullName());
            member.setEmail(memberDetails.getEmail());

            Member updatedMember = memberRepository.save(member);
            return ResponseEntity.ok(updatedMember);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/members")
    @Transactional
    public ResponseEntity<?> createMember(@Valid @RequestBody CreateMemberRequest request) {
        try {
            System.out.println("Creating member with username: " + request.getUsername());
            System.out.println("Request data: username=" + request.getUsername() + ", fullName=" + request.getFullName() + ", email=" + request.getEmail());

            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                System.err.println("Username validation failed");
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Username cannot be empty"));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                System.err.println("Password validation failed");
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Password cannot be empty"));
            }

            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                System.err.println("Full name validation failed");
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Full name cannot be empty"));
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                System.err.println("Email validation failed");
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Email cannot be empty"));
            }

            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername().trim())) {
                System.err.println("Username already exists: " + request.getUsername());
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Username is already taken!"));
            }

            // Check if email already exists
            if (memberRepository.existsByEmail(request.getEmail().trim())) {
                System.err.println("Email already exists: " + request.getEmail());
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Email is already in use!"));
            }

            // Create new user account
            User user = new User(
                    request.getUsername().trim(),
                    passwordEncoder.encode(request.getPassword()),
                    User.Role.USER
            );

            System.out.println("Saving user: " + user.getUsername());
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());

            // Create member profile
            Member member = new Member(savedUser, request.getFullName().trim(), request.getEmail().trim());
            System.out.println("Saving member: " + member.getFullName());
            Member savedMember = memberRepository.save(member);
            System.out.println("Member saved with ID: " + savedMember.getId());

            System.out.println("Member created successfully: " + savedMember.getFullName());
            return ResponseEntity.ok(savedMember);
        } catch (DataIntegrityViolationException e) {
            System.err.println("Data integrity violation: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Username or email already exists"));
        } catch (Exception e) {
            System.err.println("Error creating member: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error creating member: " + e.getMessage()));
        }
    }

    @DeleteMapping("/members/{id}")
    @Transactional
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        try {
            Member member = memberRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));

            // Check if member has active borrowings
            List<Borrowing> activeBorrowings = borrowingService.getCurrentBorrowings(id);
            if (!activeBorrowings.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Cannot delete member with active borrowings"));
            }

            // Get the associated user
            User associatedUser = member.getUser();

            // Delete member first (due to foreign key constraint)
            memberRepository.delete(member);

            // Then delete the associated user if it exists and is not an admin
            if (associatedUser != null && associatedUser.getRole() != User.Role.ADMIN) {
                userRepository.delete(associatedUser);
            }

            return ResponseEntity.ok(new SuccessResponse("Member and associated user deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/admin")
    public ResponseEntity<?> createAdminUser(@Valid @RequestBody AdminUserRequest request) {
        try {
            if (userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Username is already taken!"));
            }

            User adminUser = new User(
                    request.getUsername(),
                    passwordEncoder.encode(request.getPassword()),
                    User.Role.ADMIN
            );

            User savedUser = userRepository.save(adminUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @Valid @RequestBody RoleUpdateRequest request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    // Borrowings Management
    @GetMapping("/borrowings")
    public ResponseEntity<List<Borrowing>> getAllBorrowings() {
        try {
            // For now, return overdue borrowings as a demo
            // In a real implementation, you'd have a method to get all borrowings
            List<Borrowing> overdueBorrowings = borrowingService.getOverdueBorrowings();
            return ResponseEntity.ok(overdueBorrowings);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // Statistics and Reports
    @GetMapping("/stats/overdue-books")
    public ResponseEntity<List<Borrowing>> getOverdueBooks() {
        List<Borrowing> overdueBorrowings = borrowingService.getOverdueBorrowings();
        return ResponseEntity.ok(overdueBorrowings);
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Get basic statistics
            long totalBooks = bookService.getAllBooks().size();
            long totalMembers = memberRepository.count();
            long overdueBooks = borrowingService.getOverdueBorrowings().size();

            // Calculate active borrowings
            long activeBorrowings = bookService.getAllBooks().stream()
                    .mapToLong(book -> book.getTotalCopies() - book.getAvailableCopies())
                    .sum();

            DashboardStats stats = new DashboardStats(totalBooks, totalMembers, activeBorrowings, overdueBooks);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error fetching dashboard stats: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getGeneralStats() {
        try {
            return getDashboardStats();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error fetching stats: " + e.getMessage()));
        }
    }

    // Inner classes for requests and responses
    public static class AdminUserRequest {
        @NotBlank
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank
        @Size(min = 6, max = 100)
        private String password;

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
    }

    public static class RoleUpdateRequest {
        @NotBlank
        @Pattern(regexp = "ADMIN|USER", message = "Role must be either ADMIN or USER")
        private String role;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class CreateMemberRequest {
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

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class DashboardStats {
        private long totalBooks;
        private long totalMembers;
        private long activeBorrowings;
        private long overdueBooks;

        public DashboardStats(long totalBooks, long totalMembers, long activeBorrowings, long overdueBooks) {
            this.totalBooks = totalBooks;
            this.totalMembers = totalMembers;
            this.activeBorrowings = activeBorrowings;
            this.overdueBooks = overdueBooks;
        }

        public long getTotalBooks() {
            return totalBooks;
        }

        public void setTotalBooks(long totalBooks) {
            this.totalBooks = totalBooks;
        }

        public long getTotalMembers() {
            return totalMembers;
        }

        public void setTotalMembers(long totalMembers) {
            this.totalMembers = totalMembers;
        }

        public long getActiveBorrowings() {
            return activeBorrowings;
        }

        public void setActiveBorrowings(long activeBorrowings) {
            this.activeBorrowings = activeBorrowings;
        }

        public long getOverdueBooks() {
            return overdueBooks;
        }

        public void setOverdueBooks(long overdueBooks) {
            this.overdueBooks = overdueBooks;
        }
    }
}
