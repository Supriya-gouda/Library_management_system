package com.library.controller;

import com.library.model.Borrowing;
import com.library.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BorrowingController {

    @Autowired
    private BorrowingService borrowingService;

    @PostMapping("/borrow/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> borrowBook(@PathVariable Long bookId) {
        try {
            Borrowing borrowing = borrowingService.borrowBook(bookId);
            return ResponseEntity.ok(borrowing);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/return/{borrowingId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> returnBook(@PathVariable Long borrowingId) {
        try {
            Borrowing borrowing = borrowingService.returnBook(borrowingId);
            return ResponseEntity.ok(borrowing);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/current")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Borrowing>> getCurrentUserBorrowings() {
        List<Borrowing> borrowings = borrowingService.getCurrentUserBorrowings();
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Borrowing>> getCurrentUserBorrowingHistory() {
        List<Borrowing> borrowings = borrowingService.getCurrentUserBorrowingHistory();
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Borrowing>> getBorrowingsByMember(@PathVariable Long memberId) {
        List<Borrowing> borrowings = borrowingService.getAllBorrowingsByMember(memberId);
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/member/{memberId}/current")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Borrowing>> getCurrentBorrowingsByMember(@PathVariable Long memberId) {
        List<Borrowing> borrowings = borrowingService.getCurrentBorrowings(memberId);
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/member/{memberId}/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Borrowing>> getBorrowingHistoryByMember(@PathVariable Long memberId) {
        List<Borrowing> borrowings = borrowingService.getBorrowingHistory(memberId);
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Borrowing>> getOverdueBorrowings() {
        List<Borrowing> borrowings = borrowingService.getOverdueBorrowings();
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Borrowing>> getBorrowingsByBook(@PathVariable Long bookId) {
        List<Borrowing> borrowings = borrowingService.getBorrowingsByBook(bookId);
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBorrowingById(@PathVariable Long id) {
        return borrowingService.getBorrowingById(id)
                .map(borrowing -> ResponseEntity.ok().body(borrowing))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/calculate-fines")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> calculateAndUpdateFines() {
        try {
            borrowingService.calculateAndUpdateFines();
            return ResponseEntity.ok(new SuccessResponse("Fines calculated and updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/member/{memberId}/total-fines")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getTotalFinesByMember(@PathVariable Long memberId) {
        BigDecimal totalFines = borrowingService.getTotalFinesByMember(memberId);
        return ResponseEntity.ok(totalFines);
    }

    // Inner classes for responses
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
}
