import { api } from '@/services/api.js';

/**
 * 스냅샷 API 엔드포인트
 * */
const SNAPSHOT_ENDPOINTS = {
    CREATE: `/api/snapshot/`,
    UPDATE: `/api/snapshot/update`,
    // 통합 검색 API (전체 조회 겸용)
    SEARCH: `/api/snapshot/read/title/language/date`,
    // 상세 조회 API (내용 포함)
    DETAIL: `/api/snapshot/read/each`,
    DELETE: `/api/snapshot/delete`,
};
/**
 * 스냅샷 서비스
 * -HTTP 요청 캡슐화
 * */
export const snapshotService = {
    /**
     * 스냅샷 통합 검색 및 목록 조회
     * - filters가 비어있으면 전체 조회로 동작
     * - 반환: { content: [...], totalPages: 0, ... }
     */
    search: async (classId, filters = {}, page = 0, size = 8) => {
        const response = await api.get(SNAPSHOT_ENDPOINTS.SEARCH, {
            params: {
                classId,
                page,
                size,
                ...filters
            }
        });
        const pageData = response.data;

        // 데이터 정규화: 백엔드 DTO 차이 해결 (codeSnapshotId -> snapshotId)
        if (pageData && pageData.content) {
            pageData.content = pageData.content.map(item => ({
                ...item,
                snapshotId: item.codeSnapshotId || item.snapshotId,
            }));
        }
        return pageData;
    },

    /**
     * 스냅샷 상세 조회 (코드 내용 가져오기)
     */
    getDetail: async (classId, snapshotId) => {
        const response = await api.get(SNAPSHOT_ENDPOINTS.DETAIL, {
            params: { classId, snapshotId }
        });
        return response.data;
    },

    /**
     * 스냅샷 생성
     * -스냅샷 저장
     * */
    create: async (data) => {
        return api.post(SNAPSHOT_ENDPOINTS.CREATE, data);
    },

    /**
     *스냅샷 삭제
     */
    delete: async (classId, snapshotId) => {
        return api.post(SNAPSHOT_ENDPOINTS.DELETE, null, {
            params: { classId, snapshotId }
        });
    }
};