package com.sooscode.sooscode_api.application.classroom.controller;

import com.sooscode.sooscode_api.domain.classroom.enums.ClassMode;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ClassModeController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 수업 모드 변경 메시지 처리
     * 클라이언트가 /app/mode/{classId}로 메시지를 보내면
     * /topic/mode/{classId}를 구독한 모든 클라이언트에게 브로드캐스트
     */
    @MessageMapping("/mode/{classId}")
    public void changeMode(@DestinationVariable String classId, ClassMode classmode) {
        // 해당 클래스의 모든 구독자에게 모드 변경 메시지 전송
        messagingTemplate.convertAndSend("/topic/mode/" + classId, classmode);
    }
}
