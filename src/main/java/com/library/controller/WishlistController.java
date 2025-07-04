package com.library.controller;

import com.library.model.Book;
import com.library.model.Member;
import com.library.model.Wishlist;
import com.library.repository.BookRepository;
import com.library.repository.WishlistRepository;
import com.library.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Wishlist>> getWishlist() {
        try {
            Member currentMember = authService.getCurrentMember();
            List<Wishlist> wishlist = wishlistRepository.findByMemberId(currentMember.getId());
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addToWishlist(@PathVariable Long bookId) {
        try {
            Member currentMember = authService.getCurrentMember();
            
            // Check if book exists
            Optional<Book> bookOpt = bookRepository.findById(bookId);
            if (!bookOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Book not found");
            }
            
            Book book = bookOpt.get();
            
            // Check if already in wishlist
            if (wishlistRepository.existsByMemberIdAndBookId(currentMember.getId(), bookId)) {
                return ResponseEntity.badRequest().body("Book already in wishlist");
            }
            
            // Add to wishlist
            Wishlist wishlistItem = new Wishlist(currentMember, book);
            Wishlist saved = wishlistRepository.save(wishlistItem);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding to wishlist: " + e.getMessage());
        }
    }

    @DeleteMapping("/{bookId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long bookId) {
        try {
            Member currentMember = authService.getCurrentMember();
            
            Optional<Wishlist> wishlistItem = wishlistRepository.findByMemberIdAndBookId(
                currentMember.getId(), bookId);
            
            if (!wishlistItem.isPresent()) {
                return ResponseEntity.badRequest().body("Book not in wishlist");
            }
            
            wishlistRepository.delete(wishlistItem.get());
            return ResponseEntity.ok().body("Book removed from wishlist");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing from wishlist: " + e.getMessage());
        }
    }
}
