import { api } from '@/services/api.js';

const SNAPSHOT_ENDPOINTS = {
    CREATE: `/api/snapshot/`,
    UPDATE: `/api/snapshot/update`,
    READ: `/api/snapshot/read`,
    READ_BY_TITLE: `/api/snapshot/read/title`,
};

export const snapshotService = {
    /**
     * 전체 조회 (검색어 없음)
     */
    getAll: async (classId, page = 0, size = 10) => {
        const response = await api.get(SNAPSHOT_ENDPOINTS.READ, {
            params: { classId, page, size }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return response.data;
    },

    /**
     * 제목 검색 조회 (keyword -> title 매핑)
     */
    searchByTitle: async (classId, keyword, page = 0, size = 10) => {
        const response = await api.get(SNAPSHOT_ENDPOINTS.READ_BY_TITLE, {
            params: {
                classId,
                title: keyword,
                page,
                size
            }
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

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