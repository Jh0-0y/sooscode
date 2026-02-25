// api/adminUserApi.js
import { api } from '@/services/api';

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
        return await api.post(`${BASE_URL}/create`, data);
    },

    /**
     * 일괄 계정 생성 (Excel)
     * POST /api/admin/users/bulk
     * @returns {Promise<Blob>} Excel 파일
     */
    bulkCreateUsers: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`${BASE_URL}/bulk`, formData, {
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
        return await api.get(`${BASE_URL}`, { params });
    },

    /**
     * 사용자 상세 조회
     * GET /api/admin/users/{userId}
     */
    getUserDetail: async (userId) => {
        return await api.get(`${BASE_URL}/${userId}`);
    },

    /**
     * 사용자 히스토리 조회
     * GET /api/admin/users/{userId}/history
     */
    getUserHistory: async (userId, limit = 5) => {
        return await api.get(`${BASE_URL}/${userId}/history`, {
            params: { limit }
        });
    },

    /**
     * 사용자 정보 수정
     * POST /api/admin/users/{userId}/edit
     * @param {string} userId - 사용자 ID
     * @param {Object} data - 수정할 데이터 (name, email, role 등)
     */
    updateUser: async (userId, data) => {
        return await api.post(`${BASE_URL}/${userId}/edit`, data);
    },

    /**
     * 사용자 역할 변경
     * POST /api/admin/users/{userId}/role
     * @param {string} userId - 사용자 ID
     * @param {string} role - 변경할 역할 (student, instructor, admin)
     */
    changeUserRole: async (userId, role) => {
        return await api.post(`${BASE_URL}/${userId}/role`, { role });
    },

    /**
     * 사용자 완전 삭제
     * DELETE /api/admin/users/{userId}
     * @param {string} userId - 사용자 ID
     * @description 데이터베이스에서 완전히 삭제 (복구 불가)
     */
    deleteUser: async (userId) => {
        return await api.delete(`${BASE_URL}/${userId}`);
    },

    /**
     * 사용자 비활성화 (소프트 삭제)
     * POST /api/admin/users/{userId}/deactivate
     * @param {string} userId - 사용자 ID
     * @description 계정을 비활성화하지만 데이터는 보존 (복구 가능)
     */
    deactivateUser: async (userId) => {
        return await api.post(`${BASE_URL}/${userId}/deactivate`);
    },

    /**
     * 사용자 활성화
     * POST /api/admin/users/{userId}/activate
     * @param {string} userId - 사용자 ID
     * @description 비활성화된 계정을 다시 활성화
     */
    activateUser: async (userId) => {
        return await api.post(`${BASE_URL}/${userId}/activate`);
    },

    /**
     * 사용자 목록 엑셀 다운로드
     * GET /api/admin/users/export
     * @returns {Promise<Blob>} Excel 파일
     */
    exportUsersToExcel: async (params) => {
        const response = await api.get(`${BASE_URL}/export`, {
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
        const response = await api.get(`${BASE_URL}/template/download`, {
            responseType: 'blob',
        });

        return response;
    },

    /**
     * 특정 유저가 수강 중인 클래스 목록 조회
     * GET /api/admin/users/{userId}/classes
     */
    getUserEnrolledClasses: async (userId) => {
        return await api.get(`${BASE_URL}/${userId}/classes`);
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