package com.ayush.payload.request;

import com.ayush.domain.UserRole;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SignupDto {
	private String email;
	private String password;
	private String phone;
	private String fullName;
	private String username;
	private UserRole role;


}