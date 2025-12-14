package com.sooscode.sooscode_api.application.code.service;

import com.sooscode.sooscode_api.application.code.dto.AutoSaveDto;
import com.sooscode.sooscode_api.application.code.dto.CodeShareDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutoSaveService {

    private final RedisTemplate<String, Object> redisTemplate;

    // Redis 키 생성: auto-save:{classId}:{userId}
    private String generateKey(Long classId, Long userId) {
        return String.format("auto-save:%d:%d", classId, userId);
    }

    /**
     * 자동 저장
     * TTL 7일 (일주일 후 자동 삭제)
     */
    public void autoSave(CodeShareDto dto) {
        String key = generateKey(dto.getClassId(), dto.getUserId());

        AutoSaveDto autoSaveDto = AutoSaveDto.from(dto);

        // Redis에 저장 (7일 TTL)
        redisTemplate.opsForValue().set(key, autoSaveDto, Duration.ofDays(7));

        log.info("AUTO-SAVE SUCCESS — classId={}, userId={}, codeLength={}",
                dto.getClassId(), dto.getUserId(),
                dto.getCode() != null ? dto.getCode().length() : 0);
    }

    /**
     * 자동 저장된 코드 불러오기
     */
    public AutoSaveDto getAutoSaved(Long classId, Long userId) {
        String key = generateKey(classId, userId);

        Object value = redisTemplate.opsForValue().get(key);

        if (value instanceof AutoSaveDto) {
            log.info("AUTO-SAVE LOADED — classId={}, userId={}", classId, userId);
            return (AutoSaveDto) value;
        }

        log.info("AUTO-SAVE NOT FOUND — classId={}, userId={}", classId, userId);
        return null;
    }


}