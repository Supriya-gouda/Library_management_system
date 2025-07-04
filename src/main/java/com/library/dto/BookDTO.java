package com.library.dto;

public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String genre;
    private Integer availableCopies;
    private Integer totalCopies;
    private Boolean hasDigitalCopy;

    // Constructors
    public BookDTO() {}

    public BookDTO(Long id, String title, String author, String genre, 
                   Integer availableCopies, Integer totalCopies, Boolean hasDigitalCopy) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.availableCopies = availableCopies;
        this.totalCopies = totalCopies;
        this.hasDigitalCopy = hasDigitalCopy;
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
}
