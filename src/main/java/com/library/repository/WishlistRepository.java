package com.library.repository;

import com.library.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    @Query("SELECT w FROM Wishlist w WHERE w.member.id = :memberId")
    List<Wishlist> findByMemberId(@Param("memberId") Long memberId);
    
    @Query("SELECT w FROM Wishlist w WHERE w.member.id = :memberId AND w.book.id = :bookId")
    Optional<Wishlist> findByMemberIdAndBookId(@Param("memberId") Long memberId, @Param("bookId") Long bookId);
    
    @Query("DELETE FROM Wishlist w WHERE w.member.id = :memberId AND w.book.id = :bookId")
    void deleteByMemberIdAndBookId(@Param("memberId") Long memberId, @Param("bookId") Long bookId);
    
    boolean existsByMemberIdAndBookId(Long memberId, Long bookId);
}
