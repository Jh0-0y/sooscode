import { useState } from "react";
import SnapshotSaveButton from "@/features/classroom/components/snapshot/SnapshotSaveButton.jsx";
import SnapshotModal from "@/features/classroom/components/snapshot/SnapshotModal.jsx";
import { useSnapshotSave } from "@/features/classroom/hooks/snapshot/useSnapshotSave.js";
import { useSnapshotList } from "@/features/classroom/hooks/snapshot/useSnapshotList.js";

/**
 * 스냅샷 저장 버튼과 모달을 포함하여 완전하게 독립된 저장 기능을 제공하는 컴포넌트
 */
const SnapshotSaveFeature = () => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // 저장 로직 훅
    const { loadingSave, handleSaveSnapshot } = useSnapshotSave();

    // 목록 갱신을 위한 훅
    const { fetchSnapshots } = useSnapshotList();

    const handleOpenModal = () => {
        setIsSaveModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsSaveModalOpen(false);
    };

    const handleSaveConfirm = async (title) => {
        const success = await handleSaveSnapshot(title);

        if (success) {

            setTimeout(() => {
                handleCloseModal();

                fetchSnapshots(0);
            }, 0);
        }
    };

    return (
        <>
            {/* 저장 버튼: 클릭 시 모달 열기 */}
            <SnapshotSaveButton
                loading={loadingSave}
                onClick={handleOpenModal}
            />

            {/* 저장 모달 */}
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