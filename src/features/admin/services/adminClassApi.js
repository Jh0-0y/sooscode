import { api } from '@/services/api';

const BASE_URL = '/api/admin/classes';

export const adminClassApi = {
  // 클래스 목록 조회 (페이지네이션 + 필터)
  getList: (params) => {
    const { page = 0, size = 10, keyword, startDate, endDate, sortBy = 'createdAt', sortDirection = 'DESC' } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('size', size);
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortDirection', sortDirection);
    if (keyword) queryParams.append('keyword', keyword);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    return api.get(`${BASE_URL}?${queryParams.toString()}`);
  },

  // 클래스 상세 조회
  getDetail: (classId) => api.get(`${BASE_URL}/${classId}`),

  // 클래스 생성
  create: (data) => api.post(`${BASE_URL}/create`, data),

  // 클래스 수정
  update: (classId, data) => api.post(`${BASE_URL}/${classId}/edit`, data),

  // 클래스 삭제
  delete: (classId) => api.post(`${BASE_URL}/${classId}/delete`),

  // 학생 배정
  assignStudents: (classId, studentIds) => api.post(`${BASE_URL}/${classId}/students`, { studentIds }),

  // 학생 배정 취소
  removeStudents: (classId, studentIds) => api.post(`${BASE_URL}/${classId}/students/delete`, { studentIds }),
};
