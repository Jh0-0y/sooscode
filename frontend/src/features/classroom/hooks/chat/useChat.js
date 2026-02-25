import { useEffect, useState, useCallback, useRef } from 'react';
import chatApi from "@/features/classroom/services/chatApi.js";

/**
 * 채팅 훅
 * - 메시지 전송/수신
 * - 히스토리 로드
 * - 삭제 처리
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 */
export const useChat = ({
                            classId,
                            isConnected = false,
                        } = {}) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const mountedRef = useRef(true);
    const hasLoadedHistoryRef = useRef(false);
    const currentClassIdRef = useRef(null);

    // 메시지 수신 핸들러
    const handleMessage = useCallback((data) => {
        if (!mountedRef.current) return;

        switch (data.type) {
            case 'CHAT':
                // 새 메시지 추가
                setMessages(prev => [...prev, data]);
                break;
            case 'DELETE':
                // 메시지 삭제 처리
                setMessages(prev =>
                    prev.map(msg =>
                        msg.chatId === data.chatId
                            ? { ...msg, deleted: true, content: '삭제된 메시지입니다.' }
                            : msg
                    )
                );
                break;
            case 'REACTION':
                // 리액션 카운트 업데이트
                setMessages(prev =>
                    prev.map(msg =>
                        msg.chatId === data.chatId
                            ? { ...msg, reactionCount: data.count }
                            : msg
                    )
                );
                break;
            case 'SYSTEM':
                // 시스템 메시지 추가
                setMessages(prev => [...prev, { ...data, isSystem: true }]);
                break;
            default:
                console.log('알 수 없는 메시지 타입:', data);
        }
    }, []);

    // 히스토리 로드
    const loadHistory = useCallback(async () => {
        if (!classId) return;

        setIsLoading(true);
        try {
            const response = await chatApi.getHistory(classId);
            if (response && mountedRef.current) {
                setMessages(response.messages || []);
                hasLoadedHistoryRef.current = true;
                console.log('[useChat] 히스토리 로드 성공:', response.messages?.length || 0, '개');
            }
        } catch (error) {
            console.error('[useChat] 채팅 히스토리 로드 실패:', error);
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [classId]);

    // 메시지 전송
    const sendMessage = useCallback((content, replyToChatId = null) => {
        if (!classId || !isConnected || !content.trim()) return;
        chatApi.sendMessage(classId, content.trim(), replyToChatId);
    }, [classId, isConnected]);

    // 메시지 삭제
    const deleteMessage = useCallback((chatId) => {
        if (!classId || !isConnected) return;
        chatApi.deleteMessage(classId, chatId);
    }, [classId, isConnected]);

    // 초기화 및 구독
    useEffect(() => {
        if (!classId || !isConnected) return;

        mountedRef.current = true;

        // 히스토리를 아직 로드하지 않았을 때만 로드
        if (!hasLoadedHistoryRef.current) {
            console.log('[useChat] 히스토리 로드 시작');
            loadHistory();
        } else {
            console.log('[useChat] 히스토리 이미 로드됨, 스킵');
        }

        // 채팅 구독
        chatApi.subscribeChat(classId, handleMessage);

        return () => {
            mountedRef.current = false;
            chatApi.unsubscribeChat(classId);
        };
    }, [classId, isConnected, handleMessage]);

    return {
        messages,
        isLoading,
        sendMessage,
        deleteMessage,
        loadHistory,
    };
};