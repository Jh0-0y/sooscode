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
        const response = await api.get(SNAPSHOT_ENDPOINTS.READ, {
            params: { classId, page, size }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

        // 예외 처리: 구조가 다를 경우를 대비해 원본 data 반환
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