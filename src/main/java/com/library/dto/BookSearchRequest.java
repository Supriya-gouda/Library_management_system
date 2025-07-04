package com.library.dto;

public class BookSearchRequest {
    private String title;
    private String author;
    private String genre;
    private String keyword;
    private Boolean availableOnly;
    private Boolean digitalOnly;

    // Constructors
    public BookSearchRequest() {}

    public BookSearchRequest(String title, String author, String genre, String keyword, 
                           Boolean availableOnly, Boolean digitalOnly) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.keyword = keyword;
        this.availableOnly = availableOnly;
        this.digitalOnly = digitalOnly;
    }

    // Getters and Setters
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

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Boolean getAvailableOnly() {
        return availableOnly;
    }

    public void setAvailableOnly(Boolean availableOnly) {
        this.availableOnly = availableOnly;
    }

    public Boolean getDigitalOnly() {
        return digitalOnly;
    }

    public void setDigitalOnly(Boolean digitalOnly) {
        this.digitalOnly = digitalOnly;
    }
}
