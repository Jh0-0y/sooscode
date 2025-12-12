// features/snapshot/hooks/useSnapshot.js
import { create } from "zustand";
import { useCallback } from "react";
import { snapshotService } from "@/features/snapshot/service/snapshotService";
import { useCode } from "@/features/code/hooks/useCode";
import { useToast } from "@/hooks/useToast";

/**
 * Snapshot Store
 * Hook 파일 내부에 은닉화 (파일 스코프)
 */
const snapshotStore = create((set) => ({
    snapshots: [],
    loadingList: false,
    loadingSave: false,
    page: 0,
    hasMore: true,

    setSnapshots: (snapshots) => set({ snapshots }),
    appendSnapshots: (snapshots) =>
        set((s) => ({ snapshots: [...s.snapshots, ...snapshots] })),

    setLoadingList: (loading) => set({ loadingList: loading }),
    setLoadingSave: (loading) => set({ loadingSave: loading }),
    setPage: (page) => set({ page }),
    setHasMore: (hasMore) => set({ hasMore }),

    reset: () =>
        set({
            snapshots: [],
            page: 0,
            hasMore: true,
            loadingList: false,
        }),
}));

export const useSnapshot = () => {
    // TODO: classId는 추후 Props나 useParams로 대체
    const classId = 1;
    const { code, setCode } = useCode();
    const toast = useToast();

    // Store State 구조 분해 할당 (스코프 문제 해결)
    const {
        snapshots,
        loadingList,
        loadingSave,
        page,
        hasMore,
        setSnapshots,
        appendSnapshots,
        setLoadingList,
        setLoadingSave,
        setPage,
        setHasMore,
        reset,
    } = snapshotStore();

    /**
     * 스냅샷 목록 조회
     */
    const fetchSnapshots = useCallback(async () => {
        if (!classId) return;
        // 로딩 중이거나 더 이상 데이터가 없으면 중단
        if (loadingList || !hasMore) return;

        setLoadingList(true);

        try {
            const size = 10;
            // Service에서 data.data(Page객체)를 반환하도록 수정됨
            const pageData = await snapshotService.getAll(classId, page, size);

            // 안전한 데이터 접근
            const content = pageData?.content || [];
            const last = pageData?.last ?? true;

            if (page === 0) {
                setSnapshots(content);
            } else {
                appendSnapshots(content);
            }

            setHasMore(!last);
            if (content.length > 0) {
                setPage(page + 1);
            }

        } catch (error) {
            console.error("스냅샷 조회 실패:", error);
            // toast.error("목록을 불러오지 못했습니다."); // 필요 시 주석 해제
        } finally {
            setLoadingList(false);
        }
    }, [classId, page, hasMore, loadingList, setSnapshots, appendSnapshots, setHasMore, setPage, setLoadingList]);

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
            });

            toast.success("스냅샷이 저장되었습니다.");

            // 저장 성공 시 목록 초기화 후 첫 페이지 로딩
            reset();

            // 상태 업데이트가 비동기이므로, 즉시 첫 페이지를 수동으로 가져와 반영
            const firstPageData = await snapshotService.getAll(classId, 0, 10);
            setSnapshots(firstPageData?.content || []);
            setHasMore(!firstPageData?.last);
            setPage(1);

            return true;
        } catch (error) {
            console.error("스냅샷 저장 에러:", error);
            toast.error("저장에 실패했습니다.");
            return false;
        } finally {
            setLoadingSave(false);
        }
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
        loading: loadingList, // 외부에서는 'loading'으로 사용하므로 매핑
        loadingSave,
        hasMore,
        fetchSnapshots,
        handleSaveSnapshot,
        handleRestoreSnapshot,
    };
};