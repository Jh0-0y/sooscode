import { useCallback } from "react";
import { useSnapshotSave } from "@/features/classroom/hooks/snapshot/useSnapshotSave.js";
import { useSnapshotList } from "@/features/classroom/hooks/snapshot/useSnapshotList.js";
/**
 * 스냅샷 저장 후 목록 갱신 훅
 */
export const useSnapshotSaveAndReload = (code) => {
    // 순수 저장 훅 사용
    const { loadingSave, handleSaveSnapshot } = useSnapshotSave(code);
    //  목록 갱신 리스트 훅 호출
    const { fetchRecentSnapshots } = useSnapshotList();
    //  기능을 하나로 합친 함수
    const saveAndReload = useCallback(async (title) => {
        //  저장 시도
        const success = await handleSaveSnapshot(title);
        //  성공했다면 목록 새로고침 Reload
        if (success) {
            await fetchRecentSnapshots();
        }
        return success;
    }, [handleSaveSnapshot, fetchRecentSnapshots]);

    return {
        loadingSave,
        saveAndReload
    };
};