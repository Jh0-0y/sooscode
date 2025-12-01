package com.sooscode.sooscode_api.application.auth.dto;

public record GoogleUserInfo(
        String email,
        String name,
        String picture
) {}