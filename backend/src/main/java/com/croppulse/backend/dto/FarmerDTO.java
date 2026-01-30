package com.croppulse.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class FarmerDTO {

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
