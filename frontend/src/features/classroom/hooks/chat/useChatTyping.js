import {useCallback, useRef, useState, useEffect} from "react";
import chatApi from "@/features/classroom/services/chatApi.js";

/**
 * 타이핑 상태 훅
 * - 타이핑 상태 전송
 * - 다른 유저 타이핑 상태 수신
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {number} options.timeout - 타이핑 종료 타임아웃 (ms)
 */
export const useTyping = ({
                              classId,
                              isConnected = false,
                              timeout = 1000,
                          } = {}) => {
    const [typingUsers, setTypingUsers] = useState([]);

    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const userTimeoutsRef = useRef({});
    const mountedRef = useRef(true);

    // 타이핑 상태 수신 핸들러
    const handleTyping = useCallback((data) => {
        if (!mountedRef.current) return;

        const { userId, username, typing } = data;

        if (typing) {
            // 타이핑 시작
            setTypingUsers(prev => {
                const exists = prev.some(u => u.userId === userId);
                if (exists) return prev;
                return [...prev, { userId, username }];
            });

            // 기존 타임아웃 클리어
            if (userTimeoutsRef.current[userId]) {
                clearTimeout(userTimeoutsRef.current[userId]);
            }

            // 새 타임아웃 설정 (일정 시간 후 자동 제거)
            userTimeoutsRef.current[userId] = setTimeout(() => {
                if (mountedRef.current) {
                    setTypingUsers(prev => prev.filter(u => u.userId !== userId));
                }
            }, 3000);
        } else {
            // 타이핑 종료
            setTypingUsers(prev => prev.filter(u => u.userId !== userId));

            if (userTimeoutsRef.current[userId]) {
                clearTimeout(userTimeoutsRef.current[userId]);
                delete userTimeoutsRef.current[userId];
            }
        }
    }, []);

    // 내 타이핑 시작
    const onKeyDown = useCallback(() => {
        if (!classId || !isConnected) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            chatApi.startTyping(classId);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current) {
                isTypingRef.current = false;
                chatApi.stopTyping(classId);
            }
            typingTimeoutRef.current = null;
        }, timeout);
    }, [classId, isConnected, timeout]);

    // 타이핑 강제 종료
    const stopTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTypingRef.current && classId) {
            isTypingRef.current = false;
            chatApi.stopTyping(classId);
        }
    }, [classId]);

    // 구독 및 cleanup
    useEffect(() => {
        if (!classId || !isConnected) return;

        mountedRef.current = true;

        chatApi.subscribeTyping(classId, handleTyping);

        return () => {
            mountedRef.current = false;
            chatApi.unsubscribeTyping(classId);
            stopTyping();

            // 모든 유저 타임아웃 클리어
            Object.values(userTimeoutsRef.current).forEach(clearTimeout);
            userTimeoutsRef.current = {};
        };
    }, [classId, isConnected, handleTyping, stopTyping]);

    return {
        typingUsers,
        onKeyDown,
        stopTyping,
    };
};