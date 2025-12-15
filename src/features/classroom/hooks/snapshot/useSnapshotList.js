import { create } from "zustand";
import { useCallback } from "react";
import { snapshotService } from "@/features/classroom/services/snapshotService.js";
import { useCode } from "@/features/classroom/hooks/code/useCode.js";
import { useToast } from "@/hooks/useToast.js";
import { useClassroom } from "@/features/classroom/contexts/ClassroomContext.jsx";

const snapshotListStore = create((set) => ({
    snapshots: [],
    loadingList: false,
    page: 0,
    totalPages: 0,

    // 목록을 더하지 않고 통째로 교체
    setSnapshots: (snapshots) => set({ snapshots }),
    setTotalPages: (total) => set({ totalPages: total }),
    setPage: (page) => set({ page }),

    setLoadingList: (loading) => set({ loadingList: loading }),

    reset: () =>
        set({
            snapshots: [],
            page: 0,
            totalPages: 0,
            loadingList: false,
        }),
}));

export const useSnapshotList = () => {
    const { classId } = useClassroom(); // Context에서 classId 가져오기
    const { setCode } = useCode();
    const toast = useToast();

    const {
        snapshots,
        loadingList,
        page,
        totalPages,
        setSnapshots,
        setTotalPages,
        setPage,
        setLoadingList,
    } = snapshotListStore();

    /**
     * 스냅샷 목록 조회 (페이지 변경 시 호출)
     */
    const fetchSnapshots = useCallback(async (targetPage = page) => {
        if (!classId) return;

        setLoadingList(true);

        try {
            const size = 10;
            const pageData = await snapshotService.getAll(classId, targetPage, size);

            const content = pageData?.content || [];
            const total = pageData?.totalPages || 0;

            setSnapshots(content);
            setTotalPages(total);

            if (targetPage !== page) {
                setPage(targetPage);
            }

        } catch (error) {
            console.error("스냅샷 조회 실패:", error);
        } finally {
            setLoadingList(false);
        }
    }, [classId, page, setSnapshots, setTotalPages, setPage, setLoadingList]);

    /**
     * 페이지 이동 핸들러
     */
    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
        fetchSnapshots(newPage);
    };

    /**
     * 스냅샷 복원
     */
    const handleRestoreSnapshot = (snapshot) => {
        if (!snapshot?.content) {
            toast.error("복원할 코드가 없습니다.");
            return;
        }
        setCode(snapshot.content);
        toast.success("코드가 복원되었습니다.");
    };

    return {
        snapshots,
        loading: loadingList,
        page,
        totalPages,
        fetchSnapshots,
        handlePageChange,
        handleRestoreSnapshot,
    };
};