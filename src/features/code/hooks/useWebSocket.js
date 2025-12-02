import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useWebSocket = (roomId, userType) => {
    const stompClient = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [receivedCode, setReceivedCode] = useState('');

    useEffect(() => {
        const socket = new SockJS('http://your-server/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setIsConnected(true);

            // 코드 업데이트 구독
            client.subscribe(`/topic/code/${roomId}`, (message) => {
                const data = JSON.parse(message.body);
                setReceivedCode(data.code);
            });
        });

        stompClient.current = client;

        return () => {
            if (client.connected) {
                client.disconnect();
            }
        };
    }, [roomId]);

    const sendCode = (code) => {
        if (stompClient.current?.connected) {
            stompClient.current.send(
                `/app/code/${roomId}`,
                {},
                JSON.stringify({ code, userType })
            );
        }
    };

    return { isConnected, receivedCode, sendCode };
};