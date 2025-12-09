import { api } from '@/services/api';

export const classApi = {
    joinClassroom: (classId) => api.get(`/api/classroom/${classId}`),
};