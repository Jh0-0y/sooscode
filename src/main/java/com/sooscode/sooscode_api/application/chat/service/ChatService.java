package com.sooscode.sooscode_api.application.chat.service;

import com.sooscode.sooscode_api.application.chat.dto.ChatMessageResponse;
import com.sooscode.sooscode_api.application.chat.dto.ChatMessageRequest;

import java.util.List;

public interface ChatService {
    void saveAndBroadcast(ChatMessageRequest chatMessageRequest);
    List<ChatMessageResponse> getHistoryByClassRoom_ClassIdOrderByCreatedAtAsc(Long classId);

}
