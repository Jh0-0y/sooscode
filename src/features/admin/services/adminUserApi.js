// api/adminUserApi.js
import { api } from './api';

const BASE_URL = '/api/admin/users';

/**
 * 관리자 - 사용자 관리 API
 */
export const adminUserApi = {
    /**
     * 계정 생성
     * POST /api/admin/users/create
     */
    createUser: async (data) => {
        return await api.post('{BASE_URL}/create', data);
    },

    /**
     * 일괄 계정 생성 (Excel)
     * POST /api/admin/users/bulk
     * @returns {Promise<Blob>} Excel 파일
     */
    bulkCreateUsers: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('{BASE_URL}/bulk', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob',
        });

        return response;
    },

    /**
     * 사용자 목록 조회 (페이지네이션 + 필터링)
     * GET /api/admin/users
     */
    getUserList: async (params) => {
        return await api.get('{BASE_URL}', { params });
    },

    /**
     * 사용자 상세 조회
     * GET /api/admin/users/{userId}
     */
    getUserDetail: async (userId) => {
        return await api.get(`{BASE_URL}/${userId}`);
    },

    /**
     * 사용자 히스토리 조회
     * GET /api/admin/users/{userId}/history
     */
    getUserHistory: async (userId, limit = 5) => {
        return await api.get(`{BASE_URL}/${userId}/history`, {
            params: { limit }
        });
    },

    /**
     * 사용자 삭제 (비활성화)
     * POST /api/admin/users/{userId}/delete
     */
    deleteUser: async (userId) => {
        return await api.post(`{BASE_URL}/${userId}/delete`);
    },

    /**
     * 사용자 활성화
     * POST /api/admin/users/{userId}/activate
     */
    activateUser: async (userId) => {
        return await api.post(`{BASE_URL}/${userId}/activate`);
    },

    /**
     * 사용자 역할 변경
     * POST /api/admin/users/{userId}/role
     */
    changeUserRole: async (userId, role) => {
        return await api.post(`{BASE_URL}/${userId}/role`, { role });
    },

    /**
     * 사용자 목록 엑셀 다운로드
     * GET /api/admin/users/export
     * @returns {Promise<Blob>} Excel 파일
     */
    exportUsersToExcel: async (params) => {
        const response = await api.get('{BASE_URL}/export', {
            params,
            responseType: 'blob',
        });

        return response;
    },

    /**
     * 일괄 생성용 엑셀 템플릿 다운로드
     * GET /api/admin/users/template/download
     * @returns {Promise<Blob>} Excel 파일
     */
    downloadExcelTemplate: async () => {
        const response = await api.get('{BASE_URL}/template/download', {
            responseType: 'blob',
        });

        return response;
    },
};

/**
 * 파일 다운로드 헬퍼 함수
 */
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};