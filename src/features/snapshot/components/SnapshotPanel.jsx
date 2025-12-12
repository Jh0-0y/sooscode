import { useEffect, useRef, useState } from "react";
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
        hasMore,
        fetchSnapshots,
        handleSaveSnapshot,
        handleRestoreSnapshot,
    } = useSnapshot();

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [restoreTarget, setRestoreTarget] = useState(null);

    const observerRef = useRef(null);

    // 초기 데이터 로딩
    useEffect(() => {
        fetchSnapshots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 무한 스크롤 Observer
    useEffect(() => {
        const node = observerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting && !loading && hasMore) {
                    fetchSnapshots();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [loading, hasMore, fetchSnapshots]);

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

            <SnapshotList
                snapshots={snapshots}
                onSelect={setRestoreTarget}
                observerRef={observerRef}
            />

            <SnapshotModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={onSaveConfirm}
            />

            <SnapshotRestoreModal
                isOpen={!!restoreTarget}
                snapshotTitle={restoreTarget?.title ?? ""}
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