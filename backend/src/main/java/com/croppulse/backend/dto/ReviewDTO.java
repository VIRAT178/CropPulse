package com.croppulse.backend.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private String text;
    private String author;
    private Double rating;
    private String date;
}
