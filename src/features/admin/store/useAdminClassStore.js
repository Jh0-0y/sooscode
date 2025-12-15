import { create } from 'zustand';
import { adminClassApi } from '@/features/admin/services/adminClassApi';

const initialState = {
  classes: [],
  pagination: { currentPage: 0, totalPages: 0, totalElements: 0, size: 10 },
  filter: { keyword: '', startDate: null, endDate: null, sortBy: 'createdAt', sortDirection: 'DESC' },
  selectedClass: null,
  isLoading: false,
  error: null,
  modal: { type: null, isOpen: false, data: null },
};

const useAdminClassStore = create((set, get) => ({
  ...initialState,

  actions: {
    // 클래스 목록 조회
    fetchClasses: async (page) => {
      const { filter, pagination } = get();
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.getList({
          page: page ?? pagination.currentPage,
          size: pagination.size,
          ...filter,
        });
        set({
          classes: res.data.content,
          pagination: {
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            size: res.data.size,
          },
          isLoading: false,
        });
      } catch (err) {
        set({ error: err.message || '클래스 목록 조회 실패', isLoading: false });
      }
    },

    // 클래스 상세 조회
    fetchClassDetail: async (classId) => {
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.getDetail(classId);
        set({ selectedClass: res.data, isLoading: false });
        return res.data;
      } catch (err) {
        set({ error: err.message || '클래스 상세 조회 실패', isLoading: false });
        throw err;
      }
    },

    // 클래스 생성
    createClass: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.create(data);
        await get().actions.fetchClasses(0);
        return res.data;
      } catch (err) {
        set({ error: err.message || '클래스 생성 실패', isLoading: false });
        throw err;
      }
    },

    // 클래스 수정
    updateClass: async (classId, data) => {
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.update(classId, data);
        await get().actions.fetchClasses();
        return res.data;
      } catch (err) {
        set({ error: err.message || '클래스 수정 실패', isLoading: false });
        throw err;
      }
    },

    // 클래스 삭제
    deleteClass: async (classId) => {
      set({ isLoading: true, error: null });
      try {
        await adminClassApi.delete(classId);
        await get().actions.fetchClasses();
      } catch (err) {
        set({ error: err.message || '클래스 삭제 실패', isLoading: false });
        throw err;
      }
    },

    // 학생 배정
    assignStudents: async (classId, studentIds) => {
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.assignStudents(classId, studentIds);
        return res.data;
      } catch (err) {
        set({ error: err.message || '학생 배정 실패', isLoading: false });
        throw err;
      }
    },

    // 학생 배정 취소
    removeStudents: async (classId, studentIds) => {
      set({ isLoading: true, error: null });
      try {
        const res = await adminClassApi.removeStudents(classId, studentIds);
        return res.data;
      } catch (err) {
        set({ error: err.message || '학생 배정 취소 실패', isLoading: false });
        throw err;
      }
    },

    // 필터 설정
    setFilter: (newFilter) => set((s) => ({ filter: { ...s.filter, ...newFilter } })),
    resetFilter: () => set({ filter: initialState.filter }),

    // 페이지 변경
    setPage: (page) => {
      set((s) => ({ pagination: { ...s.pagination, currentPage: page } }));
      get().actions.fetchClasses(page);
    },

    // 모달
    openModal: (type, data = null) => set({ modal: { type, isOpen: true, data } }),
    closeModal: () => set({ modal: { type: null, isOpen: false, data: null } }),

    // 선택
    selectClass: (cls) => set({ selectedClass: cls }),
    clearSelectedClass: () => set({ selectedClass: null }),

    // 초기화
    reset: () => set(initialState),
  },
}));

// 캡슐화된 셀렉터
export const useClasses = () => useAdminClassStore((s) => s.classes);
export const usePagination = () => useAdminClassStore((s) => s.pagination);
export const useFilter = () => useAdminClassStore((s) => s.filter);
export const useSelectedClass = () => useAdminClassStore((s) => s.selectedClass);
export const useIsLoading = () => useAdminClassStore((s) => s.isLoading);
export const useError = () => useAdminClassStore((s) => s.error);
export const useModal = () => useAdminClassStore((s) => s.modal);
export const useClassActions = () => useAdminClassStore((s) => s.actions);

export default useAdminClassStore;
