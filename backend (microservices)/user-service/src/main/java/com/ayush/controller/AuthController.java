package com.ayush.controller;



import com.ayush.payload.request.LoginDto;
import com.ayush.payload.request.SignupDto;
import com.ayush.payload.response.ApiResponse;
import com.ayush.payload.response.ApiResponseBody;

import com.ayush.payload.response.AuthResponse;


import com.ayush.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse> HomeControllerHandler() {

        return ResponseEntity.status(
                        HttpStatus.OK)
                .body(new ApiResponse(

                        "welcome to ayush property booking system, user api"

                ));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseBody<AuthResponse>> signupHandler(
            @RequestBody SignupDto req) throws Exception {

        System.out.println("signup dto "+req);
        AuthResponse response=authService.signup(req);

        return ResponseEntity.ok(new ApiResponseBody<>(
                true,
                "User created successfully", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseBody<AuthResponse>> loginHandler(
            @RequestBody LoginDto req) throws Exception {

        AuthResponse response=authService.login(req.getEmail(), req.getPassword());

        return ResponseEntity.ok(new ApiResponseBody<>(
                true,
                "User logged in successfully",
                response)
        );
    }

    @GetMapping("/access-token/refresh-token/{refreshToken}")
    public ResponseEntity<ApiResponseBody<AuthResponse>> getAccessTokenHandler(
            @PathVariable String refreshToken) throws Exception {

        AuthResponse response = authService.getAccessTokenFromRefreshToken(refreshToken);

        return ResponseEntity.ok(new ApiResponseBody<>(
                true,
                "refresh token received successfully",
                response
        ));
    }

}
