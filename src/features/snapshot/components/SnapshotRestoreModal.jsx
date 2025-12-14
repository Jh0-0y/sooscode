import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/SnapshotModal.module.css";

const SnapshotRestoreModal = ({ isOpen, onClose, onConfirm, snapshotTitle, snapshotCode }) => {
    // 키보드 이벤트 리스너 등록
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onConfirm, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>스냅샷</h3>

                <div className={styles.messageArea}>
                    <p><strong>'{snapshotTitle}'</strong> 코드를 불러오시겠습니까?</p>
                    <p className={styles.warningText}>
                        현재 작성 중인 코드가 모두 덮어씌워집니다.
                    </p>
                </div>

                <div className={styles.previewContainer}>
                    <span className={styles.previewLabel}>code</span>
                    <pre className={styles.codeBlock}>
                        {snapshotCode}
                    </pre>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        취소
                    </button>

                    <button className={styles.saveButton} onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SnapshotRestoreModal;