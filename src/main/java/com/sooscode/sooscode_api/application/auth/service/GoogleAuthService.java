package com.sooscode.sooscode_api.application.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.sooscode.sooscode_api.application.auth.dto.GoogleOAuthToken;
import com.sooscode.sooscode_api.application.auth.dto.GoogleUserInfo;
import com.sooscode.sooscode_api.global.config.GoogleOAuthConfig;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final GoogleOAuthConfig googleOAuthConfig;

    // code → token
    public GoogleOAuthToken getAccessToken(String code) {

        String url = "https://oauth2.googleapis.com/token";

        System.out.println(">>> GOOGLE client_id = " + googleOAuthConfig.getClientId());
        System.out.println(">>> GOOGLE redirect_uri = " + googleOAuthConfig.getRedirectUri());


        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", googleOAuthConfig.getClientId());
        params.add("client_secret", googleOAuthConfig.getClientSecret());
        params.add("redirect_uri", googleOAuthConfig.getRedirectUri());
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> request = new HttpEntity<>(params, headers);

        return restTemplate.postForObject(url, request, GoogleOAuthToken.class);

    }

    public GoogleUserInfo getUserInfo(String accessToken) {
        String url = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<?> request = new HttpEntity<>(headers);

        return restTemplate.exchange(url, HttpMethod.GET, request, GoogleUserInfo.class)
                .getBody();
    }
}
