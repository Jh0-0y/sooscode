import { useEffect, useState } from "react";
import SnapshotList from "./SnapshotList";
import SnapshotRestoreModal from "./SnapshotRestoreModal";
import { useSnapshotList } from "@/features/classroom/hooks/snapshot/useSnapshotList.js";
import styles from "./SnapshotPanel.module.css";
import SnapshotSaveFeature from "@/features/classroom/components/snapshot/SnapshotSaveFeature.jsx";

const SnapshotPanel = () => {
    // 훅 변경: useSnapshotList 사용
    const {
        snapshots,
        loading,
        page,
        totalPages,
        fetchSnapshots,
        handlePageChange,
        handleRestoreSnapshot,
    } = useSnapshotList();

    const [restoreTarget, setRestoreTarget] = useState(null);

    // 초기 데이터 로딩
    useEffect(() => {
        fetchSnapshots(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 키보드 방향키 페이지 이동
    useEffect(() => {

        if (restoreTarget) return;

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
    }, [page, handlePageChange, restoreTarget]);


    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <SnapshotSaveFeature />
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