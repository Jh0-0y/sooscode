import { api } from '@/services/api';
import websocketApi from './websocketApi.js';

const BASE_URL = '/api/class';

/**
 * 클래스룸 API
 * - 참여자 목록 조회
 * - 코드 조회
 * - 수업 관리
 */
export const classRoomApi = {
    // ==================== REST API ===================
    /**
     * 클래스 접근 권한(초기 로드)
     * GET /api/class/{classId}/code/instructor
     */
    joinClassroom: (classId) => {
        return api.get(`/api/classroom/${classId}`);
    },

    /**
     * 강사 코드 조회 (학생용 - 초기 로드)
     * GET /api/class/{classId}/code/instructor
     */
    getInstructorCode: (classId) => {
        return api.get(`${BASE_URL}/${classId}/code/instructor`);
    },

    /**
     * 학생 코드 조회 (강사용 - 초기 로드)
     * GET /api/class/{classId}/code/student/{studentId}
     */
    getStudentCode: (classId, studentId) => {
        return api.get(`${BASE_URL}/${classId}/code/student/${studentId}`);
    },

    /**
     * 전체 참여자 목록 조회
     * GET /api/class/{classId}/participants
     */
    getParticipants: (classId) => {
        return api.get(`${BASE_URL}/${classId}/participants`);
    },

    /**
     * 학생 목록만 조회 (강사용)
     * GET /api/class/{classId}/students
     */
    getStudents: (classId) => {
        return api.get(`${BASE_URL}/${classId}/students`);
    },

    /**
     * 접속자 수 조회
     * GET /api/class/{classId}/count
     */
    getMemberCount: (classId) => {
        return api.get(`${BASE_URL}/${classId}/count`);
    },

    /**
     * 수업 종료
     * POST /api/class/{classId}/end
     */
    endClass: (classId) => {
        return api.post(`${BASE_URL}/${classId}/end`);
    },

    /**
     * 사용자 강제 퇴장
     * POST /api/class/{classId}/kick/{userId}
     */
    kickUser: (classId, userId, reason = null) => {
        const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return api.post(`${BASE_URL}/${classId}/kick/${userId}${params}`);
    },

    // ==================== WebSocket 구독 ====================

    /**
     * 클래스 입장 (채팅 채널 구독 = 입장 처리)
     * 구독: /topic/class/{classId}/chat
     */
    joinClass: (classId, onMessage) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/chat`,
            onMessage,
            `class-${classId}-chat`
        );
    },

    /**
     * 참여자 목록 구독
     * 구독: /topic/class/{classId}/participants
     */
    subscribeParticipants: (classId, onUpdate) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/participants`,
            onUpdate,
            `class-${classId}-participants`
        );
    },

    /**
     * 시스템 메시지 구독 (수업 종료, 강퇴 등)
     * 구독: /topic/class/{classId}/system
     */
    subscribeSystem: (classId, onMessage) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/system`,
            onMessage,
            `class-${classId}-system`
        );
    },

    /**
     * 수업 모드 변경 구독
     * 구독: /topic/class/{classId}/mode
     */
    subscribeMode: (classId, onModeChange) => {
        return websocketApi.subscribe(
            `/topic/class/${classId}/mode`,
            onModeChange,
            `class-${classId}-mode`
        );
    },

    /**
     * 클래스 퇴장 (모든 구독 해제)
     */
    leaveClass: (classId) => {
        websocketApi.unsubscribe(`class-${classId}-chat`);
        websocketApi.unsubscribe(`class-${classId}-participants`);
        websocketApi.unsubscribe(`class-${classId}-system`);
        websocketApi.unsubscribe(`class-${classId}-mode`);
    },

    // ==================== WebSocket 전송 ====================

    /**
     * 수업 모드 변경 (강사용)
     * 전송: /app/class/{classId}/mode
     */
    changeMode: (classId, mode) => {
        websocketApi.send(`/app/class/${classId}/mode`, { mode });
    },
};

export default classRoomApi;