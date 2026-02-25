import { api } from '@/services/api';
import websocketApi from './websocketApi.js';

const BASE_URL = '/api/class';

/**
 * 코드 공유 API
 * - 강사 ↔ 학생 코드 공유
 * - 실시간 코드 동기화
 */
export const codeApi = {
    // ==================== REST API (초기 데이터 로드) ====================

    /**
     * 강사 코드 조회 (학생이 입장 시 초기 로드)
     * GET /api/class/{classId}/code/instructor
     */
    getInstructorCode: (classId) => {
        return api.get(`${BASE_URL}/${classId}/code/instructor`);
    },

    /**
     * 학생 코드 조회 (강사가 학생 선택 시 초기 로드)
     * GET /api/class/{classId}/code/student/{studentId}
     */
    getStudentCode: (classId, studentId) => {
        return api.get(`${BASE_URL}/${classId}/code/student/${studentId}`);
    },

    /**
     * 내 코드 조회 (새로고침 시 복원용)
     * - 강사: /api/class/{classId}/code/instructor
     * - 학생: /api/class/{classId}/code/student/{userId}
     */
    getMyCode: (classId, userId, isInstructor) => {
        if (isInstructor) {
            return api.get(`${BASE_URL}/${classId}/code/instructor`);
        }
        return api.get(`${BASE_URL}/${classId}/code/student/${userId}`);
    },

    // ==================== WebSocket 구독 ====================

    /**
     * 강사 코드 구독 (학생용)
     * 구독: /topic/code/instructor/{classId}
     */
    subscribeInstructorCode: (classId, onCodeUpdate) => {
        return websocketApi.subscribe(
            `/topic/code/instructor/${classId}`,
            onCodeUpdate,
            `code-instructor-${classId}`
        );
    },

    /**
     * 강사 코드 구독 해제
     */
    unsubscribeInstructorCode: (classId) => {
        websocketApi.unsubscribe(`code-instructor-${classId}`);
    },

    /**
     * 특정 학생 코드 구독 (강사용)
     * 구독: /topic/code/student/{classId}/{studentId}
     */
    subscribeStudentCode: (classId, studentId, onCodeUpdate) => {
        return websocketApi.subscribe(
            `/topic/code/student/${classId}/${studentId}`,
            onCodeUpdate,
            `code-student-${classId}-${studentId}`
        );
    },

    /**
     * 학생 코드 구독 해제
     */
    unsubscribeStudentCode: (classId, studentId) => {
        websocketApi.unsubscribe(`code-student-${classId}-${studentId}`);
    },

    /**
     * 내 코드 구독 (학생용 - 강사가 수정한 내용 수신)
     * 구독: /topic/code/student/{classId}/{myUserId}
     */
    subscribeMyCode: (classId, userId, onCodeUpdate) => {
        return websocketApi.subscribe(
            `/topic/code/student/${classId}/${userId}`,
            onCodeUpdate,
            `code-my-${classId}`
        );
    },

    /**
     * 내 코드 구독 해제
     */
    unsubscribeMyCode: (classId) => {
        websocketApi.unsubscribe(`code-my-${classId}`);
    },

    /**
     * 현재 보고 있는 학생 변경 (강사용)
     * - 기존 학생 구독 해제
     * - 새 학생 초기 코드 로드
     * - 새 학생 구독
     */
    watchStudent: async (classId, newStudentId, prevStudentId, onCodeUpdate) => {
        // 기존 구독 해제
        if (prevStudentId) {
            websocketApi.unsubscribe(`code-student-${classId}-${prevStudentId}`);
        }

        // 초기 코드 로드
        let initialCode = null;
        try {
            const response = await api.get(`${BASE_URL}/${classId}/code/student/${newStudentId}`);
            if (!response.empty) {
                initialCode = {
                    code: response.code,
                    language: response.language,
                    userId: response.userId,
                };
            }
        } catch (e) {
            console.error('학생 코드 로드 실패:', e);
        }

        // 새 학생 구독
        websocketApi.subscribe(
            `/topic/code/student/${classId}/${newStudentId}`,
            onCodeUpdate,
            `code-student-${classId}-${newStudentId}`
        );

        return initialCode;
    },

    // ==================== WebSocket 전송 ====================

    /**
     * 강사 코드 전송
     * 전송: /app/code/instructor/{classId}
     */
    sendInstructorCode: (classId, code, language) => {
        websocketApi.send(`/app/code/instructor/${classId}`, {
            code,
            language,
        });
    },

    /**
     * 학생 코드 전송
     * 전송: /app/code/student/{classId}
     */
    sendStudentCode: (classId, code, language) => {
        websocketApi.send(`/app/code/student/${classId}`, {
            code,
            language,
        });
    },

    /**
     * 강사가 학생 코드 수정 (강사용)
     * 전송: /app/code/instructor/{classId}/edit/{studentId}
     * - 해당 학생의 토픽으로 브로드캐스트되어 학생 에디터에 반영됨
     */
    editStudentCode: (classId, studentId, code, language) => {
        websocketApi.send(`/app/code/instructor/${classId}/edit/${studentId}`, {
            code,
            language,
        });
    },

    // ==================== 유틸리티 ====================

    /**
     * 디바운스된 코드 전송 생성
     * @param {function} sendFn - 전송 함수 (sendInstructorCode 또는 sendStudentCode)
     * @param {number} delay - 디바운스 딜레이 (ms)
     */
    createDebouncedSender: (sendFn, delay = 300) => {
        let timeoutId = null;

        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                sendFn(...args);
                timeoutId = null;
            }, delay);
        };
    },
};

export default codeApi;