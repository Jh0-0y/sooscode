import { useEffect, useState } from "react";
import SnapshotList from "./SnapshotList";
import SnapshotModal from "./SnapshotModal";
import SnapshotRestoreModal from "./SnapshotRestoreModal";
import SnapshotSaveButton from "./SnapshotSaveButton";
import { useSnapshot } from "@/features/snapshot/hooks/useSnapshot";
import styles from "../styles/SnapshotPanel.module.css";

const SnapshotPanel = () => {
    const {
        snapshots,
        loading,
        loadingSave,
        page,
        totalPages,
        fetchSnapshots,
        handlePageChange,
        handleSaveSnapshot,
        handleRestoreSnapshot,
    } = useSnapshot();

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [restoreTarget, setRestoreTarget] = useState(null);

    // 초기 데이터 로딩
    useEffect(() => {
        fetchSnapshots(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 키보드 방향키 페이지 이동
    useEffect(() => {
        // 저장 모달이나 복원 모달이 열려있을 때는 키보드 이벤트 무시
        if (isSaveModalOpen || restoreTarget) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePageChange(page - 1);
            }
            if (e.key === 'ArrowRight') {
                handlePageChange(page + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page, handlePageChange, isSaveModalOpen, restoreTarget]);

    const onSaveConfirm = async (title) => {
        const success = await handleSaveSnapshot(title);
        if (success) setIsSaveModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <SnapshotSaveButton
                    loading={loadingSave}
                    onClick={() => setIsSaveModalOpen(true)}
                />
            </div>

            <div className={styles.listArea}>
                <SnapshotList
                    snapshots={snapshots}
                    onSelect={setRestoreTarget}
                />

                {!loading && snapshots.length === 0 && (
                    <div className={styles.emptyMessage}>저장된 스냅샷이 없습니다.</div>
                )}
            </div>

            <div className={styles.pagination}>
                <button
                    className={styles.pageBtn}
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                    title="이전 페이지 (키보드 ←)"
                >
                    ‹
                </button>
                <span className={styles.pageInfo}>
                    {totalPages === 0 ? 0 : page + 1} / {totalPages}
                </span>
                <button
                    className={styles.pageBtn}
                    disabled={page >= totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                    title="다음 페이지 (키보드 →)"
                >
                    ›
                </button>
            </div>

            <SnapshotModal
                isOpen={isSaveModalOpen}
                isLoading={loadingSave}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={onSaveConfirm}
            />

            <SnapshotRestoreModal
                isOpen={!!restoreTarget}
                snapshotTitle={restoreTarget?.title ?? ""}
                snapshotCode={restoreTarget?.content ?? ""}
                onClose={() => setRestoreTarget(null)}
                onConfirm={() => {
                    handleRestoreSnapshot(restoreTarget);
                    setRestoreTarget(null);
                }}
            />
        </div>
    );
};

export default SnapshotPanel;