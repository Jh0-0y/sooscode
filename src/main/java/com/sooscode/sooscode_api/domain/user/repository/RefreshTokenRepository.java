package com.sooscode.sooscode_api.domain.user.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sooscode.sooscode_api.domain.user.entity.RefreshToken;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    /**
     * Refresh Token 문자열로 조회
     */
    Optional<RefreshToken> findByTokenValue(String tokenValue);

    /**
     * 특정 사용자 RT 삭제 (로그인·로그아웃 시 사용)
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken r WHERE r.userId = :userId")
    void deleteByUserId(Long userId);

    /**
     * 특정 사용자 RT 조회 (AT 재발급 시 사용자 기반 조회)
     */
    Optional<RefreshToken> findByUserId(Long userId);
}
