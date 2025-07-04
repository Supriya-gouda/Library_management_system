package com.library.service;

import com.library.model.Book;
import com.library.model.Member;
import com.library.repository.BorrowingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private BookService bookService;

    @Autowired
    private BorrowingRepository borrowingRepository;

    @Autowired
    private AuthService authService;

    // Mood to genre mapping
    private static final Map<String, List<String>> MOOD_GENRE_MAP = Map.of(
            "uplifting", Arrays.asList("Self-Help", "Comedy", "Romance", "Adventure"),
            "relaxing", Arrays.asList("Poetry", "Nature", "Travel", "Art"),
            "exciting", Arrays.asList("Thriller", "Action", "Adventure", "Mystery"),
            "thoughtful", Arrays.asList("Philosophy", "Biography", "History", "Science"),
            "escapist", Arrays.asList("Fantasy", "Science Fiction", "Romance", "Adventure"),
            "educational", Arrays.asList("Science", "History", "Biography", "Technology"),
            "emotional", Arrays.asList("Drama", "Romance", "Biography", "Literary Fiction")
    );

    public List<Book> getPersonalizedRecommendations() {
        try {
            Member member = authService.getCurrentMember();
            return getPersonalizedRecommendations(member.getId());
        } catch (Exception e) {
            // If user is not authenticated or not a member, return popular books
            return getPopularBooks();
        }
    }

    public List<Book> getPersonalizedRecommendations(Long memberId) {
        // Get member's borrowing history to analyze preferences
        List<String> borrowedGenres = borrowingRepository.findBorrowedGenresByMember(memberId);
        
        if (borrowedGenres.isEmpty()) {
            // New user - return popular books
            return getPopularBooks();
        }

        // Get books from preferred genres that the member hasn't borrowed
        List<Book> recommendedBooks = bookService.getBooksByGenres(borrowedGenres);
        
        // Filter out books already borrowed by the member
        Set<Long> borrowedBookIds = borrowingRepository.findByMemberId(memberId)
                .stream()
                .map(borrowing -> borrowing.getBook().getId())
                .collect(Collectors.toSet());

        recommendedBooks = recommendedBooks.stream()
                .filter(book -> !borrowedBookIds.contains(book.getId()))
                .limit(10)
                .collect(Collectors.toList());

        // If not enough recommendations, add popular books
        if (recommendedBooks.size() < 5) {
            List<Book> popularBooks = getPopularBooks();
            for (Book book : popularBooks) {
                if (!borrowedBookIds.contains(book.getId()) && 
                    !recommendedBooks.contains(book) && 
                    recommendedBooks.size() < 10) {
                    recommendedBooks.add(book);
                }
            }
        }

        return recommendedBooks;
    }

    public List<Book> getRecommendationsByMood(String mood) {
        List<String> genres = MOOD_GENRE_MAP.getOrDefault(mood.toLowerCase(), 
                Arrays.asList("Fiction", "Non-Fiction"));
        
        List<Book> books = bookService.getBooksByGenres(genres);
        
        // Shuffle and limit results
        Collections.shuffle(books);
        return books.stream().limit(10).collect(Collectors.toList());
    }

    public List<Book> getRecommendationsByGenre(String genre) {
        List<Book> books = bookService.getBooksByGenre(genre);
        
        // Sort by availability and popularity (you could add a popularity score)
        return books.stream()
                .sorted((b1, b2) -> {
                    // Prioritize available books
                    if (b1.isAvailable() && !b2.isAvailable()) return -1;
                    if (!b1.isAvailable() && b2.isAvailable()) return 1;
                    return 0;
                })
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Book> getPopularBooks() {
        // Get most borrowed books
        List<Book> popularBooks = bookService.getMostBorrowedBooks();
        
        if (popularBooks.size() < 10) {
            // If not enough popular books, add recent additions
            List<Book> allBooks = bookService.getAllBooks();
            for (Book book : allBooks) {
                if (!popularBooks.contains(book) && popularBooks.size() < 10) {
                    popularBooks.add(book);
                }
            }
        }
        
        return popularBooks.stream().limit(10).collect(Collectors.toList());
    }

    public List<Book> getTrendingBooks() {
        // Get books borrowed in the last month
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        List<Object[]> trendingData = borrowingRepository.findMostBorrowedBooksInPeriod(oneMonthAgo);
        
        List<Book> trendingBooks = new ArrayList<>();
        for (Object[] data : trendingData) {
            Long bookId = (Long) data[0];
            bookService.getBookById(bookId).ifPresent(trendingBooks::add);
            if (trendingBooks.size() >= 10) break;
        }
        
        return trendingBooks;
    }

    public List<String> getSupportedMoods() {
        return new ArrayList<>(MOOD_GENRE_MAP.keySet());
    }

    public List<Book> getSimilarBooks(Long bookId) {
        Optional<Book> bookOpt = bookService.getBookById(bookId);
        if (bookOpt.isEmpty()) {
            return new ArrayList<>();
        }
        
        Book book = bookOpt.get();
        
        // Find books by same author
        List<Book> similarBooks = bookService.getAllBooks().stream()
                .filter(b -> !b.getId().equals(bookId))
                .filter(b -> b.getAuthor() != null && 
                           b.getAuthor().equalsIgnoreCase(book.getAuthor()))
                .collect(Collectors.toList());
        
        // If not enough, add books from same genre
        if (similarBooks.size() < 5 && book.getGenre() != null) {
            List<Book> genreBooks = bookService.getBooksByGenre(book.getGenre()).stream()
                    .filter(b -> !b.getId().equals(bookId))
                    .filter(b -> !similarBooks.contains(b))
                    .collect(Collectors.toList());
            
            similarBooks.addAll(genreBooks);
        }
        
        return similarBooks.stream().limit(10).collect(Collectors.toList());
    }
}
