package com.croppulse.backend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "farmers")
public class Farmer {

    public static final String SEQUENCE_NAME = "farmers_sequence";

    @Id
    private Long id;

    @NotBlank
    private String email;

    @NotBlank
    private String name;
    @NotBlank
    private String village;
    @NotBlank
    private String state;
    @NotNull
    @Positive
    private Double landSize; // in acres
    @NotBlank
    private String soilType;
}
