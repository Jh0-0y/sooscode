import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { SOCKET_URL } from '@/services/api';

/**
 * WebSocket 연결 관리
 * - STOMP 클라이언트 생성/연결/해제
 * - 구독 관리
 */

let stompClient = null;
let subscriptions = {};

export const websocketApi = {
    /**
     * WebSocket 연결
     * @param {boolean} isInstructor - 강사 여부
     * @param {function} onConnect - 연결 성공 콜백
     * @param {function} onDisconnect - 연결 해제 콜백
     * @param {function} onError - 에러 콜백
     */
    connect: (isInstructor, { onConnect, onDisconnect, onError } = {}) => {
        if (stompClient?.connected) {
            console.log('이미 연결되어 있습니다.');
            return stompClient;
        }

        stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                isInstructor: String(isInstructor),
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket 연결됨');
                onConnect?.();
            },
            onDisconnect: () => {
                console.log('WebSocket 연결 해제됨');
                subscriptions = {};
                onDisconnect?.();
            },
            onStompError: (frame) => {
                console.error('STOMP 에러:', frame);
                onError?.(frame);
            },
        });

        stompClient.activate();
        return stompClient;
    },

    /**
     * WebSocket 연결 해제
     */
    disconnect: () => {
        if (stompClient) {
            // 모든 구독 해제
            Object.values(subscriptions).forEach(sub => sub?.unsubscribe());
            subscriptions = {};

            stompClient.deactivate();
            stompClient = null;
            console.log('WebSocket 연결 해제 완료');
        }
    },

    /**
     * 연결 상태 확인
     */
    isConnected: () => {
        return stompClient?.connected ?? false;
    },

    /**
     * STOMP 클라이언트 반환
     */
    getClient: () => stompClient,

    /**
     * 토픽 구독
     * @param {string} topic - 구독할 토픽
     * @param {function} callback - 메시지 수신 콜백
     * @param {string} subscriptionId - 구독 ID (선택, 중복 구독 방지용)
     */
    subscribe: (topic, callback, subscriptionId = null) => {
        if (!stompClient?.connected) {
            console.error('WebSocket이 연결되지 않았습니다.');
            return null;
        }

        const subId = subscriptionId || topic;

        // 기존 구독이 있으면 해제
        if (subscriptions[subId]) {
            subscriptions[subId].unsubscribe();
        }

        const subscription = stompClient.subscribe(topic, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (e) {
                console.error('메시지 파싱 에러:', e);
            }
        });

        subscriptions[subId] = subscription;
        return subscription;
    },

    /**
     * 구독 해제
     * @param {string} subscriptionId - 구독 ID
     */
    unsubscribe: (subscriptionId) => {
        if (subscriptions[subscriptionId]) {
            subscriptions[subscriptionId].unsubscribe();
            delete subscriptions[subscriptionId];
        }
    },

    /**
     * 메시지 전송
     * @param {string} destination - 전송 경로
     * @param {object} body - 전송 데이터
     */
    send: (destination, body) => {
        if (!stompClient?.connected) {
            console.error('WebSocket이 연결되지 않았습니다.');
            return;
        }

        stompClient.publish({
            destination,
            body: JSON.stringify(body),
        });
    },
};

export default websocketApi;