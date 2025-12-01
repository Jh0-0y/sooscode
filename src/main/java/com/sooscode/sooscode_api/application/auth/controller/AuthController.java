package com.sooscode.sooscode_api.application.auth.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.sooscode.sooscode_api.application.auth.service.AuthService;
import com.sooscode.sooscode_api.application.auth.service.GoogleAuthService;
import com.sooscode.sooscode_api.application.auth.dto.*;
import com.sooscode.sooscode_api.domain.user.dto.RegisterRequest;
import com.sooscode.sooscode_api.domain.user.entity.User;
import com.sooscode.sooscode_api.domain.user.enums.UserRole;
import com.sooscode.sooscode_api.domain.user.enums.UserStatus;
import com.sooscode.sooscode_api.domain.user.repository.UserRepository;
import com.sooscode.sooscode_api.global.config.GoogleOAuthConfig;
import com.sooscode.sooscode_api.global.jwt.JwtUtil;
import java.net.URI;
import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final GoogleAuthService googleAuthService;
    private final GoogleOAuthConfig googleOAuthConfig;
    private final UserRepository userRepository;

    // 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse tokens = authService.loginUser(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokens.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new TokenResponse(tokens.getAccessToken()));
    }

    // 구글 로그인
    @GetMapping("/google/login")
    public void googleLogin(HttpServletResponse response) throws IOException {

        String redirectUri = googleOAuthConfig.getRedirectUri();

        String url = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + googleOAuthConfig.getClientId() +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=openid%20email%20profile" +
                "&access_type=offline";

        response.sendRedirect(url);
    }

    // 구글 로그인 callback + jwt 발급
    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        GoogleOAuthToken tokenResponse = googleAuthService.getAccessToken(code);

        GoogleUserInfo userInfo = googleAuthService.getUserInfo(tokenResponse.access_token());

        String email = userInfo.email();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);

                    newUser.setPassword("GOOGLE_USER");

                    newUser.setName(userInfo.name());
                    newUser.setProvider("google");

                    newUser.setRole(UserRole.STUDENT);
                    newUser.setStatus(UserStatus.ACTIVE);

                    return userRepository.save(newUser);
                });

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("http://localhost:5173/social-success?accessToken=" + accessToken))
                .build();
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        return ResponseEntity.ok().build();
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String result = authService.registerUser(request);
        return ResponseEntity.ok(result);
    }

}
