package com.sooscode.sooscode_api.application.auth.dto;

import com.sooscode.sooscode_api.application.userprofile.dto.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResult {
    private TokenPair tokens;
    private UserInfo user;
}