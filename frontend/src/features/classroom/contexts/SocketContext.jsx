import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useClassroomContext } from './ClassroomContext';
import websocketApi from '../services/websocketApi.js';
import classRoomApi from '../services/classRoomApi';

/**
 * WebSocket 연결 + 참여자 관리 Context
 * - WebSocket 연결 상태
 * - 참여자 목록
 * - 시스템 메시지 처리
 */
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { classId, isInstructor } = useClassroomContext();

    // 연결 상태
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    // 참여자 상태
    const [participants, setParticipants] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // 수업 모드
    const [classMode, setClassMode] = useState(null);

    const mountedRef = useRef(true);

    // 참여자 목록 업데이트 핸들러
    const handleParticipantsUpdate = useCallback((data) => {
        if (!mountedRef.current) return;

        setParticipants(data.participants || []);
        setStudents(data.participants?.filter(p => !p.instructor) || []);
        setStudentCount(data.studentCount || 0);
        setTotalCount(data.totalCount || 0);
    }, []);

    // 시스템 메시지 핸들러
    const handleSystemMessage = useCallback((data) => {
        if (!mountedRef.current) return;

        switch (data.type) {
            case 'CLASS_ENDED':
                // 수업 종료 처리 - 이벤트 발생시킬 수 있음
                console.log('[SocketContext] 수업 종료:', data.message);
                break;
            case 'KICKED':
                console.log('[SocketContext] 강퇴됨:', data.message);
                break;
            default:
                console.log('[SocketContext] 시스템 메시지:', data);
        }
    }, []);

    // 모드 변경 핸들러
    const handleModeChange = useCallback((data) => {
        if (!mountedRef.current) return;
        setClassMode(data.mode);
    }, []);

    // WebSocket 연결 및 구독
    useEffect(() => {
        if (!classId) return;

        mountedRef.current = true;
        setIsConnecting(true);
        setError(null);

        // WebSocket 연결
        websocketApi.connect(isInstructor, {
            onConnect: async () => {
                if (!mountedRef.current) return;

                setIsConnected(true);
                setIsConnecting(false);

                console.log('[SocketContext] WebSocket 연결 완료');

                // 클래스 입장 (채팅 채널 구독 = 입장 처리)
                classRoomApi.joinClass(classId, () => {});

                // 참여자 목록 구독
                classRoomApi.subscribeParticipants(classId, handleParticipantsUpdate);

                // 시스템 메시지 구독
                classRoomApi.subscribeSystem(classId, handleSystemMessage);

                // 모드 변경 구독
                classRoomApi.subscribeMode(classId, handleModeChange);

                // 초기 참여자 목록 로드
                try {
                    const response = await classRoomApi.getParticipants(classId);
                    if (response && mountedRef.current) {
                        handleParticipantsUpdate(response);
                    }
                } catch (err) {
                    console.error('[SocketContext] 참여자 목록 로드 실패:', err);
                }
            },
            onDisconnect: () => {
                if (!mountedRef.current) return;

                setIsConnected(false);
                setIsConnecting(false);
                console.log('[SocketContext] WebSocket 연결 해제');
            },
            onError: (err) => {
                if (!mountedRef.current) return;

                setIsConnecting(false);
                setError(err);
                console.error('[SocketContext] WebSocket 에러:', err);
            },
        });

        // Cleanup
        return () => {
            mountedRef.current = false;

            // 구독 해제
            classRoomApi.leaveClass(classId);

            // WebSocket 연결 해제
            websocketApi.disconnect();
        };
    }, [classId, isInstructor, handleParticipantsUpdate, handleSystemMessage, handleModeChange]);

    // 수업 모드 변경 (강사용)
    const changeMode = useCallback((mode) => {
        if (!classId || !isInstructor) return;
        classRoomApi.changeMode(classId, mode);
    }, [classId, isInstructor]);

    // 수업 종료 (강사용)
    const endClass = useCallback(async () => {
        if (!classId || !isInstructor) return;
        try {
            await classRoomApi.endClass(classId);
        } catch (err) {
            console.error('[SocketContext] 수업 종료 실패:', err);
            throw err;
        }
    }, [classId, isInstructor]);

    // 사용자 강퇴 (강사용)
    const kickUser = useCallback(async (targetUserId, reason) => {
        if (!classId || !isInstructor) return;
        try {
            await classRoomApi.kickUser(classId, targetUserId, reason);
        } catch (err) {
            console.error('[SocketContext] 강퇴 실패:', err);
            throw err;
        }
    }, [classId, isInstructor]);

    const value = {
        // 연결 상태
        isConnected,
        isConnecting,
        error,

        // 참여자
        participants,
        students,
        studentCount,
        totalCount,

        // 수업 모드
        classMode,

        // 액션 (강사용)
        changeMode,
        endClass,
        kickUser,
    };

    // 연결 중 로딩 표시
    if (isConnecting) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                클래스룸 연결 중...
            </div>
        );
    }

    // 연결 에러
    if (error && !isConnected) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>연결에 실패했습니다.</p>
                <button onClick={() => window.location.reload()}>
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within SocketProvider');
    }
    return context;
};

export default SocketContext;