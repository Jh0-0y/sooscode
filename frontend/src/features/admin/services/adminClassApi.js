import { api } from '@/services/api';

const BASE_URL = '/api/admin/classes';

export const adminClassApi = {
    /**
     * 클래스 목록 조회 (페이지네이션 + 필터)
     * GET /api/admin/classes
     */
    getList: (params) => {
        const {
            page = 0,
            size = 10,
            keyword,
            startDate,
            endDate,
            startTime,
            endTime,
            sortBy = 'createdAt',
            sortDirection = 'DESC'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('size', size);
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDirection', sortDirection);

        if (keyword) queryParams.append('keyword', keyword);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (startTime) queryParams.append('startTime', startTime);
        if (endTime) queryParams.append('endTime', endTime);

        return api.get(`${BASE_URL}?${queryParams.toString()}`);
    },

    /**
     * 클래스 상세 조회
     * GET /api/admin/classes/{classId}
     */
    getDetail: (classId) => {
        return api.get(`${BASE_URL}/${classId}`);
    },

    /**
     * 클래스 생성
     * POST /api/admin/classes/create
     */
    create: (data) => {
        return api.post(`${BASE_URL}/create`, data);
    },

    /**
     * 클래스 수정
     * POST /api/admin/classes/{classId}/edit
     */
    update: (classId, data) => {
        return api.post(`${BASE_URL}/${classId}/edit`, data);
    },

    /**
     * 클래스 삭제 (비활성화)
     * POST /api/admin/classes/{classId}/delete
     */
    delete: (classId) => {
        return api.post(`${BASE_URL}/${classId}/delete`);
    },

    /**
     * 학생 일괄 배정
     * POST /api/admin/classes/{classId}/students/assign
     */
    assignStudents: (classId, studentIds) => {
        return api.post(`${BASE_URL}/${classId}/students/assign`, { studentIds });
    },

    /**
     * 학생 일괄 배정 취소
     * POST /api/admin/classes/{classId}/students/delete
     */
    removeStudents: (classId, studentIds) => {
        return api.post(`${BASE_URL}/${classId}/students/delete`, { studentIds });
    },

    /**
     * 클래스별 학생 목록 조회 (페이지네이션)
     * GET /api/admin/classes/{classId}/students
     */
    getClassStudents: (classId, params) => {
        const {
            page = 0,
            size = 5,
            keyword,
            sortBy = 'createdAt',
            sortDirection = 'DESC'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('size', size);
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDirection', sortDirection);

        if (keyword) queryParams.append('keyword', keyword);

        return api.get(`${BASE_URL}/${classId}/students?${queryParams.toString()}`);
    },

    /**
     * 강사 검색
     * GET /api/admin/classes/instructors?keyword={name, email}
     */
    searchInstructors: (keyword) => {
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);

        return api.get(`${BASE_URL}/instructors?${queryParams.toString()}`);
    },

    /**
     * 클래스에 속하지 않은 학생 검색
     * GET /api/admin/classes/{classId}/students/available?keyword={name, email}
     */
    searchAvailableStudents: (classId, keyword) => {
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);

        return api.get(`${BASE_URL}/${classId}/students/available?${queryParams.toString()}`);
    },

    /**
     * 클래스 정보 및 수강생 목록 엑셀 다운로드
     * GET /api/admin/classes/{classId}/export
     * @returns {Promise<Blob>} Excel 파일 (인터셉터에서 response.data 자동 추출됨)
     */
    exportClassToExcel: async (classId) => {
        // 인터셉터가 response.data를 반환하므로 blob이 바로 반환됨
        return await api.get(`${BASE_URL}/${classId}/export`, {
            responseType: 'blob'
        });
    },

    /**
     * 전체 클래스 목록 엑셀 다운로드
     * GET /api/admin/classes/export (수정: /list/export → /export)
     * @returns {Promise<Blob>} Excel 파일 (인터셉터에서 response.data 자동 추출됨)
     */
    exportClassListToExcel: async (params = {}) => {
        const {
            keyword,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortDirection = 'DESC'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDirection', sortDirection);

        if (keyword) queryParams.append('keyword', keyword);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        return await api.get(`${BASE_URL}/list/export?${queryParams.toString()}`, {
            responseType: 'blob'
        });
    }
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