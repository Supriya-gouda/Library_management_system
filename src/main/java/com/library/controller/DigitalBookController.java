package com.library.controller;

import com.library.model.DigitalBook;
import com.library.service.DigitalBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/digital-books")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DigitalBookController {

    @Autowired
    private DigitalBookService digitalBookService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DigitalBook>> getAllDigitalBooks() {
        List<DigitalBook> digitalBooks = digitalBookService.getAllDigitalBooks();
        return ResponseEntity.ok(digitalBooks);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<DigitalBook>> getDigitalBooksByBookId(@PathVariable Long bookId) {
        List<DigitalBook> digitalBooks = digitalBookService.getDigitalBooksByBookId(bookId);
        return ResponseEntity.ok(digitalBooks);
    }

    @GetMapping("/book/{bookId}/format/{format}")
    public ResponseEntity<?> getDigitalBookByBookIdAndFormat(@PathVariable Long bookId, @PathVariable String format) {
        return digitalBookService.getDigitalBookByBookIdAndFormat(bookId, format)
                .map(digitalBook -> ResponseEntity.ok().body(digitalBook))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/format/{format}")
    public ResponseEntity<List<DigitalBook>> getDigitalBooksByFormat(@PathVariable String format) {
        List<DigitalBook> digitalBooks = digitalBookService.getDigitalBooksByFormat(format);
        return ResponseEntity.ok(digitalBooks);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadDigitalBookNew(
            @RequestParam("bookId") Long bookId,
            @RequestParam("fileFormat") String fileFormat,
            @RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Uploading digital book for bookId: " + bookId + ", format: " + fileFormat);

            // Validate inputs
            if (bookId == null) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Book ID is required"));
            }

            if (fileFormat == null || fileFormat.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("File format is required"));
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("File is required"));
            }

            System.out.println("File name: " + file.getOriginalFilename() + ", size: " + file.getSize());

            DigitalBook digitalBook = digitalBookService.uploadDigitalBook(bookId, file, fileFormat);
            System.out.println("Digital book uploaded successfully with ID: " + digitalBook.getId());

            return ResponseEntity.ok(digitalBook);
        } catch (Exception e) {
            System.err.println("Error uploading digital book: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error uploading digital book: " + e.getMessage()));
        }
    }

    @PostMapping("/upload/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadDigitalBook(
            @PathVariable Long bookId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("format") String format) {
        try {
            DigitalBook digitalBook = digitalBookService.uploadDigitalBook(bookId, file, format);
            return ResponseEntity.ok(digitalBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Resource resource = digitalBookService.loadFileAsResource(fileName);

            // Determine content type
            String contentType = "application/octet-stream";
            if (fileName.toLowerCase().endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.toLowerCase().endsWith(".epub")) {
                contentType = "application/epub+zip";
            } else if (fileName.toLowerCase().endsWith(".mobi")) {
                contentType = "application/x-mobipocket-ebook";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/read/{digitalBookId}")
    public ResponseEntity<Resource> readDigitalBook(@PathVariable Long digitalBookId) {
        try {
            // Get digital book details
            DigitalBook digitalBook = digitalBookService.getAllDigitalBooks().stream()
                    .filter(db -> db.getId().equals(digitalBookId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Digital book not found"));

            // Check access permissions
            if (!digitalBookService.hasDigitalAccess(digitalBook.getBook().getId())) {
                return ResponseEntity.status(403).build();
            }

            // Extract filename from URL
            String fileName = digitalBook.getFileUrl().substring(digitalBook.getFileUrl().lastIndexOf("/") + 1);
            Resource resource = digitalBookService.loadFileAsResource(fileName);

            String contentType = digitalBookService.getContentType(digitalBook.getFileFormat());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{digitalBookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDigitalBook(@PathVariable Long digitalBookId) {
        try {
            digitalBookService.deleteDigitalBook(digitalBookId);
            return ResponseEntity.ok(new SuccessResponse("Digital book deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{digitalBookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDigitalBook(@PathVariable Long digitalBookId, @RequestBody UpdateFormatRequest request) {
        try {
            DigitalBook updatedDigitalBook = digitalBookService.updateDigitalBook(digitalBookId, request.getFormat());
            return ResponseEntity.ok(updatedDigitalBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error: " + e.getMessage()));
        }
    }

    // Inner classes for requests and responses
    public static class UpdateFormatRequest {
        private String format;

        public String getFormat() {
            return format;
        }

        public void setFormat(String format) {
            this.format = format;
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
}
