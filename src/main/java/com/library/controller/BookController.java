package com.library.controller;

import com.library.dto.BookDTO;
import com.library.dto.BookSearchRequest;
import com.library.model.Book;
import com.library.service.BookService;
import com.library.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooksAsDTO();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(book -> ResponseEntity.ok().body(book))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/search")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestBody BookSearchRequest searchRequest) {
        try {
            List<Book> books = bookService.searchBooks(searchRequest);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error searching books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/search/title/{title}")
    public ResponseEntity<List<BookDTO>> searchByTitle(@PathVariable String title) {
        try {
            BookSearchRequest request = new BookSearchRequest();
            request.setTitle(title);
            List<Book> books = bookService.searchBooks(request);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error searching books by title: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/search/author/{author}")
    public ResponseEntity<List<BookDTO>> searchByAuthor(@PathVariable String author) {
        try {
            BookSearchRequest request = new BookSearchRequest();
            request.setAuthor(author);
            List<Book> books = bookService.searchBooks(request);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error searching books by author: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/search/genre/{genre}")
    public ResponseEntity<List<BookDTO>> searchByGenre(@PathVariable String genre) {
        try {
            List<Book> books = bookService.getBooksByGenre(genre);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error searching books by genre: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/search/keyword/{keyword}")
    public ResponseEntity<List<BookDTO>> searchByKeyword(@PathVariable String keyword) {
        try {
            BookSearchRequest request = new BookSearchRequest();
            request.setKeyword(keyword);
            List<Book> books = bookService.searchBooks(request);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error searching books by keyword: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<BookDTO>> getAvailableBooks() {
        try {
            List<Book> books = bookService.getAvailableBooks();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching available books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/digital")
    public ResponseEntity<List<BookDTO>> getDigitalBooks() {
        try {
            List<Book> books = bookService.getDigitalBooks();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching digital books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/popular")
    public ResponseEntity<List<BookDTO>> getPopularBooks() {
        try {
            List<Book> books = recommendationService.getPopularBooks();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching popular books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<List<BookDTO>> getTrendingBooks() {
        try {
            List<Book> books = recommendationService.getTrendingBooks();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching trending books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = bookService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<BookDTO>> getPersonalizedRecommendations() {
        try {
            List<Book> books = recommendationService.getPersonalizedRecommendations();
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching personalized recommendations: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/recommendations/mood/{mood}")
    public ResponseEntity<List<BookDTO>> getRecommendationsByMood(@PathVariable String mood) {
        try {
            List<Book> books = recommendationService.getRecommendationsByMood(mood);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching mood recommendations: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/recommendations/genre/{genre}")
    public ResponseEntity<List<BookDTO>> getRecommendationsByGenre(@PathVariable String genre) {
        try {
            List<Book> books = recommendationService.getRecommendationsByGenre(genre);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching genre recommendations: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<BookDTO>> getSimilarBooks(@PathVariable Long id) {
        try {
            List<Book> books = recommendationService.getSimilarBooks(id);
            List<BookDTO> bookDTOs = books.stream()
                    .map(bookService::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(bookDTOs);
        } catch (Exception e) {
            System.err.println("Error fetching similar books: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/moods")
    public ResponseEntity<List<String>> getSupportedMoods() {
        List<String> moods = recommendationService.getSupportedMoods();
        return ResponseEntity.ok(moods);
    }
}
