import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

const useSocket = (classroomId) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const connect = useCallback(() => {
        if (!classroomId) return;
        if (clientRef.current?.connected) return;

        const client = new Client({
            // SockJS 사용 - 쿠키 자동 포함됨
            webSocketFactory: () => new SockJS(SOCKET_URL, null, {
                transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            }),

            // 재연결 설정
            reconnectDelay: 3000,

            // 연결 성공
            onConnect: () => {
                console.log('[WebSocket] 연결 성공');
                setConnected(true);
                setError(null);
                reconnectAttempts.current = 0;
            },

            // 연결 해제
            onDisconnect: () => {
                console.log('[WebSocket] 연결 해제');
                setConnected(false);
            },

            // STOMP 에러
            onStompError: (frame) => {
                console.error('[WebSocket] STOMP 에러:', frame.headers['message']);
                setError(frame.headers['message'] || '연결 오류');
                setConnected(false);
            },

            // WebSocket 에러
            onWebSocketError: (event) => {
                console.error('[WebSocket] 연결 에러:', event);
                setError('서버에 연결할 수 없습니다.');
            },

            // 연결 끊김 시 재연결 시도
            onWebSocketClose: () => {
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current += 1;
                    console.log(`[WebSocket] 재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`);
                } else {
                    setError('연결이 끊어졌습니다. 페이지를 새로고침 해주세요.');
                }
            },
        });

        client.activate();
        clientRef.current = client;
    }, [classroomId]);

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setConnected(false);
        }
    }, []);

    const subscribe = useCallback((destination, callback) => {
        if (!clientRef.current?.connected) {
            console.warn('[WebSocket] 연결되지 않은 상태에서 구독 시도:', destination);
            return null;
        }

        console.log('[WebSocket] 구독:', destination);
        return clientRef.current.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (e) {
                callback(message.body);
            }
        });
    }, []);

    const publish = useCallback((destination, body) => {
        if (!clientRef.current?.connected) {
            console.warn('[WebSocket] 연결되지 않은 상태에서 발행 시도:', destination);
            return;
        }

        console.log('[WebSocket] 발행:', destination, body);
        clientRef.current.publish({
            destination,
            body: JSON.stringify(body),
        });
    }, []);

    // 컴포넌트 마운트 시 연결
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        connected,
        error,
        subscribe,
        publish,
        connect,
        disconnect,
    };
};

export default useSocket;