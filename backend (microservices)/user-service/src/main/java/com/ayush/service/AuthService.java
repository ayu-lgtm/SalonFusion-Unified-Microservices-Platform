package com.ayush.service;

import com.ayush.exception.UserException;
import com.ayush.payload.request.SignupDto;
import com.ayush.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password) throws Exception;
    AuthResponse signup(SignupDto req) throws Exception;
    AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception;
}
