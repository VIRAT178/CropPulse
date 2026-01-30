package com.croppulse.backend.Controller;

import com.croppulse.backend.Service.AuthService;
import com.croppulse.backend.dto.AuthTokenDTO;
import com.croppulse.backend.dto.LoginDTO;
import com.croppulse.backend.dto.RegisterDTO;
import com.croppulse.backend.dto.ForgotPasswordDTO;
import com.croppulse.backend.dto.ResetPasswordDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthTokenDTO register(@RequestBody RegisterDTO dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public AuthTokenDTO login(@RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@RequestBody ForgotPasswordDTO dto) {
        authService.initiatePasswordReset(dto.getEmail());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody ResetPasswordDTO dto) {
        authService.resetPassword(dto.getToken(), dto.getNewPassword());
    }
}
