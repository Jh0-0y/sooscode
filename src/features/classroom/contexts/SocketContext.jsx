// features/classroom/contexts/SocketContext.jsx

import { createContext, useContext } from 'react';
import useSocket from '../hooks/class/useSocket';

// Context 생성
const SocketContext = createContext(null);

/**
 * SocketProvider
 * - WebSocket을 한 번만 연결하고 하위 컴포넌트들에게 공유
 * - ClassroomPage 최상위에서 사용
 */
export const SocketProvider = ({ classId, children }) => {
    const socket = useSocket(classId);  // 여기서 한 번만 연결

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

/**
 * useSocketContext
 * - 하위 컴포넌트/훅에서 소켓을 가져다 쓰는 훅
 * - SocketProvider 내부에서만 사용 가능
 */
export const useSocketContext = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocketContext는 SocketProvider 내부에서만 사용 가능합니다');
    }

    return context;
};