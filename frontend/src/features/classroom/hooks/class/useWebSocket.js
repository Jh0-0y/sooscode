import { useEffect, useRef, useCallback, useState } from 'react';
import websocketApi from '../../services/websocketApi.js';

/**
 * WebSocket 연결 관리 훅
 *
 * @param {Object} options
 * @param {boolean} options.isInstructor - 강사 여부
 * @param {boolean} options.autoConnect - 자동 연결 여부 (기본: true)
 * @param {function} options.onConnect - 연결 성공 콜백
 * @param {function} options.onDisconnect - 연결 해제 콜백
 * @param {function} options.onError - 에러 콜백
 */
export const useWebSocket = ({
                                 isInstructor = false,
                                 autoConnect = true,
                                 onConnect,
                                 onDisconnect,
                                 onError,
                             } = {}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const mountedRef = useRef(true);

    const connect = useCallback(() => {
        if (websocketApi.isConnected()) {
            setIsConnected(true);
            return;
        }

        setIsConnecting(true);

        websocketApi.connect(isInstructor, {
            onConnect: () => {
                if (mountedRef.current) {
                    setIsConnected(true);
                    setIsConnecting(false);
                    onConnect?.();
                }
            },
            onDisconnect: () => {
                if (mountedRef.current) {
                    setIsConnected(false);
                    setIsConnecting(false);
                    onDisconnect?.();
                }
            },
            onError: (error) => {
                if (mountedRef.current) {
                    setIsConnecting(false);
                    onError?.(error);
                }
            },
        });
    }, [isInstructor, onConnect, onDisconnect, onError]);

    const disconnect = useCallback(() => {
        websocketApi.disconnect();
        setIsConnected(false);
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        if (autoConnect) {
            connect();
        }

        return () => {
            mountedRef.current = false;
        };
    }, [autoConnect, connect]);

    return {
        isConnected,
        isConnecting,
        connect,
        disconnect,
    };
};

export default useWebSocket;