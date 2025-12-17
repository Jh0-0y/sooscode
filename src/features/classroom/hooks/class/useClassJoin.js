// features/classroom/hooks/class/useClassJoin.js

import { useEffect } from 'react';
import { useSocketContext } from '@/features/classroom/contexts/SocketContext';

/**
 * 클래스 자동 입장 훅
 * - 채팅 채널 구독으로 클래스 멤버로 등록
 * - 컴포넌트 마운트 시 자동 실행
 */
export const useClassJoin = (classId) => {
    const socket = useSocketContext();

    useEffect(() => {
        if (!socket || !socket.connected || !classId) {
            console.log('[useClassJoin] 소켓 미연결 또는 classId 없음');
            return;
        }

        // ✅ 채팅 채널 구독 = 클래스 입장
        const chatTopic = `/topic/class/${classId}/chat`;
        console.log('[useClassJoin] 클래스 입장 (채팅 채널 구독):', chatTopic);

        const subscription = socket.subscribe(chatTopic, (data) => {
            // 채팅 메시지 수신은 ChatPanel에서 처리
            // 여기서는 단순히 구독만 유지
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log('[useClassJoin] 클래스 퇴장 (채팅 채널 구독 해제)');
            }
        };
    }, [socket, socket?.connected, classId]);
};