import { useState } from "react";
import SnapshotSaveButton from "@/features/classroom/components/snapshot/SnapshotSaveButton.jsx";
import SnapshotModal from "@/features/classroom/components/snapshot/SnapshotModal.jsx";
import { useSnapshotSaveAndReload } from "@/features/classroom/hooks/snapshot/useSnapshotSaveAndReload.js";

/**
 * 스냅샷 저장 기능 조합 컴포넌트
 * 역할:
 * - "현재 코드 스냅샷 저장" 버튼과 저장 모달을 하나의 기능 단위
 * - 저장 트리거 → 제목 입력 → 저장 실행 → 성공 시 UI 종료 흐름을 담당
 *
 * @param {string} code - 저장할 코드 (부모 컴포넌트에서 전달)
 */
const SnapshotSaveFeature = ({ code }) => {
    /**
     * 스냅샷 저장 모달 열림 상태
     */
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    /**
     * 스냅샷 저장 + 목록 갱신을 수행하는 전용 훅
     * - loadingSave: 저장 진행 상태
     * - saveAndReload: 저장 성공 시 목록 자동 갱신
     */
    const { loadingSave, saveAndReload } = useSnapshotSaveAndReload(code);

    // 모달 오픈
    const handleOpenModal = () => {
        setIsSaveModalOpen(true);
    };

    // 모달 클로즈
    const handleCloseModal = () => {
        setIsSaveModalOpen(false);
    };

    /**
     * 저장 확인 처리
     * 동작:
     * - 제목을 전달받아 스냅샷 저장 실행
     * - 저장이 성공한 경우에만 모달을 닫는다
     */
    const handleSaveConfirm = async (title) => {
        const success = await saveAndReload(title);

        if (success) {
            handleCloseModal();
        }
    };

    return (
        <>
            <SnapshotSaveButton
                loading={loadingSave}
                onClick={handleOpenModal}
            />

            <SnapshotModal
                isOpen={isSaveModalOpen}
                isLoading={loadingSave}
                onClose={handleCloseModal}
                onConfirm={handleSaveConfirm}
            />
        </>
    );
};

export default SnapshotSaveFeature;