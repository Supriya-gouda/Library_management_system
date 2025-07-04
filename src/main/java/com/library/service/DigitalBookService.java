package com.library.service;

import com.library.model.Book;
import com.library.model.DigitalBook;
import com.library.repository.DigitalBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DigitalBookService {

    @Autowired
    private DigitalBookRepository digitalBookRepository;

    @Autowired
    private BookService bookService;

    private final Path fileStorageLocation = Paths.get("uploads/digital-books").toAbsolutePath().normalize();

    public DigitalBookService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List<DigitalBook> getAllDigitalBooks() {
        return digitalBookRepository.findAll();
    }

    public List<DigitalBook> getDigitalBooksByBookId(Long bookId) {
        return digitalBookRepository.findByBookId(bookId);
    }

    public Optional<DigitalBook> getDigitalBookByBookIdAndFormat(Long bookId, String format) {
        return digitalBookRepository.findByBookIdAndFileFormat(bookId, format);
    }

    public List<DigitalBook> getDigitalBooksByFormat(String format) {
        return digitalBookRepository.findByFileFormat(format);
    }

    @Transactional
    public DigitalBook uploadDigitalBook(Long bookId, MultipartFile file, String format) {
        // Validate book exists
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate format
        if (!isValidFormat(format)) {
            throw new RuntimeException("Unsupported file format: " + format);
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create digital book record
            String fileUrl = "/api/digital-books/files/" + fileName;
            DigitalBook digitalBook = new DigitalBook(book, format.toUpperCase(), fileUrl);
            
            // Update book to indicate it has digital copy
            book.setHasDigitalCopy(true);
            bookService.saveBook(book);

            return digitalBookRepository.save(digitalBook);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    @Transactional
    public void deleteDigitalBook(Long digitalBookId) {
        DigitalBook digitalBook = digitalBookRepository.findById(digitalBookId)
                .orElseThrow(() -> new RuntimeException("Digital book not found with id: " + digitalBookId));

        // Delete physical file
        try {
            String fileName = digitalBook.getFileUrl().substring(digitalBook.getFileUrl().lastIndexOf("/") + 1);
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log error but don't fail the operation
            System.err.println("Could not delete file: " + ex.getMessage());
        }

        // Delete database record
        digitalBookRepository.delete(digitalBook);

        // Check if book still has other digital copies
        List<DigitalBook> remainingDigitalBooks = digitalBookRepository.findByBookId(digitalBook.getBook().getId());
        if (remainingDigitalBooks.isEmpty()) {
            Book book = digitalBook.getBook();
            book.setHasDigitalCopy(false);
            bookService.saveBook(book);
        }
    }

    @Transactional
    public DigitalBook updateDigitalBook(Long digitalBookId, String newFormat) {
        DigitalBook digitalBook = digitalBookRepository.findById(digitalBookId)
                .orElseThrow(() -> new RuntimeException("Digital book not found with id: " + digitalBookId));

        if (!isValidFormat(newFormat)) {
            throw new RuntimeException("Unsupported file format: " + newFormat);
        }

        digitalBook.setFileFormat(newFormat.toUpperCase());
        return digitalBookRepository.save(digitalBook);
    }

    private boolean isValidFormat(String format) {
        return format != null && (format.equalsIgnoreCase("PDF") || 
                                 format.equalsIgnoreCase("EPUB") || 
                                 format.equalsIgnoreCase("MOBI"));
    }

    public String getContentType(String format) {
        switch (format.toUpperCase()) {
            case "PDF":
                return "application/pdf";
            case "EPUB":
                return "application/epub+zip";
            case "MOBI":
                return "application/x-mobipocket-ebook";
            default:
                return "application/octet-stream";
        }
    }

    public boolean hasDigitalAccess(Long bookId) {
        // In a real implementation, you might check user permissions,
        // subscription status, etc. For now, we'll allow access to all authenticated users
        return true;
    }
}
