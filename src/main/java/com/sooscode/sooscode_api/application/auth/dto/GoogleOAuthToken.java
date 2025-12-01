package com.sooscode.sooscode_api.application.auth.dto;

public record GoogleOAuthToken(
        String access_token,
        String expires_in,
        String scope,
        String token_type,
        String id_token
) {}
