// hooks/useUserFilterStore.js
import { create } from 'zustand';

/**
 * 사용자 목록 필터 상태 관리 (Zustand)
 */
export const useUserFilterStore = create((set, get) => ({
    // 페이지네이션
    page: 0,
    size: 10,

    // 필터링
    keyword: '',
    role: '',
    status: '',
    startDate: '',
    endDate: '',

    // 정렬
    sortBy: 'createdAt',
    sortDirection: 'DESC',

    // 페이지 변경
    setPage: (page) => set({ page }),

    // 페이지 크기 변경 (첫 페이지로 리셋)
    setSize: (size) => set({ size, page: 0 }),

    // 검색어 변경 (첫 페이지로 리셋)
    setKeyword: (keyword) => set({ keyword, page: 0 }),

    // 역할 필터 변경 (첫 페이지로 리셋)
    setRole: (role) => set({ role, page: 0 }),

    // 상태 필터 변경 (첫 페이지로 리셋)
    setStatus: (status) => set({ status, page: 0 }),

    // 날짜 범위 변경 (첫 페이지로 리셋)
    setDateRange: (startDate, endDate) => set({ startDate, endDate, page: 0 }),

    // 정렬 변경
    setSort: (field) => {
        const { sortBy, sortDirection } = get();
        if (sortBy === field) {
            // 같은 필드면 방향만 토글
            set({ sortDirection: sortDirection === 'ASC' ? 'DESC' : 'ASC' });
        } else {
            // 다른 필드면 DESC로 초기화
            set({ sortBy: field, sortDirection: 'DESC' });
        }
    },

    // 필터 초기화
    resetFilters: () => set({
        page: 0,
        keyword: '',
        role: '',
        status: '',
        startDate: '',
        endDate: '',
        sortBy: 'createdAt',
        sortDirection: 'DESC',
    }),

    // API 호출용 파라미터 객체 반환
    getFilterParams: () => {
        const state = get();
        return {
            page: state.page,
            size: state.size,
            ...(state.keyword && { keyword: state.keyword }),
            ...(state.role && { role: state.role }),
            ...(state.status && { status: state.status }),
            ...(state.startDate && { startDate: state.startDate }),
            ...(state.endDate && { endDate: state.endDate }),
            sortBy: state.sortBy,
            sortDirection: state.sortDirection,
        };
    },
}));

export default useUserFilterStore;