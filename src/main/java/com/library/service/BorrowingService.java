package com.library.service;

import com.library.model.Book;
import com.library.model.Borrowing;
import com.library.model.Member;
import com.library.repository.BorrowingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingService {

    @Autowired
    private BorrowingRepository borrowingRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private AuthService authService;

    private static final int DEFAULT_BORROW_PERIOD_DAYS = 14;
    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("1.00");
    private static final int MAX_BOOKS_PER_MEMBER = 5;

    @Transactional
    public Borrowing borrowBook(Long bookId) {
        Member member = authService.getCurrentMember();
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Check if member has already borrowed this book and not returned
        List<Borrowing> activeBorrowings = borrowingRepository
                .findActiveBorrowingByMemberAndBook(member.getId(), bookId);
        if (!activeBorrowings.isEmpty()) {
            throw new RuntimeException("You have already borrowed this book");
        }

        // Check borrowing limit
        Long activeBorrowingCount = borrowingRepository.countActiveBorrowingsByMember(member.getId());
        if (activeBorrowingCount >= MAX_BOOKS_PER_MEMBER) {
            throw new RuntimeException("You have reached the maximum borrowing limit of " + MAX_BOOKS_PER_MEMBER + " books");
        }

        // Check book availability
        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for borrowing");
        }

        // Create borrowing record
        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = borrowDate.plusDays(DEFAULT_BORROW_PERIOD_DAYS);
        
        Borrowing borrowing = new Borrowing(member, book, borrowDate, dueDate);
        
        // Decrease available copies
        bookService.decreaseAvailableCopies(bookId);
        
        return borrowingRepository.save(borrowing);
    }

    @Transactional
    public Borrowing returnBook(Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Borrowing record not found"));

        if (borrowing.isReturned()) {
            throw new RuntimeException("Book has already been returned");
        }

        // Set return date
        LocalDate returnDate = LocalDate.now();
        borrowing.setReturnDate(returnDate);

        // Calculate fine if overdue
        if (returnDate.isAfter(borrowing.getDueDate())) {
            long daysOverdue = returnDate.toEpochDay() - borrowing.getDueDate().toEpochDay();
            BigDecimal fine = DAILY_FINE_RATE.multiply(new BigDecimal(daysOverdue));
            borrowing.setFine(fine);
        }

        // Increase available copies
        bookService.increaseAvailableCopies(borrowing.getBook().getId());

        return borrowingRepository.save(borrowing);
    }

    public List<Borrowing> getCurrentBorrowings(Long memberId) {
        return borrowingRepository.findByMemberIdAndReturnDateIsNull(memberId);
    }

    public List<Borrowing> getBorrowingHistory(Long memberId) {
        return borrowingRepository.findByMemberIdAndReturnDateIsNotNull(memberId);
    }

    public List<Borrowing> getAllBorrowingsByMember(Long memberId) {
        return borrowingRepository.findByMemberId(memberId);
    }

    public List<Borrowing> getOverdueBorrowings() {
        return borrowingRepository.findOverdueBorrowings(LocalDate.now());
    }

    public Optional<Borrowing> getBorrowingById(Long id) {
        return borrowingRepository.findById(id);
    }

    public List<Borrowing> getBorrowingsByBook(Long bookId) {
        return borrowingRepository.findByBookId(bookId);
    }

    @Transactional
    public void calculateAndUpdateFines() {
        List<Borrowing> overdueBorrowings = getOverdueBorrowings();
        
        for (Borrowing borrowing : overdueBorrowings) {
            long daysOverdue = borrowing.getDaysOverdue();
            BigDecimal fine = DAILY_FINE_RATE.multiply(new BigDecimal(daysOverdue));
            borrowing.setFine(fine);
            borrowingRepository.save(borrowing);
        }
    }

    public BigDecimal getTotalFinesByMember(Long memberId) {
        List<Borrowing> borrowings = borrowingRepository.findByMemberId(memberId);
        return borrowings.stream()
                .filter(b -> b.getFine() != null)
                .map(Borrowing::getFine)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get current borrowings for the authenticated user
    public List<Borrowing> getCurrentUserBorrowings() {
        Member member = authService.getCurrentMember();
        return getCurrentBorrowings(member.getId());
    }

    // Get borrowing history for the authenticated user
    public List<Borrowing> getCurrentUserBorrowingHistory() {
        Member member = authService.getCurrentMember();
        return getBorrowingHistory(member.getId());
    }
}
