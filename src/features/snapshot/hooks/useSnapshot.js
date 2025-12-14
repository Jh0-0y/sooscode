import { create } from "zustand";
import { useCallback } from "react";
import { snapshotService } from "@/features/snapshot/service/snapshotService";
import { useCode } from "@/features/code/hooks/useCode";
import { useToast } from "@/hooks/useToast";

const snapshotStore = create((set) => ({
    snapshots: [],
    loadingList: false,
    loadingSave: false,
    page: 0,
    totalPages: 0,

    // 목록을 더하지 않고 통째로 교체
    setSnapshots: (snapshots) => set({ snapshots }),
    setTotalPages: (total) => set({ totalPages: total }),
    setPage: (page) => set({ page }),

    setLoadingList: (loading) => set({ loadingList: loading }),
    setLoadingSave: (loading) => set({ loadingSave: loading }),

    reset: () =>
        set({
            snapshots: [],
            page: 0,
            totalPages: 0,
            loadingList: false,
        }),
}));

export const useSnapshot = () => {

    const classId = 1;
    const { code, setCode } = useCode();
    const toast = useToast();

    const {
        snapshots,
        loadingList,
        loadingSave,
        page,
        totalPages,
        setSnapshots,
        setTotalPages,
        setPage,
        setLoadingList,
        setLoadingSave,
    } = snapshotStore();

    /**
     * 스냅샷 목록 조회 (페이지 변경 시 호출)
     */
    const fetchSnapshots = useCallback(async (targetPage = page) => {
        if (!classId) return;
        setLoadingList(true);

        try {
            const size = 10;
            // Service 호출
            const pageData = await snapshotService.getAll(classId, targetPage, size);

            const content = pageData?.content || [];
            const total = pageData?.totalPages || 0;

            // 데이터 교체 및 전체 페이지 수 설정
            setSnapshots(content);
            setTotalPages(total);

            // 페이지 상태 동기화 (혹시 외부에서 호출했을 때 대비)
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
        fetchSnapshots(newPage); // 상태 업데이트 기다리지 않고 즉시 요청
    };

    /**
     * 스냅샷 저장
     */
    const handleSaveSnapshot = async (title) => {
        if (!title?.trim()) {
            toast.warning("제목을 입력해주세요.");
            return false;
        }
        if (!code?.trim()) {
            toast.warning("저장할 코드가 없습니다.");
            return false;
        }

        setLoadingSave(true);
        try {
            await snapshotService.create({
                classId,
                title,
                content: code,
                language: "JAVA"
            });

            toast.success("스냅샷이 저장되었습니다.");

            // 저장 후 첫 페이지로 이동 및 갱신
            setPage(0);
            fetchSnapshots(0);

            return true;
        } catch (error) {
            console.error("스냅샷 저장 에러:", error);
            toast.error("저장에 실패했습니다.");
            return false;
        } finally {
            setLoadingSave(false);
        }
    };

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
        loadingSave,
        page,
        totalPages,
        fetchSnapshots,
        handlePageChange,
        handleSaveSnapshot,
        handleRestoreSnapshot,
    };
};