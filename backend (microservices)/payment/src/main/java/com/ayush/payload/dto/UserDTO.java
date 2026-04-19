package com.ayush.payload.dto;

import com.ayush.domain.UserRole;
import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String fullName;
    private String email;

}
