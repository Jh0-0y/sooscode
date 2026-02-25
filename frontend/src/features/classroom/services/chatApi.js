import { api } from '@/services/api';
import websocketApi from './websocketApi.js';

const BASE_URL = '/api/chat';

/**
 * 채팅 API
 * - 메시지 전송/삭제
 * - 리액션
 * - 타이핑 상태
 * - 히스토리 조회
 */
export const chatApi = {
    // ==================== REST API ====================

    /**
     * 채팅 히스토리 조회
     * GET /api/chat/history?classId={classId}
     */
    getHistory: async (classId) => {
        try {
            const response = await api.get(`${BASE_URL}/history?classId=${classId}`);
            // ApiResponse 구조: { status, message, data }
            // data 안에 { classId, messages, totalCount } 있음
            return response.data || response; // data 필드 확인
        } catch (error) {
            throw error;
        }
    },

    /**
     * 리액션한 유저 목록 조회
     * GET /api/chat/{chatId}/reactions
     */
    getReactionUsers: async (chatId) => {
        try {
            const response = await api.get(`${BASE_URL}/${chatId}/reactions`);
            return response.data || response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 내가 리액션했는지 확인
     * GET /api/chat/{chatId}/reacted
     */
    hasReacted: async (chatId) => {
        try {
            const response = await api.get(`${BASE_URL}/${chatId}/reacted`);
            return response.data || response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * 리액션 토글 (REST 방식)
     * POST /api/chat/reaction
     */
    toggleReactionRest: async (chatId) => {
        try {
            const response = await api.post(`${BASE_URL}/reaction`, { chatId });
            return response.data || response;
        } catch (error) {
            throw error;
        }
    },

    // ==================== WebSocket 구독 ====================

    /**
     * 채팅 메시지 구독
     * 구독: /topic/class/{classId}/chat
     *
     * 메시지 타입:
     * - CHAT: 일반 메시지
     * - DELETE: 삭제됨
     * - REACTION: 리액션 업데이트
     * - SYSTEM: 시스템 메시지
     */
    subscribeChat: (classId, onMessage) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/chat`,
            (data) => {
                // 타입별 분기 처리
                onMessage(data);
            },
            `chat-${classId}`
        );
    },

    /**
     * 채팅 구독 해제
     */
    unsubscribeChat: (classId) => {
        websocketApi.unsubscribe(`chat-${classId}`);
    },

    /**
     * 타이핑 상태 구독
     * 구독: /topic/class/{classId}/typing
     */
    subscribeTyping: (classId, onTyping) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/typing`,
            onTyping,
            `typing-${classId}`
        );
    },

    /**
     * 타이핑 구독 해제
     */
    unsubscribeTyping: (classId) => {
        websocketApi.unsubscribe(`typing-${classId}`);
    },

    // ==================== WebSocket 전송 ====================

    /**
     * 채팅 메시지 전송
     * 전송: /app/chat/{classId}/send
     */
    sendMessage: (classId, content, replyToChatId = null) => {
        websocketApi.send(`/app/chat/${classId}/send`, {
            content,
            replyToChatId,
        });
    },

    /**
     * 채팅 메시지 삭제
     * 전송: /app/chat/{classId}/delete
     */
    deleteMessage: (classId, chatId) => {
        websocketApi.send(`/app/chat/${classId}/delete`, {
            chatId,
        });
    },

    /**
     * 리액션 토글 (WebSocket 방식)
     * 전송: /app/chat/{classId}/reaction
     */
    toggleReaction: (classId, chatId) => {
        websocketApi.send(`/app/chat/${classId}/reaction`, {
            chatId,
        });
    },

    /**
     * 타이핑 시작 알림
     * 전송: /app/chat/{classId}/typing
     */
    startTyping: (classId) => {
        websocketApi.send(`/app/chat/${classId}/typing`, {
            classId,
            typing: true,
        });
    },

    /**
     * 타이핑 종료 알림
     * 전송: /app/chat/{classId}/typing
     */
    stopTyping: (classId) => {
        websocketApi.send(`/app/chat/${classId}/typing`, {
            classId,
            typing: false,
        });
    },

    // ==================== 유틸리티 ====================

    /**
     * 디바운스된 타이핑 알림 생성
     * - 타이핑 시작 시 startTyping
     * - 일정 시간 입력 없으면 stopTyping
     */
    createTypingNotifier: (classId, delay = 1000) => {
        let timeoutId = null;
        let isTyping = false;

        return {
            onKeyDown: () => {
                if (!isTyping) {
                    isTyping = true;
                    chatApi.startTyping(classId);
                }

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(() => {
                    isTyping = false;
                    chatApi.stopTyping(classId);
                    timeoutId = null;
                }, delay);
            },

            stop: () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (isTyping) {
                    isTyping = false;
                    chatApi.stopTyping(classId);
                }
            },
        };
    },
};

export default chatApi;