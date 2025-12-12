// features/snapshot/service/snapshotService.js
import { api } from '@/services/api.js';

const SNAPSHOT_ENDPOINTS = {
    CREATE: `/api/snapshot/`,
    UPDATE: `/api/snapshot/update`,
    READ: `/api/snapshot/read`,
    READ_BY_TITLE: `/api/snapshot/read/title`,
};

export const snapshotService = {
    /**
     * 전체 조회
     */
    getAll: async (classId, page = 0, size = 10) => {
        // ApiResponse의 data 필드 내부의 Page 객체를 반환해야 함
        const response = await api.get(SNAPSHOT_ENDPOINTS.READ, {
            params: { classId, page, size }
        });
        // 서버 응답 구조: { success: true, data: { content: [...], ... } }
        return response.data;
    },
    /**
     * 생성
     */
    create: async (data) => {
        const response = await api.post(SNAPSHOT_ENDPOINTS.CREATE, data);
        return response.data;
    },
};