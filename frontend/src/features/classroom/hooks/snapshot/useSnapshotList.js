import { create } from "zustand";
import { useCallback } from "react";
import { snapshotService } from "@/features/classroom/services/snapshotService.js";
import { useToast } from "@/hooks/useToast.js";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";

/**
 * 스냅샷 목록 상태 스토어
 * 역할:
 * - 스냅샷 목록 조회에 필요한 상태를 전역으로 관리
 * - "최근 보기 / 전체 보기" 모드 전환을 위한 상태를 보관
 */
const snapshotListStore = create((set) => ({
    snapshots: [],
    loadingList: false,
    page: 0,
    totalPages: 0,
    filters: { title: '' },
    /**
     * 현재 스냅샷 목록의 조회 모드
     * - recent : 최근 스냅샷 미리보기
     * - full   : 전체 목록 탐색
     */
    mode: 'recent',

    // 스냅샷 목록 데이터 설정
    setSnapshots: (snapshots) => set({ snapshots }),
    // 전체 페이지 수 설정
    setTotalPages: (total) => set({ totalPages: total }),
    // 현재 페이지 수 설정
    setPage: (page) => set({ page }),
    // 목록 로딩 상태 결정
    setLoadingList: (loading) => set({ loadingList: loading }),
    // 검색 필터 병합 설정
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    // 조회 모드 설정
    setMode: (mode) => set({ mode }),
    // 검색 필터 초기화
    resetFilters: () => set({ filters: { title: '' } }),

    /**
     * 스냅샷 목록 관련 상태 전체 초기화
     * - 클래스 변경, 화면 이탈 시 사용 가능
     */
    reset: () =>
        set({
            snapshots: [],
            page: 0,
            totalPages: 0,
            loadingList: false,
            filters: { title: '' },
            mode: 'recent'
        }),
}));

/**
 * 스냅샷 목록 비즈니스 훅
 * 역할:
 * - 스냅샷 목록 조회/검색/페이지 이동/복원 로직 캡슐화
 * - UI 컴포넌트는 이 훅을 통해 상태, 액션 소비
 *
 * @param {Function} onRestore - 스냅샷 복원 시 호출될 콜백 (code를 받아서 에디터에 설정)
 */
export const useSnapshotList = (onRestore) => {
    const { classId } = useClassroomContext();
    const toast = useToast();

    /**
     * 전역 스냅샷 목록 상태 구독
     */
    const {
        snapshots,
        loadingList,
        page,
        totalPages,
        filters,
        mode,
        setSnapshots,
        setTotalPages,
        setPage,
        setLoadingList,
        setFilters,
        setMode,
        resetFilters,
        reset
    } = snapshotListStore();

    /**
     * 최근 스냅샷 목록 조회
     * 사용시점:
     * - 최초 진입
     * - 최근 보기 전환 시
     */
    const fetchRecentSnapshots = useCallback(async () => {
        if (!classId) return;

        setLoadingList(true);
        setMode('recent');

        try {
            const RECENT_SIZE = 8;
            const pageData = await snapshotService.search(
                classId,
                {},
                0,
                RECENT_SIZE
            );
            const content = pageData?.content || [];

            setSnapshots(content);
            setTotalPages(1);
            setPage(0);

        } catch (error) {
            console.error("최근 스냅샷 조회 실패:", error);
            setSnapshots([]);
        } finally {
            setLoadingList(false);
        }
    }, [classId, setSnapshots, setTotalPages, setPage, setLoadingList, setMode]);

    /**
     * 스냅샷 목록 조회 & 검색
     */
    const fetchSnapshots = useCallback(async (targetPage = page, newFilters = undefined) => {
        if (!classId) return;

        setLoadingList(true);
        setMode('full');

        try {
            const size = 9;
            /**
             * 새로운 필터 전달 시 기존필터 교체, 그렇지 않으면 유지
             */
            const activeFilters = newFilters !== undefined ? newFilters : filters;

            if (newFilters !== undefined) {
                setFilters(newFilters);
            }
            /**
             * 빈 필터 값 제거
             */
            const cleanFilters = Object.fromEntries(
                // eslint-disable-next-line no-unused-vars
                Object.entries(activeFilters).filter(([_, v]) => v != null && v !== '')
            );

            const pageData = await snapshotService.search(classId, cleanFilters, targetPage, size);
            const content = pageData?.content || [];
            const total = pageData?.totalPages || 0;

            setSnapshots(content);
            setTotalPages(total);

            if (targetPage !== page) {
                setPage(targetPage);
            }

        } catch (error) {
            console.error("스냅샷 조회 실패:", error);
            setSnapshots([]);
        } finally {
            setLoadingList(false);
        }
    }, [classId, page, filters, setSnapshots, setTotalPages, setPage, setLoadingList, setFilters, setMode]);

    /**
     * 페이지 변경 처리
     */
    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;

        fetchSnapshots(newPage);
    };

    /**
     * 검색 처리
     * 동작:
     * - 페이지를 0 초기화
     * - 전달 받은 검색 조건, 조회 실행
     */
    const handleSearch = (searchFilters) => {
        setPage(0);
        fetchSnapshots(0, searchFilters);
    };

    /**
     * 스냅샷 코드 복원 처리
     * - 스냅샷 저장되어있는 코드 에디터 반영
     */
    const handleRestoreSnapshot = useCallback((snapshot) => {
        if (!snapshot?.content) {
            toast.error("복원할 코드가 없습니다.");
            return;
        }

        // onRestore 콜백이 제공되었으면 호출
        if (onRestore) {
            onRestore(snapshot.content);
            toast.success(`'${snapshot.title}' 스냅샷을 불러왔습니다.`);
        } else {
            toast.error("코드 복원 기능이 설정되지 않았습니다.");
        }
    }, [onRestore, toast]);

    /**
     * 스냅샷 삭제 처리
     * - API 호출 후 현재 모드(최근/전체)에 맞춰 목록 갱신
     */
    const handleDeleteSnapshot = useCallback(async (snapshotId) => {
        if (!classId) return;

        setLoadingList(true);
        try {
            await snapshotService.delete(classId, snapshotId);
            toast.success("스냅샷이 삭제되었습니다.");

            // 삭제 후 목록 갱신 (현재 모드 유지)
            if (mode === 'recent') {
                await fetchRecentSnapshots();
            } else {
                await fetchSnapshots(page);
            }
        } catch (error) {
            console.error("스냅샷 삭제 실패:", error);
            toast.error("삭제에 실패했습니다.");
        } finally {
            setLoadingList(false);
        }
    }, [classId, mode, page, fetchRecentSnapshots, fetchSnapshots, setLoadingList, toast]);

    return {
        snapshots,
        loading: loadingList,
        page,
        totalPages,
        filters,
        mode,
        fetchRecentSnapshots,
        fetchSnapshots,
        handlePageChange,
        handleSearch,
        handleRestoreSnapshot,
        resetFilters,
        reset,
        handleDeleteSnapshot
    };
};