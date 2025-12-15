import { create } from "zustand";
import { snapshotService } from "@/features/classroom/services/snapshotService.js";
import { useCode } from "@/features/classroom/hooks/code/useCode.js";
import { useToast } from "@/hooks/useToast.js";
import { useClassroom } from "@/features/classroom/contexts/ClassroomContext.jsx";

const MAX_CONTENT_LENGTH = 10000;

const snapshotSaveStore = create((set) => ({
    loadingSave: false,
    setLoadingSave: (loading) => set({ loadingSave: loading }),
}));

export const useSnapshotSave = () => {
    const { classId } = useClassroom();
    const { code } = useCode();
    const toast = useToast();

    const {
        loadingSave,
        setLoadingSave,
    } = snapshotSaveStore();

    /**
     * 스냅샷 저장
     * 목록 갱신 로직(onSaveSuccess) 제거. 저장 책임만 가짐.
     */
    const handleSaveSnapshot = async (title) => { // onSaveSuccess 인수 제거
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
        if(code.length > MAX_CONTENT_LENGTH){
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


            return true; // 저장 성공
        } catch (error) {
            console.error("스냅샷 저장 에러:", error);
            toast.error("저장에 실패했습니다.");
            return false; // 저장 실패
        } finally {
            setLoadingSave(false);
        }
    };

    return {
        loadingSave,
        handleSaveSnapshot,
    };
};