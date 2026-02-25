// features/classroom/hooks/class/useCodeSync.js

import { useEffect, useCallback } from 'react';
import { useSocketContext } from '../../contexts/SocketContext';

/**
 * useCodeSync - 역할별 코드 동기화 훅
 * - 강사: 학생 코드 수신
 * - 학생: 강사 코드 수신
 */
const useCodeSync = (classId, onCodeReceived, isInstructor = false) => {
    const socket = useSocketContext();

    // 역할에 따른 구독 토픽 결정
    const subscribeTopic = isInstructor
        ? `/topic/code/student/${classId}`  // 강사는 학생 코드 구독
        : `/topic/code/instructor/${classId}`; // 학생은 강사 코드 구독

    // 코드 수신 구독
    useEffect(() => {
        if (!socket || !socket.connected) {
            console.log('[useCodeSync] 소켓 미연결');
            return;
        }

        console.log(`[useCodeSync] 구독 시작: ${subscribeTopic}`);

        const subscription = socket.subscribe(subscribeTopic, (message) => {
            try {
                const data = JSON.parse(message.body);
                console.log('[useCodeSync] 코드 수신:', data);
                onCodeReceived?.(data);
            } catch (error) {
                console.error('[useCodeSync] 코드 파싱 오류:', error);
            }
        });

        return () => {
            subscription.unsubscribe();
            console.log(`[useCodeSync] 구독 해제: ${subscribeTopic}`);
        };
    }, [socket, socket?.connected, subscribeTopic, onCodeReceived]);

    // 코드 전송 함수
    const sendCode = useCallback((codeData) => {
        if (!socket || !socket.connected) {
            console.warn('[useCodeSync] WebSocket이 연결되지 않음');
            return;
        }

        socket.publish({
            destination: `/app/code/${classId}`,
            body: JSON.stringify(codeData)
        });

        console.log('[useCodeSync] 코드 전송:', codeData.language, codeData.code?.length);
    }, [socket, socket?.connected, classId]);

    return { sendCode };
};

export default useCodeSync;