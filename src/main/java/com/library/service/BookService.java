package com.library.service;

import com.library.dto.BookDTO;
import com.library.dto.BookSearchRequest;
import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    @Transactional
    public Book saveBook(Book book) {
        if (book.getId() == null) {
            // New book - set available copies equal to total copies
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setGenre(bookDetails.getGenre());
        
        // Update total copies and adjust available copies accordingly
        if (bookDetails.getTotalCopies() != null) {
            int difference = bookDetails.getTotalCopies() - book.getTotalCopies();
            book.setTotalCopies(bookDetails.getTotalCopies());
            book.setAvailableCopies(book.getAvailableCopies() + difference);
        }
        
        if (bookDetails.getHasDigitalCopy() != null) {
            book.setHasDigitalCopy(bookDetails.getHasDigitalCopy());
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookRepository.delete(book);
    }

    public List<Book> searchBooks(BookSearchRequest searchRequest) {
        List<Book> books;

        if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
            books = bookRepository.findByKeyword(searchRequest.getKeyword().trim());
        } else {
            books = bookRepository.findByFilters(
                    searchRequest.getTitle(),
                    searchRequest.getAuthor(),
                    searchRequest.getGenre()
            );
        }

        // Apply additional filters
        if (searchRequest.getAvailableOnly() != null && searchRequest.getAvailableOnly()) {
            books = books.stream()
                    .filter(Book::isAvailable)
                    .collect(Collectors.toList());
        }

        if (searchRequest.getDigitalOnly() != null && searchRequest.getDigitalOnly()) {
            books = books.stream()
                    .filter(book -> book.getHasDigitalCopy() != null && book.getHasDigitalCopy())
                    .collect(Collectors.toList());
        }

        return books;
    }

    public List<Book> getAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0);
    }

    public List<Book> getDigitalBooks() {
        return bookRepository.findByHasDigitalCopyTrue();
    }

    public List<Book> getMostBorrowedBooks() {
        return bookRepository.findMostBorrowedBooks();
    }

    public List<String> getAllGenres() {
        return bookRepository.findDistinctGenres();
    }

    public List<Book> getBooksByGenre(String genre) {
        return bookRepository.findByGenreIgnoreCase(genre);
    }

    public List<Book> getBooksByGenres(List<String> genres) {
        return bookRepository.findByGenreInIgnoreCase(genres);
    }

    @Transactional
    public void decreaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        if (book.getAvailableCopies() > 0) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            throw new RuntimeException("No available copies of this book");
        }
    }

    @Transactional
    public void increaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
    }

    // Utility method to convert Book to BookDTO
    public BookDTO convertToDTO(Book book) {
        return new BookDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getGenre(),
            book.getAvailableCopies(),
            book.getTotalCopies(),
            book.getHasDigitalCopy()
        );
    }

    // Safe method to get all books as DTOs
    public List<BookDTO> getAllBooksAsDTO() {
        try {
            List<Book> books = bookRepository.findAll();
            return books.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching books: " + e.getMessage());
            return List.of(); // Return empty list instead of null
        }
    }
}
