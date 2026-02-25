import { create } from "zustand";
import { snapshotService } from "@/features/classroom/services/snapshotService.js";
import { useToast } from "@/hooks/useToast.js";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";

// 코드 내용 제한 상수
const MAX_CONTENT_LENGTH = 10000;

/**
 * 스냅샷 저장 전용 스토어
 * 역할:
 * - 스냅샷 저장 상태 전역관리
 **/
const snapshotSaveStore = create((set) => ({
    loadingSave: false,
    setLoadingSave: (loading) => set({ loadingSave: loading }),
}));

/**
 * 스냅샷 저장 비즈니스 훅
 * 역할:
 * - 현재 에디터 코드내용 스냅샷 저장
 *
 * @param {string} code - 저장할 코드 (컴포넌트에서 전달)
 */
export const useSnapshotSave = (code) => {
    const { classId } = useClassroomContext();
    const toast = useToast();

    // 저장상태 구독
    const {
        loadingSave,
        setLoadingSave,
    } = snapshotSaveStore();

    /**
     * 스냅샷 저장 처리
     * - 저장 책임만
     */
    const handleSaveSnapshot = async (title) => {
        if (!classId) {
            toast.error("클래스 정보가 유효하지 않습니다.");
            return false;
        }
        if (!title?.trim()) {
            toast.warning("제목을 입력해주세요.");
            return false;
        }
        if (!code?.trim()) {
            toast.warning("저장할 코드가 없습니다.");
            return false;
        }
        if (code.length > MAX_CONTENT_LENGTH) {
            toast.warning(`코드 내용은 ${MAX_CONTENT_LENGTH}자를 초과 할 수 없습니다`);
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

            return true;
        } catch (error) {
            console.error("스냅샷 저장 에러:", error);
            toast.error("저장에 실패했습니다.");
            return false;
        } finally {
            setLoadingSave(false);
        }
    };

    return {
        loadingSave,
        handleSaveSnapshot,
    };
};