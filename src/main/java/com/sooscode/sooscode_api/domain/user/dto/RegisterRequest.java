package com.sooscode.sooscode_api.domain.user.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
}
