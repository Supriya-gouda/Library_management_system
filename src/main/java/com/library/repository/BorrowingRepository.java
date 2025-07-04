package com.library.repository;

import com.library.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    
    // Find borrowings by member
    List<Borrowing> findByMemberId(Long memberId);
    
    // Find current borrowings (not returned)
    List<Borrowing> findByMemberIdAndReturnDateIsNull(Long memberId);
    
    // Find returned borrowings
    List<Borrowing> findByMemberIdAndReturnDateIsNotNull(Long memberId);
    
    // Find overdue borrowings
    @Query("SELECT b FROM Borrowing b WHERE b.returnDate IS NULL AND b.dueDate < :currentDate")
    List<Borrowing> findOverdueBorrowings(@Param("currentDate") LocalDate currentDate);
    
    // Find borrowings by book
    List<Borrowing> findByBookId(Long bookId);
    
    // Check if member has already borrowed a specific book and not returned
    @Query("SELECT b FROM Borrowing b WHERE b.member.id = :memberId AND b.book.id = :bookId AND b.returnDate IS NULL")
    List<Borrowing> findActiveBorrowingByMemberAndBook(@Param("memberId") Long memberId, @Param("bookId") Long bookId);
    
    // Get borrowing history for recommendations
    @Query("SELECT DISTINCT b.book.genre FROM Borrowing b WHERE b.member.id = :memberId AND b.book.genre IS NOT NULL")
    List<String> findBorrowedGenresByMember(@Param("memberId") Long memberId);
    
    // Most borrowed books in a time period
    @Query("SELECT b.book.id, COUNT(b.id) as borrowCount FROM Borrowing b " +
           "WHERE b.borrowDate >= :startDate GROUP BY b.book.id ORDER BY borrowCount DESC")
    List<Object[]> findMostBorrowedBooksInPeriod(@Param("startDate") LocalDate startDate);
    
    // Count active borrowings by member
    @Query("SELECT COUNT(b) FROM Borrowing b WHERE b.member.id = :memberId AND b.returnDate IS NULL")
    Long countActiveBorrowingsByMember(@Param("memberId") Long memberId);
}
