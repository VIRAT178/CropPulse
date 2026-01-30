package com.croppulse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIChatMessageDTO {
    private String message;
    private String userRole; // "farmer" or "buyer"
}
