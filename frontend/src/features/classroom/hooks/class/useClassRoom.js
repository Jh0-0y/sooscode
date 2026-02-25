import { useEffect, useState, useCallback, useRef } from 'react';
import classRoomApi from '../../services/classRoomApi';

/**
 * 클래스룸 관리 훅
 * - 클래스 입장/퇴장
 * - 참여자 목록 관리
 * - 시스템 메시지 처리
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {function} options.onClassEnd - 수업 종료 콜백
 * @param {function} options.onKicked - 강퇴당함 콜백
 */
export const useClassRoom = ({
                                 classId,
                                 isConnected = false,
                                 onClassEnd,
                                 onKicked,
                             } = {}) => {
    const [participants, setParticipants] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [isJoined, setIsJoined] = useState(false);
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
                onClassEnd?.(data.message);
                break;
            case 'KICKED':
                onKicked?.(data.message);
                break;
            default:
                console.log('시스템 메시지:', data);
        }
    }, [onClassEnd, onKicked]);

    // 모드 변경 핸들러
    const handleModeChange = useCallback((data) => {
        if (!mountedRef.current) return;
        setClassMode(data.mode);
    }, []);

    // 클래스 입장
    const joinClass = useCallback(async () => {
        if (!classId || !isConnected || isJoined) return;

        try {
            // 채팅 채널 구독 (= 입장 처리)
            classRoomApi.joinClass(classId, () => {});

            // 참여자 목록 구독
            classRoomApi.subscribeParticipants(classId, handleParticipantsUpdate);

            // 시스템 메시지 구독
            classRoomApi.subscribeSystem(classId, handleSystemMessage);

            // 모드 변경 구독
            classRoomApi.subscribeMode(classId, handleModeChange);

            // 초기 참여자 목록 로드
            const response = await classRoomApi.getParticipants(classId);
            if (response && mountedRef.current) {
                handleParticipantsUpdate(response);
            }

            setIsJoined(true);
        } catch (error) {
            console.error('클래스 입장 실패:', error);
        }
    }, [classId, isConnected, isJoined, handleParticipantsUpdate, handleSystemMessage, handleModeChange]);

    // 클래스 퇴장
    const leaveClass = useCallback(() => {
        if (!classId) return;

        classRoomApi.leaveClass(classId);
        setIsJoined(false);
        setParticipants([]);
        setStudents([]);
    }, [classId]);

    // 수업 모드 변경 (강사용)
    const changeMode = useCallback((mode) => {
        if (!classId) return;
        classRoomApi.changeMode(classId, mode);
    }, [classId]);

    // 수업 종료 (강사용)
    const endClass = useCallback(async () => {
        if (!classId) return;
        try {
            await classRoomApi.endClass(classId);
        } catch (error) {
            console.error('수업 종료 실패:', error);
            throw error;
        }
    }, [classId]);

    // 사용자 강퇴 (강사용)
    const kickUser = useCallback(async (userId, reason) => {
        if (!classId) return;
        try {
            await classRoomApi.kickUser(classId, userId, reason);
        } catch (error) {
            console.error('강퇴 실패:', error);
            throw error;
        }
    }, [classId]);

    // WebSocket 연결 시 자동 입장
    useEffect(() => {
        if (isConnected && classId && !isJoined) {
            joinClass();
        }
    }, [isConnected, classId, isJoined, joinClass]);

    // 언마운트 시 퇴장
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            if (isJoined) {
                leaveClass();
            }
        };
    }, []);

    return {
        // 상태
        participants,
        students,
        studentCount,
        totalCount,
        isJoined,
        classMode,

        // 액션
        joinClass,
        leaveClass,
        changeMode,
        endClass,
        kickUser,
    };
};

export default useClassRoom;