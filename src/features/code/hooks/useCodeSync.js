import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export const useCodeSync = (roomId, userType, isReadOnly = false) => {
    const [localCode, setLocalCode] = useState('');
    const { isConnected, receivedCode, sendCode } = useWebSocket(roomId, userType);

    // 읽기 전용인 경우 받은 코드를 그대로 표시
    useEffect(() => {
        if (isReadOnly && receivedCode) {
            setLocalCode(receivedCode);
        }
    }, [receivedCode, isReadOnly]);

    // 코드 변경 핸들러 (강사용)
    const handleCodeChange = useCallback((newCode) => {
        setLocalCode(newCode);
        if (!isReadOnly) {
            sendCode(newCode);
        }
    }, [isReadOnly, sendCode]);

    return {
        code: localCode,
        setCode: handleCodeChange,
        isConnected
    };
};