import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./SnapshotModal.module.css";

const SnapshotDeleteModal = ({ isOpen, onClose, onConfirm, snapshotTitle }) => {

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') onConfirm();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onConfirm, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={`${styles.title} ${styles.dangerTitle}`}>
                    스냅샷 삭제
                </h3>

                <div className={styles.messageArea}>
                    <p><strong>'{snapshotTitle}'</strong>을(를) 삭제하시겠습니까?</p>
                    <p className={styles.warningText}>
                        삭제된 스냅샷은 복구할 수 없습니다.
                    </p>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={onConfirm}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SnapshotDeleteModal;