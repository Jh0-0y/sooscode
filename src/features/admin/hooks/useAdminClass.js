import { create } from 'zustand';

const initialState = {
    // 클래스 목록
    classes: [],

    // 페이지네이션
    pagination: {
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
    },

    // 필터
    filter: {
        keyword: '',
        startDate: null,
        endDate: null,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
    },

    // UI 상태
    viewMode: 'grid',
    isLoading: false,
    error: null,

    // 모달 상태
    modal: {
        type: null, // 'create' | 'edit' | 'delete' | 'detail' | 'students'
        isOpen: false,
        data: null,
    },

    // 선택된 클래스
    selectedClass: null,
};

const useAdminClassStore = create((set, get) => ({
    ...initialState,

    // Actions
    actions: {
        // 클래스 목록 설정
        setClasses: (classes) => set({ classes }),

        // 페이지네이션 설정
        setPagination: (pagination) => set({ pagination }),

        // 필터 설정
        setFilter: (filter) => set((state) => ({
            filter: { ...state.filter, ...filter }
        })),

        // 필터 초기화
        resetFilter: () => set({
            filter: initialState.filter,
            pagination: { ...initialState.pagination }
        }),

        // 뷰모드 변경
        setViewMode: (mode) => set({ viewMode: mode }),

        // 로딩 상태
        setLoading: (isLoading) => set({ isLoading }),

        // 에러 상태
        setError: (error) => set({ error }),

        // 모달 열기
        openModal: (type, data = null) => set({
            modal: { type, isOpen: true, data }
        }),

        // 모달 닫기
        closeModal: () => set({
            modal: { type: null, isOpen: false, data: null }
        }),

        // 클래스 선택
        selectClass: (classItem) => set({ selectedClass: classItem }),

        // 클래스 선택 해제
        clearSelectedClass: () => set({ selectedClass: null }),

        // 페이지 변경
        setPage: (page) => set((state) => ({
            pagination: { ...state.pagination, currentPage: page }
        })),

        // 전체 상태 초기화
        reset: () => set(initialState),
    },
}));

// 캡슐화된 셀렉터
export const useClasses = () => useAdminClassStore((state) => state.classes);
export const usePagination = () => useAdminClassStore((state) => state.pagination);
export const useFilter = () => useAdminClassStore((state) => state.filter);
export const useViewMode = () => useAdminClassStore((state) => state.viewMode);
export const useIsLoading = () => useAdminClassStore((state) => state.isLoading);
export const useError = () => useAdminClassStore((state) => state.error);
export const useModal = () => useAdminClassStore((state) => state.modal);
export const useSelectedClass = () => useAdminClassStore((state) => state.selectedClass);

// 액션 훅
export const useClassActions = () => useAdminClassStore((state) => state.actions);

export default useAdminClassStore;