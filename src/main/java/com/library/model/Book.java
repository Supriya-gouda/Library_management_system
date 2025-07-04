package com.library.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @Size(max = 100)
    private String author;

    @Size(max = 50)
    private String genre;

    @Min(0)
    @Column(name = "available_copies")
    private Integer availableCopies;

    @Min(1)
    @Column(name = "total_copies")
    private Integer totalCopies;

    @Column(name = "has_digital_copy")
    private Boolean hasDigitalCopy = false;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Borrowing> borrowings;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DigitalBook> digitalBooks;

    // Constructors
    public Book() {}

    public Book(String title, String author, String genre, Integer totalCopies) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
        this.hasDigitalCopy = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }

    public Integer getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public Boolean getHasDigitalCopy() {
        return hasDigitalCopy;
    }

    public void setHasDigitalCopy(Boolean hasDigitalCopy) {
        this.hasDigitalCopy = hasDigitalCopy;
    }

    public List<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(List<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }

    public List<DigitalBook> getDigitalBooks() {
        return digitalBooks;
    }

    public void setDigitalBooks(List<DigitalBook> digitalBooks) {
        this.digitalBooks = digitalBooks;
    }

    // Helper method to check availability
    public boolean isAvailable() {
        return availableCopies != null && availableCopies > 0;
    }
}
