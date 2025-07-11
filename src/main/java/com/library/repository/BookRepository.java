package com.library.repository;

import com.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Search methods
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByGenreIgnoreCase(String genre);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> findByKeyword(@Param("keyword") String keyword);
    
    // Advanced search with multiple filters
    @Query("SELECT b FROM Book b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:genre IS NULL OR LOWER(b.genre) = LOWER(:genre))")
    List<Book> findByFilters(@Param("title") String title, 
                            @Param("author") String author, 
                            @Param("genre") String genre);
    
    // Availability methods
    List<Book> findByAvailableCopiesGreaterThan(Integer copies);
    List<Book> findByHasDigitalCopyTrue();
    
    // Popular books (most borrowed)
    @Query("SELECT b FROM Book b JOIN b.borrowings br " +
           "GROUP BY b.id ORDER BY COUNT(br.id) DESC")
    List<Book> findMostBorrowedBooks();
    
    // Books by genre for recommendations
    List<Book> findByGenreInIgnoreCase(List<String> genres);
    
    // Get distinct genres
    @Query("SELECT DISTINCT b.genre FROM Book b WHERE b.genre IS NOT NULL")
    List<String> findDistinctGenres();
}
