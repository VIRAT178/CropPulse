package com.croppulse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthTokenDTO {
    private String token;
    private String email;
    private String role;
    private Long id;
    private String name;
}
